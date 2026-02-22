# Text — Backlog

## Sooner
- [x] `truncate` prop: Single-line ellipsis overflow truncation.
- [x] `maxLines={n}` prop: Multi-line truncation with ellipsis via CSS line-clamp.
- [x] `as` prop: Decouple semantic HTML element from visual style (e.g., `<Text as="figcaption" variant="caption">`). Improves a11y and semantic correctness.
- [x] `align` prop: `"left" | "center" | "right" | "justify"` text alignment.
- [x] `balance` prop: Applies `text-wrap: balance` for natural line breaks in short text blocks and headings.
- [x] Tone variants: `muted`, `subtle`, `error`, `success` for contextual text (form hints, captions, status).

## Later
- [ ] `isCopyable` prop: Shows a clipboard copy button on hover.
- [x] Inline/block control: Explicit prop to render as inline (`<span>`) vs block (`<p>`/`<div>`).

## Backlog
- Styling variants: Size (small, regular, large), weight (light, regular, bold), color (primary, secondary, muted).
- Typography tokens: Integrate font families, sizes, line-heights from design tokens.
- Inline elements: Support for emphasis, strong, code, mark, etc.
- Custom classes: Allow className prop for custom styling.
