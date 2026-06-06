import * as React from "react";
import { useContext } from "react";
import "./menuItem.css";

export interface MenuItemProps {
  text?: string;
  label?: string; // backward compatibility alias
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const MenuContext = React.createContext<{ close: () => void } | null>(
  null
);

export function MenuItem({ text, label, icon, href, onClick, disabled = false }: MenuItemProps) {
  const ctx = useContext(MenuContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.();
    ctx?.close();
  };

  const contentText = text ?? label ?? "";

  const content = (
    <>
      {icon ? <span className="nw-menu-item__icon" aria-hidden="true">{icon}</span> : null}
      <span className="nw-menu-item__text">{contentText}</span>
    </>
  );

  if (href) {
    return (
      <a
        className={["nw-menu-item", disabled && "nw-menu-item--disabled"].filter(Boolean).join(" ")}
        role="menuitem"
        href={href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={["nw-menu-item", disabled && "nw-menu-item--disabled"].filter(Boolean).join(" ")}
      role="menuitem"
      onClick={handleClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

export default MenuItem;
