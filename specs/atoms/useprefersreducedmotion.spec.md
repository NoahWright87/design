# usePrefersReducedMotion Atom — Spec

## Purpose
`usePrefersReducedMotion` gives components a single, shared way to read and track the user's `prefers-reduced-motion` system preference from JavaScript. Most motion in the system is disabled via a plain CSS `@media` rule, which needs no JS help — this atom exists for the remaining cases where a component's animation is driven by JavaScript state (for example, a character-by-character typing effect) rather than a CSS transition, and so cannot be silenced by CSS alone.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [Motion tokens](./motion.spec.md)
- [useTypewriter atom](./usetypewriter.spec.md)

## Contract

### Inputs
None. The hook takes no arguments and reads only the browser's `prefers-reduced-motion` media query.

### Outputs
A boolean: `true` when the user's system preference requests reduced motion, `false` otherwise.

### Guarantees / Constraints
- Safe to call during server-side rendering; it never throws when `window` or `matchMedia` are unavailable, reporting `false` in that case.
- Reflects the current preference immediately on first render on the client — there is no flash of the wrong value after mount.
- Stays in sync if the user changes the preference while the page is open (e.g. toggling a system-level setting), without requiring a page reload.

## Behavior

**Default (motion allowed):** Returns `false`. Components proceed with their normal animation.

**Reduced motion requested:** Returns `true`, on the very first render on the client. Components branch on this to skip or simplify JS-driven animation.

**Preference changes at runtime:** If the user changes the system setting while the page is open, the hook's return value updates on the next render, and any component using it re-renders to match.

**No `matchMedia` support (e.g. very old environments, or server-side rendering):** Returns `false` rather than throwing.

## Interface

### Usage
A component calls the hook with no arguments and receives a boolean it can branch on:

```tsx
const prefersReducedMotion = usePrefersReducedMotion();
if (prefersReducedMotion) {
  // skip or simplify JS-driven animation
}
```

It composes with any component's own animation state; it does not render anything itself and has no visual output of its own.

## Acceptance
1. Returns `false` when the system has no reduced-motion preference set.
2. Returns `true` when the system's reduced-motion preference is active, from the first client render.
3. Updates its return value when the system preference changes while mounted.
4. Does not throw when called in a server-side rendering environment, returning `false`.
