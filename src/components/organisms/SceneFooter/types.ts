import type { SceneEffect } from "./effects.js";

export type SceneTheme = "light" | "dark";

/** Rendering effort. The footer steps down on its own when frames run slow. */
export type SceneQuality = "high" | "medium" | "low";

/** Where the scene sits, in CSS pixels, relative to the scene stage. */
export type SceneLayout = {
  width: number;
  /** Full height: the sky band plus the sea. */
  height: number;
  /** Distance from the top of the stage to the horizon (the top of the sea). */
  horizon: number;
};

export type SceneContext = {
  /** Empty, absolutely positioned layer covering the whole footer. The scene adds its canvases here. */
  host: HTMLElement;
  layout: SceneLayout;
  theme: SceneTheme;
  quality: SceneQuality;
  /** Device pixel ratio at creation. */
  dpr: number;
  /** The `sceneOptions` the consumer passed to `SceneFooter`. */
  options: Record<string, unknown>;
  /**
   * Resolves the first CSS custom property in `tokens` that holds a valid color,
   * falling back to `fallback`. Any CSS color syntax the browser understands works.
   */
  readColor(tokens: string[], fallback: [number, number, number]): [number, number, number];
};

export type SceneInstance = {
  /** Live total particle budget; lower limits evict oldest particles, never reject new shots. */
  setFireworksParticleLimit?(limit: number): void;
  /** Horizon automatic launch rate; zero pauses future launches without clearing current bursts. */
  setFireworksFrequency?(frequency: number): void;
  /** Optional temporary effects. Return false when unsupported; Horizon recycles oldest particles at capacity. */
  trigger?(effect: SceneEffect): boolean;
  /** Discard temporary effects when the controller pauses or freezes the scene. */
  clearEffects?(): void;
  /** The footer changed size (or the quality changed): lay the scene out again. */
  resize(layout: SceneLayout, quality: SceneQuality): void;
  /** The page theme changed. */
  setTheme(theme: SceneTheme): void;
  /**
   * Draw if a frame is due. `time` is in seconds; `progress` runs 0..1 as the footer scrolls into view.
   * Scenes throttle themselves: calling this on every animation frame is expected.
   */
  render(time: number, progress: number): void;
  /** Remove everything the scene added and release its resources. */
  destroy(): void;
};

/** A scene is a module with a `create` function. Everything else is the scene's own business. */
export type FooterScene = {
  create(context: SceneContext): SceneInstance;
};

export type SceneModule = FooterScene | { default: FooterScene };

/** Loads a scene on demand: `() => import("./my-scene")`. */
export type SceneLoader = () => Promise<SceneModule>;

/** `loading` and `live` mean the scene code is on the page; the rest mean the CSS-only footer is showing. */
export type SceneState = "static" | "loading" | "live" | "frozen" | "failed";
