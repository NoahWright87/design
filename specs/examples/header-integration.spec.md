# Header Integration — Multi-Layout Variants

## Purpose
The Header Integration example demonstrates how Header, Avatar, Menu, MenuItem, and HamburgerMenu combine to create functional application headers. Five variants illustrate common header compositions and fragment-based navigation.

## Related
- [Header component](../components/organisms/header/header.spec.md)
- [Menu component](../components/organisms/menu/menu.spec.md)
- [Avatar component](../components/molecules/avatar/avatar.spec.md)
- [HamburgerMenu component](../components/molecules/hamburger/hamburger.spec.md)

## Contract

### Inputs
User interaction: clicking menu triggers to open/close menus, clicking menu items, and using keyboard shortcuts in the routed application header.

### Outputs
Five rendered header variants, including one routed application header. Each variant has functional menus that open, close, and either log item selections or update the active example route.

### Guarantees / Constraints
- Each variant demonstrates a distinct header composition.
- The routed application header updates its active route without a page reload.
- Header menus use the Menu component's opening transition.

## Behavior

Each variant renders a header fixed at the top with content scrollable beneath. Clicking a menu trigger opens the associated dropdown with an entrance transition; clicking again or clicking outside closes it. Clicking a menu item logs which item was activated or changes the active route in the routed application header.

**Variant 1 — Standard app header:** Navigation hamburger on the left, application title in the center, account avatar with dropdown on the right.

**Variant 2 — Minimal portfolio:** Navigation hamburger on the left, name in the center, avatar with an image on the right.

**Variant 3 — Left menu only:** Hamburger navigation on the left, centered title, empty right slot.

**Variant 4 — Right menu only:** Empty left slot, application name in the center, avatar with account menu on the right.

**Variant 5 — Routed application header:** Navigation links select Home, About, Services, or Contact using the URL fragment. Reloading and browser back/forward restore that route; unknown fragments show Home. The active navigation link is marked as current. Alt+N toggles navigation and Alt+A toggles account actions, focusing the first item when opened. Escape closes the menu and returns focus to its trigger. Shortcuts are inert while editing a field.

## Interface

Each header variant spans the full viewport width and is fixed at the top. The left, center, and right slots hold different content in each variant. Menus open as dropdowns below their triggers. Page content below the header is scrollable.

## Acceptance
1. All four header variants render with the expected content in each slot.
2. HamburgerMenu and Avatar render as menu triggers where configured.
3. Clicking a trigger opens and closes the menu.
4. Menu items are visible and clickable when the menu is open.
5. Scrollable content remains below the fixed header without overlap.
6. The routed application header updates visible page content when a route menu item is selected.
7. Alt+N opens the navigation menu in the routed application header.
8. Alt+A opens the account menu in the routed application header.
9. Open menus display the Menu component's entrance transition when motion preferences allow it.
10. URL fragments, reloads, and browser history restore the selected route; unknown fragments display Home.
11. Shortcut activation focuses the first item, Escape returns focus to its trigger, and text fields retain their keyboard input.
