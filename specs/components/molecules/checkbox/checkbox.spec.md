# Checkbox — Custom-Styled Toggle with Label

## Overview
- Purpose: Provides a custom-styled checkbox with integrated label. Native input is visually hidden; a CSS pseudo-element checkmark replaces the default control.
- Implementation: Wrapping `<label>` containing a visually hidden `<input type="checkbox">`, a styled box span, and label text.
- Design system integration: Uses theme tokens. Custom box uses primary color when checked.

## API
- Props:
  - **label**: Required string. Text for the label.
  - **name**: Optional string. Input `name` attribute.
  - **checked**: Optional boolean. Controlled checked state.
  - **defaultChecked**: Optional boolean. Uncontrolled default.
  - **onChange**: Optional change handler.
  - **disabled**: Optional boolean (default false).
  - **style**: Optional `React.CSSProperties` on the root wrapper.
- DOM:
  - Root: `<label class="nw-checkbox [nw-checkbox--disabled]">`
  - Sub-elements: `nw-checkbox__input` (sr-only), `nw-checkbox__box` (custom visual), `nw-checkbox__label`.

## Visuals
- Unchecked: Rounded square box with subtle border.
- Checked: Primary-colored background with white checkmark (rotated border pseudo-element).
- Focus: Focus ring on the box via `:focus-visible` on the hidden input.
- Disabled: 50% opacity, `not-allowed` cursor.
- Transitions respect `prefers-reduced-motion: reduce`.

## Interactions
- Clicking the label or box toggles the checkbox (wrapping label behavior).
- Space key toggles when focused (native input behavior preserved).
- Tab navigates to the checkbox (native focus management).

## Accessibility
- Native `<input type="checkbox">` is visually hidden but accessible to screen readers.
- Wrapping `<label>` provides the accessible name.
- Custom box has `aria-hidden="true"` to prevent double-announcement.
- `disabled` attribute set on the native input.

## Acceptance Criteria
1. Renders a wrapping `<label>` with class `nw-checkbox`.
2. Renders a visually hidden `<input type="checkbox">` with class `nw-checkbox__input`.
3. Renders custom box `nw-checkbox__box` with `aria-hidden="true"`.
4. Renders label text in `nw-checkbox__label`.
5. Passes `name`, `checked`, `defaultChecked`, `disabled` through to native input.
6. When checked, `nw-checkbox__box` shows primary background and checkmark.
7. Focus ring appears on `nw-checkbox__box` when input has `:focus-visible`.
8. Adds `nw-checkbox--disabled` class when `disabled` is true.
9. `style` prop applied to root label element.
