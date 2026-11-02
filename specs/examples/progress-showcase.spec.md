# Progress showcase

## Purpose
Provide one complete interactive example where users can see and configure multiple layers, multiple series, value-based colors, shapes, segmentation, and labels together.

## Related
- [Progress](../components/molecules/progress/progress.spec.md)
- [Progress atoms](../atoms/progress.spec.md)

## Contract
### Inputs
The Storybook Showcase story provides local presentation settings and three editable layers with two series each. Presentation controls include shape, root label, label position, automatic/custom/hidden text, fallback color, segment count and gap, radial diameter/band width/layer gap, rounded bars, and endpoint pulses.

Each layer exposes enablement, capacity, appearance, opacity, and outline width. Each series exposes enablement, independent slider and numeric amount, fixed/inherited fallback color, and a value-based-color toggle. Enabled range coloring exposes three editable inclusive upper thresholds with independently selectable token colors.
### Outputs
A live Progress control and a resolved legend showing layer totals, effective amounts, interval boundaries, and actual series colors.
### Guarantees / Constraints
All controls update the same preview, preserving values through presentation changes. Example colors use semantic tokens. Local component state owns the demo data; resets are deterministic.

## Behavior
Initial health series have amounts seventy-five and ten, demonstrating health followed by poison with an empty remainder. Shield has two series, with the first initially in a yellow value-based color range. Reserve has two outline series, including an inherited fallback color so the fallback control visibly affects the preview.

The preview switches all four shapes without replacing data. Bar layers overlap; radial layers form concentric regions. Enablement removes a series or layer from the displayed model while retaining its editor state. Values can exceed capacity through numeric inputs, demonstrating clipping through the resolved legend. Threshold colors respond to effective amounts; thresholds use the component's smallest matching inclusive-bound rule.

Automatic text shows the editable label and first enabled layer percentage. Custom mode replaces the caption; hidden mode hides it. Position controls move the caption around the preview. Resizing and segmentation preserve series state. The vertical preview has enough width for a wrapped centered caption.

Empty-all sets every series amount to zero. Fill-each-layer assigns capacity to the first enabled series in each layer and zero to the remainder. Reset restores all values, colors, ranges, enablement, and presentation settings. Disabling every layer leaves an explanatory empty state.

## Interface
Find the example at Examples → Progress indicators → Showcase. The live preview and resolved legend come first, followed by presentation controls and separately labelled layer/series fieldsets. Inputs have visible associated labels; control grids adapt to the available width. Preview overflow scrolls when necessary.

## Acceptance
1. The initial preview has three layers and six independently editable series.
2. Initial health/poison intervals are zero-to-seventy-five and seventy-five-to-eighty-five; the shield's range-driven fill starts yellow.
3. Every series value, enabled range threshold/color, layer style, and presentation control updates the shared preview.
4. Shape switches preserve values and reveal overlapping versus concentric geometry.
5. Label edits appear immediately in automatic mode at every visible position, and custom/hidden modes behave as indicated.
6. The legend reflects effective clipped amounts, intervals, and resolved colors.
7. Empty, fill, reset, and enablement controls behave deterministically, including disabled-series fill selection.
