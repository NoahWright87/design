# Nonsense Atom — Spec

## Purpose
The Nonsense Atom provides whimsical, semi-randomized English placeholder text for use in example pages and composed components. Unlike generic filler text, nonsense copy feels natural while remaining intentionally meaningless, giving mockups personality without real content.

It is an atom in the atomic design sense: a non-rendering, zero-dependency utility that exports text data and simple accessor functions. It does not render HTML, accept component props, or compose with other components.

## Related
- [Design System Base Spec](../design-system.spec.md)

## Contract

### Inputs
- A category name identifying the type of content to retrieve (for example, a person's name, a job title, or a short paragraph).
- Optional `count` — how many items to return as an array instead of one.
- Optional `seed` — a string for reproducible random selection across calls.
- Optional `customEntries` — an array of strings that replaces the built-in pool for array-based categories. Ignored for function-based categories (`abstractImage`, `date`).
- Optional `weights` — an array of relative weights, same length as the active pool. Higher values increase the likelihood of that entry being selected. Ignored for function-based categories.

### Outputs
- A single random string from the requested category, or an array of strings if a count is requested.
- Date values return a human-readable date range string.
- Abstract image values return a minimal SVG suitable for use as an image source or CSS background.

### Guarantees / Constraints
- All data is static and bundled; no network requests are made.
- The atom is side-effect-free and safe for server-side rendering.
- Each category contains at least ten distinct entries to provide meaningful variety.
- When a seed is provided, results are reproducible across calls with the same seed.

## Behavior

When called with a category name, the atom returns a random entry from that category's pool.

**With count:** Returns an array of the requested number of entries.

**With seed:** Returns the same result every time the same seed is used, enabling consistent previews across builds.

**With customEntries:** The provided array replaces the built-in pool entirely for that call.

**With weights:** Entries are selected using weighted probability — a weight of `3` for an entry makes it three times as likely as an entry with weight `1`. If the weights array length does not match the pool length, weights are silently ignored and uniform random selection is used.

**Date category:** Accepts optional range constraints and returns a realistic date or date range formatted naturally (for example, "Jan 2024 – Sep 2025").

**Image category:** Returns a minimal abstract SVG suitable for use as an image source.

## Interface

### Content Categories

**Titles and headers:**
- Short titles — two to four word phrases.
- Long titles — longer subtitles or section headers.

**Paragraphs:**
- Short paragraphs — one to two sentences.
- Long paragraphs — three to four sentences.

**Names and identities:**
- Person names, company names, job titles, award names.

**Content and descriptions:**
- Project names, skill names, service names, testimonial quotes, accomplishments.

**Utility:**
- Intro text, call-to-action text, fictional social platform names, abstract images, and date ranges.

### Usage
The atom exposes a single function that accepts a category name and returns a random entry. Callers may request multiple entries at once or supply a seed for reproducible results.

## Acceptance
1. The atom exports a function that accepts a category name and returns a string.
2. Each category has at least ten distinct entries.
3. Requesting a count returns an array of that many entries.
4. Supplying the same seed always returns the same result.
5. Date entries are formatted naturally and fall within realistic ranges.
6. Image entries are valid minimal SVGs suitable for use as image sources.
7. All copy aligns with the design system's personality: quirky, whimsical, and intentionally meaningless.
8. The atom works correctly in server-side rendering environments.
9. Providing `customEntries` replaces the built-in pool for that call.
10. Providing `weights` of the correct length biases selection toward higher-weighted entries.
11. Providing `weights` of the wrong length falls back silently to uniform random selection.
