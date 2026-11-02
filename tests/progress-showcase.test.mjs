import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { build } from "esbuild";

test("showcase starts with six editable series, stacked poison, and an active value-color range", async () => {
  const bundle = await build({
    stdin: { contents: 'import React from "react"; import {renderToStaticMarkup} from "react-dom/server"; import {ProgressShowcase} from "./stories/examples/ProgressShowcase"; export const markup = renderToStaticMarkup(React.createElement(ProgressShowcase));', resolveDir: process.cwd(), loader: "tsx" },
    bundle: true, platform: "node", format: "cjs", write: false, loader: { ".css": "empty" },
  });
  const module = { exports: {} };
  new Function("require", "module", "exports", bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
  const markup = module.exports.markup;
  assert.equal((markup.match(/type="range"/g) ?? []).length, 6);
  for (const name of ["Safe health", "Pending poison", "Shield charge", "Shield recharge", "Reserve charge", "Bonus reserve"]) assert.ok(markup.includes(`${name} amount`));
  assert.match(markup, /data-series="poison" data-start="75" data-end="85"/);
  assert.match(markup, /data-series="shield"[^>]+color:var\(--warning\)/);
  assert.match(markup, />Player status 85%<\/span>/);
  assert.match(markup, /Shield charge range 1 upper %/);
  assert.match(markup, /Shield charge range 3 color/);
  assert.match(markup, /Reset showcase/);
  assert.match(markup, /Fill each layer/);
});
