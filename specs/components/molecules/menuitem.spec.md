# MenuItem — Individual Menu Item

## Purpose
MenuItem renders a single item within a Menu. It appears as either a button or a link depending on whether a destination URL is provided, and it automatically closes its parent menu when activated.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [Menu component](../organisms/menu/menu.spec.md)

## Contract

### Inputs
- Label text.
- Optional leading icon.
- Optional destination URL.
- Optional click handler.

### Outputs
A button or link element styled as a menu item. On activation, the click handler is called and the parent menu closes.

### Guarantees / Constraints
- Items without a destination URL always render as buttons.
- Items with a destination URL always render as links.
- The parent menu always closes when a menu item is activated.

## Behavior

Clicking or keyboard-activating a menu item calls the provided click handler and signals the parent menu to close. The icon, if provided, appears before the label text.

## Interface

MenuItem appears as a full-width row within the menu panel. An optional icon appears on the left, followed by the label text. The item highlights on hover using the theme's background. Focus is visible when navigating by keyboard.

## Acceptance
1. Renders as a button when no destination URL is provided.
2. Renders as a link when a destination URL is provided.
3. Displays the icon before the label when an icon is provided.
4. Displays the label text.
5. Calls the click handler and closes the parent menu on activation.
6. Is keyboard-accessible via Tab and Enter/Space.
