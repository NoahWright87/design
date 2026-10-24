import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/molecules/ToggleIcon/spring.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { stepIconSpring, moonSunGeometry, heartGeometry, restingHeart, targetHeart, stepHeartMotion } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

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

test("heart completes fill/drain before its thump/squish, with a stationary tip", () => {
  for (const target of [1, 0]) {
    let state = targetHeart(restingHeart(1 - target), target);
    let reacted = false;
    let maxWidth = 1, maxHeight = 1, minHeight = 1;
    let previousFill = state.fill;
    for (let frame = 0; frame < 240; frame++) {
      state = stepHeartMotion(state, 1 / 60);
      const pose = heartGeometry(state.fill, state.width.position, state.height.position);
      assert.ok(pose.fillHeight >= 0 && pose.fillHeight <= 18);
      assert.equal(pose.fillY + pose.fillHeight, 21);
      // Scale about (12, 21): the tip remains exactly fixed on both axes.
      assert.equal(12 + pose.scaleX * (12 - 12), 12);
      assert.equal(21 + pose.scaleY * (21 - 21), 21);
      if (state.phase === "fill") {
        assert.equal(pose.scaleX, 1);
        assert.equal(pose.scaleY, 1);
        assert.ok(target === 1 ? state.fill >= previousFill : state.fill <= previousFill);
      } else {
        assert.equal(state.fill, target, "reaction starts only with completed fill/drain");
        reacted ||= state.phase === "reaction";
      }
      maxWidth = Math.max(maxWidth, pose.scaleX);
      maxHeight = Math.max(maxHeight, pose.scaleY);
      minHeight = Math.min(minHeight, pose.scaleY);
      previousFill = state.fill;
    }
    assert.ok(reacted);
    assert.equal(state.phase, "idle");
    assert.deepEqual(heartGeometry(state.fill, state.width.position, state.height.position), {
      fillY: target ? 3 : 21, fillHeight: target * 18, scaleX: 1, scaleY: 1,
    });
    assert.ok(maxWidth > 1.03 && maxWidth < 1.12, "both gestures widen slightly");
    if (target) assert.ok(maxHeight > 1.08, "filled heart swells upward");
    else assert.ok(minHeight < 0.92, "empty heart compresses downward");
  }
});

test("reversing during fill cancels the old pending reaction", () => {
  let state = targetHeart(restingHeart(0), 1);
  for (let i = 0; i < 5; i++) state = stepHeartMotion(state, 1 / 60);
  assert.equal(state.phase, "fill");
  const before = state.fill;
  state = targetHeart(state, 0);
  assert.equal(state.fill, before);
  for (let i = 0; i < 240; i++) {
    state = stepHeartMotion(state, 1 / 60);
    assert.ok(state.fill <= before);
    if (state.height.velocity !== 0 || state.height.position !== 0) {
      assert.equal(state.fill, 0, "only the new empty endpoint triggers a reaction");
    }
  }
  assert.equal(state.phase, "idle");
});

test("retargeting during a reaction preserves the existing pose and momentum", () => {
  let state = targetHeart(restingHeart(0), 1);
  for (let i = 0; i < 20; i++) state = stepHeartMotion(state, 1 / 60);
  assert.equal(state.phase, "reaction");
  const reversed = targetHeart(state, 0);
  assert.deepEqual(reversed.width, state.width);
  assert.deepEqual(reversed.height, state.height);
  assert.equal(reversed.fill, state.fill);
  for (let i = 0; i < 240; i++) state = stepHeartMotion(i === 0 ? reversed : state, 1 / 60);
  assert.equal(state.fill, 0);
  assert.equal(state.phase, "idle");
});
