# Button — Backlog

Purpose: Capture future enhancements and exploratory ideas. Items are aspirational until promoted into the main spec.

## Sooner
- [x] Reduce default bounce: Current default bounce animation is too exaggerated. Dial it back to subtle. (Related to Animation presets in Backlog.)

## Later
- [ ] TBD

## Backlog
- Loading state: Spinner and `aria-busy` while preventing duplicate actions.
  - Rough acceptance: Visual indicator; keyboard/pointer activation paused; announce state.
- Animation presets: Predefined motion styles (e.g., bounce, pulse) applied via prop.
  - Rough acceptance: Preset animations respect motion tokens and `prefers-reduced-motion`.
- Accessibility enhancements: Additional ARIA attributes for specific contexts (if needed).
  - Rough acceptance: Meets WCAG guidance; no redundant roles on native elements.
- Icon library integration: Built-in icon set for the design system.
  - Rough acceptance: Icons are React components; consistent sizing and coloring.

### Open Questions
- Loading state UX: Should spinner replace icon or label, or overlay the button?
- Animation preset names and visual styles.
- Minimum supported browsers and focus styles (currently assumes modern evergreen browsers).
