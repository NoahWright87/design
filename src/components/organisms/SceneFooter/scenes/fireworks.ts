import { clamp, mix, rgba, type RGB } from "../color.js";
import { DEFAULT_FIREWORKS_PARTICLE_LIMIT, normalizeFireworksParticleLimit, type FireworkEffect } from "../effects.js";
import type { SceneQuality } from "../types.js";

/** Quality controls each shell's detail; the consumer controls the overall pool size. */
const SPARKS: Record<SceneQuality, number> = { high: 32, medium: 24, low: 16 };
const GROUPS: Record<SceneQuality, number> = { high: 5, medium: 4, low: 3 };
type Spark = { angle: number; speed: number; life: number; stroke: string; fill: string };
type Flight = { fromX: number; x: number; y: number; apex: number; fuse: number; velocity: number; gravity: number };
type Burst = { flight: Flight; start: number; large: boolean; scale: number; aspect: number; sparks: Spark[] };
const fraction = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? clamp(value, 0, 1) : fallback;

/** A fuse can outlast the apex: the shell then starts falling before it bursts. */
export function planLaunch(x: number, y: number, random: () => number): Flight {
  const apex = 0.8 + random() * 0.5;
  const fuse = apex * (0.8 + random() * 0.55);
  const velocity = (1 - y) / (fuse * (1 - fuse / (2 * apex)));
  const fromX = clamp(x + (random() < 0.5 ? -1 : 1) * (0.07 + random() * 0.16), 0.03, 0.97);
  return { fromX, x, y, apex, fuse, velocity, gravity: velocity / apex };
}

/** Analytic motion makes trajectories independent of frame rate and footer size. */
export function launchPoint(flight: Flight, age: number): { x: number; y: number } {
  const travel = (1 - Math.exp(-age * 0.8)) / (1 - Math.exp(-flight.fuse * 0.8));
  return {
    x: flight.fromX + (flight.x - flight.fromX) * travel,
    y: 1 - flight.velocity * age + 0.5 * flight.gravity * age * age,
  };
}

/** Saturated celebration colors are independent of the sun/moon and the app's theme. */
const hueColor = (hue: number): RGB => {
  const channel = (offset: number) => {
    const k = (offset + hue / 30) % 12;
    return Math.round(255 * (0.6 - 0.36 * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return [channel(0), channel(8), channel(4)];
};

/** Local state only: automatic launches share the scene's frame loop, with no timers or assets. */
export function createFireworks(random: () => number = Math.random) {
  let bursts: Burst[] = [];
  let available: Spark[] = [];
  let particleCount = 0;
  let particleLimit = DEFAULT_FIREWORKS_PARTICLE_LIMIT;
  let destroyed = false;
  let frequency = 0;
  let nextLaunch: number | undefined;
  const recycle = (spark: Spark) => { available.push(spark); particleCount--; };
  const clear = () => {
    for (const burst of bursts) for (const spark of burst.sparks) recycle(spark);
    bursts.length = 0;
    nextLaunch = undefined;
  };
  const evict = (target: number) => {
    let removed = 0;
    while (particleCount > target) {
      const oldest = bursts[removed];
      const count = Math.min(particleCount - target, oldest.sparks.length);
      for (let i = 0; i < count; i++) recycle(oldest.sparks[i]);
      oldest.sparks.copyWithin(0, count);
      oldest.sparks.length -= count;
      if (!oldest.sparks.length) removed++;
    }
    if (removed) bursts.splice(0, removed);
  };
  const prune = (time: number) => {
    let kept = 0;
    for (const burst of bursts) {
      const age = time - burst.start - burst.flight.fuse;
      let live = 0;
      for (const spark of burst.sparks) {
        if (age >= spark.life) recycle(spark);
        else burst.sparks[live++] = spark;
      }
      burst.sparks.length = live;
      if (live) bursts[kept++] = burst;
    }
    bursts.length = kept;
  };

  return {
    get particleCount() { return particleCount; },
    get retainedParticleCount() { return particleCount + available.length; },
    clear,
    setParticleLimit(value: number) {
      if (destroyed) return;
      particleLimit = normalizeFireworksParticleLimit(value);
      evict(particleLimit);
      available.length = Math.min(available.length, particleLimit - particleCount);
    },
    destroy() {
      destroyed = true;
      bursts.length = available.length = particleCount = 0;
      frequency = 0;
      nextLaunch = undefined;
    },
    setFrequency(value: number) {
      if (destroyed) return;
      const next = Number.isFinite(value) ? Math.max(0, value) : 0;
      if (frequency === next) return;
      frequency = next;
      nextLaunch = undefined;
    },
    update(time: number, quality: SceneQuality) {
      prune(time);
      if (!frequency) return;
      if (nextLaunch === undefined) {
        nextLaunch = time + (0.65 + random() * 0.7) / frequency;
      } else if (time >= nextLaunch) {
        // Schedule from now, never catch up missed launches after a pause or slow frame.
        nextLaunch = time + (0.65 + random() * 0.7) / frequency;
        this.add({ type: "firework" }, time, quality);
      }
    },
    add(effect: FireworkEffect, time: number, quality: SceneQuality, color?: RGB): boolean {
      if (destroyed) return false;
      prune(time);
      const large = effect.size === "large";
      const sparks = Math.min(SPARKS[quality], particleLimit);
      const groups = Math.min(large ? GROUPS[quality] : 1, Math.floor(particleLimit / sparks));
      // Reserve the whole incoming celebration by recycling older particles, including pending launches.
      evict(particleLimit - groups * sparks);
      const x = fraction(effect.position?.x, 0.12 + random() * 0.76);
      const y = fraction(effect.position?.y, 0.32 + random() * 0.34);
      let delay = 0;
      for (let group = 0; group < groups; group++) {
        const hue = random() * 360;
        const colors = color ? [color] : [hueColor(hue), hueColor((hue + 60) % 360), hueColor((hue + 170) % 360)];
        bursts.push({
          flight: planLaunch(
            clamp(x + (large ? (random() - 0.5) * 0.36 : 0), 0, 1),
            clamp(y + (large ? (random() - 0.5) * 0.22 : 0), 0, 1), random),
          start: time + delay,
          large,
          scale: 0.55 + random() * 1.1,
          aspect: 0.75 + random() * 0.5,
          sparks: Array.from({ length: sparks }, (_, i) => {
            const color = colors[i % colors.length];
            const spark = available.pop() ?? { angle: 0, speed: 0, life: 0, stroke: "", fill: "" };
            spark.angle = i / sparks * Math.PI * 2 + (random() - 0.5) * 0.15;
            spark.speed = 0.65 + random() * 0.65;
            spark.life = 1.3 + random() * 0.9;
            spark.stroke = rgba(color);
            spark.fill = rgba(mix(color, [255, 255, 255], 0.25));
            particleCount++;
            return spark;
          }),
        });
        delay += 0.16 + random() * 0.18;
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
        const flight = burst.flight;
        const cx = flight.x * width;
        const cy = flight.y * horizon;
        const radius = Math.min(width * 0.2, horizon * (burst.large ? 0.34 : 0.23), burst.large ? 80 : 48) * burst.scale;
        if (age < flight.fuse) {
          g.strokeStyle = burst.sparks[0].stroke;
          g.globalAlpha = 0.85;
          g.lineWidth = 2;
          g.beginPath();
          for (let segment = 0; segment <= 5; segment++) {
            const point = launchPoint(flight, Math.max(0, age - (5 - segment) * 0.025));
            if (segment === 0) g.moveTo(point.x * width, point.y * horizon);
            else g.lineTo(point.x * width, point.y * horizon);
          }
          g.stroke();
          continue;
        }
        const t = age - flight.fuse;
        for (const spark of burst.sparks) {
          if (t >= spark.life) continue;
          const distance = radius * spark.speed * (1 - Math.exp(-t * 2.6));
          const gravity = radius * t * t * 0.22;
          const dx = Math.cos(spark.angle);
          const dy = Math.sin(spark.angle);
          const x = cx + dx * distance;
          const y = cy + dy * distance * burst.aspect + gravity
            + (-flight.velocity + flight.gravity * flight.fuse) * horizon * t * 0.16;
          g.globalAlpha = Math.pow(1 - t / spark.life, 1.3);
          g.strokeStyle = spark.stroke;
          g.fillStyle = spark.fill;
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
