# Personal Portfolio Site — About Page Spec

## Overview

The About page provides biographical and contextual information about the portfolio owner through a series of alternating image/text sections. The page demonstrates varied layout patterns and image integration, using the future `Image` component. All text content is generated from the **Nonsense Atom**.

## Layout & Structure

### Header
- Standard site header with logo/title, desktop navigation menu, and mobile hamburger menu.

### Page Content
The page contains multiple sections, each with one of three layout patterns:

#### Section 1: Image Left, Text Right
- **Image**: Uses future `Image` component; sized responsively (e.g., 40% width on desktop).
- **Text**: Short title (nonsense: `shortTitle`), followed by a medium-to-long paragraph (nonsense: `longParagraph`).
- Mobile: Stack vertically (image above text).
- Desktop: Side-by-side.

#### Section 2: Text Left, Image Right (Flipped)
- **Text**: Short title (nonsense: `shortTitle`), followed by a medium paragraph (nonsense: `shortParagraph`).
- **Image**: Uses future `Image` component; sized responsively (e.g., 40% width on desktop).
- Mobile: Stack vertically (text above image).
- Desktop: Side-by-side (flipped from Section 1).

#### Section 3: Image Only (Full Width)
- **Image**: Uses future `Image` component; full-width or nearly full-width with margins.
- No text accompaniment for variety.
- Can be used for visual break or emphasis.

#### Section 4: Text Only
- **Text**: Short title (nonsense: `shortTitle`), followed by a longer paragraph (nonsense: `longParagraph`).
- No image.
- Centered or left-aligned text in a constrained column width.

#### Section 5: Image Left, Text Right (Repeated Pattern)
- Similar to Section 1 but with different nonsense content.
- Demonstrates repetition with variation.

**Pattern Sequence (for variety):**
Sections appear in order: Image+Text (left), Text+Image (right), Image (full), Text (only), Image+Text (left).

This creates visual rhythm without monotony.

### Centered CTA Section
- Below all content: A centered, full-width section with:
  - Paragraph of intro/transition text (nonsense: `shortParagraph`).
  - Single centered button with nonsense CTA text (nonsense: `ctaText`).
  - Button links to Contact page or another relevant page.

### Footer
- Standard site footer.

## Components Used

- `Header` (with `HamburgerMenu` for mobile, `Menu`/`MenuItem` for desktop)
- `Layout` (page wrapper)
- `Container` (content region for each section)
- `Heading` (short titles within sections)
- `Text` (paragraphs within sections)
- `Image` (future component; section images, some with images, some without)
- `Button` (centered CTA at bottom)
- `Link` (internal navigation to Contact page from CTA button)
- `Footer`

## Responsive Behavior

**Mobile (small screens):**
- All sections stack vertically.
- Images scale to full width with margins.
- Text sections are single column.
- Hamburger menu in header.

**Tablet (medium screens):**
- Image+Text sections retain side-by-side layout if space allows.
- Images may be smaller to fit tablet width.
- Single-column text sections remain centered.

**Desktop (large screens):**
- Full side-by-side layouts for Image+Text sections.
- Images and text have appropriate proportions (e.g., 40/60 split).
- Wide centered text sections remain readable (constrained column width).

## Spacing & Visual Hierarchy

- Generous vertical spacing between sections (e.g., 60–100px on desktop, 40–60px on mobile).
- Horizontal padding/margins consistent with site-wide Container component.
- Headings use prominent sizing (Heading component with appropriate variant).
- Paragraph text uses standard Text component sizing.

## Accessibility

- All images have descriptive alt text.
- Headings follow hierarchy (h2 or h3).
- Color contrast meets WCAG AA.
- Text sections are readable with sufficient line height and width.

## Interactions

- CTA button has hover state and click-to-navigate.
- Images may have subtle hover effects (defined by Image component).
- Internal navigation works as expected.

## Acceptance Criteria

1. Page displays at least five distinct content sections.
2. Sections vary in layout: Image+Text (left), Text+Image (right), Image (full), Text (only).
3. All images use the future `Image` component.
4. Images are responsive and scale appropriately on mobile, tablet, and desktop.
5. All text content is generated from Nonsense Atom categories.
6. Text sections use `Heading` and `Text` components.
7. Sections have clear visual separation with vertical spacing.
8. Centered CTA section at bottom includes intro text and a button.
9. CTA button navigates to Contact page.
10. Page is fully responsive and readable on all viewpoints.
11. Hamburger menu functions on mobile.
12. Footer is present and consistent.

## Current Example & Test Mapping

- Storybook story: `Sites / Personal Portfolio / About`
- Visual test: Full-page screenshot at desktop and mobile viewpoints.
- Visual test: Verify section variety and layout alternation.
- Interaction test: CTA button navigates to Contact page.

## Future Extensions

- Collapse/expand sections or accordion-style layout.
- Animated section reveal on scroll.
- Testimonials or quote callouts within sections.
