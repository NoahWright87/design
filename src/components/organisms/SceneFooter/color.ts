export type RGB = [number, number, number];

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
export const rgba = (c: RGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

let probe: CanvasRenderingContext2D | null | undefined;

/**
 * Turns any CSS color the browser understands (hex, rgb(), hsl(), oklch(), color-mix(), ...)
 * into RGB by painting it on a 1x1 canvas. Returns `undefined` for anything invalid.
 * Browser-only.
 */
export function parseColor(value: string): RGB | undefined {
  if (!value) return undefined;
  if (probe === undefined) {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    probe = c.getContext("2d", { willReadFrequently: true });
  }
  if (!probe) return undefined;
  const sentinel = "#010203";
  probe.fillStyle = sentinel;
  probe.fillStyle = value; // an invalid value leaves the sentinel in place
  if (probe.fillStyle === sentinel && value.trim().toLowerCase() !== sentinel) return undefined;
  probe.clearRect(0, 0, 1, 1);
  probe.fillRect(0, 0, 1, 1);
  const d = probe.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

/** The first of `tokens` (CSS custom property names) that resolves to a valid color on `el`. */
export function readColorToken(el: Element, tokens: string[], fallback: RGB): RGB {
  const style = getComputedStyle(el);
  for (const token of tokens) {
    const parsed = parseColor(style.getPropertyValue(token).trim());
    if (parsed) return parsed;
  }
  return fallback;
}
