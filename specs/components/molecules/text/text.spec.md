# Text — Semantic Paragraph Content

## Purpose
Text renders a semantic paragraph element for body text and content blocks. It gives consumers a clear intent-signal that the content is body copy, without applying any custom styling on top of the browser's defaults.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Paragraph content (required).

### Outputs
A paragraph element containing the provided content, with no additional styling applied.

### Guarantees / Constraints
- The rendered element is always a paragraph.
- No classes, styles, or attributes are added beyond the element itself.

## Behavior

Text is a static display component with no interactive behavior. It renders the paragraph element and returns.

## Interface

The text appears with the browser's default paragraph styling — standard font size, line height, and spacing. No custom variants, colors, or size overrides are provided. Spacing between paragraphs is the responsibility of parent components.

## Acceptance
1. Renders a paragraph element.
2. Displays the provided content exactly.
3. Applies no additional classes, styles, or attributes.
