const CURSORS = ["🙅", "❌", "⛔", "🚫"];

/**
 * Returns a CSS cursor value using a randomly selected "no" emoji.
 * Call once per component instance (e.g. via useState lazy initializer).
 */
export function pickRandomDisabledCursor(): string {
  const emoji = CURSORS[Math.floor(Math.random() * CURSORS.length)];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="26" font-size="24">${emoji}</text></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}') 16 16, not-allowed`;
}
