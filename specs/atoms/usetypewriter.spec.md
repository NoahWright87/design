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
- Optional milliseconds per character while typing. Defaults to a brisk, human-scale typing speed.
- Optional milliseconds per character while deleting. Defaults to somewhat faster than typing.
- Optional dwell duration a fully-typed word stays on screen before it starts deleting. Defaults to a couple of seconds.
- Optional paused flag that freezes the animation exactly where it is — e.g. while the caller's element is hovered.

### Outputs
- The currently visible substring of the active word.
- Whether a fully-typed word is currently dwelling (a natural cue for a caller to blink a caret only during this phase).
- The index into the input list of the word currently being typed, dwelled on, or deleted.

### Guarantees / Constraints
- With reduced motion preferred, the per-character animation is skipped entirely: each word appears whole and simply dwells for the configured duration before the next word appears, also whole.
- Pausing freezes progress at the exact character count reached; unpausing resumes from there rather than restarting the word.
- An empty word list returns empty text and never schedules timers.
- Looping is infinite: after the last word, the cycle returns to the first.

## Behavior

**Default:** Starting from the first word, characters are appended one at a time at the typing speed until the whole word is shown, then it dwells for the configured duration, then characters are removed one at a time at the deleting speed until none remain, then the next word begins typing. This repeats indefinitely, wrapping from the last word back to the first.

**Paused:** While paused, no further characters are typed, deleted, or dwelled through — the hook holds its current state exactly as it was until unpaused.

**Reduced motion:** Each word is shown in full immediately (no character-by-character reveal or deletion) and dwells for the configured duration before the next word replaces it, also shown in full.

**Single word:** Types it, dwells, deletes it, then retypes the same word — the loop still runs even with only one word.

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
2. Holds the fully-typed word for the configured dwell duration before deleting begins.
3. Removes one character at a time until none remain, then begins typing the next word.
4. Wraps from the last word back to the first, looping indefinitely.
5. Reports `isDwelling` as true only while a fully-typed word is holding before deletion.
6. Freezes at the current character count while paused, and resumes from there rather than restarting when unpaused.
7. With reduced motion preferred, shows each word in full immediately and skips character-by-character typing and deleting.
8. Returns empty text and schedules no timers when given an empty word list.
