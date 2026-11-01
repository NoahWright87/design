import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LinearProgress, RadialProgress, ProgressBar, ProgressPie, ProgressRing, ProgressSegmentedBar, ProgressText } from "../dist/index.mjs";

const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, { label: "Health", value: 60, ...props }));

test("all presentations retain the same bounded value contract", () => {
  for (const Component of [LinearProgress, RadialProgress, ProgressBar, ProgressPie, ProgressRing, ProgressSegmentedBar]) {
    const markup = render(Component, { value: -100, min: -50, max: 150 });
    assert.match(markup, /aria-valuenow="-50"/);
    assert.match(markup, /aria-valuemin="-50"/);
    assert.match(markup, /aria-valuemax="150"/);
    assert.match(markup, /aria-valuetext="0%"/);
    assert.equal((markup.match(/role="progressbar"/g) ?? []).length, 1);
  }
});

test("both continuous and segmented bars fill on their selected axis", () => {
  for (const Component of [ProgressBar, ProgressSegmentedBar]) {
    const horizontal = render(Component, { value: 37.5 });
    const vertical = render(Component, { value: 37.5, orientation: "vertical" });
    assert.match(horizontal, /width:37.5%/);
    assert.match(vertical, /height:37.5%/);
    assert.match(vertical, /nw-progress--vertical/);
    assert.match(vertical, /aria-valuenow="37.5"/);
  }
  const text = renderToStaticMarkup(React.createElement(ProgressText, { shape: "vertical", percentage: 37.5 }, "Label"));
  assert.match(text, /inset\(0 0 37.5% 0\)/);
  assert.match(text, /inset\(62.5% 0 0 0\)/);
});

test("segment settings preserve fractional values and sanitize numeric configuration", () => {
  const defaultSegments = render(ProgressSegmentedBar);
  assert.match(defaultSegments, /--nw-progress-segments:10/);
  assert.match(defaultSegments, /nw-progress-label/);
  for (const [segments, expected] of [[3.9, 3], [500, 100], [0, 1], [-1, 1], [NaN, 1], [Infinity, 1]]) {
    const markup = render(ProgressSegmentedBar, { segments, value: 35.5, gap: -5 });
    assert.match(markup, new RegExp(`--nw-progress-segments:${expected}(?:;|\")`));
    assert.match(markup, /--nw-progress-gap:3px/);
    assert.match(markup, /width:35.5%/);
    assert.match(markup, /aria-valuenow="35.5"/);
  }
});

test("rings keep the sweep and label independent of band width", () => {
  for (const thickness of [8, 16, 28]) {
    const markup = render(ProgressRing, { value: 75, thickness });
    assert.match(markup, /nw-progress--ring/);
    assert.match(markup, /--nw-progress-angle:270deg/);
    assert.match(markup, /--nw-progress-angle:0deg/);
    assert.match(markup, new RegExp(`--nw-progress-band:${thickness}px`));
    assert.match(markup, /width:128px;height:128px/);
    assert.match(markup, /aria-valuetext="75%"/);
  }
  assert.match(render(ProgressRing, { size: 128, thickness: 999 }), /--nw-progress-band:60px/);
  assert.match(render(ProgressRing, { thickness: NaN }), /--nw-progress-band:16px/);
});

test("layer paint order is behind, primary, over, with independent value domains", () => {
  const layers = Object.freeze([
    Object.freeze({ id: "armor", label: "Armor", value: 30, max: 50, placement: "over", thickness: 6, color: "var(--primary)" }),
    Object.freeze({ id: "damage", label: "Recent health", value: 80, max: 100, color: "var(--danger)" }),
  ]);
  for (const Component of [ProgressBar, ProgressSegmentedBar, ProgressPie, ProgressRing]) {
    const markup = render(Component, { layers, value: 40 });
    const order = [...markup.matchAll(/data-progress-layer="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(order, ["damage", "primary", "armor"]);
    assert.match(markup, /role="group" aria-label="Health"/);
    const values = [...markup.matchAll(/<span role="progressbar"[^>]*>/g)].map(match => match[0]);
    assert.equal(values.length, 3);
    assert.ok(values.find(value => value.includes('aria-label="Armor"') && value.includes('aria-valuenow="30"') && value.includes('aria-valuemax="50"')));
    assert.ok(values.find(value => value.includes('aria-label="Health"') && value.includes('aria-valuenow="40"')));
    assert.match(markup, /nw-progress-label/);
    assert.doesNotMatch(markup.split('class="nw-progress-values"')[0], /role="progressbar"/);
  }
  assert.equal(layers[0].id, "armor");
});

test("duplicate layer identities keep the first value, and empty layers preserve single semantics", () => {
  const markup = render(ProgressBar, { layers: [
    { id: "armor", label: "Armor", value: NaN, max: 50 },
    { id: "armor", label: "Duplicate", value: 45, max: 50 },
  ] });
  assert.equal((markup.match(/data-progress-layer="armor"/g) ?? []).length, 1);
  assert.match(markup, /aria-label="Armor" aria-valuemin="0" aria-valuemax="50" aria-valuenow="0"/);
  assert.doesNotMatch(markup, /Duplicate/);
  const empty = render(ProgressBar, { layers: [] });
  assert.doesNotMatch(empty, /role="group"|nw-progress-values/);
  assert.equal((empty.match(/role="progressbar"/g) ?? []).length, 1);
});

test("radial overlay bands stay inside the ring opening", () => {
  const markup = render(ProgressRing, { thickness: 12, layers: [{ id: "armor", label: "Armor", value: 70, placement: "over", thickness: 100 }] });
  assert.match(markup, /style="--nw-progress-band:12px" data-progress-layer="armor"/);
  assert.doesNotMatch(markup, /--nw-progress-band:100px/);
});

test("application wrappers can style bases and render normalized decorative content", () => {
  for (const Component of [LinearProgress, RadialProgress]) {
    const markup = render(Component, {
      value: 150, className: "app-meter", style: { width: 240, "--progress-duration": "400ms" },
      text: ({ value }) => `HP ${value}`,
      children: ({ value, isFull }) => React.createElement("strong", null, `${value} ${isFull ? "ready" : "charging"}`),
    });
    assert.match(markup, /app-meter/);
    assert.match(markup, /width:240px/);
    assert.match(markup, /--progress-duration:400ms/);
    assert.match(markup, /<strong>100 ready<\/strong>/);
    assert.match(markup, /aria-valuetext="HP 100"/);
    assert.doesNotMatch(markup, /nw-progress-text|nw-progress-label/);
  }
});
