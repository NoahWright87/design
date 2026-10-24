# ToggleIcon

## Purpose
A family of animated, two-state SVG icon buttons with full rounded strokes and playful, continuous spring motion, suitable for navigation, theme controls, playback, and saved states.

## Related
- [HamburgerMenu](../hamburger/hamburger.spec.md)
- [Motion](../../../atoms/motion.spec.md)
- [Marshmallow Orbit reference](https://github.com/NoahWright87/design/pull/35#issuecomment-6297484306)

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
Existing preset names and props remain supported. Rendering is SSR safe. Icons inherit text color and share the Marshmallow Orbit spring; button feedback uses the design system's motion tokens. SVG definitions remain unique across instances.

## Behavior
Click, Enter, and Space request the opposite state. Uncontrolled buttons update locally; controlled buttons follow their supplied state. Parent-driven changes animate through the same persistent geometry as clicks, including interrupted and reversed transitions.

False → true states are: menu → close, sun → crescent, outlined → filled circle, right → down arrow, plus → minus, visible → hidden eye, play → pause, muted → audible speaker, thumbs up → down, outlined → filled heart, outlined → filled bookmark, unlocked → locked.

For moon-sun, true represents dark mode. The Marshmallow Orbit reference defines its geometry: a slim, tilted crescent with a clear surrounding area and a sun with eight rounded capsule rays. On entering light mode, the crescent fills into a disc before the rays emerge outward from its center with a slight rotation, overtravel, and spring settling. On entering dark mode, the rays retract and the crescent briefly becomes thinner than its resting shape before settling. Consumers connect state to theme utilities and subscribe to external theme changes when needed.

The menu's outer strokes rotate into a cross while its center stroke contracts. Playback reshapes its two halves. The heart fills from bottom to top like a game health indicator, with a brief swelling thump that settles to its original size. Emptying lowers the fill surface and gives the whole heart a small downward dip before returning to rest. Its outline stays visible throughout. Both gestures follow spring velocity so interrupted reversals remain continuous. The bookmark fills with a soft expanding pulse. Sound waves, eye slash, and lock shackle animate independently. Each preset uses the reference's damped spring, retaining both position and velocity on reversal. Animation stops at rest and cancels on unmount. Reduced-motion preferences apply final states immediately, including when the preference changes during motion. Initial rendering presents the requested state without an entrance animation.

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
9. Rapid reversals preserve momentum and settle into the last supplied state; resting icons schedule zero animation frames.
10. Sun rays have rounded capsule silhouettes and overtravel, while moon overtravel briefly thins the crescent and keeps rays hidden.
11. All presets use full rounded strokes and the reference's shared spring motion; playback and lock geometry morph through SVG attributes.
12. The heart reveals solid fill from bottom to top while its outline stays visible; emptying drains from top to bottom.
13. Filling briefly enlarges the heart around its bottom tip, so growth rises upward and settling lowers the heart toward the fill. Draining dips it downward slightly. Scaling keeps the tip anchored apart from that deliberate dip. Both states settle at the same size and position, and reduced motion renders the final fill with a neutral pose.
14. Multiple heart instances have unique, correctly linked fill clipping references.
