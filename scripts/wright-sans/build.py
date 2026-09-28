"""Build Wright Sans font files from the traced specimen sheets.

Usage (from the repo root):
    python3 scripts/wright-sans/build.py [weight ...]

Reads scripts/wright-sans/specimens/<weight>.png and writes .otf + .woff2
files to src/styles/fonts/.
"""
import math
import sys
from pathlib import Path

import numpy as np
from fontTools.agl import UV2AGL
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from shapely.geometry import LineString, Polygon, box

from extract import load_sheet
from trace import bounds, clean, signed_area, snap, trace_bitmap, transform

FAMILY = "Wright Sans"
VERSION = "1.000"
UPM = 1000
CAP = 700

WEIGHTS = {
    # file stem: (style name, usWeightClass, straight side bearing, space width)
    "regular": ("Regular", 400, 34, 230),
    "semibold": ("SemiBold", 600, 33, 235),
    "bold": ("Bold", 700, 32, 240),
    "black": ("Black", 900, 30, 245),
}


# ---------------------------------------------------------------- geometry
def sample(contour, steps=12):
    pts = []
    cur = contour[0][1]
    for s in contour[1:]:
        if s[0] == "L":
            pts.append(s[1])
        else:
            c1, c2, p = s[1], s[2], s[3]
            for i in range(1, steps + 1):
                t = i / steps
                mt = 1 - t
                pts.append((
                    mt ** 3 * cur[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * p[0],
                    mt ** 3 * cur[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * p[1],
                ))
        cur = s[-1]
    return pts


def ubounds(contours):
    return bounds(contours) if contours else (0, 0, 0, 0)


def shift(contours, dx=0, dy=0):
    return transform(contours, lambda p: (p[0] + dx, p[1] + dy))


def scale_about(contours, sx, sy, cx=0, cy=0):
    return transform(contours, lambda p: (cx + (p[0] - cx) * sx, cy + (p[1] - cy) * sy))


def reverse(contour):
    """Reverse the direction of one contour."""
    start = contour[0][1]
    segs = contour[1:]
    pts = [start] + [s[-1] for s in segs]
    out = [("M", pts[-1])]
    for i in range(len(segs) - 1, -1, -1):
        s = segs[i]
        prev = pts[i]
        if s[0] == "L":
            out.append(("L", prev))
        else:
            out.append(("C", s[2], s[1], prev))
    return out


def point_in_poly(pt, poly):
    x, y = pt
    inside = False
    for (x0, y0), (x1, y1) in zip(poly, poly[1:] + poly[:1]):
        if (y0 > y) != (y1 > y):
            if x < x0 + (y - y0) * (x1 - x0) / (y1 - y0):
                inside = not inside
    return inside


def fix_direction(contours):
    """Outer contours counter-clockwise, counters clockwise (y-up, PostScript)."""
    polys = [sample(c, 6) for c in contours]
    out = []
    for i, c in enumerate(contours):
        depth = sum(1 for j, p in enumerate(polys) if j != i and point_in_poly(polys[i][0], p))
        want_ccw = depth % 2 == 0
        is_ccw = signed_area(c) > 0
        out.append(c if is_ccw == want_ccw else reverse(c))
    return out


def rotate180(contours):
    x0, y0, x1, y1 = ubounds(contours)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return transform(contours, lambda p: (2 * cx - p[0], 2 * cy - p[1]))


def contours_to_shape(contours):
    """Contours -> shapely geometry using even-odd nesting."""
    shape = None
    for c in contours:
        p = Polygon(sample(c, 16)).buffer(0)
        shape = p if shape is None else shape.symmetric_difference(p)
    return shape


def polygon_contours(geom):
    """shapely polygon -> contours (lines only)."""
    polys = [geom] if geom.geom_type == "Polygon" else [g for g in geom.geoms if g.geom_type == "Polygon"]
    out = []
    for poly in polys:
        for ring in [poly.exterior] + list(poly.interiors):
            pts = list(ring.coords)[:-1]
            out.append([("M", pts[0])] + [("L", p) for p in pts[1:]] + [("L", pts[0])])
    return out


# ------------------------------------------------------------- profiles
def profile(contours, y0, y1, step=5):
    """Leftmost and rightmost ink x for scanlines between y0 and y1."""
    polys = [sample(c, 10) for c in contours]
    rows = []
    for y in np.arange(y0 + step / 2, y1, step):
        xs = []
        for poly in polys:
            for (ax, ay), (bx, by) in zip(poly, poly[1:] + poly[:1]):
                if (ay > y) != (by > y):
                    xs.append(ax + (y - ay) * (bx - ax) / (by - ay))
        rows.append((y, min(xs), max(xs)) if xs else (y, None, None))
    return rows


def side_bearings(contours, zone, base):
    """Return (left, right, zone_left, zone_right): bearings are measured from
    the ink extremes inside the zone so hooks and tails can hang outside."""
    y0, y1 = zone
    rows = [r for r in profile(contours, y0, y1) if r[1] is not None]
    if not rows:
        x0, _, x1, _ = ubounds(contours)
        return base, base, x0, x1
    x0 = min(r[1] for r in rows)
    x1 = max(r[2] for r in rows)
    clamp = 0.16 * (y1 - y0)
    dl = np.mean([min(r[1] - x0, clamp) for r in rows])
    dr = np.mean([min(x1 - r[2], clamp) for r in rows])
    k = 0.55
    return max(base - k * dl, 4), max(base - k * dr, 4), x0, x1


# ------------------------------------------------------------- tracing
def trace_row(sheet, row, chars):
    return {ch: trace_bitmap(sheet[(row, ch)]["img"]) for ch in chars}


def to_units(contours, baseline, scale, x_origin=0):
    return clean(transform(contours, lambda p: ((p[0] - x_origin) * scale, (baseline - p[1]) * scale)))


def split_letter(contours):
    """Split an accented letter's contours into (letter, above, below)."""
    big = max(contours, key=lambda c: (lambda b: (b[2] - b[0]) * (b[3] - b[1]))(ubounds([c])))
    lx0, ltop, lx1, lbot = ubounds([big])
    letter, above, below = [], [], []
    for c in contours:
        b = ubounds([c])
        if b[3] < ltop + 1:
            above.append(c)
        elif b[1] > lbot - 1.5 and c is not big:
            below.append(c)
        else:
            letter.append(c)
    return letter, above, below


def build_weight(src_dir, stem):
    style, wclass, base_sb, space_w = WEIGHTS[stem]
    sheet = load_sheet(Path(src_dir) / f"{stem}.png")
    ROWS = dict([
        ("caps", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
        ("lower", "abcdefghijklmnopqrstuvwxyz"),
        ("digits", "0123456789"),
        ("punct", ".,:;!?@#&%+-/\\()[]{}'\"_=*$"),
        ("acccaps", "ÈÉÑÖÇ"),
        ("acclower", "èéñöçì"),
    ])
    traced = {row: trace_row(sheet, row, chars) for row, chars in ROWS.items()}

    # --- vertical calibration
    _, top, _, bot = ubounds(traced["caps"]["H"])
    scale = CAP / (bot - top)
    caps_base = bot
    _, _, _, lower_base = ubounds(traced["lower"]["x"])
    _, xt, _, _ = ubounds(traced["lower"]["x"])
    xh = round((lower_base - xt) * scale)
    _, at, _, _ = ubounds(traced["lower"]["l"])
    asc = round((lower_base - at) * scale)
    _, d1t, _, d1b = ubounds(traced["digits"]["1"])
    _, _, _, pbase = ubounds(traced["punct"]["."])
    _, et, _, eb = ubounds(traced["punct"]["!"])
    pscale = CAP / (eb - et)

    metrics = {"xh": xh, "asc": asc}
    glyphs = {}  # char -> contours in units (x from 0 at ink left)

    def place(contours, snaps, tol=12):
        x0 = ubounds(contours)[0]
        c = shift(contours, -x0, 0)
        return snap(c, snaps, tol)

    for ch, c in traced["caps"].items():
        glyphs[ch] = place(to_units(c, caps_base, scale), [0, CAP])
    desc = None
    for ch, c in traced["lower"].items():
        glyphs[ch] = place(to_units(c, lower_base, scale), [0, xh, asc])
    desc = round(min(ubounds(glyphs[ch])[1] for ch in "gpqy"))
    metrics["desc"] = desc
    for ch in "gjpqy":
        glyphs[ch] = snap(glyphs[ch], [desc], 12)
    dscale = CAP / (d1b - d1t)
    for ch, c in traced["digits"].items():
        glyphs[ch] = place(to_units(c, d1b, dscale), [0, CAP])
    for ch, c in traced["punct"].items():
        glyphs[ch] = place(to_units(c, pbase, pscale), [0, CAP])

    # --- accent marks, centred on x = 0
    marks = {}
    for row, target, refs in (("acccaps", CAP, "ÈÉÑÖÇ"), ("acclower", xh, "èéñöçì")):
        letter, _, _ = split_letter(traced[row][refs[0]])
        _, lt, _, lb = ubounds(letter)
        s = target / (lb - lt)
        case = "cap" if row == "acccaps" else "lc"
        for ch, name in zip(refs, ["grave", "acute", "tilde", "dieresis", "cedilla", "dotless"]):
            letter, above, below = split_letter(traced[row][ch])
            lx0, _, lx1, lbot = ubounds(letter)
            cx = (lx0 + lx1) / 2
            if name == "dotless":
                glyphs["ı"] = place(to_units(letter, lbot, s), [0, xh])
                continue
            if name == "cedilla":
                # the cedilla is usually joined to the letter: cut away
                # everything above the row's baseline (lb), keeping a sliver
                # of overlap so the composite reads as one shape
                shape = contours_to_shape(traced[row][ch])
                cut = box(-1000, lb - 0.15, 1000, 1000)
                part = polygon_contours(shape.intersection(cut).simplify(0.03))
                marks[(name, case)] = to_units(part, lb, s, cx)
            else:
                marks[(name, case)] = to_units(above, lb, s, cx)

    # --- en dash from the title line
    title = sheet["title"]
    tt = [trace_bitmap(g["img"]) for g in title]
    tb = [ubounds(c) for c in tt]
    tall = max(b[3] - b[1] for b in tb)
    dash_i = min(range(len(tt)), key=lambda i: (tb[i][3] - tb[i][1]) / max(tb[i][2] - tb[i][0], 1))
    tbase = float(np.median([b[3] for b in tb]))
    # W is the tallest cap-height letter without a descender
    capb = [b for b in tb if abs(b[3] - tbase) < 1.5]
    tcap = max(b[3] - b[1] for b in capb)
    tscale = CAP / tcap
    glyphs["–"] = place(to_units(tt[dash_i], tbase, tscale), [])

    # --- side bearings for traced glyphs
    def zone_for(ch):
        if ch.islower() or ch in "ı":
            return (0, xh)
        return (0, CAP)

    final = {}  # char -> (contours, advance)

    def add(ch, contours, zone=None, sb=None):
        contours = fix_direction(contours)
        if sb is None:
            l, r, x0, x1 = side_bearings(contours, zone or zone_for(ch), base_sb)
        else:
            l, r = sb
            x0, _, x1, _ = ubounds(contours)
        final[ch] = (shift(contours, l - x0), round(l + (x1 - x0) + r))

    for ch, c in glyphs.items():
        add(ch, c)
    # punctuation with little vertical extent gets plain spacing
    for ch in ".,:;-_'\"–()[]{}/\\":
        add(ch, glyphs[ch], sb=(base_sb * 1.1, base_sb * 1.1))

    # --- derived glyphs
    def copy(dst, src):
        final[dst] = final[src]

    copy("’", "'")
    copy("”", '"')
    period = final["."][0]
    pw = final["."][1]
    qr_c, qr_w = final["'"]
    final["‘"] = (rotate180(qr_c), qr_w)
    final["“"] = (rotate180(final['"'][0]), final['"'][1])
    final["‚"] = (shift(final[","][0]), final[","][1])
    en_c, en_w = final["–"]
    ex0, _, ex1, _ = ubounds(en_c)
    em = scale_about(en_c, 1.9, 1, (ex0 + ex1) / 2)
    add("—", em, sb=(base_sb * 0.8, base_sb * 0.8))
    pdx = ubounds(period)[2] - ubounds(period)[0]
    gap = pdx * 0.9
    ell = period + shift(period, pdx + gap) + shift(period, 2 * (pdx + gap))
    add("…", ell, sb=(base_sb, base_sb))
    pyc = (ubounds(period)[1] + ubounds(period)[3]) / 2
    add("·", shift(period, 0, xh / 2 - pyc), sb=(base_sb, base_sb))
    add("¡", rotate180(glyphs["!"]))
    final["¡"] = (shift(final["¡"][0], 0, -ubounds(final["¡"][0])[1] + ubounds(glyphs["p"])[1] * 0.0 + (xh - CAP)), final["¡"][1])
    add("¿", shift(rotate180(glyphs["?"]), 0, xh - CAP))

    # stroke-built glyphs use the hyphen's thickness
    hy = ubounds(glyphs["-"])
    stroke = hy[3] - hy[1]
    stem = ubounds(glyphs["l"])[2] - ubounds(glyphs["l"])[0]

    def strokes(lines, sb=None, zone=(0, CAP)):
        geom = None
        for ln in lines:
            g = LineString(ln).buffer(stroke / 2, cap_style="flat", join_style="mitre", mitre_limit=4)
            geom = g if geom is None else geom.union(g)
        return polygon_contours(geom.simplify(0.5))

    mid = (hy[1] + hy[3]) / 2
    ah = 520 if stem else 520
    lt_w = 0.62 * ah
    add("<", strokes([[(lt_w, mid + ah / 2 * 0.62), (0, mid), (lt_w, mid - ah / 2 * 0.62)]]))
    add(">", strokes([[(0, mid + ah / 2 * 0.62), (lt_w, mid), (0, mid - ah / 2 * 0.62)]]))
    add("^", strokes([[(0, CAP * 0.55), (0.25 * CAP, CAP), (0.5 * CAP, CAP * 0.55)]]))
    bar = polygon_contours(LineString([(stem / 2, desc), (stem / 2, asc)]).buffer(stem / 2, cap_style="flat"))
    add("|", bar, sb=(base_sb * 1.6, base_sb * 1.6))

    # spacing marks
    for name, ch, case in (("grave", "`", "lc"), ("acute", "´", "lc"), ("dieresis", "¨", "lc")):
        add(ch, marks[(name, case)], sb=(base_sb, base_sb))
    tl = marks[("tilde", "lc")]
    tb_ = ubounds(tl)
    add("~", scale_about(shift(tl, 0, mid - (tb_[1] + tb_[3]) / 2), 1.25, 1.25, 0, mid), sb=(base_sb, base_sb))

    # --- composites
    def compose(dst, base, name, case):
        bc, bw = final[base]
        m = marks[(name, case)]
        x0, _, x1, _ = ubounds(bc)
        cx = (x0 + x1) / 2
        final[dst] = (bc + shift(m, cx), bw)

    table = {
        "grave": {"A": "À", "E": "È", "I": "Ì", "O": "Ò", "U": "Ù", "a": "à", "e": "è", "ı": "ì", "o": "ò", "u": "ù"},
        "acute": {"A": "Á", "E": "É", "I": "Í", "O": "Ó", "U": "Ú", "Y": "Ý", "a": "á", "e": "é", "ı": "í", "o": "ó", "u": "ú", "y": "ý"},
        "tilde": {"A": "Ã", "N": "Ñ", "O": "Õ", "a": "ã", "n": "ñ", "o": "õ"},
        "dieresis": {"A": "Ä", "E": "Ë", "I": "Ï", "O": "Ö", "U": "Ü", "Y": "Ÿ", "a": "ä", "e": "ë", "ı": "ï", "o": "ö", "u": "ü", "y": "ÿ"},
        "cedilla": {"C": "Ç", "c": "ç"},
    }
    for name, pairs in table.items():
        for base, dst in pairs.items():
            case = "lc" if base.islower() or base == "ı" else "cap"
            compose(dst, base, name, case)

    final[" "] = ([], space_w)
    final[" "] = ([], space_w)

    return final, metrics, style, wclass


# ------------------------------------------------------------- kerning
KERN_LEFT = "AFKLPRTVWXYkrvwxyfo'\"’”.,"
KERN_RIGHT = "AJTVWXYacdegoqsuvwxyO'\"’”.,-"


def kerning(final, base_sb):
    prof = {}
    for ch in set(KERN_LEFT + KERN_RIGHT):
        c, w = final[ch]
        prof[ch] = ({round(r[0]): r for r in profile(c, -100, 800, step=10)}, w)
    pairs = {}
    target = 2 * base_sb * 0.95
    for a in KERN_LEFT:
        pa, wa = prof[a]
        for b in KERN_RIGHT:
            pb, _ = prof[b]
            dists = []
            for y, ra in pa.items():
                rb = pb.get(y)
                if ra[2] is None or rb is None or rb[1] is None:
                    continue
                dists.append(wa - ra[2] + rb[1])
            if not dists:
                continue
            k = target - min(dists)
            k = max(k, -0.13 * UPM)
            k = round(k / 5) * 5
            if k <= -15:
                pairs[(a, b)] = k
    return pairs


# ------------------------------------------------------------- output
def glyph_name(ch):
    uv = ord(ch)
    return UV2AGL.get(uv, f"uni{uv:04X}")


def write_font(final, metrics, style, wclass, out_dir, pairs):
    order = [".notdef"] + sorted({glyph_name(c) for c in final}, key=lambda n: (n != "space", n))
    cmap = {ord(c): glyph_name(c) for c in final}
    fb = FontBuilder(UPM, isTTF=False)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    charstrings, widths = {}, {}
    by_name = {glyph_name(c): v for c, v in final.items()}

    pen = T2CharStringPen(500, None)
    pen.moveTo((50, 0)); pen.lineTo((450, 0)); pen.lineTo((450, CAP)); pen.lineTo((50, CAP)); pen.closePath()
    pen.moveTo((100, 50)); pen.lineTo((100, CAP - 50)); pen.lineTo((400, CAP - 50)); pen.lineTo((400, 50)); pen.closePath()
    charstrings[".notdef"] = pen.getCharString()
    widths[".notdef"] = 500

    ymax, ymin = 0, 0
    for name, (contours, adv) in by_name.items():
        pen = T2CharStringPen(adv, None)
        for c in contours:
            r = lambda p: (round(p[0]), round(p[1]))
            pen.moveTo(r(c[0][1]))
            for s in c[1:-1] if c[-1][0] == "L" and r(c[-1][-1]) == r(c[0][1]) else c[1:]:
                if s[0] == "L":
                    pen.lineTo(r(s[1]))
                else:
                    pen.curveTo(r(s[1]), r(s[2]), r(s[3]))
            pen.closePath()
            b = ubounds([c])
            ymax, ymin = max(ymax, b[3]), min(ymin, b[1])
        charstrings[name] = pen.getCharString()
        widths[name] = adv

    ps_name = f"WrightSans-{style}"
    fb.setupCFF(ps_name, {"FullName": f"{FAMILY} {style}"}, charstrings, {})
    lsb = {}
    for name, cs in charstrings.items():
        b = cs.calcBounds(None)
        lsb[name] = round(b[0]) if b else 0
    fb.setupHorizontalMetrics({n: (widths[n], lsb[n]) for n in order})
    ascender, descender = 900, -250
    fb.setupHorizontalHeader(ascent=ascender, descent=descender)
    fb.setupNameTable({
        "familyName": FAMILY if style in ("Regular", "Bold") else f"{FAMILY} {style}",
        "styleName": style if style in ("Regular", "Bold") else "Regular",
        "typographicFamily": FAMILY,
        "typographicSubfamily": style,
        "uniqueFontIdentifier": f"{ps_name};{VERSION}",
        "fullName": f"{FAMILY} {style}",
        "psName": ps_name,
        "version": f"Version {VERSION}",
        "copyright": "Copyright (c) Noah Wright",
        "licenseDescription": "MIT License",
    })
    fb.setupOS2(
        usWeightClass=wclass,
        sTypoAscender=ascender, sTypoDescender=descender, sTypoLineGap=0,
        usWinAscent=max(ascender, math.ceil(ymax)), usWinDescent=max(-descender, math.ceil(-ymin)),
        sxHeight=metrics["xh"], sCapHeight=CAP,
        fsSelection=(1 << 7) | ((1 << 5) if style == "Bold" else (1 << 6) if style == "Regular" else 0),
        achVendID="NWRT",
        version=4,
    )
    fb.setupPost()
    if pairs:
        fea = "languagesystem DFLT dflt;\nlanguagesystem latn dflt;\nfeature kern {\n"
        for (a, b), k in sorted(pairs.items()):
            fea += f"  pos {glyph_name(a)} {glyph_name(b)} {k};\n"
        fea += "} kern;\n"
        addOpenTypeFeaturesFromString(fb.font, fea)
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    stem = f"WrightSans-{style}"
    fb.font.save(out_dir / f"{stem}.otf")
    fb.font.flavor = "woff2"
    fb.font.save(out_dir / f"{stem}.woff2")
    return out_dir / f"{stem}.otf"


HERE = Path(__file__).resolve().parent


def main():
    src = HERE / "specimens"
    out = HERE.parent.parent / "src" / "styles" / "fonts"
    only = sys.argv[1:] or list(WEIGHTS)
    for stem in only:
        final, metrics, style, wclass = build_weight(src, stem)
        pairs = kerning(final, WEIGHTS[stem][2])
        path = write_font(final, metrics, style, wclass, out, pairs)
        print(f"{path.name}: {len(final)} glyphs, {len(pairs)} kern pairs, metrics {metrics}")


if __name__ == "__main__":
    main()
