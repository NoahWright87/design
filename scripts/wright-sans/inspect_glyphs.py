"""Render glyph outlines with their nodes so a person (or an agent) can review them.

Usage (from the repo root):
    python3 scripts/wright-sans/inspect_glyphs.py <weight> [glyph ...] [--out file.png] [--source]

With no glyphs, renders a contact sheet of every glyph for the weight.
Glyphs are given by file stem (e.g. A, a, zero, ampersand, grave.cap).
--source underlays the specimen bitmap (grey) so tracing errors stand out.

Legend: filled grey = glyph, red squares = on-curve corner/line nodes,
blue dots = bezier handles, green lines = baseline / x-height / cap height /
ascender / descender.
"""
import argparse

import numpy as np
from PIL import Image, ImageDraw, ImageFont

from glyphsvg import GLYPH_DIR, load_glyph, read_metrics


def _sample(contour, steps=24):
    pts = [contour[0][1]]
    cur = contour[0][1]
    for s in contour[1:]:
        if s[0] == "L":
            pts.append(s[1])
        else:
            c1, c2, p = s[1], s[2], s[3]
            for i in range(1, steps + 1):
                t = i / steps
                mt = 1 - t
                pts.append((mt ** 3 * cur[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * p[0],
                            mt ** 3 * cur[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * p[1]))
        cur = s[-1]
    return pts


def render(contours, metrics, scale=0.5, width=None, label=None, source=None, nodes=True):
    """Return a PIL image of one glyph. Units -> pixels: x * scale."""
    top, bottom = 1000, -300
    xs = [p[0] for c in contours for s in c for p in s[1:]] or [0, 500]
    x0, x1 = min(min(xs), 0) - 40, max(max(xs), 0) + 40
    W = width or int((x1 - x0) * scale)
    H = int((top - bottom) * scale)
    img = Image.new("RGB", (W, H + 18), "white")
    d = ImageDraw.Draw(img)

    def T(p):
        return ((p[0] - x0) * scale, (top - p[1]) * scale)

    if source is not None:
        img.paste(source, (int(T((source.info["x0"], 0))[0]), int(T((0, source.info["top"]))[1])))
    for key, col in (("desc", (140, 200, 140)), ("baseline", (0, 150, 0)), ("xh", (140, 200, 140)),
                     ("cap", (0, 150, 0)), ("asc", (140, 200, 140))):
        y = metrics.get(key, 0) if key != "baseline" else 0
        d.line([(0, T((0, y))[1]), (W, T((0, y))[1])], fill=col, width=1)
    # even-odd fill via mask
    acc = np.zeros((img.height, img.width), np.uint8)
    for c in contours:
        layer = Image.new("L", img.size, 0)
        ImageDraw.Draw(layer).polygon([T(p) for p in _sample(c)], fill=255)
        acc ^= np.array(layer)
    mask = Image.fromarray(acc)
    fill = Image.new("RGB", img.size, (60, 60, 70) if source is None else (60, 60, 200))
    img = Image.composite(fill, img, mask.point(lambda v: 150 if v else 0) if source is not None else mask)
    d = ImageDraw.Draw(img)
    if nodes:
        for c in contours:
            d.line([T(p) for p in _sample(c)], fill=(230, 60, 60), width=1)
            cur = c[0][1]
            for s in c[1:]:
                if s[0] == "C":
                    for a, b in ((cur, s[1]), (s[3], s[2])):
                        d.line([T(a), T(b)], fill=(90, 140, 255), width=1)
                        x, y = T(b)
                        d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(90, 140, 255))
                x, y = T(s[-1])
                d.rectangle([x - 2.5, y - 2.5, x + 2.5, y + 2.5], fill=(230, 40, 40))
                cur = s[-1]
    if label:
        d.text((4, H + 2), label, fill=(0, 0, 0), font=ImageFont.load_default())
    return img


def contact_sheet(weight, names, scale, cols, source):
    metrics = read_metrics(weight)
    tiles = []
    for n in names:
        g = load_glyph(weight, n)
        count = sum(len(c) - 1 for c in g["contours"])
        tiles.append(render(g["contours"], metrics, scale=scale, label=f"{n} ({count})",
                            source=_source_img(weight, n, scale) if source else None))
    th = max(t.height for t in tiles)
    rows = [tiles[i:i + cols] for i in range(0, len(tiles), cols)]
    W = max(sum(t.width for t in r) + 4 * len(r) for r in rows)
    sheet = Image.new("RGB", (W, (th + 4) * len(rows)), (200, 200, 200))
    y = 0
    for r in rows:
        x = 0
        for t in r:
            sheet.paste(t, (x, y))
            x += t.width + 4
        y += th + 4
    return sheet


def _source_img(weight, name, scale):
    """Specimen bitmap for a glyph, scaled into font units (stored by trace)."""
    path = GLYPH_DIR / weight / "_source" / f"{name}.png"
    if not path.exists():
        return None
    im = Image.open(path)
    info = dict(im.info)
    k = float(info["scale"]) * scale
    im = im.convert("RGB").resize((max(1, int(im.width * k)), max(1, int(im.height * k))), Image.BICUBIC)
    im.info = {"x0": float(info["x0"]), "top": float(info["top"])}
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("weight")
    ap.add_argument("glyphs", nargs="*")
    ap.add_argument("--out")
    ap.add_argument("--scale", type=float)
    ap.add_argument("--cols", type=int, default=10)
    ap.add_argument("--source", action="store_true")
    a = ap.parse_args()
    names = a.glyphs or sorted(p.stem for p in (GLYPH_DIR / a.weight).glob("*.svg"))
    scale = a.scale or (0.12 if len(names) > 6 else 0.5)
    img = contact_sheet(a.weight, names, scale, a.cols if len(names) > 1 else 1, a.source)
    out = a.out or f"{a.weight}-{'sheet' if not a.glyphs else '_'.join(a.glyphs)}.png"
    img.save(out)
    print(out)


if __name__ == "__main__":
    main()
