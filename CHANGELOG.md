# CHANGELOG

This file documents planned and completed changes for the repository.

## Agent instructions
- DO NOT add new entries under `## Version history` unless explicitly asked to.
- DO keep a running list of changes under `## WIP`
  - Combine and summarize entries as you go.  Limit yourself to around five (5) entries about work-in-progress
  - Keep each bullet point brief.  One or two brief sentences/fragments, no huge paragraphs
  - Purpose is to SUMMARIZE.  Git history will give plenty of finer detail.

## WIP

- **Motion Lab accessibility/export pass:** Added Tailwind animation-config export plus animated, focusable, screen-reader-described easing graphs.

- **Todo pass:** Added Colors contrast/export helpers and Motion Lab preset shortcuts, reset, easing copy feedback, and multi-format export options while promoting those todos into current specs.

- **Todo/spec cleanup:** Promoted completed Colors copy, Contact Form validation, Header Responsive theme persistence/transition/shortcut, and Nonsense customization items into current specs; cleaned completed entries from todo files.

- **Container/Card/Button backlog pass:** Container now supports alignment shortcuts and flex item controls (`alignItems`, `justifyContent`, `centered`, `spaceBetween`, `grow`, `shrink`, `basis`, `wrap`, `fullWidth`), Card supports full-surface `href` links, and Button supports a loading spinner with `aria-busy`.

- **Intake routing:** Filed motion feature requests [#12] and [#13] into the Motion Lab backlog under a new Motion Primitives section in `specs/labs/motion.todo.md`.

- **Backlog cleanup:** Card gained a top media section, Avatar now derives initials from a full name, MenuItem supports a disabled state, Link can show an affiliate disclosure prompt, and Container can pin its background image with a parallax-style fixed attachment.

- **Netlify config:** Added `netlify.toml` locking build command (`build-storybook`) and publish dir (`storybook-static`) so deploy previews build correctly on every PR.
- **Playwright screenshot tests:** Corrected all story IDs to match actual Storybook paths (`components-molecules-*` / `components-organisms-*`); fixed Heading IDs (`H1` → `h-1`); scoped all component screenshots to `#storybook-root` so images clip to component height instead of full 1280×720 viewport. All 32 tests passing with tight baselines.

- **Spec-template adoption:** Applied managed spec-template files and metadata (`specs/.meta.json`), added command/workflow scaffolding (`/respec`, `/refine`, `/spec-backfill`, spec coverage check), and aligned intake/todo command docs with upstream behavior.
- **Spec localization pass:** Rewrote root specs (`specs/spec.md`, `specs/spec.todo.md`) and legacy directory meta specs (`specs/.spec.md`, `specs/.spec.todo.md`) so they describe this design-system repo and use local placeholders instead of spec-template-repo content.
- **Repo hygiene:** Added `.tmp/` to `.gitignore` and removed the temporary `.tmp` workspace folder used during template fetch.

- **PR review follow-ups:** fixed Storybook import order and duplicate preview file, added SSR-safe portfolio navigation guard, tightened Card typing, improved clipboard/keyboard accessibility in Text + Colors stories, made header hover tooltips decorative-only for screen readers, added MIT LICENSE, and stopped tracking local `.claude/settings.local.json`.
- **Form components (overhaul):** Input/Select/Checkbox/RadioGroup gain `required` validation with auto-error on blur, error waggle animation, `randomDisabledCursor`, and spring-bounce animations on Checkbox/RadioGroup. Input adds `multiline`/`rows` (textarea), email format validation. RadioGroup required-validation story uses a Submit button. Error spans now always rendered (reserved space via `min-height: 1.25em`) to prevent layout shift; `aria-live="polite"` on all error spans.
- **Molecules enriched:** Pill — `icon` + `onDismiss` + whimsical dismiss animation + neutral default color + `href`/`target` link variant (renders as `<a>` with hover outline). Heading gains `color`, `align`, `truncate`, `gradient`, `underline`, `eyebrow`, `iconStart`/`iconEnd`, `animateIn` (IntersectionObserver fade+slide on viewport entry), `anchorLink` (¶ hover button copies anchor URL to clipboard).
- **Header + Footer:** Both accept `children` fallback prop for simple/unslotted usage. Header gains `leftTooltip`/`centerTooltip`/`rightTooltip` props — CSS fade-in tooltip appears on slot hover.
- **Container + organisms:** Container gains `backgroundImage` (bug fixed), `noBorders` prop, stronger default gutter borders. Card gains `scrollable`/`maxHeight` props + `CardGrid` responsive grid wrapper (`minCardWidth`, `gap`, `columns` props). Menu bug fixed: scrollbar no longer causes layout shift. Portfolio Projects page — varied placeholder data via Nonsense atom (bug fixed).
- **ToggleIcon + HamburgerMenu:** Hamburger preset uses CSS-drawn 3-line → X (pure CSS). `HamburgerMenu` refactored as thin ToggleIcon wrapper (deprecated). Menu panel now uses `@keyframes nw-menu-enter` on mount. Pill gains `hideLabel` tooltip prop.
- **Badge + Box molecules (new):** Badge — compact notification indicator (`count`, `max`, `dot`, wraps element at top-right). Box — low-level layout primitive with padding/margin/rounded/shadow/background/`as` props.
- **Breadcrumbs organism (new):** Accessible `<nav aria-label="Breadcrumb">` with `items`, `separator`, themed link + muted current-page label. Select gains `maxVisibleItems` (listbox mode).
- **Portfolio audit:** Projects use `CardGrid`, project cards show `category` Pill (secondary), headings use `gradient`/`animateIn`. Card `--interactive` gains `:active` scale-down press animation.


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

