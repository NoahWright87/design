# Contact Form — Full-Page Form Composition

## Overview
- Purpose: Compose all four form primitives (Input, Select, Checkbox, RadioGroup) with Card, Button, Header, Footer, Heading, and Text into a realistic contact form page.
- Implementation: Single story rendering a complete page with a centered Card containing the form.
- Design system integration: Demonstrates every form molecule in context with layout and typography components.

## Page Structure
- Header: At top.
- Main content: Centered column with max-width 560px.
  - Heading (level 1): "Contact Us"
  - Text: Introductory copy.
  - Card: Contains the `<form>` with all fields.
- Footer: At bottom.

## Form Fields
1. **Input** — "Full name" (text, required, placeholder).
2. **Input** — "Email" (email type, required, placeholder).
3. **Select** — "Reason for contact" (placeholder, required, 4 options).
4. **RadioGroup** — "Preferred response time" (3 options, default "normal").
5. **Checkbox** — "I agree to the privacy policy".
6. **Buttons** — Cancel (ghost) and Submit (solid), right-aligned.

## Visuals
- Page layout: Full-height flex container.
- Form: Vertical stack with 20px gap inside Card.
- Buttons: Right-aligned in a flex row at the bottom.
- All fields use default styling from their respective components.

## Interactions
- Form `onSubmit` prevents default and shows an alert (illustrative).
- Cancel button is type="button" (does not submit).
- All form controls are functional — typing, selecting, checking, choosing.

## Accessibility
- Proper heading hierarchy (h1).
- All form controls have associated labels (wrapping label or fieldset/legend).
- Required fields marked with `required` attribute and visual asterisk.
- Semantic `<form>` element wraps all controls.

## Acceptance Criteria
1. Page renders Header, Footer, and centered main content.
2. Card contains a `<form>` with all five form controls.
3. Input (text), Input (email), Select, RadioGroup, and Checkbox all render.
4. Required fields show asterisk indicators.
5. Select shows placeholder as first disabled option.
6. RadioGroup has "Within a few days" pre-selected.
7. Submit triggers `onSubmit`; Cancel does not.
8. Layout is responsive — form stays readable on narrow viewports.

## Current Story & Test Mapping
- Story: Examples/Contact Form — "Page".
- Intent: Verify all form primitives compose correctly in a realistic page layout.
