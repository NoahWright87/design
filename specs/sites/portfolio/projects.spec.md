# Personal Portfolio Site — Projects Page Spec

## Overview

The Projects page displays a curated portfolio of six project examples in a responsive grid. Each project is represented as a `Card` containing a title, description, image, CTA button, and optional skill pills. All content is generated from the **Nonsense Atom**. All project links point to a placeholder external site (NoahWright.dev).

## Layout & Structure

### Header
- Standard site header with logo/title, desktop navigation menu, and mobile hamburger menu.

### Intro Section
- Centered section with a short paragraph (nonsense: `shortParagraph`).
- Provides context for the projects displayed below.

### Projects Grid
- Grid of 6 project cards.
- Desktop: 3 columns.
- Tablet: 2 columns.
- Mobile: 1 column (stacked vertically).
- Consistent spacing and gutters between cards.

#### Project Card Structure (Repeated 6 Times)
Each card contains:

1. **Project Image** (top)
   - Uses future `Image` component.
   - Placeholder is abstract SVG (randomly generated via Nonsense Atom).
   - Aspect ratio: Consistent across all cards (e.g., 16:9 or square).

2. **Project Title**
   - Short placeholder text (nonsense: `projectName`).
   - Displayed as a heading within the card.

3. **Project Description**
   - Short placeholder paragraph (nonsense: `shortParagraph`).
   - Brief overview of the "project."

4. **Skill Pills** (Optional)
   - Some cards (e.g., 3–4 of the 6) include skill tags/pills.
   - Each pill displays a skill name (nonsense: `skillName`).
   - Pills are displayed in a horizontal row.
   - Use a `Text` component or lightweight pill-styled elements.

5. **CTA Button**
   - Text: Placeholder CTA text (nonsense: `ctaText`).
   - Link: All project links point to `https://noahwright.dev` (external, opens in new tab).
   - Button component with consistent styling.

### Footer
- Standard site footer.

## Components Used

- `Header` (with `HamburgerMenu` for mobile, `Menu`/`MenuItem` for desktop)
- `Layout` (page wrapper)
- `Container` (grid container for projects)
- `Heading` (page title, project titles within cards)
- `Text` (intro paragraph, project descriptions)
- `Card` (project cards; all 6 cards use same layout structure)
- `Button` (project CTA buttons)
- `Link` (buttons link to external site; navigation in header)
- `Image` (future component; project image thumbnails)
- `Footer`

## Responsive Behavior

**Mobile (small screens):**
- Single-column layout: Cards stack vertically.
- Cards take full width with margins.
- Image aspect ratio remains consistent.
- Hamburger menu in header.

**Tablet (medium screens):**
- Two-column grid.
- Cards are smaller but maintain aspect ratio.

**Desktop (large screens):**
- Three-column grid.
- Cards are largest (appropriate to viewport).
- Gutters/spacing is generous.

## Spacing & Visual Design

- Uniform spacing between cards (e.g., 20–30px gutters).
- Card padding is consistent (e.g., 16–20px internal padding).
- Image-to-content padding is uniform.
- Button at bottom of card with appropriate margin above.

## Interactions

- Hover over card: Subtle elevation or shadow change (as defined by Card component).
- Click button: Navigate to external site (noahwright.dev) in new tab.
- Hamburger menu: Opens/closes on mobile.

## Accessibility

- Project titles and descriptions are descriptive.
- Button text is clear and actionable.
- Images have alt text describing the project.
- Skill pills have readable text.
- All interactive elements are keyboard accessible.
- Color contrast meets WCAG AA.

## Acceptance Criteria

1. Page displays exactly 6 project cards.
2. Intro paragraph is visible above the grid.
3. Cards are arranged in 3-column layout on desktop, 2-column on tablet, 1-column on mobile.
4. Each card contains: image, title, description, optional skills, and CTA button.
5. Each card uses the `Card` component.
6. Project images are consistent aspect ratio and responsive.
7. Skill pills are visible on 3–4 cards; omitted on others for variety.
8. Button text is from Nonsense Atom (ctaText category).
9. All project buttons link to `https://noahwright.dev`.
10. Links open in new tabs/windows (external navigation).
11. Page is fully responsive and readable on all viewpoints.
12. Hamburger menu functions on mobile.
13. Footer is present and consistent.

## Current Example & Test Mapping

- Storybook story: `Sites / Personal Portfolio / Projects`
- Visual test: Full-page screenshot at desktop (3 columns), tablet (2 columns), and mobile (1 column).
- Visual test: Verify skill pills appear on some cards only.
- Interaction test: Clicking a project button attempts navigation to external site (link href is correct).

## Future Extensions

- Filter or search by skill tag.
- Sorting options (newest, oldest, alphabetical).
- Lightbox/modal to view project details.
- Project categories or types.
- Pagination if more than 6 projects.
