import * as React from "react";
import type { MotionAdapter } from "../types";

export const modalMotionAdapter: MotionAdapter = {
  id: "modal",
  displayName: "Modal",

  knobs: [
    // Enter animation
    { id: "enter_opacity_start", label: "Opacity start", type: "range", defaultValue: 0, min: 0, max: 1, step: 0.05 },
    { id: "enter_scale_start", label: "Scale start", type: "range", defaultValue: 0.9, min: 0.5, max: 1.5, step: 0.05 },
    { id: "enter_y_start", label: "Y offset (px)", type: "range", defaultValue: 20, min: -100, max: 100, step: 5 },
    { id: "enter_duration_ms", label: "Duration (ms)", type: "range", defaultValue: 280, min: 0, max: 1000, step: 20 },

    // Enter easing (cubic-bezier)
    { id: "enter_x1", label: "x1", type: "range", defaultValue: 0.16, min: 0, max: 1, step: 0.01 },
    { id: "enter_y1", label: "y1", type: "range", defaultValue: 1, min: -2, max: 3, step: 0.01 },
    { id: "enter_x2", label: "x2", type: "range", defaultValue: 0.3, min: 0, max: 1, step: 0.01 },
    { id: "enter_y2", label: "y2", type: "range", defaultValue: 1, min: -2, max: 3, step: 0.01 },

    // Exit animation
    { id: "exit_opacity_end", label: "Opacity end", type: "range", defaultValue: 0, min: 0, max: 1, step: 0.05 },
    { id: "exit_scale_end", label: "Scale end", type: "range", defaultValue: 0.95, min: 0.5, max: 1.5, step: 0.05 },
    { id: "exit_y_end", label: "Y offset (px)", type: "range", defaultValue: -10, min: -100, max: 100, step: 5 },
    { id: "exit_duration_ms", label: "Duration (ms)", type: "range", defaultValue: 220, min: 0, max: 1000, step: 20 },

    // Exit easing (cubic-bezier)
    { id: "exit_x1", label: "x1", type: "range", defaultValue: 0.7, min: 0, max: 1, step: 0.01 },
    { id: "exit_y1", label: "y1", type: "range", defaultValue: 0, min: -2, max: 3, step: 0.01 },
    { id: "exit_x2", label: "x2", type: "range", defaultValue: 0.84, min: 0, max: 1, step: 0.01 },
    { id: "exit_y2", label: "y2", type: "range", defaultValue: 0, min: -2, max: 3, step: 0.01 },

    // Backdrop
    { id: "backdrop_opacity", label: "Backdrop opacity", type: "range", defaultValue: 0.7, min: 0, max: 1, step: 0.05 },
    { id: "backdrop_blur", label: "Backdrop blur (px)", type: "range", defaultValue: 4, min: 0, max: 20, step: 1 },
  ],

  presets: [
    {
      name: "No motion",
      category: "Professional",
      values: {
        enter_opacity_start: 1,
        enter_scale_start: 1,
        enter_y_start: 0,
        enter_duration_ms: 0,
        enter_x1: 0.2,
        enter_y1: 1,
        enter_x2: 0.2,
        enter_y2: 1,
        exit_opacity_end: 1,
        exit_scale_end: 1,
        exit_y_end: 0,
        exit_duration_ms: 0,
        exit_x1: 0.2,
        exit_y1: 1,
        exit_x2: 0.2,
        exit_y2: 1,
        backdrop_opacity: 0.7,
        backdrop_blur: 0,
      },
    },
    {
      name: "Fade + scale",
      category: "Professional",
      values: {
        enter_opacity_start: 0,
        enter_scale_start: 0.9,
        enter_y_start: 0,
        enter_duration_ms: 280,
        enter_x1: 0.16,
        enter_y1: 1,
        enter_x2: 0.3,
        enter_y2: 1,
        exit_opacity_end: 0,
        exit_scale_end: 0.95,
        exit_y_end: 0,
        exit_duration_ms: 220,
        exit_x1: 0.7,
        exit_y1: 0,
        exit_x2: 0.84,
        exit_y2: 0,
        backdrop_opacity: 0.7,
        backdrop_blur: 4,
      },
    },
    {
      name: "Slide up",
      category: "Professional",
      values: {
        enter_opacity_start: 0,
        enter_scale_start: 1,
        enter_y_start: 40,
        enter_duration_ms: 320,
        enter_x1: 0.16,
        enter_y1: 1,
        enter_x2: 0.3,
        enter_y2: 1,
        exit_opacity_end: 0,
        exit_scale_end: 1,
        exit_y_end: -20,
        exit_duration_ms: 240,
        exit_x1: 0.7,
        exit_y1: 0,
        exit_x2: 0.84,
        exit_y2: 0,
        backdrop_opacity: 0.75,
        backdrop_blur: 6,
      },
    },
    {
      name: "Bounce in",
      category: "Playful",
      values: {
        enter_opacity_start: 0,
        enter_scale_start: 0.7,
        enter_y_start: 20,
        enter_duration_ms: 500,
        enter_x1: 0.34,
        enter_y1: 1.56,
        enter_x2: 0.64,
        enter_y2: 1,
        exit_opacity_end: 0,
        exit_scale_end: 0.9,
        exit_y_end: 10,
        exit_duration_ms: 200,
        exit_x1: 0.7,
        exit_y1: 0,
        exit_x2: 0.84,
        exit_y2: 0,
        backdrop_opacity: 0.8,
        backdrop_blur: 8,
      },
    },
    {
      name: "Dramatic entrance",
      category: "Extreme",
      values: {
        enter_opacity_start: 0,
        enter_scale_start: 0.5,
        enter_y_start: 60,
        enter_duration_ms: 600,
        enter_x1: 0.22,
        enter_y1: 2.2,
        enter_x2: 0.6,
        enter_y2: 1,
        exit_opacity_end: 0,
        exit_scale_end: 0.85,
        exit_y_end: -30,
        exit_duration_ms: 300,
        exit_x1: 0.7,
        exit_y1: 0,
        exit_x2: 0.84,
        exit_y2: 0,
        backdrop_opacity: 0.85,
        backdrop_blur: 12,
      },
    },
  ],

  renderPreview: (values) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const enterEase = `cubic-bezier(${values.enter_x1}, ${values.enter_y1}, ${values.enter_x2}, ${values.enter_y2})`;
    const exitEase = `cubic-bezier(${values.exit_x1}, ${values.exit_y1}, ${values.exit_x2}, ${values.exit_y2})`;

    const containerStyle: React.CSSProperties = {
      "--enter-opacity-start": String(values.enter_opacity_start),
      "--enter-scale-start": String(values.enter_scale_start),
      "--enter-y-start": `${values.enter_y_start}px`,
      "--enter-duration": `${values.enter_duration_ms}ms`,
      "--enter-easing": enterEase,
      "--exit-opacity-end": String(values.exit_opacity_end),
      "--exit-scale-end": String(values.exit_scale_end),
      "--exit-y-end": `${values.exit_y_end}px`,
      "--exit-duration": `${values.exit_duration_ms}ms`,
      "--exit-easing": exitEase,
      "--backdrop-opacity": String(values.backdrop_opacity),
      "--backdrop-blur": `${values.backdrop_blur}px`,
    } as React.CSSProperties;

    return (
      <div>
        <style>{modalPreviewCss}</style>
        <button
          type="button"
          className="ml-modal-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close Modal" : "Open Modal"}
        </button>

        {isOpen && (
          <div className="ml-modal-backdrop" style={containerStyle} onClick={() => setIsOpen(false)}>
            <div className="ml-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="ml-modal-header">
                <div className="ml-modal-title">Modal Preview</div>
                <button
                  type="button"
                  className="ml-modal-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="ml-modal-content">
                This is a live modal preview. Adjust the controls to see motion changes in real-time.
              </div>
              <div className="ml-modal-actions">
                <button
                  type="button"
                  className="ml-modal-action"
                  onClick={() => setIsOpen(false)}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },

  generateCss: (values) => {
    const enterEase = `cubic-bezier(${values.enter_x1}, ${values.enter_y1}, ${values.enter_x2}, ${values.enter_y2})`;
    const exitEase = `cubic-bezier(${values.exit_x1}, ${values.exit_y1}, ${values.exit_x2}, ${values.exit_y2})`;

    const backdropOpacityPercent = (values.backdrop_opacity as number) * 100;
    
    return `/* Generated from Motion Lab - Modal */

.modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--foreground) ${backdropOpacityPercent}%, transparent);
  backdrop-filter: blur(${values.backdrop_blur}px);
  z-index: 1000;
  
  animation: fade-in ${values.enter_duration_ms}ms ${enterEase};
}

.modal-backdrop.is-exiting {
  animation: fade-out ${values.exit_duration_ms}ms ${exitEase};
}

.modal-container {
  background: var(--background);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  max-width: 32rem;
  width: 90%;
  padding: var(--spacing-lg);
  
  animation: modal-enter ${values.enter_duration_ms}ms ${enterEase};
}

.modal-backdrop.is-exiting .modal-container {
  animation: modal-exit ${values.exit_duration_ms}ms ${exitEase};
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes modal-enter {
  from {
    opacity: ${values.enter_opacity_start};
    transform: translateY(${values.enter_y_start}px) scale(${values.enter_scale_start});
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modal-exit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: ${values.exit_opacity_end};
    transform: translateY(${values.exit_y_end}px) scale(${values.exit_scale_end});
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-backdrop,
  .modal-container {
    animation: none;
  }
}
`.trim();
  },
};

// Inline CSS for modal preview
const modalPreviewCss = `
.ml-modal-trigger {
  appearance: none;
  border: 0;
  cursor: pointer;
  border-radius: var(--radius);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--background);
  background: var(--primary);
  box-shadow: var(--shadow-md);
}

.ml-modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--foreground) calc(var(--backdrop-opacity) * 100%), transparent);
  backdrop-filter: blur(var(--backdrop-blur));
  z-index: 9999;
  
  animation: ml-fade-in var(--enter-duration) var(--enter-easing);
}

.ml-modal-container {
  background: var(--background);
  border: 1px solid color-mix(in srgb, var(--foreground) 18%, transparent);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  max-width: 28rem;
  width: 90%;
  
  animation: ml-modal-enter var(--enter-duration) var(--enter-easing);
}

.ml-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: var(--spacing-md);
  border-bottom: 1px solid color-mix(in srgb, var(--foreground) 14%, transparent);
}

.ml-modal-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--foreground);
}

.ml-modal-close {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--foreground);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 140ms ease;
}

.ml-modal-close:hover {
  opacity: 1;
}

.ml-modal-content {
  padding: var(--spacing-md);
  color: var(--foreground);
  opacity: 0.9;
  line-height: 1.5;
}

.ml-modal-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  padding: var(--spacing-md);
  border-top: 1px solid color-mix(in srgb, var(--foreground) 14%, transparent);
}

.ml-modal-action {
  appearance: none;
  border: 0;
  cursor: pointer;
  border-radius: calc(var(--radius) * 0.75);
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--background);
  background: var(--primary);
}

@keyframes ml-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ml-modal-enter {
  from {
    opacity: var(--enter-opacity-start);
    transform: translateY(var(--enter-y-start)) scale(var(--enter-scale-start));
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ml-modal-backdrop,
  .ml-modal-container {
    animation: none;
  }
}
`;
