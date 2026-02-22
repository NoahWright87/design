# Select — Dropdown with Integrated Label

## Purpose
Select provides a styled native dropdown with an integrated label, error state, and placeholder support. It replaces the browser's default dropdown appearance with a custom arrow indicator while retaining the native browser dropdown behavior for options.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Label text (`label`, required).
- Option elements as `children` (required).
- Optional `name`, controlled `value`, and `defaultValue`.
- Optional `onChange` handler.
- Optional `error` message (external, overrides internal validation).
- Optional `disabled` and `required` flags.
- Optional `placeholder` text — renders as the first, non-selectable option.
- Optional `randomDisabledCursor` — shows a randomly selected "no" emoji cursor when disabled.
- Optional `style` overrides.

### Outputs
A labeled dropdown control with custom styling, reflecting default, focused, error, and disabled states.

### Guarantees / Constraints
- The underlying element is always a native select, preserving browser-native dropdown behavior and accessibility.
- When a placeholder is provided, it renders as the first, non-selectable option.
- Focus and error styles use design system color tokens.
- Transitions respect the user's reduced-motion preference.

## Behavior

**Default:** Label and dropdown are visible; the user can open and choose an option.

**Focused:** The dropdown border changes to the primary color with a glow.

**Error:** The border changes to the danger color and an error message appears below.

**Disabled:** The control is dimmed and cannot be interacted with.

**Placeholder:** When provided, a placeholder item appears first in the list but cannot be selected.

**Required:** A visual indicator (`*`) appears after the label text. When the field is `required` and the user blurs without selecting an option, an inline "Please select an option." error appears automatically.

**Error waggle:** When an error appears (from `error` or inline validation), the control performs a side-to-side waggle animation.

**Open/close animation:** The custom arrow chevron rotates 180° and tints to the primary color when the select receives focus, signaling the dropdown is open. It transitions smoothly back on blur.

## Interface

The label appears above the dropdown. The dropdown has a bordered, rounded appearance with a custom arrow indicator on the right. The arrow is decorative and does not respond to clicks. Focus produces a visible color change. Errors show a message below the field with a danger-colored border.

## Acceptance
1. Displays the label text above the dropdown.
2. Passes name, value, default value, disabled, and required through to the native select.
3. Renders the provided option elements inside the select.
4. When a placeholder is provided, it appears as the first non-selectable option.
5. Shows a required indicator when the required flag is set.
6. Applies error styling and shows the error message when an error is provided.
7. Shows a dimmed appearance and prevents interaction when disabled.
8. A focus indicator appears on the select border when it receives keyboard focus.
9. Style overrides apply to the root wrapper.
10. When `required` and no option is selected after blur, shows an inline required error.
11. When an error is present, the control performs a waggle animation.
12. The arrow chevron rotates 180° on focus and returns on blur.
13. When `randomDisabledCursor` is set and disabled, a random "no" emoji cursor is shown.
