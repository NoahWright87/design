"use client";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";
import { buildTypewriterFrames, type TypewriterFrame } from "./typewriterDiff.js";

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
  /** Average milliseconds a fully-typed word stays on screen before it starts changing. Default `2200`. */
  dwellMs?: number;
  /**
   * Randomizes each dwell by up to this fraction of `dwellMs` in either direction, so
   * not every word lingers for exactly the same beat. Set `0` for a constant dwell.
   * Default `0.5`.
   */
  dwellJitter?: number;
  /**
   * Milliseconds the caret holds still before each edit begins — the initial word, and
   * again every time it relocates to a part of the phrase that needs to change. Default `400`.
   */
  pauseBeforeTyping?: number;
  /** Freezes the animation wherever it currently is — e.g. while hovered. Default `false`. */
  isPaused?: boolean;
}

export interface UseTypewriterResult {
  /** The full text currently visible. */
  text: string;
  /** Index into `text` where the caret currently sits. */
  cursor: number;
  /**
   * `true` while there's no per-character animation in progress — dwelling on a
   * fully-typed word, or the caret is holding still before/between edits. A natural
   * cue for a caller to blink a caret.
   */
  isDwelling: boolean;
  /** Index into `words` of the word currently settled on or being typed toward. */
  activeIndex: number;
}

type Phase = "editing" | "dwelling";

function jitter(base: number, amount: number): number {
  if (amount <= 0) return base;
  const factor = 1 + (Math.random() * 2 - 1) * amount;
  return Math.max(1, Math.round(base * factor));
}

/**
 * Drives a typewriter effect over a list of words: types the first one out a character
 * at a time, dwells on it fully typed, then transitions to the next word by editing only
 * the parts that differ — a word present in both phrases (wherever it falls) stays put,
 * and a changed word that shares a prefix with its replacement (e.g. "build" -> "builder")
 * is backspaced and retyped only past that shared prefix — rather than clearing the whole
 * phrase and retyping it. Falls back to a full clear-and-retype when two phrases share
 * nothing. Typing speed and dwell time are randomized within a range around their averages
 * so the rhythm reads as human rather than mechanical; deleting stays constant, simulating
 * a held backspace key. Honors `prefers-reduced-motion` by skipping the per-character
 * animation and simply dwelling on each full word in turn.
 *
 * This hook only computes the text and caret position to display — pairing it with a
 * blinking caret and wiring up pause-on-hover is left to the caller (see `TextCarousel`'s
 * `"typewriter"` animation for a ready-made version).
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

  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [frames, setFrames] = useState<TypewriterFrame[]>(() =>
    words.length > 0 ? buildTypewriterFrames("", words[0]) : []
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("editing");

  useEffect(() => {
    if (isPaused || words.length === 0) return;
    const word = words[activeIndex % words.length];

    if (prefersReducedMotion) {
      const timeoutId = window.setTimeout(() => {
        setActiveIndex((i) => (i + 1) % words.length);
      }, dwellMs);
      return () => window.clearTimeout(timeoutId);
    }

    if (phase === "editing") {
      if (frameIndex < frames.length - 1) {
        const nextAction = frames[frameIndex + 1].action;
        const delay =
          nextAction === "insert"
            ? jitter(typingSpeed, typingSpeedJitter)
            : nextAction === "delete"
              ? deletingSpeed
              : pauseBeforeTyping;
        const timeoutId = window.setTimeout(() => setFrameIndex((i) => i + 1), delay);
        return () => window.clearTimeout(timeoutId);
      }
      setPhase("dwelling");
      return;
    }

    // phase === "dwelling"
    const timeoutId = window.setTimeout(() => {
      const nextIndex = (activeIndex + 1) % words.length;
      setFrames(buildTypewriterFrames(word, words[nextIndex]));
      setFrameIndex(0);
      setActiveIndex(nextIndex);
      setPhase("editing");
    }, jitter(dwellMs, dwellJitter));
    return () => window.clearTimeout(timeoutId);
  }, [
    phase,
    frameIndex,
    frames,
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
    return { text: "", cursor: 0, isDwelling: false, activeIndex: 0 };
  }

  const resolvedActiveIndex = activeIndex % words.length;

  if (prefersReducedMotion) {
    const word = words[resolvedActiveIndex];
    return { text: word, cursor: word.length, isDwelling: true, activeIndex: resolvedActiveIndex };
  }

  const frame = frames[frameIndex] ?? frames[frames.length - 1];
  const isDwelling = phase === "dwelling" || frame.action === "pause" || frame.action === "start";

  return { text: frame.text, cursor: frame.cursor, isDwelling, activeIndex: resolvedActiveIndex };
}

export default useTypewriter;
