"""Trace glyph bitmaps into cubic outlines with potrace."""
import math

import numpy as np
import potrace
from PIL import Image
from scipy import ndimage

UPSAMPLE = 8


def trace_bitmap(img):
    """img: float array, 0 = ink, 1 = paper. Returns contours in source-pixel
    coordinates (x right, y down). Each contour: list of segments
    ("L", (x, y)) or ("C", c1, c2, (x, y)), starting point first as ("M", p)."""
    f = UPSAMPLE
    pad = np.pad(img, 3, constant_values=1.0)
    h, w = pad.shape
    big = Image.fromarray((pad * 255).astype(np.uint8)).resize((w * f, h * f), Image.BICUBIC)
    arr = np.asarray(big).astype(float) / 255.0
    arr = ndimage.gaussian_filter(arr, sigma=f * 0.45)
    bm = potrace.Bitmap(arr > 0.5)
    path = bm.trace(turdsize=f * f * 3, alphamax=1.0, opticurve=True, opttolerance=0.35)
    contours = []

    def P(p):
        return ((p.x) / f - 3, (p.y) / f - 3)

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


def signed_area(contour):
    """Shoelace area over on-curve + control points (good enough for sign)."""
    pts = [p for s in contour for p in s[1:]]
    a = 0.0
    for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]):
        a += x0 * y1 - x1 * y0
    return a / 2


def snap(contours, targets, tol):
    """Snap on-curve points whose y is within tol of a target height, moving
    the neighbouring control points with them."""
    out = []
    for c in contours:
        segs = [list(s) for s in c]
        n = len(segs)
        for i, s in enumerate(segs):
            x, y = s[-1]
            for t in targets:
                if abs(y - t) <= tol and abs(y - t) > 0:
                    d = t - y
                    s[-1] = (x, t)
                    if s[0] == "C":
                        s[2] = (s[2][0], s[2][1] + d)
                    nxt = segs[(i + 1) % n] if i + 1 < n else segs[1]
                    if nxt[0] == "C":
                        nxt[1] = (nxt[1][0], nxt[1][1] + d)
                    break
        # keep the closing point equal to the start point
        segs[0][1] = segs[-1][-1]
        out.append([tuple(s) for s in segs])
    return out


def _dist_to_line(p, a, b):
    ax, ay = a
    bx, by = b
    dx, dy = bx - ax, by - ay
    L = math.hypot(dx, dy)
    if L == 0:
        return math.hypot(p[0] - ax, p[1] - ay)
    return abs((p[0] - ax) * dy - (p[1] - ay) * dx) / L


def clean(contours, flat=3.0, merge=2.0, axis_ratio=0.08, axis_min=25):
    """Straighten traced outlines (coordinates in font units)."""
    out = []
    for c in contours:
        start = c[0][1]
        segs = [list(s) for s in c[1:]]
        # A. nearly-straight curves become lines
        prev = start
        for i, s in enumerate(segs):
            if s[0] == "C" and _dist_to_line(s[1], prev, s[3]) < flat and _dist_to_line(s[2], prev, s[3]) < flat:
                segs[i] = ["L", s[3]]
            prev = segs[i][-1]
        # B. merge consecutive nearly-collinear lines
        changed = True
        while changed and len(segs) > 3:
            changed = False
            pts = [segs[-1][-1]] + [s[-1] for s in segs]  # pts[i] = start of segs[i]
            for i in range(len(segs)):
                j = (i + 1) % len(segs)
                if segs[i][0] == "L" and segs[j][0] == "L":
                    a = pts[i]
                    mid = segs[i][1]
                    b = segs[j][1]
                    if _dist_to_line(mid, a, b) < merge and math.hypot(b[0] - a[0], b[1] - a[1]) > 1:
                        segs[j] = ["L", b]
                        del segs[i]
                        changed = True
                        break
        # C. snap long near-axis lines
        n = len(segs)
        for i in range(n):
            s = segs[i]
            if s[0] != "L":
                continue
            p = segs[i - 1]
            a, b = p[-1], s[1]
            dx, dy = b[0] - a[0], b[1] - a[1]
            if abs(dy) > axis_min and abs(dx) < axis_ratio * abs(dy):
                x = (a[0] + b[0]) / 2
                _move(segs, i - 1, (x - a[0], 0))
                _move(segs, i, (x - b[0], 0))
            elif abs(dx) > axis_min and abs(dy) < axis_ratio * abs(dx):
                y = (a[1] + b[1]) / 2
                _move(segs, i - 1, (0, y - a[1]))
                _move(segs, i, (0, y - b[1]))
        last = tuple(segs[-1][-1])
        out.append([("M", last)] + [tuple(s) for s in segs])
    return out


def _move(segs, i, d):
    """Move the end point of segs[i] (and attached handles) by d."""
    n = len(segs)
    i %= n
    s = segs[i]
    s[-1] = (s[-1][0] + d[0], s[-1][1] + d[1])
    if s[0] == "C":
        s[2] = (s[2][0] + d[0], s[2][1] + d[1])
    nxt = segs[(i + 1) % n]
    if nxt[0] == "C":
        nxt[1] = (nxt[1][0] + d[0], nxt[1][1] + d[1])
