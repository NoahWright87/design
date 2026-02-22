import * as React from "react";
import "./pill.css";

export type PillVariant = 'default' | 'primary' | 'secondary' | 'confirm' | 'danger';
export type PillSize = 'small' | 'medium' | 'large';

export type PillProps = {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: PillSize;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
};

export function Pill({ children, variant = 'default', size = 'medium', icon }: PillProps) {
  return (
    <span className={`nw-pill nw-pill--${variant} nw-pill--${size}${icon ? " nw-pill--with-icon" : ""}`}>
      {icon && <span className="nw-pill__icon" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

export default Pill;
