# CHANGELOG

This file documents planned and completed changes for the repository.

## Agent instructions
- DO NOT add new entries under `## Version history` unless explicitly asked to.
- DO keep a running list of changes under `## WIP`
  - Combine and summarize entries as you go.  Limit yourself to around five (5) entries about work-in-progress
  - Keep each bullet point brief.  One or two brief sentences/fragments, no huge paragraphs
  - Purpose is to SUMMARIZE.  Git history will give plenty of finer detail.

## WIP

- **Form primitives:** Added `Input`, `Select`, `Checkbox`, and `RadioGroup` molecule components with integrated labels, error states, custom-styled controls, and full theme token integration.
- **Custom controls:** Checkbox and RadioGroup use visually-hidden native inputs with CSS pseudo-element replacements for consistent cross-browser styling while preserving keyboard/a11y behavior.
- **CardFooter layout helper:** Added `CardFooter` companion component with `align` prop for opinionated footer layouts in Card.
- **Stories & specs:** Added Storybook stories, spec files for all four form components, and a Contact Form example page composing all form primitives.


## Version history

### v1.0.10
- **CSS export fix:** Package now properly exports all component and theme styles. Added side-effect CSS import in main entry, exposed `dist/index.css` via package.json exports with `style` field, and converted Button CSS modules to global classes (`nw-button`, `nw-button--*`). Consuming apps automatically get styles when importing components.
- **Expanded Theme type:** Made all theme properties optional and added support for overriding all CSS variables (spacing, typography, motion, shadows) via `buildThemeCss()`, not just colors. Function now dynamically generates CSS from provided properties only.
- **Motion Lab:** Added interactive motion tuning UI for Button and Modal with separate Storybook pages. Includes bezier curve editor, live preview with sticky positioning, preset selector, and portable CSS generation. Fixes React hooks error by using single-adapter per story instead of multi-component switching.
- **Exports default condition:** Added `default` in package exports so environments resolving CommonJS/unnamed conditions can still load the ESM entry (fixes "No exports main defined" in dev site).
- **Header non-overlap default:** `Header` now defaults to sticky positioning to avoid covering page content. Use `fixed` prop to opt into fixed positioning, and apply `.nw-with-fixed-header` to the content container for a top offset when needed.
- **Scrollbar polish:** Global scrollbar now uses theme primary colors, rounded thumb, thin width, and `scrollbar-gutter: stable` to keep layout from shifting when scrollbars appear.
- **Global base reset:** Added box-sizing reset, body margin removal, and color-scheme hints so headers stay flush to page edges and don't jump when scrolling.
- **Footer non-overlap:** Footer now defaults to in-flow; optional `sticky` and `fixed` props available. `Layout` component handles flexbox automatically so footer stays at bottom on short pages without covering content.
- **Modal backdrop coverage:** Modal backdrop now spans full viewport width/height so overlay hides gutters/scrollbars completely.
- **Menu trigger fix:** Menu now clones custom triggers (e.g., `HamburgerMenu`) instead of wrapping them, preventing nested buttons and hydration mismatches.
- **Layout refactor:** `Layout` now uses flexbox internally with `.nw-layout__content` wrapper; no helper classes needed. Supports SPA routing by accepting router outlets as children—header/footer stay mounted while content swaps.
- **Next.js compatibility:** Added `"use client"` directives to Menu, Modal, and MenuItem so they work in Next.js App Router while keeping Layout and other components server-safe.
- **MobileNav component:** Pure CSS navigation using checkbox hack—fully SSR-compatible, no JavaScript required. Hamburger collapses on mobile, inline on desktop. Use this instead of Menu in server layouts.

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

