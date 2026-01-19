import * as React from "react";
import "./header.css";

export type HeaderProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  leftLabel?: React.ReactNode;
  centerLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
};

export function Header({
  left,
  center,
  right,
  leftLabel,
  centerLabel,
  rightLabel,
}: HeaderProps) {
  return (
    <header className="nw-header" role="banner">
      <div className="nw-header__slot nw-header__slot--left">
        <div className="nw-header__slot-element">{left}</div>
        {leftLabel && <div className="nw-header__slot-label">{leftLabel}</div>}
      </div>

      <div className="nw-header__slot nw-header__slot--center">
        <div className="nw-header__slot-element">{center}</div>
        {centerLabel && <div className="nw-header__slot-label">{centerLabel}</div>}
      </div>

      <div className="nw-header__slot nw-header__slot--right">
        <div className="nw-header__slot-element">{right}</div>
        {rightLabel && <div className="nw-header__slot-label">{rightLabel}</div>}
      </div>
    </header>
  );
}

export default Header;
