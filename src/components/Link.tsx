import * as React from "react";

export type LinkProps = {
  children: React.ReactNode;
  href: string;
};

export function Link({ children, href }: LinkProps) {
  return <a href={href}>{children}</a>;
}
