# Text Carousel Playground

## Purpose

The playground lets a designer try custom phrases against the live typewriter carousel and inspect how transitions read before using them on a page.

## Related

- [TextCarousel](../components/molecules/textcarousel/textcarousel.spec.md)
- [typewriterDiff](../atoms/typewriterdiff.spec.md)

## Contract

### Inputs

- A multiline phrase list, with one phrase on each line.
- A typo chance percentage for observing occasional typing repairs.
- An Apply phrases and restart button.

### Outputs

- A visible typewriter carousel that cycles through the applied phrases.
- An empty-state message when the applied list contains no phrases.

### Guarantees / Constraints

- Whitespace around each line is trimmed, and blank lines are ignored.
- Draft edits and the typo chance take effect when the form is submitted. Each submission restarts the carousel from its first phrase, including when the applied text matches the previous list.
- Hovering over the preview leaves its animation running so the editing behavior can be observed.

## Behavior

The page opens with example phrases that exercise word reordering, partial edits, and broad rewrites. A designer edits the list and submits it to replace the preview's phrase sequence and restart playback. Applying an empty list displays guidance until another list is submitted.

## Interface

The preview is prominent above a labeled multiline field, a typo chance control, and a submit button. The fields accept keyboard editing, and the button supports keyboard submission. The preview uses design-system colors and displays the same `TextCarousel` component that consumers use.

## Acceptance

1. Each nonblank input line becomes one carousel item in order after submission.
2. The preview restarts from the first phrase on every submission.
3. An empty submitted list shows the empty-state message.
4. The preview continues animating while hovered.
5. Changing the typo chance and submitting restarts the preview with the new frequency.
