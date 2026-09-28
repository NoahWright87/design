# /wright-sans-cleanup — review and hand-correct Wright Sans glyph outlines

Use this command to improve the Wright Sans typeface after tracing, or after the specimen sheets change. The Python pipeline in `scripts/wright-sans/` gets the outlines most of the way; your job is the part a script cannot do: look at every glyph, compare it with the source drawing, and fix what is wrong by editing the SVG path data directly.

The per-glyph SVG files in `scripts/wright-sans/glyphs/<weight>/` are the source of truth. The font files in `src/styles/fonts/` are build output.

## Ground rules

- Coordinates are font units, y-up: baseline 0, cap height 700, x-height/ascender/descender per weight in `glyphs/<weight>/metrics.json`. One source pixel is about 16 units, so a traced wobble under ~8 units is noise, not design.
- Every glyph you correct gets `data-status="edited"` on its root `<svg>` and a short note in its `<desc>` saying what you changed and why. `trace.py` leaves edited glyphs alone.
- Only ever combine `trace.py --force` with `--glyph NAME`. A bare `--force` re-traces every glyph in the weight and wipes out hand edits.
- Commit the glyph SVGs as you go; they are the work product.

## 1. Set up and trace

```bash
pip install -r scripts/wright-sans/requirements.txt
python3 scripts/wright-sans/trace.py          # writes traced glyphs + _source/ bitmaps; keeps edited ones
python3 scripts/wright-sans/recipes.py        # constructed redraws for tiny marks (skips edited ones)
```

`trace.py` already fits clean lines and beziers and applies the mechanical fixes (axis alignment, metric snapping, tiny-segment removal, flat curves to lines, small kink smoothing).

## 2. Find suspects

```bash
python3 scripts/wright-sans/lint_glyphs.py --summary      # per-glyph counts
python3 scripts/wright-sans/lint_glyphs.py bold           # details for one weight
```

Lint findings are suspects, not orders. An angled edge a few degrees off vertical can be deliberate (the parentheses are). Judge each one visually.

## 3. Look at every glyph

Render contact sheets and read them — lint catches geometry slips, only your eyes catch wrong shapes.

```bash
python3 scripts/wright-sans/inspect_glyphs.py regular A_ B_ C_ ... --cols 13 --scale 0.15 --out /tmp/caps.png
python3 scripts/wright-sans/inspect_glyphs.py black eight --source --scale 0.5 --out /tmp/eight.png
```

`--source` puts the specimen bitmap under the outline (blue tint where they agree; dark grey shows source ink the outline misses). Red squares are on-curve nodes, blue dots are handles, green lines are the metrics. File stems: uppercase letters end in `_` (`A_`), others use glyph names (`a`, `zero`, `ampersand`, `grave.cap`, `cedilla.lc`, `dotlessi`, `endash`).

Review in this order: caps, lowercase, digits, punctuation, marks — first one weight at a time against `--source`, then the same glyphs across all four weights side by side. Check:

1. **Shape matches the source.** Bumps, dents, chamfers where the source is round (or the reverse), missing or extra pieces.
2. **Corners.** A corner is either crisp or a clear round. Rounding smaller than ~16 units is blur: make it crisp. Similar corners in one glyph share a radius; mirrored parts (both sides of an 8, both stems of an H) match.
3. **Related glyphs agree.** Stem widths and terminals across `n m h u`, bowls across `b d p q`, dots across `i j`, slants across ascender tops, the same construction in every weight (the source sheets are AI-generated and sometimes disagree with themselves — normalize to the clearest version and note it).
4. **Metrics.** Flat tops and bottoms sit exactly on baseline, x-height, cap height, ascender, descender. Round shapes may overshoot by a few units only if they do so consistently.
5. **Economy.** Straight edges are single lines. A round corner is one cubic. No stray nodes in the middle of straight edges, no handles longer than their segment, no loops.

## 4. Fix by editing the path

Open the SVG and rewrite the `d` attribute of `<path id="outline">` (absolute `M L C Z` commands are easiest; anything valid parses). Set `data-status="edited"` and update `<desc>`.

Useful geometry:

- **Round 90° corner** of radius `r` from a horizontal edge into a vertical one: end the line `r` before the corner, then `C` with each handle `0.552 * r` long along its edge. Example, top-left corner at (0, 700), r = 60: `L0 640 C0 673 27 700 60 700`.
- **Other angles:** handle length = `4/3 * tan(θ/4) * r` for a turn of θ.
- **Smooth join:** the handles on both sides of a node are collinear with it.
- **Mirroring:** a symmetric part at `x` maps to `left + right - x`; copy the good side and mirror the numbers rather than trusting two traces.
- **Parallel slants:** reuse one slope (rise/run) for edges that should be parallel (e.g. the `i` dot and the stem top).

When a glyph is too small or noisy to fix node by node (accent marks, small punctuation), describe it as a stroke along a centerline and add a recipe to `scripts/wright-sans/recipes.py` using `construct.py` — it matches the traced ink area, fillets the corners and refits clean beziers.

## 5. Verify

```bash
python3 scripts/wright-sans/inspect_glyphs.py <weight> <glyphs...> --source --out /tmp/check.png   # re-look
python3 scripts/wright-sans/lint_glyphs.py --glyph <glyphs...>
python3 scripts/wright-sans/build.py
python3 scripts/wright-sans/proof.py --out /tmp/proof.png       # full specimen from the built fonts
npm run build
```

Look at the proof at text size too: fixes should read better, not just look tidier zoomed in. Then update `CHANGELOG.md` (WIP) and, if behavior changed, `specs/atoms/wright-sans.spec.md`, and commit the SVGs, fonts and scripts together.
