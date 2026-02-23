import * as React from "react";
import "./badge.css";

export type BadgeVariant = "default" | "primary" | "secondary" | "confirm" | "danger";

export interface BadgeProps {
  /** Number to display. Hidden when 0. */
  count?: number;
  /** Maximum before showing "max+". Defaults to 99. */
  max?: number;
  /** Show as a small dot with no count text. */
  dot?: boolean;
  /** Color variant. Defaults to "danger" for notification conventions. */
  variant?: BadgeVariant;
  /**
   * Optional element to wrap — the badge overlays the top-right corner.
   * When omitted, renders the badge inline on its own.
   */
  children?: React.ReactNode;
  /** Accessible label. Defaults to "count notifications". */
  label?: string;
}

export function Badge({
  count,
  max = 99,
  dot = false,
  variant = "danger",
  children,
  label,
}: BadgeProps) {
  const hidden = !dot && (count === undefined || count === 0);

  const displayCount = dot
    ? null
    : count !== undefined && count > max
    ? `${max}+`
    : count;

  const ariaLabel = label ?? (count !== undefined ? `${count} notifications` : undefined);

  const cls = [
    "nw-badge",
    `nw-badge--${variant}`,
    dot && "nw-badge--dot",
    hidden && "nw-badge--hidden",
  ]
    .filter(Boolean)
    .join(" ");

  const badge = (
    <span className={cls} aria-label={ariaLabel} role="status">
      {displayCount}
    </span>
  );

  if (children) {
    return (
      <span className="nw-badge-wrapper">
        {children}
        {badge}
      </span>
    );
  }

  return badge;
}

export default Badge;
