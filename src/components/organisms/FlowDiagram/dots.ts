import type { FlowDotType } from "./types.js";

/** Color tokens usable directly as dot types. */
const TOKEN_TYPES = ["foreground", "primary", "secondary", "confirm", "danger"] as const;

/** Friendly aliases for common kinds of traffic. */
const ALIASES: Record<string, string> = {
  success: "confirm",
  ok: "confirm",
  error: "danger",
  fail: "danger",
};

export const BUILTIN_DOT_TYPES: Readonly<Record<string, FlowDotType>> = (() => {
  const types: Record<string, FlowDotType> = {};
  for (const token of TOKEN_TYPES) types[token] = { color: token, shape: "circle" };
  for (const [alias, token] of Object.entries(ALIASES)) types[alias] = { color: token, shape: "circle" };
  return types;
})();

export function isKnownDotType(name: string, custom?: Record<string, FlowDotType>): boolean {
  return Boolean(custom?.[name] ?? BUILTIN_DOT_TYPES[name]);
}

/** Resolve a dot type name to its look. Unknown names fall back to the foreground color. */
export function resolveDotType(name: string, custom?: Record<string, FlowDotType>): Required<FlowDotType> {
  const found = custom?.[name] ?? BUILTIN_DOT_TYPES[name] ?? { color: "foreground" };
  return { color: ALIASES[found.color] ?? found.color, shape: found.shape ?? "circle" };
}

/** Resolve a color token (or alias) to a CSS value usable in SVG styles. */
export function cssColor(token: string): string {
  const name = ALIASES[token] ?? token;
  return `var(--${name})`;
}

export function tokenName(token: string): string {
  return ALIASES[token] ?? token;
}
