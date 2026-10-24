export interface IconSpring {
  position: number;
  velocity: number;
}

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Velocity keeps the heartbeat continuous through interrupted and reversed toggles. */
export function heartGeometry(position: number, velocity: number) {
  const fill = clamp(position);
  return {
    fillY: 21 - 18 * fill,
    fillHeight: 18 * fill,
    scale: 1 + 0.17 * Math.tanh(Math.max(0, velocity) / 7),
    drop: 0.9 * Math.tanh(Math.max(0, -velocity) / 7),
  };
}

/** Marshmallow Orbit's damped spring; retain velocity when the target reverses. */
export function stepIconSpring(state: IconSpring, target: number, elapsed: number): IconSpring {
  const dt = Math.max(0, Math.min(elapsed, 0.04));
  const steps = Math.max(1, Math.ceil(dt / 0.008));
  const h = dt / steps;
  let { position, velocity } = state;
  for (let i = 0; i < steps; i++) {
    velocity += ((target - position) * 14.5 ** 2 - 2 * 0.54 * 14.5 * velocity) * h;
    position += velocity * h;
  }
  return Math.abs(target - position) < 0.00035 && Math.abs(velocity) < 0.004
    ? { position: target, velocity: 0 }
    : { position, velocity };
}

/** Exact geometry mapping from the PR's standalone Marshmallow reference. */
export function moonSunGeometry(position: number) {
  const core = ease(position / 0.68);
  const moonOvershoot = Math.max(0, -position);
  const rays = ease((position - 0.37) / 0.63);
  const overtravel = Math.max(0, position - 1);
  const width = 6.3 * clamp(rays * 1.8);
  return {
    radius: mix(19.3, 20, core),
    cutX: mix(56.3, 58, core) - moonOvershoot * 19,
    cutY: mix(43.8, 47, core) - moonOvershoot * 3,
    cutRadius: Math.max(0, 19.4 * (1 - core) + moonOvershoot * 6),
    rayStart: 26.4 * rays + overtravel * 14,
    rayLength: Math.max(0, 13.5 * rays + overtravel * 24),
    rayWidth: width,
    rotation: -23 * (1 - rays) + overtravel * 44,
    rayOpacity: rays > 0 ? 1 : 0,
  };
}
