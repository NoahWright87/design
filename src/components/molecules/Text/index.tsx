import * as React from "react";
import "./text.css";

export type TextAlign = "left" | "center" | "right" | "justify";
export type TextTone = "muted" | "subtle" | "error" | "success";

export type TextProps = {
  children: React.ReactNode;
  /** Truncates text to a single line with an ellipsis. */
  truncate?: boolean;
  /** Clamps text to N lines with an ellipsis. */
  maxLines?: number;
  /** Text alignment. */
  align?: TextAlign;
  /** Applies text-wrap: balance for natural line breaks. */
  balance?: boolean;
  /** Contextual color tone. */
  tone?: TextTone;
  /** Additional CSS class name. */
  className?: string;
};

export function Text({ children, truncate, maxLines, align, balance, tone, className = "" }: TextProps) {
  const cls = [
    truncate && "nw-text--truncate",
    maxLines && "nw-text--clamp",
    align && `nw-text--align-${align}`,
    balance && "nw-text--balance",
    tone && `nw-text--tone-${tone}`,
    className,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const style = maxLines ? ({ WebkitLineClamp: maxLines } as React.CSSProperties) : undefined;

  return <p className={cls} style={style}>{children}</p>;
}

export default Text;
