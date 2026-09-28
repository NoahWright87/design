# Wright Sans build pipeline

Turns the four specimen sheets in `specimens/` into real font files in
`src/styles/fonts/` (`.woff2` for the web, `.otf` for design tools).

## Rebuild

```bash
pip install -r scripts/wright-sans/requirements.txt
python3 scripts/wright-sans/build.py            # all weights
python3 scripts/wright-sans/build.py black      # just one
```

## How it works

1. **`extract.py`**: finds the seven rows on each sheet and splits them into
   glyphs by connected component, so tightly packed letters (e.g. `WXY` on the
   Black sheet) come apart cleanly. Anti-aliased edge pixels go to the nearest
   glyph.
2. **`trace.py`**: upsamples each glyph 8×, traces it with potrace, then
   straightens near-straight curves, merges collinear segments, snaps long
   edges to true vertical and horizontal, and snaps points to baseline,
   x-height, cap height, ascender, and descender.
3. **`build.py`**: normalizes each specimen row to a 1000-unit em (cap height
   700), spaces glyphs from their side profiles, builds accented letters from
   the traced accent marks, derives extra glyphs (dashes, curly quotes,
   `¡¿…·<>^|~`), auto-kerns diagonal and overhanging pairs, and writes CFF
   OpenType + WOFF2 with fontTools.

Tuning knobs live at the top of `build.py` (`WEIGHTS`: base side bearing and
space width per weight).
