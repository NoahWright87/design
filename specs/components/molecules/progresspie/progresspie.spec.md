# Progress pie

## Purpose
Provide a solid circular progress indicator that fills like a pie chart, sharing value interpretation, color ranges, readable text, and endpoint feedback with the progress bar.

## Related
- [Progress atoms](../../../atoms/progress.spec.md)
- [Progress bar and shared text](../progressbar/progressbar.spec.md)

## Contract
### Inputs
`ProgressPieProps` extends the shared `ProgressIndicatorProps`:
- `value: number` and `label: string` are required.
- `min?: number = 0`, `max?: number = 100` define the value domain.
- `text?: ProgressTextValue` defaults to a rounded percentage; a string overrides it, a formatter receives normalized state, and false hides visible text.
- `color?: string = primary color`, `textColor?: string = background color`, and `colorRanges?: readonly ProgressColorRange[] = []` choose the filled sector and its text color.
- `pulse?: boolean = true` enables completion-timed endpoint feedback.
- `size?: number = 128` sets the outer diameter in CSS pixels; finite positive sizes apply, and other values restore the default.
### Outputs
A solid circular progressbar with a dark outline, clockwise filled sector, and optional centered monospace text.
### Guarantees / Constraints
The component uses React and CSS with shared progress atoms. Server rendering produces the requested static state. Modern browsers with registered CSS custom property support interpolate the sweep smoothly. Applications own timers, XP, and scroll sources.

## Behavior
The sweep starts at twelve o'clock and fills clockwise. Empty shows the background throughout, halfway fills the right half, and full fills the entire circle. The circle stays solid through its center. The theme background fills the remainder; the thick dark outline matches the bar.

The sweep and text masks animate with the same angle, timing, and easing. Text remains centered across the whole circle, using foreground color over the unfilled sector and the configured filled-text color over the filled sector. Range-specific filled-text colors support custom light fills. Long text clips to the circle. Hiding text preserves the accessible numeric value.

Full pulses slightly outward and empty pulses slightly inward, after the visible sweep finishes. Reversals follow actual animation completion. Cancelled arrivals stay quiet. Mounting at an endpoint stays still. Reduced motion updates the sweep and masks immediately and keeps endpoint feedback still. Forced-colors mode uses system colors and preserves the solid sector.

## Interface
Use `ProgressPie` with the same controlled value and common props as `ProgressBar`. Size controls the circular footprint. The accessible label, bounds, normalized current value, and optional text description use progressbar semantics; decorative text copies remain hidden from assistive technology.

Storybook includes partial and endpoint states, sizes, hidden text, percentage color ranges, and interactive full/empty controls. The shared progress collection can switch between bar and pie for live completion, countdown, XP, weapon heat, and reading progress.

## Acceptance
1. Zero, quarter, half, three-quarter, and full values produce clockwise sweeps of the corresponding fractions from twelve o'clock.
2. The default is a solid primary-colored pie with a thick dark outline, centered monospace text, and the default diameter.
3. Custom domains, clamping, invalid numeric inputs, color ranges, and text formatting match the bar's shared contract.
4. Size applies equally to width and height; invalid sizes restore the default.
5. Text masks follow the fill boundary throughout movement, with one color per background and complete empty/full coverage.
6. Full and empty feedback starts at sweep completion with the matching outward or inward pulse; cancellation and reduced motion follow shared behavior.
7. Server-rendered accessibility remains valid with custom text and hidden text.
8. Forced-colors mode preserves the sector and distinguishes text over filled and unfilled areas.
