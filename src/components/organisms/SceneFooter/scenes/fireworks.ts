import { clamp, rgba, type RGB } from "../color.js";
import type { FireworkEffect } from "../effects.js";
import type { SceneQuality } from "../types.js";

/** Includes particles in staggered launches, so a rapid event stream cannot grow a pending pool. */
const LIMIT: Record<SceneQuality, number> = { high: 256, medium: 144, low: 64 };
const SPARKS: Record<SceneQuality, number> = { high: 32, medium: 24, low: 16 };
const GROUPS: Record<SceneQuality, number> = { high: 5, medium: 4, low: 3 };
const LAUNCH = 0.28;
type Spark = { angle: number; speed: number; life: number };
type Burst = { x: number; y: number; start: number; large: boolean; color: RGB; sparks: Spark[] };
const fraction = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? clamp(value, 0, 1) : fallback;

/** Local particle state only: no timers, assets, DOM, or independent animation loop. */
export function createFireworks(random: () => number = Math.random) {
  let bursts: Burst[] = [];
  const clear = () => { bursts = []; };
  const count = () => bursts.reduce((sum, burst) => sum + burst.sparks.length, 0);
  const prune = (time: number) => {
    bursts = bursts.filter((burst) => time - burst.start < LAUNCH + 1.8);
  };

  return {
    get particleCount() { return count(); },
    clear,
    /** Quality reductions trim the pool immediately, including launches still in progress. */
    setQuality(quality: SceneQuality) {
      while (count() > LIMIT[quality]) bursts.shift();
    },
    add(effect: FireworkEffect, time: number, quality: SceneQuality, color: RGB): boolean {
      prune(time);
      const large = effect.size === "large";
      const sparks = SPARKS[quality];
      const groups = Math.min(large ? GROUPS[quality] : 1, Math.floor((LIMIT[quality] - count()) / sparks));
      if (groups <= 0) return false;
      const x = fraction(effect.position?.x, 0.5);
      const y = fraction(effect.position?.y, 0.55);
      for (let group = 0; group < groups; group++) {
        bursts.push({
          x: clamp(x + (large ? (group - (groups - 1) / 2) * 0.11 : 0), 0, 1),
          y: clamp(y + (large ? (random() - 0.5) * 0.16 : 0), 0, 1),
          start: time + group * 0.12,
          large,
          color,
          sparks: Array.from({ length: sparks }, (_, i) => ({
            angle: i / sparks * Math.PI * 2 + (random() - 0.5) * 0.15,
            speed: 0.65 + random() * 0.65,
            life: 1.15 + random() * 0.6,
          })),
        });
      }
      return true;
    },
    draw(g: CanvasRenderingContext2D, time: number, width: number, horizon: number) {
      prune(time);
      if (!bursts.length) return;
      g.save();
      // Source-over keeps colored sparks legible against a light theme as well as a night sky.
      g.globalCompositeOperation = "source-over";
      g.lineCap = "round";
      for (const burst of bursts) {
        const age = time - burst.start;
        if (age < 0) continue;
        const cx = burst.x * width;
        const cy = burst.y * horizon;
        const radius = Math.min(width * 0.18, horizon * (burst.large ? 0.34 : 0.23), burst.large ? 80 : 48);
        g.fillStyle = g.strokeStyle = rgba(burst.color);
        if (age < LAUNCH) {
          const rise = 1 - Math.pow(1 - age / LAUNCH, 2);
          const y = horizon + (cy - horizon) * rise;
          g.globalAlpha = 0.85;
          g.lineWidth = 1.5;
          g.beginPath();
          g.moveTo(cx, Math.min(horizon, y + 9));
          g.lineTo(cx, y);
          g.stroke();
          continue;
        }
        const t = age - LAUNCH;
        for (const spark of burst.sparks) {
          if (t >= spark.life) continue;
          const distance = radius * spark.speed * (1 - Math.exp(-t * 2.6));
          const gravity = radius * t * t * 0.22;
          const dx = Math.cos(spark.angle);
          const dy = Math.sin(spark.angle);
          const x = cx + dx * distance;
          const y = cy + dy * distance + gravity;
          g.globalAlpha = Math.pow(1 - t / spark.life, 1.3);
          g.lineWidth = burst.large ? 1.8 : 1.4;
          g.beginPath();
          g.moveTo(x - dx * 4, y - dy * 4 - 1);
          g.lineTo(x, y);
          g.stroke();
          g.beginPath();
          g.arc(x, y, burst.large ? 1.5 : 1.2, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.restore();
    },
  };
}
