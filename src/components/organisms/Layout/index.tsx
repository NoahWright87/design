import * as React from "react";
import "./layout.css";

type LayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

const DEFAULT_HEADER_HEIGHT = 48;
const DEFAULT_FOOTER_HEIGHT = 48;

export function Layout({ children, header, footer }: LayoutProps) {
  const style: React.CSSProperties = {
    paddingTop: DEFAULT_HEADER_HEIGHT,
    paddingBottom: DEFAULT_FOOTER_HEIGHT
  };

  return (
    <>
      <header>{header}</header>
      <div className="nw-layout" style={style}>
        {children}
      </div>
      <footer>{footer}</footer>
    </>
  );
}

export default Layout;
