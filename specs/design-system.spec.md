# Design System — Atomic Architecture Spec

## Purpose
This root spec defines the design philosophy, taxonomy, and authoring conventions for the design system. It is the source of truth for how the library is organized, how components are categorized, and how specs and tests should be authored.

This design system is built for personal use and reflects specific preferences and workflows. Components are intentionally opinionated with minimal configuration surfaces, favoring convention over configuration. A style escape hatch is available on all components for custom overrides when needed, but atomic principles and design tokens should always be the first path.

## Related
- [Motion tokens](atoms/motion.spec.md)
- [Shadow tokens](atoms/shadows.spec.md)
- [Button component](components/molecules/button/button.spec.md)
- [Header component](components/organisms/header/header.spec.md)
- [Showcase example](examples/showcase.spec.md)

## Contract

### Inputs
- Design tokens, component specs, and example specs in this repository.
- Changes to components and tests that must align with the taxonomy and authoring rules defined here.

### Outputs
- The canonical taxonomy (atoms, molecules, organisms) and system component mapping.
- Authoring rules that guide spec structure and test traceability.

### Guarantees / Constraints
- Atoms remain non-rendering design primitives.
- Molecules remain small, reusable UI components with a single interaction at most.
- Organisms orchestrate layout and multi-part interactions.
- Specs are the source of truth for tests and implementation.

## Behavior

### Design Philosophy
This design system prioritizes **approachability, forgiveness, and personality** without sacrificing clarity, performance, or professionalism.

Interfaces feel:
- Whimsical, not silly
- Friendly, not sloppy
- Polished, not sterile
- Fast, not flashy

The UI feels *on the user's side* — a recoverable experience, not a punishing one.

**Tone and personality:** The system blends business-like professionalism with playful warmth. Errors are treated as recoverable moments. Success is acknowledged lightly, not celebrated loudly. If the UI had a personality, it would be: calm, a little goofy, competent, and kind.

**Motion philosophy:** Motion conveys cause and effect, not decoration. Interactions feel soft, springy, or bouncy. Motion never blocks progress or adds artificial delay. Motion is defined via reusable tokens for consistency. All motion respects the user's reduced-motion preference. When motion is reduced, the personality remains — the movement quiets down.

**Performance:** Performance is a feature. The system favors CSS-driven animations, server-side rendering, fast first paint, and minimal client-side work. No design choice should compromise speed, accessibility, or clarity.

**Guiding principle:** Design like a professional who doesn't take themselves too seriously.

### Atomic Taxonomy

#### Atoms — Non-rendering design primitives
Atoms are immutable design values with no props and no variation. They define the shared vocabulary: color roles, spacing presets, typography scales, motion timing, radii, and shadows.

Current atoms:
- **Color tokens** — semantic roles: foreground, background, primary, secondary, confirm, danger, overlay.
- **Spacing** — a scale of named size presets used for padding, margin, and gap.
- **Typography** — font size, weight, and line height presets.
- **Motion** — timing and easing token presets.
- **Shadows** — elevation token scale.
- **Radii** — corner radius presets.

#### Molecules — Small, reusable UI components
Molecules are the smallest components that render HTML. Each has at most one focused interaction. Props are "selfish" — about the molecule itself, not about what it contains.

Current molecules: Button, Link, Heading, Text, Avatar, HamburgerMenu, MenuItem, Input, Select, Checkbox, RadioGroup, Pill.

#### Organisms — Composed UI structures
Organisms orchestrate molecules and atoms into layout structures and multi-part interactions. Their props describe what goes inside them, not the organism's own behavior.

Current organisms: Header, Footer, Layout, Menu, Modal, Card, Container.

## Interface

### Authoring New Components
When creating a new component, determine its level by answering these questions:

**Is it an immutable design value with no props?** → It is an atom. Zero customization, zero composition.

**Does it render HTML and vary through atoms and simple content?** → It is a molecule. One focused responsibility; one interaction at most. Props are about the molecule, not its contents.

**Does it vary through the molecules and atoms it contains?** → It is an organism. It orchestrates and lays out; its props describe what goes inside.

### Boolean Prop Naming
Boolean props follow a consistent opt-in / opt-out naming convention based on the default state:

- **Off by default → positive name:** Props that enable a non-default behavior use affirmative names: `isSticky`, `isExternal`, `hasBottomSeparator`, `interactive`. No `={true}` is needed — shorthand works.
- **On by default → negative opt-out name:** Props that disable a default behavior use negation: `noGutters`, `flat`. Again, shorthand works.

This makes it immediately clear at the call site whether a prop is opting into something extra or opting out of a default.

### Spec Authoring
All specs in `specs/components/` and `specs/examples/` are the source of truth for tests. Acceptance criteria in each spec map to Playwright tests — intent-based, not pixel-perfect. Future work lives in the adjacent todo file; promote items into the spec before implementing.

## Acceptance
1. All components in the library follow the atomic taxonomy defined in this spec.
2. Specs and tests reference this taxonomy when authoring and reviewing changes.
3. Atoms are documented as non-rendering primitives that export no UI.
