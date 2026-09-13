# typewriterDiff Atom — Spec

## Purpose
`buildTypewriterFrames` computes the frame-by-frame transition from one phrase to another for a typewriter-style effect, editing only the words that actually differ — wherever in the phrase they fall — rather than clearing everything and retyping it from scratch. It exists as its own pure, dependency-free function (not a hook) so the alignment algorithm is independently testable and reusable outside `useTypewriter`, matching this package's building-block philosophy.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [useTypewriter atom](./usetypewriter.spec.md)

## Contract

### Inputs
- `from`: the current phrase, as a plain string.
- `to`: the phrase to transition to, as a plain string.

### Outputs
An ordered array of frames. Each frame carries: the full text visible at that point in the transition, the character index into that text where the caret sits, and which kind of change produced it from the previous frame (the initial state, a caret-relocation pause, a character typed, or a character deleted). The first frame always equals `from` (caret at its end); the last frame always equals `to` (caret at its end).

### Guarantees / Constraints
- Deterministic and pure: no timing, randomness, or side effects. Calling it twice with the same inputs returns identical output. Bakes in no delays — a caller drives the actual animation by stepping through the frames on its own clock, choosing a delay per frame from its action.
- Words are compared at the whole-word level (whitespace-delimited), not character-by-character across the whole phrase — so "word" is the unit that either matches, partially matches (shares a prefix), or doesn't.
- A word present in both `from` and `to` is left untouched wherever it falls in the phrase — it does not need to be adjacent to other unchanged words, first, or last.
- A word that differs from its counterpart but shares a leading substring with it (e.g. "build" / "builder") is edited in place: backspaced only down to that shared prefix, then retyped only past it — never fully cleared when part of it is already correct.
- Two phrases sharing no words at all still produce a valid transition: every word is deleted and every replacement word is typed, in an order consistent with a minimum-edit alignment (never reordering `from`'s words relative to each other, or `to`'s words relative to each other).
- Two identical inputs produce a single frame equal to both (no edit needed).
- Reconstructing text from partially-edited words never produces doubled or missing spaces between words, regardless of which words are mid-edit, freshly deleted, or not yet inserted.

## Behavior

**Matching words, anywhere:** Both phrases are split into words and aligned with a minimum-edit alignment: words that appear in both, in the same relative order, are kept as anchors and never touched, no matter where in the phrase they sit.

**Partial word edits:** A pair of differing words that share a common prefix is treated as one in-place edit — the caret moves to the end of the old word, backspaces down to the shared prefix, then types the remainder of the new word — rather than as an unrelated delete of one word and insert of another.

**Full word replacement:** A word with no useful overlap with anything in the other phrase is deleted in full (backspaced from its own end) or inserted in full (typed from scratch), depending on which side it belongs to.

**Caret relocation:** Immediately before each word-level edit begins, a `"pause"` frame marks the caret settling into position with no text change yet — the signal a caller uses to hold briefly before resuming per-character action.

**Settling:** After every word-level edit is applied, a final frame moves the caret to the true end of the resulting phrase, even if the last edit happened mid-phrase and left the caret short of the end (e.g. because the phrase's final word or words never needed to change).

**No overlap:** When `from` and `to` share no words, the transition degrades to deleting the old phrase in full and typing the new one in full — the same result a naive clear-and-retype would produce, just expressed as the same frame format.

## Interface

### Usage
```ts
const frames = buildTypewriterFrames("Software engineer", "Software builder");
// frames[0]:  { text: "Software engineer", cursor: 18, action: "start" }
// ...backspaces "engineer"...
// ...types "builder"...
// frames[last]: { text: "Software builder", cursor: 17, action: "pause" }
```
A caller (see `useTypewriter`) steps through the array on its own timer, picking a per-frame delay from `action` — e.g. a jittered typing speed for `"insert"`, a constant rate for `"delete"`, and a fixed pause for `"pause"`/`"start"`.

### Word matching, not fuzzy text matching
Only whole words are compared for equality and for shared-prefix partial edits — the function does not attempt character-level diffing across word boundaries or reorder words to find a better alignment; alignment always preserves each phrase's own word order.

## Acceptance
1. `buildTypewriterFrames(x, x)` returns exactly one frame: `{ text: x, cursor: x.length, action: "start" }`.
2. A word identical in `from` and `to`, regardless of position, never appears as the subject of a `"delete"` or `"insert"` frame — it is present unchanged in every frame's `text`.
3. Two differing words sharing a common prefix produce delete frames only down to that shared prefix (never fewer characters remain of the old word than the prefix), followed by insert frames only for the remainder of the new word.
4. Two phrases with no shared or prefix-related words still produce a complete, correct transition: the final frame's text equals `to` exactly.
5. Every frame's `text`, when whitespace-normalized, contains no doubled spaces and no missing space between two adjacent words.
6. The first frame always has `text === from`; the last frame always has `text === to` with `cursor === to.length`.
7. Calling the function twice with the same `from`/`to` produces two identical frame arrays (no randomness).
