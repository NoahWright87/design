# Checkbox — Custom-Styled Toggle with Label

## Purpose
Checkbox provides a styled checkbox control with an integrated label. The native browser checkbox is replaced visually with a custom-designed box and checkmark, while the underlying native input remains in place for full keyboard and screen reader support.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Label text (required).
- Optional name, controlled checked state, and default checked state.
- Optional change handler.
- Optional disabled state.
- Optional style overrides.

### Outputs
A labeled checkbox control with custom visual styling, reflecting checked, unchecked, focused, and disabled states.

### Guarantees / Constraints
- The native checkbox input is always present and accessible to assistive technology.
- Checked state, change events, and disabled behavior work identically to a standard native checkbox.
- Visual transitions respect the user's reduced-motion preference.

## Behavior

Clicking the label or the visual box toggles the checkbox. The Space key toggles when the control is focused. Tab navigates to and from the checkbox.

**Checked:** The box shows a primary-colored background with a checkmark.

**Unchecked:** The box shows a subtle border with a neutral background.

**Disabled:** The control is visually dimmed and does not respond to clicks or keyboard input.

**Focused:** A visible focus ring appears around the visual box.

## Interface

The checkbox appears as a small square box followed by label text. In the unchecked state, the box has a light border. When checked, the box fills with the primary color and shows a checkmark. The label text is always visible alongside the box.

Transitions between states are smooth, but respect the user's motion preferences — when reduced motion is preferred, changes are instant.

## Acceptance
1. Displays the label text next to a custom checkbox box.
2. Shows a checkmark and primary color fill when checked.
3. Shows a neutral bordered box when unchecked.
4. A focus indicator appears on the box when the control receives keyboard focus.
5. Clicking the label or box toggles the checked state.
6. Space key toggles the checkbox when focused.
7. Passes name, checked, defaultChecked, and disabled through to the underlying input.
8. Shows a dimmed appearance and accepts no input when disabled.
9. Style overrides apply to the root wrapper.
