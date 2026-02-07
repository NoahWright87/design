import * as React from "react";
import "./footer.css";

export type FooterProps = {
  /** Opt into a fixed footer. Default is static in-flow. */
  fixed?: boolean;
  /** Opt into sticky footer. If both fixed and sticky are true, fixed wins. */
  sticky?: boolean;
  /** Footer content */
  children?: React.ReactNode;
};

export function Footer({ fixed = false, sticky = false, children }: FooterProps) {
  const variantClass = fixed
    ? "nw-footer--fixed"
    : sticky
    ? "nw-footer--sticky"
    : "nw-footer--static";

  return (
    <footer className={`nw-footer ${variantClass}`}>
      {children || "Footer test"}
    </footer>
  );
}

export default Footer;
