import * as React from "react";
import "./pill.css";

export type PillVariant = 'default' | 'primary' | 'secondary' | 'confirm' | 'danger';
export type PillSize = 'small' | 'medium' | 'large';

export type PillProps = {
  children: React.ReactNode;
  variant?: PillVariant;
  size?: PillSize;
};

export function Pill({ children, variant = 'default', size = 'medium' }: PillProps) {
  return (
    <span className={`nw-pill nw-pill--${variant} nw-pill--${size}`}>
      {children}
    </span>
  );
}

export default Pill;
