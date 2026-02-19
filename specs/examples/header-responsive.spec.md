# Header Responsive — Adaptive Layout and Theme Toggle

## Purpose
The Header Responsive example demonstrates the header's label-hiding behavior on smaller screens and shows how a theme toggle can be integrated into the right header slot.

## Related
- [Header component](../components/organisms/header/header.spec.md)
- [Menu component](../components/organisms/menu/menu.spec.md)

## Contract

### Inputs
User interaction: resizing the viewport, clicking the theme toggle.

### Outputs
Two variants showing responsive label hiding and a functional light/dark theme toggle.

### Guarantees / Constraints
- Labels are always hidden on small screens regardless of their content.
- Theme switching takes effect immediately without a page reload.

## Behavior

**Label hiding:** Labels configured in header slots are visible on larger screens and hidden on smaller screens. Only the slot content (icon or element) remains visible on small screens.

**Theme toggle:** A button in the right slot toggles between light and dark themes. The current theme is reflected by the button's icon and the page's background color.

**Variant 1:** Left slot has an icon and app-name label. Center has a page label. Right has a theme toggle.

**Variant 2:** Left has a logo icon and label. Center has a menu trigger. Right has a theme toggle.

## Interface

On desktop-sized viewports, labels are visible alongside slot content. On mobile-sized viewports, labels disappear and only the icons or elements remain. The theme toggle shows a sun icon in light mode and a moon icon in dark mode.

## Acceptance
1. Both variants render with the correct slot content and labels.
2. Labels are hidden on small viewports; icons and elements remain visible.
3. The theme toggle changes the page theme when clicked.
4. The toggle icon updates to reflect the current theme.
5. The center menu in variant 2 opens and closes correctly.
