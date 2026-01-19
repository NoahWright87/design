# Button — Current Behavior Spec

This document describes the current behavior and appearance of the Button component as implemented today. It serves as source of truth for tests.

## Overview
- Purpose: Provide a minimal clickable control using the native HTML `<button>` element.
- Implementation summary: Renders a `<button type="button">` with its label from `children`; optionally wires `onClick`.
- Design system integration: None yet; uses browser default styling (no custom classes or tokens).

## API
- Props:
	- children: React node used as the visible label. Required.
	- onClick: Optional mouse event handler, called on activation.
- DOM:
	- Element: `<button>`
	- Attributes: `type="button"`
	- No additional attributes, classes, or inline styles applied.

## Visuals
- Appearance: Native browser default button (platform-specific).
- Label: Exactly the rendered `children` content (e.g., text "Click me").
- No variants, sizes, colors, or icon support at present.

## Interactions
- Pointer: Clicking the button activates it and invokes `onClick` (if provided).
- Keyboard: Follows native button behavior — Space/Enter activate when focused.
- Focus: Uses the browser’s default focus ring for `<button>`.
- Disabled/Loading: Not supported; there is no `disabled` prop nor state handling.

## Accessibility
- Role: Implicit `role="button"` via native `<button>`.
- Name: Derived from `children` text/content.
- Tab order: Focusable by default as native control.
- No ARIA attributes currently added or required.

## Constraints & Non-Goals (Current)
- No styling system (tokens, classes) is applied.
- No visual variants (primary/secondary), sizes, or icons.
- No `disabled`, `aria-*`, or loading state props.
- No custom focus management beyond native behavior.

## Acceptance Criteria (Source of Truth for Tests)
1. Renders a `<button type="button">` element in the DOM.
2. Displays `children` exactly as provided (e.g., "Click me").
3. Invokes `onClick` when activated via pointer.
4. Is keyboard-activatable via Space/Enter (native behavior).
5. Applies no extra classes or inline styles; appearance is browser default.

## Current Example & Test Mapping
- Story: Components/Button — "Basic" shows `children: "Click me"`.
- Visual test: Snapshot of the Basic story is captured as `button-basic.png`.
	- Intent: Confirm presence and general look of a native button labeled "Click me" (not pixel-perfect; platform differences allowed).
