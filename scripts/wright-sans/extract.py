"""Cut the Wright Sans specimen sheets into per-glyph grayscale bitmaps."""
import numpy as np
from PIL import Image
from scipy import ndimage

INK = 140  # gray level below which a pixel counts as ink

ROWS = [
    ("caps", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
    ("lower", "abcdefghijklmnopqrstuvwxyz"),
    ("digits", "0123456789"),
    ("punct", ".,:;!?@#&%+-/\\()[]{}'\"_=*$"),
    ("acccaps", "ÀÁÉÑÖÜÇÈÌÒÙ"),
    ("acclower", "àáéñöüçèìòù"),
]


def _bands(mask):
    rows = mask.sum(1)
    out, start = [], None
    for y, v in enumerate(rows):
        if v and start is None:
            start = y
        elif not v and start is not None:
            out.append((start, y))
            start = None
    return [b for b in out if b[1] - b[0] > 2]


def _spans(mask):
    c = mask.sum(0)
    out, start = [], None
    for x, v in enumerate(c):
        if v and start is None:
            start = x
        elif not v and start is not None:
            out.append([start, x])
            start = None
    return out


def row_boxes(ink):
    b = _bands(ink)
    assert len(b) == 9, b
    return {
        "title": b[0],
        "caps": b[1],
        "lower": b[2],
        "digits": b[3],
        "punct": b[4],
        "acccaps": (b[5][0], b[6][1]),
        "acclower": (b[7][0], b[8][1]),
    }


def segment_strip(gray, count=None):
    """Return a list of glyph images (float 0..1, 1 = paper) plus x offsets.

    Glyphs are groups of connected components. Components are grouped by
    column span; spans that hold several large components (tightly spaced
    glyphs) are split, and when there are too many spans the closest pair
    is merged (e.g. the two strokes of a double quote).
    """
    ink = gray < INK
    lab, n = ndimage.label(ink)
    # Give every paper pixel to its nearest component so anti-aliased
    # edges travel with their glyph.
    _, (iy, ix) = ndimage.distance_transform_edt(lab == 0, return_indices=True)
    owner = lab[iy, ix]

    spans = _spans(ink)
    groups = []
    h = ink.shape[0]
    for x0, x1 in spans:
        labels = [l for l in np.unique(lab[:, x0:x1]) if l]
        info = []
        for l in labels:
            ys, xs = np.where(lab == l)
            info.append((l, xs.min(), xs.max(), ys.max() - ys.min() + 1))
        tall = max(i[3] for i in info)
        big = sorted([i for i in info if i[3] > 0.55 * tall], key=lambda i: i[1])
        if len(big) > 1:
            # decide whether the big components are distinct glyphs: they are
            # when they barely overlap horizontally
            clusters = [[big[0]]]
            for b in big[1:]:
                prev = clusters[-1][-1]
                overlap = prev[2] - b[1]
                if overlap < 0.35 * min(prev[2] - prev[1], b[2] - b[1]):
                    clusters.append([b])
                else:
                    clusters[-1].append(b)
        else:
            clusters = [big]
        members = [[c[0] for c in cl] for cl in clusters]
        centers = [np.mean([(c[1] + c[2]) / 2 for c in cl]) for cl in clusters]
        for l, a, b, _ in info:
            if any(l in m for m in members):
                continue
            k = int(np.argmin([abs((a + b) / 2 - c) for c in centers]))
            members[k].append(l)
        groups.extend(members)

    def gx(g):
        xs = np.where(np.isin(lab, g))[1]
        return xs.min(), xs.max()

    if count is not None:
        while len(groups) > count:
            ext = [gx(g) for g in groups]
            gaps = [ext[i + 1][0] - ext[i][1] for i in range(len(groups) - 1)]
            i = int(np.argmin(gaps))
            groups[i:i + 2] = [groups[i] + groups[i + 1]]
        assert len(groups) == count, (len(groups), count)

    out = []
    for g in groups:
        m = np.isin(owner, g)
        xs = np.where(np.isin(lab, g))[1]
        x0, x1 = max(xs.min() - 3, 0), min(xs.max() + 4, gray.shape[1])
        img = np.where(m, gray, 255.0)[:, x0:x1] / 255.0
        comps = []
        for l in g:
            ys, xx = np.where(lab == l)
            comps.append((ys.min(), ys.max(), xx.min() - x0, xx.max() - x0, len(ys)))
        out.append({"img": img, "x0": x0, "comps": comps, "labels": g, "lab": lab[:, x0:x1]})
    return out


def load_sheet(path):
    gray = np.array(Image.open(path).convert("L")).astype(float)
    boxes = row_boxes(gray < INK)
    sheet = {}
    pad = 14
    for key, chars in ROWS:
        y0, y1 = boxes[key]
        top = y0 - pad
        strip = gray[top:y1 + pad]
        glyphs = segment_strip(strip, len(chars))
        for ch, g in zip(chars, glyphs):
            g["top"] = top
            g["row"] = key
            sheet[(key, ch)] = g
    y0, y1 = boxes["title"]
    sheet["title"] = segment_strip(gray[y0 - pad:y1 + pad])
    for g in sheet["title"]:
        g["top"] = y0 - pad
    return sheet
