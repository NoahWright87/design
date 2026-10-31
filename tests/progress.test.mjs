import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getProgressState, getProgressColor, ProgressBar, ProgressText } from "../dist/index.mjs";

test("progress normalizes arbitrary domains and clamps endpoints", () => {
  assert.deepEqual(getProgressState({ value: 0, min: -50, max: 150 }), {
    value: 0, min: -50, max: 150, percentage: 25, isEmpty: false, isFull: false,
  });
  assert.equal(getProgressState({ value: 350, max: 1000 }).percentage, 35);
  assert.equal(getProgressState({ value: 7.5, max: 15 }).percentage, 50);
  assert.equal(getProgressState({ value: -100, min: -50 }).isEmpty, true);
  assert.equal(getProgressState({ value: 200 }).isFull, true);
  assert.equal(getProgressState({ value: 12.25 }).value, 12.25);
});

test("invalid numeric inputs produce finite, ordered accessible state", () => {
  for (const options of [
    { value: NaN }, { value: Infinity }, { value: -Infinity },
    { value: 50, min: 100, max: 100 }, { value: 50, min: 200, max: 100 },
    { value: 50, min: NaN }, { value: 50, max: Infinity },
    { value: 50, min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
  ]) {
    const state = getProgressState(options);
    assert.ok(Object.values(state).every(value => typeof value !== "number" || Number.isFinite(value)));
    assert.ok(state.min < state.max);
    assert.ok(state.value >= state.min && state.value <= state.max);
    assert.ok(state.percentage >= 0 && state.percentage <= 100);
  }
  assert.equal(getProgressState({ value: NaN, min: 10 }).value, 10);
});

test("color stops are inclusive, order-independent, and preserve caller data", () => {
  const ranges = Object.freeze([
    Object.freeze({ upTo: 100, color: "high" }),
    Object.freeze({ upTo: 25, color: "low", textColor: "light" }),
    Object.freeze({ upTo: 65, color: "middle" }),
  ]);
  for (const [percentage, expected] of [[0, "low"], [25, "low"], [25.01, "middle"], [65, "middle"], [65.01, "high"], [100, "high"]]) {
    assert.equal(getProgressColor(percentage, ranges).color, expected);
  }
  assert.equal(getProgressColor(25, ranges).textColor, "light");
  assert.equal(getProgressColor(50, ranges, "fallback", "text").textColor, "text");
  assert.equal(ranges[0].upTo, 100);
});

test("invalid stops, duplicates, and uncovered percentages have defined fallbacks", () => {
  const ranges = [{ upTo: NaN, color: "bad" }, { upTo: -1, color: "bad" }, { upTo: 101, color: "bad" }, { upTo: 50, color: "first" }, { upTo: 50, color: "second" }];
  assert.equal(getProgressColor(50, ranges).color, "first");
  assert.deepEqual(getProgressColor(51, ranges, "fallback", "text"), { color: "fallback", textColor: "text" });
  assert.equal(getProgressColor(50).color, "var(--primary)");
});

test("bar server rendering exposes normalized values and formatted text", () => {
  const markup = renderToStaticMarkup(React.createElement(ProgressBar, {
    label: "XP", value: 1200, max: 1000, rounded: true,
    text: ({ value, max }) => `${value} / ${max} XP`,
  }));
  assert.match(markup, /role="progressbar"/);
  assert.match(markup, /aria-label="XP"/);
  assert.match(markup, /aria-valuemax="1000"/);
  assert.match(markup, /aria-valuenow="1000"/);
  assert.match(markup, /aria-valuetext="1000 \/ 1000 XP"/);
  assert.match(markup, /width:100%/);
  assert.match(markup, /nw-progress-bar--rounded/);
  assert.match(markup, /aria-hidden="true"/);
});

test("hidden bar text retains numeric semantics and range colors", () => {
  const markup = renderToStaticMarkup(React.createElement(ProgressBar, {
    label: "Heat", value: 90, text: false,
    colorRanges: [{ upTo: 100, color: "var(--danger)" }],
  }));
  assert.match(markup, /aria-valuenow="90"/);
  assert.match(markup, /background-color:var\(--danger\)/);
  assert.doesNotMatch(markup, /nw-progress-text|aria-valuetext/);
});

test("shared text clips both layers at precisely the fill boundary", () => {
  const markup = renderToStaticMarkup(React.createElement(ProgressText, { percentage: 37.5 }, "37.5%"));
  assert.match(markup, /inset\(0 0 0 37.5%\)/);
  assert.match(markup, /inset\(0 62.5% 0 0\)/);
  assert.equal((markup.match(/37.5%<\/span>/g) ?? []).length, 2);
});
