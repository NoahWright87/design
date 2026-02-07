# Pill Component — Spec

## Overview

A `Pill` is a small, badge-like component used to display tags, labels, skills, or status indicators. It's inherently non-interactive and focuses on clear, compact presentation.

Pill is a **molecule** in atomic design: it renders HTML with a single, focused responsibility (displaying a label in a compact format). It does not accept event handlers or complex composition.

## Purpose

- Display categorical information (skills, tags, topics, status).
- Provide visual hierarchy and grouping in lists or grids.
- Remain visually lightweight and scannable.

## API

```tsx
export type PillProps = {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'confirm' | 'danger';
  size?: 'small' | 'medium' | 'large';
};

export function Pill({ children, variant = 'default', size = 'medium' }: PillProps): JSX.Element;
```

### Props

- **children**: Text content or small react node to display inside the pill.
- **variant**: Visual style. Default is `'default'` (neutral). Other options map to design system colors (primary, secondary, confirm, danger).
- **size**: Pill size. Options: `'small'` (compact), `'medium'` (standard), `'large'` (spacious).

### DOM Shape

```html
<span class="nw-pill nw-pill--{variant} nw-pill--{size}">
  {children}
</span>
```

## Visuals

- **Default**: Neutral background (e.g., secondary color or muted gray), dark text.
- **Primary**: Design system primary color background, contrasting text.
- **Secondary/Confirm/Danger**: Mapped to design system colors with appropriate contrast.
- **Size Small**: Reduced padding and font size (e.g., 4px padding, 0.75rem font).
- **Size Medium**: Standard padding and font size (e.g., 8px padding, 1rem font).
- **Size Large**: Increased padding and font size (e.g., 12px padding, 1.125rem font).

All pills are inline-block, rounded, and fit naturally in flowing text or flex/grid layouts.

## Interactions

- Non-interactive by design. No onClick, hover, or focus handlers.
- If interaction is needed (e.g., clickable tags), wrap the pill in a Button or Link component.

## Accessibility

- Pills render as `<span>` with no implicit role.
- Content is plain text or simple nodes (no complex composition).
- No ARIA attributes required for passive display.
- If used within a list (e.g., skill list), the parent list provides semantic context.

## Constraints & Non-Goals

- **Not interactive**: Pills do not handle clicks, selection, or state changes.
- **No complex content**: Do not nest headings, buttons, or other interactive elements inside.
- **Minimal styling**: Pills are compact; do not add extra spacing or complex layouts internally.

## Acceptance Criteria

1. Pill renders as an inline-block `<span>` with appropriate classes.
2. Variant options (default, primary, secondary, confirm, danger) apply corresponding CSS classes.
3. Size options (small, medium, large) apply corresponding CSS classes.
4. Text is readable against background color (WCAG AA contrast).
5. Pill is compact and fits naturally in flowing text or lists.
6. No interactivity or event handlers.

## Current Example & Test Mapping

- Storybook story: `Molecules / Pill`
- Visual test: Verify all variant/size combinations.
- Verify contrast (WCAG AA) for all variants.

## Future Extensions

- Dismissable variant (with close button) — requires a separate `DismissablePill` component.
- Icon support (e.g., icon before text).
- Custom color support (beyond semantic palette).
