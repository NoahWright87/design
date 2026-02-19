# Pill — Compact Label Badge

## Purpose
Pill displays a short label in a compact, badge-like format used for tags, skills, status indicators, and categorical metadata. It is purely presentational — it displays information without triggering any interaction.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Label content (required).
- Optional visual variant — default, primary, secondary, confirm, or danger.
- Optional size — small, medium, or large.

### Outputs
An inline badge element displaying the label content in the selected color and size.

### Guarantees / Constraints
- Pills are non-interactive; they accept no click handlers or event callbacks.
- Content is plain text or simple inline elements; complex composition inside a pill is not supported.

## Behavior

Pill is a static display element. It has no state changes, hover effects, or interactive behavior. When interaction is needed, the pill should be wrapped in a Button or Link.

## Interface

Pills appear as small, rounded, inline-block badges that fit naturally in flowing text or flex/grid layouts. Color variants use the design system's semantic palette — the default variant uses a neutral tone; other variants use the corresponding color role (primary, confirm, danger, etc.) with appropriate text contrast.

Three sizes provide flexibility for different contexts: small is compact for dense displays, medium is standard, and large adds more visual weight.

## Acceptance
1. Displays the label content in a compact badge shape.
2. Applies the correct color for each variant.
3. Applies the correct size for each size option.
4. Text is readable against the background color for all variants.
5. Pill is inline and fits naturally in flowing layouts.
6. No interactivity or event handlers are present.
