# Menu — Dropdown Menu

## Purpose
Menu provides a dropdown panel triggered by a custom element such as a hamburger icon, avatar, or button. It manages its own open/closed state, positions the panel relative to the trigger, and closes in response to outside clicks, Escape presses, and item activation.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [MenuItem component](../../molecules/menuitem.spec.md)
- [HamburgerMenu component](../../molecules/hamburger/hamburger.spec.md)

## Contract

### Inputs
- A trigger element (required).
- Menu items as an array or as child elements.
- Alignment — left or right of the trigger.
- Optional icon overrides for the open and closed trigger states.
- Optional accessible label for the trigger.

### Outputs
An interactive dropdown panel that appears below the trigger when opened and disappears when closed or dismissed.

### Guarantees / Constraints
- The menu is always closed by default.
- Clicking outside the open menu always closes it.
- Pressing Escape always closes the open menu.
- Activating a menu item always closes the menu.
- The trigger's accessible state always reflects whether the menu is open or closed.

## Behavior

**Closed:** The trigger is visible; the panel is not rendered.

**Opening:** Clicking the trigger opens the panel and renders menu items.

**Item activation:** Clicking a menu item calls the item's handler and closes the menu.

**Outside click:** Clicking anywhere outside the menu and trigger closes the panel.

**Escape:** Pressing Escape while the menu is open closes the panel.

**Alignment:** The panel aligns to the left or right edge of the trigger based on the alignment configuration.

**Mobile:** On smaller screens, the menu panel expands to a wider overlay format.

## Interface

The trigger element appears in its normal position. When the menu is open, a panel appears below it containing the menu items stacked vertically. Items highlight on hover. The trigger communicates its expanded state to assistive technology.

## Acceptance
1. Menu is closed on initial render.
2. Clicking the trigger opens the menu panel.
3. Clicking the trigger again closes the menu.
4. All items from the items array or children render in the panel when open.
5. Clicking an item calls its handler and closes the menu.
6. Clicking outside the menu closes it.
7. Pressing Escape closes the menu.
8. Panel aligns correctly based on the alignment setting.
9. On small screens, the wider overlay format activates.
