# Nonsense Atom — Spec

## Overview
The Nonsense Atom is a utility module that provides whimsical, semi-randomized English nonsense text for use in example pages and composed components. Unlike traditional "lorem ipsum" placeholder text, the nonsense copy aims to feel more natural while remaining intentionally meaningless, adding personality to mockups and preview sites without real content.

The Nonsense Atom is an **atom** in the atomic design sense: it is a non-rendering, zero-dependency utility that exports data and simple accessor functions. It does not render HTML, accept props, or compose with other components.

## Purpose
- Provide realistic-looking but meaningless text for example pages (e.g., portfolio site, address form).
- Avoid repetitive placeholder text; support multiple variants per category to feel "fleshed out."
- Enable whimsical, on-brand personality in mockup content.
- Allow example pages to be self-contained and data-driven without hardcoding nonsense strings.

## Categories

### Titles & Headers
- `shortTitle`: 2–4 word titles (e.g., "Circular Thinking", "Blue Momentum")
- `longTitle`: 5–8 word subtitles or section headers (e.g., "Empowering Teams Through Data Visualization")

### Paragraphs
- `shortParagraph`: 1–2 sentences, ~40–60 words
- `longParagraph`: 3–4 sentences, ~100–150 words

### Names & Identities
- `personName`: Individual names (e.g., "Morgan Vex", "Jamie Stohl")
- `companyName`: Business or organization names (e.g., "Synapse Labs", "Echo & Co")
- `jobTitle`: Professional roles (e.g., "Lead Vibe Architect", "Chaos Coordinator")
- `awardName`: Award or recognition names (e.g., "Golden Insight Award", "Innovator's Circle Badge")

### Content & Descriptions
- `projectName`: Project or product names (e.g., "Wavelength", "Nexus Proto")
- `skillName`: Individual skill or technology names (e.g., "Intent Mapping", "Color Psychology")
- `serviceName`: Service or offering names (e.g., "Brand Harmonization", "Strategic Insight Delivery")
- `testimonialQuote`: Short, glowing testimonial snippet (~20–40 words)
- `accomplishment`: Outrageous, nonsensical achievement or responsibility (e.g., "Tripled team morale through interpretive meetings")

### Utility
- `introText`: Opening narrative for intro/hero sections (~30–50 words, upbeat)
- `ctaText`: Action text for buttons or links (e.g., "Unlock the Chaos", "Begin the Journey", "Dive Deeper")
- `socialSiteName`: Fictional social or web platform names (e.g., "SpaceBook", "ThoughtWave", "VortexNow")
- `abstractImage`: Minimal, procedurally-generated abstract SVG (returns an SVG data URL or inline SVG string for use as background or img src)
- `date`: Programmatically-generated date or date range (with option to specify constraints, e.g., "last 2 years"). Dates should be realistic but arbitrary.

## API & Usage

Each category is accessed as a property or function. The atom exports:

```
getNonsense(category: string): string
```

or

```
getNonsense(category: string, options?: { count?: number; seed?: string }): string | string[]
```

**Examples:**
- `getNonsense('shortTitle')` → `"Circular Thinking"`
- `getNonsense('personName', { count: 3 })` → `["Morgan Vex", "Jamie Stohl", "Alex Ren"]`
- `getNonsense('abstractImage')` → `"data:image/svg+xml,…"` or inline SVG
- `getNonsense('date', { months: 24 })` → `"Jan 2024 – Sep 2025"`

**Optional parameters:**
- `count`: Return an array of N items instead of one.
- `seed`: Optional seed for reproducible randomness (useful in tests or for consistent mockups across builds).

## Data Structure

Each category must have a list of 10+ entries to provide variety. For example:

**shortTitle entries:**
- "Circular Thinking"
- "Blue Momentum"
- "Silent Protocol"
- "Quantum Drift"
- "Echo Nexus"
- …(10+ total)

**jobTitle entries:**
- "Lead Vibe Architect"
- "Chaos Coordinator"
- "Senior Narrative Engineer"
- "Chief Paradox Officer"
- …(10+ total)

**accomplishment entries:**
- "Tripled team morale through interpretive meetings"
- "Solved invisible problems with aggressive optimism"
- "Unified conflicting timelines via emoji consensus"
- …(10+ total)

## Constraints & Non-Goals

- **No rendering**: The atom does not export React components or DOM elements. It only provides strings and data.
- **No HTTP/API calls**: All data is static and bundled.
- **No props or configuration**: The atom is immutable. Callers invoke functions with optional parameters only.
- **No backend state**: Placeholder copy is stateless and side-effect-free.
- **No image generation beyond SVG**: Abstract images are minimal SVGs, not complex graphics. Focus on simplicity.
- **Non-brand-specific**: Placeholder copy should feel quirky and whimsical but not tied to any real brand or product.

## Acceptance Criteria

1. Atom exports a `getNonsense()` function that accepts a category string.
2. Each category has at least 10 diverse, whimsical English entries.
3. `getNonsense(category)` returns a single random entry.
4. `getNonsense(category, { count: N })` returns an array of N random entries.
5. Optional `seed` parameter allows reproducible randomness across calls with the same seed.
6. Date entries are realistic (within user-specified range) and formatted naturally (e.g., "Jan 2024 – Sep 2025").
7. Abstract images are valid SVG data URLs or inline SVG strings suitable for use as `<img src>` or CSS `background-image`.
8. All nonsense copy aligns with the design system's personality: quirky, whimsical, English, and intentionally meaningless.
9. No repeated entries are picked consecutively (optional but encouraged for smoother variety).
10. Atom is SSR-safe (no `window`, no browser APIs at module level).

## Future Extensions

- **Localization**: Support placeholder categories in other languages (e.g., `shortTitle_fr`, `jobTitle_es`).
- **Custom palettes**: Allow callers to provide their own entry lists per category.
- **Weighted randomness**: Some entries could be weighted to appear more/less frequently.
- **Emoji support**: Add emoji-only categories (e.g., `emoji_mood`, `emoji_skill`).
