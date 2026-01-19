import * as React from "react";
import "./hamburger.css";

export interface HamburgerMenuProps {
  isOpen?: boolean; // controlled by Menu
  onToggle?: () => void;
}

export function HamburgerMenu({ isOpen = false, onToggle }: HamburgerMenuProps) {
  return (
    <button
      type="button"
      className={"hamburger" + (isOpen ? " open" : "")}
      aria-label="Menu"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

export default HamburgerMenu;
