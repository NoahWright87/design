# Personal Portfolio Site — Resume Page

## Purpose
The Resume page presents a vertical timeline of professional work experience, education, skills, and awards. It showcases the Card component as timeline entries and demonstrates varied content layout within a single-column page.

## Related
- [Portfolio Site Overview](../portfolio.spec.md)
- [Card component](../../components/organisms/card/card.spec.md)
- [Pill component](../../components/molecules/pill/pill.spec.md)

## Contract

### Inputs
Content from the Nonsense Atom (job titles, company names, dates, descriptions, accomplishments, skill names, award names).

### Outputs
A structured resume page with four labeled sections, each containing multiple timeline entries, followed by two call-to-action buttons.

### Guarantees / Constraints
- All text is generated from Nonsense Atom categories.
- Date ranges are realistic and programmatically generated.
- Some entries include logo images; others do not, for visual variety.

## Behavior

The page is static display. Entries are arranged vertically within each section. Call-to-action buttons at the bottom link to the Contact page and to a placeholder resume download.

## Interface

### Page Structure
- Standard site header at top.
- Prominent page title.
- Four resume sections.
- Two call-to-action buttons.
- Standard site footer.

### Section: Work Experience
Four to five job entries, each with:
- Optional company logo image.
- Job title, company name, and date range.
- Role description paragraph.
- Bulleted accomplishments list.
- Skill labels displayed as pills.

### Section: Education
Two to three entries with degree, school name, dates, a description, and related coursework.

### Section: Skills
Skill categories with associated skill lists, displayed as grouped pills or a categorical list.

### Section: Awards and Certifications
Three to four entries with award name, issuer, date, and description.

### Call-to-Action
Two centered buttons: one for downloading the resume (placeholder action) and one linking to the Contact page.

### Responsive Behavior
Single-column layout at all screen sizes. Logo images scale to fit. Hamburger menu in the header on small screens.

## Acceptance
1. Four distinct sections are visible: Work Experience, Education, Skills, Awards.
2. Work entries include title, company name, date range, description, accomplishments, and skill labels.
3. Education entries include degree, school, dates, description, and coursework.
4. Skills section lists categories and associated skills.
5. Award entries include name, issuer, date, and description.
6. Some entries include logo images; others do not.
7. Date ranges are formatted naturally and realistically.
8. All text is from Nonsense Atom categories.
9. The "Get in Touch" button links to the Contact page.
10. The page is responsive and readable on all screen sizes.
11. Header and footer are present and consistent.
