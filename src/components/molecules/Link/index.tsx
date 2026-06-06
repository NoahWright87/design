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
  /** Icon rendered before the link text (e.g., a back chevron). */
  leadingIcon?: React.ReactNode;
  /** Icon rendered after the link text (e.g., a download arrow). */
  trailingIcon?: React.ReactNode;
  /** Shows a disclosure prompt before following the link. */
  isAffiliate?: boolean;
  /** Additional CSS class name. */
  className?: string;
  /**
   * Render as a custom component instead of `<a>`. Useful for integrating with
   * Next.js `<Link>` or React Router `<Link>`. The component receives `href`
   * and all other anchor props. For React Router (which uses `to` instead of
   * `href`), wrap it: `as={({ href, ...p }) => <RouterLink to={href} {...p} />}`.
   */
  as?: React.ElementType;
};

export function Link({ children, href, isExternal, motion = "pulsing", variant = "default", leadingIcon, trailingIcon, isAffiliate = false, className = "", as: Tag = "a" }: LinkProps) {
  const cls = [
    "nw-link",
    variant !== "default" && `nw-link--${variant}`,
    `nw-link--motion-${motion}`,
    (leadingIcon || trailingIcon) && "nw-link--has-icon",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const externalProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isAffiliate || typeof window === "undefined") {
      return;
    }

    const confirmed = window.confirm(
      "This is an affiliate link and may earn a commission. Continue?"
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <Tag href={href} className={cls} onClick={handleClick} {...externalProps}>
      {leadingIcon && (
        <span className="nw-link__icon nw-link__icon--leading" aria-hidden="true">{leadingIcon}</span>
      )}
      {children}
      {trailingIcon && (
        <span className="nw-link__icon nw-link__icon--trailing" aria-hidden="true">{trailingIcon}</span>
      )}
      {isExternal && (
        <span className="nw-link__external" aria-hidden="true">↗</span>
      )}
    </Tag>
  );
}

export default Link;
