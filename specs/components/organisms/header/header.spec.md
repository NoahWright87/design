# Header — Fixed Navigation Container with Left/Center/Right Slots

## Overview
- Purpose: Create a fixed header bar with three customizable content regions (left, center, right) and optional labels.
- Implementation: Renders a semantic `<header>` with three flex slots; supports label text that hides on mobile.
- Design system integration: Uses theme tokens for colors; fixed positioning via CSS; responsive label hiding.

## API
- Props:
  - **left**: Optional React node for left slot (e.g., HamburgerMenu, logo).
  - **center**: Optional React node for center slot (e.g., title, menu).
  - **right**: Optional React node for right slot (e.g., Avatar, theme toggle).
  - **leftLabel**: Optional text label for left slot (hidden on mobile).
  - **centerLabel**: Optional text label for center slot (hidden on mobile).
  - **rightLabel**: Optional text label for right slot (hidden on mobile).
- DOM:
  - Element: `<header>`
  - Role: `role="banner"`.
  - Classes: `nw-header`.
  - Sub-structure: Three flex slots with inner element and label divs.

## Visuals
- Layout: Fixed at top of viewport; sticky behavior.
- Height: ~60px (CSS-driven).
- Background: Theme background color.
- Slots: Three columns with equal/flex sizing (CSS-driven).
- Labels: Appear next to elements on desktop; hidden on mobile via CSS media queries.

## Interactions
- Static layout container; interactive behavior depends on children (Menu, Button, etc.).

## Accessibility
- Role: `role="banner"` for landmark navigation.
- Content: Accessibility depends on slot contents (ensure proper labels/roles in children).
- Labels: Visible labels aid screen reader context; hidden labels via CSS don't affect a11y.

## Constraints & Non-Goals (Current)
- No sticky/fixed positioning as prop; CSS-driven (parent responsibility).
- No responsive breakpoint control via props; CSS-driven.
- No built-in theme switching UI (example provides one).

## Acceptance Criteria (Source of Truth for Tests)
1. Renders a `<header>` with `role="banner"`.
2. Left, center, right slots display children correctly.
3. Left/center/right labels display when provided.
4. Labels are hidden on mobile (CSS media query, <600px).
5. No classes or extra styling applied to slot contents.
6. Fixed positioning maintains header visibility while scrolling.

## Current Example & Test Mapping
- Story: Components/Header — Two variants:
  - "Basic": Simple text in three slots.
  - "WithLabels": Icons in slots with text labels below (responsive).
- Intent: Verify three-slot layout, label display/hiding, and fixed positioning.

## Backlog
- See [header.todo.md](header.todo.md) for future enhancements.
