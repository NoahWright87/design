# Progress atoms

## Purpose
Give progress indicators a shared interpretation of bounded values, percentage color ranges, and playful endpoint feedback, independent of shape or value source.

## Related
- [Progress bar and text](../components/molecules/progressbar/progressbar.spec.md)
- [Reduced motion](useprefersreducedmotion.spec.md)

## Contract
### Inputs
- `getProgressState(options: ProgressOptions)` takes required `value: number`, `min?: number = 0`, and `max?: number = 100`.
- `getProgressColor(percentage: number, ranges: readonly ProgressColorRange[] = [], fallback: string = primary color, textColor: string = background color)` accepts percentage stops. Each stop has `upTo: number`, `color: string`, and optional `textColor: string` inheriting the fallback text color.
- `useProgressPulse(ref: RefObject<HTMLElement>, progress: Pick<ProgressState, "isEmpty" | "isFull">, enabled: boolean = true)` accepts a target and normalized endpoints.
### Outputs
- `ProgressState` contains finite, clamped `value`, valid `min` and `max`, `percentage` from zero to one hundred, and `isEmpty` and `isFull` flags.
- Color resolution returns `{ color: string, textColor: string }`.
- The pulse hook animates the target on arrival at an endpoint.
### Guarantees / Constraints
- Pure normalization and color resolution support server rendering and preserve caller inputs.
- Browser animation runs in effects and respects the live reduced-motion preference.

## Behavior
Finite values clamp to the bounds. A nonfinite value becomes the minimum. Nonfinite, reversed, equal, or overflowing bounds restore the zero-to-one-hundred domain. Negative minima and fractional values work normally.

The smallest matching inclusive upper percentage stop wins; equal bounds use the first matching entry. Stops outside zero to one hundred or with nonfinite bounds are skipped. Values above every stop use the supplied fallback colors. Stops can express either increasing safety or increasing danger, using any CSS color or theme token.

The pulse runs when active progress reaches empty or full, or jumps directly between endpoints. Mounting at an endpoint stays still. Repeated values at the same endpoint stay still. Each pulse grows, squashes past its resting size, and settles with staggered horizontal and vertical peaks. Leaving the endpoint, disabling the hook, reduced motion, and unmounting cancel its animation. Targets lacking browser animation support stay still.

## Interface
Applications provide controlled values from completion, remaining or elapsed time, XP, or scroll position. Further shapes reuse the normalized state, range selection, and pulse hook. Timer lifecycle and scrolling event ownership remain with the application.

## Acceptance
1. Values below and above valid bounds clamp to the matching endpoint.
2. Nonfinite values and invalid bounds resolve to finite accessible state.
3. Nonzero and negative minima yield correct percentages and endpoint flags.
4. Unsorted stops resolve by the smallest inclusive upper bound without mutating input; unmatched and invalid stops preserve fallback behavior.
5. Each endpoint arrival plays one wobble; initial and repeated endpoints stay still.
6. Reduced motion, disabled pulses, unsupported animation, and unmounting leave the target at rest.
