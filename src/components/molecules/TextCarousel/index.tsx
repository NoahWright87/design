"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTypewriter } from "../../../atoms/useTypewriter.js";
import "./textCarousel.css";

export type TextCarouselAnimation = "crossfade" | "sequential" | "typewriter";

export interface TextCarouselProps {
  /** Strings to rotate through, in order. */
  items: string[];
  /** How each transition plays. Default `"crossfade"`. */
  animation?: TextCarouselAnimation;
  /** HTML element to render as. Default `"span"`. */
  as?: keyof JSX.IntrinsicElements;
  /** Milliseconds each item stays fully visible before transitioning onward. Default `2500`. */
  interval?: number;
  /** Milliseconds the fade itself takes. Applies to `"crossfade"` and `"sequential"` only. Default `350`. */
  transitionDuration?: number;
  /** Milliseconds per character while typing. Applies to `"typewriter"` only. Default `45`. */
  typingSpeed?: number;
  /** Milliseconds per character while deleting. Applies to `"typewriter"` only. Default `30`. */
  deletingSpeed?: number;
  /** Pause the rotation while hovered. Default `true`. */
  pauseOnHover?: boolean;
  /** Additional CSS class name. */
  className?: string;
}

interface AnimationProps {
  items: string[];
  Tag: React.ElementType;
  interval: number;
  transitionDuration: number;
  typingSpeed: number;
  deletingSpeed: number;
  isPaused: boolean;
  hoverHandlers: Pick<React.HTMLAttributes<HTMLElement>, "onMouseEnter" | "onMouseLeave">;
  className: string;
}

function CrossfadeText({ items, Tag, interval, transitionDuration, isPaused, hoverHandlers, className }: AnimationProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const id = window.setInterval(() => setActiveIndex((i) => (i + 1) % items.length), interval);
    return () => window.clearInterval(id);
  }, [isPaused, items.length, interval]);

  const style = { "--nw-text-carousel-duration": `${transitionDuration}ms` } as React.CSSProperties;
  const cls = ["nw-text-carousel", "nw-text-carousel--crossfade", className].filter(Boolean).join(" ");

  return (
    <Tag className={cls} style={style} {...hoverHandlers}>
      {items.map((item, i) => (
        <span
          key={item + i}
          className={`nw-text-carousel__frame${i === activeIndex ? " nw-text-carousel__frame--active" : ""}`}
          aria-hidden={i === activeIndex ? undefined : true}
        >
          {item}
        </span>
      ))}
    </Tag>
  );
}

function SequentialText({ items, Tag, interval, transitionDuration, isPaused, hoverHandlers, className }: AnimationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    if (!hidden) {
      const timeoutId = window.setTimeout(() => setHidden(true), interval);
      return () => window.clearTimeout(timeoutId);
    }
    const timeoutId = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % items.length);
      setHidden(false);
    }, transitionDuration);
    return () => window.clearTimeout(timeoutId);
  }, [isPaused, items.length, interval, transitionDuration, hidden]);

  const style = { "--nw-text-carousel-duration": `${transitionDuration}ms` } as React.CSSProperties;
  const cls = [
    "nw-text-carousel",
    "nw-text-carousel--sequential",
    hidden && "nw-text-carousel--hidden",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Tag className={cls} style={style} {...hoverHandlers}>
      {items[activeIndex % items.length]}
    </Tag>
  );
}

function TypewriterText({ items, Tag, interval, typingSpeed, deletingSpeed, isPaused, hoverHandlers, className }: AnimationProps) {
  const { text, isDwelling } = useTypewriter(items, {
    typingSpeed,
    deletingSpeed,
    dwellMs: interval,
    isPaused,
  });

  const cls = ["nw-text-carousel", "nw-text-carousel--typewriter", className].filter(Boolean).join(" ");

  return (
    <Tag className={cls} {...hoverHandlers}>
      {text}
      <span
        className={`nw-text-carousel__cursor${isDwelling || isPaused ? " nw-text-carousel__cursor--blink" : ""}`}
        aria-hidden="true"
      />
    </Tag>
  );
}

/**
 * TextCarousel rotates through a list of strings in place, using one of a few
 * animation styles (crossfade, sequential fade, or typewriter). Pairs naturally
 * with `Hero`'s `tagline` slot, but works anywhere a rotating label is useful —
 * e.g. a `Heading`'s children, or plain inline text.
 */
export function TextCarousel({
  items,
  animation = "crossfade",
  as,
  interval = 2500,
  transitionDuration = 350,
  typingSpeed = 45,
  deletingSpeed = 30,
  pauseOnHover = true,
  className = "",
}: TextCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (items.length === 0) return null;

  const Tag = (as ?? "span") as React.ElementType;
  const hoverHandlers = pauseOnHover
    ? { onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false) }
    : {};

  const shared: AnimationProps = {
    items,
    Tag,
    interval,
    transitionDuration,
    typingSpeed,
    deletingSpeed,
    isPaused,
    hoverHandlers,
    className,
  };

  if (animation === "typewriter") return <TypewriterText {...shared} />;
  if (animation === "sequential") return <SequentialText {...shared} />;
  return <CrossfadeText {...shared} />;
}

export default TextCarousel;
