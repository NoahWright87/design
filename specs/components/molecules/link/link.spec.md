# Link — Styled Anchor with Motion, Variants, and Router Support

## Purpose
Link renders a styled anchor element for navigation and external links. It applies design-system typography, hover/focus animations, optional icon slots, and an external-link indicator. It can be swapped to render via a client-side router component (Next.js, React Router) without losing any styling.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- A destination URL or path (`href`, required).
- Visible link text or content (`children`, required).
- Optional `isExternal` flag — marks a link as external.
- Optional `motion` — hover animation preset: `"none"`, `"once"`, `"pulsing"` (default: `"pulsing"`).
- Optional `variant` — visual style: `"default"`, `"subtle"`, `"prominent"` (default: `"default"`).
- Optional `leadingIcon` — React node rendered before the link text.
- Optional `trailingIcon` — React node rendered after the link text.
- Optional `className` — additional CSS class name applied to the root element.
- Optional `as` — custom component to render instead of `<a>` (e.g., Next.js Link, React Router Link).

### Outputs
A styled anchor element (or the component provided by `as`) with appropriate hover, focus, and motion behavior.

### Guarantees / Constraints
- When `as` is omitted, the rendered element is always a native `<a>`.
- When `as` is provided, `href` and all anchor-compatible props are forwarded to that component.
- `isExternal` always adds `target="_blank" rel="noopener noreferrer"` regardless of `as`.
- Focus styles use design system color tokens and are keyboard-visible.
- All animations respect `prefers-reduced-motion`.

## Behavior

**Default:** The link is styled using the primary color with a persistent underline. Hover triggers the selected motion animation.

**Focused:** A visible focus indicator appears using the primary color.

**External (`isExternal`):** Adds `target="_blank"` and `rel="noopener noreferrer"`. An animated `↗` indicator is rendered after the link text.

**Icon slots:** When `leadingIcon` or `trailingIcon` is provided, the link switches to `inline-flex` layout and the icon is rendered inside an `aria-hidden` span.

**Router link (`as`):** The link renders as the provided component, receiving `href` and all styling/classes. For React Router's `to` prop, callers wrap: `as={({ href, ...p }) => <RouterLink to={href} {...p} />}`.

## Interface

### Variants
- **default** — primary color, always underlined.
- **subtle** — muted color, underline on hover only; for low-emphasis secondary links.
- **prominent** — primary color, bold, always underlined; for call-to-action links.

### Motion Presets
- **none** — no animation on hover.
- **once** — slingshot animation plays once on hover-in; resets on hover-out.
- **pulsing** — continuous brightness oscillation while hovered (default).

### External Indicator
The `↗` arrow is rendered inside an `aria-hidden` span and animates along with the link's motion preset.

## Acceptance
1. Renders the link text and navigates to `href` when activated.
2. Applies the correct variant class for default, subtle, and prominent.
3. Applies the correct motion behavior for none, once, and pulsing.
4. When `isExternal` is set, adds `target="_blank"` and `rel="noopener noreferrer"` and renders the `↗` indicator.
5. When `leadingIcon` is provided, renders it before the link text in an `aria-hidden` span.
6. When `trailingIcon` is provided, renders it after the link text in an `aria-hidden` span.
7. When `as` is provided, the custom component renders with `href` and all styling applied.
8. A visible focus indicator appears when the link receives keyboard focus.
9. All animations are suppressed under `prefers-reduced-motion`.
10. Is fully keyboard-navigable (Tab, Enter).
