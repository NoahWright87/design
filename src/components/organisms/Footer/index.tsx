import * as React from "react";
import "./footer.css";

export type FooterProps = {
  /** Content for the left slot. */
  left?: React.ReactNode;
  /** Content for the center slot. */
  center?: React.ReactNode;
  /** Content for the right slot. */
  right?: React.ReactNode;
  /**
   * Bottom strip content (legal text, copyright, etc.).
   * Only rendered when populated.
   */
  bottom?: React.ReactNode;
  /** Border between the main area and the bottom slot. */
  hasBottomSeparator?: boolean;
  /** Anchor the footer to the bottom of the viewport on short pages. */
  isSticky?: boolean;
  /** Opt into a fixed footer. Takes precedence over isSticky. */
  fixed?: boolean;
  /**
   * Fallback children for simple/unslotted usage.
   * Ignored when any slot prop is provided.
   */
  children?: React.ReactNode;
};

export function Footer({
  left,
  center,
  right,
  bottom,
  hasBottomSeparator = false,
  isSticky = false,
  fixed = false,
  children,
}: FooterProps) {
  const positionClass = fixed
    ? "nw-footer--fixed"
    : isSticky
    ? "nw-footer--sticky"
    : "nw-footer--static";

  const hasSlots = left != null || center != null || right != null;

  return (
    <footer className={`nw-footer ${positionClass}`}>
      <div className="nw-footer__main">
        {hasSlots ? (
          <>
            <div className="nw-footer__slot nw-footer__slot--left">{left}</div>
            <div className="nw-footer__slot nw-footer__slot--center">{center}</div>
            <div className="nw-footer__slot nw-footer__slot--right">{right}</div>
          </>
        ) : (
          children
        )}
      </div>
      {bottom != null && (
        <div className={`nw-footer__bottom${hasBottomSeparator ? " nw-footer__bottom--separated" : ""}`}>
          {bottom}
        </div>
      )}
    </footer>
  );
}

export default Footer;
