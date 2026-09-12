import * as React from "react";
import "./hero.css";

export interface HeroProps {
  /**
   * Main heading content. Rendered as given — pass a `Heading` element for correct
   * semantics (e.g. `<Heading level={1}>Name</Heading>`), styled however that call
   * site needs (`gradient`, `animateIn`, etc.).
   */
  title: React.ReactNode;
  /**
   * Secondary line rendered under `title`. Typically a `Heading` one level below
   * `title`'s — a natural place for a `TextCarousel` when it should rotate through
   * several options.
   */
  tagline?: React.ReactNode;
  /** Supporting copy under the title/tagline. Typically a `Text` element. */
  description?: React.ReactNode;
  /** Buttons or links rendered in a row under the description. */
  actions?: React.ReactNode;
  /** Visual accompaniment — a photo, illustration, or a `Carousel` rotating through several. */
  media?: React.ReactNode;
  /** Which side `media` sits on relative to the text content. Default `"end"` (right in LTR). */
  mediaPosition?: "start" | "end";
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Hero: an introductory banner pairing a title/tagline/description/actions column
 * with an optional media slot that floats beside it on wide screens and stacks
 * below it on narrow ones. Every slot renders exactly what it's given — Hero lays
 * content out, it does not impose heading semantics or styling on it.
 */
export function Hero({
  title,
  tagline,
  description,
  actions,
  media,
  mediaPosition = "end",
  className = "",
}: HeroProps) {
  const cls = ["nw-hero", mediaPosition === "start" && "nw-hero--media-start", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={cls}>
      <div className="nw-hero__content">
        {title}
        {tagline}
        {description}
        {actions ? <div className="nw-hero__actions">{actions}</div> : null}
      </div>
      {media ? <div className="nw-hero__media">{media}</div> : null}
    </section>
  );
}

export default Hero;
