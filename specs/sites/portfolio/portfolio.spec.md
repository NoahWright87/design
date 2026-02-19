# Personal Portfolio Site — Overview

## Purpose
The Personal Portfolio Site is a multi-page example mini-website composed entirely from design system components. It demonstrates layout composition, responsive design, and varied component use across five distinct pages.

## Related
- [Home Page](portfolio/home.spec.md)
- [About Page](portfolio/about.spec.md)
- [Projects Page](portfolio/projects.spec.md)
- [Resume Page](portfolio/resume.spec.md)
- [Contact Page](portfolio/contact.spec.md)
- [Nonsense Atom](../../atoms/nonsense.spec.md)

## Contract

### Inputs
- Nonsense Atom content categories for all placeholder text.
- User navigation between pages.

### Outputs
A five-page site viewable as Storybook stories or as a standalone site launched in a browser tab.

### Guarantees / Constraints
- All text content (except the copyright notice and technology credits) comes from the Nonsense Atom.
- The site uses only design system components; no custom HTML or external libraries.
- The site is fully responsive across mobile, tablet, and desktop viewports.

## Behavior

The site functions as a navigable multi-page website. Navigation is available via the hamburger menu in the header on all screen sizes. The avatar in the right header slot opens a menu with a theme toggle and a login placeholder. Internal links navigate between pages; external links open in a new tab.

## Interface

### Site-Wide Header
Present on every page with three slots:
- **Left** — hamburger menu triggering navigation to all five pages.
- **Center** — logo or icon and site title from the Nonsense Atom.
- **Right** — avatar opening a dropdown with a theme toggle and a login placeholder.

### Site-Wide Footer
Present on every page with three sections:
- **Left** — "Follow:" label and icon-based social links using fictional platform names from the Nonsense Atom.
- **Center** — copyright notice linking to the owner's site.
- **Right** — technology credits.

The footer has a visually distinct background (using the theme primary color) that spans the full viewport width.

### Pages
1. **Home** — hero section, intro paragraph, and three navigation cards.
2. **About** — alternating image-and-text sections with a call-to-action at the bottom.
3. **Projects** — responsive grid of six project cards with images, descriptions, and links.
4. **Resume** — vertical timeline of work experience, education, skills, and awards.
5. **Contact** — contact form and social links; success modal displayed on submission.

## Acceptance
1. All five pages are defined with clear layout and component specifications.
2. The home page is viewable as a Storybook story.
3. The full site can be launched in a separate browser tab.
4. Navigation functions correctly on all pages and screen sizes.
5. Responsive design works across mobile, tablet, and desktop.
6. All placeholder content uses the Nonsense Atom.
7. The contact form shows the success modal on submission.
8. Images use the future Image component throughout.
