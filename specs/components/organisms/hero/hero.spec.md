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
- A title, rendered as given at the top of the text column.
- An optional tagline, rendered under the title as given — a natural place for a `TextCarousel` when the tagline should rotate through several options.
- An optional description, rendered under the tagline.
- An optional row of actions (typically buttons or links), rendered under the description.
- An optional media element — a photo, illustration, or a `Carousel` rotating through several — rendered beside the text content.
- An optional media position, `"start"` or `"end"`, choosing which side the media sits on relative to the text. Defaults to `"end"` (the trailing side).
- An optional background treatment distinguishing the hero from the surrounding page: a subtle tint, or a tint toward the primary or secondary theme color. Defaults to none (transparent).
- An optional bottom-edge decoration: a thin solid divider, or a primary→secondary gradient bar. Defaults to none.
- Optional additional CSS class name.

### Outputs
A banner section with the text content in one column and, when provided, the media in an adjacent column on wide screens. On narrow screens the two stack vertically, text first, regardless of the configured media position.

### Guarantees / Constraints
- Every slot (tagline, description, actions, media) is optional; Hero renders correctly with just a title.
- Title and tagline are rendered exactly as given, with no heading level, styling, or wrapping imposed — the same "arbitrary content in, unmodified content out" contract `Header` and `Footer` already use for their slots. A call site supplies its own `Heading` (or other) element for correct semantics and whatever visual treatment it needs.
- The text column and the media column never compete for the same space at once outside the narrow-screen stack: at any given width, layout is either side-by-side or stacked, never a cramped in-between.
- On narrow screens, text content always appears above media, regardless of the configured media position, since the text is the primary content to read first.
- Hero itself renders no animation and holds no rotation state; any rotation (a changing tagline, a changing photo) is the responsibility of whatever is passed into the `tagline` or `media` slot.
- A background treatment other than none adds matching internal padding around the whole hero, so text and media aren't flush against the tinted edge; with no background treatment, Hero adds no padding of its own (spacing around it remains the surrounding page's responsibility, as today).

## Behavior

**Default:** Title renders at the top of the text column exactly as given. If provided, tagline renders immediately under it, then description, then the actions row. If media is provided, it appears beside the text column on wide screens, on the trailing (end) side by default.

**Media position `"start"`:** Media appears on the leading side of the text column on wide screens instead of the trailing side.

**No media:** The text column takes the full width; no empty space is reserved for media.

**Narrow screens:** Text content and media stack vertically. Text always appears first, above media, regardless of the configured media position.

**Rotating tagline or media:** Because `tagline` and `media` accept arbitrary content, passing a `TextCarousel` as the tagline or a `Carousel` as the media gives Hero a rotating tagline or rotating photo with no special integration — Hero simply lays out whatever it is given.

**Background treatment:** A subtle, primary, or secondary background tints the whole hero section and adds internal padding on all sides so content keeps its distance from the tinted edge. With no background treatment, Hero remains transparent and unpadded.

**Bottom border treatment:** A solid divider or gradient bar sits along the hero's bottom edge, with a little added bottom padding so the actions row (or whatever ends the text column) isn't flush against it. The two bottom-border options and the three background options combine freely — a tinted hero can also carry a bottom divider or gradient bar.

## Interface

### Layout
On wide screens, the text column and the media element sit side by side with a comfortable gap between them, vertically centered against each other. The text column takes up the remaining space; media keeps a fixed, moderate width suited to a portrait-ish photo. Below a mobile breakpoint, the layout switches to a single stacked column: text content first, then media (if present), centered and capped to a comfortable width so it doesn't dominate a narrow screen.

### Background and bottom border
A tinted background reads as a gently rounded, padded panel — subtle enough to distinguish the hero from the page without looking like a hard-edged box. A gradient bottom border reads as a slim accent bar the width of the hero, in the same primary→secondary gradient `Heading`'s `gradient` prop uses elsewhere, so the two stay visually consistent across a page that uses both. A solid bottom border is a plain, low-contrast divider suited to a quieter separation from whatever follows.

### Accessibility
Hero imposes no heading level or semantics of its own — a call site is responsible for giving `title` and `tagline` correct heading elements (typically `Heading` at a level that fits the page's own hierarchy), the same way any `Header` or `Footer` slot's accessibility is the responsibility of what's placed inside it. Hero does not impose any special accessibility treatment on description, actions, or media either — a decorative rotating photo passed as media should be marked appropriately by that content itself (see `Carousel`'s `decorative` flag).

### Composing with Heading, TextCarousel, and Carousel
Hero, `Heading`, `TextCarousel`, and `Carousel` are designed to compose: a title is `<Hero title={<Heading level={1}>Name</Heading>} />`, a rotating tagline is `<Hero tagline={<Heading level={2}><TextCarousel items={...} animation="typewriter" /></Heading>} />`, and a rotating photo is `<Hero media={<Carousel items={...} showControls={false} decorative />} />`. Hero does not need to know about heading semantics or either rotation mechanism to support all three.

## Acceptance
1. Renders correctly with only a title — no tagline, description, actions, or media required.
2. Title and tagline render exactly as given, with no heading level, class, or style added by Hero.
3. Description and actions, when provided, render under the tagline in that order.
4. Media, when provided, renders beside the text column on wide screens; omitting it leaves no reserved space.
5. Media position `"end"` (the default) places media on the trailing side; `"start"` places it on the leading side.
6. On narrow screens, text content stacks above media regardless of the configured media position.
7. Passing a `Heading` as `title` or `tagline` preserves whatever level and visual props (`gradient`, `animateIn`, etc.) that `Heading` was given.
8. Passing a `TextCarousel` as `tagline` rotates the tagline with no additional Hero configuration.
9. Passing a `Carousel` as `media` rotates the photo with no additional Hero configuration.
10. Setting a background treatment (`"subtle"`, `"primary"`, or `"secondary"`) tints the section and adds internal padding around its content; the default (`"none"`) stays transparent and unpadded.
11. Setting `bottomBorder` to `"solid"` renders a thin neutral divider along the bottom edge; `"gradient"` renders a primary→secondary gradient bar instead. The default (`"none"`) renders neither.
12. Background and bottom-border treatments combine: setting both applies the tint's padding and the border's decoration together without either overriding the other.
