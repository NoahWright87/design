"use client";
import * as React from "react";
import "./carousel.css";

export interface CarouselProps {
  /** Slides to rotate through, in order. */
  items: React.ReactNode[];
  /** Aspect ratio of the carousel's viewport (e.g. `"16 / 9"`). Default `"16 / 9"`. */
  aspectRatio?: string;
  /** Automatically advance through slides. Default `true`. */
  autoPlay?: boolean;
  /** Milliseconds between automatic advances. Default `5000`. */
  interval?: number;
  /** Pause automatic advancing while hovered or focused within. Default `true`. */
  pauseOnHover?: boolean;
  /** Controlled active slide index. Omit to let the carousel manage its own state. */
  activeIndex?: number;
  /** Initial active slide index when uncontrolled. Default `0`. */
  defaultActiveIndex?: number;
  /** Called whenever the active slide changes, whether by autoplay or user interaction. */
  onActiveIndexChange?: (index: number) => void;
  /** Accessible label for the carousel region. Default `"Carousel"`. */
  "aria-label"?: string;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Carousel: Rotates through a list of slides with a simple crossfade,
 * arrow and dot navigation that loops at either end, and autoplay that
 * pauses on hover or focus.
 */
export function Carousel({
  items,
  aspectRatio = "16 / 9",
  autoPlay = true,
  interval = 5000,
  pauseOnHover = true,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  "aria-label": ariaLabel = "Carousel",
  className = "",
}: CarouselProps) {
  const count = items.length;
  const isControlled = activeIndexProp !== undefined;
  const [internalIndex, setInternalIndex] = React.useState(defaultActiveIndex);
  const activeIndex = isControlled ? activeIndexProp! : internalIndex;
  const [paused, setPaused] = React.useState(false);

  const goTo = React.useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count;
      if (!isControlled) setInternalIndex(next);
      onActiveIndexChange?.(next);
    },
    [count, isControlled, onActiveIndexChange]
  );

  React.useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    const id = setInterval(() => goTo(activeIndex + 1), interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, count, interval, activeIndex, goTo]);

  if (count === 0) return null;

  const showControls = count > 1;
  const cls = ["nw-carousel", className].filter(Boolean).join(" ");

  return (
    <div
      className={cls}
      style={{ aspectRatio }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      onFocus={pauseOnHover ? () => setPaused(true) : undefined}
      onBlur={
        pauseOnHover
          ? (e: React.FocusEvent<HTMLDivElement>) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
          }
          : undefined
      }
    >
      <div className="nw-carousel__viewport">
        {items.map((item, i) => (
          <div
            key={i}
            className={`nw-carousel__slide${i === activeIndex ? " nw-carousel__slide--active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i === activeIndex ? undefined : true}
          >
            {item}
          </div>
        ))}
      </div>

      {showControls ? (
        <>
          <button
            type="button"
            className="nw-carousel__arrow nw-carousel__arrow--prev"
            aria-label="Previous slide"
            onClick={() => goTo(activeIndex - 1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="nw-carousel__arrow nw-carousel__arrow--next"
            aria-label="Next slide"
            onClick={() => goTo(activeIndex + 1)}
          >
            <span aria-hidden="true">›</span>
          </button>
          <div className="nw-carousel__dots">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`nw-carousel__dot${i === activeIndex ? " nw-carousel__dot--active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Carousel;
