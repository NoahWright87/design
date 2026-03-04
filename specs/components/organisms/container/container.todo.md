# Container — Backlog

## Sooner
- [x] Gutters: Add side gutters on large screens with subtle shadow/border treatment. On by default; opt out with `noGutters` prop.
- [x] Gutter customization: Expose direct props to customize the gutter border and shadow independently.
- [x] BUG — Background image not visible: The `backgroundImage` prop is implemented but the image does not render. Investigate and fix.
- [x] Stronger default borders: Current gutter borders are barely perceptible. Make the default side border more solid/visible — consider a subtle gradient or shadow. Add a `noBorders` prop to disable all borders entirely.

## Later
- [x] Background image: Support a `backgroundImage` prop with standard CSS background positioning and sizing.
- [x] Parallax background: Optional parallax effect so the background image scrolls at a different rate than the container content, giving a cutout/window effect.

## Backlog
- Alignment props: `alignItems`, `justifyContent` for flex alignment control.
- Responsive breakpoints: Media query helpers or preset responsive layouts.
- Flexbox options: `grow`, `shrink`, `basis` for flex item control.
- Grid mode: Alternative to flex (e.g., `mode: "grid"`).
- Shortcuts: Single prop for common patterns (e.g., `centered`, `spaceBetween`).
- Container presets: Named preset components extending Container with opinionated defaults:
  - `HeroContainer` — full-width, large min-height, centered content, background-ready.
  - `QuoteContainer` — styled for pull quotes and attributed testimonials in articles.
  - `BannerContainer` — thinner than Hero; for announcements, promotions, or alerts.
  - `SectionContainer` — repeatable marketing-page sections with light/dark banding support.
  - `CalloutContainer` — highlighted aside for notes, tips, or warnings in editorial content.
  - `SplitContainer` — two-column layout; image on one side, content on the other.
