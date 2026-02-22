import * as React from "react";
import "./card.css";

/**
 * Card props for a simple elevated, rounded container.
 * Renders as a semantic article with optional title/subtitle and children content.
 */
export interface CardProps {
  /** Optional card title. */
  title?: React.ReactNode;
  /** Optional subtitle below title. */
  subtitle?: React.ReactNode;
  /** Card content. */
  children?: React.ReactNode;
  /** Apply more shadow/elevation. On by default; use `flat` to opt out. */
  elevated?: boolean;
  /** Remove elevation; render with the base minimal shadow. */
  flat?: boolean;
  /** Optional footer content rendered below children. */
  footer?: React.ReactNode;
  /** Enable hover lift and shadow transition. */
  interactive?: boolean;
  /** Additional CSS class name. */
  className?: string;
  /** Any other standard HTML article attributes. */
  [key: string]: any;
}

/**
 * Card: A rounded container with elevation.
 * Use for grouping related content with visual hierarchy.
 */
export function Card({
  title,
  subtitle,
  children,
  elevated = true,
  flat = false,
  footer,
  interactive = false,
  className = "",
  ...rest
}: CardProps) {
  const cls = [
    "nw-card",
    elevated && !flat && "nw-card--elevated",
    interactive && "nw-card--interactive",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cls} {...rest}>
      {title ? <div className="nw-card__title">{title}</div> : null}
      {subtitle ? <div className="nw-card__subtitle">{subtitle}</div> : null}
      {children ? <div className="nw-card__content">{children}</div> : null}
      {footer ? <div className="nw-card__footer">{footer}</div> : null}
    </article>
  );
}

export default Card;
