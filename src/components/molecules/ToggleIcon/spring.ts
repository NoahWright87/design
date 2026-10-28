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

/** Project the lashes through a half-turn as the upper lid folds toward the viewer. */
export function eyeGeometry(position: number) {
  const closed = clamp(position);
  const controlY = mix(4, 20, closed);
  const upper = `M3 12C7 ${controlY} 17 ${controlY} 21 12`;
  const lower = "M3 12C7 20 17 20 21 12";
  const aperture = `${upper}C17 20 7 20 3 12Z`;
  const projection = Math.cos(Math.PI * position);
  const length = mix(3.2, 2.6, closed);
  const lashes = [0.16, 0.33, 0.5, 0.67, 0.84].map(t => {
    const u = 1 - t;
    const x = 3 * u ** 3 + 21 * u ** 2 * t + 51 * u * t ** 2 + 21 * t ** 3;
    const y = 12 * (u ** 3 + t ** 3) + 3 * controlY * (u ** 2 * t + u * t ** 2);
    const dx = 12 * u ** 2 + 60 * u * t + 12 * t ** 2;
    const dy = 3 * (controlY - 12) * (u ** 2 - t ** 2);
    const magnitude = Math.hypot(dx, dy);
    return { x, y, endX: x + dy / magnitude * length * projection, endY: y - dx / magnitude * length * projection };
  });
  const closingOvertravel = Math.max(0, position - 1);
  const openingOvertravel = Math.max(0, -position);
  return {
    upper, lower, aperture, controlY, lashes,
    offsetY: 6 * (closingOvertravel - openingOvertravel),
    scaleX: 1 + 0.45 * closingOvertravel,
    scaleY: 1 - 0.3 * closingOvertravel + 0.2 * openingOvertravel,
  };
}

export interface LockMotion {
  progress: IconSpring;
  recoil: IconSpring;
  target: number;
  latched: boolean;
}

export function restingLock(target: number): LockMotion {
  return { progress: { position: target, velocity: 0 }, recoil: { position: 0, velocity: 0 }, target, latched: target === 1 };
}

export function targetLock(state: LockMotion, target: number): LockMotion {
  return { ...state, target, latched: target === 0 ? false : state.latched };
}

export function stepLockMotion(state: LockMotion, elapsed: number): LockMotion {
  const progress = stepIconSpring(state.progress, state.target, elapsed);
  const snap = state.target === 1 && !state.latched && progress.position >= 1;
  const recoil = stepIconSpring({
    position: state.recoil.position,
    velocity: state.recoil.velocity + (snap ? 240 : 0),
  }, 0, elapsed);
  return { ...state, progress, recoil, latched: state.latched || snap };
}

export function lockGeometry(position: number) {
  const opening = clamp(1 - position);
  const lift = 1.5 * ease(opening / 0.35);
  const angle = 0 - 55 * ease((opening - 0.35) / 0.65) - 20 * Math.max(0, -position);
  return {
    lift, angle,
    shackle: `M8 11V${7 - lift}A4 4 0 0 1 16 ${7 - lift}V${11 - lift}`,
    transform: `translate(8 11) rotate(${angle}) translate(-8 -11)`,
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

/** Both halves share one progress value, including their elastic overtravel. */
export function playbackGeometry(position: number) {
  const windup = ease(position / 0.22);
  const dash = ease((position - 0.22) / 0.24);
  const impact = ease((position - 0.46) / 0.22);
  const split = Math.max(0, (position - 0.68) / 0.32);
  // Zero slope at either side of the final pose keeps the overshoot handoff smooth.
  const settle = split <= 1 ? ease(split) : 1 + 0.12 * (1 - Math.exp(-(((split - 1) / 0.2) ** 2)));
  let left = mix(6, 4.2, windup);
  let right = mix(20, 18.8, windup);
  let top = mix(4, 2.8, windup);
  let bottom = mix(20, 21.2, windup);
  let tipTop = 12, tipBottom = 12;
  if (position >= 0.22) {
    left = mix(4.2, 17.2, dash);
    right = mix(18.8, 23.4, dash);
    top = mix(2.8, 8, dash);
    bottom = mix(21.2, 16, dash);
  }
  if (position >= 0.46) {
    left = mix(17.2, 19.4, impact);
    right = 23.4;
    top = mix(8, 1.8, impact);
    bottom = mix(16, 22.2, impact);
    tipTop = mix(12, 1.8, impact);
    tipBottom = mix(12, 22.2, impact);
  }
  let leftBarLeft = left, leftBarRight = (left + right) / 2;
  let rightBarLeft = leftBarRight, rightBarRight = right;
  let seamTop = (top + tipTop) / 2, seamBottom = (bottom + tipBottom) / 2;
  if (position >= 0.68) {
    leftBarLeft = mix(19.4, 6, settle);
    leftBarRight = mix(21.4, 10, settle);
    rightBarLeft = mix(21.4, 15, settle);
    rightBarRight = mix(23.4, 19, settle);
    top = tipTop = seamTop = mix(1.8, 4, settle);
    bottom = tipBottom = seamBottom = mix(22.2, 20, settle);
  }
  return {
    primary: `M${rightBarLeft} ${seamTop}L${rightBarRight} ${tipTop}L${rightBarRight} ${tipBottom}L${rightBarLeft} ${seamBottom}Z`,
    secondary: `M${leftBarLeft} ${top}L${leftBarRight} ${seamTop}L${leftBarRight} ${seamBottom}L${leftBarLeft} ${bottom}Z`,
    left, right, top, bottom, tipTop, tipBottom,
    leftBarLeft, leftBarRight, rightBarLeft, rightBarRight,
    splitProgress: settle,
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
