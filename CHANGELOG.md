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
- (No active work in progress)

## Version history

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
