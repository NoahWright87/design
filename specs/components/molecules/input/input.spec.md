# Input — Text Field with Integrated Label

## Purpose
Input provides a styled text field with an integrated label, error state, and required indicator. It handles the visual and semantic connection between the label and the field so consumers can focus on the form data rather than accessibility plumbing.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Label text (required).
- Optional name, type, placeholder, controlled value, and default value.
- Optional change handler.
- Optional error message.
- Optional disabled and required flags.
- Optional style overrides.

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

**Required:** A visual indicator appears after the label text to signal the field is required.

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
