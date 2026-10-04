"""Per-glyph SVG files: the editable source of truth for Wright Sans outlines.

Each glyph lives at glyphs/<weight>/<name>.svg. Path data is in font units
with y pointing UP (baseline 0, cap height 700); the SVG flips it with a
transform so the file previews correctly in any viewer. Editing the `d`
attribute of the path with id="outline" edits the glyph.

data-status on the root element:
    traced  - written by trace.py; re-tracing may overwrite it
    edited  - hand-corrected; trace.py leaves it alone (unless --force)
"""
import json
import math
import re
from pathlib import Path

from fontTools.pens.recordingPen import RecordingPen
from fontTools.svgLib.path import parse_path

GLYPH_DIR = Path(__file__).resolve().parent / "glyphs"

# Characters with a specimen tracing, and extra traced pieces used by build.py
MARK_NAMES = ["grave", "acute", "tilde", "dieresis", "cedilla"]


def glyph_file_name(ch):
    """File stem for a character: AGL name, suffixed for case-colliding names."""
    from fontTools.agl import UV2AGL
    name = UV2AGL.get(ord(ch), f"uni{ord(ch):04X}")
    # macOS/Windows file systems are case-insensitive: keep A.svg and a.svg apart
    if len(name) == 1 and name.isupper():
        name += "_"
    return name


def fmt(v):
    r = round(v)
    return str(int(r))


def path_d(contours):
    parts = []
    for c in contours:
        parts.append(f"M{fmt(c[0][1][0])} {fmt(c[0][1][1])}")
        segs = c[1:]
        # the closing line back to the start is implied by Z
        if segs and segs[-1][0] == "L" and _same(segs[-1][1], c[0][1]):
            segs = segs[:-1]
        for s in segs:
            if s[0] == "L":
                parts.append(f"L{fmt(s[1][0])} {fmt(s[1][1])}")
            else:
                parts.append("C" + " ".join(f"{fmt(p[0])} {fmt(p[1])}" for p in s[1:]))
        parts.append("Z")
    # one contour per line keeps diffs readable
    return "\n    ".join(" ".join(parts).replace(" Z M", " Z\nM").split("\n"))


def _same(a, b):
    return round(a[0]) == round(b[0]) and round(a[1]) == round(b[1])


def write_glyph(weight, name, contours, *, char=None, metrics, status="traced", note=""):
    xs = [p[0] for c in contours for s in c for p in s[1:]] or [0]
    x0 = min(min(xs), 0) - 50
    w = max(xs) - x0 + 50
    top = metrics["asc"] + 250
    bottom = metrics["desc"] - 80
    uni = f' data-unicode="{ord(char):04X}"' if char else ""
    guides = "\n".join(
        f'    <line x1="{fmt(x0)}" x2="{fmt(x0 + w)}" y1="{-v}" y2="{-v}"/>'
        for v in sorted({0, metrics["xh"], metrics["cap"], metrics["asc"], metrics["desc"]})
    )
    title = f"{weight} {name}" + (f" ({char})" if char else "")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{fmt(x0)} {-top} {fmt(w)} {top - bottom}" data-status="{status}"{uni}>
  <title>{title}</title>
  <desc>Font units, y-up (baseline 0, x-height {metrics["xh"]}, cap {metrics["cap"]}). Edit the outline path; set data-status="edited" when hand-corrected.{(" " + note) if note else ""}</desc>
  <g id="guides" stroke="#3a3" stroke-width="2" opacity="0.5">
{guides}
  </g>
  <path id="outline" transform="scale(1 -1)" fill="#111" fill-rule="nonzero" d="
    {path_d(contours)}"/>
</svg>
'''
    path = GLYPH_DIR / weight / f"{name}.svg"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg)
    return path


def load_glyph(weight, name):
    text = (GLYPH_DIR / weight / f"{name}.svg").read_text()
    m = re.search(r'<path[^>]*id="outline"[^>]*\sd="([^"]*)"', text, re.S)
    status = re.search(r'data-status="(\w+)"', text)
    uni = re.search(r'data-unicode="([0-9A-Fa-f]+)"', text)
    return {
        "contours": parse_d(m.group(1)),
        "status": status.group(1) if status else "traced",
        "char": chr(int(uni.group(1), 16)) if uni else None,
    }


def glyph_status(weight, name):
    path = GLYPH_DIR / weight / f"{name}.svg"
    if not path.exists():
        return None
    m = re.search(r'data-status="(\w+)"', path.read_text())
    return m.group(1) if m else "traced"


def parse_d(d):
    """SVG path data (any commands, absolute or relative) -> contours."""
    pen = RecordingPen()
    parse_path(d, pen)
    contours, cur = [], None
    for op, args in pen.value:
        if op == "moveTo":
            cur = [("M", tuple(args[0]))]
        elif op == "lineTo":
            cur.append(("L", tuple(args[0])))
        elif op == "curveTo":
            cur.append(("C",) + tuple(tuple(a) for a in args))
        elif op == "qCurveTo":
            p0 = cur[-1][-1]
            q, p = args[0], args[-1]
            # quadratic -> cubic (single off-curve point only)
            c1 = (p0[0] + 2 / 3 * (q[0] - p0[0]), p0[1] + 2 / 3 * (q[1] - p0[1]))
            c2 = (p[0] + 2 / 3 * (q[0] - p[0]), p[1] + 2 / 3 * (q[1] - p[1]))
            cur.append(("C", c1, c2, tuple(p)))
        elif op in ("closePath", "endPath"):
            if cur and len(cur) > 1:
                if math.dist(cur[-1][-1], cur[0][1]) > 1e-6:
                    cur.append(("L", cur[0][1]))
                contours.append(cur)
            cur = None
    return contours


def write_metrics(weight, metrics):
    p = GLYPH_DIR / weight / "metrics.json"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(metrics, indent=2) + "\n")


def read_metrics(weight):
    return json.loads((GLYPH_DIR / weight / "metrics.json").read_text())
