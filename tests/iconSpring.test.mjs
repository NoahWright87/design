import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/molecules/ToggleIcon/spring.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { stepIconSpring, moonSunGeometry } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

test("both directions overshoot and settle at the exact requested endpoint", () => {
  for (const target of [0, 1]) {
    let state = { position: 1 - target, velocity: 0 };
    let overshot = false;
    for (let frame = 0; frame < 240; frame++) {
      state = stepIconSpring(state, target, 1 / 60);
      overshot ||= target === 1 ? state.position > 1 : state.position < 0;
    }
    assert.ok(overshot);
    assert.deepEqual(state, { position: target, velocity: 0 });
  }
});

test("reversing mid-flight preserves momentum and converges to the new target", () => {
  let state = { position: 0, velocity: 0 };
  for (let i = 0; i < 6; i++) state = stepIconSpring(state, 1, 1 / 60);
  const reversed = stepIconSpring(state, 0, 0);
  assert.deepEqual(reversed, state);
  state = stepIconSpring(reversed, 0, 1 / 240);
  assert.ok(state.velocity > 0, "existing forward momentum survives the target change");
  for (let i = 0; i < 240; i++) state = stepIconSpring(state, 0, 1 / 60);
  assert.deepEqual(state, { position: 0, velocity: 0 });
});

test("a suspended tab's long frame is capped to a stable integration interval", () => {
  const start = { position: 0.4, velocity: 3 };
  assert.deepEqual(stepIconSpring(start, 1, 30), stepIconSpring(start, 1, 0.04));
});

test("reference crescent has no rays; reference sun has eight capsule-ready rays", () => {
  const moon = moonSunGeometry(0);
  assert.equal(moon.radius, 19.3);
  assert.equal(moon.cutX, 56.3);
  assert.equal(moon.cutY, 43.8);
  assert.equal(moon.cutRadius, 19.4);
  assert.equal(moon.rayOpacity, 0);
  const sun = moonSunGeometry(1);
  assert.equal(sun.radius, 20);
  assert.equal(sun.cutRadius, 0);
  assert.equal(sun.rayWidth, 6.3);
  assert.equal(sun.rayLength, 13.5);
  assert.equal(sun.rayStart, 26.4);
  assert.equal(sun.rotation, 0);
});

test("reference overtravel extends sun rays and briefly thins the moon", () => {
  const sun = moonSunGeometry(1.1);
  assert.ok(sun.rayLength > 13.5);
  assert.ok(sun.rayStart > 26.4);
  assert.ok(sun.rotation > 0);
  const moon = moonSunGeometry(-0.1);
  assert.equal(moon.rayOpacity, 0);
  assert.ok(moon.cutX < 56.3);
  assert.ok(moon.cutRadius > 19.4);
});
