# Showcase — Full-Page Component Composition

## Purpose
The Showcase example composes multiple core components into a realistic full-page layout, demonstrating how they work together. It serves as a visual integration reference and a starting point for understanding common layout and interaction patterns.

## Related
- [Design System Base Spec](../design-system.spec.md)

## Contract

### Inputs
User interaction: section navigation, contact and address fields, form submission/reset, and modal controls.

### Outputs
A complete page with header, hero section, card grid, modal trigger, typography section, and footer.

### Guarantees / Constraints
- All components render without errors.
- The modal opens and closes correctly.
- Form submission remains local and confirms the entered information without a network request.
- The page supplies a title and description while mounted and restores previous metadata when leaving.

## Behavior

Section links navigate to Projects, Contact, Address, and Confirmation; a skip link moves keyboard focus to the main content. Contact fields include required name/email, a reason selector, response preference, and consent. Address fields include required street, city, postal code, and country. Submission displays all required errors together and focuses the first invalid field. Valid submission shows a local confirmation; Reset clears fields and feedback. Opening the confirmation dialog focuses its first control, Tab remains within it, and closing returns focus to the opener. Entrance transitions respect reduced-motion preferences.

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
10. Contact and address forms validate all required fields, reject malformed email, and show local success feedback for valid submissions.
11. Reset clears the form values and feedback.
12. Section links and the skip link move users to their intended content.
13. Modal keyboard focus stays within the open dialog and returns to the opener when closed.
14. Page title and description are installed while mounted and restored on cleanup.
15. Desktop and mobile screenshots cover the page, invalid forms, successful forms, and open dialog.
