# Container — Highly Opinionated Flex Layout

## Overview
- Purpose: Provide a flexible, opinionated layout container with built-in spacing, direction, colors, and sizing.
- Implementation: Renders a `<div>` with flex layout; applies spacing tokens via CSS classes; colors via inline styles.
- Design system integration: Tightly integrated with spacing tokens (none, xs, sm, md, lg, xl) and theme colors.

## API
- Props:
  - **direction**: `"vertical"` (default) or `"horizontal"`. Controls flex direction.
  - **padding**: Spacing inside container (`"none" | "xs" | "sm" | "md" | "lg" | "xl"`, default `"md"`).
  - **margin**: Spacing outside container (default `"none"`).
  - **itemSpacing**: Gap between child elements (default `"sm"`).
  - **backgroundColor**: CSS color for background (default `"transparent"`).
  - **foregroundColor**: CSS color for text/foreground (default `"var(--foreground)"`).
  - **width**: CSS width value or number (number → percentage, default `"100%"`).
  - **height**: CSS height value or number (number → percentage, default `"auto"`).
  - **wrap**: Reserved for future options (currently only `"always"` supported).
  - **children**: React node content.
- DOM:
  - Element: `<div>`
  - Classes: `nw-container`, direction class, padding/margin/gap classes.
  - Styles: Inline styles for background, foreground, width, height.

## Visuals
- Layout: Flex container with configurable direction (row/column).
- Spacing: Predictable spacing via CSS token classes.
- Colors: Easily customizable via color props.
- Sizing: Width/height fully controllable (%, px, rem, etc.).

## Interactions
- Static layout container; no interactive state.

## Accessibility
- No semantic role beyond generic `<div>`.
- Content accessibility depends on children; parents must ensure proper hierarchy.

## Constraints & Non-Goals (Current)
- `wrap` prop is reserved but currently only supports `"always"`.
- No flexbox alignment/justify props (opinion: use defaults or extend).
- No responsive breakpoints; parents manage media queries.

## Acceptance Criteria (Source of Truth for Tests)
1. Renders a `<div>` with class `nw-container`.
2. Applies direction class (`horizontal` or `vertical`).
3. Applies padding, margin, and gap classes based on props.
4. Inline styles for background, foreground, width, height are set correctly.
5. Width/height numbers are converted to percentages.
6. Spread and composition work correctly with nested Containers.

## Current Example & Test Mapping
- Story: Components/Container — Multiple variations:
  - "Playground": Basic vertical container with placeholder text.
  - "Directions": Vertical and horizontal nested examples.
  - "SpacingPresets": Showcase all padding presets.
  - "ItemSpacingPresets": Showcase all gap presets.
  - "ColorsAndSizes": Background colors and width/height variations.
- Intent: Verify direction, spacing, color application, and sizing.

## Backlog
- See [container.todo.md](container.todo.md) for future enhancements.
