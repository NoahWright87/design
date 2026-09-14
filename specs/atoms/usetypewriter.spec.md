# useTypewriter Atom — Spec

## Purpose
`useTypewriter` drives a typewriter effect over a list of words: typing the first one out a character at a time, holding it fully typed for a beat, then transitioning to the next word the way a person editing a sentence would — via the `typewriterDiff` atom — rather than clearing the whole word and retyping it from scratch. Corrections to an existing word read as more effortful than typing something fresh, so it drives them at a slower, more deliberate pace by default. It is the reusable engine behind `TextCarousel`'s `"typewriter"` animation, but is exported on its own so any component that wants raw typewriter text — without `TextCarousel`'s markup, caret, or hover-pause wiring — can use it directly.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [typewriterDiff atom](./typewriterdiff.spec.md)
- [usePrefersReducedMotion atom](./useprefersreducedmotion.spec.md)
- [TextCarousel component](../components/molecules/textcarousel/textcarousel.spec.md)

## Contract

### Inputs
- An ordered list of words to cycle through.
- Optional average milliseconds per character while typing a wholly new word. Defaults to a brisk, human-scale typing speed.
- Optional fraction by which each character's typing delay is randomized around that average, so typing reads as a human cadence rather than a metronome. Defaults to a moderate amount; zero gives a constant rate.
- Optional milliseconds per character while deleting a wholly new/unwanted word — always constant, simulating a held backspace key, never randomized.
- Optional average milliseconds per character while typing the corrected part of a word being edited in place — defaults to noticeably slower than fresh typing.
- Optional jitter fraction for that edit typing speed, analogous to the fresh-typing one — defaults to a larger amount than fresh typing's, reading as more hesitant.
- Optional milliseconds per character while deleting the wrong part of a word being edited in place — constant, defaults to noticeably slower than fresh deleting.
- Optional milliseconds per character while the caret glides through already-correct text with nothing being typed or deleted — defaults to quick, faster than either typing speed.
- Optional average dwell duration a fully-typed word stays on screen before it starts changing into the next one. Defaults to a couple of seconds.
- Optional fraction by which the dwell is randomized around that average, so words don't all linger for the same beat. Defaults to a moderate amount; zero gives a constant dwell.
- Optional milliseconds the caret holds still before typing or deleting a wholly new word begins — the very first word, and any fresh word added or removed in a later transition. Defaults to a brief pause.
- Optional milliseconds the caret holds still before it starts correcting a word in place — defaults to longer than the fresh-word pause.
- Optional similarity threshold controlling which differing word pairs are corrected in place versus treated as an unrelated swap — forwarded to `typewriterDiff`.
- Optional paused flag that freezes the animation exactly where it is — e.g. while the caller's element is hovered.

### Outputs
- The full text currently visible.
- The index into that text where the caret currently sits — not always the end, since a transition can edit a word in the middle of the phrase while words after it stay put.
- Whether there's no per-character animation in progress right now — dwelling on a fully-typed word, or the caret holding still immediately before an action, whether fresh or a correction — a natural cue for a caller to blink a caret only then.
- The index into the input list of the word currently settled on or being typed toward.

### Guarantees / Constraints
- The transition between any two words is computed by `typewriterDiff`: see that atom's spec for the full alignment and caret-movement contract (right-to-left resolution starting from the caret's current position, no deferral, gliding rather than jumping between changes).
- Characters typed or deleted as part of correcting a word in place always use the edit-tier speed/jitter, regardless of how they're reached; characters typed or deleted as part of a wholly new/unwanted word always use the fresh-tier speed/jitter. A caller cannot get a mixed rate within a single character action.
- With reduced motion preferred, the per-character animation is skipped entirely: each word appears whole and simply dwells for the configured duration before the next word appears, also whole. Typing, dwell, gliding, and pause timing do not apply in this case, since there is no per-character reveal to time.
- Pausing (the `isPaused` input) freezes progress exactly where it is; unpausing resumes from there rather than restarting the transition.
- Randomized typing delays and dwell durations vary independently per character and per word respectively; their averages match the configured values.
- Deleting (fresh or in-place-correction) never varies in speed, regardless of jitter settings — only typing speed and dwell duration are randomized.
- Gliding and the pauses before an action are not randomized — each holds to its configured constant.
- An empty word list returns empty text and never schedules timers.
- Looping is infinite: after the last word, the cycle transitions back to the first (itself diffed like any other transition).

## Behavior

**Default:** Starting from the first word, characters are appended one at a time — each after a randomized delay averaging the configured fresh typing speed — until the whole word is shown. It then dwells for a randomized duration averaging the configured dwell time. Transitioning to the next word replays `typewriterDiff`'s frames for the pair: the caret works backward from where it already sits, resolving each change (clearing and writing a run of wholly different words, or correcting a similar word in place) as it's reached and gliding through everything already correct in between, until the phrase reads as the next word. This repeats indefinitely, wrapping from the last word back to the first.

**Typing jitter:** Each newly-typed character's delay is independently randomized within a range around the average typing speed for its tier (fresh or edit), so consecutive characters don't all take the same time to appear.

**Dwell jitter:** Each word's dwell duration is independently randomized within a range around the average dwell time, so not every word lingers on screen for an identical beat.

**Edits are slower than fresh typing:** Characters typed or deleted while correcting a word in place (e.g. "build" -> "builder") move at their own, slower pace by default, with more jitter on the typing side — reading as a deliberate correction rather than the brisk rhythm of typing something new. The caret also holds still longer before starting a correction than before a fresh word.

**Gliding:** Moving the caret through text that's already correct — whether skipping over an untouched word or crossing one just fixed earlier in the same transition — advances one character at a time with no typing or deleting, at its own quick, constant pace distinct from both typing tiers.

**Caret-relocation pause:** Before the first character of any action — the very first word typed from nothing, a wholly new/unwanted word, or a word being corrected in place — the caret holds still for a brief pause (longer for a correction than for fresh content) rather than immediately continuing.

**Paused:** While paused, no further characters are typed, deleted, glided over, or dwelled/held through — the hook holds its current state exactly as it was until unpaused.

**Reduced motion:** Each word is shown in full immediately (no character-by-character reveal, gliding, or per-transition edit) and dwells for the configured average duration before the next word replaces it, also shown in full.

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
3. Transitioning to the next word only edits the parts that differ from the current word, per `typewriterDiff`; a word shared between the two (anywhere in the phrase) is never deleted or retyped.
4. A character typed or deleted while correcting a similar word in place uses the edit-tier speed and (for typing) jitter; a character typed or deleted for a wholly new/unwanted word uses the fresh-tier speed and jitter — the two are never mixed within one character action.
5. The caret's pause before starting a correction is longer, by default, than its pause before starting fresh content.
6. Gliding between changes advances the caret one character at a time at its own constant pace, distinct from both typing tiers and from either deleting speed.
7. Wraps from the last word back to the first, looping indefinitely.
8. Reports `isDwelling` as true while a fully-typed word is holding, and while the caret holds still immediately before an action (fresh or correction) begins.
9. Freezes at the current state while paused (via the `isPaused` input), and resumes from there rather than restarting when unpaused.
10. With reduced motion preferred, shows each word in full immediately and skips character-by-character typing, gliding, and per-transition edits.
11. Returns empty text and schedules no timers when given an empty word list.
12. Per-character typing delays vary within a range around the configured average for their tier, rather than every character taking an identical delay.
13. Per-word dwell durations vary within a range around the configured average, rather than every word dwelling for an identical duration.
14. Deleting speed (fresh or edit-tier) never varies, regardless of the typing and dwell jitter settings.
15. `cursor` points at the position of the character currently being typed or deleted, which is not always the end of `text` — a mid-phrase edit leaves the caret there while unedited text remains on both sides.
16. Given no explicit edit-tier values, `editTypingSpeed`/`editDeletingSpeed` default to a fixed multiple of the corresponding fresh-tier speed and `editPauseBeforeTyping` to a fixed multiple of `pauseBeforeTyping`, so a caller who only tunes the fresh-tier options still gets a slower, distinct edit tier without configuring it directly.
