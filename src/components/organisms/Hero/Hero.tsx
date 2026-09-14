import * as React from "react";
import "./hero.css";

export type HeroBackground = "none" | "subtle" | "primary" | "secondary";
export type HeroBottomBorder = "none" | "solid" | "gradient";

export interface HeroProps {
  /**
   * Main heading content. Rendered as given — pass a `Heading` element for correct
   * semantics (e.g. `<Heading level={1}>Name</Heading>`), styled however that call
   * site needs (`gradient`, `animateIn`, etc.).
   */
  title: React.ReactNode;
  /**
   * Secondary line rendered under the title/media row. Typically a `Heading` one
   * level below `title`'s — a natural place for a `TextCarousel` when it should
   * rotate through several options.
   */
  tagline?: React.ReactNode;
  /** Supporting copy under the title/tagline. Typically a `Text` element. */
  description?: React.ReactNode;
  /** Buttons or links rendered in a row under the description. */
  actions?: React.ReactNode;
  /**
   * Visual accompaniment — a photo, illustration, or a `Carousel` rotating through
   * several. Floats beside `title` at a fixed size, considerably smaller on narrow
   * screens than wide ones, rather than stacking below the rest of the content.
   */
  media?: React.ReactNode;
  /** Which side `media` sits on relative to `title`. Default `"end"` (right in LTR). */
  mediaPosition?: "start" | "end";
  /**
   * Background treatment distinguishing the hero from the surrounding page.
   * `"subtle"` tints it a touch relative to the page background; `"primary"`/`"secondary"`
   * tint it toward those theme colors. Adds matching internal padding so content isn't
   * flush against the tinted edge. Default `"none"` (transparent, no added padding).
   */
  background?: HeroBackground;
  /**
   * Decoration along the hero's bottom edge. `"solid"` is a thin neutral divider;
   * `"gradient"` is a primary→secondary gradient bar, echoing `Heading`'s `gradient`
   * treatment. Default `"none"`.
   */
  bottomBorder?: HeroBottomBorder;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Hero: an introductory banner with title and media side by side — media floats
 * beside the title at both wide and narrow screen sizes, shrinking considerably on
 * narrow ones rather than stacking below — and tagline/description/actions stacked
 * full-width underneath. Every slot renders exactly what it's given — Hero lays
 * content out, it does not impose heading semantics or styling on it.
 */
export function Hero({
  title,
  tagline,
  description,
  actions,
  media,
  mediaPosition = "end",
  background = "none",
  bottomBorder = "none",
  className = "",
}: HeroProps) {
  const cls = [
    "nw-hero",
    mediaPosition === "start" && "nw-hero--media-start",
    background !== "none" && `nw-hero--bg-${background}`,
    bottomBorder !== "none" && `nw-hero--border-${bottomBorder}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={cls}>
      <div className="nw-hero__top">
        <div className="nw-hero__title">{title}</div>
        {media ? <div className="nw-hero__media">{media}</div> : null}
      </div>
      {tagline}
      {description}
      {actions ? <div className="nw-hero__actions">{actions}</div> : null}
    </section>
  );
}

export default Hero;
