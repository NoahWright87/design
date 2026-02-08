# RadioGroup — Custom-Styled Radio Buttons with Group Label

## Overview
- Purpose: Provides a group of custom-styled radio buttons with a group label via `<fieldset>/<legend>`. Native radio inputs are visually hidden; CSS pseudo-element dots replace the default controls.
- Implementation: `<fieldset>` with `<legend>` and a list of `<label>` elements, each containing a visually hidden `<input type="radio">`, a styled circle span, and option label text.
- Design system integration: Uses theme tokens. Selected radio shows primary-colored dot and border.

## API
- Props:
  - **label**: Required string. Group label rendered as `<legend>`.
  - **name**: Required string. Shared `name` for all radio inputs.
  - **options**: Required `RadioOption[]`. Each has `label`, `value`, and optional `disabled`.
  - **value**: Optional string. Controlled selected value.
  - **defaultValue**: Optional string. Uncontrolled default.
  - **onChange**: Optional change handler (fires on any radio in the group).
  - **disabled**: Optional boolean (default false). Disables all options.
  - **style**: Optional `React.CSSProperties` on the root fieldset.
- Types:
  - `RadioOption`: `{ label: string; value: string; disabled?: boolean }`
- DOM:
  - Root: `<fieldset class="nw-radio-group [nw-radio-group--disabled]">`
  - Sub-elements: `nw-radio-group__legend`, `nw-radio-group__options`, then per option: `nw-radio`, `nw-radio__input` (sr-only), `nw-radio__circle`, `nw-radio__label`.

## Visuals
- Legend: Small, 500-weight text above the options.
- Unchecked: Circle with subtle border.
- Checked: Primary-colored border with filled inner dot.
- Focus: Focus ring on the circle via `:focus-visible` on the hidden input.
- Disabled group: 50% opacity on fieldset.
- Disabled option: 50% opacity, `not-allowed` cursor on individual label.
- Transitions respect `prefers-reduced-motion: reduce`.

## Interactions
- Clicking a label selects that radio.
- Arrow keys cycle between options within the group (native radio behavior).
- Tab navigates into/out of the group (native focus management).

## Accessibility
- `<fieldset>/<legend>` provides group semantics for screen readers.
- Native `<input type="radio">` is visually hidden but accessible.
- Wrapping `<label>` per option provides the accessible name.
- Custom circles have `aria-hidden="true"`.
- `disabled` attribute set on individual native inputs.

## Acceptance Criteria
1. Renders a `<fieldset>` with class `nw-radio-group`.
2. Renders a `<legend>` with class `nw-radio-group__legend`.
3. Renders options in `nw-radio-group__options` container.
4. Each option is a `<label class="nw-radio">` containing sr-only input, circle, and label text.
5. All radio inputs share the same `name` attribute.
6. Passes `value`/`defaultValue` correctly — only the matching option is checked.
7. `onChange` fires when any option is selected.
8. Checked option shows primary-colored circle border and inner dot.
9. Focus ring appears on `nw-radio__circle` when input has `:focus-visible`.
10. Adds `nw-radio-group--disabled` class when group `disabled` is true.
11. Individual options can be disabled via `option.disabled`.
12. Disabled individual options get `nw-radio--disabled` class.
13. `style` prop applied to root fieldset element.
