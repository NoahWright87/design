# Footer — Simple Page Footer Placeholder

## Overview
- Purpose: Render a simple footer element with a placeholder message.
- Implementation: Renders a semantic `<footer>` with hardcoded placeholder text.
- Design system integration: Uses theme colors via CSS; minimal styling.

## API
- Props: None. Footer is a simple, stateless component.
- DOM:
  - Element: `<footer>`
  - Classes: `nw-footer`.

## Visuals
- Appearance: Simple footer bar with placeholder text ("Footer 🤔 maybe... 🤔").
- Background: Theme background color.
- Text: Placeholder message (not configurable in current version).

## Interactions
- Static display; no interactive elements.

## Accessibility
- Role: Semantic `<footer>` element.
- Content: Placeholder text is visible but not critical for accessibility.

## Constraints & Non-Goals (Current)
- No custom content support (placeholder only).
- No configurable styling or props.
- No links or interactive elements.

## Acceptance Criteria (Source of Truth for Tests)
1. Renders a `<footer>` with class `nw-footer`.
2. Displays placeholder text "Footer 🤔 maybe... 🤔".
3. No props or interactive behavior.

## Current Example & Test Mapping
- Story: Components/Footer — renders in Showcase example.
- Intent: Verify footer element renders without errors.

## Backlog
- See [footer.todo.md](footer.todo.md) for future enhancements.
