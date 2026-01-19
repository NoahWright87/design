# Link — Semantic Navigation

## Overview
- Purpose: Render semantic anchor (`<a>`) elements for navigation and external links.
- Implementation: Maps `href` and `children` to a basic `<a>` tag.
- Design system integration: No custom styling; uses browser defaults and theme link color.

## API
- Props:
  - **href**: String URL or path (required). Destination for the link.
  - **children**: React node used as the link text. Required.
- DOM:
  - Element: `<a>`
  - Attributes: `href={href}`.
  - No classes, ids, or inline styles applied.

## Visuals
- Appearance: Browser default link styles (blue text, underline, visited color).
- Text: Exactly the rendered `children` content.
- No custom variants, colors, or styling overrides.

## Interactions
- Click: Navigates to the `href` destination (browser default behavior).
- Keyboard: Accessible via Tab; Enter activates the link.
- Focus: Uses browser default focus ring.

## Accessibility
- Role: Implicit `role="link"` via native `<a>`.
- Name: Derived from `children` text/content.
- URL: Conveyed via `href` attribute.

## Constraints & Non-Goals (Current)
- No custom styling, colors, or variants.
- No router integration (plain `<a>` href-based navigation).
- No external link indicators (e.g., icons).
- No styling token integration.

## Acceptance Criteria (Source of Truth for Tests)
1. Renders an `<a>` element with the given `href`.
2. Displays `children` exactly as provided.
3. Applies no classes, ids, or inline styles.
4. Link is keyboard-accessible and navigable.

## Current Example & Test Mapping
- Story: Components/Link — "Basic" with `href="#"` and text "Go somewhere".
- Intent: Verify correct anchor rendering and content display.

## Backlog
- See [link.todo.md](link.todo.md) for future enhancements.
