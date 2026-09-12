# Hero — Introductory Banner

## Purpose
Hero lays out the introductory banner pattern common to a site's landing page: a title, an optional secondary tagline, supporting description copy, and a row of actions, with an optional media element that floats beside that content on wide screens and stacks below it on narrow ones. It exists so this layout — title/tagline/description/actions plus a responsive media slot — is a single reusable organism instead of a bespoke section rebuilt on every site.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Heading component](../../molecules/heading/heading.spec.md)
- [TextCarousel component](../../molecules/textcarousel/textcarousel.spec.md)
- [Carousel component](../carousel/carousel.spec.md)

## Contract

### Inputs
- A title, rendered as the main heading.
- An optional tagline, rendered one heading level below the title — a natural place for a `TextCarousel` when the tagline should rotate through several options.
- An optional description, rendered under the tagline.
- An optional row of actions (typically buttons or links), rendered under the description.
- An optional media element — a photo, illustration, or a `Carousel` rotating through several — rendered beside the text content.
- An optional media position, `"start"` or `"end"`, choosing which side the media sits on relative to the text. Defaults to `"end"` (the trailing side).
- An optional heading level for the title (the tagline follows one level below, clamped at 6). Defaults to `1`.
- Optional additional CSS class name.

### Outputs
A banner section with the text content in one column and, when provided, the media in an adjacent column on wide screens. On narrow screens the two stack vertically, text first, regardless of the configured media position.

### Guarantees / Constraints
- Every slot (tagline, description, actions, media) is optional; Hero renders correctly with just a title.
- The text column and the media column never compete for the same space at once outside the narrow-screen stack: at any given width, layout is either side-by-side or stacked, never a cramped in-between.
- On narrow screens, text content always appears above media, regardless of the configured media position, since the text is the primary content to read first.
- Hero itself renders no animation and holds no rotation state; any rotation (a changing tagline, a changing photo) is the responsibility of whatever is passed into the `tagline` or `media` slot.

## Behavior

**Default:** Title renders as the top-level heading. If provided, tagline renders immediately under it one heading level down, then description, then the actions row. If media is provided, it appears beside the text column on wide screens, on the trailing (end) side by default.

**Media position `"start"`:** Media appears on the leading side of the text column on wide screens instead of the trailing side.

**No media:** The text column takes the full width; no empty space is reserved for media.

**Narrow screens:** Text content and media stack vertically. Text always appears first, above media, regardless of the configured media position.

**Rotating tagline or media:** Because `tagline` and `media` accept arbitrary content, passing a `TextCarousel` as the tagline or a `Carousel` as the media gives Hero a rotating tagline or rotating photo with no special integration — Hero simply lays out whatever it is given.

## Interface

### Layout
On wide screens, the text column and the media element sit side by side with a comfortable gap between them, vertically centered against each other. The text column takes up the remaining space; media keeps a fixed, moderate width suited to a portrait-ish photo. Below a mobile breakpoint, the layout switches to a single stacked column: text content first, then media (if present), centered and capped to a comfortable width so it doesn't dominate a narrow screen.

### Accessibility
Title and tagline render as real headings at the levels provided, preserving a correct heading hierarchy on the page. Hero does not impose any special accessibility treatment on description, actions, or media beyond what those slots' own content provides — a decorative rotating photo passed as media should be marked appropriately by that content itself (see `Carousel`'s `decorative` flag).

### Composing with TextCarousel and Carousel
Hero, `TextCarousel`, and `Carousel` are designed to compose: a rotating tagline is `<Hero tagline={<TextCarousel items={...} animation="typewriter" />} />`, and a rotating photo is `<Hero media={<Carousel items={...} showControls={false} decorative />} />`. Hero does not need to know about either rotation mechanism to support them.

## Acceptance
1. Renders correctly with only a title — no tagline, description, actions, or media required.
2. Tagline, when provided, renders one heading level below the title.
3. Description and actions, when provided, render under the tagline in that order.
4. Media, when provided, renders beside the text column on wide screens; omitting it leaves no reserved space.
5. Media position `"end"` (the default) places media on the trailing side; `"start"` places it on the leading side.
6. On narrow screens, text content stacks above media regardless of the configured media position.
7. Passing a `TextCarousel` as `tagline` rotates the tagline with no additional Hero configuration.
8. Passing a `Carousel` as `media` rotates the photo with no additional Hero configuration.
9. Changing `headingLevel` shifts both the title and tagline heading levels, keeping the tagline one level below the title, clamped at heading level 6.
