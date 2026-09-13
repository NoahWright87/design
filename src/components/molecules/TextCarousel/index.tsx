"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTypewriter } from "../../../atoms/useTypewriter.js";
import { usePrefersReducedMotion } from "../../../atoms/usePrefersReducedMotion.js";
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
  /** Average milliseconds per character while typing. Applies to `"typewriter"` only. Default `45`. */
  typingSpeed?: number;
  /**
   * Randomizes each character's typing delay by up to this fraction of `typingSpeed` in
   * either direction, so typing reads as a human cadence rather than a metronome — the
   * average stays at `typingSpeed`. Applies to `"typewriter"` only. Default `0.4`.
   */
  typingSpeedJitter?: number;
  /**
   * Milliseconds per character while deleting — constant, simulating a held backspace
   * key. Applies to `"typewriter"` only. Default `30`.
   */
  deletingSpeed?: number;
  /**
   * Randomizes `interval` (used as the dwell time between typing and deleting) by up to
   * this fraction in either direction, so not every word lingers for the same beat.
   * Applies to `"typewriter"` only. Default `0.5`.
   */
  dwellJitter?: number;
  /**
   * Milliseconds paused, fully erased, before typing the next word begins. Applies to
   * `"typewriter"` only. Default `400`.
   */
  pauseBeforeTyping?: number;
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
  typingSpeedJitter: number;
  deletingSpeed: number;
  dwellJitter: number;
  pauseBeforeTyping: number;
  isPaused: boolean;
  hoverHandlers: Pick<React.HTMLAttributes<HTMLElement>, "onMouseEnter" | "onMouseLeave">;
  className: string;
}

/**
 * Every item sits in the same grid cell (rendered in full, invisibly) purely to reserve
 * the tallest/widest space any of them could need, so surrounding content never shifts
 * as `visible` grows, shrinks, or wraps to a different number of lines mid-animation.
 */
function SizeReservingStack({ items, visible }: { items: string[]; visible: React.ReactNode }) {
  return (
    <span className="nw-text-carousel__stack">
      {items.map((item, i) => (
        <span key={i} className="nw-text-carousel__ghost" aria-hidden="true">
          {item}
        </span>
      ))}
      <span className="nw-text-carousel__visible">{visible}</span>
    </span>
  );
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
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    // Reduced motion: swap directly on the interval, skipping the hidden dwell entirely
    // (holding `hidden` for transitionDuration with no CSS transition reads as a blank gap).
    if (prefersReducedMotion) {
      const timeoutId = window.setTimeout(() => {
        setActiveIndex((i) => (i + 1) % items.length);
      }, interval);
      return () => window.clearTimeout(timeoutId);
    }

    if (!hidden) {
      const timeoutId = window.setTimeout(() => setHidden(true), interval);
      return () => window.clearTimeout(timeoutId);
    }
    const timeoutId = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % items.length);
      setHidden(false);
    }, transitionDuration);
    return () => window.clearTimeout(timeoutId);
  }, [isPaused, items.length, interval, transitionDuration, hidden, prefersReducedMotion]);

  const style = { "--nw-text-carousel-duration": `${transitionDuration}ms` } as React.CSSProperties;
  const cls = [
    "nw-text-carousel",
    "nw-text-carousel--sequential",
    hidden && "nw-text-carousel--hidden",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Tag className={cls} style={style} {...hoverHandlers}>
      <SizeReservingStack items={items} visible={items[activeIndex % items.length]} />
    </Tag>
  );
}

function TypewriterText({
  items,
  Tag,
  interval,
  typingSpeed,
  typingSpeedJitter,
  deletingSpeed,
  dwellJitter,
  pauseBeforeTyping,
  isPaused,
  hoverHandlers,
  className,
}: AnimationProps) {
  const { text, cursor, isDwelling } = useTypewriter(items, {
    typingSpeed,
    typingSpeedJitter,
    deletingSpeed,
    dwellMs: interval,
    dwellJitter,
    pauseBeforeTyping,
    isPaused,
  });

  const cls = ["nw-text-carousel", "nw-text-carousel--typewriter", className].filter(Boolean).join(" ");

  return (
    <Tag className={cls} {...hoverHandlers}>
      <SizeReservingStack
        items={items}
        visible={
          <>
            {text.slice(0, cursor)}
            <span
              className={`nw-text-carousel__cursor${isDwelling || isPaused ? " nw-text-carousel__cursor--blink" : ""}`}
              aria-hidden="true"
            />
            {text.slice(cursor)}
          </>
        }
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
  typingSpeedJitter = 0.4,
  deletingSpeed = 30,
  dwellJitter = 0.5,
  pauseBeforeTyping = 400,
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
    typingSpeedJitter,
    deletingSpeed,
    dwellJitter,
    pauseBeforeTyping,
    isPaused,
    hoverHandlers,
    className,
  };

  if (animation === "typewriter") return <TypewriterText {...shared} />;
  if (animation === "sequential") return <SequentialText {...shared} />;
  return <CrossfadeText {...shared} />;
}

export default TextCarousel;
