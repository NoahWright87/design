# Progress

## Purpose
One public progress component presents scalar or densely layered information using a shared value model across horizontal bars, vertical bars, pies, and rings. Layers select styling; ordered series stack as amounts within each layer.

## Related
- [Progress atoms](../../../atoms/progress.spec.md)
- [Design system](../../../design-system.spec.md)
- [Source](../../../../src/components/molecules/Progress/index.tsx)

## Contract
### Inputs
`ProgressProps`:
- `label: string` is the required accessible name and default visible label.
- `shape?: ProgressShape = "BarHorizontal"`; alternatives are `BarVertical`, `Pie`, and `Ring`.
- `value?: number = 0`, `min?: number = 0`, `max?: number = 100` provide the scalar shortcut. Explicit `layers` are authoritative when supplied. In layer mode root max is the fallback layer capacity; min applies to scalar mode.
- `color?: string` defaults to primary. `colorRanges?: readonly ProgressColorRange[] = []` provides fallback percentage-based colors for series. A series-specific range list overrides this list, including an empty list. Uncovered percentages use the series color or root color.
- `text?: ProgressTextValue` defaults to the configured label followed by the first layer's total percentage or scalar percentage. Explicit strings and formatters replace that visible text while label remains the accessible name. `textColor?: string` defaults to background for scalar split text.
- `labelPosition?: "center" | "top" | "bottom" | "left" | "right" | "none" = "center"`. Position none hides visual text while preserving its accessible description. `text={false}` hides the automatic label and description.
- `segments?: number | null = 0`. Zero, null, negative, nonfinite, and counts rounding below two produce continuous progress. Valid counts round down and cap at one hundred, for every shape.
- `gap?: number = 3`, in pixels for bars and degrees for radial cells; finite nonnegative values apply, others restore the default. Effective gaps cap at half a cell.
- `layers?: readonly ProgressLayer[]` defines explicit layers. Empty arrays render an empty canvas and named accessible group.
- `size?: number = 128` sets radial diameter in CSS pixels. Finite positive values apply; others restore the default.
- `thickness?: number = 16` sets radial band width; `layerGap?: number = 3` sets radial spacing. Invalid widths restore the default, invalid negative spacing restores the default, and both fit available radial space.
- `rounded?: boolean = false` applies theme corner rounding to bars.
- `pulse?: boolean = true` enables first-layer/scalar endpoint feedback.
- `className?: string`, `style?: CSSProperties`, and `children?: ReactNode | ((state: ProgressState) => ReactNode)` support app composition. Decorative children replace visible automatic text and follow labelPosition; text still supplies the accessible description.

`ProgressLayer`: required `id: string`, `label: string`, and `series: readonly ProgressSeries[]`; optional `max?: number` inherits root max, `appearance?: "solid" | "hatched" | "outline" = "solid"`, `opacity?: number = 1` clamped to zero through one with nonfinite values restoring one, and `outlineWidth?: number = 3` in pixels, capped at twenty with invalid values restoring three.

`ProgressSeries`: required `id: string`, `label: string`, `value: number`; optional `color?: string` and `colorRanges?: readonly ProgressColorRange[]`. Values are amounts, not cumulative endpoints. Color thresholds are inclusive upper percentages of this series' effective amount divided by its layer capacity.

### Outputs
One accessible progressbar in scalar mode, or a named group of layer groups containing totals and separately named series progressbars in explicit-layer mode. Every shape renders the same resolved series intervals.

### Guarantees / Constraints
`Progress` is the only public progress UI component; shape-specific render geometry stays internal. Normalization, stacking, colors, labels, segments, semantics, motion, and app slots share one implementation. Runtime dependencies remain React and CSS, with meaningful server-rendered state.

## Behavior
Each layer starts at zero. Series add sequentially: amounts seventy-five and ten occupy the first seventy-five percent and the following ten percent, leaving the final fifteen percent empty. Values clamp to remaining capacity, so overflow clips later series; negative and nonfinite amounts consume zero. Each layer has an independent capacity. Duplicate layer IDs and duplicate series IDs within a layer use the first entry. Input data stays unchanged.

Colors respond to each series' own effective percentage. For example, red through ten percent, yellow through fifty, then green. The entire series changes color when its value crosses a threshold. This value-driven coloring is distinct from stacking differently colored series in separate intervals. Fixed colors and value-driven colors can coexist across layers.

Bars share geometry except for axis: horizontal fills grow from the left; vertical fills grow from the bottom. Layers overlay in array order, with later layers on top. Solid, diagonal hatch, outline-only, opacity, and outline width distinguish overlapping values.

Radial layers occupy disjoint concentric regions, with the first layer innermost and later layers successively outside it. Pie uses an innermost disk surrounded by bands. Ring uses bands throughout, retaining an open center. Each region has its own track, capacity, series, and styling. All series sweep clockwise from twelve o'clock. Segmentation divides every region angularly, or every bar layer along the fill axis.

Single scalar continuous bars and pies use shared split-background text. Rings, segmented controls, and explicit layers use a small background-backed caption for readable labeling across regions, patterns, and gaps. Labels can move outside the canvas; custom decorative content follows the same placement. Hidden labels retain numeric accessibility.

The first layer's total controls the default label and endpoint pulse. Full pulses slightly outward, empty slightly inward, with a small opposite-direction settling motion. Pulse begins after the first layer's series movements complete, including both interval boundaries, and is cancelled by interrupted arrivals. Initial and repeated endpoints stay still. Other layers animate independently. Reduced motion updates all geometry immediately and disables pulses. Forced colors use system colors while retaining hatch/outline distinctions.

## Interface
Apps compose `Progress` with shape props rather than selecting separate public components. Scalar values support completion, time, XP, heat, and scroll position. Layer arrays support health/poison intervals plus shield or reserve layers. Application logic owns timers, poison consumption, damage projection, and scoring.

Storybook's unified Progress stories expose shape, value, segmentation, and label placement; threshold examples use danger, warning, and confirm colors. Examples/Progress indicators/Showcase exposes three styled layers with two editable series each, fixed and range-driven colors, all presentation settings, and a live resolved-value legend. The showcase spec defines its complete interaction contract. Live timer, XP, and scroll examples remain available separately.

## Acceptance
1. The public UI exposes one Progress component and all four shapes use the same resolved model.
2. Series seventy-five plus ten produce intervals zero-to-seventy-five and seventy-five-to-eighty-five for all shapes, with the remaining track empty.
3. Layers overlay with distinguishable styling on bars and occupy concentric regions on pies/rings.
4. Threshold boundaries select red through ten percent, yellow through fifty, and green above fifty; series-specific thresholds override root thresholds.
5. Overflow, invalid amounts/capacities, duplicate IDs, and empty inputs resolve predictably without mutating caller data.
6. All shapes support continuous and segmented rendering while preserving fractional values.
7. All label positions, hidden labels, and decorative app content preserve accessible value information.
8. Endpoint pulses retain direction, actual-completion timing, and cancellation across multiple moving series.
9. Reduced-motion and forced-colors behavior apply across all layers and series.
10. Setting label alone renders that text plus the percentage in any visible label position; custom text overrides visible content, and none/false hides it while preserving the accessible name and numeric values.
