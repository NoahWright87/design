# RadioGroup — Custom-Styled Radio Buttons with Group Label

## Purpose
RadioGroup provides a group of radio buttons with a shared group label. The native radio inputs are visually replaced with custom-styled circles while the underlying inputs remain accessible to keyboards and screen readers.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- Group label text (required).
- Shared name for all radio inputs (required).
- An array of option objects, each with a label and value and an optional disabled flag (required).
- Optional controlled selected value and default selected value.
- Optional change handler.
- Optional group-wide disabled flag.
- Optional style overrides.

### Outputs
A labeled group of radio controls that can be selected by click or arrow key. The selected option is highlighted and the change handler is notified on selection.

### Guarantees / Constraints
- The group uses native fieldset and legend semantics, understood by all major assistive technologies.
- Arrow key navigation between options uses native browser radio behavior.
- Individual options and the entire group can be disabled independently.
- Transitions respect the user's reduced-motion preference.

## Behavior

Clicking an option label selects that radio and deselects any previously selected option. Arrow keys cycle between options within the group. Tab moves focus in and out of the group.

**Checked:** The selected option shows a primary-colored border and a filled inner dot.

**Disabled (group):** All options are dimmed and do not respond to input.

**Disabled (individual option):** That option is dimmed and unselectable; others remain active.

## Interface

The group label appears above the options. Each option shows a circular indicator followed by its label text. The selected indicator is visually distinct — a primary-colored border with a filled center. Unselected options show a subtle neutral border.

Focus indicators appear on the circle element when navigating by keyboard.

## Acceptance
1. Displays the group label above the options.
2. Renders all provided options as selectable radio controls.
3. All radio inputs in the group share the same name.
4. Selecting an option updates the visual state to show it as checked.
5. The change handler fires when any option is selected.
6. Arrow keys cycle between options.
7. When the group is disabled, all options are dimmed and unresponsive.
8. When an individual option is disabled, only that option is dimmed and unresponsive.
9. A focus indicator appears on the circle when an option receives keyboard focus.
10. Style overrides apply to the root fieldset.
