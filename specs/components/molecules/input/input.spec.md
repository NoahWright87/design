# Input — Text Field with Integrated Label

## Purpose
Input provides a styled text field with an integrated label, error state, and required indicator. It handles the visual and semantic connection between the label and the field so consumers can focus on the form data rather than accessibility plumbing.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Label text (`label`, required).
- Optional `name`, `type` (`"text"`, `"email"`, `"password"`, `"number"`, `"tel"`, `"url"`, `"search"`), `placeholder`, controlled `value`, and `defaultValue`.
- Optional `onChange` handler.
- Optional `error` message (external, overrides internal validation).
- Optional `disabled` and `required` flags.
- Optional `multiline` — renders a `<textarea>` instead of `<input>` with the same styling and validation.
- Optional `rows` — visible row count when `multiline` is true.
- Optional `randomDisabledCursor` — shows a randomly selected "no" emoji cursor (🙅 ❌ ⛔ 🚫) when disabled.
- Optional `style` overrides.

### Outputs
A labeled text field with appropriate visual states: default, focused, error, and disabled. When an error message is provided, it is displayed below the field with error styling applied to the border.

### Guarantees / Constraints
- The label is always associated with the input for screen reader accessibility.
- Required and disabled states are communicated to the browser natively.
- Focus and error styles use design system color tokens.
- Transitions respect the user's reduced-motion preference.

## Behavior

**Default:** Label and field are visible; the field accepts text input.

**Focused:** The field border changes to the primary color with a subtle glow, indicating it is active.

**Error:** The field border changes to the danger color and the error message appears below the field.

**Error and focused:** The field shows the danger color border and glow simultaneously.

**Disabled:** The field is dimmed and does not accept input. The cursor indicates the field is unavailable.

**Required:** A visual indicator (`*`) appears after the label text. When the field is `required` and the user interacts with it and then clears it (or blurs without entering a value), an inline error message appears automatically — no external `error` prop needed.

**Multiline:** When `multiline` is true, a `<textarea>` is rendered instead of `<input>`. It is resizable vertically and has a minimum height. All validation, error display, and styling behave identically to the single-line variant.

**Error waggle:** When an error message appears (from either `error` or inline required validation), the field performs a side-to-side waggle animation to draw attention.

## Interface

The label appears above the field. The field has a bordered, rounded appearance consistent with the design system's form controls. Focus produces a visible color change on the border. Errors produce an additional message below the field in a warning color. Required fields show a small indicator after the label.

## Acceptance
1. Displays the label text above the field.
2. Passes type, name, placeholder, value, default value, disabled, and required through to the native input.
3. Shows a required indicator when the required flag is set.
4. Applies error styling to the field border when an error message is provided.
5. Displays the error message below the field when an error is present.
6. Shows a dimmed appearance and prevents input when disabled.
7. A focus indicator appears on the field border when it receives keyboard focus.
8. Style overrides apply to the root wrapper.
9. When `required` is set and the field is blurred while empty, an inline "This field is required." error appears automatically.
10. When `multiline` is set, renders a resizable `<textarea>` with the same label, error, and validation behavior.
11. When `randomDisabledCursor` is set and the field is disabled, a random "no" emoji cursor is shown.
