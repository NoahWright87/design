# Layout — Page Structure with Header/Footer Padding

## Overview
- Purpose: Provide a simple page layout with optional header and footer, with content padding to prevent overlap.
- Implementation: Renders a semantic structure with `<header>`, content `<div>`, and `<footer>`; applies fixed padding top/bottom to content area.
- Design system integration: Padding values (48px) are CSS-driven; no token configuration.

## API
- Props:
  - **header**: Optional React node for header content.
  - **footer**: Optional React node for footer content.
  - **children**: Page content (required).
- DOM:
  - Elements: `<header>`, `<div class="nw-layout">` (content), `<footer>`.
  - Content div receives inline styles for padding-top/bottom.
  - Structure: Fragment wrapper with three sections.

## Visuals
- Header: Top section; fixed positioning expected from Header component within.
- Content: Padded area (48px top, 48px bottom) to prevent overlap with fixed header/footer.
- Footer: Bottom section.
- Colors: Uses theme colors for header/footer (via children components).

## Interactions
- Static layout; interactivity depends on children (Header/Footer content and main content).

## Accessibility
- Semantic structure: `<header>`, content `<div>`, `<footer>` landmarks.
- Hierarchy: Content area is main; a11y depends on children.

## Constraints & Non-Goals (Current)
- Fixed padding values (48px) not configurable.
- No responsive padding adjustments (parents manage breakpoints).
- No built-in header/footer styling (composition approach).

## Acceptance Criteria (Source of Truth for Tests)
1. Renders `<header>`, content `<div>`, and `<footer>` in order.
2. Content div has class `nw-layout` and padding-top/bottom of 48px.
3. Header and footer display children correctly.
4. Content area displays children.

## Current Example & Test Mapping
- Story: Components/Layout — Used in Showcase example with Header and Footer.
- Intent: Verify three-section layout structure and content padding.

## Backlog
- See [layout.todo.md](layout.todo.md) for future enhancements.
