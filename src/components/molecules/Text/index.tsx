import * as React from "react";
import "./text.css";

export type TextAlign = "left" | "center" | "right" | "justify";
export type TextTone = "muted" | "subtle" | "error" | "success";

export type TextProps = {
  children: React.ReactNode;
  /** Override the rendered HTML element while keeping Text styling. Default: "p". */
  as?: keyof JSX.IntrinsicElements;
  /** Render as an inline element (span) instead of a block (p). */
  inline?: boolean;
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
  /** Shows a clipboard copy button on hover. */
  isCopyable?: boolean;
  /** Additional CSS class name. */
  className?: string;
};

export function Text({
  children,
  as,
  inline,
  truncate,
  maxLines,
  align,
  balance,
  tone,
  isCopyable,
  className = "",
}: TextProps) {
  const Tag = (as ?? (inline ? "span" : "p")) as React.ElementType;
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = React.useState(false);

  const cls = [
    truncate && "nw-text--truncate",
    maxLines && "nw-text--clamp",
    align && `nw-text--align-${align}`,
    balance && "nw-text--balance",
    tone && `nw-text--tone-${tone}`,
    isCopyable && "nw-text--copyable",
    className,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const style = maxLines ? ({ WebkitLineClamp: maxLines } as React.CSSProperties) : undefined;

  if (isCopyable) {
    function handleCopy() {
      const el = wrapperRef.current?.querySelector(".nw-text--copyable");
      const text = el?.textContent ?? "";
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }

    return (
      <span ref={wrapperRef} className="nw-text--copyable-wrapper">
        <Tag className={cls} style={style}>{children}</Tag>
        <button
          type="button"
          className={`nw-text__copy-btn${copied ? " nw-text__copy-btn--copied" : ""}`}
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy text"}
        >
          {copied ? "✓" : "⎘"}
        </button>
      </span>
    );
  }

  return <Tag className={cls} style={style}>{children}</Tag>;
}

export default Text;
