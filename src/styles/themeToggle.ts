export type ThemeMode = 'light' | 'dark';

// Sets a data-theme attribute on <html> to drive CSS variable swaps.
export function setThemeMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = mode === 'dark' ? 'dark' : 'light';
}

// Toggles between light and dark themes and returns the applied mode.
export function toggleThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  return next as ThemeMode;
}

// Reads the current theme mode, defaulting to light when unset or server-side.
export function getThemeMode(): ThemeMode {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.dataset.theme as ThemeMode) || 'light';
}
