import * as React from "react";
import "./header.css";

export type HeaderProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  leftLabel?: React.ReactNode;
  centerLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  /** Custom background color, gradient, or image (any valid CSS background value). */
  background?: string;
  /** Show a bottom shadow/border. On by default. */
  shadow?: boolean;
  /**
   * Opt-in to a fixed header. By default, the header is sticky
   * to avoid overlapping page content.
   */
  fixed?: boolean;
};

export function Header({
  left,
  center,
  right,
  leftLabel,
  centerLabel,
  rightLabel,
  background,
  shadow = true,
  fixed = false,
}: HeaderProps) {
  const cls = [
    "nw-header",
    fixed ? "nw-header--fixed" : "nw-header--sticky",
    !shadow && "nw-header--no-shadow",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header
      className={cls}
      role="banner"
      style={background ? { background } : undefined}
    >
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
