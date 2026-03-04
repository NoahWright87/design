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
  /** Additional CSS class name. */
  className?: string;
  /**
   * Render as a custom component instead of `<a>`. Useful for integrating with
   * Next.js `<Link>` or React Router `<Link>`. The component receives `href`
   * and all other anchor props. For React Router (which uses `to` instead of
   * `href`), wrap it: `as={({ href, ...p }) => <RouterLink to={href} {...p} />}`.
   */
  as?: React.ElementType;
  /**
   * When true, intercepts the click and shows an affiliate disclosure popup
   * before navigating. The user must confirm to continue.
   */
  isAffiliate?: boolean;
};

export function Link({ children, href, isExternal, motion = "pulsing", variant = "default", leadingIcon, trailingIcon, className = "", as: Tag = "a", isAffiliate }: LinkProps) {
  const [disclosureOpen, setDisclosureOpen] = React.useState(false);

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

  const handleClick = isAffiliate
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        setDisclosureOpen(true);
      }
    : undefined;

  const handleContinue = () => {
    setDisclosureOpen(false);
    if (isExternal) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
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
        {isAffiliate && (
          <span className="nw-link__affiliate-badge" aria-label="affiliate link" title="Affiliate link">§</span>
        )}
      </Tag>

      {disclosureOpen && (
        <div className="nw-link__affiliate-overlay" role="dialog" aria-modal="true" aria-label="Affiliate disclosure">
          <div className="nw-link__affiliate-panel">
            <p className="nw-link__affiliate-text">
              This is an affiliate link. We may earn a commission if you make a purchase through it, at no extra cost to you.
            </p>
            <div className="nw-link__affiliate-actions">
              <button
                type="button"
                className="nw-link__affiliate-continue"
                onClick={handleContinue}
              >
                Continue to site
              </button>
              <button
                type="button"
                className="nw-link__affiliate-cancel"
                onClick={() => setDisclosureOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Link;
