import type * as React from "react";

/**
 * Inline custom properties the CSS-only Horizon look needs, so it matches the live scene.
 * Kept out of the scene chunk: the server renders this, and it must stay tiny.
 */
export function horizonStaticStyle(options: Record<string, unknown>): React.CSSProperties {
  const pct = (v: unknown, fallback: number) => {
    const n = typeof v === "number" && Number.isFinite(v) ? Math.min(0.95, Math.max(0.05, v)) : fallback;
    return `${(n * 100).toFixed(2)}%`;
  };
  return {
    ["--nw-scene-sun-x" as string]: pct(options.sunX, 0.7),
    ["--nw-scene-moon-x" as string]: pct(options.moonX, 0.3),
  };
}
