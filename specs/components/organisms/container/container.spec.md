# Container — Flexible Layout Wrapper

## Purpose
Container is an opinionated flex layout wrapper for building consistent, spaced content regions. It handles direction, padding, spacing between children, background color, and sizing, removing the need to hand-write flex styles for common layout scenarios.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Direction — vertical or horizontal.
- Padding inside the container (from a named scale: none, extra-small, small, medium, large, extra-large).
- Margin outside the container (from the same named scale).
- Spacing between child elements (from the same named scale).
- Background and foreground colors.
- Width and height values.
- Optional children.

### Outputs
A flex container with the requested layout configuration applied.

### Guarantees / Constraints
- Direction, spacing, and padding all use a fixed named scale, ensuring consistency across uses.
- Width and height expressed as numbers are interpreted as percentages.

## Behavior

Container is a static layout component. It applies the requested flex configuration to its children. There is no interactive behavior.

## Interface

Container provides a configurable box that arranges its children either vertically (column) or horizontally (row). Spacing between children is controlled by the named spacing scale. Padding controls the internal breathing room. Background and foreground colors are fully customizable. Width and height can be set to fill the available space or constrained to a specific proportion.

## Acceptance
1. Arranges children in the specified direction (vertical or horizontal).
2. Applies internal padding from the selected scale preset.
3. Applies external margin from the selected scale preset.
4. Applies the specified gap between children.
5. Background and foreground colors are reflected in the rendered output.
6. Width and height are applied correctly; numeric values are treated as percentages.
7. Nested containers compose correctly.
