export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'nw-theme-mode';

// Sets a data-theme attribute on <html> to drive CSS variable swaps.
// Also persists the preference to localStorage.
export function setThemeMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = mode === 'dark' ? 'dark' : 'light';
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage unavailable (private browsing, etc.) — silently ignore
  }
}

// Toggles between light and dark themes and returns the applied mode.
// Briefly sets data-theme-transitioning on <html> so CSS can enable smooth color transitions.
export function toggleThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.themeTransitioning = '';
  setThemeMode(next as ThemeMode);
  setTimeout(() => {
    delete document.documentElement.dataset.themeTransitioning;
  }, 400);
  return next as ThemeMode;
}

// Reads the current theme mode from the DOM, defaulting to light when unset or server-side.
export function getThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.dataset.theme as ThemeMode) || 'light';
}

/**
 * Reads the persisted theme preference from localStorage (falling back to
 * `prefers-color-scheme`) and applies it to the document. Call this once on
 * app startup — e.g. inside a root `useEffect` or a `<script>` in `<head>`.
 */
export function initThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';

  let preferred: ThemeMode = 'light';

  // 1. Explicit user preference saved to localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'dark' || stored === 'light') {
      preferred = stored;
    } else {
      // 2. Fall back to system preference
      if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        preferred = 'dark';
      }
    }
  } catch {
    // localStorage unavailable — use system preference
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      preferred = 'dark';
    }
  }

  document.documentElement.dataset.theme = preferred;
  return preferred;
}
