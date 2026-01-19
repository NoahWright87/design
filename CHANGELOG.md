# CHANGELOG

This file documents planned and completed changes for the repository.

## Agent instructions
- DO NOT add new entries under `## Version history` unless explicitly asked to.
- DO keep a running list of changes under `## WIP`
  - Combine and summarize entries as you go.  Limit yourself to around five (5) entries about work-in-progress
  - Keep each bullet point brief.  One or two brief sentences/fragments, no huge paragraphs
  - Purpose is to SUMMARIZE.  Git history will give plenty of finer detail.

## WIP

### vX.X.X
- No changes yet.

## Version history

### v1.0.9
- **Button component fully implemented:** Added variants (`solid`, `outline`, `ghost`, `text`), sizes (`small`, `medium`, `large`), semantic/custom colors, icon positioning (`left`, `right`, `center`, `top`, `bottom`), and disabled state with proper accessibility.
- **Motion system (atoms):** Added motion tokens with presets (`none`, `subtle`, `bouncy`) including distinct press/release easing curves; buttons now feature playful squish-and-bounce animations that respect `prefers-reduced-motion`.
- **Shadow tokens (atoms):** Added `--shadow-sm/md/lg` tokens that adapt to light/dark themes.
- **Design tokens expanded:** Added spacing (`--spacing-xs/sm/md/lg/xl`), typography (`--text-xs/sm/md/lg/xl`), and border radius (`--radius`) tokens for cross-component reuse.
- **Opinionated design system:** Updated root spec to clarify the system is built for personal use with minimal props and a `style` escape hatch on all components.
- **Spec framework:** Established comprehensive spec structure with atomic design taxonomy, component specs as source of truth for tests, and `*.todo.md` backlog convention; added specs for all components and example pages.

### v1.0.8
- **Modal action callbacks fixed:** added optional `id` field to `ModalActionProps` and updated `onClose` signature to pass action label/id instead of hardcoded "confirm", so each button click correctly indicates which action was chosen.
- **Theme tokens refined:** removed `--surface` token for minimalism (use `--background` directly); kept 7 core tokens: foreground, background, primary, secondary, confirm, danger, overlay.
- **Storybook autodocs enabled:** added `tags: ["autodocs"]` to all component stories for auto-generated docs pages; improved Card story controls to handle subtitle/text props correctly.
- **Modal story improvements:** fixed layout viewport to fullscreen for better modal preview visibility; corrected action button callbacks to display the actual chosen action (e.g., "You chose: No, Cancel").
- **Enhanced Showcase example:** added Card grid and interactive Modal demo to demonstrate multi-component composition and real-world usage patterns.

### v1.0.7
- Initial implementation of the highly-opinionated flex `Container` component (direction, spacing, colors, sizing) plus Storybook stories.
- Added Playwright visual regression tests for curated component variations and example pages; baselines stored in `tests/visual/*-snapshots/`.

### v1.0.6
- Implemented header framework: added `Avatar`, `HamburgerMenu`, `Menu`, and `MenuItem` components with minimal CSS using `--foreground`/`--background` tokens.
- Added Storybook stories for all new components and integration examples; updated Layout story to demonstrate complete header with menus.
- Avatar shows pointer cursor when clickable; Menu supports left/right alignment with proper positioning.
- Remove duplicate loose component files under `src/components` (Button.tsx, Heading.tsx, Link.tsx, Text.tsx); consolidate to per-component directories with `index.tsx`.
- Added highly-opinionated flex `Container` component with spacing, direction, colors, and size props plus Storybook stories.
### v1.0.5
- Make package ESM-only: added `exports` (import-only) and removed `main` to avoid advertising a CJS entrypoint.
- Stop producing CommonJS: updated `tsup.config.ts` to emit only `esm` (removed `cjs` format).
- Added components: `Header`, `Footer`, and `Layout` (Layout accepts `header`/`footer` nodes to pad content).
- Added Storybook stories for new components and updated existing stories to import from package root.

### v1.0.4
- Release: bump package to `v1.0.4` and publish to npm.

### v0.1.0 — Initial scaffold
- Project scaffold created (components, storybook, build).
