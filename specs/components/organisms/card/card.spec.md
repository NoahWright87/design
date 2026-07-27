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
- Optional longer description, shown only once the card expands into its modal-like view.
- Optional choice of where the image sits once expanded — above the title, or between the short and long description.
- Optional controlled expanded state, an initial expanded state, and a callback fired whenever the expanded state changes.
- Optional accessible labels for the expand and collapse buttons.

### Outputs
A rounded, themed container holding the provided content sections. Elevated cards appear to float higher above the page. When a longer description is provided, the card also outputs an expand button and, once activated, a larger modal-like view of the same card grown from its original position.

### Guarantees / Constraints
- Title, subtitle, and footer sections are only rendered when provided; empty sections are omitted entirely.
- Interactive hover behavior respects the user's reduced-motion preference.
- The card uses semantic article markup to represent self-contained content.
- A card only becomes expandable when a longer description is supplied; without one, the card behaves exactly as it always has.
- The expand and grow animations respect the user's reduced-motion preference, jumping directly between states with no motion.
- Pressing Escape, clicking outside the expanded card, or clicking its dedicated shrink button always collapses it.
- The expanded card is presented above the rest of the page behind a darkened, non-interactive backdrop, so at most one card can be expanded at a time.

## Behavior

**Default:** Content is statically displayed within the rounded container. No hover effects.

**Elevated:** The card appears more visually prominent — a stronger shadow gives the impression of higher elevation.

**Interactive:** When interactive mode is enabled, hovering over the card lifts it slightly. The shadow intensifies and the card shifts upward. When reduced motion is preferred, the lift is skipped.

**Elevated and interactive:** The hover lift is proportionally larger than on a non-elevated interactive card.

**Image:** When image content is provided, it appears as a top media section above the title and content, with the card's rounded corners preserved.

**Link card:** When `href` is provided, the card renders as a single clickable surface and preserves the same visual styling.

**Expandable, collapsed:** When a longer description is provided, an expand button appears on the card. If no short content was given, the card shows a preview of the longer description, cut off with an ellipsis so the card does not grow to fit the full text. If short content was given, that short content is shown instead and the longer description stays hidden entirely until the card expands.

**Expandable, no `href`:** Clicking anywhere on the card (in addition to the expand button) expands it.

**Expandable, with `href`:** Clicking the card follows the link as normal. Expanding requires the dedicated expand button, since the card's click already has a job.

**Expanding:** The card grows in place, starting from its exact position and size on the page and easing into a larger, centered view, overshooting its full size slightly before settling — the same bouncy, springy motion used throughout the system. The rest of the page darkens behind it and becomes non-interactive. The longer description becomes visible, the image grows and (by default) moves between the short and long description, and a shrink button appears. If the expanded content is taller than the available space, it scrolls within the expanded card.

**Collapsing:** The expanded card eases into shrinking back toward its original position and size, overshoots the shrink slightly, then settles exactly back into the spot it grew from. The backdrop fades out at the same time.

## Interface

### Layout
The card has a rounded border and themed background. Internal sections are arranged vertically: optional image at the top, title below it, subtitle below that, main content in the middle, and footer at the bottom with a subtle separator above it.

### CardFooter
CardFooter is a layout companion for the card's footer area. It arranges its children horizontally with configurable alignment — left, right, centered, or spread. The default alignment places content at the trailing end, suited for action buttons.

### Expanded view
The expand button sits in the card's top-right corner as a small square icon button. Once expanded, the card presents the same title, subtitle, and short content as before, followed by the larger image (unless positioned at the top) and then the full longer description, with a matching shrink button in the same top-right corner. The expanded card keeps the collapsed card's rounded corners, background, and elevation styling, just larger and centered on a darkened backdrop.

### Visual States
- **Default** — flat with a subtle shadow.
- **Elevated** — stronger shadow for visual prominence.
- **Interactive hover** — card lifts with increased shadow.
- **Expandable, collapsed** — an expand button is visible; the card's cursor indicates it is clickable when not also a link.
- **Expanded** — the card is enlarged, centered over a darkened backdrop, with the shrink button, longer description, and repositioned image visible.

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
13. Providing a longer description makes the card expandable; without it, no expand button appears and the card is unaffected.
14. When only a longer description is given (no short content), the collapsed card shows a truncated, ellipsis-cut preview of it.
15. When both short content and a longer description are given, the collapsed card shows only the short content; the longer description stays hidden until expanded.
16. Clicking the expand button expands the card; clicking anywhere else on the card also expands it unless `href` is set.
17. When `href` is set, only the expand button expands the card; clicking elsewhere on the card follows the link.
18. Expanding grows the card in place from its original position and size into a larger, centered view with a bouncy overshoot, and darkens the rest of the page.
19. While expanded, the longer description is visible, and the image is enlarged and repositioned according to the configured expanded image position.
20. Pressing Escape, clicking the backdrop outside the expanded card, or clicking the shrink button collapses the expanded card back to its original position and size with a bouncy overshoot.
21. The expand and collapse animations are skipped when the user prefers reduced motion; the card jumps directly between collapsed and expanded states.
