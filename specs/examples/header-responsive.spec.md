# Header Responsive — Adaptive Layout and Theme Toggle

## Purpose
The Header Responsive example demonstrates the header's label-hiding behavior on smaller screens and shows how a theme toggle can be integrated into the right header slot.

## Related
- [Header component](../components/organisms/header/header.spec.md)
- [Menu component](../components/organisms/menu/menu.spec.md)

## Contract

### Inputs
User interaction: resizing the viewport, clicking the theme toggle, and using the theme toggle keyboard shortcut.

### Outputs
Three variants showing responsive label hiding, a functional light/dark theme toggle, and a navigation drawer.

### Guarantees / Constraints
- Labels are always hidden on small screens regardless of their content.
- Theme switching takes effect immediately without a page reload.
- Theme preference persists across page loads.
- Theme changes animate smoothly when motion preferences allow it.

## Behavior

**Label hiding:** Labels configured in header slots are visible on larger screens and hidden on smaller screens. Only the slot content (icon or element) remains visible on small screens.

**Theme toggle:** A button in the right slot toggles between light and dark themes. The current theme, including changes from elsewhere, is reflected by the animated SVG button's sun or crescent icon and the page's background color. The selected theme is saved so subsequent page loads restore the same preference. Switching themes applies a short color transition when motion preferences allow it. The theme can also be toggled with the keyboard shortcut shown by the example.

**Variant 1:** Left slot has an icon and app-name label. Center has a page label. Right has a theme toggle.

**Variant 2:** Left has a logo icon and label. Center has a menu trigger. Right has a theme toggle.

## Interface

**Navigation drawer:** The menu button opens a modal panel at the left edge. Focus stays in the drawer while open. Selecting Home, About, or Contact updates the visible page and closes the drawer. Close, Escape, and clicking outside the drawer dismiss it and return focus to the menu button.

On desktop-sized viewports, labels are visible alongside slot content. On mobile-sized viewports, labels disappear and only the icons or elements remain. The theme toggle shows a sun icon in light mode and a moon icon in dark mode.

## Acceptance
1. Both variants render with the correct slot content and labels.
2. Labels are hidden on small viewports; icons and elements remain visible.
3. The theme toggle changes the page theme when clicked.
4. The toggle icon updates to reflect the current theme.
5. The center menu in variant 2 opens and closes correctly.
6. Theme preference persists across page loads.
7. Theme changes use smooth color transitions when motion preferences allow it.
8. The keyboard shortcut toggles the current theme.
9. The drawer opens on desktop and mobile, contains keyboard focus, and closes through its Close button, Escape, or outside click.
10. Selecting a drawer destination updates the page and returns focus to the menu button.

11. External theme changes synchronize the SVG icon; reduced motion applies its final state immediately.
