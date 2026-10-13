/** A temporary, decorative Horizon sky effect. Positions are fractions of the sky band. */
export type FireworkEffect = {
  type: "firework";
  /** Burst center: x runs left to right, y runs top to horizon. Default { x: 0.5, y: 0.55 }. */
  position?: { x: number; y: number };
  /** CSS color or a single CSS variable, e.g. "var(--confirm)". Defaults to the scene's sun light. */
  color?: string;
  /** One modest burst, or a larger, staggered group. Default "small". */
  size?: "small" | "large";
};

/** Extend this union when another temporary scene effect is introduced. */
export type SceneEffect = FireworkEffect;

export type SceneEffects = {
  /**
   * Synchronously deliver to attached, visible, live scenes. Returns true if any accepted it.
   * Unavailable or capacity-limited effects are dropped, never queued. Safe during SSR.
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
