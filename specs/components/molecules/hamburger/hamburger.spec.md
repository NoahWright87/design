# HamburgerMenu — Mobile Navigation Toggle

## Overview
- Purpose: Render a mobile-friendly hamburger menu button (three horizontal lines) with open/close state visual feedback.
- Implementation: Renders a `<button>` with three `<span>` children; animated via CSS based on `isOpen` state.
- Design system integration: Uses theme colors via CSS; animation/styling via classes.

## API
- Props:
  - **isOpen**: Optional boolean (default false). Controls visual open/closed state.
  - **onToggle**: Optional click handler. Called when button is clicked.
- DOM:
  - Element: `<button type="button">`
  - Classes: `hamburger`, `open` (if `isOpen={true}`).
  - ARIA attributes: `aria-label="Menu"`, `aria-expanded={isOpen}`.
  - Children: Three `<span>` elements (no classes).

## Visuals
- Appearance: Three stacked horizontal lines (classic hamburger icon).
- Animation: Lines transform when `open` class is applied (CSS-driven).
  - Typically: top/bottom lines rotate inward, middle line fades or scales.
- Size: Controlled via CSS (no size prop).
- Color: Uses theme foreground color via CSS.

## Interactions
- Click: Invokes `onToggle()` when clicked.
- Keyboard: Accessible via Tab; Space/Enter activate.
- Focus: Browser default focus ring.

## Accessibility
- Role: Implicit `role="button"` via native `<button>`.
- ARIA: `aria-label="Menu"` provides name; `aria-expanded={isOpen}` indicates state.
- Keyboard: Fully keyboard-accessible.

## Constraints & Non-Goals (Current)
- No built-in menu panel (button only; parent handles Menu component).
- No size variants; styling is CSS-only.
- No custom icons or label text (always "Menu").

## Acceptance Criteria (Source of Truth for Tests)
1. Renders a `<button type="button">` with class `hamburger`.
2. Renders three `<span>` children (no text).
3. Applies class `open` when `isOpen={true}`.
4. Has `aria-label="Menu"` and `aria-expanded={isOpen}`.
5. `onClick` invokes `onToggle()` handler.
6. Visual animation via CSS shows open/closed state.

## Current Example & Test Mapping
- Story: Components/Menu — Used as trigger in menu examples (WithHamburger, LeftAligned).
- Intent: Verify button rendering, state class application, and click handling.

## Backlog
- See [hamburger.todo.md](hamburger.todo.md) for future enhancements.
