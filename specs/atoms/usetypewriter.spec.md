# useTypewriter Atom — Spec

## Purpose
`useTypewriter` drives a typewriter effect over a list of words: typing the first one out a character at a time, holding it fully typed for a beat, then transitioning to the next word by editing only the parts that actually differ — via the `typewriterDiff` atom — rather than clearing the whole word and retyping it from scratch. It is the reusable engine behind `TextCarousel`'s `"typewriter"` animation, but is exported on its own so any component that wants raw typewriter text — without `TextCarousel`'s markup, caret, or hover-pause wiring — can use it directly.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [typewriterDiff atom](./typewriterdiff.spec.md)
- [usePrefersReducedMotion atom](./useprefersreducedmotion.spec.md)
- [TextCarousel component](../components/molecules/textcarousel/textcarousel.spec.md)

## Contract

### Inputs
- An ordered list of words to cycle through.
- Optional average milliseconds per character while typing. Defaults to a brisk, human-scale typing speed.
- Optional fraction by which each character's typing delay is randomized around that average, so typing reads as a human cadence rather than a metronome. Defaults to a moderate amount; zero gives a constant rate.
- Optional milliseconds per character while deleting — always constant, simulating a held backspace key, never randomized.
- Optional average dwell duration a fully-typed word stays on screen before it starts changing into the next one. Defaults to a couple of seconds.
- Optional fraction by which the dwell is randomized around that average, so words don't all linger for the same beat. Defaults to a moderate amount; zero gives a constant dwell.
- Optional milliseconds the caret holds still before each edit begins — the very first word, and again each time it relocates to a part of the phrase that needs to change. Defaults to a brief pause.
- Optional paused flag that freezes the animation exactly where it is — e.g. while the caller's element is hovered.

### Outputs
- The full text currently visible.
- The index into that text where the caret currently sits — not always the end, since a transition can edit a word in the middle of the phrase while words after it stay put.
- Whether there's no per-character animation in progress right now — dwelling on a fully-typed word, or the caret holding still immediately before/between edits — a natural cue for a caller to blink a caret only then.
- The index into the input list of the word currently settled on or being typed toward.

### Guarantees / Constraints
- The transition between any two words is computed by `typewriterDiff`: a word present in both (anywhere in the phrase, not just a shared prefix or suffix of the whole thing) is left untouched, and a changed word that shares a prefix with its replacement (e.g. "build" -> "builder") is backspaced and retyped only past that shared prefix. Two words with nothing in common fall back to a full clear-and-retype of that word.
- With reduced motion preferred, the per-character animation is skipped entirely: each word appears whole and simply dwells for the configured duration before the next word appears, also whole. Typing and dwell randomization do not apply in this case, since there is no per-character reveal to randomize.
- Pausing (the `isPaused` input) freezes progress exactly where it is; unpausing resumes from there rather than restarting the transition.
- Randomized typing delays and dwell durations vary independently per character and per word respectively; their averages match the configured values.
- Deleting never varies in speed, regardless of the typing/dwell randomization settings.
- An empty word list returns empty text and never schedules timers.
- Looping is infinite: after the last word, the cycle transitions back to the first (itself diffed like any other transition).

## Behavior

**Default:** Starting from the first word, characters are appended one at a time — each after a randomized delay averaging the configured typing speed — until the whole word is shown. It then dwells for a randomized duration averaging the configured dwell time. Transitioning to the next word replays the edit script `typewriterDiff` computes between the two: the caret holds briefly, then backspaces and/or types only where the two words differ, leaving any part they share untouched and in place, until the phrase reads as the next word. This repeats indefinitely, wrapping from the last word back to the first.

**Typing jitter:** Each newly-typed character's delay is independently randomized within a range around the average typing speed, so consecutive characters don't all take the same time to appear.

**Dwell jitter:** Each word's dwell duration is independently randomized within a range around the average dwell time, so not every word lingers on screen for an identical beat.

**Caret relocation pause:** Before the first character of any edit — the very first word typed from nothing, or each differing part of a later transition — the caret holds still for a brief, fixed pause rather than immediately continuing, reading as the "typist" pausing to find the next thing to fix rather than mechanically sweeping through the phrase.

**Paused:** While paused, no further characters are typed, deleted, or dwelled/held through — the hook holds its current state exactly as it was until unpaused.

**Reduced motion:** Each word is shown in full immediately (no character-by-character reveal or per-transition edit) and dwells for the configured average duration before the next word replaces it, also shown in full.

**Single word:** Types it once, dwells, and — since `typewriterDiff` finds the word identical to itself — the "transition" back to the same word resolves instantly with no visible change, then dwells again. The loop still runs even with only one word; it just never visibly edits anything.

**Empty list:** Returns empty text and does nothing further; no timers are scheduled.

## Interface

### Usage
A component calls the hook with a word list and optional timing/pause options, and receives the text and caret position to render plus a dwelling flag it can use for its own caret or other affordance:

```tsx
const { text, cursor, isDwelling } = useTypewriter(["Software engineer", "Software builder"], {
  isPaused: hovered,
});

return (
  <span>
    {text.slice(0, cursor)}
    <Caret blinking={isDwelling} />
    {text.slice(cursor)}
  </span>
);
```

The hook renders nothing itself; it is pure state, leaving markup, styling, and any caret entirely to the caller. Splitting on `cursor` rather than always appending the caret after the full text matters here — mid-transition, the caret can sit in the middle of the phrase while unedited text sits on both sides of it.

## Acceptance
1. Starting from the first word, appends one character at a time until it reads the full word.
2. Holds the fully-typed word for a dwell duration averaging the configured value before transitioning to the next word.
3. Transitioning to the next word only edits the parts that differ from the current word, per `typewriterDiff`; a word shared between the two (anywhere in the phrase) is never deleted or retyped, and a changed word sharing a prefix with its replacement is only backspaced and retyped past that shared prefix.
4. Wraps from the last word back to the first, looping indefinitely.
5. Reports `isDwelling` as true while a fully-typed word is holding, and while the caret holds still immediately before an edit begins.
6. Freezes at the current state while paused (via the `isPaused` input), and resumes from there rather than restarting when unpaused.
7. With reduced motion preferred, shows each word in full immediately and skips character-by-character typing and per-transition edits.
8. Returns empty text and schedules no timers when given an empty word list.
9. Per-character typing delays vary within a range around the configured average, rather than every character taking an identical delay.
10. Per-word dwell durations vary within a range around the configured average, rather than every word dwelling for an identical duration.
11. Deleting speed never varies, regardless of the typing and dwell jitter settings.
12. `cursor` points at the position of the character currently being typed or deleted, which is not always the end of `text` — a mid-phrase edit leaves the caret there while unedited text remains on both sides.
