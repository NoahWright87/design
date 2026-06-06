# Card — Content Container with Optional Elevation

## Purpose
Card groups related content into a visually distinct, rounded container. It supports an optional title, subtitle, footer, and elevation, making it suitable for dashboards, listings, profile panels, and anywhere content needs clear visual grouping.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Optional image content rendered above the title.
- Optional `href` for rendering the card as a fully clickable destination.
- Optional title, subtitle, children content, and footer.
- Optional elevated flag for added visual prominence.
- Optional interactive flag for hover-lift behavior.
- Optional additional CSS class name and other HTML attributes to spread onto the card element.

### Outputs
A rounded, themed container holding the provided content sections. Elevated cards appear to float higher above the page.

### Guarantees / Constraints
- Title, subtitle, and footer sections are only rendered when provided; empty sections are omitted entirely.
- Interactive hover behavior respects the user's reduced-motion preference.
- The card uses semantic article markup to represent self-contained content.

## Behavior

**Default:** Content is statically displayed within the rounded container. No hover effects.

**Elevated:** The card appears more visually prominent — a stronger shadow gives the impression of higher elevation.

**Interactive:** When interactive mode is enabled, hovering over the card lifts it slightly. The shadow intensifies and the card shifts upward. When reduced motion is preferred, the lift is skipped.

**Elevated and interactive:** The hover lift is proportionally larger than on a non-elevated interactive card.

**Image:** When image content is provided, it appears as a top media section above the title and content, with the card's rounded corners preserved.

**Link card:** When `href` is provided, the card renders as a single clickable surface and preserves the same visual styling.

## Interface

### Layout
The card has a rounded border and themed background. Internal sections are arranged vertically: optional image at the top, title below it, subtitle below that, main content in the middle, and footer at the bottom with a subtle separator above it.

### CardFooter
CardFooter is a layout companion for the card's footer area. It arranges its children horizontally with configurable alignment — left, right, centered, or spread. The default alignment places content at the trailing end, suited for action buttons.

### Visual States
- **Default** — flat with a subtle shadow.
- **Elevated** — stronger shadow for visual prominence.
- **Interactive hover** — card lifts with increased shadow.

## Acceptance
1. Renders a container with the title when provided; omits the title section when not.
2. Renders the subtitle when provided; omits when not.
3. Renders the main content in the content area.
4. Renders the footer below the content with a top separator when provided.
5. Applies elevated styling when the elevated flag is set.
6. Interactive cards show a hover lift and shadow change on hover.
7. Interactive cards show no lift when the user prefers reduced motion.
8. CardFooter renders its children in a horizontal row with the configured alignment.
9. CardFooter defaults to trailing (end) alignment.
10. Additional class names and HTML attributes are applied to the card element.
11. When image content is provided, it renders above the title as a top media section.
12. When `href` is provided, the full card surface is clickable and keyboard-focusable.
