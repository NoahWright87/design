import * as React from "react";

export type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
};

export function Heading({ level, children }: HeadingProps) {
  const Tag = ("h" + level) as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
}

export default Heading;
