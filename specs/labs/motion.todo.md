# Motion Lab — Backlog

## Sooner
- [ ] TBD

## Later
- [ ] TBD

## Backlog

### Motion Primitives
- [ ] [#12](https://github.com/NoahWright87/design/issues/12) Add Reveal + Stagger primitives for section and content entrance choreography.
- [x] [#13](https://github.com/NoahWright87/design/issues/13) Add a reusable ContentRotator with crossfade transitions and pause controls. Delivered as the `Carousel` organism (`specs/components/organisms/carousel/carousel.spec.md`).

### UI & Interaction
- [ ] Groupable preset categories (e.g., "Professional", "Playful", "Extreme").
- [ ] Keyboard shortcuts for preset selection (Ctrl+1, Ctrl+2, etc.).
- [ ] Real-time animation playhead on easing graphs (shows progress along curve).
- [ ] Undo/redo stack for knob changes.
- [ ] "Reset to preset" button in addition to preset selector.

### Component Adapters
- [ ] Link motion adapter (underline, color shift on hover/focus).
- [ ] Input motion adapter (focus ring, placeholder shift, error shake).
- [ ] Card motion adapter (shadow/scale on hover, flip/rotate on click).
- [ ] Dropdown/Menu motion adapter (slide-down entrance, fade-out exit).
- [ ] Toast/Notification motion adapter (slide-in + auto-dismiss).

### Output Formats
- [ ] Export as SCSS variables (with !default).
- [ ] Export as CSS custom property definitions (copy into `:root`).
- [ ] Export as Tailwind animation config (animated utility).
- [ ] Export as design token JSON (for token studio integration).

### Developer Experience
- [ ] Copy individual easing function button (press/release/enter/exit separately).
- [ ] Share preset as URL query string (e.g., `?preset=extreme-bounce`).
- [ ] Side-by-side comparison of two presets.
- [ ] Animation speed multiplier (0.5x–2x playback speed).

### Accessibility
- [ ] Focus visible state for easing graph (interactive elements).
- [ ] Keyboard-draggable bezier control points (instead of sliders).
- [ ] Screen reader descriptions for easing curve shapes (e.g., "overshoot at top").

### Testing
- [ ] Visual regression tests for preset previews.
- [ ] Snapshot tests for generated CSS.
- [ ] E2E tests for knob interaction + CSS update flow.

