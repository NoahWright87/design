import type { ReactElement, ReactNode } from "react";

/**
 * Supported knob types for motion controls
 */
export type MotionKnobType = "range" | "select" | "toggle";

/**
 * Configuration for a single motion knob (control)
 */
export interface MotionKnob {
  id: string;
  label: string;
  type: MotionKnobType;
  defaultValue: number | string | boolean;
  
  // Range-specific
  min?: number;
  max?: number;
  step?: number;
  
  // Select-specific
  options?: readonly string[];
}

/**
 * A complete preset configuration
 */
export interface MotionPreset {
  name: string;
  /** Optional grouping label shown in the preset selector (e.g. "Professional", "Playful", "Extreme"). */
  category?: string;
  values: Record<string, number | string | boolean>;
}

/**
 * Current values for all knobs
 */
export type MotionValues = Record<string, number | string | boolean>;

/**
 * Component motion adapter interface
 */
export interface MotionAdapter {
  /** Unique adapter ID */
  id: string;
  
  /** Display name */
  displayName: string;
  
  /** Motion knobs (controls) */
  knobs: MotionKnob[];
  
  /** Available presets */
  presets: MotionPreset[];
  
  /** Render the component preview with current motion values */
  renderPreview: (values: MotionValues) => ReactElement;
  
  /** Generate portable CSS from current motion values */
  generateCss: (values: MotionValues) => string;
}
