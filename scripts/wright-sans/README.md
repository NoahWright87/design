# Wright Sans build pipeline

Turns the four specimen sheets in `specimens/` into font files in
`src/styles/fonts/` (`.woff2` for the web, `.otf` for design tools).

The per-glyph SVGs in `glyphs/<weight>/` are the **source of truth**: tracing
writes them, people and agents correct them, and the build compiles them.

```
specimens/*.png ──trace.py──▶ glyphs/<weight>/*.svg ──build.py──▶ src/styles/fonts/
                                   ▲        │
                   hand edits,     │        ├─ inspect_glyphs.py  (visual review)
                   recipes.py ─────┘        └─ lint_glyphs.py     (suspect finder)
```

## Rebuild

```bash
pip install -r scripts/wright-sans/requirements.txt
python3 scripts/wright-sans/trace.py      # specimens -> glyph SVGs (keeps hand-edited ones)
python3 scripts/wright-sans/recipes.py    # constructed redraws for tiny marks (keeps edited ones)
python3 scripts/wright-sans/build.py      # glyph SVGs -> .otf + .woff2
python3 scripts/wright-sans/proof.py      # specimen image from the built fonts
```

To review and hand-correct outlines, follow `.claude/commands/wright-sans-cleanup.md`
(also runnable as the `/wright-sans-cleanup` command in Claude Code).

## Files

| File | Role |
| --- | --- |
| `extract.py` | Finds the rows on each sheet and cuts them into glyphs by connected component. |
| `fit.py` | Turns a noisy trace into straight lines + fitted cubic beziers, with crisp or true-round corners and axis/metric snapping. |
| `trace.py` | Stage 1: potrace + `fit.py` + mechanical autofix → glyph SVGs, `metrics.json`, `_source/` bitmaps. |
| `glyphsvg.py` | Reads and writes the glyph SVG format (font units, y-up, `data-status`). |
| `lint_glyphs.py` | Flags suspects (near-metric, near-axis, kinks, tiny segments…); `--fix` applies the mechanical fixes. |
| `inspect_glyphs.py` | Renders outlines with nodes, handles and metrics, optionally over the source bitmap. |
| `construct.py`, `recipes.py` | Rebuild tiny/noisy glyphs as clean strokes along a centerline. |
| `build.py` | Stage 2: spacing, proportional + tabular figures, accented composites, derived glyphs, kerning → fonts. |
| `proof.py` | Specimen render of the built fonts. |

## Glyph SVG format

Path data is in font units with y pointing up (baseline 0, cap height 700);
the file flips it for previewing. `data-status="traced"` files may be
regenerated; `data-status="edited"` files are never overwritten unless you
run `trace.py --force --glyph NAME`. Say what you changed in `<desc>`.

## Design decisions baked into the build

- **Figures are proportional by default:** each digit has its own advance with
  even side bearings. Tabular copies (`zero.tf` … `nine.tf`, one shared advance,
  centred) ship behind the OpenType `tnum` feature.
- **Collision floor in kerning:** after the tightening kerns, any letter/digit
  pair that comes closer than 60% of the target gap (90% where flat edges face
  each other over several scanlines) is pushed apart with a positive kern.
- Corners rounder than ~16 units (one source pixel) are kept round; tighter
  ones are treated as blur and made crisp.
- The `i`/`j` dot is normalized to a crisp hexagon aligned with the stem, and
  `ı` reuses the `i` stem, so accented i's match.
