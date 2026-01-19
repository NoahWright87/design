# Colors — Theme Tokens Display

## Overview
- Purpose: Visualize all theme color tokens in a grid format so designers and developers can see the current color palette.
- Implementation: Fetches computed CSS custom property values from `--foreground`, `--background`, `--primary`, `--secondary`, `--confirm`, `--danger`, `--overlay` and renders a labeled color card for each.
- Design system integration: Directly renders theme tokens from `theme.css`.

## Page Structure
- Title: "Theme colors"
- Layout: Flex grid with horizontal wrapping.
- Cards: Each color token displays a 120px tall swatch, token name, and resolved hex/color value.
- Padding: 24px outer container.
- Card spacing: 12px gap between cards.

## Visuals
- Card size: 220px wide (adjusts with flex wrap).
- Swatch height: 120px (full color display).
- Text: Token name (12px, gray #666) above monospace value (regular size).
- Border: 1px solid #eee; 8px border-radius.
- Background: Page background uses `var(--background)`.

## Interactions
- Static display; no interactive elements.
- All token values are read from the DOM at mount via `getComputedStyle`.

## Accessibility
- Role: Informational page; heading conveyed via `<h1>` element.
- Purpose: Reference tool for designers/developers; not a user-facing UI.
- Color swatches paired with token names for those unable to rely on color alone.

## Acceptance Criteria (Source of Truth for Tests)
1. Page renders a `<h1>` with "Theme colors".
2. One color card is rendered for each token in `cssTokenNames`.
3. Each card displays the token name and its computed value.
4. Swatch height is ~120px; card width is ~220px.
5. Cards wrap horizontally with 12px spacing.
6. No errors when tokens are missing or resolve to `"(not set)"`.

## Current Story & Test Mapping
- Story: Examples/Colors — "ColorGrid".
- Intent: Confirm all theme tokens are visible and render without errors.

## Backlog
- Potential future enhancements: contrast checker, export color values, copy-to-clipboard for token names.
