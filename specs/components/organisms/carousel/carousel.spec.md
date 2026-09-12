# Carousel — Rotating Slide Viewer

## Purpose
Carousel rotates through a set of slides — most often images — within a single fixed-size viewport. It gives space-constrained layouts, like a Card's image area, a way to show several images instead of one, advancing automatically or under direct user control.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Motion tokens](../../../atoms/motion.spec.md)
- [Card component](../card/card.spec.md)

## Contract

### Inputs
- An ordered list of slides (arbitrary content, typically images).
- Optional aspect ratio for the viewport. Default a 16:9 widescreen ratio.
- Optional autoplay flag. On by default.
- Optional interval between automatic advances. Defaults to five seconds.
- Optional flag to pause autoplay while hovered or focused within. On by default.
- Optional controlled active slide index, an initial active index, and a callback fired whenever the active slide changes.
- Optional accessible label for the carousel region.
- Optional flag to show the arrow and dot navigation controls. On by default.
- Optional flag marking the whole carousel as decorative. Off by default.
- Optional additional CSS class name.

### Outputs
A fixed-size viewport showing one slide at a time, crossfading to the next. Arrow buttons and dot indicators appear whenever there is more than one slide and navigation controls are enabled; a single slide, or navigation controls turned off, renders with no controls at all.

### Guarantees / Constraints
- Advancing past the last slide wraps to the first, and reversing past the first wraps to the last — the arrows always have somewhere to go.
- Autoplay pauses while the pointer is over the carousel or focus is inside it, and resumes when it leaves.
- A carousel with zero slides renders nothing; a carousel with exactly one slide renders that slide with no arrows or dots.
- Turning off navigation controls still advances slides via autoplay; only the arrows and dots disappear.
- Marking the carousel decorative hides the whole region from assistive technology instead of announcing it as a carousel with labeled slides — intended for purely ambient rotation (e.g. a rotating background photo) that carries no information a screen reader user needs.
- The crossfade transition is skipped when the user prefers reduced motion; slides swap instantly.

## Behavior

**Default:** The first slide (or the initial/controlled active index) is shown. If autoplay is enabled and there is more than one slide, the carousel advances to the next slide automatically after the configured interval.

**Autoplay, paused:** Hovering the carousel, or moving keyboard focus into it, pauses automatic advancing until the pointer leaves or focus moves back out.

**Arrow navigation:** Clicking the next or previous arrow crossfades to the adjacent slide, wrapping around at either end.

**Dot navigation:** Clicking a dot crossfades directly to that slide.

**Single slide:** With only one slide, the carousel shows it with no arrows or dots, and does not autoplay.

**Controls hidden:** With navigation controls turned off, the carousel still autoplays (subject to hover/focus pausing) but shows no arrows or dots, regardless of slide count. Useful for ambient, decorative rotation with no user-facing controls.

**Decorative:** Marking the carousel decorative hides the region and its slides from assistive technology entirely, rather than exposing carousel semantics and per-slide position labels a screen reader user has no use for on purely ambient content.

**Reduced motion:** The active slide changes instantly with no crossfade, whether triggered by autoplay, arrows, or dots.

## Interface

### Layout
The viewport fills its container at the configured aspect ratio; each slide is layered to fill that same space, so slides crossfade in place rather than shifting the surrounding layout. Arrow buttons sit vertically centered on the left and right edges, as small circular controls with a neutral dark, semi-transparent style suited to sitting atop arbitrary image content regardless of the page's theme. Dot indicators sit centered along the bottom edge, one per slide, with the active dot visually distinct from the rest.

### Accessibility
By default, the carousel is announced as a region with a carousel role, labeled either by the provided accessible label or a sensible default. Each slide is announced with its position among the total (e.g. "2 of 4") and is hidden from assistive technology while inactive. Arrow and dot buttons carry their own accessible labels ("Previous slide", "Next slide", "Go to slide N") and show a visible focus indicator when navigated to by keyboard. Marked decorative, the carousel and its slides are hidden from assistive technology altogether.

### Using Carousel as a Card image
Because Card's image slot accepts any content, a Carousel can be passed directly as a Card's `image` prop to give the card multiple rotating images. No special integration is required in either direction — the Carousel fills the space Card already reserves for its image, at any media position or expanded state.

### Using Carousel as ambient media (e.g. in a Hero)
Turning off navigation controls and marking the carousel decorative gives a rotating visual with no interactive chrome and no assistive-technology footprint — the shape needed for a `Hero`'s `media` slot when it rotates through several photos. Pair with `showControls={false}` and `decorative` together for this case.

## Acceptance
1. Renders the first slide (or the given initial/controlled index) by default.
2. Renders nothing when given zero slides.
3. Renders a single slide with no arrow or dot controls when given exactly one slide.
4. Autoplay advances to the next slide automatically after the configured interval when there is more than one slide.
5. Autoplay pauses while the carousel is hovered, and resumes when the pointer leaves.
6. Autoplay pauses while focus is inside the carousel, and resumes when focus moves outside it.
7. Clicking the next arrow advances to the next slide, wrapping from the last slide back to the first.
8. Clicking the previous arrow goes to the previous slide, wrapping from the first slide back to the last.
9. Clicking a dot jumps directly to its corresponding slide.
10. The active dot is visually distinguished from the others.
11. Slide transitions crossfade by default and swap instantly when the user prefers reduced motion.
12. Each slide and each control carries an accessible label; the active slide is exposed to assistive technology while others are hidden.
13. Passing a Carousel as a Card's `image` prop renders it filling the card's image area with no further configuration.
14. Setting the show-controls flag off hides arrows and dots even with multiple slides, while autoplay continues to advance them.
15. Setting the decorative flag hides the carousel and its slides from assistive technology, overriding the default region/slide labeling.
