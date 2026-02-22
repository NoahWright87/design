import * as React from "react";
import "./link.css";

export type LinkMotion = "none" | "once" | "pulsing";
export type LinkVariant = "default" | "subtle" | "prominent";

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
  /**
   * Visual variant.
   * - "default": primary color, always underlined.
   * - "subtle": muted color, underline on hover only.
   * - "prominent": primary color, bold, always underlined.
   */
  variant?: LinkVariant;
  /** Additional CSS class name. */
  className?: string;
};

export function Link({ children, href, isExternal, motion = "pulsing", variant = "default", className = "" }: LinkProps) {
  const cls = [
    "nw-link",
    variant !== "default" && `nw-link--${variant}`,
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
