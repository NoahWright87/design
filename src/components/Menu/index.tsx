import * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { MenuContext } from "./MenuItem";
import "./menu.css";

export interface MenuProps {
  trigger: React.ReactNode; // usually <Avatar /> or <HamburgerMenu />
  items: React.ReactNode[]; // <MenuItem> elements
  align?: "left" | "right"; // alignment of dropdown
}

export function Menu({ trigger, items, align = "left" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Prepare trigger element
  const renderTrigger = () => {
    // If it's an element we can augment, try to pass toggle handlers
    if (React.isValidElement(trigger)) {
      const props: Record<string, unknown> = {
        onClick: (e: React.MouseEvent) => {
          // Allow existing onClick to run
          if (typeof (trigger as any).props?.onClick === "function") {
            (trigger as any).props.onClick(e);
          }
          toggleMenu();
        },
        onToggle: toggleMenu,
        isOpen: open,
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": panelId,
      };

      // If the trigger is a native button, just clone; otherwise wrap with a button for semantics
      if (typeof trigger.type === "string" && trigger.type.toLowerCase() === "button") {
        return React.cloneElement(trigger, props as any);
      }

      return (
        <button
          type="button"
          className="nw-menu__trigger"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={panelId}
          onClick={toggleMenu}
        >
          {React.cloneElement(trigger, { isOpen: open } as any)}
        </button>
      );
    }

    // Fallback: wrap arbitrary nodes
    return (
      <button
        type="button"
        className="nw-menu__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={toggleMenu}
      >
        {trigger}
      </button>
    );
  };

  return (
    <div className={"nw-menu" + (align === "right" ? " nw-menu--right" : "") } ref={rootRef}>
      {renderTrigger()}

      {open && (
        <MenuContext.Provider value={{ close: closeMenu }}>
          {/* Overlay only shows on mobile via CSS */}
          <div className="nw-menu__overlay" onClick={closeMenu} aria-hidden></div>
          <div
            id={panelId}
            className={"nw-menu__panel"}
            role="menu"
          >
            {items.map((child, idx) => (
              <div className="nw-menu__item" key={idx}>
                {child}
              </div>
            ))}
          </div>
        </MenuContext.Provider>
      )}
    </div>
  );
}

export default Menu;
