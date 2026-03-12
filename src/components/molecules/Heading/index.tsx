import * as React from "react";
import "./heading.css";

function getChildrenText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getChildrenText).join("");
  if (React.isValidElement(children)) {
    return getChildrenText((children.props as { children?: React.ReactNode }).children ?? "");
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  /** Text color — accepts any CSS color value, e.g. `var(--primary)`. Ignored when `gradient` is set. */
  color?: string;
  /** Text alignment. */
  align?: "left" | "center" | "right";
  /** Clamp to a single line with an ellipsis on overflow. */
  truncate?: boolean;
  /** Fill heading text with a primary→secondary gradient. Overrides `color`. */
  gradient?: boolean;
  /** Render a solid colored bottom border beneath the heading text. */
  underline?: boolean;
  /** Small uppercase label rendered above the heading. */
  eyebrow?: string;
  /** Icon (emoji or node) rendered before the heading text. */
  iconStart?: React.ReactNode;
  /** Icon (emoji or node) rendered after the heading text. */
  iconEnd?: React.ReactNode;
  /** Fade + slide in when the heading enters the viewport (IntersectionObserver). */
  animateIn?: boolean;
  /** Reveal a ¶ button on hover; clicking copies the heading's anchor URL to clipboard. */
  anchorLink?: boolean;
};

export function Heading({
  level,
  children,
  color,
  align,
  truncate,
  gradient,
  underline,
  eyebrow,
  iconStart,
  iconEnd,
  animateIn,
  anchorLink,
}: HeadingProps) {
  const Tag = ("h" + level) as keyof JSX.IntrinsicElements;
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = React.useState(!animateIn);

  React.useEffect(() => {
    if (!animateIn) return;
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animateIn]);

  const rawSlug = anchorLink ? slugify(getChildrenText(children)) : undefined;
  const anchorSlug = rawSlug || undefined;

  const style: React.CSSProperties = {};
  if (color && !gradient) style.color = color;
  if (align) style.textAlign = align;
  if (truncate) {
    style.overflow = "hidden";
    style.whiteSpace = "nowrap";
    style.textOverflow = "ellipsis";
  }
  if (gradient) {
    style.backgroundImage = "linear-gradient(90deg, var(--primary), var(--secondary))";
    style.backgroundClip = "text";
    style.WebkitBackgroundClip = "text";
    style.WebkitTextFillColor = "transparent";
  }
  if (underline) {
    style.borderBottom = "3px solid var(--primary)";
    style.paddingBottom = "0.15em";
  }
  if (iconStart !== undefined || iconEnd !== undefined) {
    style.display = "flex";
    style.alignItems = "center";
    style.gap = "0.4em";
  }

  const anchorButton = anchorSlug ? (
    <button
      className="nw-heading-anchor-link"
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          const url = window.location.href.split("#")[0] + "#" + anchorSlug;
          navigator.clipboard?.writeText(url);
        }
      }}
      aria-label="Copy link to this section"
    >
      ¶
    </button>
  ) : null;

  const hasStyle = Object.keys(style).length > 0;

  const headingEl = (
    <Tag style={hasStyle ? style : undefined}>
      {iconStart && (
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
          {iconStart}
        </span>
      )}
      {children}
      {iconEnd && (
        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
          {iconEnd}
        </span>
      )}
      {anchorButton}
    </Tag>
  );

  const needsWrapper = !!eyebrow || !!animateIn || !!anchorLink;
  if (!needsWrapper) return headingEl;

  const wrapperClasses = [
    anchorLink && "nw-heading-anchor-wrapper",
    animateIn && "nw-heading-wrapper--animate",
    animateIn && (revealed ? "nw-heading-wrapper--revealed" : "nw-heading-wrapper--hidden"),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      id={anchorSlug}
      ref={wrapperRef}
      className={wrapperClasses || undefined}
    >
      {eyebrow && <span className="nw-heading__eyebrow">{eyebrow}</span>}
      {headingEl}
    </div>
  );
}

export default Heading;
