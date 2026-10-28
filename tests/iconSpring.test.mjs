import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/molecules/ToggleIcon/spring.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { stepIconSpring, moonSunGeometry, playbackGeometry, heartGeometry, restingHeart, targetHeart, stepHeartMotion } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

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

test("playback winds up, tapers into the wall, and flattens before splitting", () => {
  const play = playbackGeometry(0);
  const windup = playbackGeometry(0.22);
  assert.equal(play.left, 6);
  assert.equal(play.right, 20);
  assert.ok(windup.left < play.left && windup.right < play.right);
  assert.ok(windup.top < play.top && windup.bottom > play.bottom);
  const dash = playbackGeometry(0.46);
  assert.equal(dash.right, 23.4, "tip plus rounded stroke reaches the canvas edge");
  assert.ok(dash.right - dash.left < windup.right - windup.left);
  assert.ok(dash.bottom - dash.top < windup.bottom - windup.top);
  assert.equal(dash.tipTop, dash.tipBottom, "dash is still a triangle at contact");
  const impact = playbackGeometry(0.68);
  assert.equal(impact.leftBarRight, impact.rightBarLeft, "both halves remain joined through impact");
  assert.ok(impact.bottom - impact.top > 16);
  assert.ok(Math.abs(impact.tipTop - impact.top) < 1e-12);
  assert.ok(Math.abs(impact.tipBottom - impact.bottom) < 1e-12);
  const pause = playbackGeometry(1);
  assert.equal(pause.leftBarLeft, 6);
  assert.equal(pause.leftBarRight, 10);
  assert.equal(pause.rightBarLeft, 15);
  assert.equal(pause.rightBarRight, 19);
  assert.equal(pause.top, 4);
  assert.equal(pause.bottom, 20);
});

test("pause bars split, overshoot, and settle on the same timing", () => {
  for (const progress of [0.72, 0.8, 0.9, 1, 1.06, 1.12]) {
    const g = playbackGeometry(progress);
    const leftTravel = (19.4 - g.leftBarLeft) / (19.4 - 6);
    const rightTravel = (21.4 - g.rightBarLeft) / (21.4 - 15);
    assert.ok(Math.abs(leftTravel - rightTravel) < 1e-12);
    assert.ok(Math.abs(leftTravel - g.splitProgress) < 1e-12);
    assert.ok(Math.abs(g.top - g.tipTop) < 1e-12);
    assert.ok(Math.abs(g.bottom - g.tipBottom) < 1e-12);
  }
  const overtravel = playbackGeometry(1.1);
  assert.ok(overtravel.leftBarLeft < 6 && overtravel.rightBarLeft < 15);
  assert.ok(overtravel.leftBarLeft > 4, "overtravel stays modest");
});

test("playback poses stay continuous at boundaries and during reversals", () => {
  for (const boundary of [0.22, 0.46, 0.68, 1]) {
    const before = playbackGeometry(boundary - 1e-7);
    const after = playbackGeometry(boundary + 1e-7);
    for (const property of ["top", "bottom", "tipTop", "tipBottom", "leftBarLeft", "leftBarRight", "rightBarLeft", "rightBarRight"]) {
      assert.ok(Math.abs(before[property] - after[property]) < 0.001, `${property} stays continuous at ${boundary}`);
      const at = playbackGeometry(boundary);
      const h = 1e-5;
      const incoming = (at[property] - playbackGeometry(boundary - h)[property]) / h;
      const outgoing = (playbackGeometry(boundary + h)[property] - at[property]) / h;
      assert.ok(Math.abs(incoming - outgoing) < 0.1, `${property} has a smooth velocity handoff at ${boundary}`);
    }
  }
  let state = { position: 0, velocity: 0 };
  for (let i = 0; i < 14; i++) state = stepIconSpring(state, 1, 1 / 60, 6.5);
  const pose = playbackGeometry(state.position);
  const reversed = stepIconSpring(state, 0, 0, 6.5);
  assert.deepEqual(playbackGeometry(reversed.position), pose);
  for (let i = 0; i < 240; i++) {
    state = stepIconSpring(i === 0 ? reversed : state, 0, 1 / 60, 6.5);
    const g = playbackGeometry(state.position);
    assert.doesNotMatch(g.primary + g.secondary, /NaN|Infinity/);
    assert.ok(g.rightBarRight > g.rightBarLeft);
    assert.ok(g.leftBarRight > g.leftBarLeft);
    assert.ok(g.bottom > g.top);
  }
  assert.deepEqual(state, { position: 0, velocity: 0 });
});
