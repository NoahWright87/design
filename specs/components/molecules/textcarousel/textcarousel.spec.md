# TextCarousel — Rotating Text

## Purpose
TextCarousel rotates a piece of text through a list of alternatives in place — a rotating job title, a changing tagline, a list of adjectives — using one of a few animation styles. It exists so that "rotate through some strings" is a single reusable building block with a choice of animations, rather than every page reinventing its own timer and transition logic. `Hero`'s `tagline` slot is its most natural home, but it composes anywhere a rotating label is useful, including inline within a sentence.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Motion tokens](../../../atoms/motion.spec.md)
- [useTypewriter atom](../../../atoms/usetypewriter.spec.md)
- [usePrefersReducedMotion atom](../../../atoms/useprefersreducedmotion.spec.md)
- [Hero component](../../organisms/hero/hero.spec.md)

## Contract

### Inputs
- An ordered list of strings to rotate through.
- Optional animation style: crossfade, sequential fade, or typewriter. Defaults to crossfade.
- Optional HTML element to render as (so it can stand in for a heading, a span, or any other text-bearing element). Defaults to an inline span.
- Optional interval — how long each item stays fully visible before transitioning onward.
- Optional transition duration, for the crossfade and sequential fade styles.
- Optional typing and deleting speeds (per character), for the typewriter style.
- Optional flag to pause rotation while hovered. On by default.
- Optional additional CSS class name.

### Outputs
Text that changes from one item to the next automatically and indefinitely, using the chosen animation, looping back to the first item after the last.

### Guarantees / Constraints
- Given zero items, renders nothing.
- Given exactly one item, renders it and does not rotate (there is nothing to rotate to).
- Crossfade and sequential fade transitions are skipped when the user prefers reduced motion; items swap instantly. The typewriter style shows each item in full immediately under reduced motion rather than typing and deleting character by character.
- Hovering pauses rotation while `pauseOnHover` is enabled (the default), and rotation resumes from where it left off when the pointer leaves.
- The crossfade style never collapses its box to zero size between items — the container is always sized to the widest item, regardless of which is currently visible.

## Behavior

**Default (crossfade):** All items occupy the same space, stacked on top of each other. The current item is fully opaque and the rest fully transparent; on each interval, the next item fades in while the current one fades out over the same span, so the two overlap mid-transition rather than leaving a gap.

**Sequential:** Only one item is ever rendered. On each interval, it fades out fully, its text is swapped for the next item once fully invisible, and the new text fades in. Unlike crossfade, the outgoing and incoming text never overlap.

**Typewriter:** The current item is typed out a character at a time, dwells fully typed with a blinking caret, is deleted a character at a time, and then the next item begins typing. See the `useTypewriter` atom for the full behavior of this engine.

**Hover pause:** While `pauseOnHover` is enabled and the pointer is over the element, rotation halts exactly where it is (mid-fade or mid-type) and resumes when the pointer leaves.

**Single item:** Renders the one item with no rotation, regardless of animation style.

**Reduced motion:** Crossfade and sequential fade swap instantly with no transition. Typewriter shows each full item for the configured interval with no character-by-character reveal.

## Interface

### Layout
As a crossfade, the element sizes itself to the widest item so nothing reflows the surrounding layout as items change. As a sequential fade or typewriter, the element sizes itself to whatever the current item's rendered width is, since only one item is ever present in the document at a time — surrounding content may shift slightly as item lengths differ, the same as it would for any changing line of text.

### Accessibility
The rendered text is real, present content — not hidden from assistive technology — so it reads normally to a screen reader that visits it. It is not wrapped in a live region, so a screen reader does not announce every rotation; this matches the ambient, decorative nature of a rotating tagline rather than an update the user needs to be alerted to. The typewriter caret is a purely visual affordance and is hidden from assistive technology.

### Choosing an animation
Crossfade suits a tagline or label where a smooth, ambient overlap feels natural. Sequential fade suits a spot where the outgoing and incoming text should read as clearly distinct moments rather than blending together. Typewriter suits a spot that wants to draw the eye, evoking text actively being composed.

## Acceptance
1. Renders nothing when given zero items.
2. Renders the single item with no rotation when given exactly one item.
3. Crossfade shows the outgoing and incoming item's opacity moving in the same transition window, not sequentially.
4. Crossfade's container width matches the widest item regardless of which item is active.
5. Sequential fade fully hides the outgoing item before the incoming item's text appears, with no overlap.
6. Typewriter types the active item character by character, dwells with a blinking caret, deletes it character by character, then types the next item.
7. Hovering pauses rotation when `pauseOnHover` is enabled (the default), and rotation resumes from the same point when the pointer leaves.
8. Setting `pauseOnHover` to false continues rotating regardless of hover.
9. Crossfade and sequential fade transitions swap instantly, with no animation, when the user prefers reduced motion.
10. Typewriter shows each item in full immediately, with no character-by-character reveal, when the user prefers reduced motion.
11. Rendered text is present in the accessibility tree (not `aria-hidden`) and is not wrapped in a live region.
12. The `as` prop changes the rendered HTML element while preserving all rotation behavior.
