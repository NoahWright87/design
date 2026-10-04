"""Turn a noisy traced outline into a clean one: long straight runs become
single lines (snapped to the axes when nearly axis-aligned), and whatever lies
between them is fitted with as few cubic beziers as possible, tangent to the
neighbouring lines so rounded corners stay smooth.

Contours use the segment format shared by the pipeline:
    [("M", p0), ("L", p) | ("C", c1, c2, p), ...]   # last point == p0
"""
import math

import numpy as np

# Tolerances in font units (1000 UPM)
SAMPLE_STEP = 3.0      # spacing of the dense polyline
LINE_TOL = 3.0         # max deviation for a straight run
LINE_MIN = 52.0        # shortest run treated as a straight edge
CURVE_TOL = 7.0        # max deviation for a fitted bezier
AXIS_DEG = 4.0         # lines within this angle of an axis become exactly axis-aligned
CORNER_GAP = 20.0      # lines this close with a sharp turn meet in a crisp corner
MIN_RADIUS = 16.0       # corners rounder than this stay round; tighter ones become crisp
CORNER_DEG = 25.0      # turn above which two lines meet in a crisp corner


# ------------------------------------------------------------------ sampling
def _bez(p0, c1, c2, p3, t):
    mt = 1 - t
    return (mt ** 3 * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * p3[0],
            mt ** 3 * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * p3[1])


def densify(contour, step=SAMPLE_STEP):
    """Evenly spaced points along a closed contour (first point not repeated)."""
    raw = [contour[0][1]]
    cur = contour[0][1]
    for s in contour[1:]:
        if s[0] == "L":
            raw.append(s[1])
        else:
            n = max(4, int(math.dist(cur, s[3]) / 2))
            raw.extend(_bez(cur, s[1], s[2], s[3], i / n) for i in range(1, n + 1))
        cur = s[-1]
    pts = np.array(raw, float)
    seg = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    arc = np.concatenate([[0], np.cumsum(seg)])
    total = arc[-1]
    n = max(8, int(total / step))
    t = np.linspace(0, total, n, endpoint=False)
    return np.stack([np.interp(t, arc, pts[:, 0]), np.interp(t, arc, pts[:, 1])], axis=1)


# ------------------------------------------------------------------ lines
def _line_dev(P):
    """Max distance of points P from the chord between its ends."""
    a, b = P[0], P[-1]
    d = b - a
    L = math.hypot(*d)
    if L < 1e-9:
        return float(np.max(np.linalg.norm(P - a, axis=1)))
    return float(np.max(np.abs((P[:, 0] - a[0]) * d[1] - (P[:, 1] - a[1]) * d[0]) / L))


def _straight(Q):
    """Straight enough to be a line? Short runs must be much straighter, so
    gentle large-radius corners are not mistaken for chamfers."""
    length = math.dist(Q[0], Q[-1])
    return _line_dev(Q) <= min(LINE_TOL, 0.025 * length)


def find_runs(P):
    """Greedy maximal straight runs on a closed polyline -> list of (i, j)
    index pairs (j may exceed len(P); indexes wrap)."""
    n = len(P)
    ext = np.concatenate([P, P])
    min_pts = max(3, int(LINE_MIN / SAMPLE_STEP))
    # start the scan somewhere that is not inside a straight run
    runs = []
    i = 0
    while i < n:
        j = i + min_pts
        if j >= i + n or not _straight(ext[i:j + 1]):
            i += 1
            continue
        while j + 1 < i + n and _straight(ext[i:j + 2]):
            j += 1
        # try extending backwards too (runs that straddle the start index)
        runs.append((i, j))
        i = j
    # merge a run that wraps around the start with the first one
    if len(runs) >= 2 and runs[-1][1] >= n + runs[0][0]:
        runs[0] = (runs[-1][0] - n, runs[0][1])
        runs.pop()
    # drop overlaps
    out = []
    for r in runs:
        if out and r[0] < out[-1][1]:
            r = (out[-1][1], r[1])
            if r[1] - r[0] < min_pts:
                continue
        out.append(r)
    if len(out) >= 2 and out[-1][1] > out[0][0] + n:
        out[-1] = (out[-1][0], out[0][0] + n)
    return out


def fit_line(Q):
    """Least-squares line through Q, returned as its endpoints projected."""
    c = Q.mean(axis=0)
    u, s, vt = np.linalg.svd(Q - c)
    d = vt[0]
    ang = math.degrees(math.atan2(d[1], d[0])) % 180
    if min(ang, 180 - ang) < AXIS_DEG:
        d = np.array([1.0, 0.0])
    elif abs(ang - 90) < AXIS_DEG:
        d = np.array([0.0, 1.0])
    t0 = float((Q[0] - c) @ d)
    t1 = float((Q[-1] - c) @ d)
    return c + t0 * d, c + t1 * d


# ------------------------------------------------------------------ beziers
def _chord_params(Q):
    d = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(Q, axis=0), axis=1))])
    return d / d[-1] if d[-1] > 0 else d


def _fit_one(Q, u, t0, t1):
    """Least-squares cubic with fixed end tangents (Schneider)."""
    p0, p3 = Q[0], Q[-1]
    b0 = (1 - u) ** 3
    b1 = 3 * u * (1 - u) ** 2
    b2 = 3 * u * u * (1 - u)
    b3 = u ** 3
    A1 = np.outer(b1, t0)
    A2 = np.outer(b2, t1)
    C = np.array([[np.sum(A1 * A1), np.sum(A1 * A2)], [np.sum(A1 * A2), np.sum(A2 * A2)]])
    tmp = Q - np.outer(b0 + b1, p0) - np.outer(b2 + b3, p3)
    X = np.array([np.sum(A1 * tmp), np.sum(A2 * tmp)])
    seg = math.dist(p0, p3)
    try:
        a1, a2 = np.linalg.solve(C, X)
    except np.linalg.LinAlgError:
        a1 = a2 = seg / 3
    if a1 < 1e-3 * seg or a2 < 1e-3 * seg or a1 > 2 * seg or a2 > 2 * seg:
        a1 = a2 = seg / 3
    return p0, p0 + a1 * t0, p3 + a2 * t1, p3


def _error(Q, u, bez):
    pts = np.array([_bez(*bez, t) for t in u])
    d = np.linalg.norm(pts - Q, axis=1)
    i = int(np.argmax(d))
    return float(d[i]), i


def _reparam(Q, u, bez):
    """One Newton step moving each parameter to its closest point."""
    p0, c1, c2, p3 = map(np.asarray, bez)
    out = []
    for q, t in zip(Q, u):
        mt = 1 - t
        b = mt ** 3 * p0 + 3 * mt * mt * t * c1 + 3 * mt * t * t * c2 + t ** 3 * p3
        d1 = 3 * mt * mt * (c1 - p0) + 6 * mt * t * (c2 - c1) + 3 * t * t * (p3 - c2)
        d2 = 6 * mt * (c2 - 2 * c1 + p0) + 6 * t * (p3 - 2 * c2 + c1)
        num = np.dot(b - q, d1)
        den = np.dot(d1, d1) + np.dot(b - q, d2)
        out.append(min(1.0, max(0.0, t - num / den)) if abs(den) > 1e-9 else t)
    return np.array(out)


def _unit(v):
    n = math.hypot(*v)
    return np.asarray(v) / n if n > 1e-9 else np.asarray(v, float)


def fit_cubics(Q, t0=None, t1=None, tol=CURVE_TOL, depth=0):
    """Fit the open polyline Q with cubic segments; returns [(c1, c2, p3), ...]."""
    if len(Q) < 3:
        return [("L", tuple(Q[-1]))]
    if t0 is None:
        t0 = _unit(Q[min(2, len(Q) - 1)] - Q[0])
    if t1 is None:
        t1 = _unit(Q[max(-3, -len(Q))] - Q[-1])
    if _line_dev(Q) < tol * 0.6 and depth > 0:
        return [("L", tuple(Q[-1]))]
    u = _chord_params(Q)
    bez = _fit_one(Q, u, t0, t1)
    err, split = _error(Q, u, bez)
    for _ in range(4):
        if err <= tol:
            break
        u = _reparam(Q, u, bez)
        bez = _fit_one(Q, u, t0, t1)
        err, split = _error(Q, u, bez)
    if err <= tol or len(Q) < 6 or depth > 6:
        return [("C", tuple(bez[1]), tuple(bez[2]), tuple(bez[3]))]
    split = min(max(split, 2), len(Q) - 3)
    tc = _unit(Q[split - 1] - Q[split + 1])
    left = fit_cubics(Q[:split + 1], t0, tc, tol, depth + 1)
    right = fit_cubics(Q[split:], -tc, t1, tol, depth + 1)
    return left + right


# ------------------------------------------------------------------ contour
def _intersect(a0, a1, b0, b1):
    d1 = a1 - a0
    d2 = b1 - b0
    den = d1[0] * d2[1] - d1[1] * d2[0]
    if abs(den) < 1e-9:
        return None
    t = ((b0[0] - a0[0]) * d2[1] - (b0[1] - a0[1]) * d2[0]) / den
    return a0 + t * d1


def refit(contour, snaps=()):
    """Rebuild one contour from lines + fitted cubics."""
    P = densify(contour)
    n = len(P)
    runs = find_runs(P)
    ext = np.concatenate([P, P, P])

    def span(i, j):
        return ext[i + n:j + n + 1] if i < 0 else ext[i:j + 1]

    if not runs:
        # fully curved contour: split at the leftmost and rightmost points
        a = int(np.argmin(P[:, 0]))
        b = int(np.argmax(P[:, 0]))
        if b < a:
            b += n
        segs = fit_cubics(ext[a:b + 1], tol=CURVE_TOL) + fit_cubics(ext[b:a + n + 1], tol=CURVE_TOL)
        start = tuple(P[a])
        return _close(start, segs)

    lines = []
    for i, j in runs:
        a, b = fit_line(span(i, j))
        lines.append([np.array(a), np.array(b), i, j])
    lines = _merge_lines(lines, span)
    _cluster_axes(lines, snaps)

    m = len(lines)
    joins = []  # per corner: ("sharp", point) | ("round", c1, c2) | None
    for k in range(m):
        cur, nxt = lines[k], lines[(k + 1) % m]
        d1 = _unit(cur[1] - cur[0])
        d2 = _unit(nxt[1] - nxt[0])
        turn = math.degrees(math.acos(max(-1, min(1, float(d1 @ d2)))))
        gap = math.dist(cur[1], nxt[0])
        join = None
        if gap < CORNER_GAP and turn > CORNER_DEG:
            X = _intersect(cur[0], cur[1], nxt[0], nxt[1])
            if X is not None and math.dist(X, cur[1]) < CORNER_GAP * 1.5 and math.dist(X, nxt[0]) < CORNER_GAP * 1.5:
                join = ("sharp", X)
        if join is None and turn > 15:
            join = _round_corner(cur, nxt, _between(P, span, n, cur, nxt, k, m))
        joins.append(join)
    for k, join in enumerate(joins):
        if join is None:
            continue
        cur, nxt = lines[k], lines[(k + 1) % m]
        if join[0] == "sharp":
            cur[1] = join[1].copy()
            nxt[0] = join[1].copy()
        else:
            cur[1] = join[1]
            nxt[0] = join[4]

    segs = []
    start = tuple(lines[0][0])
    for k in range(m):
        cur, nxt = lines[k], lines[(k + 1) % m]
        segs.append(("L", tuple(cur[1])))
        join = joins[k]
        if join is not None:
            if join[0] == "round":
                segs.append(("C", tuple(join[2]), tuple(join[3]), tuple(join[4])))
            continue
        Q = _between(P, span, n, cur, nxt, k, m)
        if len(Q) < 3 or math.dist(cur[1], nxt[0]) < 2:
            if math.dist(cur[1], nxt[0]) > 0.5:
                segs.append(("L", tuple(nxt[0])))
            continue
        t0 = _unit(cur[1] - cur[0])
        t1 = -_unit(nxt[1] - nxt[0])
        segs.extend(fit_cubics(Q, t0, t1))
    return _close(start, segs)


def _between(P, span, n, cur, nxt, k, m):
    """Traced points between the end of one line and the start of the next."""
    i0 = cur[3]
    i1 = nxt[2] if nxt[2] >= i0 else nxt[2] + n
    if k == m - 1 and nxt[2] + n >= i0:
        i1 = nxt[2] + n
    between = span(i0, i1) if i1 - i0 < n else span(i0, i0 + 1)
    if len(between) > 2:
        return np.vstack([cur[1], between[1:-1], nxt[0]])
    return np.vstack([cur[1], nxt[0]])


def _merge_lines(lines, span):
    """Merge neighbouring lines that are really one edge (tiny steps, splits)."""
    changed = True
    while changed and len(lines) > 2:
        changed = False
        for k in range(len(lines)):
            a, b = lines[k], lines[(k + 1) % len(lines)]
            d1, d2 = _unit(a[1] - a[0]), _unit(b[1] - b[0])
            if float(d1 @ d2) < math.cos(math.radians(4)):
                continue
            off = abs(float(np.cross(d1, b[0] - a[0])))
            if off > 3.5 or math.dist(a[1], b[0]) > 40:
                continue
            pts = np.vstack([a[0], a[1], b[0], b[1]])
            p, q = fit_line(pts)
            merged = [np.array(p), np.array(q), a[2], b[3]]
            if k + 1 < len(lines):
                lines[k:k + 2] = [merged]
            else:
                merged[2] = a[2]
                lines[k] = merged
                lines.pop(0)
            changed = True
            break
    return lines


def _cluster_axes(lines, snaps, tol=4.0):
    """Give vertical edges within tol of each other the same x (same for y),
    and snap horizontal edges to metric heights."""
    for axis, other in ((0, 1), (1, 0)):
        edges = [ln for ln in lines if abs(ln[0][axis] - ln[1][axis]) < 1e-6 and abs(ln[0][other] - ln[1][other]) > 1e-6]
        if axis == 1:
            for ln in edges:
                for s in snaps:
                    if abs(ln[0][1] - s) <= 12:
                        ln[0][1] = ln[1][1] = s
                        break
        edges.sort(key=lambda ln: ln[0][axis])
        group = []
        for ln in edges + [None]:
            if ln is not None and (not group or ln[0][axis] - group[-1][0][axis] <= tol):
                group.append(ln)
                continue
            if len(group) > 1:
                vals = [g[0][axis] for g in group]
                fixed = [v for v in vals if axis == 1 and v in snaps]
                v = fixed[0] if fixed else float(np.mean(vals))
                for g in group:
                    g[0][axis] = g[1][axis] = v
            group = [ln] if ln is not None else []


def _round_corner(cur, nxt, Q):
    """A clean circular-looking corner between two lines, if the traced points
    fit one. Returns ("round", p0, c1, c2, p3) or None."""
    d1, d2 = _unit(cur[1] - cur[0]), _unit(nxt[1] - nxt[0])
    theta = math.acos(max(-1, min(1, float(d1 @ d2))))
    if not math.radians(15) < theta < math.radians(165) or len(Q) < 3:
        return None
    X = _intersect(cur[0], cur[1], nxt[0], nxt[1])
    if X is None:
        return None
    a = float((X - cur[1]) @ d1)
    b = float((nxt[0] - X) @ d2)
    if a < -3 or b < -3 or max(a, b) > 220:
        return None
    if max(a, b) < MIN_RADIUS:
        # rounding smaller than a source pixel is blur, not design
        return ("sharp", X)
    a, b = max(a, 1.0), max(b, 1.0)
    if abs(a - b) < 0.3 * max(a, b):
        a = b = (a + b) / 2
    if math.dist(cur[0], X) - a < 4 or math.dist(X, nxt[1]) - b < 4:
        return None
    p0, p3 = X - d1 * a, X + d2 * b
    k = 4 / 3 * math.tan(theta / 4) / math.tan(theta / 2)
    c1, c2 = p0 + d1 * a * k, p3 - d2 * b * k
    curve = np.array([_bez(p0, c1, c2, p3, t) for t in np.linspace(0, 1, 60)])
    err = max(float(np.min(np.linalg.norm(curve - q, axis=1))) for q in Q[1:-1]) if len(Q) > 2 else 0
    if err > max(8.0, 0.08 * max(a, b)):
        return None
    return ("round", p0, c1, c2, p3)


def _merge_collinear(out, tol=1.5):
    """Drop line nodes that sit on the straight path between their neighbours."""
    changed = True
    while changed and len(out) > 4:
        changed = False
        for i in range(1, len(out) - 1):
            a = out[i - 1][-1]
            s, t = out[i], out[i + 1]
            if s[0] == "L" and t[0] == "L":
                if _line_dev(np.array([a, s[1], t[1]])) < tol:
                    del out[i]
                    changed = True
                    break
    return out


def _close(start, segs):
    out = [("M", tuple(map(float, start)))]
    for s in segs:
        out.append((s[0],) + tuple(tuple(map(float, p)) for p in s[1:]))
    if math.dist(out[-1][-1], out[0][1]) > 0.5:
        out.append(("L", out[0][1]))
    else:
        last = list(out[-1])
        last[-1] = out[0][1]
        out[-1] = tuple(last)
    # drop zero-length lines
    clean = [out[0]]
    for s in out[1:]:
        if s[0] == "L" and math.dist(s[1], clean[-1][-1]) < 3:
            continue
        clean.append(s)
    clean = _merge_collinear(clean)
    # rotate so the start point is not in the middle of a straight edge
    if len(clean) > 3 and clean[-1][0] == "L" and clean[1][0] == "L":
        a, b, c = clean[-2][-1], clean[0][1], clean[1][1]
        if _line_dev(np.array([a, b, c])) < 1.5:
            body = clean[1:]
            body[-1] = ("L", c)
            clean = [("M", c)] + body[1:] + [("L", c)] if False else [("M", tuple(c))] + clean[2:-1] + [("L", tuple(a)), ("L", tuple(c))]
            clean = _merge_collinear(clean)
    return clean


def node_count(contours):
    return sum(len(c) - 1 for c in contours)
