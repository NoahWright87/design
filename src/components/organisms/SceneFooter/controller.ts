import { getThemeMode, subscribeThemeMode } from "../../../styles/themeToggle.js";
import { clamp, readColorToken } from "./color.js";
import { onIdle } from "./idle.js";
import { BUILT_IN_SCENES, isBuiltInScene, type BuiltInSceneId } from "./scenes/index.js";
import type { FooterScene, SceneInstance, SceneLayout, SceneLoader, SceneModule, SceneQuality, SceneState } from "./types.js";
import type { SceneEffect } from "./effects.js";

export type SceneSource = BuiltInSceneId | FooterScene | SceneLoader;

export type StartSceneOptions = {
  /** The `<footer>` element. Receives `data-scene-state`. */
  root: HTMLElement;
  /** Empty layer covering the footer; handed to the scene as its host. */
  stage: HTMLElement;
  scene: SceneSource;
  options?: Record<string, unknown>;
  /**
   * The reader explicitly asked for motion: skip the save-data and low-end-device heuristics.
   * A system preference for reduced motion (or forced colors) still wins.
   */
  force?: boolean;
};

const LOAD_TIMEOUT_MS = 10_000;
/** How many frame gaps the governor looks at before judging, after skipping the first few. */
const GOVERNOR_WINDOW = 90;
const GOVERNOR_WARMUP = 30;
/** If a quarter of frame gaps are longer than this, the page is struggling. */
const GOVERNOR_SLOW_MS = 30;

type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

function matches(query: string): boolean {
  return typeof matchMedia === "function" && matchMedia(query).matches;
}

/** The CSS-only footer is the right answer on these devices and settings: no scene code is ever fetched. */
function shouldStayStatic(force: boolean): boolean {
  if (matches("(prefers-reduced-motion: reduce)") || matches("(forced-colors: active)")) return true;
  if (force) return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return true;
  if ((nav.hardwareConcurrency ?? 8) <= 2) return true;
  if ((nav.deviceMemory ?? 8) <= 1) return true;
  return false;
}

function startingQuality(): SceneQuality {
  const nav = navigator as NavigatorHints;
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 ? "medium" : "high";
}

function toLoader(scene: SceneSource): SceneLoader {
  if (typeof scene === "function") return scene;
  if (isBuiltInScene(scene)) return BUILT_IN_SCENES[scene].load;
  if (scene && typeof scene === "object") return () => Promise.resolve(scene);
  return () => Promise.reject(new Error("Unknown footer scene"));
}

function toScene(mod: SceneModule): FooterScene {
  const direct = mod as FooterScene;
  if (typeof direct.create === "function") return direct;
  const fromDefault = (mod as { default: FooterScene }).default;
  if (fromDefault && typeof fromDefault.create === "function") return fromDefault;
  throw new Error("Footer scene module has no create()");
}

/**
 * Brings a footer scene to life without ever making the page pay for it up front.
 *
 *  1. Nothing happens until the footer is within a screen of the viewport (and the browser is idle).
 *  2. The scene code is fetched then, with a timeout. Any failure leaves the CSS-only footer in place.
 *  3. The frame loop runs only while the footer is on screen and the tab is visible.
 *  4. A governor watches frame pacing and steps quality down, then freezes, rather than janking the page.
 *
 * Returns a function that undoes all of it.
 */
export type SceneController = (() => void) & { trigger(effect: SceneEffect): boolean };

export function startScene({ root, stage, scene, options = {}, force = false }: StartSceneOptions): SceneController {
  const setState = (state: SceneState) => {
    root.dataset.sceneState = state;
  };

  if (shouldStayStatic(force)) {
    setState("static");
    return Object.assign(() => {}, { trigger: () => false });
  }

  let disposed = false;
  let instance: SceneInstance | undefined;
  let quality = startingQuality();
  let frozen = false;
  let inView = false;
  let raf = 0;
  let resizePending = 0;
  let cancelIdle: (() => void) | undefined;
  let loadTimer: ReturnType<typeof setTimeout> | undefined;
  let unsubscribeTheme: (() => void) | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let onLoad: (() => void) | undefined;

  // governor bookkeeping
  let lastTick = 0;
  let gaps: number[] = [];

  const measure = (): SceneLayout => {
    const sea = root.querySelector<HTMLElement>(".nw-scene-footer__sea");
    return { width: stage.clientWidth, height: stage.clientHeight, horizon: sea ? sea.offsetTop : 0 };
  };

  const progress = () => {
    const rect = root.getBoundingClientRect();
    return rect.height > 0 ? clamp((window.innerHeight - rect.top) / rect.height, 0, 1) : 0;
  };

  const isInViewport = () => {
    const rect = root.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  };

  const resetGovernor = () => {
    lastTick = 0;
    gaps = [];
  };

  const govern = (now: number) => {
    if (lastTick) {
      // A hidden tab stops the loop and `kick` resets the window, so a long gap here is real
      // slowness. Cap it rather than discard it, or a page too slow to hit 4 fps never degrades.
      gaps.push(Math.min(now - lastTick, 250));
    }
    lastTick = now;
    if (gaps.length < GOVERNOR_WARMUP + GOVERNOR_WINDOW) return;

    const sample = gaps.slice(GOVERNOR_WARMUP).sort((a, b) => a - b);
    const p75 = sample[Math.floor(sample.length * 0.75)];
    resetGovernor();
    if (p75 <= GOVERNOR_SLOW_MS || !instance) return;

    if (quality === "high") quality = "medium";
    else if (quality === "medium") quality = "low";
    else {
      frozen = true; // already at the lowest setting: leave the last frame on screen
      instance.clearEffects?.();
      setState("frozen");
      return;
    }
    instance.resize(measure(), quality);
  };

  const tick = (now: number) => {
    raf = 0;
    if (!instance || !inView || frozen || document.hidden) return;
    instance.render(now / 1000, progress());
    govern(now);
    raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    // Keep the scene's prewarm margin, but discard celebrations once the footer itself leaves view.
    if (instance && !isInViewport()) instance.clearEffects?.();
    if (raf || !instance || !inView || frozen || document.hidden) return;
    resetGovernor();
    raf = requestAnimationFrame(tick);
  };

  const onVisibility = () => {
    if (document.hidden) {
      instance?.clearEffects?.();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    } else kick();
  };

  const onResize = () => {
    if (resizePending || !instance) return;
    resizePending = requestAnimationFrame(() => {
      resizePending = 0;
      if (!instance) return;
      instance.resize(measure(), quality);
      // Resizing clears the canvases. A running loop repaints them; a frozen one needs a single
      // repaint so the last frame stays on screen.
      if (frozen) instance.render(performance.now() / 1000, progress());
      else kick();
    });
  };

  const fail = () => {
    if (disposed) return;
    teardownInstance();
    setState("failed");
  };

  const teardownInstance = () => {
    if (raf) cancelAnimationFrame(raf);
    if (resizePending) cancelAnimationFrame(resizePending);
    raf = resizePending = 0;
    unsubscribeTheme?.();
    resizeObserver?.disconnect();
    window.removeEventListener("scroll", kick);
    document.removeEventListener("visibilitychange", onVisibility);
    unsubscribeTheme = resizeObserver = undefined;
    try {
      instance?.destroy();
    } catch {
      // a scene that cannot clean up after itself must not take the page down with it
    }
    instance = undefined;
    stage.replaceChildren();
  };

  const mount = (definition: FooterScene) => {
    if (disposed) return;
    try {
      instance = definition.create({
        host: stage,
        layout: measure(),
        theme: getThemeMode(),
        quality,
        dpr: window.devicePixelRatio || 1,
        options,
        readColor: (tokens, fallback) => readColorToken(root, tokens, fallback),
      });
      instance.render(performance.now() / 1000, progress());
    } catch {
      fail();
      return;
    }
    setState("live");
    unsubscribeTheme = subscribeThemeMode((mode) => {
      instance?.setTheme(mode);
      kick();
    });
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(root);
    window.addEventListener("scroll", kick, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    kick();
  };

  const load = () => {
    if (disposed) return;
    const timeout = new Promise<never>((_, reject) => {
      loadTimer = setTimeout(() => reject(new Error("Footer scene timed out")), LOAD_TIMEOUT_MS);
    });
    Promise.race([toLoader(scene)(), timeout])
      .then((mod) => mount(toScene(mod)))
      .catch(fail)
      .finally(() => clearTimeout(loadTimer));
  };

  // Load only when the footer is within a screen of view, and then only once the page has settled.
  const near = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      near.disconnect();
      setState("loading");
      const go = () => {
        if (disposed) return;
        cancelIdle = onIdle(load, 2000);
      };
      if (document.readyState === "complete") go();
      else {
        onLoad = go;
        window.addEventListener("load", go, { once: true });
      }
    },
    { rootMargin: "0px 0px 100% 0px" },
  );
  near.observe(root);

  const visible = new IntersectionObserver(
    (entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      if (inView) kick();
      else {
        instance?.clearEffects?.();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { rootMargin: "40px 0px" },
  );
  visible.observe(root);

  // Reduced motion switched on while the page is open: go back to the quiet footer.
  const reduce = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : undefined;
  const onReduce = (event: MediaQueryListEvent) => {
    if (!event.matches) return;
    // Stop everything, including a load that has not started yet: the footer may still be far
    // from the viewport, and scrolling to it later must not fetch or mount a scene.
    disposed = true;
    near.disconnect();
    visible.disconnect();
    cancelIdle?.();
    if (onLoad) window.removeEventListener("load", onLoad);
    clearTimeout(loadTimer);
    reduce?.removeEventListener("change", onReduce);
    teardownInstance();
    setState("static");
  };
  reduce?.addEventListener("change", onReduce);

  const stop = () => {
    disposed = true;
    near.disconnect();
    visible.disconnect();
    reduce?.removeEventListener("change", onReduce);
    cancelIdle?.();
    if (onLoad) window.removeEventListener("load", onLoad);
    clearTimeout(loadTimer);
    teardownInstance();
    setState("static");
  };
  return Object.assign(stop, {
    trigger(effect: SceneEffect) {
      if (disposed || !instance || frozen || !inView || document.hidden || shouldStayStatic(force)) return false;
      // The observer's prewarm margin may include a footer that is just outside the viewport.
      if (!isInViewport()) {
        instance.clearEffects?.();
        return false;
      }
      return instance.trigger?.(effect) ?? false;
    },
  });
}
