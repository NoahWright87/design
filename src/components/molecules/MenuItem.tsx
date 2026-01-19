import * as React from "react";
import { useContext } from "react";
import "./menuItem.css";

export interface MenuItemProps {
  text?: string;
  label?: string; // backward compatibility alias
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export const MenuContext = React.createContext<{ close: () => void } | null>(
  null
);

export function MenuItem({ text, label, icon, href, onClick }: MenuItemProps) {
  const ctx = useContext(MenuContext);

  const handleClick = () => {
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
      <a className="nw-menu-item" role="menuitem" href={href} onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="nw-menu-item" role="menuitem" onClick={handleClick}>
      {content}
    </button>
  );
}

export default MenuItem;
