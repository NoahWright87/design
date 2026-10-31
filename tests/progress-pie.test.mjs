import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProgressBar, ProgressPie, ProgressText, getProgressState, getProgressText } from "../dist/index.mjs";

const render = props => renderToStaticMarkup(React.createElement(ProgressPie, { label: "Completion", ...props }));

test("pie sweep and text share exact angles at empty, quarter, half, and full states", () => {
  for (const [value, angle] of [[0, 0], [25, 90], [50, 180], [75, 270], [100, 360]]) {
    const markup = render({ value });
    assert.equal((markup.match(new RegExp(`--nw-progress-angle:${angle}deg`, "g")) ?? []).length, 2);
    assert.match(markup, /nw-progress-text--pie/);
    assert.match(markup, new RegExp(`aria-valuenow="${value}"`));
    assert.doesNotMatch(markup, /clip-path/);
  }
});

test("pie and bar expose identical normalized values, colors, and formatted descriptions", () => {
  const props = {
    label: "Experience", value: 250, min: 100, max: 300,
    colorRanges: [{ upTo: 100, color: "var(--confirm)", textColor: "var(--foreground)" }],
    text: ({ value, max }) => `${value} / ${max} XP`,
  };
  for (const Component of [ProgressPie, ProgressBar]) {
    const markup = renderToStaticMarkup(React.createElement(Component, props));
    for (const attribute of ["role=\"progressbar\"", "aria-label=\"Experience\"", "aria-valuemin=\"100\"", "aria-valuemax=\"300\"", "aria-valuenow=\"250\"", "aria-valuetext=\"250 / 300 XP\""]) {
      assert.ok(markup.includes(attribute));
    }
    assert.match(markup, /var\(--confirm\)/);
    assert.match(markup, /var\(--foreground\)/);
  }
});

test("pie diameter stays square and invalid sizes restore the default", () => {
  for (const size of [64, 192, 96.5]) assert.ok(render({ value: 50, size }).includes(`width:${size}px;height:${size}px`));
  for (const size of [undefined, NaN, Infinity, 0, -1]) assert.match(render({ value: 50, size }), /width:128px;height:128px/);
});

test("pie clamps invalid or out-of-domain values and hides text accessibly", () => {
  assert.match(render({ value: 999, max: 15 }), /aria-valuenow="15"/);
  assert.match(render({ value: NaN }), /aria-valuenow="0"/);
  const hidden = render({ value: 35, text: false });
  assert.match(hidden, /aria-valuenow="35"/);
  assert.doesNotMatch(hidden, /aria-valuetext|nw-progress-text/);
});

test("shared text keeps horizontal clipping by default and supports pie masking", () => {
  const bar = renderToStaticMarkup(React.createElement(ProgressText, { percentage: 25 }, "Label"));
  assert.match(bar, /inset\(0 75% 0 0\)/);
  assert.doesNotMatch(bar, /nw-progress-text--pie/);
  const pie = renderToStaticMarkup(React.createElement(ProgressText, { percentage: 25, shape: "pie" }, "Label"));
  assert.match(pie, /--nw-progress-angle:90deg/);
  assert.doesNotMatch(pie, /clip-path/);
});

test("shared text formatter preserves custom and hidden labels and receives normalized state", () => {
  const state = getProgressState({ value: 500, max: 300 });
  assert.equal(getProgressText(state), "100%");
  assert.equal(getProgressText(state, "Ready"), "Ready");
  assert.equal(getProgressText(state, ""), "");
  assert.equal(getProgressText(state, false), false);
  assert.equal(getProgressText(state, progress => `${progress.value} / ${progress.max}`), "300 / 300");
});
