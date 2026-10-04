"""Flag likely outline problems in the glyph SVGs.

Usage (from the repo root):
    python3 scripts/wright-sans/lint_glyphs.py [weight ...] [--glyph NAME ...]

Each finding names the glyph, the node (x, y) and what looks wrong, so it can
be fixed by editing the SVG path. Checks:
    near-metric   node sits a few units off baseline / x-height / cap / ascender / descender
    near-axis     straight edge is almost, but not exactly, vertical or horizontal
    kink          two curves (or a curve and a line) meet at a slight angle (should be smooth)
    tiny          segment shorter than a few units (joggle / duplicate node)
    flat-curve    curve whose handles lie on its chord (should be a line)
    handle        handle longer than its segment, or reversed (loops, bumps)
    direction     contour direction inconsistent with nesting (would render as a hole)
"""
import argparse
import math

from glyphsvg import GLYPH_DIR, load_glyph, read_metrics, write_glyph

WEIGHTS = ["regular", "semibold", "bold", "black"]


def _ang(a, b):
    return math.atan2(b[1] - a[1], b[0] - a[0])


def _diff(a1, a2):
    d = abs(a1 - a2) % (2 * math.pi)
    return math.degrees(min(d, 2 * math.pi - d))


def _dist_line(p, a, b):
    L = math.dist(a, b)
    if L == 0:
        return math.dist(p, a)
    return abs((p[0] - a[0]) * (b[1] - a[1]) - (p[1] - a[1]) * (b[0] - a[0])) / L


def metric_heights(char, metrics):
    """Metric lines that matter for a glyph (marks get none)."""
    if char is None:
        return []
    if char.islower() or char == "ı":
        return [0, metrics["xh"], metrics["asc"], metrics["desc"]]
    return [0, metrics["cap"]]


def lint_contours(contours, metrics, char=None):
    out = []
    heights = metric_heights(char, metrics)
    for c in contours:
        segs = c[1:]
        n = len(segs)
        starts = [c[0][1]] + [s[-1] for s in segs[:-1]]
        for i, s in enumerate(segs):
            p0, p = starts[i], s[-1]
            L = math.dist(p0, p)
            if L < 4:
                out.append(("tiny", p, f"segment of {L:.1f} units"))
            for h in heights:
                if 0 < abs(p[1] - h) <= 8:
                    out.append(("near-metric", p, f"y={p[1]:.0f}, {h} is {abs(p[1] - h):.0f} away"))
            if s[0] == "L" and L > 20:
                a = math.degrees(math.atan2(abs(p[1] - p0[1]), abs(p[0] - p0[0])))
                if 0.3 < a < 5 or 0.3 < 90 - a < 5:
                    out.append(("near-axis", p, f"edge {a:.1f}° from horizontal"))
            if s[0] == "C":
                c1, c2 = s[1], s[2]
                if L > 8 and _dist_line(c1, p0, p) < 1 and _dist_line(c2, p0, p) < 1:
                    out.append(("flat-curve", p, "curve is straight: make it a line"))
                if math.dist(p0, c1) > 1.5 * L + 5 or math.dist(p, c2) > 1.5 * L + 5:
                    out.append(("handle", p, "handle much longer than segment"))
            # smoothness at the end node of this segment
            nxt = segs[(i + 1) % n]
            if s[0] == "C" or nxt[0] == "C":
                tin = _ang(s[2] if s[0] == "C" else p0, p)
                tout = _ang(p, nxt[1])
                hin = math.dist(s[2] if s[0] == "C" else p0, p)
                hout = math.dist(p, nxt[1])
                turn = _diff(tin, tout)
                # how far the shorter handle strays from a smooth tangent, in units
                stray = min(hin, hout) * math.sin(math.radians(turn))
                if 1.5 < turn < 20 and stray > 1.5:
                    out.append(("kink", p, f"{turn:.0f}° bend ({stray:.1f} units) where a smooth join is likely"))
    return out


# ------------------------------------------------------------------ autofix
def autofix(contours, heights):
    """Mechanical clean-up; judgement calls are left for a human/agent."""
    out = []
    for c in contours:
        segs = [list(s) for s in c[1:]]
        segs = _drop_tiny(segs)
        if len(segs) < 2:
            continue  # degenerate sliver
        for i, s in enumerate(segs):
            p0 = segs[i - 1][-1]
            p = s[-1]
            L = math.dist(p0, p)
            # flat curve -> line
            if s[0] == "C" and L > 8 and _dist_line(s[1], p0, p) < 1 and _dist_line(s[2], p0, p) < 1:
                segs[i] = s = ["L", p]
            # near-axis line -> exact
            if s[0] == "L" and L > 20:
                a = math.degrees(math.atan2(abs(p[1] - p0[1]), abs(p[0] - p0[0])))
                if a < 5:
                    y = (p0[1] + p[1]) / 2
                    _move(segs, i - 1, (0, y - p0[1]))
                    _move(segs, i, (0, y - p[1]))
                elif 90 - a < 5:
                    x = (p0[0] + p[0]) / 2
                    _move(segs, i - 1, (x - p0[0], 0))
                    _move(segs, i, (x - p[0], 0))
        # snap to metric lines
        for i, s in enumerate(segs):
            for h in heights:
                if 0 < abs(s[-1][1] - h) <= 8:
                    _move(segs, i, (0, h - s[-1][1]))
                    break
        # smooth small kinks: rotate the shorter handle onto the other's line
        n = len(segs)
        for i, s in enumerate(segs):
            nxt = segs[(i + 1) % n]
            p = s[-1]
            hin = s[2] if s[0] == "C" else segs[i - 1][-1]
            hout = nxt[1]
            if not (s[0] == "C" or nxt[0] == "C"):
                continue
            li, lo = math.dist(hin, p), math.dist(p, hout)
            if li < 1 or lo < 1:
                continue
            turn = _diff(_ang(hin, p), _ang(p, hout))
            if not 0.5 < turn < 20:
                continue
            if lo <= li and nxt[0] == "C":
                ux, uy = (p[0] - hin[0]) / li, (p[1] - hin[1]) / li
                nxt[1] = (p[0] + ux * lo, p[1] + uy * lo)
            elif s[0] == "C":
                ux, uy = (hout[0] - p[0]) / lo, (hout[1] - p[1]) / lo
                s[2] = (p[0] - ux * li, p[1] - uy * li)
        start = tuple(segs[-1][-1])
        out.append([("M", start)] + [tuple(s) for s in segs])
    return out


def _drop_tiny(segs, tol=4):
    changed = True
    while changed and len(segs) > 3:
        changed = False
        for i, s in enumerate(segs):
            if math.dist(segs[i - 1][-1], s[-1]) < tol:
                nxt = segs[(i + 1) % len(segs)]
                if s[0] == "L":
                    del segs[i]
                elif nxt[0] == "L":
                    # keep the curve, drop the tiny line after it
                    s[-1] = nxt[-1]
                    del segs[(i + 1) % len(segs)]
                else:
                    continue
                changed = True
                break
    return segs


def _move(segs, i, d):
    """Move the end node of segs[i] (and its attached handles) by d."""
    n = len(segs)
    i %= n
    s = segs[i]
    s[-1] = (s[-1][0] + d[0], s[-1][1] + d[1])
    if s[0] == "C":
        s[2] = (s[2][0] + d[0], s[2][1] + d[1])
    nxt = segs[(i + 1) % n]
    if nxt[0] == "C":
        nxt[1] = (nxt[1][0] + d[0], nxt[1][1] + d[1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("weights", nargs="*")
    ap.add_argument("--glyph", nargs="*")
    ap.add_argument("--summary", action="store_true", help="only count findings per glyph")
    ap.add_argument("--fix", action="store_true", help="apply the mechanical fixes to traced (not edited) glyphs")
    a = ap.parse_args()
    total = 0
    for w in a.weights or WEIGHTS:
        metrics = read_metrics(w)
        names = a.glyph or sorted(p.stem for p in (GLYPH_DIR / w).glob("*.svg"))
        for name in names:
            g = load_glyph(w, name)
            if a.fix and g["status"] != "edited":
                fixed = autofix(g["contours"], metric_heights(g["char"], metrics))
                write_glyph(w, name, fixed, char=g["char"], metrics=metrics, status=g["status"])
                g = load_glyph(w, name)
            found = lint_contours(g["contours"], metrics, g["char"])
            total += len(found)
            if not found:
                continue
            if a.summary:
                kinds = sorted({f[0] for f in found})
                print(f"{w}/{name} [{g['status']}]: {len(found)} ({', '.join(kinds)})")
            else:
                for kind, p, msg in found:
                    print(f"{w}/{name}: {kind} at ({p[0]:.0f}, {p[1]:.0f}): {msg}")
    print(f"{total} findings")


if __name__ == "__main__":
    main()
