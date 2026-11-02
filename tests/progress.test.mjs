import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as library from "../dist/index.mjs";
const { Progress, resolveProgressLayers, getProgressState, getProgressColor } = library;
const render = props => renderToStaticMarkup(React.createElement(Progress, { label: "Status", ...props }));
const health = { id: "health", label: "Health", series: [{ id: "hp", label: "Health", value: 75, color: "red" }, { id: "poison", label: "Poison", value: 10, color: "green" }] };

test("public progress UI has one component entry point", () => {
  assert.equal(typeof Progress, "function");
  for (const name of ["ProgressBar", "ProgressPie", "ProgressRing", "ProgressSegmentedBar", "LinearProgress", "RadialProgress"]) assert.equal(library[name], undefined);
});
test("series stack as amounts with an unfilled remainder", () => {
  const [layer] = resolveProgressLayers([health]);
  assert.deepEqual(layer.series.map(({ start, end }) => [start, end]), [[0, 75], [75, 85]]);
  assert.equal(layer.state.percentage, 85);
});
test("series colors depend on their own values with inclusive range boundaries", () => {
  const ranges = [{ upTo: 100, color: "green" }, { upTo: 10, color: "red" }, { upTo: 50, color: "yellow" }];
  for (const [value, color] of [[0, "red"], [10, "red"], [10.1, "yellow"], [50, "yellow"], [50.1, "green"]]) {
    assert.equal(getProgressColor(value, ranges).color, color);
    assert.equal(resolveProgressLayers([{ ...health, series: [{ id: "x", label: "X", value, colorRanges: ranges }] }])[0].series[0].resolvedColor, color);
  }
});
test("independent capacities, duplicate identities, overflow, and invalid amounts resolve immutably", () => {
  const series = Object.freeze([Object.freeze({ id: "a", label: "A", value: 40 }), Object.freeze({ id: "b", label: "B", value: 40 }), Object.freeze({ id: "b", label: "Duplicate", value: 1 }), Object.freeze({ id: "bad", label: "Bad", value: NaN })]);
  const layer = Object.freeze({ id: "shield", label: "Shield", max: 50, series });
  const resolved = resolveProgressLayers(Object.freeze([layer, layer, health]));
  assert.equal(resolved.length, 2);
  assert.deepEqual(resolved[0].series.map(s => s.amount), [40, 10, 0]);
  assert.equal(resolved[0].state.percentage, 100);
  assert.equal(resolved[1].state.percentage, 85);
  assert.equal(series[1].value, 40);
});
test("all shapes share exact stacking geometry and accessible series values", () => {
  for (const shape of ["BarHorizontal", "BarVertical", "Pie", "Ring"]) {
    const markup = render({ shape, layers: [health] });
    assert.match(markup, /data-series="poison" data-start="75" data-end="85"/);
    assert.match(markup, /aria-label="Poison" aria-valuemin="0" aria-valuemax="100" aria-valuenow="10"/);
    assert.match(markup, /role="group" aria-label="Status"/);
  }
});
test("radial layers are concentric while bar layers overlap", () => {
  const layers = [health, { id: "shield", label: "Shield", appearance: "hatched", series: [{ id: "shield", label: "Shield", value: 60 }] }];
  const pie = render({ shape: "Pie", layers });
  const ring = render({ shape: "Ring", layers });
  assert.match(pie, /data-layer="health"[^>]+inset:19px/);
  assert.match(pie, /data-layer="shield"[^>]+inset:0/);
  assert.equal((ring.match(/nw-progress-layer--band/g) ?? []).length, 2);
  assert.equal((pie.match(/nw-progress-layer--band/g) ?? []).length, 1);
  const bar = render({ layers });
  assert.equal((bar.match(/inset:0/g) ?? []).length, 2);
  assert.match(bar, /nw-progress-series--hatched/);
});
test("continuous and segmented forms work with all four shapes", () => {
  for (const shape of ["BarHorizontal", "BarVertical", "Pie", "Ring"]) {
    for (const segments of [0, null, -1, NaN]) assert.doesNotMatch(render({ shape, value: 35.5, segments }), /cells--segmented/);
    assert.match(render({ shape, value: 35.5, segments: 10 }), /cells--segmented/);
    assert.match(render({ shape, value: 35.5, segments: 10 }), /aria-valuenow="35.5"/);
  }
});
test("label positions and hidden labels preserve numeric accessibility", () => {
  for (const position of ["top", "bottom", "left", "right", "center", "none"]) {
    const markup = render({ value: 65, labelPosition: position, text: "Charging" });
    assert.match(markup, /aria-valuenow="65"/);
    assert.match(markup, /aria-valuetext="Charging"/);
    if (position === "none") assert.doesNotMatch(markup, /nw-progress-caption|nw-progress-text/);
    else assert.match(markup, /Charging/);
  }
});
test("the configured label is visible by default and explicit text overrides it", () => {
  for (const shape of ["BarHorizontal", "BarVertical", "Pie", "Ring"]) {
    for (const labelPosition of ["center", "top", "bottom", "left", "right"]) {
      const markup = render({ label: "My health", value: 65, shape, labelPosition });
      assert.match(markup, />My health 65%<\/span>/);
    }
    assert.match(render({ label: "My health", layers: [health], shape }), />My health 85%<\/span>/);
  }
  const custom = render({ label: "My health", value: 65, text: "Ready" });
  assert.match(custom, />Ready<\/span>/);
  assert.doesNotMatch(custom, />My health 65%<\/span>/);
  assert.match(custom, /aria-label="My health"/);
  assert.doesNotMatch(render({ label: "My health", value: 65, text: false }), /nw-progress-text|nw-progress-caption/);
});
test("scalar domains remain normalized and explicit layers are authoritative", () => {
  assert.equal(getProgressState({ value: 0, min: -50, max: 150 }).percentage, 25);
  for (const value of [NaN, Infinity, -Infinity]) assert.equal(getProgressState({ value }).value, 0);
  assert.match(render({ value: 999, max: 100 }), /aria-valuenow="100"/);
  assert.match(render({ value: 999, layers: [health] }), /aria-valuetext/); // total is exposed below
  assert.match(render({ value: 999, layers: [health] }), /aria-label="Health total"[^>]+aria-valuenow="85"/);
});
