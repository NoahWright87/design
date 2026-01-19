# Examples — Composed Page Specs

This directory contains specifications for example pages that demonstrate how components compose together in realistic layouts and workflows. Each spec describes a full-page or multi-component example currently rendered in Storybook.

## Directory Structure
- `.spec.md` files: Describe existing example pages (those with corresponding stories in `stories/examples/`).
- `.todo.md` files: Backlog of future example pages not yet implemented (e.g., address-form, portfolio-site).

## Example Specs (Current)
1. **colors.spec.md** — Theme token color grid display.
2. **header-integration.spec.md** — Header composition variants with menus and avatars.
3. **header-responsive.spec.md** — Responsive header with theme toggle.
4. **showcase.spec.md** — Full-page component showcase with layout, cards, modal.

## Example Backlog (Placeholders)
- **address-form.todo.md** — Future form-based example (address input, validation, submission).
- **portfolio-site.todo.md** — Future portfolio/landing page example.

## Authoring Conventions
- Same format as component specs: Overview, Structure, Visuals, Interactions, Accessibility, Constraints, Acceptance Criteria, Story Mapping, Backlog.
- Broader scope: Examples typically demonstrate 3+ components working together; show real-world layout patterns.
- Intent-based testing: Verify layout structure, component interop, and general user flows (not pixel-perfect).

## Tests Integration
- Visual tests should capture full-page snapshots to verify layout and component positioning.
- Interaction tests can cover menu open/close, modal triggers, theme switching, form submission (where applicable).
- Example pages are often part of broader Storybook acceptance suites; use as reference for manual QA.

## Future Example Ideas
- Address form (form validation, error handling).
- Portfolio/landing page (header, hero, cards, footer, call-to-action).
- Login/authentication flow.
- Admin dashboard or data table view.
- E-commerce product listing.