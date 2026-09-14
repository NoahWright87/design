# TextCarousel — Rotating Text

## Purpose
TextCarousel rotates a piece of text through a list of alternatives in place — a rotating job title, a changing tagline, a list of adjectives — using one of a few animation styles. It exists so that "rotate through some strings" is a single reusable building block with a choice of animations, rather than every page reinventing its own timer and transition logic. `Hero`'s `tagline` slot is its most natural home, but it composes anywhere a rotating label is useful, including inline within a sentence.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Motion tokens](../../../atoms/motion.spec.md)
- [useTypewriter atom](../../../atoms/usetypewriter.spec.md)
- [typewriterDiff atom](../../../atoms/typewriterdiff.spec.md)
- [usePrefersReducedMotion atom](../../../atoms/useprefersreducedmotion.spec.md)
- [Hero component](../../organisms/hero/hero.spec.md)

## Contract

### Inputs
- An ordered list of strings to rotate through.
- Optional animation style: crossfade, sequential fade, or typewriter. Defaults to crossfade.
- Optional HTML element to render as (so it can stand in for a heading, a span, or any other text-bearing element). Defaults to an inline span.
- Optional interval — how long each item stays fully visible before transitioning onward (also used as the average dwell time between typing and deleting, for the typewriter style).
- Optional transition duration, for the crossfade and sequential fade styles.
- Optional average typing speed and a fraction to randomize each character's typing delay around it, for the typewriter style.
- Optional deleting speed (per character, always constant), for the typewriter style.
- Optional edit-tier typing speed, jitter, and deleting speed — for correcting a word in place rather than typing/deleting a wholly new one — and a caret-glide speed for moving through already-correct text; all for the typewriter style, all default to a slower (edits) or faster (glide) multiple of the fresh-tier values.
- Optional fraction to randomize the dwell time around its average, for the typewriter style.
- Optional pause duration before typing/deleting a wholly new word begins, and a separate (longer, by default) pause before correcting a word in place, for the typewriter style.
- Optional similarity threshold controlling which differing word pairs are corrected in place versus treated as an unrelated swap, for the typewriter style.
- Optional flag to pause rotation while hovered. On by default.
- Optional additional CSS class name.

### Outputs
Text that changes from one item to the next automatically and indefinitely, using the chosen animation, looping back to the first item after the last.

### Guarantees / Constraints
- Given zero items, renders nothing.
- Given exactly one item, renders it and does not rotate (there is nothing to rotate to).
- Crossfade and sequential fade transitions are skipped when the user prefers reduced motion; items swap instantly. The typewriter style shows each item in full immediately under reduced motion rather than typing and deleting character by character.
- Hovering pauses rotation while `pauseOnHover` is enabled (the default), and rotation resumes from where it left off when the pointer leaves.
- None of the three styles ever collapse or shift the surrounding layout as the active item changes: crossfade and sequential fade are always sized to the widest/tallest item across the whole list, and typewriter reserves the same tallest/widest space regardless of how many characters are currently typed — even when items wrap to different numbers of lines.
- Typewriter's typing delay and dwell duration vary per character and per item respectively, averaging the configured values; deleting speed never varies, simulating a constantly-held backspace key.
- Typewriter transitions between items the way a person editing a sentence would (see the `useTypewriter`/`typewriterDiff` atoms): starting from the caret's current position, it resolves each change completely as it's reached — right to left, no deferral — gliding rather than jumping through anything already correct in between. A word shared between the outgoing and incoming item, wherever it falls, is left in place rather than deleted and retyped.
- Typewriter drives a word correction (an in-place edit of a similar word) at its own, slower pace than typing or deleting a wholly new/unwanted word, and pauses longer before starting one — a correction reads as more effortful than fresh typing.

## Behavior

**Default (crossfade):** All items occupy the same space, stacked on top of each other. The current item is fully opaque and the rest fully transparent; on each interval, the next item fades in while the current one fades out over the same span, so the two overlap mid-transition rather than leaving a gap.

**Sequential:** Only one item is ever rendered. On each interval, it fades out fully, its text is swapped for the next item once fully invisible, and the new text fades in. Unlike crossfade, the outgoing and incoming text never overlap.

**Typewriter:** The first item is typed out a character at a time — each character's delay randomized around the average typing speed — and dwells fully typed for a randomized duration with a blinking caret. Transitioning to the next item starts from the caret's current position and works backward through the phrase, resolving each change completely as it's reached before gliding on: a run of wholly wrong words is cleared and its replacement written in one continuous motion, and a word similar enough to its replacement (e.g. "build" -> "builder") is backspaced only past their shared prefix and retyped from there — both at a slower, more deliberate pace than fresh typing/deleting. A word the two items share, wherever it falls, is left untouched; the caret only glides past it. See the `useTypewriter` atom (and the `typewriterDiff` atom it's built on) for the full behavior of this engine.

**Hover pause:** While `pauseOnHover` is enabled and the pointer is over the element, rotation halts exactly where it is (mid-fade or mid-type) and resumes when the pointer leaves.

**Single item:** Renders the one item with no rotation, regardless of animation style.

**Reduced motion:** Crossfade and sequential fade swap instantly with no transition. Typewriter shows each full item for the configured interval with no character-by-character reveal.

## Interface

### Layout
All three styles size themselves to the widest/tallest item across the whole list, not just the one currently showing, so nothing reflows the surrounding layout as items change — including when different items wrap to different numbers of lines. Crossfade does this by stacking every item in the same space and toggling opacity. Sequential fade and typewriter only ever display one item's text at a time, but reserve space using the same stacking technique: an invisible copy of every item occupies the same space as the visible one, so the visible item's box never needs to grow, shrink, or wrap on its own to accommodate a shorter or longer item.

### Accessibility
The visible item's text is real, present content — not hidden from assistive technology — so it reads normally to a screen reader that visits it. It is not wrapped in a live region, so a screen reader does not announce every rotation; this matches the ambient, decorative nature of a rotating tagline rather than an update the user needs to be alerted to. The typewriter caret and the invisible reservation copies used to hold layout steady (sequential fade and typewriter) are purely presentational and hidden from assistive technology.

### Choosing an animation
Crossfade suits a tagline or label where a smooth, ambient overlap feels natural. Sequential fade suits a spot where the outgoing and incoming text should read as clearly distinct moments rather than blending together. Typewriter suits a spot that wants to draw the eye, evoking text actively being composed.

## Acceptance
1. Renders nothing when given zero items.
2. Renders the single item with no rotation when given exactly one item.
3. Crossfade shows the outgoing and incoming item's opacity moving in the same transition window, not sequentially.
4. Crossfade's container width matches the widest item regardless of which item is active.
5. Sequential fade fully hides the outgoing item before the incoming item's text appears, with no overlap.
6. Sequential fade's container size matches the widest/tallest item across the whole list regardless of which item is active, including when items wrap to different numbers of lines.
7. Typewriter types the first item character by character — each character's delay randomized around the average typing speed — then dwells with a blinking caret for a randomized duration. Transitioning to the next item resolves each change right to left from the caret's current position, in a single pass with no deferred content (per `typewriterDiff`), leaving any word shared between the two items untouched wherever it falls, before dwelling on the new item in turn.
8. Typewriter's container size matches the tallest/widest item across the whole list at all times, regardless of the currently-typed item or its current length, including when items wrap to different numbers of lines.
9. Hovering pauses rotation when `pauseOnHover` is enabled (the default), and rotation resumes from the same point when the pointer leaves.
10. Setting `pauseOnHover` to false continues rotating regardless of hover.
11. Crossfade and sequential fade transitions swap instantly, with no animation, when the user prefers reduced motion.
12. Typewriter shows each item in full immediately, with no character-by-character reveal or pause between items, when the user prefers reduced motion.
13. Rendered text is present in the accessibility tree (not `aria-hidden`) and is not wrapped in a live region; the invisible layout-reservation copies used by sequential fade and typewriter are hidden from assistive technology.
14. The `as` prop changes the rendered HTML element while preserving all rotation behavior.
15. Typewriter's deleting speed never varies, regardless of the typing and dwell jitter settings.
16. Typewriter drives characters that correct a word in place at a different (by default slower) speed than characters that type or delete a wholly new/unwanted word, and holds the caret longer before starting a correction than before fresh content.
