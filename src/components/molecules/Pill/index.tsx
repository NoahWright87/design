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
  /**
   * When provided, renders a dismiss (×) button inside the pill.
   * Called when the user clicks the dismiss button.
   */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Defaults to "Remove". */
  dismissLabel?: string;
};

export function Pill({ children, variant = 'default', size = 'medium', icon, onDismiss, dismissLabel = "Remove" }: PillProps) {
  const cls = [
    "nw-pill",
    `nw-pill--${variant}`,
    `nw-pill--${size}`,
    icon && "nw-pill--with-icon",
    onDismiss && "nw-pill--dismissable",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls}>
      {icon && <span className="nw-pill__icon" aria-hidden="true">{icon}</span>}
      {children}
      {onDismiss && (
        <button
          type="button"
          className="nw-pill__dismiss"
          onClick={onDismiss}
          aria-label={dismissLabel}
        >
          ×
        </button>
      )}
    </span>
  );
}

export default Pill;
