export interface IconSpring {
  position: number;
  velocity: number;
}

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export interface HeartMotion {
  fill: number;
  from: number;
  target: number;
  elapsed: number;
  phase: "idle" | "fill" | "reaction";
  width: IconSpring;
  height: IconSpring;
}

export function restingHeart(target: number): HeartMotion {
  return { fill: target, from: target, target, elapsed: 0, phase: "idle", width: { position: 0, velocity: 0 }, height: { position: 0, velocity: 0 } };
}

export function targetHeart(state: HeartMotion, target: number): HeartMotion {
  return state.target === target ? state : { ...state, from: state.fill, target, elapsed: 0, phase: "fill" };
}

/** Fill completes before the reaction impulse; retargeting cancels the old pending beat. */
export function stepHeartMotion(state: HeartMotion, elapsed: number): HeartMotion {
  if (state.phase === "idle") return state;
  const dt = Math.max(0, Math.min(elapsed, 0.04));
  const width = stepIconSpring(state.width, 0, dt);
  const height = stepIconSpring(state.height, 0, dt);
  if (state.phase === "fill") {
    const time = state.elapsed + dt;
    const duration = 0.26 * Math.abs(state.target - state.from);
    if (time >= duration) {
      return {
        ...state, fill: state.target, elapsed: 0, phase: "reaction",
        width: { position: width.position, velocity: width.velocity + 1.92 },
        height: { position: height.position, velocity: height.velocity + (state.target === 1 ? 3.84 : -3.52) },
      };
    }
    return { ...state, elapsed: time, fill: mix(state.from, state.target, ease(time / duration)), width, height };
  }
  const resting = width.position === 0 && width.velocity === 0 && height.position === 0 && height.velocity === 0;
  return { ...state, width, height, phase: resting ? "idle" : "reaction" };
}

export function heartGeometry(position: number, width: number, height: number) {
  const fill = clamp(position);
  return {
    fillY: 21 - 18 * fill,
    fillHeight: 18 * fill,
    scaleX: 1 + width,
    scaleY: 1 + height,
  };
}

/** Marshmallow Orbit's damped spring; retain velocity when the target reverses. */
export function stepIconSpring(state: IconSpring, target: number, elapsed: number, omega = 14.5): IconSpring {
  const dt = Math.max(0, Math.min(elapsed, 0.04));
  const steps = Math.max(1, Math.ceil(dt / 0.008));
  const h = dt / steps;
  let { position, velocity } = state;
  for (let i = 0; i < steps; i++) {
    velocity += ((target - position) * omega ** 2 - 2 * 0.54 * omega * velocity) * h;
    position += velocity * h;
  }
  return Math.abs(target - position) < 0.00035 && Math.abs(velocity) < 0.004
    ? { position: target, velocity: 0 }
    : { position, velocity };
}

/** Continuous stages let a reversed toggle retrace the crash from its current pose. */
export function playbackGeometry(position: number) {
  const slide = ease(position / 0.18);
  const impact = ease((position - 0.18) / 0.32);
  const reboundProgress = clamp((position - 0.5) / 0.18);
  const back = (t: number) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;
  const rebound = back(reboundProgress);
  const split = Math.max(0, (position - 0.68) / 0.32);
  const overtravel = Math.max(0, position - 1);
  const emerge = split <= 1 ? back(split) : 1 + overtravel * 1.2;
  const recoil = Math.min(0, position) * 2;
  const left = position < 0.5 ? mix(6 + slide * 2 + recoil, 19.6, impact) : mix(19.6, 15, rebound);
  const right = position < 0.5 ? mix(20 + slide * 2 + recoil, 22, impact) : mix(22, 19, rebound);
  const top = position < 0.5 ? mix(4, 2, impact) : mix(2, 4, rebound) - overtravel * 4;
  const bottom = position < 0.5 ? mix(20, 22, impact) : mix(22, 20, rebound) + overtravel * 4;
  const tipTop = position < 0.5 ? mix(12, 2, impact) : top;
  const tipBottom = position < 0.5 ? mix(12, 22, impact) : bottom;
  const spawnX = mix(15, 6, emerge);
  const spawnTop = 20 - 16 * emerge;
  return {
    primary: `M${left} ${top}L${right} ${tipTop}L${right} ${tipBottom}L${left} ${bottom}Z`,
    secondary: `M${spawnX} ${spawnTop}H${spawnX + 4}V20H${spawnX}Z`,
    secondaryOpacity: clamp(split * 3),
    left, right, top, bottom, spawnTop,
  };
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
