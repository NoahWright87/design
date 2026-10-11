/**
 * A reader's override for how animated a `SceneFooter` is, kept the same way the theme is:
 * stored in `localStorage` and mirrored on `<html>` (`data-footer-style`) so styles and
 * subscribers can react to it, whoever changed it.
 *
 *  - `auto`     the site's own choice (the default)
 *  - `static`   the still CSS footer only; no scene code is fetched
 *  - `flat`     the scene with a calm, flat mirror reflection (no ripple, no WebGL code)
 *  - `animated` the scene with the rippling WebGL reflection where the browser can run it
 *
 * `flat` and `animated` are an explicit request for motion, so they apply even where the site
 * calls for a calm footer and on devices the footer would otherwise leave still to save data or
 * battery. A system-level preference for reduced motion always wins.
 */
export type FooterStyle = "auto" | "static" | "flat" | "animated";

export const FOOTER_STYLES: readonly FooterStyle[] = ["auto", "static", "flat", "animated"];

const STORAGE_KEY = "nw-footer-style";

const isFooterStyle = (value: unknown): value is FooterStyle =>
  typeof value === "string" && (FOOTER_STYLES as readonly string[]).includes(value);

/** The current override: the `<html>` attribute, then the stored choice, then `auto`. Server-safe. */
export function getFooterStyle(): FooterStyle {
  if (typeof document === "undefined") return "auto";
  const fromAttribute = document.documentElement.dataset.footerStyle;
  if (isFooterStyle(fromAttribute)) return fromAttribute;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isFooterStyle(stored)) return stored;
  } catch {
    // storage unavailable (private browsing, blocked cookies): fall through
  }
  return "auto";
}

/** Sets and remembers the override. Mounted footers react immediately. */
export function setFooterStyle(style: FooterStyle): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.footerStyle = style;
  try {
    localStorage.setItem(STORAGE_KEY, style);
  } catch {
    // storage unavailable: the choice still lasts for this page view
  }
}

/** Calls `callback` whenever the override changes, however it was changed. Returns an unsubscribe. */
export function subscribeFooterStyle(callback: (style: FooterStyle) => void): () => void {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") return () => {};
  const observer = new MutationObserver(() => callback(getFooterStyle()));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-footer-style"] });
  return () => observer.disconnect();
}
