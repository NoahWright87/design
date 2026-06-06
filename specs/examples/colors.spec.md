# Colors — Theme Token Display

## Purpose
The Colors example displays all theme color tokens as labeled swatches, giving designers and developers a visual reference for the current color palette at a glance.

## Related
- [Design System Base Spec](../design-system.spec.md)

## Contract

### Inputs
The current theme's color tokens, read from the computed styles of the rendered page.

### Outputs
A grid of color swatches, each showing the token's name and resolved color value. Clicking a swatch copies its token name to the clipboard and briefly confirms the action.

### Guarantees / Constraints
- One swatch is rendered per defined color token.
- When a token is missing or unresolved, the swatch displays a graceful placeholder rather than erroring.

## Behavior

On load, the page reads the resolved value of each color token from the page's computed styles and builds a swatch for each.

**Copying token names:** Each swatch acts as a button. Clicking a swatch copies the token name to the clipboard and temporarily changes the label to confirm the copy.

## Interface

A titled page with a flexible wrapping grid of color swatches. Each swatch shows a solid block of the token's color above its name and resolved value. Swatches wrap horizontally to fill available space.

This page is a developer and designer reference tool, not a user-facing feature.

## Acceptance
1. The page title is visible.
2. One swatch renders for each defined color token.
3. Each swatch displays the token name and its resolved color value.
4. Swatches arrange in a wrapping grid layout.
5. Missing or unresolved tokens display a graceful fallback.
6. Clicking a swatch copies the token name to the clipboard.
7. A copied swatch briefly displays confirmation feedback.
