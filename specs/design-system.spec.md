# Design System — Atomic Architecture Spec

## Overview
This root spec defines the design philosophy and taxonomy for the system and maps current components to atomic levels. It is the source of truth for how the library is organized and how specs and tests should be authored.

## Atomic Design Philosophy
- **Atoms**: Non-rendering design primitives (tokens). Include color, spacing, typography, motion, radius, and shadow. Atoms must not render UI elements or contain layout/interaction logic.
- **Molecules**: Smallest reusable UI components. May render HTML and, at most, handle a single interaction.
- **Organisms**: Composed UI structures that define layout and hierarchy, typically orchestrating multiple molecules.

## Design Philosophy

This design system prioritizes **approachability, forgiveness, and personality** without sacrificing **clarity, performance, or professionalism**.

Interfaces feel:
- Whimsical, not silly
- Friendly, not sloppy
- Polished, not sterile
- Fast, not flashy

The UI feels *on the user's side* — more "whoops, try again 😅" than "incorrect input 😡".

### Tone & Personality
The system blends **business-like professionalism** with **playful warmth**.

Errors are treated as recoverable moments, not failures.
Success is acknowledged lightly, not celebrated loudly.

If the UI had a personality, it would be:
> calm, a little goofy, competent, and kind

### Motion Philosophy
Motion conveys **cause → effect**, not decoration.

- Interactions feel soft, springy, or bouncy
- Motion never blocks progress or adds artificial delay
- Motion is defined via reusable tokens to ensure consistency
- All motion respects `prefers-reduced-motion`

When motion is reduced, the personality remains — the movement quiets down.

### Performance & Implementation Values
**Performance is a feature.**

The system favors:
- CSS-only animations and interactions
- Server-side rendering
- Fast first paint and minimal client-side work
- No runtime side effects at module import

No design choice should compromise speed, accessibility, or clarity.

### Guiding Principle
> **Design like a professional who doesn't take themselves too seriously.**

## Taxonomy — Current System Mapping
- **Atoms** (tokens, non-rendering):
  - Theme tokens and CSS variables: colors (`--foreground`, `--background`, `--primary`, `--secondary`, `--confirm`, `--danger`, `--overlay`), spacing presets, radii, shadows, motion.
  - Sources: `src/styles/theme.css`, `src/styles/tokens.ts`.

- **Molecules** (small reusable components, single interaction at most):
  - `Button`: Native button, optional `onClick`.
  - `Link`: Anchor element, navigational.
  - `Heading`: Semantic heading levels `h1..h6`.
  - `Text`: Paragraph content.
  - `Avatar`: Image or initial; optionally clickable.
  - `HamburgerMenu`: Menu toggle button with animated spans.
  - `MenuItem`: Button or link with optional icon and text; closes parent menu.
  - *(Future `Box`: Simple content wrapper molecule under organisms.)*

- **Organisms** (composed structures, layout/hierarchy):
  - `Header`: Fixed navigation container with left/center/right slots and labels.
  - `Footer`: Page footer container.
  - `Layout`: Page scaffold with header/footer and padded content area.
  - `Menu`: Dropdown with trigger, panel, overlay, keyboard/close orchestration.
  - `Modal`: Dialog with backdrop, header, content, actions, and close behavior.
  - `Card`: Rounded content container with optional header, footer, and interactive regions (future).
  - `Container`: Opinionated flex layout wrapper serving as main content holder between Header and Footer.

## Authoring Rules

When creating new components, ask these questions to determine atomicity:

- **Atoms** — Are they immutable design primitives?
  - Atoms have no props and do not vary. "Warning" is the color it is; you cannot customize or divide it further.
  - Examples: color tokens, spacing scales, typography presets.
  - Rule: Zero customization, zero composition.

- **Molecules** — Do they vary in appearance/functionality by accepting atoms and simple content?
  - Molecules accept different atoms and simple content (e.g., text, image URLs, handler functions).
  - Props are "selfish" — about the molecule itself, not about what it contains.
  - One focused responsibility; singular interaction if any (e.g., click, toggle).
  - Examples: Button, Avatar, Card, HamburgerMenu, MenuItem.
  - Rule: Vary via atoms and simple inputs; no complex child composition.

- **Organisms** — Do they vary in their contents (molecules/atoms)?
  - Organisms contain and orchestrate molecules and may accept simple props (text, URLs).
  - Most props are defined by the molecules stuffed into them, not by the organism itself.
  - Multi-part interactions, layout orchestration, state management for multiple regions.
  - Examples: Header, Footer, Layout, Menu, Modal, Container.
  - Rule: Props describe what goes inside, not the organism's behavior.

## Specs & Tests
- All specs in `specs/components/*/*.spec.md` and `specs/examples/*.spec.md` are the source of truth for tests.
- Acceptance Criteria in each spec must be mapped to Playwright tests (visual and interaction). Prefer intent-based assertions over pixel-perfect.
- Backlogs live in `*.todo.md` next to each spec. Promote items into specs before implementing.
- Reference the Authoring Rules above when creating new components to determine their atomicity.

## Acceptance Criteria (Meta)
1. All components in the library follow atomic design rules based on Authoring Rules above.
2. Specs and tests reference this taxonomy when authoring and reviewing changes.
3. Tokens are documented as atoms and remain non-rendering.
