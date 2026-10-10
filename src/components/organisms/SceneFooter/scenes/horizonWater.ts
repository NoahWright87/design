import { rgba, type RGB } from "../color.js";

/**
 * The water half of the Horizon scene. The scene paints the whole sky (stars, sun, moon, glow,
 * clouds, anything added later) onto one surface; a `Water` renderer mirrors that surface into the
 * sea. Because it mirrors the finished sky, everything in the sky is reflected, once.
 *
 * Two renderers share this interface: a flat 2D mirror (this file, works everywhere, cheap) and a
 * WebGL shader with a ripple (`horizonGl.ts`, a separate chunk loaded only when WebGL is usable).
 */

/** What a renderer needs to know about the current frame, in CSS pixels. */
export type FrameState = {
  width: number;
  /** Height of the sky band; the horizon sits at its bottom edge. */
  horizon: number;
  waterHeight: number;
  /** Strength of each body, 0..1 (the sun and moon trade places during a theme change). */
  sunE: number;
  moonE: number;
  /** Horizontal centers and radii of the bodies. */
  sunX: number;
  moonX: number;
  sunR: number;
  moonR: number;
  sun: RGB;
  sunLight: RGB;
  moon: RGB;
};

export type Water = {
  kind: "2d" | "webgl";
  /** The canvas to show. The scene positions it; the renderer owns what is drawn on it. */
  el: HTMLCanvasElement;
  /** `scale` is canvas pixels per CSS pixel. */
  resize(width: number, waterHeight: number, scale: number): void;
  /** Draw the reflection of `sky` for this frame. `time` is in seconds. */
  draw(time: number, frame: FrameState, sky: HTMLCanvasElement): void;
  destroy(): void;
};

/** Reflection height per sky height. 1 is a true mirror; a little more reads as calm, long water. */
export const STRETCH = 1.3;
/** Reflection strength at the horizon (0..1). */
export const REFLECTION = 0.6;
/** How much of the reflection is lost by the bottom of the sea. */
export const DEPTH_FADE = 0.7;

export const canvasStyle = "position:absolute;left:0;width:100%;display:block;pointer-events:none";

/** The fallback: the sky drawn once, flipped and stretched, faded with depth. No ripple. */
export function makeMirror2d(): Water {
  const el = document.createElement("canvas");
  el.style.cssText = canvasStyle;
  el.dataset.renderer = "2d";
  el.setAttribute("aria-hidden", "true");
  const g = el.getContext("2d");
  if (!g) throw new Error("2D canvas is unavailable");
  let scale = 1;

  return {
    kind: "2d",
    el,

    resize(width, waterHeight, s) {
      scale = s;
      el.width = Math.max(1, Math.round(width * s));
      el.height = Math.max(1, Math.round(waterHeight * s));
    },

    draw(_time, f, sky) {
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = "source-over";
      g.clearRect(0, 0, el.width, el.height);
      if (f.waterHeight <= 0 || sky.width <= 0 || f.horizon <= 0) return;

      const ss = sky.width / f.width; // sky canvas pixels per CSS pixel
      const sh = Math.min(f.horizon, f.waterHeight / STRETCH); // sky rows that fit in the sea
      const srcY = Math.max(0, Math.min(sky.height - 1, (f.horizon - sh) * ss));
      const srcH = Math.min(sky.height - srcY, sh * ss);

      // the sky rows nearest the horizon, flipped, so the horizon is the mirror line
      g.setTransform(scale, 0, 0, scale, 0, 0);
      g.save();
      g.scale(1, -STRETCH);
      g.drawImage(sky, 0, srcY, sky.width, srcH, 0, -sh, f.width, sh);
      g.restore();

      // fade with depth, and dim the whole reflection
      g.globalCompositeOperation = "destination-out";
      const fade = g.createLinearGradient(0, 0, 0, f.waterHeight);
      fade.addColorStop(0, `rgba(0,0,0,${1 - REFLECTION})`);
      fade.addColorStop(1, `rgba(0,0,0,${1 - REFLECTION * (1 - DEPTH_FADE)})`);
      g.fillStyle = fade;
      g.fillRect(0, 0, f.width, f.waterHeight);

      // sunlit water just below the horizon, under the reflection
      g.globalCompositeOperation = "destination-over";
      if (f.sunE > 0.002) {
        const lit = g.createLinearGradient(0, 0, 0, f.waterHeight * 0.45);
        lit.addColorStop(0, rgba(f.sun, 0.2 * f.sunE));
        lit.addColorStop(1, rgba(f.sun, 0));
        g.fillStyle = lit;
        g.fillRect(0, 0, f.width, f.waterHeight * 0.45);
      }

      // bright seam along the horizon
      g.globalCompositeOperation = "source-over";
      const seams: Array<[number, number, RGB, number]> = [
        [f.sunX, f.sunR, f.sunLight, f.sunE],
        [f.moonX, f.moonR, f.moon, f.moonE],
      ];
      for (const [x, r, color, e] of seams) {
        if (e < 0.002) continue;
        const span = r * 6;
        const line = g.createLinearGradient(x - span, 0, x + span, 0);
        line.addColorStop(0, rgba(color, 0));
        line.addColorStop(0.5, rgba(color, 0.7 * e));
        line.addColorStop(1, rgba(color, 0));
        g.fillStyle = line;
        g.fillRect(x - span, 0, span * 2, 1);
      }
    },

    destroy() {
      el.remove();
    },
  };
}
