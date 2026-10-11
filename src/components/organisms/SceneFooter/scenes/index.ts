import type * as React from "react";
import type { SceneLoader } from "../types.js";
import { horizonStaticStyle } from "./horizonStatic.js";

type BuiltInScene = {
  /** Loads the scene code on demand. Each scene is its own chunk, so unused scenes cost nothing. */
  load: SceneLoader;
  /** Inline custom properties for the scene's CSS-only look. */
  staticStyle?: (options: Record<string, unknown>) => React.CSSProperties;
};

export const BUILT_IN_SCENES = {
  horizon: { load: () => import("./horizon.js").then((m) => m.scene), staticStyle: horizonStaticStyle },
} satisfies Record<string, BuiltInScene>;

export type BuiltInSceneId = keyof typeof BUILT_IN_SCENES;

export function isBuiltInScene(value: unknown): value is BuiltInSceneId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(BUILT_IN_SCENES, value);
}
