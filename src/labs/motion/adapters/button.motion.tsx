import * as React from "react";
import type { MotionAdapter } from "../types";

export const buttonMotionAdapter: MotionAdapter = {
  id: "button",
  displayName: "Button",

  knobs: [
    // Hover
    { id: "hover_lift", label: "Lift (px)", type: "range", defaultValue: -2, min: -16, max: 0, step: 1 },
    { id: "hover_scale", label: "Scale", type: "range", defaultValue: 1.05, min: 1.0, max: 1.3, step: 0.01 },

    // Press
    { id: "press_mode", label: "Press mode", type: "select", defaultValue: "squish", options: ["shrink", "squish"] as const },
    { id: "press_scale", label: "Shrink scale", type: "range", defaultValue: 0.88, min: 0.6, max: 1.0, step: 0.01 },
    { id: "press_squish_x", label: "Squish X", type: "range", defaultValue: 1.32, min: 0.75, max: 1.55, step: 0.01 },
    { id: "press_squish_y", label: "Squish Y", type: "range", defaultValue: 0.68, min: 0.45, max: 1.25, step: 0.01 },

    // Timing
    { id: "timing_press_ms", label: "Press-in (ms)", type: "range", defaultValue: 120, min: 0, max: 600, step: 10 },
    { id: "timing_release_ms", label: "Release (ms)", type: "range", defaultValue: 520, min: 0, max: 2000, step: 20 },

    // Press easing (cubic-bezier)
    { id: "press_x1", label: "x1", type: "range", defaultValue: 0.2, min: 0, max: 1, step: 0.01 },
    { id: "press_y1", label: "y1", type: "range", defaultValue: 0.9, min: -2, max: 3, step: 0.01 },
    { id: "press_x2", label: "x2", type: "range", defaultValue: 0.2, min: 0, max: 1, step: 0.01 },
    { id: "press_y2", label: "y2", type: "range", defaultValue: 1.0, min: -2, max: 3, step: 0.01 },

    // Release easing (cubic-bezier)
    { id: "release_overshoot", label: "Enable overshoot", type: "toggle", defaultValue: true },
    { id: "release_x1", label: "x1", type: "range", defaultValue: 0.28, min: 0, max: 1, step: 0.01 },
    { id: "release_y1", label: "y1", type: "range", defaultValue: 1.8, min: -2, max: 3, step: 0.01 },
    { id: "release_x2", label: "x2", type: "range", defaultValue: 0.55, min: 0, max: 1, step: 0.01 },
    { id: "release_y2", label: "y2", type: "range", defaultValue: 1.0, min: -2, max: 3, step: 0.01 },

    // Anchor
    { id: "anchor", label: "Transform origin", type: "select", defaultValue: "bottom", options: ["center", "top", "bottom", "left", "right"] as const },
  ],

  presets: [
    {
      name: "No motion",
      values: {
        hover_lift: 0,
        hover_scale: 1,
        press_mode: "shrink",
        press_scale: 1,
        press_squish_x: 1,
        press_squish_y: 1,
        timing_press_ms: 0,
        timing_release_ms: 0,
        press_x1: 0.2,
        press_y1: 1,
        press_x2: 0.2,
        press_y2: 1,
        release_overshoot: false,
        release_x1: 0.2,
        release_y1: 1,
        release_x2: 0.2,
        release_y2: 1,
        anchor: "center",
      },
    },
    {
      name: "Smooth press + smooth release",
      values: {
        hover_lift: -1,
        hover_scale: 1.03,
        press_mode: "squish",
        press_scale: 0.97,
        press_squish_x: 1.08,
        press_squish_y: 0.92,
        timing_press_ms: 110,
        timing_release_ms: 180,
        press_x1: 0.2,
        press_y1: 0.85,
        press_x2: 0.2,
        press_y2: 1,
        release_overshoot: false,
        release_x1: 0.2,
        release_y1: 1,
        release_x2: 0.2,
        release_y2: 1,
        anchor: "bottom",
      },
    },
    {
      name: "Smooth press + snap release (bouncy)",
      values: {
        hover_lift: -2,
        hover_scale: 1.05,
        press_mode: "squish",
        press_scale: 0.92,
        press_squish_x: 1.32,
        press_squish_y: 0.68,
        timing_press_ms: 120,
        timing_release_ms: 520,
        press_x1: 0.2,
        press_y1: 0.9,
        press_x2: 0.2,
        press_y2: 1,
        release_overshoot: true,
        release_x1: 0.28,
        release_y1: 1.8,
        release_x2: 0.55,
        release_y2: 1,
        anchor: "bottom",
      },
    },
    {
      name: "Subtle bounce",
      values: {
        hover_lift: -2,
        hover_scale: 1.05,
        press_mode: "squish",
        press_scale: 0.94,
        press_squish_x: 1.14,
        press_squish_y: 0.84,
        timing_press_ms: 120,
        timing_release_ms: 320,
        press_x1: 0.2,
        press_y1: 0.9,
        press_x2: 0.2,
        press_y2: 1,
        release_overshoot: true,
        release_x1: 0.34,
        release_y1: 1.35,
        release_x2: 0.64,
        release_y2: 1,
        anchor: "bottom",
      },
    },
    {
      name: "Extreme bounce",
      values: {
        hover_lift: -4,
        hover_scale: 1.12,
        press_mode: "squish",
        press_scale: 0.86,
        press_squish_x: 1.32,
        press_squish_y: 0.68,
        timing_press_ms: 150,
        timing_release_ms: 700,
        press_x1: 0.18,
        press_y1: 0.92,
        press_x2: 0.2,
        press_y2: 1,
        release_overshoot: true,
        release_x1: 0.22,
        release_y1: 2.2,
        release_x2: 0.6,
        release_y2: 1,
        anchor: "bottom",
      },
    },
  ],

  renderPreview: (values) => {
    const pressEase = `cubic-bezier(${values.press_x1}, ${values.press_y1}, ${values.press_x2}, ${values.press_y2})`;
    const releaseEase = values.release_overshoot
      ? `cubic-bezier(${values.release_x1}, ${values.release_y1}, ${values.release_x2}, ${values.release_y2})`
      : "cubic-bezier(0.2, 1, 0.2, 1)";

    const originMap: Record<string, string> = {
      center: "50% 50%",
      top: "50% 0%",
      bottom: "50% 100%",
      left: "0% 50%",
      right: "100% 50%",
    };

    const pressMode = values.press_mode as string;
    const anchor = values.anchor as string;

    const buttonStyle: React.CSSProperties = {
      "--hover-lift": `${values.hover_lift}px`,
      "--hover-scale": String(values.hover_scale),
      "--press-scale": String(values.press_scale),
      "--squish-x": String(values.press_squish_x),
      "--squish-y": String(values.press_squish_y),
      "--t-press": `${values.timing_press_ms}ms`,
      "--t-release": `${values.timing_release_ms}ms`,
      "--ease-press": pressEase,
      "--ease-release": releaseEase,
      transformOrigin: originMap[anchor] ?? originMap.center,
    } as React.CSSProperties;

    return (
      <button
        type="button"
        className="ml-button"
        data-press-mode={pressMode}
        style={buttonStyle}
      >
        <style>{buttonPreviewCss}</style>
        Click me
      </button>
    );
  },

  generateCss: (values) => {
    const pressEase = `cubic-bezier(${values.press_x1}, ${values.press_y1}, ${values.press_x2}, ${values.press_y2})`;
    const releaseEase = values.release_overshoot
      ? `cubic-bezier(${values.release_x1}, ${values.release_y1}, ${values.release_x2}, ${values.release_y2})`
      : "cubic-bezier(0.2, 1, 0.2, 1)";

    const originMap: Record<string, string> = {
      center: "50% 50%",
      top: "50% 0%",
      bottom: "50% 100%",
      left: "0% 50%",
      right: "100% 50%",
    };

    const anchor = values.anchor as string;
    const origin = originMap[anchor] ?? originMap.center;
    const pressMode = values.press_mode as string;

    const base = `/* Generated from Motion Lab - Button */

.button {
  appearance: none;
  border: 0;
  cursor: pointer;
  user-select: none;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: var(--radius);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.01em;

  color: var(--background);
  background: var(--primary);
  box-shadow: var(--shadow-lg);

  transform: translateZ(0);
  will-change: transform;
  transform-origin: ${origin};

  transition-property: transform, background, filter, box-shadow;
  transition-duration: ${values.timing_release_ms}ms, 140ms, 140ms, 140ms;
  transition-timing-function: ${releaseEase}, ease, ease, ease;

  -webkit-tap-highlight-color: transparent;
}

.button:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(${values.hover_lift}px) scale(${values.hover_scale});
}

.button:focus-visible {
  outline: none;
  box-shadow:
    var(--shadow-lg),
    0 0 0 2px var(--background),
    0 0 0 5px var(--primary);
}

.button:active:not(:disabled) {
  transition-duration: ${values.timing_press_ms}ms, 140ms, 140ms, 140ms;
  transition-timing-function: ${pressEase}, ease, ease, ease;
}
`;

    const pressRule =
      pressMode === "shrink"
        ? `.button:active:not(:disabled) {
  transform: translateY(0px) scale(${values.press_scale});
}
`
        : `.button:active:not(:disabled) {
  transform: translateY(0px) scaleX(${values.press_squish_x}) scaleY(${values.press_squish_y});
  filter: saturate(0.98);
}
`;

    const reducedMotion = `
.button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  filter: grayscale(0.2);
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
  .button:hover:not(:disabled),
  .button:active:not(:disabled) {
    transform: none;
  }
}
`;

    return `${base}${pressRule}${reducedMotion}`.trim();
  },
};

// Inline CSS for button preview (scoped to .ml-button)
const buttonPreviewCss = `
.ml-button {
  appearance: none;
  border: 0;
  cursor: pointer;
  user-select: none;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: var(--radius);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.01em;

  color: var(--background);
  background: var(--primary);
  box-shadow: var(--shadow-lg);

  transform: translateZ(0);
  will-change: transform;

  transition-property: transform, background, filter, box-shadow;
  transition-duration: var(--t-release), 140ms, 140ms, 140ms;
  transition-timing-function: var(--ease-release), ease, ease, ease;

  -webkit-tap-highlight-color: transparent;
}

.ml-button:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(var(--hover-lift)) scale(var(--hover-scale));
}

.ml-button:focus-visible {
  outline: none;
  box-shadow:
    var(--shadow-lg),
    0 0 0 2px var(--background),
    0 0 0 5px var(--primary);
}

.ml-button:active:not(:disabled) {
  transition-duration: var(--t-press), 140ms, 140ms, 140ms;
  transition-timing-function: var(--ease-press), ease, ease, ease;
}

.ml-button[data-press-mode="shrink"]:active:not(:disabled) {
  transform: translateY(0px) scale(var(--press-scale));
}

.ml-button[data-press-mode="squish"]:active:not(:disabled) {
  transform: translateY(0px) scaleX(var(--squish-x)) scaleY(var(--squish-y));
  filter: saturate(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .ml-button {
    transition: none;
  }
  .ml-button:hover:not(:disabled),
  .ml-button:active:not(:disabled) {
    transform: none;
  }
}
`;
