# Showcase — Full-Page Component Composition

## Overview
- Purpose: Compose multiple components (Header, Footer, Heading, Text, Button, Link, Card, Modal) into a realistic page layout to demonstrate how they work together.
- Implementation: Single story rendering a complete page with header, main content sections, cards grid, modal dialog, and footer.
- Design system integration: Uses all core components; demonstrates real-world spacing, typography, and interaction patterns.

## Page Structure
- Header: At top (fixed or static).
- Main content: Centered column with max-width 980px; flex layout for full viewport height.
- Sections:
  1. Hero: Heading (level 1), descriptive Text, buttons/links.
  2. Cards: Grid of 3 Card components (responsive, auto-fit, 300px min).
  3. Modal: Example showing Button trigger → Modal with content and actions.
  4. Typography: Final section demonstrating Text and Heading combinations.
- Footer: At bottom.

## Visuals
- Page layout: Full-height flex container (`minHeight: 100vh`, `display: flex`, `flexDirection: column`).
- Main: `flex: 1` to push footer down; `padding: 48px 24px`; `maxWidth: 980px`; `margin: 0 auto`.
- Headings: Level 1 (main title), Level 2 (section titles).
- Text: Body copy for descriptions.
- Buttons: "Primary action", "Secondary" (no variant styling currently).
- Link: "A contextual link".
- Cards: Three cards with titles, subtitles, optional `elevated` prop; display in 3-column grid (responsive, 20px gap).
- Card props demonstrated:
  - Card 1: title, subtitle.
  - Card 2: title, elevated.
  - Card 3: title only.
- Modal: Dialog with title, descriptive text, two action buttons (labels: "Got it", "Learn more").

## Interactions
- Button "Open Modal Example": Toggles `modalOpen` state → Modal appears.
- Modal: 
  - Content displays within modal dialog.
  - Action buttons visible (no specific behavior implemented; illustrative).
  - Close via button click or (implicitly) outside click / Escape key.
- Links and buttons: No routing; illustrative only.

## Accessibility
- Page structure: Proper heading hierarchy (h1, h2).
- Text: Descriptive copy for all visual elements.
- Modal: Dialog role; focus management; title association.
- Buttons/Links: Semantic HTML; accessible names.

## Constraints & Non-Goals (Current)
- No actual routing or form submission.
- Modal action buttons log to console or trigger no-op; no real business logic.
- Cards are static; no interactive state.
- No CSS animations or transitions (purely structural).

## Acceptance Criteria (Source of Truth for Tests)
1. Page renders Header, Footer, and main content area correctly.
2. Main content is centered with max-width ~980px and proper padding.
3. Hero section displays Heading (level 1) and Text.
4. Buttons and Links are visible and clickable (no errors).
5. Cards grid displays 3 cards with titles and (for card 2) elevated styling.
6. Modal button is clickable; opens Modal dialog.
7. Modal dialog displays title, content text, and action buttons.
8. Modal closes when requested (button click or outside interaction).
9. Footer is visible at bottom of page.
10. Layout is responsive; cards reflow on smaller viewports.

## Current Story & Test Mapping
- Story: Examples/Showcase — "Page".
- Intent: Verify all core components render together without errors; demonstrate realistic layout and composition patterns.

## Backlog
- Example sub-pages or navigation between sections.
- Form component integration (address form, contact form).
- Animation/interaction state transitions.
- Accessibility audit and refinement (ARIA, focus management, keyboard support).
- SEO/metadata integration (meta tags, schema markup).
