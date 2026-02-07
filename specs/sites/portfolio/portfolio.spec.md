# Personal Portfolio Site — Overview Spec

## Introduction

The Personal Portfolio Site is a multi-page example mini-website composed entirely from design system components. It showcases a portfolio or professional landing page, with a consistent header/footer navigation structure and five main pages. The site demonstrates layout composition, responsive design, and varied use of components across different page types.

The portfolio site is accessible and viewable in two ways:
1. As a Storybook story showing the home page preview (may load in an iframe or as a simple preview).
2. As a full, interactive site when launched into a separate browser tab/window.

## Design Goals

- **Component showcase**: Use all major design system components (`Header`, `Footer`, `Layout`, `Container`, `Card`, `Heading`, `Text`, `Link`, `Button`, `Avatar`, `HamburgerMenu`, `Menu`, `MenuItem`, `Modal`, and image support via a future Image component).
- **Responsive excellence**: Site should be fully responsive across mobile, tablet, and desktop viewpoints.
- **Navigation variety**: Demonstrate mobile/desktop navigation patterns using `HamburgerMenu` (mobile) and `Menu` (desktop).
- **Content filler**: All text content is generated from the **Nonsense Atom** (see [nonsense.spec.md](../../atoms/nonsense.spec.md)) to avoid cluttering specs with hardcoded content.

## Site Structure

### Layout Foundation

#### Header
Present on every page with three distinct sections:

- **Left**: `HamburgerMenu` component that expands to reveal site navigation using `Menu` and `MenuItem` components. Navigation items:
  - Home
  - About
  - Projects
  - Resume
  - Contact
  
- **Center**: Logo/icon (future `Avatar` or small graphic) + site title generated from `getNonsense('shortTitle')`.

- **Right**: 
  - `Avatar` component that opens a dropdown menu (using `Menu` and `MenuItem` components). Menu items:
    - Light/Dark toggle (switches theme using `toggleThemeMode()` from theme utilities)
    - Login (opens login modal with placeholder message: "If this were a real site, a login box would be here!")

#### Main Content
Each page uses `Layout` and `Container` components to define content regions. Page-specific content is defined in individual page specs.

#### Footer
Present on every page with three distinct sections in a horizontal layout (matching header structure):

- **Left**: "Follow:" label followed by social links as icon links. Icons use emoji or simple characters (♥, ★, ◆, etc.) with `Link` components wrapping them. Social platform names generated from `getNonsense('socialSiteName')` appear as link aria-labels and in hover tooltips with action phrases like "Follow me on [Platform]", "Connect on [Platform]", "Find me on [Platform]", or "Check out [Platform]".

- **Center**: Copyright text: "Copyright © [Noah Wright](https://noahwright.dev) 2026" (legitimate, non-nonsense content with link to NoahWright.dev)

- **Right**: "Powered by React • TypeScript • Storybook" (legitimate, non-nonsense content)

All footer text is the same size. Footer has a distinct background color (theme primary color) to differentiate it from main content area and extends edge-to-edge across the viewport.

### Pages

1. **Home** — [home.spec.md](portfolio/home.spec.md)
   - Hero section with intro, portrait image, and CTAs.
   - Intro paragraph.
   - Three navigation cards (Resume, Projects, Contact) showcasing varied `Card` layouts.

2. **About** — [about.spec.md](portfolio/about.spec.md)
   - Multiple sections with alternating image/text layouts.
   - Each section uses placeholder content and styling variety.
   - Centered CTA button at bottom.

3. **Projects** — [projects.spec.md](portfolio/projects.spec.md)
   - Intro paragraph.
   - Grid of 6 project cards, each with title, description, image, CTA link, and optional skill pills.
   - All project links point to a placeholder external site (NoahWright.dev).

4. **Resume** — [resume.spec.md](portfolio/resume.spec.md)
   - Vertical timeline of work experience, education, skills, and awards.
   - Each entry includes company/school name, role/degree, dates, logo (when present), skills pills, description, and accomplishments.
   - Resume and Contact CTAs at bottom.

5. **Contact** — [contact.spec.md](portfolio/contact.spec.md)
   - Intro paragraph.
   - Contact form with name, email, subject, message, and submit button.
   - Social/web links (using placeholder social site names).
   - Success modal shown after form submission (to showcase Modal component).

## Navigation Model

- **All screen sizes**: Hamburger menu in header left slot opens a `Menu` with navigation links using `MenuItem` components. Menu closes after navigation.
- **Header interactions**:
  - Hamburger menu → Internal navigation
  - Avatar (right) → Login modal
  - Theme toggle (right) → Switches light/dark mode
- **Links**: Internal navigation uses the site's internal routing (behavior specified per page). External links (e.g., project links, social links) may open in new tabs or external windows as appropriate.

## Responsive Behavior

All pages are fully responsive:
- **Mobile** (small screens): Single-column layout, horizontal scrolling where needed, hamburger menu in header.
- **Tablet** (medium screens): Two-column layouts, adapted card grids.
- **Desktop** (large screens): Full multi-column layouts, horizontal menu in header.

Breakpoints and token definitions follow the design system's theme tokens.

## Component Utilization Summary

| Component | Usage |
|-----------|-------|
| `Header` | Site header on every page |
| `Footer` | Site footer on every page |
| `Layout` | Page content wrapper for consistent spacing |
| `Container` | Content regions, card containers |
| `Card` | Project cards, navigation cards, entry cards (resume) |
| `Heading` | Page titles, section headers |
| `Text` | Body paragraphs, descriptions |
| `Link` | Navigation links, project links, social links |
| `Button` | CTAs, form submission |
| `Avatar` | Profile icon or small image (see `Image` for larger content images) |
| `Menu` / `MenuItem` | Navigation menu (desktop and mobile) |
| `HamburgerMenu` | Mobile navigation trigger |
| `Modal` | Contact form success message |
| `Image` (future) | Hero portrait, section images, project thumbnails, logos |

## Content & Placeholder Strategy

All text content (names, titles, descriptions, accomplishments, etc.) is drawn from the **Nonsense Atom** (see [nonsense.spec.md](../../atoms/nonsense.spec.md)). This makes the specs readable and implementation-agnostic, avoiding verbose hardcoded prose.

## Acceptance Criteria

1. Site uses only design system components; no custom HTML or external libraries.
2. All five pages are defined with clear layout and component specifications.
3. Home page preview is displayable in Storybook.
4. Full site can launch in a separate browser tab/window.
5. Desktop and mobile navigation are distinct (menu vs. hamburger).
6. Responsive design works across mobile, tablet, and desktop viewpoints.
7. All placeholder content is generated via the Nonsense Atom utility.
8. Contact form includes Modal component for success feedback.
9. Images are sourced via the future Image component (placeholder SVG or data URL in interim).

## Story Mapping

Related Storybook stories:
- `Sites / Personal Portfolio / Home`
- `Sites / Personal Portfolio / About`
- `Sites / Personal Portfolio / Projects`
- `Sites / Personal Portfolio / Resume`
- `Sites / Personal Portfolio / Contact`

Each story includes a link or button to launch the full site in a new tab.

## Future Extensions

- Alternative portfolio templates (e.g., designer portfolio, developer portfolio, artist portfolio).
- Form validation and actual backend submission.
- Blog or article listing page.
- Dark mode toggle (already supported via theme system).
- Internationalization (i18n) for multi-language support.
- Search or filter capabilities on projects page.
