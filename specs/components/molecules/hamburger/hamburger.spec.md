# HamburgerMenu — Mobile Navigation Toggle

## Purpose
HamburgerMenu renders the classic three-line icon used to open and close mobile navigation menus. It communicates its open/closed state through an animated visual transformation and reports its expanded state to screen readers.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Menu component](../../organisms/menu/menu.spec.md)

## Contract

### Inputs
- Optional open state (boolean, default closed).
- Optional click handler.

### Outputs
A button element displaying three horizontal lines that animate into a transformed shape when open.

### Guarantees / Constraints
- The component is always a native button, ensuring keyboard accessibility.
- The expanded/collapsed state is always communicated accessibly.
- The button is a trigger only — it does not contain or manage a menu panel.

## Behavior

Clicking the button invokes the provided click handler. The visual appearance reflects the current open state — lines in the resting position when closed, transformed when open. The button does not directly open or close a menu; the parent component handles that.

## Interface

Three stacked horizontal lines are the default appearance. When the open state is active, the lines animate to indicate the menu is open (for example, forming an X shape). The button has no visible label text — its purpose is conveyed through the icon and its accessible label.

The button is sized by CSS to suit its context and uses the theme foreground color.

## Acceptance
1. Renders a button containing three line elements.
2. Shows the lines in the closed/resting position by default.
3. Shows the transformed open state via CSS when the open state is active.
4. Carries an accessible label of "Menu" and communicates its expanded state to assistive technology.
5. Clicking the button invokes the provided handler.
6. Keyboard activation works the same as clicking.
