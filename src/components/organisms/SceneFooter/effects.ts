export const DEFAULT_FIREWORKS_PARTICLE_LIMIT = 2048;

/** Allocate on demand; a large configured limit never preallocates a large array. */
export const normalizeFireworksParticleLimit = (value: number): number => Number.isFinite(value)
  ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, Math.floor(value)))
  : DEFAULT_FIREWORKS_PARTICLE_LIMIT;

/** A temporary, decorative Horizon sky effect. Positions are fractions of the sky band. */
export type FireworkEffect = {
  type: "firework";
  /** Burst center: x runs left to right, y runs top to horizon. Omit to choose a fresh random position. */
  position?: { x: number; y: number };
  /** CSS color or a single CSS variable, e.g. "var(--confirm)". Omit for multicolor explosions. */
  color?: string;
  /** One modest burst, or a larger, staggered group. Default "small". */
  size?: "small" | "large";
};

/** Extend this union when another temporary scene effect is introduced. */
export type SceneEffect = FireworkEffect;

export type SceneEffects = {
  /**
   * Synchronously deliver to attached, visible, live scenes. Returns true if any accepted it.
   * Unavailable scenes ignore events, never queue them. Live Horizon scenes replace oldest particles at capacity.
   * Safe during SSR; callers can ignore this optional availability result.
   */
  readonly trigger: (effect: SceneEffect) => boolean;
};

type Receiver = (effect: SceneEffect) => boolean;
const receivers = new WeakMap<SceneEffects, Set<Receiver>>();

/** Create once per owning activity/page; share through props or React context. */
export function createSceneEffects(): SceneEffects {
  const listeners = new Set<Receiver>();
  const effects: SceneEffects = Object.freeze({
    trigger(effect: SceneEffect) {
      let accepted = false;
      for (const receive of listeners) accepted = receive(effect) || accepted;
      return accepted;
    },
  });
  receivers.set(effects, listeners);
  return effects;
}

/** Internal attachment; the public handle exposes neither canvases nor scene instances. */
export function subscribeSceneEffects(effects: SceneEffects, receive: Receiver): () => void {
  const listeners = receivers.get(effects);
  listeners?.add(receive);
  return () => { listeners?.delete(receive); };
}
