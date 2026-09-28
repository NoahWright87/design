"""Build Wright Sans font files from the traced specimen sheets.

Stage 2 of the pipeline (run trace.py first).

Usage (from the repo root):
    python3 scripts/wright-sans/build.py [weight ...]

Reads the glyph SVGs in scripts/wright-sans/glyphs/<weight>/ and writes
.otf + .woff2 files to src/styles/fonts/.
"""
import math
import sys
from pathlib import Path

import numpy as np
from fontTools.agl import UV2AGL
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from shapely.geometry import LineString

from glyphsvg import GLYPH_DIR, load_glyph, read_metrics
from trace import bounds, transform

FAMILY = "Wright Sans"
VERSION = "1.000"
UPM = 1000
CAP = 700

WEIGHTS = {
    # file stem: (style name, usWeightClass, straight side bearing, space width)
    "regular": ("Regular", 400, 42, 230),
    "semibold": ("SemiBold", 600, 41, 235),
    "bold": ("Bold", 700, 40, 240),
    "black": ("Black", 900, 38, 245),
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


def signed_area(contour):
    """Shoelace area over on-curve + control points (good enough for sign)."""
    pts = [p for s in contour for p in s[1:]]
    return sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1])) / 2


def rotate180(contours):
    x0, y0, x1, y1 = ubounds(contours)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return transform(contours, lambda p: (2 * cx - p[0], 2 * cy - p[1]))


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
def build_weight(stem):
    style, wclass, base_sb, space_w = WEIGHTS[stem]
    metrics = read_metrics(stem)
    xh, asc, desc = metrics["xh"], metrics["asc"], metrics["desc"]

    # every traced outline comes from its (possibly hand-edited) SVG
    glyphs, marks = {}, {}
    for path in sorted((GLYPH_DIR / stem).glob("*.svg")):
        g = load_glyph(stem, path.stem)
        if g["char"]:
            glyphs[g["char"]] = g["contours"]
        else:
            name, case = path.stem.split(".")
            marks[(name, case)] = g["contours"]

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

    # --- figures: the default digits keep their own spacing (proportional),
    # which suits display sizes where equal-width slots leave a "1" looking
    # gappy. Equal-width (tabular) copies ship as <name>.tf glyphs behind the
    # OpenType `tnum` feature for tables, timers and counters.
    digits = "0123456789"
    tab = max(ubounds(final[d][0])[2] - ubounds(final[d][0])[0] for d in digits) + 2 * base_sb
    tab = round(tab)
    extras = {}  # glyph name -> (contours, advance); glyphs reached only via features
    for d in digits:
        c = final[d][0]
        x0, _, x1, _ = ubounds(c)
        extras[glyph_name(d) + ".tf"] = (shift(c, (tab - (x1 - x0)) / 2 - x0), tab)
        # WHY: profile-based bearings tuck digits in around flags and bowls,
        # which lets runs like "1111" touch; figures get plain, even bearings.
        add(d, glyphs[d], sb=(base_sb, base_sb))
    metrics["tabular"] = tab

    # --- derived glyphs
    def copy(dst, src):
        final[dst] = final[src]

    copy("’", "'")
    copy("”", '"')
    period = final["."][0]
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

    return final, extras, metrics, style, wclass


# ------------------------------------------------------------- kerning
KERN_LEFT = "AFKLPRTVWXYkrvwxyfo'\"’”.,"
KERN_RIGHT = "AJTVWXYacdegoqsuvwxyO'\"’”.,-"
# Pairs checked for collisions: overhanging arms (f, T, F) and diagonals can
# otherwise meet their neighbour, e.g. the two f's in "Officer".
COLLIDE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
# Closest approach between two glyphs, as a share of the target gap. Edges that
# face each other flat (bar to bar, stem to stem) need nearly the full gap or
# they read as one shape; diagonals meeting at a point can come closer.
MIN_GAP_POINT = 0.6
MIN_GAP_FLAT = 0.9
FLAT_ROWS = 4  # scanlines (10 units each) within 5 units of the closest approach


def kerning(final, base_sb):
    prof = {}
    for ch in set(KERN_LEFT + KERN_RIGHT + COLLIDE):
        c, w = final[ch]
        prof[ch] = ({round(r[0]): r for r in profile(c, -250, 850, step=10)}, w)
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

    # collision floor: push apart any pair that comes closer than its minimum gap
    for a in COLLIDE:
        pa, wa = prof[a]
        for b in COLLIDE:
            pb, _ = prof[b]
            dists = [wa - ra[2] + pb[y][1] for y, ra in pa.items()
                     if ra[2] is not None and pb.get(y) is not None and pb[y][1] is not None]
            if not dists:
                continue
            closest = min(dists)
            flat = sum(1 for d in dists if d <= closest + 5) >= FLAT_ROWS
            floor = (MIN_GAP_FLAT if flat else MIN_GAP_POINT) * target
            k = round((floor - closest - pairs.get((a, b), 0)) / 5) * 5
            if k >= 5:
                pairs[(a, b)] = pairs.get((a, b), 0) + k
    return pairs


# ------------------------------------------------------------- output
def glyph_name(ch):
    uv = ord(ch)
    return UV2AGL.get(uv, f"uni{uv:04X}")


def write_font(final, extras, metrics, style, wclass, out_dir, pairs):
    by_name = {glyph_name(c): v for c, v in final.items()}
    by_name.update(extras)
    order = [".notdef"] + sorted(by_name, key=lambda n: (n != "space", n))
    cmap = {ord(c): glyph_name(c) for c in final}
    fb = FontBuilder(UPM, isTTF=False)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    charstrings, widths = {}, {}

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
    fea = "languagesystem DFLT dflt;\nlanguagesystem latn dflt;\n"
    tabular = sorted(n for n in extras if n.endswith(".tf"))
    if tabular:
        fea += "feature tnum {\n"
        for n in tabular:
            fea += f"  sub {n[:-3]} by {n};\n"
        fea += "} tnum;\n"
    if pairs:
        fea += "feature kern {\n"
        for (a, b), k in sorted(pairs.items()):
            fea += f"  pos {glyph_name(a)} {glyph_name(b)} {k};\n"
        fea += "} kern;\n"
    if tabular or pairs:
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
    out = HERE.parent.parent / "src" / "styles" / "fonts"
    only = sys.argv[1:] or list(WEIGHTS)
    for stem in only:
        final, extras, metrics, style, wclass = build_weight(stem)
        pairs = kerning(final, WEIGHTS[stem][2])
        path = write_font(final, extras, metrics, style, wclass, out, pairs)
        print(f"{path.name}: {len(final) + len(extras)} glyphs, {len(pairs)} kern pairs, metrics {metrics}")


if __name__ == "__main__":
    main()
