import * as React from "react";
import "./card.css";

/**
 * Card props for a simple elevated, rounded container.
 * Renders as a semantic article with optional title/subtitle and children content.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Optional media element rendered above the title. */
  image?: React.ReactNode;
  /** Optional URL that makes the entire card clickable. */
  href?: string;
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
  /** Allow card content to scroll vertically. */
  scrollable?: boolean;
  /** Constrain card content height. Accepts a CSS string (e.g. `"200px"`) or a pixel number. */
  maxHeight?: string | number;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Card: A rounded container with elevation.
 * Use for grouping related content with visual hierarchy.
 */
export function Card({
  image,
  href,
  title,
  subtitle,
  children,
  elevated = true,
  flat = false,
  footer,
  interactive = false,
  scrollable = false,
  maxHeight,
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

  const content = (
    <>
      {image ? <div className="nw-card__image">{image}</div> : null}
      {title ? <div className="nw-card__title">{title}</div> : null}
      {subtitle ? <div className="nw-card__subtitle">{subtitle}</div> : null}
      {children ? (
        <div
          className="nw-card__content"
          style={(scrollable || maxHeight != null) ? {
            overflowY: scrollable ? "auto" : undefined,
            maxHeight: maxHeight != null
              ? (typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight)
              : undefined,
          } : undefined}
        >
          {children}
        </div>
      ) : null}
      {footer ? <div className="nw-card__footer">{footer}</div> : null}
    </>
  );

  if (href) {
    return (
      <a
        className={[cls, "nw-card--link"].filter(Boolean).join(" ")}
        href={href}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return <article className={cls} {...rest}>{content}</article>;
}

export default Card;
