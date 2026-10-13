import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

// Use the same TypeScript transpiler as the existing Node tests, resolving local module imports.
const modules = new Map();
async function loadSource(url) {
  const key = url.href;
  if (modules.has(key)) return modules.get(key);
  let code = ts.transpileModule(readFileSync(url, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  for (const match of [...code.matchAll(/from ["'](\.[^"']+\.js)["']/g)]) {
    const dependency = await loadSource(new URL(match[1].replace(/\.js$/, ".ts"), url));
    code = code.replace(match[0], `from ${JSON.stringify(dependency)}`);
  }
  const compiled = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  modules.set(key, compiled);
  return compiled;
}
const source = (path) => loadSource(new URL(`../src/components/organisms/SceneFooter/${path}`, import.meta.url));
const { createSceneEffects, subscribeSceneEffects } = await import(await source("effects.ts"));
const { createFireworks } = await import(await source("scenes/fireworks.ts"));
const { startScene } = await import(await source("controller.ts"));

test("SSR-safe handles drop early events, isolate owners, broadcast, and unsubscribe", () => {
  const effects = createSceneEffects();
  const separate = createSceneEffects();
  const event = { type: "firework" };
  assert.equal(effects.trigger(event), false);
  const delivered = [];
  const stopA = subscribeSceneEffects(effects, (e) => { delivered.push(e); return true; });
  const stopB = subscribeSceneEffects(effects, () => false);
  assert.equal(effects.trigger(event), true);
  assert.equal(effects.trigger(event), true);
  assert.deepEqual(delivered, [event, event]);
  assert.equal(separate.trigger(event), false);
  stopA(); stopA();
  assert.equal(effects.trigger(event), false);
  stopB();
  assert.equal(effects.trigger(event), false);
});

test("overlapping bursts reserve bounded capacity, expire, and accept new events", () => {
  for (const [quality, limit, small] of [["high", 256, 32], ["medium", 144, 24], ["low", 64, 16]]) {
    const pool = createFireworks(() => 0.5);
    assert.equal(pool.add({ type: "firework" }, 0, quality, [20, 160, 70]), true);
    assert.equal(pool.particleCount, small);
    assert.equal(pool.add({ type: "firework", size: "large" }, 0, quality, [20, 160, 70]), true);
    assert.ok(pool.particleCount > small);
    for (let i = 0; i < 1000; i++) pool.add({ type: "firework", size: "large" }, 0, quality, [20, 160, 70]);
    assert.equal(pool.particleCount, limit);
    assert.equal(pool.add({ type: "firework" }, 0, quality, [20, 160, 70]), false);
    pool.draw({}, 3, 400, 200); // expired particles need no drawing context
    assert.equal(pool.particleCount, 0);
    assert.equal(pool.add({ type: "firework" }, 3, quality, [20, 160, 70]), true);
    pool.clear(); pool.clear();
    assert.equal(pool.particleCount, 0);
  }
});

test("quality reductions trim pending particles immediately", () => {
  const pool = createFireworks(() => 0.5);
  for (let i = 0; i < 8; i++) pool.add({ type: "firework" }, 0, "high", [1, 2, 3]);
  pool.setQuality("medium");
  assert.ok(pool.particleCount <= 144);
  pool.setQuality("low");
  assert.equal(pool.particleCount, 64);
});

test("positions scale with the sky, clamp finite values, and default nonfinite values", () => {
  const centers = [];
  const g = {
    save() {}, restore() {}, beginPath() {}, stroke() {}, fill() {}, arc() {}, moveTo() {},
    lineTo(x, y) { centers.push([x, y]); },
  };
  const pool = createFireworks(() => 0.5);
  pool.add({ type: "firework", position: { x: 0.25, y: 0.5 } }, 0, "high", [1, 2, 3]);
  pool.draw(g, 0.14, 400, 200);
  assert.deepEqual(centers.pop(), [100, 125]);
  pool.draw(g, 0.14, 800, 400);
  assert.deepEqual(centers.pop(), [200, 250]);
  pool.clear();
  pool.add({ type: "firework", position: { x: 4, y: -1 } }, 0, "high", [1, 2, 3]);
  pool.draw(g, 0.14, 400, 200);
  assert.deepEqual(centers.pop(), [400, 50]);
  pool.clear();
  pool.add({ type: "firework", position: { x: NaN, y: Infinity } }, 0, "high", [1, 2, 3]);
  pool.draw(g, 0.14, 400, 200);
  assert.deepEqual(centers.pop(), [200, 132.5]);
});

function browserFixture(t, { reduced = false, lowEnd = false, saveData = false, forcedColors = false } = {}) {
  const cleanup = [];
  const keys = ["window", "document", "navigator", "matchMedia", "IntersectionObserver", "ResizeObserver", "requestAnimationFrame", "cancelAnimationFrame"];
  const originals = keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
  const document = Object.assign(new EventTarget(), { hidden: false, readyState: "complete", documentElement: { dataset: {} } });
  const window = Object.assign(new EventTarget(), { innerHeight: 800, innerWidth: 1000, devicePixelRatio: 1 });
  let idle;
  window.requestIdleCallback = (cb) => { idle = cb; return 1; };
  window.cancelIdleCallback = () => { idle = undefined; };
  const queries = new Map();
  const matchMedia = (query) => {
    if (!queries.has(query)) queries.set(query, Object.assign(new EventTarget(), {
      matches: query.includes("reduced") ? reduced : query.includes("forced") ? forcedColors : false,
    }));
    return queries.get(query);
  };
  const observers = [];
  class IntersectionObserver {
    constructor(callback, options) { this.callback = callback; this.options = options; this.disconnected = false; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
    emit(isIntersecting) { this.callback([{ isIntersecting }]); }
  }
  class ResizeObserver { observe() {} disconnect() {} }
  const frames = new Map();
  let id = 0;
  const globals = {
    document, window, matchMedia, IntersectionObserver, ResizeObserver,
    navigator: { hardwareConcurrency: lowEnd ? 2 : 8, deviceMemory: 8, connection: { saveData } },
    requestAnimationFrame: (cb) => { frames.set(++id, cb); return id; },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  t.after(() => { for (const stop of cleanup) stop(); for (const [key, descriptor] of originals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
  } });
  const rect = { top: 100, bottom: 500, left: 0, right: 800, height: 400 };
  const root = { dataset: {}, getBoundingClientRect: () => rect, querySelector: () => ({ offsetTop: 200 }) };
  const stage = { clientWidth: 800, clientHeight: 400, replaceChildren() {} };
  return {
    root, stage, document, queries, observers, rect, frames, cleanup,
    async load() { observers[0].emit(true); idle(); await new Promise((resolve) => setImmediate(resolve)); },
    step(now) { const pending = [...frames.values()]; frames.clear(); for (const callback of pending) callback(now); },
  };
}

function sceneFixture() {
  const stats = { created: 0, delivered: [], cleared: 0, destroyed: 0, rendered: 0, resized: [] };
  const scene = { create() {
    stats.created++;
    return {
      trigger(event) { stats.delivered.push(event); return true; },
      clearEffects() { stats.cleared++; },
      resize(_layout, quality) { stats.resized.push(quality); },
      setTheme() {}, render() { stats.rendered++; }, destroy() { stats.destroyed++; },
    };
  } };
  return { scene, stats };
}

test("controller delivers repeated events only to its existing live visible instance", async (t) => {
  const f = browserFixture(t);
  const { scene, stats } = sceneFixture();
  const controller = startScene({ root: f.root, stage: f.stage, scene });
  f.cleanup.push(controller);
  const event = { type: "firework" };
  assert.equal(controller.trigger(event), false);
  f.observers[1].emit(true);
  await f.load();
  for (let i = 0; i < 3; i++) assert.equal(controller.trigger(event), true);
  assert.equal(stats.created, 1);
  assert.equal(stats.delivered.length, 3);
  assert.equal(stats.rendered, 1); // event delivery itself neither advances nor restarts the sky
  controller();
  assert.equal(controller.trigger(event), false);
  assert.equal(stats.destroyed, 1);
  assert.equal(f.frames.size, 0);
  assert.ok(f.observers.every((observer) => observer.disconnected));
});

test("offscreen and hidden events drop; pause clears existing celebrations with no replay", async (t) => {
  const f = browserFixture(t);
  const { scene, stats } = sceneFixture();
  const controller = startScene({ root: f.root, stage: f.stage, scene });
  f.cleanup.push(controller);
  f.observers[1].emit(true);
  await f.load();
  assert.equal(controller.trigger({ type: "firework" }), true);
  f.observers[1].emit(false);
  assert.equal(controller.trigger({ type: "firework" }), false);
  assert.equal(stats.cleared, 1);
  f.observers[1].emit(true);
  assert.equal(stats.delivered.length, 1);
  f.rect.top = 810; // still in the observer's prewarm margin, but outside the actual viewport
  assert.equal(controller.trigger({ type: "firework" }), false);
  assert.equal(stats.cleared, 2);
  f.rect.top = 100;
  f.document.hidden = true;
  f.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(controller.trigger({ type: "firework" }), false);
  assert.equal(stats.cleared, 3);
  f.document.hidden = false;
  f.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(stats.delivered.length, 1);
  assert.equal(controller.trigger({ type: "firework" }), true);
});

test("reduced motion, static device fallbacks and forced colors never load for effects", async (t) => {
  for (const options of [{ reduced: true }, { lowEnd: true }, { saveData: true }, { forcedColors: true }]) {
    await t.test(JSON.stringify(options), (subtest) => {
    const f = browserFixture(subtest, options);
    const { scene, stats } = sceneFixture();
    const controller = startScene({ root: f.root, stage: f.stage, scene });
    assert.equal(controller.trigger({ type: "firework" }), false);
    assert.equal(f.root.dataset.sceneState, "static");
    assert.equal(stats.created, 0);
    controller();
    });
  }
});

test("a pending load cannot create a scene or replay events after destruction", async (t) => {
  const f = browserFixture(t);
  const { scene, stats } = sceneFixture();
  let resolve;
  const pending = new Promise((done) => { resolve = done; });
  const controller = startScene({ root: f.root, stage: f.stage, scene: () => pending });
  await f.load();
  assert.equal(controller.trigger({ type: "firework" }), false);
  controller();
  resolve(scene);
  await new Promise((done) => setImmediate(done));
  assert.equal(stats.created, 0);
  assert.equal(controller.trigger({ type: "firework" }), false);
});

test("reduced motion enabled while live tears down effects and rejects later triggers", async (t) => {
  const f = browserFixture(t);
  const { scene, stats } = sceneFixture();
  const controller = startScene({ root: f.root, stage: f.stage, scene });
  f.cleanup.push(controller);
  f.observers[1].emit(true);
  await f.load();
  const query = f.queries.get("(prefers-reduced-motion: reduce)");
  query.matches = true;
  query.dispatchEvent(Object.assign(new Event("change"), { matches: true }));
  assert.equal(stats.destroyed, 1);
  assert.equal(f.root.dataset.sceneState, "static");
  assert.equal(controller.trigger({ type: "firework" }), false);
});

test("the existing governor lowers quality, then clears effects and rejects frozen triggers", async (t) => {
  const f = browserFixture(t);
  const { scene, stats } = sceneFixture();
  const controller = startScene({ root: f.root, stage: f.stage, scene });
  f.cleanup.push(controller);
  f.observers[1].emit(true);
  await f.load();
  for (let frame = 1; frame <= 370; frame++) f.step(frame * 40);
  assert.deepEqual(stats.resized, ["medium", "low"]);
  assert.equal(f.root.dataset.sceneState, "frozen");
  assert.equal(stats.cleared, 1);
  assert.equal(controller.trigger({ type: "firework" }), false);
});

test("custom scenes without effect support keep working", async (t) => {
  const f = browserFixture(t);
  const controller = startScene({ root: f.root, stage: f.stage, scene: {
    create: () => ({ resize() {}, setTheme() {}, render() {}, destroy() {} }),
  } });
  f.cleanup.push(controller);
  f.observers[1].emit(true);
  await f.load();
  assert.equal(f.root.dataset.sceneState, "live");
  assert.equal(controller.trigger({ type: "firework" }), false);
});
