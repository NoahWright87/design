"""Stage 1: trace the specimen sheets into per-glyph SVG files.

Usage (from the repo root):
    python3 scripts/wright-sans/trace.py [weight ...] [--glyph NAME ...] [--force]

Writes scripts/wright-sans/glyphs/<weight>/<name>.svg plus metrics.json and
reference bitmaps in _source/ (used by inspect_glyphs.py --source). Glyphs
whose SVG is marked data-status="edited" are left untouched unless --force.
"""
import argparse
from pathlib import Path

import numpy as np
import potrace
from PIL import Image, PngImagePlugin
from scipy import ndimage
from shapely.geometry import Polygon, box

from extract import load_sheet
from fit import node_count, refit
from glyphsvg import GLYPH_DIR, glyph_file_name, glyph_status, write_glyph, write_metrics
from lint_glyphs import autofix, metric_heights

HERE = Path(__file__).resolve().parent
UPSAMPLE = 8
CAP = 700
WEIGHTS = ["regular", "semibold", "bold", "black"]

ROWS = {
    "caps": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "lower": "abcdefghijklmnopqrstuvwxyz",
    "digits": "0123456789",
    "punct": ".,:;!?@#&%+-/\\()[]{}'\"_=*$",
    "acccaps": "ÈÉÑÖÇ",
    "acclower": "èéñöçì",
}


# ------------------------------------------------------------- bitmap tracing
def trace_bitmap(img):
    """img: float array, 0 = ink, 1 = paper. Returns contours in source-pixel
    coordinates (x right, y down)."""
    f = UPSAMPLE
    pad = np.pad(img, 3, constant_values=1.0)
    h, w = pad.shape
    big = Image.fromarray((pad * 255).astype(np.uint8)).resize((w * f, h * f), Image.BICUBIC)
    arr = np.asarray(big).astype(float) / 255.0
    arr = ndimage.gaussian_filter(arr, sigma=f * 0.45)
    path = potrace.Bitmap(arr > 0.5).trace(turdsize=f * f * 3, alphamax=1.0, opticurve=True, opttolerance=0.35)

    def P(p):
        return (p.x / f - 3, p.y / f - 3)

    contours = []
    for curve in path:
        segs = [("M", P(curve.start_point))]
        for s in curve.segments:
            if s.is_corner:
                segs.append(("L", P(s.c)))
                segs.append(("L", P(s.end_point)))
            else:
                segs.append(("C", P(s.c1), P(s.c2), P(s.end_point)))
        contours.append(segs)
    return contours


def bounds(contours):
    pts = [p for c in contours for s in c for p in s[1:]]
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def transform(contours, fn):
    return [[(s[0],) + tuple(fn(p) for p in s[1:]) for s in c] for c in contours]


def snap_points(contours, targets, tol=12):
    """Snap on-curve points near a metric height onto it (handles follow)."""
    out = []
    for c in contours:
        segs = [list(s) for s in c]
        n = len(segs)
        for i in range(1, n):
            s = segs[i]
            x, y = s[-1]
            for t in targets:
                if 0 < abs(y - t) <= tol:
                    d = t - y
                    s[-1] = (x, t)
                    if s[0] == "C":
                        s[2] = (s[2][0], s[2][1] + d)
                    nxt = segs[i + 1] if i + 1 < n else segs[1]
                    if nxt[0] == "C":
                        nxt[1] = (nxt[1][0], nxt[1][1] + d)
                    break
        segs[0][1] = segs[-1][-1]
        out.append([tuple(s) for s in segs])
    return out


def sample(contour, steps=16):
    pts = [contour[0][1]]
    cur = contour[0][1]
    for s in contour[1:]:
        if s[0] == "L":
            pts.append(s[1])
        else:
            for i in range(1, steps + 1):
                t = i / steps
                mt = 1 - t
                pts.append(tuple(mt ** 3 * cur[k] + 3 * mt * mt * t * s[1][k] + 3 * mt * t * t * s[2][k] + t ** 3 * s[3][k] for k in (0, 1)))
        cur = s[-1]
    return pts


def contours_to_shape(contours):
    shape = None
    for c in contours:
        p = Polygon(sample(c)).buffer(0)
        shape = p if shape is None else shape.symmetric_difference(p)
    return shape


def shape_to_contours(geom):
    polys = [geom] if geom.geom_type == "Polygon" else [g for g in geom.geoms if g.geom_type == "Polygon"]
    out = []
    for poly in polys:
        for ring in [poly.exterior] + list(poly.interiors):
            pts = list(ring.coords)[:-1]
            out.append([("M", pts[0])] + [("L", p) for p in pts[1:]] + [("L", pts[0])])
    return out


def split_letter(contours):
    """Split an accented letter's contours into (letter, above)."""
    area = lambda c: (lambda b: (b[2] - b[0]) * (b[3] - b[1]))(bounds([c]))
    big = max(contours, key=area)
    _, ltop, _, _ = bounds([big])
    letter, above = [], []
    for c in contours:
        (above if bounds([c])[3] < ltop + 1 else letter).append(c)
    return letter, above


# ------------------------------------------------------------- per weight
def trace_weight(weight, force=False, only=None):
    sheet = load_sheet(HERE / "specimens" / f"{weight}.png")
    traced = {row: {ch: trace_bitmap(sheet[(row, ch)]["img"]) for ch in chars} for row, chars in ROWS.items()}

    # vertical calibration: caps row sets the scale (cap height = 700 units)
    _, top, _, caps_base = bounds(traced["caps"]["H"])
    scale = CAP / (caps_base - top)
    _, xt, _, lower_base = bounds(traced["lower"]["x"])
    xh = round((lower_base - xt) * scale)
    asc = round((lower_base - bounds(traced["lower"]["l"])[1]) * scale)
    _, d1t, _, d1b = bounds(traced["digits"]["1"])
    _, _, _, pbase = bounds(traced["punct"]["."])
    _, et, _, eb = bounds(traced["punct"]["!"])
    desc = round(-max((bounds(traced["lower"][c])[3] - lower_base) * scale for c in "gpqy"))
    metrics = {"cap": CAP, "xh": xh, "asc": asc, "desc": desc}
    write_metrics(weight, metrics)

    # (name, char, contours in px, baseline px, units per px, snap heights, sheet glyph)
    jobs = []
    for ch in ROWS["caps"]:
        jobs.append((ch, traced["caps"][ch], caps_base, scale, [0, CAP], ("caps", ch)))
    for ch in ROWS["lower"]:
        jobs.append((ch, traced["lower"][ch], lower_base, scale, [0, xh, asc, desc], ("lower", ch)))
    dscale = CAP / (d1b - d1t)
    for ch in ROWS["digits"]:
        jobs.append((ch, traced["digits"][ch], d1b, dscale, [0, CAP], ("digits", ch)))
    pscale = CAP / (eb - et)
    for ch in ROWS["punct"]:
        jobs.append((ch, traced["punct"][ch], pbase, pscale, [0, CAP], ("punct", ch)))

    written = skipped = 0
    before = after = 0

    def emit(name, char, px_contours, base, s, snaps, src, x_origin=None, keep_x=False):
        nonlocal written, skipped, before, after
        units = transform(px_contours, lambda p: (p[0] * s, (base - p[1]) * s))
        ink_left = bounds(units)[0] if x_origin is None else x_origin * s
        units = transform(units, lambda p: (p[0] - ink_left, p[1]))
        fitted = [refit(c, snaps) for c in units]
        fitted = autofix(snap_points(fitted, snaps), metric_heights(char, metrics))
        before += node_count(units)
        after += node_count(fitted)
        if src is not None:
            _save_source(weight, name, src, s, -ink_left, base * s)
        if only and name not in only:
            return
        if glyph_status(weight, name) == "edited" and not force:
            skipped += 1
            return
        write_glyph(weight, name, fitted, char=char, metrics=metrics)
        written += 1

    for ch, c, base, s, snaps, key in jobs:
        emit(glyph_file_name(ch), ch, c, base, s, snaps, sheet[key]["img"])

    # accent marks, horizontally centred on x = 0 over their letter
    for row, target, refs, case in (("acccaps", CAP, ROWS["acccaps"], "cap"), ("acclower", xh, ROWS["acclower"], "lc")):
        letter, _ = split_letter(traced[row][refs[0]])
        _, lt, _, lb = bounds(letter)
        s = target / (lb - lt)
        for ch, name in zip(refs, ["grave", "acute", "tilde", "dieresis", "cedilla", "dotlessi"]):
            letter, above = split_letter(traced[row][ch])
            lx0, _, lx1, lbot = bounds(letter)
            cx = (lx0 + lx1) / 2
            img = sheet[(row, ch)]["img"]
            if name == "dotlessi":
                emit("dotlessi", "ı", letter, lbot, s, [0, xh], img)
            elif name == "cedilla":
                # usually joined to the letter: keep only what hangs below the baseline
                cut = contours_to_shape(traced[row][ch]).intersection(box(-1e4, lb - 0.15, 1e4, 1e4))
                emit(f"cedilla.{case}", None, shape_to_contours(cut.simplify(0.03)), lb, s, [], img, x_origin=cx)
            else:
                emit(f"{name}.{case}", None, above, lb, s, [], img, x_origin=cx)

    # en dash from the title line
    title = sheet["title"]
    tt = [trace_bitmap(g["img"]) for g in title]
    tb = [bounds(c) for c in tt]
    tbase = float(np.median([b[3] for b in tb]))
    tcap = max(b[3] - b[1] for b in tb if abs(b[3] - tbase) < 1.5)
    dash = min(range(len(tt)), key=lambda i: (tb[i][3] - tb[i][1]) / max(tb[i][2] - tb[i][0], 1))
    emit("endash", "–", tt[dash], tbase, CAP / tcap, [], title[dash]["img"])

    print(f"{weight}: wrote {written} glyph SVGs, kept {skipped} hand-edited; "
          f"nodes {before} traced -> {after} fitted")


def _save_source(weight, name, img, scale, x0, top):
    d = GLYPH_DIR / weight / "_source"
    d.mkdir(parents=True, exist_ok=True)
    info = PngImagePlugin.PngInfo()
    info.add_text("scale", str(scale))
    info.add_text("x0", str(x0))
    info.add_text("top", str(top))
    Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(d / f"{name}.png", pnginfo=info)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("weights", nargs="*", default=WEIGHTS)
    ap.add_argument("--force", action="store_true",
                    help="overwrite hand-edited glyphs too (combine with --glyph to limit the damage)")
    ap.add_argument("--glyph", nargs="*", help="only (re)trace these glyph file stems")
    a = ap.parse_args()
    for w in a.weights or WEIGHTS:
        trace_weight(w, a.force, a.glyph)


if __name__ == "__main__":
    main()
