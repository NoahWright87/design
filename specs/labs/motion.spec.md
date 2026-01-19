# Motion Lab — Interactive Component Motion Tuning

## Overview
- Purpose: Visual, interactive playground for designing and tuning component motion (animations) with real-time preview and portable CSS export.
- Implementation: Single-adapter pages in Storybook; separate story per component (Button, Modal) to avoid React hooks conflicts.
- Design system integration: Uses motion knobs (duration, easing, transform) to generate CSS custom properties and keyframes; adapters encapsulate component-specific motion logic.

## Architecture

### Core Concepts
- **MotionAdapter**: Defines motion interface for a single component. Contains:
  - Knobs: Array of motion controls (range, select, toggle).
  - Presets: Named motion configurations.
  - `renderPreview()`: Renders live component with current motion values.
  - `generateCss()`: Outputs portable CSS snippet based on current settings.

- **MotionLab Shell**: Generic UI container that:
  - Displays preset selector.
  - Renders knob controls (sliders, dropdowns, toggles).
  - Shows easing curve graphs for cubic-bezier knobs.
  - Displays sticky component preview.
  - Outputs copyable generated CSS.

### Knob Types
1. **Range**: Numeric slider (min/max/step).
2. **Select**: Dropdown menu (fixed options).
3. **Toggle**: Boolean switch.
4. **Bezier knobs** (via Range): Four sliders (x1, y1, x2, y2) for cubic-bezier curves; includes visual easing graph.

### Layout
- Header: Component name and subtitle.
- **Sticky Preview**: Always visible as user scrolls; renders real component with current motion applied via CSS variables.
- Controls Grid: 2-column layout (1 column on mobile).
  - Presets section: Select current preset.
  - Knob sections: Grouped by category (e.g., "Hover", "Press").
  - Easing sections: Bezier graph + 4 sliders per easing curve.
  - Generated CSS: Read-only textarea with copy button.

## API

### MotionLab Component
```tsx
interface MotionLabProps {
  adapter: MotionAdapter;
}

export function MotionLab({ adapter }: MotionLabProps)
```

### MotionAdapter Interface
```tsx
interface MotionAdapter {
  id: string;
  displayName: string;
  knobs: MotionKnob[];
  presets: MotionPreset[];
  renderPreview: (values: MotionValues) => ReactElement;
  generateCss: (values: MotionValues) => string;
}

interface MotionKnob {
  id: string;
  label: string;
  type: "range" | "select" | "toggle";
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly string[];
}

interface MotionPreset {
  name: string;
  values: Record<string, number | string | boolean>;
}
```

### UI Components (Reusable)
- **Range**: Slider with label and numeric readout.
- **Select**: Dropdown with label.
- **Toggle**: Switch with label.
- **EasingGraph**: SVG cubic-bezier curve visualization with control points and grid lines.
- **GeneratedCss**: Textarea with copy-to-clipboard button.

## Current Adapters

### Button Motion Adapter
- **Component**: Button (hover, press, release states).
- **Knobs**:
  - Hover: lift (px), scale.
  - Press: scale, squish X/Y, press mode (shrink/squish).
  - Timing: press duration (ms), release duration (ms).
  - Easing: separate press and release cubic-bezier curves (x1, y1, x2, y2 each).
- **Presets**: 5 presets (No motion, Smooth press + smooth release, Smooth press + snap release, Subtle bounce, Extreme bounce).
- **Story**: `Labs / Motion Lab / Button`.

### Modal Motion Adapter
- **Component**: Modal (enter/exit animations).
- **Knobs**:
  - Enter: duration (ms), cubic-bezier (x1, y1, x2, y2).
  - Exit: duration (ms), cubic-bezier (x1, y1, x2, y2).
  - Transform type: select (fade-only, scale-fade, slide-fade).
- **Presets**: 4 presets (Fade in/out, Scale + fade smooth, Scale + fade bouncy, Slide + fade).
- **Story**: `Labs / Motion Lab / Modal`.

## Interactions

### User Workflow
1. Open Motion Lab story for desired component (e.g., Button).
2. Select a preset from the "Presets" dropdown.
3. Adjust individual knobs (sliders/toggles) to fine-tune motion.
4. Watch live preview update in sticky preview panel.
5. Copy generated CSS from the bottom.
6. Paste CSS into component styles (or hand to developer).

### Preview Behavior
- Preview is always visible (sticky position) as user scrolls through controls.
- Component reflects current motion values in real-time.
- Motion applies via CSS custom properties and inline styles.

### CSS Generation
- Outputs portable CSS snippet with all values resolved (no placeholders).
- Includes keyframes, transitions, easing functions.
- Respects `prefers-reduced-motion` media query (animations disabled if user prefers).
- Output updates live as knobs change.

## Accessibility
- All controls have associated labels (range, select, toggle).
- Easing graph is decorative (aria-label on SVG).
- Copy button provides visual feedback ("Copied!" message).
- Sticky preview has sufficient contrast and padding.
- Keyboard navigation: all controls are focusable (native inputs).

## Constraints & Non-Goals (Current)
- No custom easing editor (cubic-bezier only; presets for common curves).
- No color/layout animation (motion/transform only).
- No animation library integration (CSS-first approach).
- No animation timeline scrubber (keyframe preview).
- No multi-component grouping (one adapter per story).

## Acceptance Criteria (Source of Truth for Tests)
1. MotionLab renders with correct adapter name in header.
2. Preset dropdown displays all presets; selecting one updates all knobs.
3. Each knob control (range, select, toggle) updates its value on user input.
4. Easing graph updates visually as bezier knobs change.
5. Preview component updates in real-time as values change.
6. Generated CSS updates live and reflects current settings.
7. Copy button copies CSS to clipboard and shows feedback.
8. Sticky preview remains visible when scrolling through controls.
9. Button Motion: renders Button with motion applied; presets include bounce/squish effects.
10. Modal Motion: renders Modal with enter/exit animations; transform type selector works.

## Current Example & Story Mapping
- Story: `Labs / Motion Lab / Button` — Interactive Button motion tuning.
  - Preset: "Smooth press + snap release (bouncy)" (default).
  - Controls: Hover lift/scale, press scale, squish, timing, easing curves.
  - Intent: Design playful button interactions with overshoot on release.

- Story: `Labs / Motion Lab / Modal` — Interactive Modal motion tuning.
  - Preset: "Scale + fade (smooth)" (default).
  - Controls: Enter/exit duration, easing curves, transform style.
  - Intent: Design modal entrance and exit animations.

## Backlog
- See `specs/labs/motion.todo.md` (future enhancements).

