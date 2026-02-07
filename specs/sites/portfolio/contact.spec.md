# Personal Portfolio Site — Contact Page Spec

## Overview

The Contact page provides a way for visitors to reach the portfolio owner through a contact form and social/web links. After form submission, a success modal is displayed (showcasing the Modal component). The page also displays placeholder social media links using fictional platform names from the **Nonsense Atom**.

## Layout & Structure

### Header
- Standard site header with logo/title, desktop navigation menu, and mobile hamburger menu.

### Intro Section
- Centered section with a short paragraph (nonsense: `shortParagraph`).
- Provides context for contacting the owner (e.g., "Get in touch! We'd love to hear from you.").

### Contact Form Container
- Centered, constrained-width section (e.g., max-width: 600px on desktop).
- Contains the form below.

#### Contact Form
The form includes the following fields:

1. **Name Field**
   - Label: "Name"
   - Input type: Text
   - Placeholder: Nonsense category `personName` (e.g., "Morgan Vex")
   - Required: Yes

2. **Email Field**
   - Label: "Email"
   - Input type: Email
   - Placeholder: Generic email format (e.g., "your@email.com") or nonsense from util
   - Required: Yes

3. **Subject Field**
   - Label: "Subject"
   - Input type: Text
   - Placeholder: Nonsense category `shortTitle` (e.g., "Circular Thinking")
   - Required: Yes (optional: could be required or optional)

4. **Message Field**
   - Label: "Message"
   - Input type: Textarea (multi-line text)
   - Placeholder: Nonsense category `longParagraph`
   - Required: Yes

5. **Submit Button**
   - Text: Nonsense CTA text (nonsense: `ctaText`, e.g., "Send Message", "Begin the Journey")
   - Action: On click, display success modal (see below).

#### Form Styling & Behavior

- Form uses standard input components (HTML `<input>`, `<textarea>` with design system styling).
- Inputs have focus states (defined by design system).
- Labels are associated with inputs (for accessibility).
- Spacing between form fields is consistent.
- Submit button has hover and active states.

### Success Modal

Upon form submission, a `Modal` component is displayed with:

- **Title**: Nonsense text (nonsense: `shortTitle`, e.g., "Success!")
- **Message**: Nonsense paragraph (nonsense: `shortParagraph`, e.g., "Thank you for reaching out. We'll get back to you soon.")
- **Close/Dismiss Button**: Text "Close" or similar; closes the modal.

The modal is the primary showcase of the `Modal` component on this page.

### Social/Web Links Section

Below the form (or in a sidebar on desktop), display social or web links:

- **Section Title**: "Connect With Me" or similar.
- **Links**: 4–5 fictional social/web platform profiles using nonsense social site names (nonsense: `socialSiteName`, e.g., "SpaceBook", "ThoughtWave", "VortexNow").
- Each link:
  - Displays the platform name (nonsense: `socialSiteName`).
  - Clicks link to a placeholder URL (e.g., `https://spacebook.fake/user` or `https://vortexnow.xyz`; these links may or may not resolve).
  - Optional: Icon or emoji before the name (if design system supports).

**Link Format Example:**
```
Connect With Me
- SpaceBook
- ThoughtWave
- VortexNow
- Nexus Chat
- Echo Sphere
```

### Footer
- Standard site footer.

## Components Used

- `Header` (with `HamburgerMenu` for mobile, `Menu`/`MenuItem` for desktop)
- `Layout` (page wrapper)
- `Container` (form container, constrained width)
- `Heading` (page title, section titles)
- `Text` (intro paragraph, form labels, link descriptions)
- `Button` (submit button)
- `Link` (social/web links, internal header/footer navigation)
- `Modal` (success message after form submission)
- `Footer`

**Note:** Form inputs (`<input>`, `<textarea>`) use native HTML elements styled with design system CSS (or a Form Input component if available).

## Responsive Behavior

**Mobile (small screens):**
- Single-column layout.
- Form fields stack vertically.
- Form takes full width (with margins).
- Social links displayed below form or in a list.
- Hamburger menu in header.

**Tablet (medium screens):**
- Form remains centered and constrained.
- Social links may be displayed in a grid or single column.

**Desktop (large screens):**
- Form centered in a constrained max-width container (e.g., 600px).
- Social links displayed below form (full width) or in optional right sidebar (if space allows).
- Generous horizontal padding.

## Spacing & Visual Design

- Intro paragraph has generous top margin.
- Form has consistent top margin.
- Form fields have consistent vertical spacing (e.g., 20–30px between fields).
- Submit button has top margin (e.g., 20–30px).
- Social links section has generous top margin (e.g., 60px).
- Modal is centered on screen with semi-transparent overlay.

## Interactions

- Focus into a form field: Focus state is applied (defined by design system; e.g., border color change, shadow).
- Type into form: No special behavior (standard text input).
- Submit button hover: Hover state applied (defined by Button component).
- Click submit: Modal displays (success message).
- Click modal close button: Modal dismisses.
- Click social link: Navigates to placeholder URL (may or may not resolve).

## Accessibility

- Form labels are associated with inputs via `<label for="...">` or semantic HTML.
- Form inputs have clear names and descriptions.
- Modal has a close button and is keyboard dismissible (Escape key).
- Modal role is `dialog` with `aria-modal="true"`.
- All links have descriptive text.
- Color contrast meets WCAG AA.
- Focus management is clear (focus moves to modal when it opens).

## Acceptance Criteria

1. Page displays an intro paragraph.
2. Form is visible and centered with fields for Name, Email, Subject, and Message.
3. All form fields are properly labeled and associated with inputs.
4. Submit button is visible and clickable.
5. Clicking Submit displays a `Modal` with success message.
6. Modal title and message use nonsense copy from Nonsense Atom.
7. Modal has a close/dismiss button.
8. Social/web links section displays 4–5 placeholder platform names (from Nonsense Atom: socialSiteName).
9. Social links are clickable (href is set to placeholder URL).
10. Page is fully responsive: form stacks vertically on mobile, centered on desktop.
11. Form inputs have focus states and visual feedback.
12. Modal is keyboard dismissible (Escape to close).
13. Hamburger menu functions on mobile.
14. Footer is present and consistent.

## Current Example & Test Mapping

- Storybook story: `Sites / Personal Portfolio / Contact`
- Visual test: Full-page screenshot at desktop and mobile viewpoints.
- Visual test: Form visible with all fields labeled.
- Interaction test: Clicking Submit displays the Modal.
- Interaction test: Clicking Modal close button dismisses the modal.
- Interaction test: Social links are clickable (verify href).
- Accessibility test: Form labels are associated with inputs (verify `<label for="...">` or semantic HTML).

## Future Extensions

- Form validation (e.g., email format, required fields).
- Multi-step form with progress indicator.
