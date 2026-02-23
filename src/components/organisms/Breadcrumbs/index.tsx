import * as React from "react";
import "./breadcrumbs.css";

export interface BreadcrumbItem {
  /** Display label for this crumb. */
  label: string;
  /** Navigation URL. Omit for the current (last) page. */
  href?: string;
}

export interface BreadcrumbsProps {
  /** Ordered list of crumbs from root → current page. */
  items: BreadcrumbItem[];
  /**
   * Character or node rendered between crumbs.
   * @default "/"
   */
  separator?: React.ReactNode;
  /** Additional CSS class name. */
  className?: string;
}

export function Breadcrumbs({ items, separator = "/", className = "" }: BreadcrumbsProps) {
  const cls = ["nw-breadcrumbs", className].filter(Boolean).join(" ");

  return (
    <nav aria-label="Breadcrumb" className={cls}>
      <ol className="nw-breadcrumbs__list">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="nw-breadcrumbs__item">
              {isLast || !item.href ? (
                <span
                  className="nw-breadcrumbs__label nw-breadcrumbs__label--current"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="nw-breadcrumbs__link">
                  {item.label}
                </a>
              )}
              {!isLast && (
                <span className="nw-breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
