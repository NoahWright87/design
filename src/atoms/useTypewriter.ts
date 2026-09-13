"use client";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

export interface UseTypewriterOptions {
  /** Average milliseconds per character while typing. Default `45`. */
  typingSpeed?: number;
  /**
   * Randomizes each character's typing delay by up to this fraction of `typingSpeed`
   * in either direction (e.g. `0.4` varies a 45ms delay between 27ms and 63ms), so
   * typing reads as a human cadence rather than a metronome. The average stays at
   * `typingSpeed`. Set `0` for a constant rate. Default `0.4`.
   */
  typingSpeedJitter?: number;
  /** Milliseconds per character while deleting — constant, simulating a held backspace key. Default `30`. */
  deletingSpeed?: number;
  /** Average milliseconds a fully-typed word stays on screen before it starts deleting. Default `2200`. */
  dwellMs?: number;
  /**
   * Randomizes each dwell by up to this fraction of `dwellMs` in either direction, so
   * not every word lingers for exactly the same beat. Set `0` for a constant dwell.
   * Default `0.5`.
   */
  dwellJitter?: number;
  /** Milliseconds paused, fully erased, before typing the next word begins. Default `400`. */
  pauseBeforeTyping?: number;
  /** Freezes the animation wherever it currently is — e.g. while hovered. Default `false`. */
  isPaused?: boolean;
}

export interface UseTypewriterResult {
  /** The currently visible substring of the active word. */
  text: string;
  /**
   * `true` while there's no per-character animation in progress — dwelling on a
   * fully-typed word, or pausing between deleting and the next word. A natural cue
   * for a caller to blink a caret.
   */
  isDwelling: boolean;
  /** Index into `words` of the word currently being typed/dwelled/deleted. */
  activeIndex: number;
}

type Phase = "typing" | "dwelling" | "deleting" | "pausing";

function jitter(base: number, amount: number): number {
  if (amount <= 0) return base;
  const factor = 1 + (Math.random() * 2 - 1) * amount;
  return Math.max(1, Math.round(base * factor));
}

/**
 * Drives a typewriter effect over a list of words: types each one out a character at a
 * time, dwells on it fully typed, deletes it a character at a time, pauses briefly, then
 * types the next word (looping). Typing speed and dwell time are randomized within a
 * range around their averages so the rhythm reads as human rather than mechanical;
 * deleting stays constant, simulating a held backspace key. Honors `prefers-reduced-motion`
 * by skipping the per-character animation and simply dwelling on each full word in turn.
 *
 * This hook only computes the text to display — pairing it with a blinking caret and
 * wiring up pause-on-hover is left to the caller (see `TextCarousel`'s `"typewriter"`
 * animation for a ready-made version).
 */
export function useTypewriter(
  words: readonly string[],
  options: UseTypewriterOptions = {}
): UseTypewriterResult {
  const {
    typingSpeed = 45,
    typingSpeedJitter = 0.4,
    deletingSpeed = 30,
    dwellMs = 2200,
    dwellJitter = 0.5,
    pauseBeforeTyping = 400,
    isPaused = false,
  } = options;

  const [activeIndex, setActiveIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isPaused || words.length === 0) return;
    const word = words[activeIndex % words.length];

    if (prefersReducedMotion) {
      setLength(word.length);
      const timeoutId = window.setTimeout(() => {
        setActiveIndex((i) => (i + 1) % words.length);
      }, dwellMs);
      return () => window.clearTimeout(timeoutId);
    }

    if (phase === "typing") {
      if (length < word.length) {
        const timeoutId = window.setTimeout(
          () => setLength((l) => l + 1),
          jitter(typingSpeed, typingSpeedJitter)
        );
        return () => window.clearTimeout(timeoutId);
      }
      setPhase("dwelling");
      return;
    }

    if (phase === "dwelling") {
      const timeoutId = window.setTimeout(() => setPhase("deleting"), jitter(dwellMs, dwellJitter));
      return () => window.clearTimeout(timeoutId);
    }

    if (phase === "deleting") {
      if (length > 0) {
        const timeoutId = window.setTimeout(() => setLength((l) => l - 1), deletingSpeed);
        return () => window.clearTimeout(timeoutId);
      }
      setPhase("pausing");
      return;
    }

    // phase === "pausing"
    const timeoutId = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % words.length);
      setPhase("typing");
    }, pauseBeforeTyping);
    return () => window.clearTimeout(timeoutId);
  }, [
    phase,
    length,
    activeIndex,
    isPaused,
    words,
    prefersReducedMotion,
    typingSpeed,
    typingSpeedJitter,
    deletingSpeed,
    dwellMs,
    dwellJitter,
    pauseBeforeTyping,
  ]);

  if (words.length === 0) {
    return { text: "", isDwelling: false, activeIndex: 0 };
  }

  const word = words[activeIndex % words.length];
  const text = prefersReducedMotion ? word : word.slice(0, length);
  const isDwelling = prefersReducedMotion || phase === "dwelling" || phase === "pausing";

  return { text, isDwelling, activeIndex: activeIndex % words.length };
}

export default useTypewriter;
