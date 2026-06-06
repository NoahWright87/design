# Motion Lab — Interactive Motion Tuning

## Purpose
Motion Lab is an interactive playground for designing and tuning component animations. It lets developers and designers adjust motion parameters in real time, preview the result on a live component, and export the resulting CSS for use in the design system.

## Related
- [Motion tokens](../atoms/motion.spec.md)
- [Button component](../components/molecules/button/button.spec.md)
- [Modal component](../components/organisms/modal/modal.spec.md)

## Contract

### Inputs
- A motion adapter that defines knobs, presets, and a preview component for a specific component.
- User interaction: adjusting knobs (sliders, dropdowns, toggles) and selecting presets.

### Outputs
- A live preview of the component with the current motion values applied.
- A generated export reflecting the current settings, ready to copy and paste as component CSS, CSS custom properties, SCSS variables, or design token JSON.

### Guarantees / Constraints
- One adapter per story — multiple adapters in the same story are not supported.
- The preview always reflects the current knob values in real time.
- Generated CSS always matches what is shown in the preview.
- The generated CSS includes a reduced-motion media query.

## Behavior

**Opening the lab:** The lab renders with the default preset applied and all knobs set to the preset's values.

**Selecting a preset:** All knobs update to the preset's values and the preview refreshes immediately. Presets can be selected from the dropdown or with Ctrl+number shortcuts in preset order.

**Adjusting a knob:** The preview updates as the knob changes; the generated export updates to match. The reset button reapplies the currently selected preset values after manual knob changes.

**Copying exports:** The current export is copied to the clipboard and a brief confirmation is shown. Individual easing readouts can also be copied from their easing sections.

**Current adapters:**
- **Button** — controls hover lift, press scale and squish, and timing curves for press and release.
- **Modal** — controls enter and exit duration, easing curves, and transform type (fade, scale-fade, slide-fade).

## Interface

The lab is organized into three main areas:

**Header:** Component name and description.

**Sticky preview:** The live component, always visible as the user scrolls through controls.

**Controls panel:** Preset selector at the top, then grouped knob sections below. Sliders control numeric values; dropdowns select named options; toggles switch boolean settings. Easing knobs include a visual curve graph alongside the sliders.

**Generated export:** A read-only text area at the bottom showing the selected export format, with a format selector and copy button. Supported formats are component CSS, CSS custom properties, SCSS variables, and design token JSON.

On small screens, the control grid collapses to a single column.

## Acceptance
1. The lab renders with the adapter's name in the header.
2. The preset dropdown shows all available presets; selecting one updates all knobs.
3. Each knob type (slider, dropdown, toggle) updates its value on user input.
4. Easing curve graphs update visually as bezier knobs change.
5. The preview component updates in real time as values change.
6. The generated CSS updates live and matches the preview.
7. The copy button copies the selected export to the clipboard and shows brief feedback.
8. The export selector switches between component CSS, CSS custom properties, SCSS variables, and design token JSON.
9. The sticky preview remains visible while scrolling through the controls panel.
10. The Button adapter renders a button with motion applied; bounce and squish presets work.
11. The Modal adapter renders a modal with enter and exit animations; the transform type selector works.
12. Ctrl+number shortcuts select presets in dropdown order.
13. The reset button restores the currently selected preset's values.
14. Each easing section copy button copies that easing function and shows brief feedback.
