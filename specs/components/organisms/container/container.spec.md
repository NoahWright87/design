# Container — Flexible Layout Wrapper

## Purpose
Container is an opinionated flex layout wrapper for building consistent, spaced content regions. It handles direction, padding, spacing between children, background and foreground colors, background images, and gutter styling — removing the need to hand-write flex styles or shadow/border CSS for common layout scenarios.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Optional `direction` — `"vertical"` or `"horizontal"` (default: `"vertical"`).
- Optional `padding` — internal spacing preset: `"none"`, `"xs"`, `"sm"`, `"md"`, `"lg"`, `"xl"`.
- Optional `margin` — external spacing preset: same scale as padding.
- Optional `gap` — spacing between children: same scale.
- Optional `backgroundColor` — named design-system color token: `"background"`, `"foreground"`, `"primary"`, `"secondary"`, `"confirm"`, `"danger"`, `"transparent"`.
- Optional `foregroundColor` — same token set as `backgroundColor`.
- Optional `backgroundImage` — URL string for a CSS background image. Bare URLs are auto-wrapped in `url(...)`. Renders with `background-size: cover` and `background-position: center`.
- Optional `parallax` — fixed-attachment treatment for the background image.
- Optional `width` and `height` — CSS dimension values; numbers are treated as percentages.
- Optional `noGutters` — removes the default side gutter styling on large screens.
- Optional `gutterBorder` — strength of the inset edge line in the gutter area: `"subtle"`, `"medium"`, `"strong"`.
- Optional `gutterShadow` — depth of the gutter drop-shadow: `"sm"`, `"md"`, `"lg"`.
- Optional `children`.
- Optional `style` overrides.

### Outputs
A flex container with the requested layout and visual configuration applied.

### Guarantees / Constraints
- All spacing props (padding, margin, gap) use a fixed named scale, ensuring consistency across uses.
- `backgroundColor` and `foregroundColor` resolve to CSS custom properties (`var(--primary)` etc.) — raw CSS color strings are not accepted.
- `gutterBorder` and `gutterShadow` resolve to BEM modifier classes backed by shadow/color tokens; callers do not write raw CSS.
- `backgroundImage` accepts any valid CSS background-image value or a bare URL string.
- Numeric `width` and `height` are treated as percentages.

## Behavior

Container is a static layout component. It applies the requested flex configuration and visual treatment to its children. There is no interactive behavior.

**Gutter treatment:** By default, wide-screen containers show a subtle inset shadow on the left and right edges (gutter effect). `noGutters` removes this. `gutterBorder` and `gutterShadow` enhance the effect with a visible border line and/or a drop shadow.

**Background image:** When `backgroundImage` is set, the image covers the container with `background-size: cover` and `background-position: center`.

**Parallax:** When `parallax` is enabled alongside a background image, the image stays fixed while content scrolls over it.

## Interface

Container provides a configurable box that arranges its children either vertically (column) or horizontally (row). Color and image backgrounds are fully controllable via named tokens. Gutter variants let callers opt into varying levels of visual depth on large screens.

When parallax is enabled, the background image reads like a fixed backdrop behind the content.

### Named color tokens
`"background"`, `"foreground"`, `"primary"`, `"secondary"`, `"confirm"`, `"danger"`, `"transparent"`

### Gutter border presets
`"subtle"` — very light edge line; `"medium"` — more visible; `"strong"` — prominent.

### Gutter shadow presets
`"sm"` — uses `--shadow-sm`; `"md"` — uses `--shadow-md`; `"lg"` — uses `--shadow-lg`.

## Acceptance
1. Arranges children in the specified direction (vertical or horizontal).
2. Applies internal padding from the selected scale preset.
3. Applies external margin from the selected scale preset.
4. Applies the specified gap between children.
5. `backgroundColor` and `foregroundColor` render the correct design-system color token.
6. `backgroundImage` renders with cover sizing and centered position.
7. Width and height are applied correctly; numeric values are treated as percentages.
8. Nested containers compose correctly.
9. `noGutters` removes the default side gutter styling.
10. `gutterBorder` applies the correct border intensity via a BEM modifier class.
11. `gutterShadow` applies the correct shadow depth via a BEM modifier class.
12. Style overrides apply to the root wrapper.
13. When `parallax` is enabled with a background image, the backdrop remains fixed while content scrolls.
