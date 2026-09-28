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
- Each weight is a small download, suitable for loading all four without a noticeable cost.
- The fonts are regenerated from the specimen sheets by the build pipeline; the sheets are the source of truth for letter shapes.

## Behavior
Any element that uses the heading token renders in Wright Sans. The browser picks the closest of the four weights for the requested font weight, so a bold heading gets the Bold drawing and a black-weight heading gets the Black drawing rather than a synthesized bold.

Spacing is set tightly for display use: letters sit close together, the way they do on the specimen sheets. Common awkward pairs such as "AV", "To", and "L’" are kerned so that diagonal and overhanging letters tuck together.

Characters outside the supported set fall back to the system sans-serif.

The pipeline cuts each specimen sheet into individual letters, traces them into smooth outlines, straightens nearly-straight edges, aligns letters to shared baseline, x-height, and cap-height lines, spaces them from their side profiles, and builds accented letters from the traced accent marks.

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
6. Running the build pipeline from the specimen sheets reproduces the font files.
