# Button — Component Spec

This document describes the behavior and appearance of the Button component. It serves as source of truth for tests.

## Overview
- Purpose: Provide a flexible, accessible clickable control using the native HTML `<button>` element, styled according to design tokens and supporting multiple variants, sizes, colors, and icon placement.
- Implementation summary: Renders a `<button type="button">` with its label from `children`, styled via CSS variables and design tokens. Supports visual variants, semantic/custom colors, icon positioning, disabled state, and a `style` escape hatch.
- Design system integration: Uses atomic design tokens for colors, spacing, typography, motion, and radius. Animations respect `prefers-reduced-motion`.

## API
- Props:
	- `children`: React node used as the visible label. Required.
	- `onClick`: Optional mouse event handler, called on activation.
	- `variant`: Visual style variant. One of `"solid" | "outline" | "ghost" | "text"`. Default: `"solid"`.
	- `size`: Button size. One of `"small" | "medium" | "large"`. Default: `"medium"`.
	- `color`: Button color. Semantic token name (`"primary" | "secondary" | "confirm" | "danger"`) or arbitrary hex code (e.g., `"#ff5733"`). Default: `"primary"`.
	- `icon`: Optional React element for an icon (e.g., `<IconComponent />`).
	- `iconPosition`: Position of the icon relative to the button. One of `"left" | "right" | "center" | "top" | "bottom"`. Default: `"left"`. When `"center"`, the button is icon-only by default; label appears on hover.
	- `disabled`: Boolean flag. When `true`, button is non-interactive with dulled appearance and no hover effects. Default: `false`.
	- `motion`: Animation preset for hover, press, and release. One of `"none" | "subtle" | "bouncy"`. Default: `"bouncy"`.
	- `style`: Optional escape hatch for custom inline CSS. Allows arbitrary styling overrides.
- DOM:
	- Element: `<button>`
	- Attributes: `type="button"`, `disabled` (when `disabled={true}`)
	- Classes: Applied based on variant, size, motion, and state.

## Visuals
- Appearance: Styled via CSS tokens for color, padding, typography, and border-radius.
- Variants:
	- `solid`: Filled background with button color, contrasting text/icon.
	- `outline`: Transparent background, colored border and text/icon.
	- `ghost`: Transparent background, no border, colored text/icon; slight background on hover.
	- `text`: Minimal styling, text-colored with no border or background.
- Sizes: Scale padding, font size, and height via tokens:
	- `small`: Compact padding and smaller text.
	- `medium`: Balanced default size.
	- `large`: Generous padding and larger text.
- Color: Applied from semantic tokens (`--primary`, `--secondary`, `--confirm`, `--danger`) or custom hex.
- Icon positioning:
	- `left`/`right`/`top`/`bottom`: Icon appears adjacent to label, with appropriate spacing.
	- `center`: Icon-only by default; label revealed on hover for better mobile UX.
- Disabled state: Dulled color (reduced opacity or desaturated tone), `cursor: not-allowed`, no hover effects or animations.

## Interactions
- Pointer: Clicking the button activates it and invokes `onClick` (if provided and not disabled).
- Keyboard: Space/Enter activate when focused (native behavior).
- Hover: Visual feedback via subtle color shift or scale (respects motion preferences).
- Focus: Custom focus ring using design tokens; visible and accessible.
- Disabled: No interaction possible; hover and focus effects suppressed.

## Motion & Animation
- Hover, press, and release states feature coordinated motion defined by the `motion` prop.
- **Motion presets:**
	- `none`: No animation (instant state changes).
	- `subtle`: Gentle, professional motion with slight scale and lift.
	- `bouncy`: Playful, springy motion with squish-and-bounce on press (default).
- Motion tokens (`--motion-bouncy-duration`, `--motion-bouncy-easing`, etc.) are defined as atoms in the design system.
- Press animations use distinct durations and easing curves from hover/release for tactile feedback.
- All motion respects `prefers-reduced-motion`; animations are disabled for accessibility.
- Animations never cause layout shift (e.g., icon-center keeps label in layout flow).

## Accessibility
- Role: Implicit `role="button"` via native `<button>`.
- Name: Derived from `children` text/content. Icon-only buttons (when `iconPosition="center"` and label hidden) must ensure accessible name via `aria-label` or visible label on hover.
- Tab order: Focusable by default as native control.
- Disabled: Uses native `disabled` attribute; accessible name preserved.
- Keyboard navigation: Follows native button behavior (Space/Enter activation).

## Constraints & Design Philosophy
- Aligns with design system philosophy: approachable, forgiving, playful yet professional.
- Motion conveys cause → effect, never blocks or delays interaction.
- Mobile-first: Button is designed to work well on touch devices; `iconPosition="center"` optimizes for small screens.
- Performance: CSS-only animations; SSR-safe; no runtime side effects at import.

## Acceptance Criteria (Source of Truth for Tests)
1. Renders a `<button type="button">` element in the DOM.
2. Displays `children` label text exactly as provided.
3. Invokes `onClick` when activated via pointer (unless disabled).
4. Is keyboard-activatable via Space/Enter (native behavior).
5. Applies correct variant styling (`solid`, `outline`, `ghost`, `text`).
6. Applies correct size styling (`small`, `medium`, `large`).
7. Applies correct color from semantic tokens or custom hex code.
8. Positions icon correctly based on `iconPosition` prop.
9. When `iconPosition="center"`, button is icon-only; label appears on hover without layout shift.
10. When `disabled={true}`, button is non-interactive with dulled appearance, `cursor: not-allowed`, and no hover effects.
11. Hover and focus states provide visual feedback (unless disabled).
12. Motion preset (`none`, `subtle`, `bouncy`) controls hover, press, and release animations.
13. All animations respect `prefers-reduced-motion`.
14. Custom `style` prop applies inline CSS correctly without breaking core behavior.
15. Button is accessible via keyboard and screen reader with proper naming.

## Example & Test Mapping
- Story: Components/Button — Multiple stories showcasing variants, sizes, colors, icon positions, and disabled state.
- Visual tests: Snapshots for each variant/size/color combination and icon positioning.
- Interaction tests: Click handler invocation, keyboard activation, hover/focus states, disabled behavior.
	- Intent: Confirm behavior and appearance across all prop combinations; not pixel-perfect, but intent-based.
