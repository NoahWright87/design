# New Feature Request: Motion Lab

## Summary
Add a **Motion Lab** to the design system repo that allows interactive tuning of component motion (hover, press, release, focus, loading, enter/exit). Motion is difficult to reason about in text; this tool should make motion **visual, tweakable, and exportable**.

The primary goal is to let us design motion via sliders/presets and then **copy finished CSS (or tokens)** directly into real components.

---

## Placement
Preferred:
- A **Storybook page** (e.g. `Labs / Motion Lab`)

Fallback:
- A standalone page adjacent to Storybook, using the same repo and build tooling

---

## Non-Goals
- Not a full visual editor (colors/layout/etc)
- Not a replacement for Storybook stories
- Not animation-library dependent (CSS-first)

---

## Core Concept
The Motion Lab is a **generic shell** that hosts **component-specific motion adapters**.

Each adapter describes:
- What motion knobs exist
- What presets exist
- How to render a live preview
- How to generate portable CSS output

---

## Motion Lab Shell (Shared)

### Layout
- **Left panel**: presets, controls, toggles
- **Right panel**: live component preview
- **Bottom panel**: generated CSS output (copyable)

### Features
- Preset dropdown (sets all controls at once)
- Reset to preset defaults
- Generated CSS textbox (read-only)
- “Copy CSS” button
- Optional “Copy tokenized CSS” or JSON output
- Optional `prefers-reduced-motion` preview toggle

---

## Component Motion Adapters

Each component supplies a small adapter module.

### Adapter responsibilities
- Declare supported motion variables (names, ranges, defaults)
- Declare presets (e.g. No motion, Professional, Playful, Extreme)
- Render the real component with current motion values applied (usually via CSS vars)
- Generate a **portable CSS snippet** based on current settings

### Conceptual adapter shape
- `id`: `"button"`
- `displayName`: `"Button"`
- `knobs`: hover, press, release, easing, duration, scale, etc
- `presets`: named sets of values
- `renderPreview(values)`
- `generateCss(values)`

---

## Interaction Modeling

Supported interaction states:
- Hover
- Press / Active
- Focus-visible
- Disabled
- Loading (optional)
- Enter / Exit (for components that mount/unmount)

Interaction simulation:
- Real interactions (hover, press)
- Optional forced states (e.g. “Force hover”, “Force active”) for tuning

---

## Easing Visualization
Include a lightweight easing visualizer:
- Cubic-bezier curve graph
- Control points visible
- Supports overshoot (y < 0 or y > 1)
- Separate curves for **press** and **release**
- Optional “playhead” animation along the curve

---

## Output Formats

Minimum:
- **Resolved CSS** (all values filled in, ready to paste)

Optional:
- **Tokenized CSS** (references design tokens instead of literals)
- **JSON output** for motion tokens/config

Generated output should update live as controls change.

---

## Storybook Integration
- Appears as a dedicated “Motion Lab” entry
- Uses real design-system components for preview
- No external animation libraries required
- CSS-only motion (transforms + transitions)

---

## Suggested File Structure

src/labs/motion/
- MotionLab.tsx (shell)
- adapters/
  - button.motion.ts
  - input.motion.ts
  - modal.motion.ts
- ui/
  - Range.tsx
  - Toggle.tsx
  - Select.tsx
  - EasingGraph.tsx
  - GeneratedCss.tsx

Adapters are registered explicitly (simple array, no magic).

---

## Acceptance Criteria
- Can select a component and tune motion live
- Presets update all controls
- Generated CSS updates live
- CSS is copyable and portable
- No layout shift (transform-only motion)
- Works inside Storybook
