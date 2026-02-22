import * as React from "react";
import "./link.css";

export type LinkMotion = "none" | "once" | "pulsing";

export type LinkProps = {
  children: React.ReactNode;
  href: string;
  /**
   * Marks the link as external. Sets target="_blank" rel="noopener noreferrer"
   * and renders an animated ↗ indicator.
   */
  isExternal?: boolean;
  /** Hover animation style. Default: "pulsing". */
  motion?: LinkMotion;
  /** Additional CSS class name. */
  className?: string;
};

export function Link({ children, href, isExternal, motion = "pulsing", className = "" }: LinkProps) {
  const cls = [
    "nw-link",
    `nw-link--motion-${motion}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={href}
      className={cls}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {isExternal && (
        <span className="nw-link__external" aria-hidden="true">↗</span>
      )}
    </a>
  );
}

export default Link;
