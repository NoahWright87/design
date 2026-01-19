# Motion Tokens — Spec

## Overview
Motion tokens are atomic design primitives that define animation behavior across the design system. They ensure consistent, personality-driven animations that respect accessibility preferences.

## Design Philosophy
Motion in this design system conveys **cause → effect** and adds personality through **soft, springy, bouncy** interactions. Motion never blocks progress or adds artificial delay. All motion respects `prefers-reduced-motion`.

## Token Categories

### Durations
Basic timing units for transitions:
- `--duration-fast`: 150ms — Quick state changes
- `--duration-normal`: 250ms — Standard transitions
- `--duration-slow`: 350ms — Deliberate, emphasized changes

### Easing Curves
Timing functions that define motion feel:
- `--ease-in-out`: `cubic-bezier(0.4, 0, 0.2, 1)` — Smooth, professional
- `--ease-bounce`: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` — Playful overshoot
- `--ease-bounce-press`: `cubic-bezier(0.23, 0.33, 0.57, 2.14)` — Bouncy press-down
- `--ease-bounce-release`: `cubic-bezier(0.24, 1.05, 0.38, 2.17)` — Extra bouncy release

### Motion Presets
Bundled duration + easing combinations for consistent interactive element behavior:

#### None
No animation (accessibility or performance preference):
- `--motion-none-duration`: 0ms
- `--motion-none-easing`: linear

#### Subtle
Gentle, professional motion:
- `--motion-subtle-duration`: 180ms
- `--motion-subtle-easing`: var(--ease-in-out)
- `--motion-subtle-press-duration`: 120ms
- `--motion-subtle-press-easing`: var(--ease-in-out)

#### Bouncy
Playful, personality-driven motion (extra bouncy):
- `--motion-bouncy-duration`: 220ms
- `--motion-bouncy-easing`: var(--ease-bounce-release)
- `--motion-bouncy-press-duration`: 150ms
- `--motion-bouncy-press-easing`: var(--ease-bounce-press)

## Usage Guidelines
1. **Presets first**: Use motion presets (`bouncy`, `subtle`, `none`) for interactive elements like buttons.
2. **Duration + easing pairs**: When creating custom animations, pair durations with appropriate easing curves.
3. **Press vs. release**: Press states often use shorter durations and snappier easing; release states use longer, bouncier curves.
4. **Respect accessibility**: Always wrap motion in `@media (prefers-reduced-motion: reduce)` and disable or simplify.

## Accessibility
All components using motion tokens MUST respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .element {
    transition: none;
    /* or use --motion-none-duration */
  }
}
```

## Constraints
- Motion tokens are immutable atoms. They do not accept props or vary.
- Components choose which preset or tokens to use but cannot modify the token values themselves.
- New presets can be added, but existing ones should remain stable for consistency.

## Acceptance Criteria
1. All motion tokens are defined as CSS custom properties in `theme.css`.
2. Motion presets bundle duration + easing for common interaction patterns.
3. All motion respects `prefers-reduced-motion` in consuming components.
4. Easing curves follow the design philosophy: soft, springy, bouncy.
5. Documentation clearly explains when to use each preset.
