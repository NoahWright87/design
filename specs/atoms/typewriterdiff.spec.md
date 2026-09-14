# typewriterDiff Atom — Spec

## Purpose
`buildTypewriterFrames` computes the frame-by-frame transition from one phrase to another for a typewriter-style effect, editing only the words that actually differ — wherever in the phrase they fall — the way a person editing a sentence would, rather than clearing everything and retyping it from scratch. It exists as its own pure, dependency-free function (not a hook) so the alignment algorithm is independently testable and reusable outside `useTypewriter`, matching this package's building-block philosophy.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [useTypewriter atom](./usetypewriter.spec.md)

## Contract

### Inputs
- `from`: the current phrase, as a plain string.
- `to`: the phrase to transition to, as a plain string.
- Optional `similarityThreshold`: how similar two differing words must be, as a fraction of the longer word's length (Levenshtein distance ÷ longer word's length), to be corrected in place rather than treated as an unrelated word swap. Default `0.5`.

### Outputs
An ordered array of frames. Each frame carries: the full text visible at that point in the transition, the character index into that text where the caret sits, and which kind of change produced it from the previous frame — see Interface for the full set. The first frame always equals `from` (caret at its end); the last frame always equals `to` (caret at its end).

### Guarantees / Constraints
- Deterministic and pure: no timing, randomness, or side effects. Calling it twice with the same inputs returns identical output. Bakes in no delays — a caller drives the actual animation by stepping through the frames on its own clock, choosing a delay per frame from its action.
- Words are compared at the whole-word level (whitespace-delimited), not character-by-character across the whole phrase — so "word" is the unit that either matches, partially matches, or doesn't.
- A word present in both `from` and `to` is left untouched wherever it falls in the phrase — it does not need to be adjacent to other unchanged words, first, or last.
- A word that differs from its counterpart but is similar enough to it (see `similarityThreshold`) is corrected in place: backspaced only down to their shared prefix, then retyped only past it — never fully cleared when part of it is already correct. Two words tying on alignment cost but not actually similar (e.g. sharing one incidental leading letter) are never paired this way — they're treated as an unrelated delete and insert instead.
- Two phrases sharing no similar words at all still produce a valid transition: every word is deleted and every replacement word is typed, in an order consistent with a minimum-edit alignment (never reordering `from`'s words relative to each other, or `to`'s words relative to each other).
- Two identical inputs produce a single frame equal to both (no edit needed).
- The caret only ever moves one character at a time — by editing (typing or deleting) or by gliding with no text change — never jumping straight from one position to a distant one. Starting from the end of `from` (where a caret dwelling on a fully-typed phrase already sits), it works backward through the phrase, resolving each change completely as it reaches it, before gliding on to the next; it finishes with one more glide to the true end of `to`.
- Reconstructing text from partially-edited words never produces doubled or missing spaces between words, regardless of which words are mid-edit, freshly deleted, or not yet inserted — including while a multi-word run of wrong text is only partway deleted or a multi-word run of new text is only partway typed.
- Prefix matching, per-frame slicing, and single-step caret movement all operate on Unicode code points, not raw UTF-16 code units — a surrogate-pair character (most emoji, including ones outside the Basic Multilingual Plane) is always treated as one indivisible unit, whether being typed, deleted, or glided past. Two different emoji can share a UTF-16 high surrogate without sharing a character; comparing at the code-unit level would misread that as a one-unit common prefix and produce a frame with an unpaired surrogate (renders as a broken glyph). Every frame's text is well-formed UTF-16 with no unpaired surrogate.

## Behavior

**Matching words, anywhere:** Both phrases are split into words and aligned with a minimum-edit alignment: words that appear in both, in the same relative order, are kept as anchors and never touched, no matter where in the phrase they sit.

**Similar-enough words are corrected in place:** A pair of differing words is only aligned as one in-place edit when they're actually similar (their Levenshtein distance is within `similarityThreshold` of the longer word's length) — the caret backspaces down to their shared prefix, then types the remainder of the new word. A pair that merely ties on raw alignment cost without being genuinely similar (e.g. two unrelated words sharing a single leading letter) is never aligned this way.

**Full word replacement:** A word with no similar counterpart in the other phrase is deleted in full or inserted in full, depending on which side it belongs to. A run of several consecutive such words (nothing anchoring them in between) is treated as one continuous stretch to clear and one continuous stretch to write, not as separate per-word actions.

**Right-to-left resolution, no deferral:** The transition proceeds as a single trip starting from the caret's position at the end of `from`, working backward. Each change — an in-place word correction, or a run of wrong words to clear followed immediately by a run of new words to write in their place — is resolved completely as soon as it's reached, including typing anything new that belongs there, before the caret moves on. Nothing is held back for a later pass, even content that will end up at the very end of `to`.

**Gliding, not jumping:** Between one resolved change and the next, the caret moves through whatever's already correct one character at a time, without altering it — quick relative to actual typing, since nothing is being composed. This includes crossing a word already fixed by an earlier step in the same transition.

**Settling:** After every change is resolved, one last glide brings the caret to the true end of `to`, even if the final change happened mid-phrase and left the caret short of the end (e.g. because the phrase's leading words never needed to change and the trip finished by editing something further right, or by chance ended with a correction rather than a fresh word at the very front).

**No overlap:** When `from` and `to` share no similar words, the transition degrades to deleting the old phrase in full and typing the new one in full — the same result a naive clear-and-retype would produce, just expressed as the same frame format and the same right-to-left, no-deferral shape.

## Interface

### Frame actions
- `"start"` — the initial frame, equal to `from`.
- `"delete"` / `"insert"` — a character removed from or added to a wholly new/unwanted word (a gap with nothing to preserve at that position).
- `"editDelete"` / `"editInsert"` — the same, but on a word being corrected in place (it's similar enough to its replacement). Kept distinct from `"delete"`/`"insert"` because a real correction reads as more effortful than fresh typing — callers typically drive these at a different pace (see `useTypewriter`'s `editTypingSpeed`/`editDeletingSpeed`).
- `"move"` — the caret gliding one character to relocate, with no text change.
- `"pause"` / `"editPause"` — the caret holding still immediately before a fresh (`"pause"`) or in-place-correction (`"editPause"`) action begins.

### Usage
```ts
const frames = buildTypewriterFrames("Software engineer", "Software builder");
// frames[0]:  { text: "Software engineer", cursor: 18, action: "start" }
// ...backspaces "engineer"...
// ...types "builder"...
// frames[last]: { text: "Software builder", cursor: 17, action: "pause" }
```
A caller (see `useTypewriter`) steps through the array on its own timer, picking a per-frame delay from `action`.

### Word matching, not fuzzy text matching
Only whole words are compared for equality and for in-place-correction eligibility — the function does not attempt character-level diffing across word boundaries or reorder words to find a better alignment; alignment always preserves each phrase's own word order.

## Acceptance
1. `buildTypewriterFrames(x, x)` returns exactly one frame: `{ text: x, cursor: x.length, action: "start" }`.
2. A word identical in `from` and `to`, regardless of position, never appears as the subject of a `"delete"`/`"insert"`/`"editDelete"`/`"editInsert"` frame — it is present unchanged in every frame's `text`.
3. Two differing words within `similarityThreshold` of each other produce `"editDelete"` frames only down to their shared prefix (never fewer characters remain of the old word than the prefix), followed by `"editInsert"` frames only for the remainder of the new word.
4. Two differing words further apart than `similarityThreshold` never produce `"editDelete"`/`"editInsert"` frames for that pair, even if aligning them as an edit would tie on raw character-count cost with treating them separately.
5. Two phrases with no similar words still produce a complete, correct transition: the final frame's text equals `to` exactly.
6. Every frame's `text`, when whitespace-normalized, contains no doubled spaces and no missing space between two adjacent words — including mid-transition, while a multi-word gap is only partway cleared or written.
7. The first frame always has `text === from`; the last frame always has `text === to` with `cursor === to.length`.
8. Every consecutive pair of frames has `cursor` values exactly one code point apart in `text` — never equal (a no-op frame) and never differing by more than one character's worth of UTF-16 units.
9. Calling the function twice with the same `from`/`to` (and the same `similarityThreshold`) produces two identical frame arrays (no randomness).
10. No frame's `text` ever contains an unpaired UTF-16 surrogate, even when `from` and `to` contain surrogate-pair characters (emoji) that happen to share a UTF-16 code unit without being the same character, and even while the caret glides across one.
11. Given a phrase with a change near the end and another near the front and nothing salvageable at either end (e.g. "I type words for a living" -> "Probably typing a word right now"), the run of new words belonging at the very end of `to` appears in the frame sequence before the front-of-phrase change is resolved — confirming changes are resolved in the order the caret reaches them (right to left from its starting position), not deferred to a final pass.
