# Select — Dropdown with Integrated Label

## Overview
- Purpose: Provides a styled native `<select>` with custom arrow, integrated label, error state, and placeholder support.
- Implementation: Wrapping `<label>` containing label span, a wrapper div with native `<select>` and custom arrow, and optional error message.
- Design system integration: Uses theme tokens for spacing, colors, radius, and typography. Native appearance removed; custom arrow positioned.

## API
- Props:
  - **label**: Required string. Text for the label.
  - **name**: Optional string. Select `name` attribute.
  - **children**: Required React node. `<option>` elements.
  - **value**: Optional string. Controlled value.
  - **defaultValue**: Optional string. Uncontrolled default value.
  - **onChange**: Optional change handler.
  - **error**: Optional string. Error styling and message.
  - **disabled**: Optional boolean (default false).
  - **required**: Optional boolean (default false).
  - **placeholder**: Optional string. Renders as a disabled `<option value="">`.
  - **style**: Optional `React.CSSProperties` on the root wrapper.
- DOM:
  - Root: `<label class="nw-select [nw-select--error] [nw-select--disabled]">`
  - Sub-elements: `nw-select__label`, `nw-select__required`, `nw-select__wrapper`, `nw-select__field`, `nw-select__arrow`, `nw-select__error`.

## Visuals
- Matches Input's label, focus ring, error, and disabled patterns.
- Native arrow hidden via `appearance: none`; custom `▾` arrow positioned in wrapper.
- Arrow has muted foreground color and is not interactive (`pointer-events: none`).

## Interactions
- Focus: Primary border and outer glow on the select field.
- Error + focus: Danger border and outer glow.
- Transitions respect `prefers-reduced-motion: reduce`.

## Accessibility
- Wrapping `<label>` associates label with the select.
- Placeholder renders as `<option value="" disabled>` — screen readers announce it.
- `required` and `disabled` attributes passed to native select.

## Acceptance Criteria
1. Renders a wrapping `<label>` with class `nw-select`.
2. Renders label text in `nw-select__label`.
3. Renders a native `<select>` with class `nw-select__field` inside `nw-select__wrapper`.
4. Renders custom arrow `nw-select__arrow` with `aria-hidden="true"`.
5. Native select has `appearance: none`.
6. Passes `name`, `value`, `defaultValue`, `disabled`, `required` through to native select.
7. Children `<option>` elements render inside the select.
8. When `placeholder` is set, renders a disabled `<option value="">` as first option.
9. When `placeholder` is set and no `value`/`defaultValue`, placeholder is selected by default.
10. Shows `nw-select__required` asterisk when `required` is true.
11. Adds `nw-select--error` class when `error` is set.
12. Renders `nw-select__error` span with error text when `error` is set.
13. Adds `nw-select--disabled` class when `disabled` is true.
14. `style` prop applied to root label element.
