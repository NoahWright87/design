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
  /**
   * Fallback children for simple/unslotted usage.
   * Ignored when any slot prop is provided.
   */
  children?: React.ReactNode;
  /** Tooltip text shown on hover over the left slot. */
  leftTooltip?: string;
  /** Tooltip text shown on hover over the center slot. */
  centerTooltip?: string;
  /** Tooltip text shown on hover over the right slot. */
  rightTooltip?: string;
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
  children,
  leftTooltip,
  centerTooltip,
  rightTooltip,
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
      {left != null || center != null || right != null ? (
        <>
          <div className={`nw-header__slot nw-header__slot--left${leftLabel ? " nw-header__slot--stacked" : ""}`}>
            <div className="nw-header__slot-element">{left}</div>
            {leftLabel && <div className="nw-header__slot-label">{leftLabel}</div>}
            {leftTooltip && <div className="nw-header__tooltip" aria-hidden="true">{leftTooltip}</div>}
          </div>

          <div className={`nw-header__slot nw-header__slot--center${centerLabel ? " nw-header__slot--stacked" : ""}`}>
            <div className="nw-header__slot-element">{center}</div>
            {centerLabel && <div className="nw-header__slot-label">{centerLabel}</div>}
            {centerTooltip && <div className="nw-header__tooltip" aria-hidden="true">{centerTooltip}</div>}
          </div>

          <div className={`nw-header__slot nw-header__slot--right${rightLabel ? " nw-header__slot--stacked" : ""}`}>
            <div className="nw-header__slot-element">{right}</div>
            {rightLabel && <div className="nw-header__slot-label">{rightLabel}</div>}
            {rightTooltip && <div className="nw-header__tooltip" aria-hidden="true">{rightTooltip}</div>}
          </div>
        </>
      ) : (
        children
      )}
    </header>
  );
}

export default Header;
