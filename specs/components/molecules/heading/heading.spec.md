# Heading — Semantic HTML Levels

## Purpose
Heading renders the correct semantic heading element for any of the six heading levels. It gives consumers a type-safe, intent-clear way to place headings without managing HTML tag names directly.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- A heading level from one to six (required).
- Visible heading text (required).

### Outputs
The corresponding semantic heading element containing the provided text, with no additional styling applied.

### Guarantees / Constraints
- The rendered element always matches the requested heading level.
- No classes, styles, or attributes are added beyond the element itself.

## Behavior

Heading is a static display component with no interactive behavior. It renders the appropriate heading element and returns.

## Interface

The heading appears with the browser's default styling for the selected level — larger and bolder for level one, progressively smaller toward level six. No custom styling is applied; the design system relies on global styles or parent components to control typography.

Proper heading hierarchy is the responsibility of the page or parent component using this element.

## Acceptance
1. Renders the correct heading element for each level (one through six).
2. Displays the provided text content exactly.
3. Applies no additional classes, styles, or attributes.
