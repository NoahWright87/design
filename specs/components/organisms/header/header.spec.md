# Header — Fixed Navigation Bar with Three Slots

## Purpose
Header provides a fixed navigation bar with three content regions — left, center, and right — for flexible header compositions. Optional text labels can accompany slot content and hide automatically on smaller screens.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Layout component](../layout/layout.spec.md)

## Contract

### Inputs
- Optional content for left, center, and right slots.
- Optional text labels for each slot (visible on desktop, hidden on mobile).

### Outputs
A fixed header bar with up to three content regions rendered at the top of the viewport.

### Guarantees / Constraints
- The header maintains its position at the top of the viewport as users scroll.
- Labels use responsive CSS to hide automatically on small screens without JavaScript.
- Slot content receives no additional styling from the header itself.

## Behavior

Header is a layout container. Its behavior is determined by the content placed in each slot — interactive elements like menus, buttons, and avatars behave according to their own specs. The header positions and sizes its slots but manages no state of its own.

## Interface

The header spans the full width of the viewport and is fixed at the top. Three columns hold left, center, and right slot content. Labels, when provided, appear next to their slot content on desktop screens and disappear on mobile.

The header uses the theme background color. Slot content and labels use the theme foreground color.

## Acceptance
1. Renders a semantic header element fixed at the top of the viewport.
2. Content appears in the correct left, center, and right columns.
3. Labels display next to slot content on desktop.
4. Labels are hidden on mobile-sized viewports.
5. Header remains visible while page content scrolls beneath it.
