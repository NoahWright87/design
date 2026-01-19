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
  /** Apply more shadow/elevation. */
  elevated?: boolean;
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
  elevated = false,
  className = "",
  ...rest
}: CardProps) {
  return (
    <article
      className={`nw-card${elevated ? " nw-card--elevated" : ""}${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {title ? <div className="nw-card__title">{title}</div> : null}
      {subtitle ? <div className="nw-card__subtitle">{subtitle}</div> : null}
      {children ? <div className="nw-card__content">{children}</div> : null}
    </article>
  );
}

export default Card;
