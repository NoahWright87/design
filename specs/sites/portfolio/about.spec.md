# Personal Portfolio Site — About Page

## Purpose
The About page presents the portfolio owner through a series of alternating image-and-text sections. It demonstrates varied layout patterns and responsive image integration using placeholder content from the Nonsense Atom.

## Related
- [Portfolio Site Overview](../portfolio.spec.md)

## Contract

### Inputs
Content categories from the Nonsense Atom (titles, paragraphs, call-to-action text).

### Outputs
A page with five distinct content sections in alternating layouts, followed by a centered call-to-action.

### Guarantees / Constraints
- All text content is generated from Nonsense Atom categories.
- All images use the future Image component with responsive sizing.

## Behavior

The page is static display. The layout alternates between image-left-text-right, text-left-image-right, full-width image, text-only, and back to image-left-text-right. This sequence creates visual rhythm without monotony.

At the bottom, a centered call-to-action section provides a link to the Contact page.

## Interface

### Page Structure
- Standard site header at top.
- Five content sections in alternating layouts.
- Centered call-to-action section.
- Standard site footer at bottom.

### Content Sections
Each section uses one of these patterns:
- **Image left, text right** — image at roughly forty percent width, text on the right.
- **Text left, image right** — the inverse of the above.
- **Full-width image** — image spanning the full content width, no text.
- **Text only** — short title and paragraph in a constrained column.

The pattern sequence is: image-text (left), text-image (right), full image, text only, image-text (left).

### Responsive Behavior
All sections stack vertically on small screens. Images scale to full width with margins. Side-by-side layouts appear only on larger screens.

### Call-to-Action
A short paragraph and a centered button with a Nonsense Atom call-to-action label. The button links to the Contact page.

## Acceptance
1. At least five distinct content sections are visible.
2. Sections vary in layout following the defined pattern sequence.
3. All images are responsive and scale appropriately on different screen sizes.
4. All text is generated from Nonsense Atom categories.
5. The centered call-to-action section appears below all content sections.
6. The call-to-action button links to the Contact page.
7. The hamburger menu functions on small screens.
8. Header and footer are present and consistent.
