import * as React from "react";
import { ToggleIcon } from "../ToggleIcon/index.js";

/** @deprecated Use `<ToggleIcon preset="hamburger" />` directly. */
export interface HamburgerMenuProps {
  isOpen?: boolean;   // controlled by Menu
  onToggle?: () => void;
}

/**
 * Thin wrapper around `<ToggleIcon preset="hamburger">` kept for backwards compatibility.
 * Prefer using ToggleIcon directly in new code.
 */
export function HamburgerMenu({ isOpen = false, onToggle }: HamburgerMenuProps) {
  return (
    <ToggleIcon
      preset="hamburger"
      isToggled={isOpen}
      onChange={() => onToggle?.()}
    />
  );
}

export default HamburgerMenu;
