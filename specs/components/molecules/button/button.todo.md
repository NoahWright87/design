# Button — Backlog

Purpose: Capture future enhancements and exploratory ideas. Items are aspirational until promoted into the main spec.

## Ideas
- Variants: primary/secondary/ghost. Rationale: express intent and hierarchy.
  - Rough acceptance: Consumers can select variant; visual tokens apply accordingly.
- Sizes: small/medium/large. Rationale: fit diverse layouts and density.
  - Rough acceptance: Height/padding/fonts scale predictably across sizes.
- Icons: leading/trailing icon support via `iconLeft`/`iconRight` props.
  - Rough acceptance: Icons align with label, maintain accessible name.
- Disabled state: `disabled` prop renders non-interactive appearance and behavior.
  - Rough acceptance: Native disabled behavior; appropriate styling; a11y name preserved.
- Loading state: Spinner and `aria-busy` while preventing duplicate actions.
  - Rough acceptance: Visual indicator; keyboard/pointer activation paused; announce state.
- Theming/styling: Integrate design tokens for colors, spacing, and typography.
  - Rough acceptance: Uses tokens from theme; no inline styles; SSR-safe.
- Accessibility enhancements: ARIA attributes for specific contexts (if needed).
  - Rough acceptance: Meets WCAG guidance; no redundant roles on native elements.

## Open Questions
- Naming and number of variants: Do we prefer semantic (primary/danger) or purpose-based?
- Icon API shape: prop vs. composition; alignment constraints.
- Minimum supported browsers and focus styles.
