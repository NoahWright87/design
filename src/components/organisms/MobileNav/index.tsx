import * as React from "react";
import "./mobileNav.css";

export interface MobileNavProps {
  /** Navigation items */
  children: React.ReactNode;
  /** Label for the menu toggle */
  label?: string;
}

/**
 * MobileNav: Pure CSS mobile navigation using checkbox hack.
 * Fully SSR-compatible, no JavaScript required.
 * For desktop, render children directly; for mobile, wrap in collapsible menu.
 */
export function MobileNav({ children, label = "Menu" }: MobileNavProps) {
  return (
    <nav className="nw-mobile-nav">
      <input type="checkbox" id="nw-mobile-nav-toggle" className="nw-mobile-nav__checkbox" />
      <label htmlFor="nw-mobile-nav-toggle" className="nw-mobile-nav__toggle" aria-label={label}>
        <span></span>
        <span></span>
        <span></span>
      </label>
      <div className="nw-mobile-nav__content">
        {children}
      </div>
    </nav>
  );
}

export default MobileNav;
