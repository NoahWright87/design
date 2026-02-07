# Personal Portfolio Site — Resume Page Spec

## Overview

The Resume page displays a vertical timeline of professional work experience, education, skills, and awards. Each entry includes company/school name, title/degree, dates, a logo or icon (when present), skill pills, a description paragraph, and accomplishments. The page showcases varied layouts and the `Card` component used for timeline entries. All content is generated from the **Nonsense Atom**.

## Layout & Structure

### Header
- Standard site header with logo/title, desktop navigation menu, and mobile hamburger menu.

### Page Title
- "Resume" or similar prominent heading.

### Resume Sections
The page contains four distinct sections, each representing a category:

1. **Work Experience**
2. **Education**
3. **Skills**
4. **Awards & Certifications**

#### Section: Work Experience

**Structure (Vertical Timeline):**
Each job entry is displayed as a vertical entry with:

- **Logo/Icon** (left or top): Uses future `Image` component for company logo. Some entries include a logo; others omit it for variety.
- **Title & Company**: 
  - Job title (nonsense: `jobTitle`)
  - Company name (nonsense: `companyName`)
  - Dates (nonsense: `date`, programmatically generated; e.g., "Jan 2023 – Jun 2024" with realistic 12–48 month duration)
- **Description**: Short paragraph describing the role (nonsense: `longParagraph`).
- **Accomplishments**: Bulleted list of 3–4 outrageous, whimsical accomplishments (nonsense: `accomplishment` repeated).
- **Skills Displayed**: 3–5 skill pills (nonsense: `skillName`, repeated) showing technologies or methods used.

**Repetition:** This entry structure repeats 4–5 times for different jobs.

#### Section: Education

**Structure (Similar to Work Experience):**
Each education entry contains:

- **Logo/Icon** (optional): School/university logo (uses future `Image` component). Some entries have logos; others omit for variety.
- **Degree & School**:
  - Degree/credential name (nonsense: `shortTitle`)
  - School name (nonsense: `companyName`)
  - Dates (nonsense: `date`; e.g., "2018 – 2022")
- **Description**: Short paragraph (nonsense: `shortParagraph`).
- **Relevant Coursework or Specializations**: Bulleted list (nonsense: `skillName`, repeated).

**Repetition:** 2–3 education entries.

#### Section: Skills

**Structure (Flexible Grid or List):**
- Grid or list of skill categories and proficiencies.
- Each skill category (nonsense: `shortTitle`, e.g., "Design Systems", "Frontend Development") contains a comma-separated list of skills (nonsense: `skillName`, repeated).
- Alternatively: Pills/tags for all skills grouped by category.

#### Section: Awards & Certifications

**Structure (Similar to Work/Education):**
Each award entry contains:

- **Award Name** (nonsense: `awardName`, e.g., "Golden Insight Award")
- **Issuer** (nonsense: `companyName`)
- **Date** (nonsense: `date`)
- **Description** (nonsense: `shortParagraph`)

**Repetition:** 3–4 award entries.

### CTA Section
- Below all entries: Two centered buttons:
  - "Download Resume" (or similar nonsense CTA from nonsense: `ctaText`; action: may link to a fake PDF or just be a visual placeholder).
  - "Get in Touch" (or similar; links to Contact page).

### Footer
- Standard site footer.

## Components Used

- `Header` (with `HamburgerMenu` for mobile, `Menu`/`MenuItem` for desktop)
- `Layout` (page wrapper)
- `Container` (resume section container)
- `Heading` (page title, section titles: "Work Experience", "Education", "Skills", "Awards")
- `Text` (entry titles, descriptions, accomplishment lists, skill names)
- `Card` (optional: wrap each entry in a Card for visual separation)
- `Button` (CTA buttons at bottom: "Download Resume", "Get in Touch")
- `Link` (buttons link internally to Contact page or externally to placeholder PDF)
- `Image` (future component; company/school logos)
- `Footer`

## Responsive Behavior

**Mobile (small screens):**
- Single-column layout.
- Logo images scale to fit (e.g., 60–80px width).
- Timeline layout may be linear (no left/right alternation).
- Hamburger menu in header.

**Tablet (medium screens):**
- Single-column layout (may widen slightly).
- Logo images sized appropriately (e.g., 80–100px).

**Desktop (large screens):**
- Still primarily single-column (timeline remains vertical).
- Wide text sections remain readable (constrained column width, e.g., 700px).
- Logo images larger (e.g., 100–120px).
- Optional: Left-aligned logo + right-aligned content for visual alternation (if desired for variety).

## Spacing & Visual Hierarchy

- Clear vertical spacing between sections (e.g., 60–100px).
- Clear spacing between entries within a section (e.g., 40–50px).
- Section headings are prominent.
- Dates and titles are bold or emphasized.
- Accomplishment lists are indented or visually distinct.
- Skill pills have consistent styling (defined by component).

## Interactions

- CTA buttons have hover states and click-to-navigate.
- Skill pills may have hover effects (e.g., highlighting, tooltip).
- "Download Resume" may link to a placeholder PDF (or do nothing if not implemented).

## Accessibility

- All images have alt text (company names, school names, award names).
- Section headings follow hierarchy (h2, h3).
- Bulleted lists are semantic `<ul>` with `<li>` items.
- Dates are clearly labeled (e.g., "Jan 2023 – Jun 2024").
- Skill pills are readable and have sufficient contrast.
- All interactive elements are keyboard accessible.

## Acceptance Criteria

1. Page displays four distinct resume sections: Work Experience, Education, Skills, Awards.
2. Each work entry includes: company logo (optional), job title, company name, dates, description, accomplishments list, and skill pills.
3. Each education entry includes: logo (optional), degree, school name, dates, description, and related coursework/specializations.
4. Skills section lists categories and individual skills.
5. Each award entry includes: award name, issuer, date, and description.
6. Dates are formatted realistically (e.g., "Jan 2023 – Jun 2024"); job durations range 12–48 months.
7. All text is generated from Nonsense Atom categories.
8. Accomplishment text is whimsical and outrageous (as appropriate for nonsense).
9. Logos/images use the future `Image` component; some entries omit logos for variety.
10. Skill pills are displayed using consistent styling (e.g., Tag or pill component, or Text with styling).
11. Two CTA buttons at bottom: "Download Resume" and "Get in Touch".
12. "Get in Touch" button links to Contact page.
13. Page is fully responsive and readable on all viewpoints.
14. Hamburger menu functions on mobile.
15. Footer is present and consistent.

## Current Example & Test Mapping

- Storybook story: `Sites / Personal Portfolio / Resume`
- Visual test: Full-page screenshot at desktop and mobile viewpoints.
- Visual test: Verify all four sections are visible and properly spaced.
- Visual test: Verify some entries include logos and others omit them (variety).
- Interaction test: "Get in Touch" button navigates to Contact page.

## Future Extensions

- Expanded details or modal for each entry.
- Timeline line/connecting visual on larger screens.
- Timeline animation on page load.
