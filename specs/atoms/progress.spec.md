# Progress value model

## Purpose
Normalize values, resolve value-based colors, and stack series into bounded intervals independently of presentation shape. Keep endpoint feedback reusable and tied to visible completion.

## Related
- [Progress component](../components/molecules/progress/progress.spec.md)
- [Reduced motion](useprefersreducedmotion.spec.md)

## Contract
### Inputs
- `getProgressState({value: number, min?: number = 0, max?: number = 100})`.
- `getProgressColor(percentage, ranges = [], fallback = primary, textColor = background)`; each range has inclusive `upTo: number`, `color: string`, optional `textColor: string`.
- `getProgressText(state, text?: string | false | ((state: ProgressState) => string))`.
- `resolveProgressLayers(layers: readonly ProgressLayer[], max: number = 100, color: string = primary, ranges: readonly ProgressColorRange[] = [])`. Layer/series inputs follow the component contract.
- `useProgressPulse(ref, state: Pick<ProgressState, "isEmpty" | "isFull">, enabled = true, motionRef?)` accepts the pulse target and optional element containing movements to await.
### Outputs
- Finite clamped state with value, bounds, percentage, and endpoint flags.
- Resolved fill/text colors, formatted string or false, or resolved layers with effective series amounts and start/end percentages.
- Endpoint animation after actual movement completion when a moving target is supplied.
### Guarantees / Constraints
Pure helpers preserve inputs and support SSR. Browser animation runs in effects and respects live reduced-motion preferences.

## Behavior
Scalar nonfinite values become min; finite values clamp. Nonfinite, equal, reversed, or overflowing bounds restore the zero-to-one-hundred domain. Fractional values and negative scalar minima work normally.

The smallest matching inclusive upper threshold wins regardless of input order; equal thresholds use the first entry. Nonfinite and out-of-percentage bounds are skipped. Uncovered values use fallback colors. Default text rounds percentage while numeric state stays precise.

Layers resolve independently. Invalid capacities become one hundred. Series amounts clamp to zero and remaining capacity; invalid amounts become zero. Duplicate IDs use first entries, scoped per layer for series. Color percentages use effective amounts relative to capacity, with series overrides and root fallbacks. Series intervals are cumulative and bounded; layer totals derive from their sum.

Pulse direction is outward for full, inward for empty, with staggered axes and small overtravel. With a moving ref, its own and descendant animation promises determine completion. Cancelled movements and superseded arrivals stay quiet. Initial/repeated endpoints stay quiet. Disabled pulses, reduced motion, and unmount cancel pending and active feedback. Unsupported animation stays still.

## Interface
Progress uses these helpers for every shape and app value source. Applications own state lifecycle; the component owns presentation and completion feedback.

## Acceptance
1. Invalid scalar inputs yield finite bounded values.
2. Color thresholds are inclusive, order-independent, and immutable.
3. Ordered series produce cumulative bounded intervals and independent layer totals.
4. Color selection uses each effective series amount and supports inherited or overridden ranges.
5. Endpoint feedback awaits all descendant movements and preserves cancellation, direction, and reduced-motion behavior.
