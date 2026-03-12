# Personal Portfolio Site — Home Page

## Purpose
The Home page is the landing page of the Personal Portfolio site. It introduces the portfolio owner with a hero section, a brief intro, and three navigation cards linking to other pages. It showcases varied Card layouts and establishes the site's visual identity.

## Related
- [Portfolio Site Overview](../portfolio.spec.md)

## Contract

### Inputs
Content from the Nonsense Atom (person name, intro text, short paragraphs, and call-to-action labels).

### Outputs
A landing page with a hero section, intro paragraph, and three navigation cards, each linking to a distinct page.

### Guarantees / Constraints
- All text content is generated from Nonsense Atom categories.
- All images use the future Image component.
- Card buttons use the bouncy motion preset.

## Behavior

The page is primarily static. Buttons in the hero and on the cards link to other pages. The hamburger menu in the header opens mobile navigation.

## Interface

### Header
Standard site header with navigation links to all five pages.

### Hero Section
A prominent section with a large circular portrait on the left (on desktop) and the person's name as the main heading, introductory text, and two action buttons alongside it. On small screens, the portrait stacks above the text and buttons.

The primary button links to the Projects page. The secondary (outline) button links to the Contact page. Both use the default bouncy motion.

### Intro Paragraph
A short centered paragraph below the hero provides an additional tagline.

### Navigation Cards
An "Explore" heading introduces a responsive grid with three cards:
- **Resume card** — image on the left, content on the right.
- **Projects card** — content on top, image on the bottom.
- **Contact card** — content only, no image.

All three cards are elevated and each has a title, a short description, and a full-width call-to-action button. The grid shows two columns on larger screens and a single column on small screens.

### Footer
Standard site footer.

## Acceptance
1. Hero section shows portrait image, name as the main heading, introductory text, and two buttons.
2. Portrait is circular and sized prominently.
3. The primary button links to Projects; the secondary button links to Contact.
4. Both hero buttons use the bouncy motion preset.
5. Intro paragraph is centered and uses Nonsense Atom copy.
6. An "Explore" heading appears above the navigation cards.
7. Three cards are visible with distinct layouts.
8. Cards are elevated and each has a title, description, and action button.
9. Cards display in two columns on larger screens and single column on small screens.
10. All navigation links in the header work correctly.
11. The footer is present and consistent.
