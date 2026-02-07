# Personal Portfolio Site — Home Page Spec

## Overview

The Home page is the landing page of the Personal Portfolio site. It introduces the portfolio owner with a hero section, brief intro, and three navigation cards that link to other pages (Resume, Projects, Contact). The page showcases varied `Card` layouts and establishes the site's visual hierarchy and branding. All text content is generated from the **Nonsense Atom**.

## Layout & Structure

### Header
- Standard site header with logo/title, desktop navigation menu, and mobile hamburger menu.
- Navigation includes links to: Home, About, Projects, Resume, Contact.

### Hero Section
- Full-width section at top of page.
- Contains:
  - **Portrait image**: Large circular image on the left (using `Image` component, shows portrait placeholder). Size: responsive but prominent (e.g., 150–200px on mobile, 250–300px on desktop). Images have a distinct background (subtle gradient with border) to clearly show their size and shape.
  - **Name heading**: H1 heading with the person's name (from nonsense category: `personName`).
  - **Intro text**: Below the heading, a short narrative intro (nonsense category: `introText`), 30–50 words.
  - **CTAs**: Two buttons below the intro text:
    - Primary (solid variant): "View My Work" → links to Projects page.
    - Secondary (outline variant): "Get in Touch" → links to Contact page.
- Mobile: Stack vertically (image above text and buttons).
- Desktop: Side-by-side layout.

### Intro Paragraph
- Centered section below hero with a short paragraph (nonsense category: `shortParagraph`).
- Provides context or additional tagline.

### Navigation Cards Section
- Title: "Explore" (H2 heading).
- Three cards arranged horizontally in a responsive grid.
- Mobile (< 768px): Single column (stack vertically).
- Tablet (768px - 1023px): Two columns.
- Desktop (≥ 1024px): Two columns maximum (not 3).
- Large gap between cards (48px) for clear visual separation.
- All cards use the `Card` component with `elevated` prop for prominent appearance.
- All images have distinct backgrounds to clearly show their size and shape.
- All buttons use the `Button` component from the design system with default bouncy motion for interactive feel.

#### Card 1: Resume
- Layout: Image on left, content on right (on desktop; stacked vertically on mobile).
- Content: Short title (nonsense: `shortTitle`), short description (nonsense: `shortParagraph`), full-width button (solid variant, text from nonsense: `ctaText`).
- **Image**: Uses `Image` component with 4:3 aspect ratio; placeholder is abstract SVG with distinct background.
- **Button**: Uses `Button` component with default bouncy motion.

#### Card 2: Projects
- Layout: Content on top, image on bottom (flipped from Card 1).
- Content: Short title (nonsense: `shortTitle`), short description (nonsense: `shortParagraph`), full-width button (solid variant, text from nonsense: `ctaText`).
- **Image**: Uses `Image` component with 16:9 aspect ratio; placeholder is abstract SVG with distinct background.
- **Button**: Uses `Button` component with default bouncy motion.

#### Card 3: Contact
- Layout: No image, just content (further variety).
- Content: Short title (nonsense: `shortTitle`), short description (nonsense: `shortParagraph`), full-width button (solid variant, text from nonsense: `ctaText`).
- **Button**: Uses `Button` component with default bouncy motion.

All three cards use the `Card` component with variant options to show layout diversity.

### Footer
- Standard site footer with links and placeholder content.

## Components Used

- `Header` (with `HamburgerMenu` for mobile, `Menu`/`MenuItem` for desktop)
- `Layout` (page wrapper)
- `Container` (content region for each section)
- `Heading` (page title, section title "Explore")
- `Text` (intro text, card descriptions)
- `Card` (three navigation cards with different layouts)
- `Button` (CTAs in hero and cards)
- `Link` (internal navigation to other pages)
- `Image` (future component; portrait and card images)
- `Footer`

## Responsive Behavior

**Mobile (small screens):**
- Hero section: Image and text stack vertically.
- Navigation cards: Stack vertically or allow horizontal scroll.
- Hamburger menu in header.

**Tablet (medium screens):**
- Hero: Image left, text/buttons right (if space allows).
- Cards: Two columns, or still stacked depending on space.

**Desktop (large screens):**
- Hero: Image left, text/buttons right, full width.
- Cards: Three columns.

## Accessibility

- All images have alt text (from placeholder utility or descriptive labels).
- Button text is clear and actionable.
- Navigation links have focus states.
- Color contrast meets WCAG AA standards.
- Hamburger menu is keyboard accessible.

## Interactions

- Buttons trigger navigation to other pages (internal routing).
- Hover states on buttons and cards (defined by component specs).
- Hamburger menu opens/closes mobile navigation.

## Acceptance Criteria

1. Hero section displays portrait image, person's name (H1), intro text, and two CTAs side-by-side on desktop, stacked on mobile.
2. Portrait image is circular and appropriately sized.
3. Hero buttons use `Button` component with "View My Work" (solid variant) and "Get in Touch" (outline variant), and they navigate to Projects and Contact pages, respectively.
4. Hero buttons use default bouncy motion for interactive feel.
5. Intro paragraph is centered and uses nonsense copy.
6. "Explore" heading (H2) appears above navigation cards.
7. Three navigation cards are clearly visible with distinct layouts (image left, image bottom, no image).
8. Cards are arranged in a responsive 2-column grid: single column on mobile, 2 columns on tablet and desktop.
9. Cards have large gap (48px) between them for clear visual separation.
10. All cards use the `Card` component with `elevated` prop.
11. Each card has a title (H3), description, and full-width CTA button (solid variant).
12. All buttons use the `Button` component from the design system with default bouncy motion.
13. All images have distinct backgrounds (subtle gradient with border) to clearly show their size and shape.
14. On desktop, Card 1 has image on left (45% width) and content on right.
15. Navigation links in header/menu correctly link to all five pages.
16. Page is fully responsive: single column on mobile, 2-column grid on tablet/desktop.
17. Footer is present and consistent with site footer throughout.

## Current Example & Test Mapping

- Storybook story: `Sites / Personal Portfolio / Home`
- Visual test: Full-page screenshot of home page at desktop and mobile viewpoints.
- Interaction test: Clicking hero buttons navigates to Projects and Contact pages.
- Interaction test: Hamburger menu opens/closes on mobile.

## Future Extensions

- Animated intro text (fade-in on page load).
- Carousel or rotating testimonials below cards.
- Theme toggle in header (using existing theme system).
