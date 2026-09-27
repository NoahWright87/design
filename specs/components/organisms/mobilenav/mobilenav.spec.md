# MobileNav — Responsive Site Navigation

## Purpose
MobileNav is the site navigation for server-rendered layouts. On wide screens its links sit inline in a row; on phones they collapse behind a hamburger toggle that opens a dropdown panel. The open/close toggle works with pure CSS, so the menu is usable before (or without) JavaScript, and it is the recommended alternative to Menu in server layouts.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Header component](../header/header.spec.md)
- [Menu component](../menu/menu.spec.md)
- [MenuItem component](../../molecules/menuitem.spec.md)

## Contract

### Inputs
- Navigation items (links or buttons) as children.
- Optional accessible label for the hamburger toggle (defaults to "Menu").
- Optional close-on-navigate flag (defaults to on).
- The current page's link carries `aria-current="page"`, set by the consumer.

### Outputs
A navigation landmark holding a hamburger toggle and a panel of navigation items.

### Guarantees / Constraints
- The toggle opens and closes the dropdown with CSS alone; server-rendered markup is fully functional.
- The open dropdown spans the width of the nearest positioned ancestor, which inside a Header is the full header width.
- The link marked as the current page is visually distinguished and announced by screen readers as the current page.

## Behavior

**Wide screens:** The hamburger toggle is hidden and the navigation items appear inline in a row.

**Phones:** Only the hamburger toggle is visible. Activating it opens a dropdown panel directly below the containing bar with each item on its own full-width row, and the hamburger animates into an X. Activating it again closes the panel.

**Current page:** Any item marked with `aria-current="page"` is shown in the primary color with a heavier weight, in both the inline row and the dropdown.

**Close on navigate:** Once JavaScript has loaded, clicking a link or button inside the open dropdown closes it. This keeps the menu closed after client-side route changes (Next `Link`, React Router), where the page never reloads to reset it. With the flag turned off, the dropdown stays open until the toggle is used again.

**Inside a Header slot:** The dropdown anchors to the whole header, so it spans the header's full width rather than just the slot. A slot that also has a tooltip becomes the anchor instead, so pair MobileNav with an untooltipped slot.

## Interface

The toggle is a compact three-line hamburger in the foreground color. The dropdown uses the theme background with a soft shadow; items highlight faintly on hover. Inline items on wide screens are spaced in a compact row.

The toggle is a labelled control for screen readers, and the whole component is a navigation landmark. The hamburger animation is skipped when the user prefers reduced motion.

## Acceptance
1. On wide screens, items render inline and the hamburger toggle is hidden.
2. On phones, only the hamburger toggle is visible until it is activated.
3. Activating the toggle opens the dropdown below the containing bar; activating it again closes it.
4. The toggle works with JavaScript disabled.
5. An item with `aria-current="page"` renders in the primary color with a heavier weight.
6. With close-on-navigate on (the default), clicking a link or button in the open dropdown closes it.
7. With close-on-navigate off, the dropdown stays open after clicking an item.
8. Placed in an untooltipped Header slot, the open dropdown spans the full header width.
9. The hamburger animation is skipped when the user prefers reduced motion.
