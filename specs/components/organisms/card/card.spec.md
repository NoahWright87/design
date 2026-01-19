# Card — Content Container with Optional Elevation

## Overview
- Purpose: Create a visually grouped, rounded container for content with optional title/subtitle and elevation.
- Implementation: Renders a semantic `<article>` with optional header (title/subtitle) and children content.
- Design system integration: Uses theme tokens for background/foreground via CSS; elevation via shadow classes.

## API
- Props:
  - **title**: Optional React node for the card title.
  - **subtitle**: Optional React node below the title.
  - **children**: Card content (required or optional).
  - **elevated**: Optional boolean (default false). Adds extra shadow for prominence.
  - **className**: Optional additional CSS class name.
  - **[key: string]**: Spreads remaining props to the `<article>` (e.g., data attributes).
- DOM:
  - Element: `<article>`
  - Classes: `nw-card`, `nw-card--elevated` (if elevated).
  - Sub-elements: `nw-card__title`, `nw-card__subtitle`, `nw-card__content`.

## Visuals
- Container: Rounded corners; light background (theme-driven).
- Title: Bold/prominent text at top.
- Subtitle: Smaller, muted text below title.
- Content: Main body text/elements.
- Elevation: Shadow effect intensified if `elevated` prop is true.
- Spacing: Internal padding and gaps between sections (CSS-driven).

## Interactions
- Static display; no interactive state unless children contain interactive elements.

## Accessibility
- Role: Semantic `<article>` element for self-contained content.
- Heading: If title is a heading, Card hierarchy is determined by heading level within.
- Text: Semantic structure via title/subtitle/content divisions.

## Constraints & Non-Goals (Current)
- No click/selection state or active feedback.
- No image/media header (composition approach: pass image as child).
- No footer or action buttons (composition approach: include in children).

## Acceptance Criteria (Source of Truth for Tests)
1. Renders an `<article>` with class `nw-card`.
2. Displays title if provided; omits section if null/undefined.
3. Displays subtitle if provided; omits section if null/undefined.
4. Displays children content (in `nw-card__content`).
5. Adds class `nw-card--elevated` when `elevated={true}`.
6. Custom className is appended to the class list.
7. Spreads extra props to the article element.

## Current Example & Test Mapping
- Story: Components/Card — Multiple variants:
  - "Default": Title and content.
  - "WithSubtitle": Title, subtitle, and content.
  - "Elevated": With `elevated={true}`.
  - "NoTitle": Content only.
  - "LongContent": Multi-paragraph content.
- Intent: Verify title/subtitle/content rendering, elevation styling, and class application.

## Backlog
- See [card.todo.md](card.todo.md) for future enhancements.
