import * as React from "react";
import "./layout.css";

export type LayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Layout: Full-page container with optional header/footer.
 * Uses flexbox to keep footer at bottom on short pages.
 * Content area grows to fill available space.
 * For SPA routing, pass your router outlet as children—header/footer stay mounted.
 */
export function Layout({ children, header, footer }: LayoutProps) {
  return (
    <div className="nw-layout">
      {header}
      <main className="nw-layout__content">
        {children}
      </main>
      {footer}
    </div>
  );
}

export default Layout;
