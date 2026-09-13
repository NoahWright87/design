# Hero — Introductory Banner

## Purpose
Hero lays out the introductory banner pattern common to a site's landing page: a title, an optional secondary tagline, supporting description copy, and a row of actions, with an optional media element that floats beside the title specifically — at every screen width, shrinking to a small fixed size on narrow screens rather than stacking below the rest of the content. It exists so this layout — title-plus-media row, tagline/description/actions stacked full-width underneath — is a single reusable organism instead of a bespoke section rebuilt on every site.

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
- An optional media element — a photo, illustration, or a `Carousel` rotating through several — rendered beside the title.
- An optional media position, `"start"` or `"end"`, choosing which side the media sits on relative to the title. Defaults to `"end"` (the trailing side).
- An optional background treatment distinguishing the hero from the surrounding page: a subtle tint, or a tint toward the primary or secondary theme color. Defaults to none (transparent).
- An optional bottom-edge decoration: a thin solid divider, or a primary→secondary gradient bar. Defaults to none.
- Optional additional CSS class name.

### Outputs
A banner section whose top row holds the title and, when provided, the media beside it, with tagline, description, and the actions row stacked full-width underneath that row. Media sits beside the title at every screen width; only its size changes on narrow screens (considerably smaller), never whether it stacks below.

### Guarantees / Constraints
- Every slot (tagline, description, actions, media) is optional; Hero renders correctly with just a title.
- Title and tagline are rendered exactly as given, with no heading level, styling, or wrapping imposed — the same "arbitrary content in, unmodified content out" contract `Header` and `Footer` already use for their slots. A call site supplies its own `Heading` (or other) element for correct semantics and whatever visual treatment it needs.
- Media always floats beside the title, at every screen width — it never stacks below the title or the rest of the content. Only its size changes at narrow widths, shrinking considerably rather than changing position.
- Tagline, description, and actions always render full-width, below the title/media row, regardless of screen width or media position.
- Hero itself renders no animation and holds no rotation state; any rotation (a changing tagline, a changing photo) is the responsibility of whatever is passed into the `tagline` or `media` slot.
- A background treatment other than none adds matching internal padding around the whole hero, so text and media aren't flush against the tinted edge; with no background treatment, Hero adds no padding of its own (spacing around it remains the surrounding page's responsibility, as today).

## Behavior

**Default:** Title renders exactly as given, with media (if provided) beside it on the trailing (end) side, the two vertically centered against each other. Tagline, description, and the actions row follow underneath, each full-width, in that order.

**Media position `"start"`:** Media appears on the leading side of the title instead of the trailing side. Tagline, description, and actions are unaffected — they always render underneath, full-width.

**No media:** The title takes the full width of its row; no empty space is reserved for media.

**Narrow screens:** Media stays beside the title — it does not stack below — but shrinks to a considerably smaller fixed size so the row still fits a narrow viewport. Tagline, description, and actions were already full-width underneath and are unaffected by the narrow breakpoint.

**Rotating tagline or media:** Because `tagline` and `media` accept arbitrary content, passing a `TextCarousel` as the tagline or a `Carousel` as the media gives Hero a rotating tagline or rotating photo with no special integration — Hero simply lays out whatever it is given.

**Background treatment:** A subtle, primary, or secondary background tints the whole hero section and adds internal padding on all sides so content keeps its distance from the tinted edge. With no background treatment, Hero remains transparent and unpadded.

**Bottom border treatment:** A solid divider or gradient bar sits along the hero's bottom edge, with a little added bottom padding so the actions row (or whatever ends the text column) isn't flush against it. The two bottom-border options and the three background options combine freely — a tinted hero can also carry a bottom divider or gradient bar.

## Interface

### Layout
The title and media sit side by side in a row, with a comfortable gap between them, vertically centered against each other. The title takes up the remaining space; media keeps a fixed width suited to a portrait-ish photo — moderate on wide screens, shrinking to a small fixed width below a mobile breakpoint. Tagline, description, and the actions row each render full-width beneath that row, at every screen width — this part of the layout does not change at the mobile breakpoint.

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
4. Media, when provided, renders beside the title at every screen width; omitting it leaves no reserved space.
5. Media position `"end"` (the default) places media on the trailing side of the title; `"start"` places it on the leading side.
6. On narrow screens, media stays beside the title rather than stacking below it, shrinking to a considerably smaller fixed size instead.
7. Passing a `Heading` as `title` or `tagline` preserves whatever level and visual props (`gradient`, `animateIn`, etc.) that `Heading` was given.
8. Passing a `TextCarousel` as `tagline` rotates the tagline with no additional Hero configuration.
9. Passing a `Carousel` as `media` rotates the photo with no additional Hero configuration.
10. Setting a background treatment (`"subtle"`, `"primary"`, or `"secondary"`) tints the section and adds internal padding around its content; the default (`"none"`) stays transparent and unpadded.
11. Setting `bottomBorder` to `"solid"` renders a thin neutral divider along the bottom edge; `"gradient"` renders a primary→secondary gradient bar instead. The default (`"none"`) renders neither.
12. Background and bottom-border treatments combine: setting both applies the tint's padding and the border's decoration together without either overriding the other.
