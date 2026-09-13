# useTypewriter Atom — Spec

## Purpose
`useTypewriter` drives a typewriter effect over a list of words: typing each one out a character at a time, holding it fully typed for a beat, deleting it a character at a time, then moving on to the next word, looping indefinitely. It is the reusable engine behind `TextCarousel`'s `"typewriter"` animation, but is exported on its own so any component that wants raw typewriter text — without `TextCarousel`'s markup, caret, or hover-pause wiring — can use it directly.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [usePrefersReducedMotion atom](./useprefersreducedmotion.spec.md)
- [TextCarousel component](../components/molecules/textcarousel/textcarousel.spec.md)

## Contract

### Inputs
- An ordered list of words to cycle through.
- Optional average milliseconds per character while typing. Defaults to a brisk, human-scale typing speed.
- Optional fraction by which each character's typing delay is randomized around that average, so typing reads as a human cadence rather than a metronome. Defaults to a moderate amount; zero gives a constant rate.
- Optional milliseconds per character while deleting — always constant, simulating a held backspace key, never randomized.
- Optional average dwell duration a fully-typed word stays on screen before it starts deleting. Defaults to a couple of seconds.
- Optional fraction by which the dwell is randomized around that average, so words don't all linger for the same beat. Defaults to a moderate amount; zero gives a constant dwell.
- Optional milliseconds paused, fully erased, before typing the next word begins. Defaults to a brief pause.
- Optional paused flag that freezes the animation exactly where it is — e.g. while the caller's element is hovered.

### Outputs
- The currently visible substring of the active word.
- Whether the word is currently dwelling fully-typed or pausing fully-erased before the next word — the two moments with no per-character animation in progress, and a natural cue for a caller to blink a caret only then.
- The index into the input list of the word currently being typed, dwelled on, or deleted.

### Guarantees / Constraints
- With reduced motion preferred, the per-character animation is skipped entirely: each word appears whole and simply dwells for the configured duration before the next word appears, also whole. Typing and dwell randomization do not apply in this case, since there is no per-character reveal to randomize.
- Pausing (the `isPaused` input) freezes progress at the exact character count reached; unpausing resumes from there rather than restarting the word.
- Randomized typing delays and dwell durations vary independently per character and per word respectively; their averages match the configured values.
- Deleting never varies in speed, regardless of the typing/dwell randomization settings.
- An empty word list returns empty text and never schedules timers.
- Looping is infinite: after the last word, the cycle returns to the first.

## Behavior

**Default:** Starting from the first word, characters are appended one at a time — each after a randomized delay averaging the configured typing speed — until the whole word is shown. It then dwells for a randomized duration averaging the configured dwell time, then characters are removed one at a time at a constant deleting speed until none remain. After a brief fixed pause with the word fully erased, the next word begins typing. This repeats indefinitely, wrapping from the last word back to the first.

**Typing jitter:** Each character's delay is independently randomized within a range around the average typing speed, so consecutive characters don't all take the same time to appear.

**Dwell jitter:** Each word's dwell duration is independently randomized within a range around the average dwell time, so not every word lingers on screen for an identical beat.

**Pause before typing:** After a word is fully deleted, the hook waits a brief, fixed pause with nothing shown before the next word starts typing — a beat that reads as the "typist" pausing between thoughts rather than immediately launching into the next word.

**Paused:** While paused, no further characters are typed, deleted, or dwelled/paused through — the hook holds its current state exactly as it was until unpaused.

**Reduced motion:** Each word is shown in full immediately (no character-by-character reveal, deletion, or pause) and dwells for the configured average duration before the next word replaces it, also shown in full.

**Single word:** Types it, dwells, deletes it, pauses, then retypes the same word — the loop still runs even with only one word.

**Empty list:** Returns empty text and does nothing further; no timers are scheduled.

## Interface

### Usage
A component calls the hook with a word list and optional timing/pause options, and receives the text to render plus a dwelling flag it can use for its own caret or other affordance:

```tsx
const { text, isDwelling } = useTypewriter(["Engineer", "Builder", "Tinkerer"], {
  isPaused: hovered,
});

return <span>{text}<Caret blinking={isDwelling} /></span>;
```

The hook renders nothing itself; it is pure state, leaving markup, styling, and any caret entirely to the caller.

## Acceptance
1. Starting from the first word, appends one character at a time until it reads the full word.
2. Holds the fully-typed word for a dwell duration averaging the configured value before deleting begins.
3. Removes one character at a time, at a constant rate, until none remain, then pauses briefly before typing the next word.
4. Wraps from the last word back to the first, looping indefinitely.
5. Reports `isDwelling` as true while a fully-typed word is holding before deletion, and while paused fully-erased before the next word starts.
6. Freezes at the current character count while paused (via the `isPaused` input), and resumes from there rather than restarting when unpaused.
7. With reduced motion preferred, shows each word in full immediately and skips character-by-character typing, deleting, and the pause between words.
8. Returns empty text and schedules no timers when given an empty word list.
9. Per-character typing delays vary within a range around the configured average, rather than every character taking an identical delay.
10. Per-word dwell durations vary within a range around the configured average, rather than every word dwelling for an identical duration.
11. Deleting speed never varies, regardless of the typing and dwell jitter settings.
