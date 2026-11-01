import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { setImmediate as settle } from "node:timers/promises";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(readFileSync(new URL("../src/atoms/useProgressPulse.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

// Exercise the hook's effects against controllable browser animation promises.
function harness({ moving = true, supported = true } = {}) {
  let previousDeps;
  let cleanup;
  let reduced = false;
  let frame;
  let finishes = [];
  let rejects = [];
  const previous = { current: undefined };
  const calls = [];
  const animations = [];
  const target = { current: supported ? { animate: (keyframes, options) => {
    const animation = { cancelled: false, cancel() { this.cancelled = true; } };
    calls.push({ keyframes, options, animation });
    return animation;
  } } : {} };
  const motion = { current: { getAnimations: () => animations } };
  const startMovement = (count = 1) => {
    finishes = [];
    rejects = [];
    animations.splice(0, animations.length, ...Array.from({ length: count }, () => ({
      finished: new Promise((resolve, reject) => { finishes.push(resolve); rejects.push(reject); }),
    })));
  };
  if (moving) startMovement();
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    window: { requestAnimationFrame: callback => { frame = callback; return 1; }, cancelAnimationFrame: () => { frame = undefined; } },
    require: name => name === "react" ? {
      useRef: initial => { if (previous.current === undefined) previous.current = initial; return previous; },
      useEffect: (effect, deps) => {
        if (previousDeps && deps.every((value, index) => value === previousDeps[index])) return;
        cleanup?.();
        previousDeps = deps;
        cleanup = effect();
      },
    } : { usePrefersReducedMotion: () => reduced },
  });
  return {
    calls,
    render(boundary, { enabled = true, reduce = false } = {}) {
      reduced = reduce;
      exports.useProgressPulse(target, { isEmpty: boundary === "empty", isFull: boundary === "full" }, enabled, motion);
    },
    flushFrame() { const callback = frame; frame = undefined; callback?.(); },
    async finish(index) { if (index === undefined) finishes.forEach(finish => finish()); else finishes[index]?.(); await settle(); },
    async interrupt() { rejects.forEach(reject => reject(new Error("Transition cancelled"))); await settle(); },
    startMovement,
    unmount() { cleanup?.(); },
  };
}

const scales = call => call.keyframes.map(frame => frame.transform.match(/scale\(([^,]+), ([^)]+)\)/).slice(1).map(Number));

test("endpoint pulse waits for every series movement in the first layer", async () => {
  const hook = harness({ moving: false });
  hook.startMovement(2);
  hook.render("active");
  hook.render("full");
  hook.flushFrame();
  await hook.finish(0);
  assert.equal(hook.calls.length, 0);
  await hook.finish(1);
  assert.equal(hook.calls.length, 1);
});

test("full expands and empty contracts, with small opposite-direction overtravel", async () => {
  for (const boundary of ["full", "empty"]) {
    const hook = harness();
    hook.render("active");
    hook.render(boundary);
    hook.flushFrame();
    await hook.finish();
    const frames = scales(hook.calls[0]);
    assert.deepEqual(frames[0], [1, 1]);
    assert.deepEqual(frames.at(-1), [1, 1]);
    assert.ok(frames[1].every(value => boundary === "full" ? value > 1 : value < 1));
    assert.ok(frames[3].every(value => boundary === "full" ? value < 1 : value > 1));
    assert.ok(frames.flat().every(value => Math.abs(value - 1) <= 0.081));
  }
});

test("pulse waits for visible movement to finish, including reversed transitions", async () => {
  const hook = harness();
  hook.render("active");
  hook.render("full");
  assert.equal(hook.calls.length, 0);
  hook.flushFrame();
  assert.equal(hook.calls.length, 0);
  hook.render("empty");
  await hook.interrupt();
  hook.startMovement();
  hook.flushFrame();
  assert.equal(hook.calls.length, 0);
  await hook.finish();
  assert.equal(hook.calls.length, 1);
  assert.ok(scales(hook.calls[0])[1][0] < 1);
});

test("mounting and repeated endpoints remain quiet", async () => {
  for (const boundary of ["full", "empty"]) {
    const hook = harness();
    hook.render(boundary);
    hook.flushFrame();
    await hook.finish();
    hook.render(boundary);
    assert.equal(hook.calls.length, 0);
  }
});

test("leaving the endpoint prevents a stale delayed pulse", async () => {
  const hook = harness();
  hook.render("active");
  hook.render("full");
  hook.flushFrame();
  hook.render("active");
  await hook.finish();
  assert.equal(hook.calls.length, 0);
});

test("disabled pulses, reduced motion, and unmount cancel pending feedback", async () => {
  for (const action of [hook => hook.render("full", { enabled: false }), hook => hook.render("full", { reduce: true }), hook => hook.unmount()]) {
    const hook = harness();
    hook.render("active");
    hook.render("full");
    hook.flushFrame();
    action(hook);
    await hook.finish();
    assert.equal(hook.calls.length, 0);
  }
});

test("no movement pulses at the next frame and active pulses cancel on unmount", () => {
  const hook = harness({ moving: false });
  hook.render("active");
  hook.render("full");
  hook.flushFrame();
  assert.equal(hook.calls.length, 1);
  hook.unmount();
  assert.equal(hook.calls[0].animation.cancelled, true);
});

test("cancelled movement and unsupported animation stay quiet", async () => {
  for (const supported of [true, false]) {
    const hook = harness({ supported });
    hook.render("active");
    hook.render("full");
    hook.flushFrame();
    if (supported) await hook.interrupt();
    else await hook.finish();
    assert.equal(hook.calls.length, 0);
  }
});
