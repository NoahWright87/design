# Progress bar and text

## Purpose
Provide the first canonical progress indicator: a thick dark outlined bar with theme-colored fill, readable centered text, and playful full/empty feedback, composed from reusable progress atoms and split-background text.

## Related
- [Progress atoms](../../../atoms/progress.spec.md)
- [Design system](../../../design-system.spec.md)

## Contract
### Inputs
`ProgressBarProps`:
- `value: number` and `label: string` are required; label supplies the accessible name.
- `min?: number = 0` and `max?: number = 100` define the domain.
- `text?: string | false | ((progress: ProgressState) => string)` defaults to a rounded percentage. A string supplies custom content, a formatter receives normalized state, and false hides visible text.
- `rounded?: boolean = false` enables the theme's corner radius.
- `color?: string = primary color` sets the fallback fill color.
- `textColor?: string = background color` sets fallback text on the filled portion.
- `colorRanges?: readonly ProgressColorRange[] = []` selects fill and optional filled-text colors by percentage.
- `pulse?: boolean = true` enables shared endpoint feedback.

`ProgressTextProps`:
- `percentage: number` and `children: string` are required.
- `filledColor?: string = background color` and `trackColor?: string = foreground color` choose the two text colors.

### Outputs
A full-width progress bar with normalized accessibility values, or a reusable text overlay for an indicator with a horizontal leading-edge fill.

### Guarantees / Constraints
The components use React and CSS, support server rendering, and introduce no runtime dependencies. Text is decorative to assistive technology; the owning indicator supplies its accessible value.

## Behavior
The bar uses shared normalization, range selection, and endpoint feedback. Its track uses the theme background. Fill starts at the left and spans the normalized percentage. Value changes smoothly resize fill and text clipping with identical timing, preserving alignment through interrupted transitions. Range colors change immediately together with their filled-text colors.

Text is centered across the whole bar in the theme's monospace family. Two aligned copies are clipped at the same boundary as the fill: foreground text on the track and the selected filled-text color on the fill. Custom light fills can supply a contrasting filled-text color, including per range. Long text clips within the available width. Text defaults to a rounded whole percentage, while the fill and accessible value retain fractional precision.

The bar has a thick dark outline and square corners by default. Rounding follows the theme radius. At the end of fill movement, full gives a slight outward wobble and empty gives a slight inward wobble, each with small opposite-direction overtravel. Interrupted movement cancels the pending pulse, and the latest endpoint pulses when its movement finishes. `pulse={false}` leaves the bar still. Reduced motion makes fill and text updates immediate and disables the wobble. Forced-colors mode uses system colors for outline, fill, and text.

## Interface
`ProgressBar` is a controlled, noninteractive indicator with progressbar semantics, an accessible label, bounds, and current value. Visible text also supplies the accessible value description. Hiding text retains numeric accessibility values. Updates remain available through progressbar semantics while leaving announcement frequency to the application.

`ProgressText` overlays the nearest positioned container. Its clipping assumes the same left-to-right horizontal fill geometry; further geometries may add their own clipping contract. Consumer-supplied colors and labels determine final contrast and meaning.

Storybook includes default, rounded, hidden-text, endpoint, and interactive examples under Components/Molecules/ProgressBar. Examples/Progress indicators demonstrates live completion, a pausable countdown, XP, increasing weapon heat, and keyboard-scrollable reading progress using the same bar. Example colors use semantic theme tokens.

## Acceptance
1. The default bar has a primary fill, square corners, a thick dark outline, and centered monospace percentage text.
2. `rounded` follows the theme radius, and `text={false}` hides text while retaining accessible progress.
3. Custom strings and formatters display and expose their value descriptions using normalized state.
4. `min`, `max`, and `value` follow shared normalization in both fill and accessibility attributes.
5. Color stops support both low-danger and high-danger mappings, with fallback colors outside configured stops.
6. Two text colors remain aligned with the fill at empty, partial, half, and full states, including during transitions and reduced motion.
7. Endpoint transitions wobble once upon visible fill completion: outward when full and inward when empty. Mounting, cancelled arrivals, disabled pulses, and reduced motion stay still.
8. Forced-colors mode preserves the outline and distinguishes filled and unfilled text.
9. All five composed examples update from their respective live value sources and clean up active timers on unmount.
