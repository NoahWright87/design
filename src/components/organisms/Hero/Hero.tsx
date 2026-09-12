import * as React from "react";
import { Heading } from "../../molecules/Heading/index.js";
import "./hero.css";

export interface HeroProps {
  /** Main heading. Often just a name or greeting; pair with `tagline` for a rotating line. */
  title: React.ReactNode;
  /**
   * Secondary line rendered one heading level below `title`. A natural place for a
   * `TextCarousel` when the tagline should rotate through several options.
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
  /** Heading level for `title`. `tagline` renders one level below (clamped to 6). Default `1`. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Hero: an introductory banner pairing a title/tagline/description/actions column
 * with an optional media slot that floats beside it on wide screens and stacks
 * below it on narrow ones.
 */
export function Hero({
  title,
  tagline,
  description,
  actions,
  media,
  mediaPosition = "end",
  headingLevel = 1,
  className = "",
}: HeroProps) {
  const taglineLevel = (Math.min(headingLevel + 1, 6)) as 1 | 2 | 3 | 4 | 5 | 6;
  const cls = ["nw-hero", mediaPosition === "start" && "nw-hero--media-start", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={cls}>
      <div className="nw-hero__content">
        <Heading level={headingLevel}>{title}</Heading>
        {tagline ? <Heading level={taglineLevel}>{tagline}</Heading> : null}
        {description}
        {actions ? <div className="nw-hero__actions">{actions}</div> : null}
      </div>
      {media ? <div className="nw-hero__media">{media}</div> : null}
    </section>
  );
}

export default Hero;
