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
  - **footer**: Optional React node rendered below children with a visual separator.
  - **interactive**: Optional boolean (default false). Enables hover lift and shadow transition.
  - **className**: Optional additional CSS class name.
  - **[key: string]**: Spreads remaining props to the `<article>` (e.g., data attributes).
- DOM:
  - Element: `<article>`
  - Classes: `nw-card`, `nw-card--elevated` (if elevated), `nw-card--interactive` (if interactive).
  - Sub-elements: `nw-card__title`, `nw-card__subtitle`, `nw-card__content`, `nw-card__footer`.

## Visuals
- Container: Rounded corners; light background (theme-driven).
- Title: Bold/prominent text at top.
- Subtitle: Smaller, muted text below title.
- Content: Main body text/elements.
- Footer: Rendered below content with a subtle top border separator (14% foreground opacity).
- Elevation: Shadow effect intensified if `elevated` prop is true.
- Interactive hover: When `interactive` is true, card lifts on hover (`translateY(-2px)`) with a stepped-up shadow. Elevated interactive cards receive a proportionally larger hover shadow.
- Spacing: Internal padding and gaps between sections (CSS-driven).

## Interactions
- Static display by default; no interactive state unless children contain interactive elements.
- When `interactive` is true, the card responds to hover with a lift and shadow transition.
- Hover transitions respect `prefers-reduced-motion: reduce` — transition and transform are disabled.

## Accessibility
- Role: Semantic `<article>` element for self-contained content.
- Heading: If title is a heading, Card hierarchy is determined by heading level within.
- Text: Semantic structure via title/subtitle/content divisions.

## CardFooter — Companion Layout Component

### Purpose
Provides an opinionated flexbox layout for common Card footer patterns (action buttons, metadata text).

### API
- Props:
  - **children**: React node (required). Footer content — typically `Button` components or text.
  - **align**: Optional `"start" | "end" | "center" | "space-between"` (default `"end"`). Controls `justify-content`.
- DOM:
  - Element: `<div>`
  - Classes: `nw-card-footer`, `nw-card-footer--{align}`
- Styling: `display: flex; gap: 8px; align-items: center;` with alignment modifier.

### Usage
```tsx
<Card title="Confirm" footer={
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button variant="solid">Confirm</Button>
  </CardFooter>
}>
  Are you sure?
</Card>
```

### Acceptance Criteria
14. `CardFooter` renders a `<div>` with class `nw-card-footer`.
15. `CardFooter` applies `nw-card-footer--end` by default.
16. `CardFooter` applies `nw-card-footer--{align}` when `align` prop is provided.
17. `CardFooter` children are rendered inside the div.

## Constraints & Non-Goals (Current)
- No click/selection state or active feedback.
- No image/media header (composition approach: pass image as child).

## Acceptance Criteria (Source of Truth for Tests)
1. Renders an `<article>` with class `nw-card`.
2. Displays title if provided; omits section if null/undefined.
3. Displays subtitle if provided; omits section if null/undefined.
4. Displays children content (in `nw-card__content`).
5. Adds class `nw-card--elevated` when `elevated={true}`.
6. Custom className is appended to the class list.
7. Spreads extra props to the article element.
8. Renders footer content in `nw-card__footer` when `footer` prop is provided; omits if null/undefined.
9. Footer has a visible top border separator.
10. Adds class `nw-card--interactive` when `interactive={true}`.
11. Interactive cards transition transform and box-shadow on hover.
12. Interactive cards disable transition and transform when `prefers-reduced-motion: reduce` is active.
13. Interactive elevated cards (`interactive` + `elevated`) show a proportionally larger hover shadow.

## Current Example & Test Mapping
- Story: Components/Organisms/Card — Multiple variants:
  - "Default": Title and content.
  - "WithSubtitle": Title, subtitle, and content.
  - "Elevated": With `elevated={true}`.
  - "NoTitle": Content only.
  - "LongContent": Multi-paragraph content.
  - "WithFooter": Footer text below content.
  - "FooterWithActions": Footer with action buttons.
  - "Interactive": Hover lift on a non-elevated card.
  - "InteractiveElevated": Hover lift on an elevated card.
  - "FullFeatured": All props enabled together.
- Intent: Verify title/subtitle/content/footer rendering, elevation styling, interactive hover, and class application.

## Backlog
- See [card.todo.md](card.todo.md) for future enhancements.
