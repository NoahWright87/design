# Progress atoms

## Purpose
Give progress indicators a shared interpretation of bounded values, percentage color ranges, and playful endpoint feedback, independent of shape or value source.

## Related
- [Progress bar and text](../components/molecules/progressbar/progressbar.spec.md)
- [Progress pie](../components/molecules/progresspie/progresspie.spec.md)
- [Shared presentations and layers](../components/molecules/progress/progress.spec.md)
- [Reduced motion](useprefersreducedmotion.spec.md)

## Contract
### Inputs
- `getProgressState(options: ProgressOptions)` takes required `value: number`, `min?: number = 0`, and `max?: number = 100`.
- `ProgressIndicatorProps` extends `ProgressOptions` with required `label: string`, optional `text: ProgressTextValue`, `color: string` (primary), `textColor: string` (background), `colorRanges: readonly ProgressColorRange[]` (empty), `pulse: boolean` (true), and `layers: readonly ProgressLayerOptions[]` (empty). `ProgressTextValue` is `string | false | ((progress: ProgressState) => string)`.
- `ProgressLayerOptions` extends `ProgressOptions` with required `id: string`, `label: string`, optional `color: string`, `colorRanges: readonly ProgressColorRange[]`, `placement: "behind" | "over"` (behind), and `thickness: number`. Presentation defaults, width constraints, and layer accessibility follow the shared presentation spec.
- `getProgressText(progress: ProgressState, text?: ProgressTextValue)` returns a rounded percentage by default, preserves supplied strings or false, and calls formatters with normalized state.
- `getProgressColor(percentage: number, ranges: readonly ProgressColorRange[] = [], fallback: string = primary color, textColor: string = background color)` accepts percentage stops. Each stop has `upTo: number`, `color: string`, and optional `textColor: string` inheriting the fallback text color.
- `useProgressPulse(ref: RefObject<HTMLElement>, progress: Pick<ProgressState, "isEmpty" | "isFull">, enabled: boolean = true, motionRef?: RefObject<HTMLElement>)` accepts a pulse target, normalized endpoints, and an optional moving element whose animation completion determines pulse timing.
### Outputs
- `ProgressState` contains finite, clamped `value`, valid `min` and `max`, `percentage` from zero to one hundred, and `isEmpty` and `isFull` flags.
- Color resolution returns `{ color: string, textColor: string }`.
- Shared text formatting returns a string or false, with false indicating hidden visual text.
- The pulse hook animates the target on arrival at an endpoint.
### Guarantees / Constraints
- Pure normalization and color resolution support server rendering and preserve caller inputs.
- Browser animation runs in effects and respects the live reduced-motion preference.

## Behavior
Finite values clamp to the bounds. A nonfinite value becomes the minimum. Nonfinite, reversed, equal, or overflowing bounds restore the zero-to-one-hundred domain. Negative minima and fractional values work normally.

The smallest matching inclusive upper percentage stop wins; equal bounds use the first matching entry. Stops outside zero to one hundred or with nonfinite bounds are skipped. Values above every stop use the supplied fallback colors. Stops can express either increasing safety or increasing danger, using any CSS color or theme token.

All canonical presentations share their common input contract and text formatting. The default label rounds the percentage for display while normalized numeric values retain their precision. Formatters receive normalized bounds, clamped value, percentage, and endpoint flags. Auxiliary layers use the same normalization and color selection independently.

The pulse runs when active progress reaches empty or full, or jumps directly between endpoints. Mounting at an endpoint stays still. Repeated values at the same endpoint stay still. Full gives a slight outward pulse; empty gives a slight inward pulse. Both have a small opposite-direction overtravel and settle with staggered horizontal and vertical peaks.

With a moving-element ref, the pulse waits for that element's current animations to finish. Actual completion governs timing, including shortened reversed transitions and custom durations. A moving element already at rest pulses on the next frame. Omitting the moving element plays the pulse immediately upon endpoint arrival. Cancelled movement stays quiet. Leaving the endpoint, disabling the hook, reduced motion, and unmounting cancel both pending and active pulses. Targets lacking browser animation support stay still.

## Interface
Applications provide controlled values from completion, remaining or elapsed time, XP, or scroll position. Further shapes reuse the normalized state, range selection, and pulse hook. Timer lifecycle and scrolling event ownership remain with the application.

## Acceptance
1. Values below and above valid bounds clamp to the matching endpoint.
2. Nonfinite values and invalid bounds resolve to finite accessible state.
3. Nonzero and negative minima yield correct percentages and endpoint flags.
4. Unsorted stops resolve by the smallest inclusive upper bound without mutating input; unmatched and invalid stops preserve fallback behavior.
5. Each endpoint arrival plays one wobble: full initially expands, empty initially contracts, and both settle with small overtravel; initial and repeated endpoints stay still.
6. Reduced motion, disabled pulses, unsupported animation, and unmounting leave the target at rest.
7. A moving-element ref delays the pulse until movement completes, including reversed transitions; cancelled or superseded arrivals stay quiet.
8. Shared text formatting produces identical defaults, custom strings, formatter results, and hidden-text signals for bar and pie.
