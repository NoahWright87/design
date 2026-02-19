# Modal — Centered Dialog with Backdrop

## Purpose
Modal presents content in a centered overlay dialog that interrupts the current context to demand user attention. It supports a title, body content, a close button, and configurable action buttons, and dismisses via user action.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Button component](../../molecules/button/button.spec.md)

## Contract

### Inputs
- Visibility flag (required).
- Close callback (required).
- Optional title, body content, and action buttons.
- Optional flag to allow or prevent closing by clicking the backdrop (default: allowed).
- Optional custom close button label.

### Outputs
When open: a backdrop overlay covering the page and a dialog panel containing the title, content, actions, and close button. When closed: nothing is rendered.

### Guarantees / Constraints
- Pressing Escape always closes the modal regardless of the backdrop-close setting.
- When no custom actions are provided, a default action button is shown.
- The close callback is always called when the modal closes, with an identifier indicating how it was dismissed.

## Behavior

**Closed:** Nothing is rendered.

**Open:** The backdrop covers the page. The dialog panel appears centered, containing the title, content, and actions.

**Backdrop click:** Closes the modal if the backdrop-close setting permits.

**Close button:** Always closes the modal.

**Action buttons:** Call their respective handlers and close the modal with the action's identifier.

**Escape key:** Always closes the modal.

## Interface

The backdrop is a semi-transparent overlay covering the full viewport. The dialog appears centered — rounded corners, themed background, and a close button in the header area. The title appears at the top; body content fills the middle; action buttons sit at the bottom.

When the content is long, the body area scrolls independently of the rest of the dialog. Action buttons use distinct visual variants (confirm, danger, etc.) to communicate their intent.

## Acceptance
1. Nothing renders when the modal is closed.
2. The backdrop and dialog render when the modal is open.
3. The title appears when provided.
4. Body content renders in the dialog.
5. A close button is always present.
6. Action buttons render with correct labels and visual variants.
7. A default action button appears when no custom actions are provided.
8. Clicking an action button calls its handler and closes the modal.
9. Clicking the backdrop closes the modal when backdrop-close is enabled.
10. Pressing Escape always closes the modal.
11. Clicking the close button closes the modal.
