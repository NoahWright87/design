# Link — Semantic Navigation

## Purpose
Link renders a semantic anchor element for navigation and external links. It provides a minimal, unstyled wrapper that inherits the browser's default link appearance and behavior.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- A destination URL or path (required).
- Visible link text (required).

### Outputs
A native anchor element that navigates to the provided destination when activated.

### Guarantees / Constraints
- The rendered element is always a native anchor, ensuring full browser-native link behavior.
- No classes, styles, or custom attributes are added.

## Behavior

Link is a static navigation element. Clicking or pressing Enter on a focused link navigates to the destination. There is no additional behavior beyond native anchor semantics.

## Interface

The link appears with the browser's default link styling — underlined text in the theme's default link color, with visited, hover, and active states from the browser. No custom variants or color overrides are provided.

## Acceptance
1. Renders an anchor element pointing to the provided destination.
2. Displays the provided text exactly.
3. Applies no additional classes, styles, or attributes.
4. Is keyboard-navigable and activatable via Enter.
