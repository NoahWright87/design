import * as React from "react";

export interface CardFooterProps {
  children: React.ReactNode;
  align?: "start" | "end" | "center" | "space-between";
}

export function CardFooter({ children, align = "end" }: CardFooterProps) {
  return (
    <div className={`nw-card-footer nw-card-footer--${align}`}>
      {children}
    </div>
  );
}
