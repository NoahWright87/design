"use client";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

export interface UseTypewriterOptions {
  /** Milliseconds per character while typing. Default `45`. */
  typingSpeed?: number;
  /** Milliseconds per character while deleting. Default `30`. */
  deletingSpeed?: number;
  /** Milliseconds a fully-typed word stays on screen before it starts deleting. Default `2200`. */
  dwellMs?: number;
  /** Freezes the animation wherever it currently is — e.g. while hovered. Default `false`. */
  isPaused?: boolean;
}

export interface UseTypewriterResult {
  /** The currently visible substring of the active word. */
  text: string;
  /** `true` while a fully-typed word is dwelling on screen (a natural cue to blink a caret). */
  isDwelling: boolean;
  /** Index into `words` of the word currently being typed/dwelled/deleted. */
  activeIndex: number;
}

type Phase = "typing" | "dwelling" | "deleting";

/**
 * Drives a typewriter effect over a list of words: types each one out a character at a
 * time, dwells on it fully typed, deletes it a character at a time, then moves to the
 * next word (looping). Honors `prefers-reduced-motion` by skipping the per-character
 * animation and simply dwelling on each full word in turn.
 *
 * This hook only computes the text to display — pairing it with a blinking caret and
 * wiring up pause-on-hover is left to the caller (see `TextCarousel`'s `"typewriter"`
 * animation for a ready-made version).
 */
export function useTypewriter(
  words: readonly string[],
  options: UseTypewriterOptions = {}
): UseTypewriterResult {
  const { typingSpeed = 45, deletingSpeed = 30, dwellMs = 2200, isPaused = false } = options;

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
        const timeoutId = window.setTimeout(() => setLength((l) => l + 1), typingSpeed);
        return () => window.clearTimeout(timeoutId);
      }
      setPhase("dwelling");
      return;
    }

    if (phase === "dwelling") {
      const timeoutId = window.setTimeout(() => setPhase("deleting"), dwellMs);
      return () => window.clearTimeout(timeoutId);
    }

    // phase === "deleting"
    if (length > 0) {
      const timeoutId = window.setTimeout(() => setLength((l) => l - 1), deletingSpeed);
      return () => window.clearTimeout(timeoutId);
    }
    setActiveIndex((i) => (i + 1) % words.length);
    setPhase("typing");
  }, [phase, length, activeIndex, isPaused, words, prefersReducedMotion, typingSpeed, deletingSpeed, dwellMs]);

  if (words.length === 0) {
    return { text: "", isDwelling: false, activeIndex: 0 };
  }

  const word = words[activeIndex % words.length];
  const text = prefersReducedMotion ? word : word.slice(0, length);
  const isDwelling = prefersReducedMotion || phase === "dwelling";

  return { text, isDwelling, activeIndex: activeIndex % words.length };
}

export default useTypewriter;
