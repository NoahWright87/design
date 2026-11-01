# Shared linear and radial progress presentations

## Purpose
Provide maintainable, public composition bases for continuous and segmented bars in both orientations, solid pies, and open-center rings. Share normalization, text, layers, accessibility, and pulse timing across every canonical presentation.

## Related
- [Progress atoms](../../../atoms/progress.spec.md)
- [Bar and shared text](../progressbar/progressbar.spec.md)
- [Pie](../progresspie/progresspie.spec.md)
- Sources: [shared bases](../../../../src/components/molecules/Progress/index.tsx), [ring wrapper](../../../../src/components/molecules/ProgressRing/index.tsx), [segmented wrapper](../../../../src/components/molecules/ProgressSegmentedBar/index.tsx)

## Contract
### Inputs
All presentations extend `ProgressIndicatorProps`: required `value: number`, `label: string`; optional `min: number = 0`, `max: number = 100`, `text: ProgressTextValue` (rounded percentage), `color: string` (primary), `textColor: string` (background), `colorRanges: readonly ProgressColorRange[] = []`, `pulse: boolean = true`, and `layers: readonly ProgressLayerOptions[] = []`.

`ProgressPresentationProps` adds:
- `className?: string` and `style?: CSSProperties` for application styling. Consumer styles override default dimensions and custom properties.
- `children?: ReactNode | ((progress: ProgressState) => ReactNode)` for decorative custom content, replacing the default visible label. The ordinary text formatter still supplies the accessible value description.

`LinearProgressProps` adds:
- `orientation?: "horizontal" | "vertical" = "horizontal"`.
- `rounded?: boolean = false` using the theme radius.
- `segments?: number = 1` for visual divisions. Finite positive counts round down and clamp to one through one hundred; other counts become one.
- `gap?: number = 3` for division gaps in CSS pixels. Finite nonnegative values apply; other values restore the default. Effective gaps fit within half a cell.

`RadialProgressProps` adds:
- `variant?: "pie" | "ring" = "pie"`.
- `size?: number = 128`, the outer diameter in CSS pixels. Finite positive values apply; other values restore the default.
- `thickness?: number = 16`, the ring band in CSS pixels. Finite positive values apply; other values restore the default. Width caps to leave a center opening where the diameter permits.

Canonical wrappers:
- `ProgressBarProps` exposes the linear base inputs except segments and gap.
- `ProgressSegmentedBarProps` exposes all linear inputs, defaulting segments to ten.
- `ProgressPieProps` exposes radial inputs except variant and thickness, choosing pie.
- `ProgressRingProps` exposes radial inputs except variant, choosing ring.

`ProgressLayerOptions` contains:
- Required `id: string`, `label: string`, and `value: number`.
- `min?: number = 0`, `max?: number = 100`, `color?: string` (inherits the main fallback color), and `colorRanges?: readonly ProgressColorRange[] = []`.
- `placement?: "behind" | "over" = "behind"` chooses paint order relative to the primary fill.
- `thickness?: number` makes a cross-axis strip or outer radial band. Behind layers default to the full primary geometry. Over layers default to a thin band of six CSS pixels. Invalid explicitly supplied widths use six. Radial layers fit the radial radius, and ring layers stay inside the ring's band.

### Outputs
Controlled progress presentations; one accessible progressbar for a single value, or a named group containing separately named progressbars when auxiliary layers are present.

### Guarantees / Constraints
Both public bases share one renderer. Canonical wrappers choose geometry defaults and contain no value, motion, accessibility, or layer implementation. React and CSS supply all runtime behavior; server rendering emits meaningful static state. Applications own scoring, damage, timers, and scroll values.

## Behavior
Horizontal fills grow from the left; vertical fills grow from the bottom. The default horizontal footprint is full width and compact height; the vertical footprint is a narrow, taller meter. Orientation changes the fill axis and text clipping together. Segments divide the track and every fill into equal cells with gaps, preserving continuous fractional values within a cell. The final full cell reaches the track edge.

Pies and rings share the clockwise sweep from twelve o'clock and the same motion. A ring masks the center of the track and every layer, leaving the center transparent, with dark inner and outer outlines. Its centered label uses the foreground color over the opening. Ring thickness changes the band without changing the sweep, value, or outer footprint. Each radial layer uses its own band width, capped to the ring band for rings.

Auxiliary values normalize independently using their own bounds. They overlay the same value scale in space rather than adding to the primary percentage. Behind layers paint first in array order, followed by the primary fill, then over layers in array order. Later layers within a placement paint on top. Stable IDs retain layer identity; duplicate IDs use the first entry. Empty layer arrays preserve single-indicator behavior. Horizontal strips follow the top edge; vertical strips follow the right edge; radial bands follow the outer edge.

Every fill animates independently with shared timing and reduced-motion rules. Primary full/empty arrivals pulse the whole control after primary movement completes. Auxiliary values retain independent visual transitions while the primary controls endpoint pulses. Cancelled arrivals stay quiet.

Single continuous bars and pies use shared split-background text. Rings keep text in the open center. Segmented and layered controls use a small background-backed label so changing layers and gaps preserve readability. Custom decorative children replace this visible label and receive normalized primary state when provided as a function. Text and custom children stay inert to assistive technology; the indicator's numeric semantics and configured text description remain available.

Forced-colors mode uses system colors for outlines, tracks, fills, and labels. Reduced motion updates all values and masks immediately and keeps pulses still. Frame scheduling, animation promises, and cancellation remain in the shared pulse hook.

## Interface
Apps extend behavior by composing `LinearProgress` or `RadialProgress` in their own wrappers, choosing geometry options, styling the root, and optionally providing decorative content. Both bases accept identical layer descriptors, so changing presentation preserves application value logic.

With auxiliary layers the root is a named group, and visually hidden sibling progressbars expose the primary and every auxiliary value separately. This keeps layer semantics outside a progressbar's presentational descendants. Visual fills and labels are decorative. Single controls retain their existing root progressbar semantics.

Storybook includes ring widths, custom application content, segmented bars, horizontal/vertical controls, and shared completion/countdown/XP/heat/scroll examples. The layered combat example switches all shapes and both linear orientations while preserving health, armor, and recent-damage state. Normal damage consumes armor first; poison bypasses armor; a delayed trail catches up to health. Timer ownership and cleanup belong to that application example.

## Acceptance
1. Canonical bar/segmented presentations use the same linear base, and pie/ring presentations use the same radial base and shared renderer.
2. Horizontal and vertical presentations retain identical normalized values and accessibility, with fill and text using the correct axis.
3. Ring sweeps retain an open center and consistent outer footprint through thickness and value changes, including auxiliary bands.
4. Segmented tracks and fills share cell boundaries, support fractional cells and both orientations, and sanitize counts and gaps.
5. Independently bounded layers render behind/primary/over in documented order and expose separately named numeric progress values.
6. Duplicate layer IDs use the first descriptor, and all input arrays and descriptors remain unchanged.
7. Primary endpoint pulses keep completion timing, direction, cancellation, and reduced-motion behavior across every presentation.
8. Custom classes, styles, and decorative render-function children support application wrappers while preserving primary semantics.
9. Existing bar/pie defaults and text formatting remain compatible; empty layers preserve root progressbar semantics.
10. Segmented and layered labels stay readable over gaps and multiple colors; decorative children replace visible labels while retaining the configured accessible description.
11. The combat example preserves independent values across geometry switches and clears poison/trail timers on unmount or reset.
