# Avatar — User Profile Picture

## Purpose
Avatar displays a user's profile picture or initials in a compact, circular container. It serves as a visual identity indicator in navigation bars, comment threads, and similar contexts. When no image is provided, it falls back gracefully to an initial derived from the user's name.

## Related
- [Design System Base Spec](../../../design-system.spec.md)

## Contract

### Inputs
- An optional image source URL.
- An accessible label describing the user (used as fallback text and accessible name).
- An optional size for the circular container.
- An optional click handler.

### Outputs
An interactive or static circular container showing either a profile image or a single initial character on a themed background.

### Guarantees / Constraints
- When no image is provided, an initial is always shown.
- An accessible name is always present.
- When a click handler is provided, the avatar is interactive and keyboard-accessible.
- When no click handler is provided, the avatar is a static display element with no interactive role.

## Behavior

**With an image:** The image is shown inside the circular container, filling it edge-to-edge.

**Without an image:** The first letter of the label is shown as a large initial on a themed background color.

**Interactive:** When a click handler is provided, the avatar acts as a button — it responds to click and keyboard activation.

**Static:** Without a click handler, the avatar is a non-interactive display element.

## Interface

Avatar appears as a circle containing either an image or an initial. The size is configurable — smaller for inline use, larger for profile contexts.

When used as a button, it shows a pointer cursor and responds to keyboard activation. Its accessible name comes from the label, ensuring screen reader users understand what it represents.

The initial variant uses a themed background color to provide visual interest when no photo is available.

## Acceptance
1. Displays the provided image when an image source is given.
2. Displays the first letter of the label when no image source is given.
3. The circular size reflects the configured size.
4. When a click handler is provided, the avatar acts as a button activatable by click or keyboard.
5. When no click handler is provided, the avatar is non-interactive.
6. An accessible name is present in all cases.
