# Pill — Compact Label Badge

## Purpose
Pill displays a short label in a compact, badge-like format used for tags, skills, status indicators, and categorical metadata. It supports an optional leading icon and an optional dismiss button for interactive tag-removal patterns.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Label content (`children`, required).
- Optional `variant` — `"default"`, `"primary"`, `"secondary"`, `"confirm"`, `"danger"` (default: `"default"`).
- Optional `size` — `"small"`, `"medium"`, `"large"` (default: `"medium"`).
- Optional `icon` — React node rendered before the label text (e.g., a symbol or emoji).
- Optional `onDismiss` — callback invoked when the dismiss button is clicked. When provided, a `×` button is rendered inside the pill.
- Optional `dismissLabel` — accessible label for the dismiss button (default: `"Remove"`).

### Outputs
An inline badge element displaying the label, optional icon, and optional dismiss button.

### Guarantees / Constraints
- When `onDismiss` is not provided, the pill is non-interactive (no tab stop, no hover effects).
- When `onDismiss` is provided, the dismiss button is a native `<button>` with a visible focus ring and an accessible `aria-label`.
- The `icon` is rendered in an `aria-hidden` span so screen readers ignore it.
- Content is plain text or simple inline elements; complex composition inside a pill is not supported.

## Behavior

**Static (no `onDismiss`):** The pill is a presentational display element with no interactive behavior.

**Dismissable (`onDismiss`):** A `×` button renders at the trailing edge of the pill. Clicking or pressing Enter/Space on the button invokes the callback. The callback is responsible for removing the pill from the DOM. The dismiss button shows a subtle background tint on hover and a focus ring on keyboard focus.

## Interface

Pills appear as small, rounded, inline-block badges. Color variants use the design system's semantic palette. Three sizes scale the padding and font size. When an icon is present, it renders to the left of the label with a small gap. When dismissable, the right padding is reduced to accommodate the dismiss button.

### Variants
- **default** — neutral/secondary tone.
- **primary** — primary brand color.
- **secondary** — secondary brand color.
- **confirm** — success/confirm green.
- **danger** — error/danger red.

## Acceptance
1. Displays the label content in a compact badge shape.
2. Applies the correct color for each variant.
3. Applies the correct size for each size option.
4. Text is readable against the background color for all variants.
5. Pill is inline and fits naturally in flowing layouts.
6. When `icon` is provided, it renders before the label text in an `aria-hidden` span.
7. When `onDismiss` is provided, a `×` button renders inside the pill.
8. Clicking the dismiss button invokes the `onDismiss` callback.
9. The dismiss button is keyboard-focusable with a visible focus ring.
10. The dismiss button uses `dismissLabel` as its `aria-label`.
11. When `onDismiss` is not provided, the pill has no interactive behavior or tab stop.
