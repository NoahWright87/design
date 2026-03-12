# Button — Clickable Control

## Purpose
Button provides the primary clickable control in the design system. It wraps a native browser button with consistent visual styling, motion behavior, and icon support. Button is the go-to choice for user actions — submitting forms, opening dialogs, triggering navigation, and confirming decisions.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Motion tokens](../../../atoms/motion.spec.md)

## Contract

### Inputs
- Visible label text (`children`, required).
- Optional `onClick` handler.
- Optional `variant` — `"solid"`, `"outline"`, `"ghost"`, `"text"` (default: `"solid"`).
- Optional `size` — `"small"`, `"medium"`, `"large"` (default: `"medium"`).
- Optional `color` — semantic role (`"primary"`, `"secondary"`, `"confirm"`, `"danger"`) or a custom hex color (default: `"primary"`).
- Optional `icon` element and `iconPosition` — `"left"`, `"right"`, `"top"`, `"bottom"`, `"center"`.
- Optional `disabled` flag.
- Optional `motion` — `"none"`, `"subtle"`, `"bouncy"` (default: `"bouncy"`).
- Optional `type` — native button type: `"button"`, `"submit"`, `"reset"` (default: `"button"`).
- Optional `style` overrides.

### Outputs
A native button element styled according to the selected variant, size, and color. When clicked and not disabled, the click handler is invoked.

### Guarantees / Constraints
- The button is always a native button element, ensuring keyboard and screen reader support out of the box.
- When disabled, the button accepts no input and shows no hover or focus effects.
- All animations respect the user's reduced-motion preference.
- The button never causes layout shift when in icon-only mode.

## Behavior

**Standard interaction:** Clicking or pressing Space/Enter activates the button and invokes the click handler (if provided and not disabled).

**Disabled:** The button is inert — no clicks, hover effects, or focus effects. The click handler is never called.

**Icon-only (center position):** When the icon is centered and the label is hidden by default, the label remains accessible and appears on hover without shifting the layout.

**Motion:** Press and release phases have distinct animation curves. Press feels immediate and snappy; release has a gentle bounce or settle depending on the motion preset.

## Interface

### Visual Variants
- **Solid** — filled background using the selected color; strong visual weight for primary actions.
- **Outline** — bordered with a transparent background; suitable for secondary actions alongside a solid button.
- **Ghost** — borderless and transparent; for low-emphasis actions that still need a click target.
- **Text** — minimal styling; suits inline or tertiary actions.

### Sizes
Small, medium, and large — scaling padding and text to suit different contexts.

### Colors
Buttons use semantic color roles (primary, secondary, confirm, danger) or a custom color. The color determines the fill, border, and text color depending on the variant.

### Icons
An icon can appear to the left, right, above, or below the label. In center position, the button becomes icon-only by default, with the label revealed on hover for better mobile usability.

### Motion Presets
- **None** — instant state changes; no animation.
- **Subtle** — gentle hover and press feedback; professional feel.
- **Bouncy** — springy press-and-release with a slight overshoot; playful feel. Default.

### Accessibility
The button's accessible name comes from its visible label. In icon-only mode, the label remains accessible even when visually hidden.

## Acceptance
1. Displays the label text visibly.
2. Invokes the click handler on click when not disabled.
3. Is keyboard-activatable via Space and Enter.
4. Applies the correct visual appearance for each variant and color combination.
5. Scales correctly for each size.
6. Positions the icon correctly relative to the label.
7. In center/icon-only mode, the label appears on hover without layout shift.
8. When disabled, accepts no input and shows no interactive visual feedback.
9. Applies the selected motion preset to hover, press, and release states.
10. All animations are disabled when the user prefers reduced motion.
11. Custom style overrides apply correctly.
12. Is fully accessible via keyboard and screen reader.
13. The `type` prop is passed through to the native button element.
