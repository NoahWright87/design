# Motion Tokens — Spec

## Purpose
Motion tokens define the system's vocabulary for animation — durations and easing curves that give interactions a consistent, intentional feel. They ensure that components across the system move with the same personality: soft, springy, and purposeful. Every component that animates selects from this shared vocabulary rather than inventing its own timing.

## Related
- [Design System Base Spec](../design-system.spec.md)

## Contract

### Inputs
Motion tokens accept no runtime inputs. They are static, immutable configuration values defined once in the design system.

### Outputs
Named timing presets and individual duration and easing values available to all components for use in transitions and animations.

### Guarantees / Constraints
- Token values are stable; existing tokens remain consistent across releases so components that depend on them behave predictably.
- Components select which tokens to apply but may not alter token values.
- New presets may be added over time; existing ones remain unchanged.
- All components using motion honor the user's reduced-motion preference by disabling or simplifying animation.

## Behavior

Motion tokens encode the system's philosophy: animation should convey cause and effect, not decoration. Every animated state change should feel intentional — a response to something the user did.

**Preset selection:**
- For professional, low-key transitions such as hover states and focus indicators, the subtle preset applies gentle, brief motion.
- For playful interactions such as button presses and element reveals, the bouncy preset applies springy, energetic motion with a slight overshoot on release.
- When animation should be absent — for accessibility preferences or performance-sensitive contexts — the none preset eliminates all motion.

**Press vs. release timing:** Interactions distinguish between the press phase (snappy, immediate) and the release phase (bouncy, settling). Press animations are intentionally shorter and crisper; release animations linger slightly longer to convey rebound.

**Accessibility:** When the user's system preference indicates reduced motion, components substitute the none preset or use the simplest possible transition.

## Interface

### Duration Scale
Durations form a three-step scale from quick to deliberate:
- **Fast** — for immediate state changes like toggles and brief highlights.
- **Normal** — for standard transitions like hover feedback and panel reveals.
- **Slow** — for more deliberate or emphatic changes, used sparingly.

### Easing Curves
Easing functions define the motion feel:
- **Smooth** — a standard ease-in-out curve; professional and clean.
- **Bouncy** — an overshoot curve that creates a playful rebound feel.
- **Bouncy press** — a snappier variant suited to the pressing phase of interactions.
- **Bouncy release** — an extra-springy variant for the settling phase after a press.

### Motion Presets
Presets bundle a duration and easing pair for common use cases:
- **None** — instant state change; no animation. Use for accessibility and performance contexts.
- **Subtle** — gentle, brief transition; suits professional or background interactions like focus rings.
- **Bouncy** — energetic, springy transition; suits primary interactive elements like buttons. Default for most interactions.

Each preset also provides a dedicated press variant with shorter, crisper timing for the down phase of press interactions.

## Acceptance
1. All motion tokens are exported by the design system and available to any component.
2. The three presets (none, subtle, bouncy) each provide a standard and a press-phase variant.
3. All components using motion respect the user's reduced-motion preference.
4. Each preset's intended use case is documented clearly.
