import * as React from "react";
import "./mobileNav.css";

export interface MobileNavProps {
  /** Navigation items */
  children: React.ReactNode;
  /** Label for the menu toggle */
  label?: string;
  /**
   * Close the phone dropdown when a link or button inside it is clicked.
   * Needed with client-side routers, where the page never reloads to reset it.
   * Defaults to true.
   */
  closeOnNavigate?: boolean;
}

/**
 * MobileNav: Pure CSS mobile navigation using checkbox hack.
 * Fully SSR-compatible; JavaScript only adds close-on-navigate once hydrated.
 * For desktop, render children directly; for mobile, wrap in collapsible menu.
 * Mark the current page's link with aria-current="page" to highlight it.
 */
export function MobileNav({ children, label = "Menu", closeOnNavigate = true }: MobileNavProps) {
  const toggleId = React.useId();
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  const handleContentClick = closeOnNavigate
    ? (event: React.MouseEvent<HTMLDivElement>) => {
        // WHY: the target can be a text node, which has no closest().
        const target = event.target;
        if (checkboxRef.current && target instanceof Element && target.closest("a, button")) {
          checkboxRef.current.checked = false;
        }
      }
    : undefined;

  return (
    <nav className="nw-mobile-nav">
      <input ref={checkboxRef} type="checkbox" id={toggleId} className="nw-mobile-nav__checkbox" />
      <label htmlFor={toggleId} className="nw-mobile-nav__toggle" aria-label={label}>
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div className="nw-mobile-nav__content" onClick={handleContentClick}>
        {children}
      </div>
    </nav>
  );
}

export default MobileNav;
