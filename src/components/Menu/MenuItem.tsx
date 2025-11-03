import * as React from "react";
import { useContext } from "react";
import "./menuItem.css";

interface MenuItemProps {
  label: string;
  onClick?: () => void;
}

export const MenuContext = React.createContext<{ close: () => void } | null>(
  null
);

export function MenuItem({ label, onClick }: MenuItemProps) {
  const ctx = useContext(MenuContext);
  const handleClick = () => {
    try {
      onClick?.();
    } finally {
      ctx?.close();
    }
  };

  return (
    <button type="button" className="nw-menu-item" role="menuitem" onClick={handleClick}>
      {label}
    </button>
  );
}

export default MenuItem;
