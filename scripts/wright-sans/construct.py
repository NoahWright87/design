"""Build clean glyph outlines from a centerline + stroke thickness.

Use this when a traced glyph is too small or noisy to clean up node by node
(accent marks, small punctuation): describe the shape as a thick stroke along
a centerline, let `match_area` pick the thickness that matches the traced ink,
and write the result as an edited glyph SVG.

    from construct import stroke, match_area
    shape = match_area(lambda t: stroke(points_for(t), t), traced_contours)
"""
import math

import numpy as np
from shapely.geometry import LineString, Polygon

from fit import refit


def fillet(points, radius, steps=12):
    """Round each interior corner of a polyline with a circular arc."""
    pts = [np.asarray(p, float) for p in points]
    out = [pts[0]]
    for a, b, c in zip(pts, pts[1:], pts[2:]):
        u, v = _unit(a - b), _unit(c - b)
        theta = math.acos(max(-1, min(1, float(u @ v))))
        if radius <= 0 or theta > math.radians(175):
            out.append(b)
            continue
        d = min(radius / math.tan(theta / 2), 0.49 * math.dist(a, b), 0.49 * math.dist(b, c))
        r = d * math.tan(theta / 2)
        p0, p1 = b + u * d, b + v * d
        bis = _unit(u + v)
        center = b + bis * math.hypot(d, r)
        a0 = math.atan2(*(p0 - center)[::-1])
        a1 = math.atan2(*(p1 - center)[::-1])
        da = (a1 - a0 + math.pi) % (2 * math.pi) - math.pi
        for i in range(steps + 1):
            ang = a0 + da * i / steps
            out.append(center + r * np.array([math.cos(ang), math.sin(ang)]))
    out.append(pts[-1])
    return [tuple(p) for p in out]


def stroke(points, thickness, outer_radius=None, cap="flat"):
    """Thick stroke along a polyline. Outer corners get `outer_radius`
    (default: about the thickness); inner corners stay nearly sharp."""
    r = thickness * 1.05 if outer_radius is None else outer_radius
    # keep a little rounding on the inside of each bend too
    center_r = max(r - thickness / 2, 0.7 * thickness)
    line = LineString(fillet(points, center_r))
    return line.buffer(thickness / 2, cap_style=cap, join_style="round", quad_segs=16)


def to_contours(geom, snaps=()):
    polys = [geom] if geom.geom_type == "Polygon" else list(geom.geoms)
    out = []
    for poly in polys:
        for ring in [poly.exterior] + list(poly.interiors):
            pts = list(ring.coords)[:-1]
            c = [("M", pts[0])] + [("L", p) for p in pts[1:]] + [("L", pts[0])]
            out.append(refit(c, snaps))
    return out


def ink_bounds(contours):
    """Bounding box of the actual outline (not its control points)."""
    return _shape(contours).bounds


def _shape(contours):
    from fit import densify
    shape = None
    for c in contours:
        p = Polygon(densify(c)).buffer(0)
        shape = p if shape is None else shape.symmetric_difference(p)
    return shape


def area_of(contours):
    shape = _shape(contours)
    return shape.area if shape is not None else 0.0


def match_area(build, traced, lo=10.0, hi=300.0):
    """Pick the stroke thickness whose shape has the traced glyph's area."""
    target = area_of(traced)
    for _ in range(30):
        mid = (lo + hi) / 2
        if build(mid).area < target:
            lo = mid
        else:
            hi = mid
    return build((lo + hi) / 2), (lo + hi) / 2


def _unit(v):
    n = math.hypot(*v)
    return v / n if n > 1e-9 else v
