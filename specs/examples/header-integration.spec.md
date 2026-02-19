# Header Integration — Multi-Layout Variants

## Purpose
The Header Integration example demonstrates how Header, Avatar, Menu, MenuItem, and HamburgerMenu combine to create functional application headers. Four variants illustrate common header compositions for different use cases.

## Related
- [Header component](../components/organisms/header/header.spec.md)
- [Menu component](../components/organisms/menu/menu.spec.md)
- [Avatar component](../components/molecules/avatar/avatar.spec.md)
- [HamburgerMenu component](../components/molecules/hamburger/hamburger.spec.md)

## Contract

### Inputs
User interaction: clicking menu triggers to open/close menus, clicking menu items.

### Outputs
Four rendered header variants, each with functional menus that open, close, and log item selections.

### Guarantees / Constraints
- Each variant demonstrates a distinct header composition.
- Menu items respond to clicks but do not perform routing in this example.

## Behavior

Each variant renders a header fixed at the top with content scrollable beneath. Clicking a menu trigger opens the associated dropdown; clicking again or clicking outside closes it. Clicking a menu item logs which item was activated.

**Variant 1 — Standard app header:** Navigation hamburger on the left, application title in the center, account avatar with dropdown on the right.

**Variant 2 — Minimal portfolio:** Navigation hamburger on the left, name in the center, avatar with an image on the right.

**Variant 3 — Left menu only:** Hamburger navigation on the left, centered title, empty right slot.

**Variant 4 — Right menu only:** Empty left slot, application name in the center, avatar with account menu on the right.

## Interface

Each header variant spans the full viewport width and is fixed at the top. The left, center, and right slots hold different content in each variant. Menus open as dropdowns below their triggers. Page content below the header is scrollable.

## Acceptance
1. All four header variants render with the expected content in each slot.
2. HamburgerMenu and Avatar render as menu triggers where configured.
3. Clicking a trigger opens and closes the menu.
4. Menu items are visible and clickable when the menu is open.
5. Scrollable content remains below the fixed header without overlap.
