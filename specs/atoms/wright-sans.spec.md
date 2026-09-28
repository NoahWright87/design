# Wright Sans Typeface — Spec

## Purpose
Wright Sans is the design system's display typeface for headings. It is a wide, squared-off geometric sans with rounded corners and a technical feel, giving headings a distinctive brand voice while body copy stays in the system font. The font files are traced from the four specimen sheets (Regular, SemiBold, Bold, Black) so the shipped font matches the approved drawings.

## Related
- [Design System Base Spec](../design-system.spec.md)
- Specimen sheets and build pipeline: `scripts/wright-sans/`
- Storybook: Examples / Wright Sans

## Contract

### Inputs
- **Font family name:** "Wright Sans", available once the theme stylesheet is loaded.
- **Weights:** Regular (400), SemiBold (600), Bold (700), Black (900). Upright only.
- **Heading token:** the heading font token resolves to Wright Sans with the system sans-serif as a fallback.

### Outputs
- One compressed web font file per weight, bundled next to the package stylesheet.
- A desktop font file per weight in the repository for design tools.

### Guarantees / Constraints
- Character coverage includes the full basic Latin keyboard set, curly quotes, en and em dashes, ellipsis, middle dot, inverted exclamation and question marks, and accented vowels with grave, acute, tilde, and dieresis, plus ç and ñ in both cases.
- Text stays readable while the font downloads: the browser shows the fallback font immediately and swaps in Wright Sans when it arrives.
- Figures are tabular: every digit takes the same width, so numbers line up in columns and counters do not jitter as they change.
- Each weight is a small download, suitable for loading all four without a noticeable cost.
- Each glyph's outline lives in its own editable SVG file. Tracing from the specimen sheets produces the first draft; hand corrections are marked as edited and survive re-tracing. The glyph files, not the sheets, are the source of truth for the shipped shapes.

## Behavior
Any element that uses the heading token renders in Wright Sans. The browser picks the closest of the four weights for the requested font weight, so a bold heading gets the Bold drawing and a black-weight heading gets the Black drawing rather than a synthesized bold.

Spacing is set tightly for display use: letters sit close together, the way they do on the specimen sheets. Common awkward pairs such as "AV", "To", and "L’" are kerned so that diagonal and overhanging letters tuck together.

Characters outside the supported set fall back to the system sans-serif.

Digits all share one width per weight and sit centred in it, so a "1" has generous space on both sides.

The pipeline cuts each specimen sheet into individual letters and traces them. It then rebuilds each outline from true straight lines and as few curves as possible. Corners become either crisp or cleanly round, depending on what the source shows. Edges are aligned to the shared baseline, x-height, cap-height, ascender and descender lines, and everything is written out as one editable file per glyph. A reviewer, human or agent, then compares every glyph against the source drawing, fixes what the tracer got wrong, and marks those glyphs as edited. Accent marks too small to trace cleanly are rebuilt as even strokes that match the traced shape. The build spaces letters from their side profiles, builds accented letters from the marks, and compiles the fonts.

## Interface
- Consumers opt in by using the heading font token on their headings; the font is registered by the theme stylesheet and costs nothing until a page actually uses it.
- Designers can install the desktop font files to mock up headings in design tools.
- The Storybook specimen page shows every weight with its full character set, plus a sample heading hierarchy.

## Acceptance
1. Loading the theme stylesheet registers "Wright Sans" at weights 400, 600, 700, and 900.
2. The heading font token resolves to Wright Sans with a sans-serif fallback.
3. `npm run build` emits the four web font files alongside the package stylesheet and the stylesheet references them.
4. Every character listed under Guarantees renders from Wright Sans in each weight.
5. Kerned pairs such as "AV" and "To" set visibly tighter than unkerned text.
6. Every digit in a weight has the same advance width.
7. Re-running the trace step leaves glyphs marked as edited untouched.
8. Running the build from the glyph files reproduces the font files.
9. Straight edges are single lines and round corners are single curves; the glyph lint reports no tiny segments or stray nodes.
