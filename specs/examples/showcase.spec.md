# Showcase — Full-Page Component Composition

## Purpose
The Showcase example composes multiple core components into a realistic full-page layout, demonstrating how they work together. It serves as a visual integration reference and a starting point for understanding common layout and interaction patterns.

## Related
- [Design System Base Spec](../design-system.spec.md)

## Contract

### Inputs
User interaction: clicking the button to open the modal, interacting with the modal.

### Outputs
A complete page with header, hero section, card grid, modal trigger, typography section, and footer.

### Guarantees / Constraints
- All components render without errors.
- The modal opens and closes correctly.
- There is no routing or form submission — this is an illustrative example.

## Behavior

The page is static except for the modal. Clicking the modal trigger button opens a dialog. The modal can be dismissed via its close button, action buttons, or by clicking outside.

## Interface

### Page Structure
- **Header** — fixed at top.
- **Hero section** — a prominent heading, body text, buttons, and a link.
- **Cards section** — three cards in a responsive grid; one card with added visual prominence.
- **Modal trigger** — a button that opens a demonstration dialog.
- **Typography section** — heading and text demonstrating combinations.
- **Footer** — at the bottom.

### Modal
The modal shows a title, descriptive text, and two action buttons. It closes via button, close icon, or clicking the backdrop.

### Responsive Behavior
The card grid reflows from a multi-column layout on wide screens to a single column on narrow screens.

## Acceptance
1. Header, footer, and all page sections render without errors.
2. Content is centered with appropriate padding.
3. Hero section shows heading and body text.
4. Buttons and links are visible and clickable.
5. Cards render with titles and appropriate styling.
6. The modal trigger button opens the modal dialog.
7. The modal shows title, content, and action buttons.
8. The modal closes when dismissed via any supported method.
9. The card grid reflows correctly on narrow viewports.
