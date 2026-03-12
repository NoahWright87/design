"use client";
import * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { MenuContext, MenuItem, MenuItemProps } from "../../molecules/MenuItem";
import "./menu.css";

export type OpenCloseIcon = { open: React.ReactNode; close: React.ReactNode };

export interface MenuProps {
  trigger: React.ReactNode; // usually <Avatar /> or <HamburgerMenu />
  items?: Array<MenuItemProps | React.ReactNode>; // typed items (icon, text, href) or custom nodes
  align?: "left" | "right"; // alignment of dropdown
  icons?: OpenCloseIcon; // open/close icons for the built-in trigger wrapper
  label?: string; // accessible label for the trigger wrapper
  children?: React.ReactNode; // custom menu items
}

export function Menu({ trigger, items = [], align = "left", icons, label, children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

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

  // Prevent layout shift from scrollbar appearing/disappearing when menu opens
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevScrollbarGutter = html.style.scrollbarGutter;
    const prevOverflowX = html.style.overflowX;
    html.style.scrollbarGutter = "stable";
    html.style.overflowX = "hidden";
    return () => {
      html.style.scrollbarGutter = prevScrollbarGutter;
      html.style.overflowX = prevOverflowX;
    };
  }, [open]);

  const commonAria = {
    "aria-expanded": open,
    "aria-haspopup": "menu" as const,
    "aria-controls": panelId,
  };

  // Prepare trigger element
  const renderTrigger = () => {
    // If it's an element we can augment, try to pass toggle handlers
    if (React.isValidElement(trigger)) {
      const existingOnClick = (trigger as any).props?.onClick as
        | ((e: React.MouseEvent) => void)
        | undefined;
      const existingClassName = (trigger as any).props?.className as string | undefined;

      // Prefer cloning the provided trigger to avoid nested buttons and preserve semantics.
      return React.cloneElement(trigger, {
        ...commonAria,
        className: existingClassName,
        onClick: (e: React.MouseEvent) => {
          existingOnClick?.(e);
          toggleMenu();
        },
        onToggle: toggleMenu,
        isOpen: open,
      } as any);
    }

    // Fallback: wrap arbitrary nodes
    return (
      <button
        type="button"
        className="nw-menu__trigger"
        aria-label={label ?? "Toggle menu"}
        onClick={toggleMenu}
        {...commonAria}
      >
        {icons ? (open ? icons.close : icons.open) : trigger}
      </button>
    );
  };

  const renderedItems =
    items.length > 0
      ? items.map((item, idx) =>
          typeof item === "object" && item !== null && "text" in item ? (
            <MenuItem key={idx} {...(item as MenuItemProps)} />
          ) : (
            <div key={idx}>{item as React.ReactNode}</div>
          )
        )
      : React.Children.toArray(children);

  return (
    <div
      className={`nw-menu${align === "right" ? " nw-menu--right" : ""}${open ? " nw-menu--open" : ""}`}
      ref={rootRef}
    >
      {renderTrigger()}

      {open && (
        <MenuContext.Provider value={{ close: closeMenu }}>
          {/* Overlay only shows on mobile via CSS */}
          <div className="nw-menu__overlay" onClick={closeMenu} aria-hidden={true}></div>
          <div id={panelId} className={"nw-menu__panel"} role="menu">
            {renderedItems.map((child, idx) => (
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
