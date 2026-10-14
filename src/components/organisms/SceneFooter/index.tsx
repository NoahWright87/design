"use client";
import * as React from "react";
import "../Footer/footer.css";
import "./sceneFooter.css";
import { FooterContent } from "../Footer/FooterContent.js";
import { startScene, type SceneSource, type SceneController } from "./controller.js";
import { createSceneEffects, subscribeSceneEffects, DEFAULT_FIREWORKS_PARTICLE_LIMIT, type SceneEffects } from "./effects.js";
import { getFooterStyle, subscribeFooterStyle, type FooterStyle } from "../../../styles/footerStyle.js";
import { BUILT_IN_SCENES, isBuiltInScene } from "./scenes/index.js";

export type { FooterScene, SceneContext, SceneInstance, SceneLayout, SceneLoader, SceneQuality, SceneState, SceneTheme } from "./types.js";
export type { BuiltInSceneId } from "./scenes/index.js";
export type { HorizonSceneOptions } from "./scenes/horizon.js";
export { createSceneEffects } from "./effects.js";
export type { FireworkEffect, SceneEffect, SceneEffects } from "./effects.js";

/** A stable, SSR-safe event handle that can be shared with activity components. */
export function useSceneEffects(): SceneEffects {
  const [effects] = React.useState(createSceneEffects);
  return effects;
}

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
  /** Stable handle for temporary effects; event delivery never changes sceneOptions or restarts the scene. */
  effects?: SceneEffects;
  /** Requested automatic Horizon shells per second. Default 0 (off); paced by the scene's frame rate. */
  fireworksFrequency?: number;
  /** Total pooled Horizon particle limit. Default 2048. New shots replace oldest particles; updates preserve the scene. */
  fireworksParticleLimit?: number;
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
 * What a reader's override means for this footer. `static` keeps the CSS version, `flat` and
 * `animated` ask for motion (with the matching water renderer) even where the site said not to,
 * and `auto` leaves the site's own props alone.
 */
function planScene(
  override: FooterStyle,
  animate: boolean,
  options: Record<string, unknown>,
): { animate: boolean; options: Record<string, unknown>; force: boolean } {
  switch (override) {
    case "static":
      return { animate: false, options, force: false };
    case "flat":
      return { animate: true, options: { ...options, renderer: "2d" }, force: true };
    case "animated":
      return { animate: true, options: { ...options, renderer: "webgl" }, force: true };
    default:
      return { animate, options, force: false };
  }
}

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
  effects,
  fireworksFrequency = 0,
  fireworksParticleLimit = DEFAULT_FIREWORKS_PARTICLE_LIMIT,
  animate = true,
  skyHeight,
  seaHeight,
  className,
}: SceneFooterProps) {
  const rootRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const controllerRef = React.useRef<SceneController | null>(null);
  const frequencyRef = React.useRef(fireworksFrequency);
  const particleLimitRef = React.useRef(fireworksParticleLimit);
  const optionsKey = JSON.stringify(sceneOptions ?? {});

  React.useEffect(() => {
    particleLimitRef.current = fireworksParticleLimit;
    controllerRef.current?.setFireworksParticleLimit(fireworksParticleLimit);
  }, [fireworksParticleLimit]);

  React.useEffect(() => {
    frequencyRef.current = fireworksFrequency;
    controllerRef.current?.setFireworksFrequency(fireworksFrequency);
  }, [fireworksFrequency]);

  React.useEffect(() => {
    if (!effects) return;
    return subscribeSceneEffects(effects, (effect) => controllerRef.current?.trigger(effect) ?? false);
  }, [effects]);

  React.useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || !scene) return;

    let stop: () => void = () => {};
    // The reader's override (see `footerStyle`) is read here, not in render, so the server markup
    // never depends on it and a stored choice is applied before the scene can start.
    const apply = (override: FooterStyle) => {
      stop();
      stop = () => {};
      controllerRef.current = null;
      const plan = planScene(override, animate, JSON.parse(optionsKey));
      if (plan.animate) {
        const controller = startScene({ root, stage, scene, options: plan.options, force: plan.force });
        controllerRef.current = controller;
        controller.setFireworksParticleLimit(particleLimitRef.current);
        controller.setFireworksFrequency(frequencyRef.current);
        stop = controller;
      }
    };
    apply(getFooterStyle());
    const unsubscribe = subscribeFooterStyle(apply);
    return () => {
      unsubscribe();
      stop();
      controllerRef.current = null;
    };
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
