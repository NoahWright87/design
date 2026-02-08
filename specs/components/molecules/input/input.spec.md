# Input — Text Field with Integrated Label

## Overview
- Purpose: Provides a styled text input with an integrated label, error state, and required indicator.
- Implementation: Wrapping `<label>` containing a label span, native `<input>`, and optional error message.
- Design system integration: Uses theme tokens for spacing, colors, radius, and typography.

## API
- Props:
  - **label**: Required string. Text for the label.
  - **name**: Optional string. Input `name` attribute.
  - **type**: Optional `"text" | "email" | "password" | "number" | "tel" | "url" | "search"` (default `"text"`).
  - **placeholder**: Optional string. Placeholder text.
  - **value**: Optional string. Controlled value.
  - **defaultValue**: Optional string. Uncontrolled default value.
  - **onChange**: Optional change handler.
  - **error**: Optional string. When set, displays error styling and message.
  - **disabled**: Optional boolean (default false). Disables the input.
  - **required**: Optional boolean (default false). Shows required indicator.
  - **style**: Optional `React.CSSProperties` on the root wrapper.
- DOM:
  - Root: `<label class="nw-input [nw-input--error] [nw-input--disabled]">`
  - Sub-elements: `nw-input__label`, `nw-input__required`, `nw-input__field`, `nw-input__error`.

## Visuals
- Label: Small, 500-weight text above the field.
- Required indicator: Red asterisk after label text.
- Field: Token-based padding, border, radius, and font. Subtle border with focus ring.
- Error: Red border on field; red error text below.
- Disabled: 50% opacity, `not-allowed` cursor.
- Placeholder: Muted foreground color.

## Interactions
- Focus: Blue (primary) border and outer glow.
- Error + focus: Red (danger) border and outer glow.
- Transitions respect `prefers-reduced-motion: reduce`.

## Accessibility
- Wrapping `<label>` associates label text with the input — no `id`/`htmlFor` needed.
- `required` attribute set on the native input when `required` prop is true.
- `disabled` attribute set on the native input when `disabled` prop is true.
- Error message is visually adjacent to the field.

## Acceptance Criteria
1. Renders a wrapping `<label>` with class `nw-input`.
2. Renders label text in `nw-input__label`.
3. Renders a native `<input>` with class `nw-input__field`.
4. Passes `type`, `name`, `placeholder`, `value`, `defaultValue`, `disabled`, `required` through to native input.
5. Shows `nw-input__required` asterisk when `required` is true.
6. Adds `nw-input--error` class when `error` is set.
7. Renders `nw-input__error` span with error text when `error` is set.
8. Adds `nw-input--disabled` class when `disabled` is true.
9. Focus ring appears via `:focus` on the field.
10. `style` prop applied to root label element.
