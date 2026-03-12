import * as React from "react";
import "./card.css";

export interface CardGridProps {
  /** Minimum card width for auto-fill columns. Defaults to `"280px"`. */
  minCardWidth?: string;
  /** Gap between cards. Defaults to `"md"`. */
  gap?: "sm" | "md" | "lg";
  /** Fix the number of columns instead of using auto-fill. */
  columns?: number;
  children?: React.ReactNode;
  className?: string;
}

export function CardGrid({
  minCardWidth = "280px",
  gap = "md",
  columns,
  children,
  className = "",
}: CardGridProps) {
  const cls = ["nw-card-grid", `nw-card-grid--gap-${gap}`, className]
    .filter(Boolean)
    .join(" ");

  const style: React.CSSProperties = columns
    ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
    : { "--nw-card-grid-min": minCardWidth } as React.CSSProperties;

  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}

export default CardGrid;
