# ToggleIcon

## Purpose
A family of animated, two-state SVG icon buttons with a shared rounded stroke and restrained spring motion, suitable for navigation, theme controls, playback, and saved states.

## Related
- [HamburgerMenu](../hamburger/hamburger.spec.md)
- [Motion](../../../atoms/motion.spec.md)

## Contract
### Inputs
- `preset: ToggleIconPreset` selects hamburger, moon-sun, circle, arrow, plus-minus, eye, play-pause, mute, thumbs, heart, bookmark, or lock.
- `isToggled?: boolean` controls the state when supplied.
- `defaultToggled?: boolean = false` initializes local state.
- `onChange?: (toggled: boolean) => void` receives the requested next state.
- `label?: string` overrides the state-dependent action label.
- `size?: "sm" | "md" | "lg" = "md"` selects the icon size.
### Outputs
A native button with a decorative inline SVG, action label, and pressed state. Hamburger also communicates expanded state.
### Guarantees / Constraints
Existing preset names and props remain supported. Rendering is SSR safe. Icons inherit text color and share the design system's motion tokens. SVG definitions remain unique across instances.

## Behavior
Click, Enter, and Space request the opposite state. Uncontrolled buttons update locally; controlled buttons follow their supplied state. Parent-driven changes animate through the same persistent geometry as clicks, including interrupted and reversed transitions.

False → true states are: menu → close, sun → crescent, outlined → filled circle, right → down arrow, plus → minus, visible → hidden eye, play → pause, muted → audible speaker, thumbs up → down, outlined → filled heart, outlined → filled bookmark, unlocked → locked.

For moon-sun, true represents dark mode. Rays fade and contract as the sun's disc becomes a crescent; the reverse restores the disc and rays. Consumers connect state to theme utilities and subscribe to external theme changes when needed.

The menu's outer strokes rotate into a cross while its center stroke contracts. Playback reshapes its two halves. Favorites fill and gently grow. Sound waves, eye slash, and lock shackle animate independently. Reduced-motion preferences apply final states immediately. Initial rendering presents the requested state without an entrance animation.

## Interface
Icons use a consistent square canvas, rounded strokes, transparent background, generous button targets, hover feedback, and visible keyboard focus. Motion settles with a small overshoot and preserves legibility. Default labels describe the next action; custom labels support application-specific meaning.

Storybook's Examples → Animated Icons gallery offers individual controls, a parent-driven toggle-all control, all three sizes, and a synchronized page-theme toggle. Gallery tiles control their own icon states independently from the page theme.

## Acceptance
1. Every preset renders an inline SVG at each supported size.
2. Controlled and uncontrolled activation request the opposite state once.
3. External state changes animate without replacing the SVG.
4. False moon-sun is a sun labeled “Switch to dark mode”; true is a crescent labeled “Switch to light mode”.
5. Multiple theme icons have independent mask references, including during SSR hydration.
6. All transitions resolve immediately with reduced motion enabled.
7. Buttons expose their label and pressed state; hamburger exposes expanded state.
8. Geometry transitions remain active during the global theme color transition and become immediate under reduced motion in either theme state.
