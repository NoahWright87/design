# Text — Semantic Paragraph Content

## Overview
- Purpose: Render semantic paragraph (`<p>`) elements for body text and content blocks.
- Implementation: Wraps `children` in a `<p>` tag.
- Design system integration: No custom styling; uses browser defaults and theme text color.

## API
- Props:
  - **children**: React node used as the paragraph content. Required.
- DOM:
  - Element: `<p>`
  - No classes, ids, or inline styles applied.

## Visuals
- Appearance: Browser default paragraph styling (font size, line-height, margin).
- Content: Exactly the rendered `children`.
- No custom variants, colors, or sizing.

## Interactions
- Static display; no interactive elements or state.

## Accessibility
- Role: No special role; semantic paragraph element.
- Content: Text and inline elements within the paragraph are read as-is.

## Constraints & Non-Goals (Current)
- No custom styling, colors, or variants.
- No sizing/weight control; relies on browser defaults.
- No margin/padding overrides; parents manage spacing.

## Acceptance Criteria (Source of Truth for Tests)
1. Renders a `<p>` element.
2. Displays `children` exactly as provided.
3. Applies no classes, ids, or inline styles.

## Current Example & Test Mapping
- Story: Components/Text — "Basic" with text "Hello world".
- Intent: Verify correct paragraph rendering and content display.

## Backlog
- See [text.todo.md](text.todo.md) for future enhancements.
