/** Runs `callback` when the browser is idle (or soon after, where `requestIdleCallback` is missing). Returns a canceller. */
export function onIdle(callback: () => void, timeout = 1000): () => void {
  if (typeof window === "undefined") return () => {};
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 50);
  return () => window.clearTimeout(id);
}
