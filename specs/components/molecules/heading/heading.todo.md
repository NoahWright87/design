# Heading — Backlog

## Sooner
- [x] Color prop: `color` prop accepting design token semantic names (primary, secondary, danger, etc.) to tint the heading without requiring wrapper CSS.
- [x] Text alignment: `align` prop for left / center / right text alignment.
- [x] Truncation: `truncate` boolean prop that clamps the heading to a single line with an ellipsis on overflow.

## Later
- [x] Decorative underline: `underline` prop (or variant) that renders a styled bottom border/bar beneath the heading — colored, gradient, or animated on hover.
- [x] Eyebrow label: `eyebrow` prop (string) that renders a small uppercase label above the main heading text.
- [x] Gradient text: `gradient` prop/variant that fills the heading text with a primary→secondary gradient.
- [x] Icon prefix/suffix: `iconStart` and `iconEnd` props to render an icon (emoji or component) before or after the heading text.
- [x] Animate on reveal: `animateIn` prop that triggers a fade/slide-in animation when the heading enters the viewport (intersection observer).
- [x] Copy-to-anchor: `anchorLink` prop that reveals a ¶ icon on hover; clicking copies the heading's anchor URL to the clipboard.

## Backlog
- Styling variants: Offer preset heading styles (sans-serif, serif, monospace) or size overrides.
- Typography tokens: Integrate heading font families, sizes, line-heights from design tokens.
- Auto-level hierarchy: Accept text content and infer heading level from context.
- Custom classes/IDs: Allow styling hooks via className and id props.
