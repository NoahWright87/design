"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import "./card.css";

/**
 * Card props for a simple elevated, rounded container.
 * Renders as a semantic article with optional title/subtitle and children content.
 */
export type CardMediaPosition = "left" | "right" | "top";
export type CardExpandedImagePosition = "top" | "between";
type CardExpandPhase = "closed" | "opening" | "open" | "closing";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Optional media element rendered above the title. */
  image?: React.ReactNode;
  /**
   * Where the `image` is placed relative to the title/content/footer.
   * `"left"` and `"right"` collapse to `"top"` on small screens.
   * Default: `"top"`.
   */
  mediaPosition?: CardMediaPosition;
  /** Optional URL that makes the entire card clickable. */
  href?: string;
  /** Optional card title. */
  title?: React.ReactNode;
  /** Optional subtitle below title. */
  subtitle?: React.ReactNode;
  /** Card content. */
  children?: React.ReactNode;
  /** Apply more shadow/elevation. On by default; use `flat` to opt out. */
  elevated?: boolean;
  /** Remove elevation; render with the base minimal shadow. */
  flat?: boolean;
  /** Optional footer content rendered below children. */
  footer?: React.ReactNode;
  /** Enable hover lift and shadow transition. */
  interactive?: boolean;
  /** Allow card content to scroll vertically. */
  scrollable?: boolean;
  /** Constrain card content height. Accepts a CSS string (e.g. `"200px"`) or a pixel number. */
  maxHeight?: string | number;
  /** Additional CSS class name. */
  className?: string;

  /**
   * Longer content revealed only when the card expands into a modal-like view.
   * Providing this makes the card expandable: a maximize button appears, and
   * (when no `href` is set) clicking the card also expands it. When no short
   * `children` content is given, the collapsed card shows a clamped preview
   * of this text instead, cut off with an ellipsis.
   */
  longDescription?: React.ReactNode;
  /**
   * Where `image` is placed once the card is expanded. `"between"` (default)
   * moves a larger image between the short description and the long
   * description; `"top"` keeps it above the title as in the collapsed layout.
   */
  expandedImagePosition?: CardExpandedImagePosition;
  /** Controlled expanded state. Omit to let the card manage its own state. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. Default `false`. */
  defaultExpanded?: boolean;
  /** Called whenever the card expands or collapses. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Accessible label for the maximize button. Default `"Expand"`. */
  expandLabel?: string;
  /** Accessible label for the shrink button on the expanded card. Default `"Collapse"`. */
  collapseLabel?: string;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** Transform that visually places an element laid out at `to` so it appears at `from`. */
function flipTransform(from: DOMRect, to: DOMRect): string {
  const sx = to.width === 0 ? 1 : from.width / to.width;
  const sy = to.height === 0 ? 1 : from.height / to.height;
  const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
  const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
}

/**
 * Card: A rounded container with elevation.
 * Use for grouping related content with visual hierarchy. When `longDescription`
 * is provided, the card can grow in place into a larger modal-like view.
 */
export function Card({
  image,
  href,
  title,
  subtitle,
  children,
  elevated = true,
  flat = false,
  footer,
  interactive = false,
  scrollable = false,
  maxHeight,
  mediaPosition = "top",
  className = "",
  longDescription,
  expandedImagePosition = "between",
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  expandLabel = "Expand",
  collapseLabel = "Collapse",
  ...rest
}: CardProps) {
  const isExpandable = Boolean(longDescription);
  const isControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
  const expandedState = isControlled ? !!expandedProp : internalExpanded;

  const [phase, setPhase] = React.useState<CardExpandPhase>(
    isExpandable && expandedState ? "open" : "closed"
  );
  const rootRef = React.useRef<HTMLElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const flipRectRef = React.useRef<DOMRect | null>(null);
  const titleId = React.useId();
  const expandedTitleId = `${titleId}-expanded`;

  const setExpanded = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalExpanded(next);
      onExpandedChange?.(next);
    },
    [isControlled, onExpandedChange]
  );

  // Drive the phase machine off the (controlled or uncontrolled) expanded state.
  React.useLayoutEffect(() => {
    if (!isExpandable) return;
    if (expandedState && phase === "closed") {
      flipRectRef.current = rootRef.current?.getBoundingClientRect() ?? null;
      setPhase("opening");
    } else if (!expandedState && (phase === "open" || phase === "opening")) {
      flipRectRef.current = rootRef.current?.getBoundingClientRect() ?? null;
      setPhase("closing");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedState, isExpandable]);

  // Opening: snap the overlay to the origin card's rect, then release it to grow into place.
  React.useLayoutEffect(() => {
    if (phase !== "opening") return;
    const overlay = overlayRef.current;
    const from = flipRectRef.current;
    if (!overlay || !from) {
      setPhase("open");
      return;
    }
    if (prefersReducedMotion()) {
      setPhase("open");
      return;
    }
    const to = overlay.getBoundingClientRect();
    overlay.style.transition = "none";
    overlay.style.transform = flipTransform(from, to);
    // Force a reflow so the snapped position is committed before we transition away from it.
    void overlay.offsetHeight;
    const raf = requestAnimationFrame(() => {
      overlay.style.transition = "";
      overlay.style.transform = "";
    });
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Closing: transition the overlay back to the (freshly measured) origin rect.
  React.useLayoutEffect(() => {
    if (phase !== "closing") return;
    const overlay = overlayRef.current;
    const to = flipRectRef.current;
    if (!overlay || !to) {
      setPhase("closed");
      return;
    }
    if (prefersReducedMotion()) {
      setPhase("closed");
      return;
    }
    const from = overlay.getBoundingClientRect();
    const raf = requestAnimationFrame(() => {
      overlay.style.transform = flipTransform(to, from);
    });
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const handleOverlayTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (phase === "opening") setPhase("open");
    else if (phase === "closing") setPhase("closed");
  };

  // Escape always collapses the expanded card, matching Modal's dismissal guarantee.
  React.useEffect(() => {
    if (!isExpandable || phase === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isExpandable, phase, setExpanded]);

  const clickableToExpand = isExpandable && !href;
  const isSideMedia = Boolean(image) && mediaPosition !== "top";

  const cls = [
    "nw-card",
    elevated && !flat && "nw-card--elevated",
    interactive && "nw-card--interactive",
    clickableToExpand && "nw-card--expandable",
    phase !== "closed" && "nw-card--placeholder",
    isSideMedia && `nw-card--media-${mediaPosition}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const expandButton = isExpandable ? (
    <button
      type="button"
      className="nw-card__expand-button"
      aria-label={expandLabel}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setExpanded(true);
      }}
    >
      <span aria-hidden="true">⤢</span>
    </button>
  ) : null;

  const body = (
    <>
      {!isSideMedia && image ? <div className="nw-card__image">{image}</div> : null}
      {expandButton}
      {title ? (
        <div className="nw-card__title" id={titleId}>
          {title}
        </div>
      ) : null}
      {subtitle ? <div className="nw-card__subtitle">{subtitle}</div> : null}
      {children ? (
        <div
          className="nw-card__content"
          style={(scrollable || maxHeight != null) ? {
            overflowY: scrollable ? "auto" : undefined,
            maxHeight: maxHeight != null
              ? (typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight)
              : undefined,
          } : undefined}
        >
          {children}
        </div>
      ) : longDescription ? (
        <div className="nw-card__content nw-card__content--clamped">{longDescription}</div>
      ) : null}
      {footer ? <div className="nw-card__footer" onClick={(e) => e.stopPropagation()}>{footer}</div> : null}
    </>
  );

  const content = isSideMedia ? (
    <>
      <div className="nw-card__image nw-card__media">{image}</div>
      <div className="nw-card__body">{body}</div>
    </>
  ) : body;

  const { onClick: onClickRest, ...restWithoutClick } = rest as React.HTMLAttributes<HTMLElement>;

  const handleCardClick = clickableToExpand
    ? (e: React.MouseEvent<HTMLElement>) => {
      onClickRest?.(e);
      setExpanded(true);
    }
    : onClickRest;

  const cardElement = href ? (
    <a
      ref={rootRef as React.Ref<HTMLAnchorElement>}
      className={[cls, "nw-card--link"].filter(Boolean).join(" ")}
      href={href}
      {...(restWithoutClick as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      onClick={onClickRest as React.MouseEventHandler<HTMLAnchorElement> | undefined}
    >
      {content}
    </a>
  ) : (
    <article
      ref={rootRef as React.Ref<HTMLElement>}
      className={cls}
      {...restWithoutClick}
      onClick={handleCardClick}
    >
      {content}
    </article>
  );

  const expandedCls = [
    "nw-card",
    "nw-card__expanded",
    elevated && !flat && "nw-card--elevated",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const overlay = isExpandable && phase !== "closed" && typeof document !== "undefined"
    ? createPortal(
      <div
        className={`nw-card__backdrop nw-card__backdrop--${phase}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setExpanded(false);
        }}
        role="presentation"
      >
        <div
          ref={overlayRef}
          className={expandedCls}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? expandedTitleId : undefined}
          onTransitionEnd={handleOverlayTransitionEnd}
        >
          <button
            type="button"
            className="nw-card__collapse-button"
            aria-label={collapseLabel}
            onClick={() => setExpanded(false)}
          >
            <span aria-hidden="true">⤡</span>
          </button>
          {image && expandedImagePosition === "top" ? (
            <div className="nw-card__image nw-card__image--expanded">{image}</div>
          ) : null}
          {title ? (
            <div className="nw-card__title" id={expandedTitleId}>
              {title}
            </div>
          ) : null}
          {subtitle ? <div className="nw-card__subtitle">{subtitle}</div> : null}
          {children ? <div className="nw-card__content">{children}</div> : null}
          {image && expandedImagePosition !== "top" ? (
            <div className="nw-card__image nw-card__image--expanded">{image}</div>
          ) : null}
          {longDescription ? <div className="nw-card__long-description">{longDescription}</div> : null}
          {footer ? <div className="nw-card__footer">{footer}</div> : null}
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <>
      {cardElement}
      {overlay}
    </>
  );
}

export default Card;
