import * as React from "react";
import "./header.css";

export type HeaderProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
};

export function Header({ left, center, right }: HeaderProps) {
  return (
    <header className="nw-header" role="banner">
      <div className="nw-header__slot nw-header__slot--left">{left}</div>
      <div className="nw-header__slot nw-header__slot--center">{center}</div>
      <div className="nw-header__slot nw-header__slot--right">{right}</div>
    </header>
  );
}

export default Header;
