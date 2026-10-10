"use client";
import * as React from "react";
import "../Footer/footer.css";
import "./sceneFooter.css";
import { FooterContent } from "../Footer/FooterContent.js";
import { startScene, type SceneSource } from "./controller.js";
import { BUILT_IN_SCENES, isBuiltInScene } from "./scenes/index.js";

export type { FooterScene, SceneContext, SceneInstance, SceneLayout, SceneLoader, SceneQuality, SceneState, SceneTheme } from "./types.js";
export type { BuiltInSceneId } from "./scenes/index.js";
export type { HorizonSceneOptions } from "./scenes/horizon.js";

export type SceneFooterProps = {
  /** Content for the left slot. */
  left?: React.ReactNode;
  /** Content for the center slot. */
  center?: React.ReactNode;
  /** Content for the right slot. */
  right?: React.ReactNode;
  /** Bottom strip content (legal text, copyright, etc.). Only rendered when populated. */
  bottom?: React.ReactNode;
  /** Border between the main area and the bottom slot. */
  hasBottomSeparator?: boolean;
  /** Fallback children for simple/unslotted usage. Ignored when any slot prop is provided. */
  children?: React.ReactNode;
  /**
   * The effect that plays behind the footer as it scrolls into view.
   *  - a built-in id (`"horizon"`),
   *  - a loader for your own scene (`() => import("./my-scene")`), or
   *  - a scene object (bundled eagerly; prefer a loader).
   * `null` gives the plain footer panel with no effect. Pass a stable reference.
   */
  scene?: SceneSource | null;
  /** Options handed to the scene (for `"horizon"`: see `HorizonSceneOptions`). */
  sceneOptions?: Record<string, unknown>;
  /**
   * `false` shows only the CSS version of the scene: no scene code is ever loaded.
   * Use it on pages that are already busy.
   */
  animate?: boolean;
  /** Height of the sky band above the sea (any CSS length). */
  skyHeight?: string;
  /** Minimum height of the sea panel that holds the footer content (any CSS length). */
  seaHeight?: string;
  className?: string;
};

/**
 * A footer that is also a stage. The server renders a complete, good-looking footer with CSS alone;
 * when the footer nears the viewport, a scene (an animated canvas effect) is loaded and fades in over it.
 * The scene never loads for reduced-motion, save-data or low-end devices, and any failure leaves the
 * CSS footer in place. It is a taller alternative to `Footer`, not a replacement.
 */
export function SceneFooter({
  left,
  center,
  right,
  bottom,
  hasBottomSeparator = false,
  children,
  scene = "horizon",
  sceneOptions,
  animate = true,
  skyHeight,
  seaHeight,
  className,
}: SceneFooterProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const optionsKey = JSON.stringify(sceneOptions ?? {});

  React.useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || !scene || !animate) return;
    return startScene({ root, stage, scene, options: JSON.parse(optionsKey) });
  }, [scene, animate, optionsKey]);

  const options = sceneOptions ?? {};
  const style: React.CSSProperties = {
    ...(isBuiltInScene(scene) ? BUILT_IN_SCENES[scene].staticStyle?.(options) : undefined),
    ...(skyHeight ? { ["--nw-scene-sky-height" as string]: skyHeight } : undefined),
    ...(seaHeight ? { ["--nw-scene-sea-height" as string]: seaHeight } : undefined),
  };

  return (
    <footer
      ref={rootRef}
      className={`nw-scene-footer${className ? ` ${className}` : ""}`}
      data-scene={isBuiltInScene(scene) ? scene : undefined}
      style={style}
    >
      <div className="nw-scene-footer__static" aria-hidden="true">
        <div className="nw-scene-footer__static-sky" />
        <div className="nw-scene-footer__static-sea" />
      </div>
      <div className="nw-scene-footer__sky" aria-hidden="true" />
      <div className="nw-scene-footer__sea">
        <div className="nw-scene-footer__content">
          <FooterContent
            left={left}
            center={center}
            right={right}
            bottom={bottom}
            hasBottomSeparator={hasBottomSeparator}
          >
            {children}
          </FooterContent>
        </div>
      </div>
      <div className="nw-scene-footer__stage" ref={stageRef} aria-hidden="true" />
    </footer>
  );
}

export default SceneFooter;
