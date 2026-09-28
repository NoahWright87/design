# Wright Sans Typeface — Spec

## Purpose
Wright Sans is the design system's display typeface for headings. It is a wide, squared-off geometric sans with rounded corners and a technical feel, giving headings a distinctive brand voice while body copy stays in the system font. The font files are traced from the four specimen sheets (Regular, SemiBold, Bold, Black) so the shipped font matches the approved drawings.

## Related
- [Design System Base Spec](../design-system.spec.md)
- Specimen sheets and build pipeline: `scripts/wright-sans/`
- [Fonts example](../examples/fonts.spec.md) (Storybook: Examples / Fonts)

## Contract

### Inputs
- **Font family name:** "Wright Sans", available once the theme stylesheet is loaded.
- **Weights:** Regular (400), SemiBold (600), Bold (700), Black (900). Upright only.
- **Heading token:** the heading font token resolves to Wright Sans, falling back to the body font. The theme applies it to every heading level by default.

### Outputs
- One compressed web font file per weight, bundled next to the package stylesheet.
- A desktop font file per weight in the repository for design tools.

### Guarantees / Constraints
- Character coverage includes the full basic Latin keyboard set, curly quotes, en and em dashes, ellipsis, middle dot, inverted exclamation and question marks, and accented vowels with grave, acute, tilde, and dieresis, plus ç and ñ in both cases.
- Text stays readable while the font downloads: the browser shows the fallback font immediately and swaps in Wright Sans when it arrives.
- Figures are proportional by default, so years and numbers in headings set evenly with no gaps around narrow digits like "1". Equal-width (tabular) figures are available through the standard tabular-figures switch, for tables, timers, and counters that must line up or hold still as they change.
- Each weight is a small download, suitable for loading all four without a noticeable cost.
- Each glyph's outline lives in its own editable SVG file. Tracing from the specimen sheets produces the first draft; hand corrections are marked as edited and survive re-tracing. The glyph files, not the sheets, are the source of truth for the shipped shapes.

## Behavior
Every heading, and any other element that uses the heading token, renders in Wright Sans. The browser picks the closest of the four weights for the requested font weight, so a bold heading gets the Bold drawing and a black-weight heading gets the Black drawing rather than a synthesized bold.

Spacing is set snugly for display use, close to the specimen sheets while leaving every pair a visible gap. Common awkward pairs such as "AV", "To", and "L’" are kerned so that diagonal and overhanging letters tuck together. Pairs that would otherwise meet, such as two f's whose crossbars face each other or a T beside another T, are pushed apart: flat edges facing each other keep nearly a full gap, while diagonals touching at a single point may sit a little closer.

Characters outside the supported set fall back to the system sans-serif.

Each digit takes its own width with even space on both sides. With tabular figures switched on, digits share one width per weight and sit centred in it.

The pipeline cuts each specimen sheet into individual letters and traces them. It then rebuilds each outline from true straight lines and as few curves as possible. Corners become either crisp or cleanly round, depending on what the source shows. Edges are aligned to the shared baseline, x-height, cap-height, ascender and descender lines, and everything is written out as one editable file per glyph. A reviewer, human or agent, then compares every glyph against the source drawing, fixes what the tracer got wrong, and marks those glyphs as edited. Accent marks too small to trace cleanly are rebuilt as even strokes that match the traced shape. The build spaces letters from their side profiles, builds accented letters from the marks, and compiles the fonts.

## Interface
- Headings use Wright Sans as soon as the theme stylesheet is loaded. A site that wants a different heading font sets the heading token (or the matching theme field). Each weight downloads only when a page actually uses it.
- Designers can install the desktop font files to mock up headings in design tools.
- The Fonts pages in Storybook show every weight in a weight ramp, the full character set, display sizes, the type scale, and a heading over body text.

## Acceptance
1. Loading the theme stylesheet registers "Wright Sans" at weights 400, 600, 700, and 900.
2. The heading font token resolves to Wright Sans with the body font as fallback, and every heading level renders in Wright Sans.
3. `npm run build` emits the four web font files alongside the package stylesheet and the stylesheet references them.
4. Every character listed under Guarantees renders from Wright Sans in each weight.
5. Kerned pairs such as "AV" and "To" set visibly tighter than unkerned text.
6. By default digits have their own widths, so "2011–2026" sets without wide gaps around each "1"; with tabular figures switched on, every digit in a weight has the same advance width.
7. Re-running the trace step leaves glyphs marked as edited untouched.
8. Running the build from the glyph files reproduces the font files.
9. Straight edges are single lines and round corners are single curves; the glyph lint reports no tiny segments or stray nodes.
10. At display sizes, no two letters or digits touch with kerning on, including "ff", "TT", "ss", and "1111".
