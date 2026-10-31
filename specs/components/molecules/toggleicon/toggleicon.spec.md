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

The hamburger's top and bottom strokes first compress into the center stroke, with a small sideways stretch. Once they overlap as one line, the middle stroke disappears behind them. The merged line holds briefly, lengthening and thickening in a soft puff, before the outer two rotate into an X with elastic overtravel. Closing reverses the order: the X flattens into one line before the three menu strokes spread apart and settle. The heart fills from bottom to top like a game health indicator, then swells upward and slightly outward exactly when the fill reaches the top. Emptying drains the fill from top to bottom, then compresses the heart downward and slightly outward exactly when the fill reaches empty. Each reaction springs back to the neutral shape. The bottom tip stays fixed throughout both reactions, and the outline stays visible. A reversal during filling cancels the old pending reaction and continues from the current fill level. A reversal during a reaction preserves the existing deformation and momentum while it settles, and schedules the new endpoint reaction after the new fill transition. The bookmark uses the same bottom-to-top fill, completed-fill thump, completed-drain squish, constant outline thickness, and fixed bottom baseline as the heart. Sound waves animate independently. Other presets use the reference's damped spring, retaining both position and velocity on reversal. Heart and bookmark use a smooth fill transition followed by damped springs for width and height. Animation stops at rest and cancels on unmount. Reduced-motion preferences apply final states immediately, including when the preference changes during motion. Initial rendering presents the requested state without an entrance animation.


Playback starts with a brief leftward windup: the back corners spread vertically while the tip retreats slightly. It then dashes right as a narrow, tapered triangle, touching the icon's right edge beyond the eventual pause position. On impact, the tip spreads into upper and lower corners while the back corners catch up, creating a tall rectangle. Only then does the rectangle shrink toward the final pause height and split into two bars. Both bars share the same timing and elastic overtravel; the left bar moves faster because it travels farther. They settle together. Smooth transitions between poses and a slightly slower spring keep the action quick and readable. Reversals preserve momentum and retrace the poses. Both paths stay mounted as adjacent halves of the triangle and impact rectangle, so splitting creates a gap instead of introducing a new bar. Reduced motion presents the requested final pose immediately.

The eye closes by lowering its upper lid onto a lower lid that stays fixed within the eye. A fixed-size pupil is clipped to the narrowing opening, so the lid covers it rather than shrinking or fading it. Five rounded lashes stay attached to the upper lid: they fan upward when open, foreshorten as the lid turns toward the viewer, then fan downward on the closed lid. Reopening reverses that motion with the shared spring. Both resting states retain visible lashes; the closed state is a single curved lid with a fully covered pupil. As closing completes, the whole eye dips slightly past its resting position and widens into a small squish, then elastically returns. Opening lifts the whole eye slightly past its resting position before settling back. The existing Hide/Show labels and toggled semantics stay the same.

From rest, the lock first anticipates the action with a brief shackle-only windup: pressing down before opening or lifting slightly before closing. It then opens by lifting the shackle until its free right end visibly clears the body, then swiveling it horizontally around the vertical axis of the attached left post. The U narrows edge-on during the half-turn and opens out on the left, like the unlocked padlock symbol. Projected wire coordinates preserve its stroke thickness through the turn. Closing swivels the U back above the body before snapping it straight down. The slower travel spring gives the lift and swivel room to read. Reaching fully open transfers momentum into a leftward rock of the whole lock; latching transfers momentum into a stronger closing rock. Each arrival triggers one impulse only at its endpoint. Both rocks overtravel, sling back past neutral, and settle with a longer, more exaggerated follow-through. The body stays still during a fresh windup and approach. The arm and recoil retain their momentum on interruption. Reduced motion renders the requested open or shut pose without recoil.

Plus/minus uses the same plump dot in either direction. The outgoing lines shrink into their shared center as the dot swells slightly wider than their stroke. During a brief hold at the dot pose, the dot swells further for emphasis. It then contracts and the destination lines expand, overtravel, and settle. The minus-to-plus direction follows the same sequence in reverse. Both it and hamburger use a slower spring to make compression and expansion readable, retain momentum on reversal, and render final poses immediately with reduced motion.

Selection fills with a solid small circle expanding outward from the center to meet the outline. The outline stays at its resting size during filling; completing the fill triggers a slightly larger whole-icon pop before springing back. Emptying contracts the solid fill inward to nothing, followed by a smaller whole-icon shrink and rebound. The outer circular button surface stays still, the outline keeps constant stroke thickness, and both resting poses have the same size. Interrupted toggles retain spring momentum, while reduced motion selects the final radial fill and neutral scale immediately.

## Interface
Icons use a consistent square canvas, rounded strokes, transparent background, generous button targets, stationary hover feedback, and visible keyboard focus. The circular button surface and focus ring retain their position and size while pressed; each preset animates its SVG geometry for feedback. Motion is exaggerated, bouncy, and cartoony while preserving legibility. Fast actions include a readable windup and follow-through: anticipation, movement, impact or arrival, then elastic overtravel and settling. An endpoint bounce alone is insufficient when the travel feels sudden. The whole sequence stays quick without compressing its stages into frantic motion. Default labels describe the next action; custom labels support application-specific meaning.

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
11. All presets use rounded strokes and spring settling; playback and lock geometry morph through SVG attributes.
12. Heart and bookmark reveal solid fill from bottom to top while their outlines stay visible; emptying drains from top to bottom.
13. Fill reaches the top before the heart swells upward/outward; drain reaches the bottom before the heart compresses downward/outward. The bottom tip stays fixed in both axes throughout, including while pressed. Its outline keeps a constant stroke thickness as it deforms, and both states settle at the same size and position. Reduced motion renders the final fill with a neutral pose.
14. Multiple heart and bookmark instances have unique, correctly linked fill clipping references.
15. Reversing during filling replaces the pending reaction; reversing during a reaction preserves its pose and spring momentum while starting the new fill transition.

16. Bookmark reactions follow completed fill/drain transitions and keep the bottom baseline fixed, including during pressing.
17. Playback winds up left, dashes into the right edge as a tapered triangle, and flattens into a tall rectangle before separating into pause bars.
18. Playback geometry stays continuous across stage boundaries and rapid reversals, then settles at exact play/pause endpoints.

19. Both pause bars share split, height-settling, and elastic-overtravel timing; the left bar travels farther at a higher speed.

20. Closing lowers the upper lid to the lower lid within the eye, covering a fixed-size pupil through a unique per-instance clip.
21. Five lashes stay attached to the moving lid, shorten during its turn, and remain visible at both open and closed endpoints.

22. All icon buttons keep their circular background, focus ring, and hit area stationary during hover, pressing, and toggling; bounce comes from SVG motion.
23. The eye dips and widens on closing overtravel, rises on opening overtravel, and settles at a neutral position and scale in both states.
24. The lock arm lifts clear, then flips horizontally around its left post through an edge-on pose; the formerly right arm ends on the left. Closing completes the horizontal swivel before dropping into place. One rotation impulse fires at each arrival: leftward at fully open and a stronger rock at fully closed, oscillating past neutral before stopping at rest.
25. Interrupting the lock retains its arm and recoil position/velocity, and reduced motion selects a neutral final pose.

26. Fresh lock actions start with a readable arm-only windup, then a slower lift/swivel; body recoil begins only at the open or shut endpoint. Closing recoil travels farther and settles longer than the original subtle bounce.

27. Hamburger strokes overlap as one centered line before rotating into an X; the hidden middle stroke returns behind the joined outer strokes on reversal. Both endpoints have elastic overtravel.
28. Plus/minus passes through a slightly oversized dot with zero line length in both directions, then expands the destination lines with spring overtravel. Stage handoffs stay smooth.

29. Hamburger and plus/minus briefly hold their fully compressed pose in both directions. The center line lengthens and thickens during the hold, and the dot swells further, before either expands into its destination.

30. Selection uses a growing solid center circle rather than opacity fading. It fills completely before popping larger, and empties completely before a smaller shrink/rebound, with smooth endpoint handoffs and neutral resting scales.
