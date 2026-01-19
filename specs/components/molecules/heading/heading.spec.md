# Heading — Semantic Semantic HTML Levels

## Overview
- Purpose: Render semantic heading elements (`<h1>` through `<h6>`) with a simple, type-safe API.
- Implementation: Maps a numeric `level` prop to the corresponding HTML heading tag.
- Design system integration: No custom styling; uses browser defaults and theme text color.

## API
- Props:
  - **level**: 1–6 (required). Determines which `<h>` tag to render.
  - **children**: React node used as the heading text. Required.
- DOM:
  - Element: Dynamic tag (e.g., `<h1>`, `<h2>`, …, `<h6>`).
  - No classes, ids, or inline styles applied.

## Visuals
- Appearance: Browser default heading styles for the chosen level (size, weight, margin).
- Text: Exactly the rendered `children` content.
- No custom variants, colors, or styling overrides.

## Interactions
- Static display; no interactive elements or state.

## Accessibility
- Role: Implicit semantic roles for each heading level (`role="heading"` with `aria-level`).
- Structure: Proper heading hierarchy is the responsibility of the page/parent component.
- Text: Heading name derived from `children`.

## Constraints & Non-Goals (Current)
- No custom styling, sizes, or color variants.
- No styling token integration; relies on browser defaults.
- No margin/padding control; parents must manage spacing.

## Acceptance Criteria (Source of Truth for Tests)
1. Renders the correct heading tag for the given level (e.g., `<h1>` for level 1).
2. Displays `children` exactly as provided.
3. Applies no classes, ids, or inline styles.
4. Each heading level produces the appropriate semantic role.

## Current Example & Test Mapping
- Story: Components/Heading — "H1" (level 1), "H2" (level 2).
- Intent: Verify correct tag rendering and content display.

## Backlog
- See [heading.todo.md](heading.todo.md) for future enhancements.
