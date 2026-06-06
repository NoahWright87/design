# Colors — Theme Token Display

## Purpose
The Colors example displays all theme color tokens as labeled swatches, giving designers and developers a visual reference for the current color palette at a glance.

## Related
- [Design System Base Spec](../design-system.spec.md)

## Contract

### Inputs
The current theme's color tokens, read from the computed styles of the rendered page.

### Outputs
A grid of color swatches, each showing the token's name, resolved color value, contrast ratios, and exportable token values. Clicking a swatch copies its token name to the clipboard and briefly confirms the action.

### Guarantees / Constraints
- One swatch is rendered per defined color token.
- When a token is missing or unresolved, the swatch displays a graceful placeholder rather than erroring.

## Behavior

On load, the page reads the resolved value of each color token from the page's computed styles and builds a swatch for each.

**Contrast display:** Each swatch shows contrast ratios against the foreground and background tokens when the browser provides parseable computed color values.

**Copying token names:** Each swatch acts as a button. Clicking a swatch copies the token name to the clipboard and temporarily changes the label to confirm the copy.

**Exporting values:** The page provides export text for the resolved token values in CSS custom property and JSON formats, with a copy action for the selected format.

## Interface

A titled page with an export panel above a flexible wrapping grid of color swatches. Each swatch shows a solid block of the token's color, contrast information, token name, and resolved value. Swatches wrap horizontally to fill available space.

This page is a developer and designer reference tool, not a user-facing feature.

## Acceptance
1. The page title is visible.
2. One swatch renders for each defined color token.
3. Each swatch displays the token name and its resolved color value.
4. Swatches arrange in a wrapping grid layout.
5. Missing or unresolved tokens display a graceful fallback.
6. Clicking a swatch copies the token name to the clipboard.
7. A copied swatch briefly displays confirmation feedback.
8. Each swatch displays contrast ratios for foreground and background comparisons when values are parseable.
9. The export panel can show token values as CSS custom properties.
10. The export panel can show token values as JSON.
11. The selected export format can be copied to the clipboard.
