"use client";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";
import { addTypingMistakes, buildTypewriterFrames, type TypewriterFrame } from "./typewriterDiff.js";

export interface UseTypewriterOptions {
  /** Average milliseconds per character while typing a wholly new word. Default `45`. */
  typingSpeed?: number;
  /**
   * Randomizes each character's typing delay by up to this fraction of `typingSpeed`
   * in either direction (e.g. `0.4` varies a 45ms delay between 27ms and 63ms), so
   * typing reads as a human cadence rather than a metronome. The average stays at
   * `typingSpeed`. Set `0` for a constant rate. Default `0.4`.
   */
  typingSpeedJitter?: number;
  /**
   * Milliseconds per character while deleting a wholly new (i.e. wholly unwanted) word —
   * constant, simulating a held backspace key. Default `30`.
   */
  deletingSpeed?: number;
  /**
   * Average milliseconds per character while typing the corrected part of a word being
   * edited in place (e.g. "build" -> "builder") — real corrections read as more effortful
   * than fresh typing, so this is slower than `typingSpeed` by default. Default
   * `typingSpeed * 1.6`.
   */
  editTypingSpeed?: number;
  /** Jitter fraction for `editTypingSpeed`, analogous to `typingSpeedJitter`. Default `0.6`. */
  editTypingSpeedJitter?: number;
  /** Milliseconds per character while deleting the wrong part of a word being edited in place — constant. Default `deletingSpeed * 1.6`. */
  editDeletingSpeed?: number;
  /**
   * Milliseconds per character while the caret glides through already-correct text to
   * reach the next thing that needs changing — no letters are typed or deleted, so this
   * is quick relative to actual typing. Default `15`.
   */
  moveSpeed?: number;
  /** Baseline dwell before the next edit, adjusted for reading length and the amount of change. Default `2200`. */
  dwellMs?: number;
  /** Randomizes each adjusted dwell by this fraction. Set `0` to use the adjusted duration exactly. Default `0.5`. */
  dwellJitter?: number;
  /**
   * Milliseconds the caret holds still before typing/deleting a wholly new word begins —
   * the very first word, and any fresh word added or removed in a later transition.
   * Default `400`.
   */
  pauseBeforeTyping?: number;
  /**
   * Milliseconds the caret holds still before it starts correcting a word in place —
   * a longer beat than `pauseBeforeTyping`, reading as pausing to spot what needs fixing
   * rather than plowing straight through it. Default `pauseBeforeTyping * 1.5`.
   */
  editPauseBeforeTyping?: number;
  /**
   * How similar two differing words must be, as a fraction of the longer word's length,
   * to be corrected in place rather than treated as an unrelated word swap. See
   * `buildTypewriterFrames`'s `similarityThreshold`. Default `0.5`.
   */
  similarityThreshold?: number;
  /** Chance per eligible typed letter of one temporary typo per transition. Default `0.008`. */
  typoChance?: number;
  /** Freezes the animation wherever it currently is — e.g. while hovered. Default `false`. */
  isPaused?: boolean;
}

export interface UseTypewriterResult {
  /** The full text currently visible. */
  text: string;
  /** Index into `text` where the caret currently sits. */
  cursor: number;
  /** UTF-16 range highlighted while a word is selected for a cut. */
  selection?: [start: number, end: number];
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
 * at a time, dwells on it fully typed, then transitions to the next word the way a person
 * editing a sentence would — starting from the caret's current position (the end of the
 * word just typed), it resolves each change completely as it's reached (a run of wrong
 * words to clear and correct words to write, or a single word to correct in place) and
 * glides — not jumps — through everything already correct in between. A word present in
 * both phrases may stay in place or move with a cut and paste; a changed word similar
 * enough to its replacement is corrected in place. A full rewrite still clears and types.
 *
 * Corrections read as more effortful than fresh typing: characters typed/deleted as part
 * of an in-place correction move slower than wholly new/removed words by default (see
 * `editTypingSpeed`/`editDeletingSpeed`), and the caret pauses longer before starting one
 * (see `editPauseBeforeTyping`). Typing speed and dwell time are randomized within a range
 * around their averages so the rhythm reads as human rather than mechanical; deleting
 * stays constant, simulating a held backspace key. Occasional wrong keys are repaired,
 * and dwell adjusts to reading length and the size of the next edit. Honors `prefers-reduced-motion`
 * by skipping the per-character animation and simply dwelling on each full word in turn.
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
    editTypingSpeed = Math.round(typingSpeed * 1.6),
    editTypingSpeedJitter = 0.6,
    editDeletingSpeed = Math.round(deletingSpeed * 1.6),
    moveSpeed = 15,
    dwellMs = 2200,
    dwellJitter = 0.5,
    pauseBeforeTyping = 400,
    editPauseBeforeTyping = Math.round(pauseBeforeTyping * 1.5),
    similarityThreshold = 0.5,
    typoChance = 0.008,
    isPaused = false,
  } = options;

  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [frames, setFrames] = useState<TypewriterFrame[]>(() =>
    words.length > 0 ? addTypingMistakes(buildTypewriterFrames("", words[0], { similarityThreshold }), typoChance) : []
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
        let delay: number;
        switch (nextAction) {
          case "insert":
            delay = jitter(typingSpeed, typingSpeedJitter);
            break;
          case "delete":
            delay = deletingSpeed;
            break;
          case "editInsert":
            delay = jitter(editTypingSpeed, editTypingSpeedJitter);
            break;
          case "editDelete":
            delay = editDeletingSpeed;
            break;
          case "move":
            delay = moveSpeed;
            break;
          case "select":
            delay = moveSpeed * 2;
            break;
          case "cut":
            delay = 180;
            break;
          case "paste":
            delay = 220;
            break;
          case "typoInsert":
            delay = jitter(typingSpeed, typingSpeedJitter);
            break;
          case "typoDelete":
            delay = 260;
            break;
          case "editPause":
            delay = editPauseBeforeTyping;
            break;
          default:
            delay = pauseBeforeTyping;
        }
        const timeoutId = window.setTimeout(() => setFrameIndex((i) => i + 1), delay);
        return () => window.clearTimeout(timeoutId);
      }
      setPhase("dwelling");
      return;
    }

    // phase === "dwelling"
    const nextIndex = (activeIndex + 1) % words.length;
    const nextFrames = buildTypewriterFrames(word, words[nextIndex], { similarityThreshold });
    const changedCharacters = nextFrames.filter((frame) =>
      ["insert", "delete", "editInsert", "editDelete"].includes(frame.action)
    ).length;
    const movedCharacters = nextFrames.filter((frame) => frame.action === "cut").length * 4;
    const changeRatio = Math.min(1, (changedCharacters + movedCharacters) / Math.max(1, word.length, words[nextIndex].length));
    const readingTime = Math.min(900, Array.from(word).length * 12);
    const dwell = jitter(dwellMs * (0.65 + 0.7 * changeRatio) + readingTime, dwellJitter);
    const timeoutId = window.setTimeout(() => {
      setFrames(addTypingMistakes(nextFrames, typoChance));
      setFrameIndex(0);
      setActiveIndex(nextIndex);
      setPhase("editing");
    }, dwell);
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
    editTypingSpeed,
    editTypingSpeedJitter,
    editDeletingSpeed,
    moveSpeed,
    dwellMs,
    dwellJitter,
    pauseBeforeTyping,
    editPauseBeforeTyping,
    similarityThreshold,
    typoChance,
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
  const isDwelling =
    phase === "dwelling" ||
    frame.action === "pause" ||
    frame.action === "editPause" ||
    frame.action === "start";

  return { text: frame.text, cursor: frame.cursor, selection: frame.selection, isDwelling, activeIndex: resolvedActiveIndex };
}

export default useTypewriter;
