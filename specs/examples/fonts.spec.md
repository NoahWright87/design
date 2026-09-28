# Fonts — Font Roles and Typeface Specimens

## Purpose
The Fonts example is the design system's visual reference for type. It shows which font each role (body, headings, code) resolves to, and presents every typeface bundled with the system as a full specimen, so designers and developers can judge a font at a glance before using or overriding it. It also shows candidate typefaces under review next to the ones in use, so a new font can be judged before it replaces an old one. It grows as new typefaces join the system.

## Related
- [Design System Base Spec](../design-system.spec.md)
- [Colors example](colors.spec.md)
- [Heading component](../components/molecules/heading/heading.spec.md)

## Contract

### Inputs
- The theme's font role tokens, read from the computed styles of the rendered page.
- The list of typefaces, each with its family name, display name, status (in use or candidate), role, available weights, and notes.
- For candidates, their font files, which the pages register themselves so the candidate stays out of the published package.

### Outputs
Three pages: a Roles page with one sample per font role, a Typefaces page with one specimen per typeface, and a Comparison page setting the same samples in every typeface.

### Guarantees / Constraints
- One role sample is rendered per font role token.
- One specimen is rendered per typeface; adding a typeface to the list adds its specimen with no other changes.
- When a role token is missing or unresolved, its sample displays a graceful placeholder.
- Specimens render with the body font as fallback, so characters a typeface lacks still appear.
- Candidate font files load only on these pages; the theme and the published package are unchanged by a candidate.

## Behavior

**Roles:** On load, the page reads each font role's resolved value and shows the role's name, token, a pangram and character sample set in that role's font, and the resolved font stack in small monospace text.

**Typefaces:** Each typeface gets a specimen: its name set large in itself, its status, role, weights, and notes, a weight ramp when it has more than one weight, the full character set including accented letters, a few large display sizes, the system's type scale from extra small to extra large, and a short heading-over-body sample showing it in context.

**Comparison:** A handful of samples (a heading, a subheading, commonly confused letters and kerning pairs, figures, and a pangram) are each set in every typeface at the same size and weight, one typeface per line, labelled with the typeface's display name.

The pages are static references with no interactions.

## Interface

All three pages are titled and use a single readable column. Role samples sit in softly bordered, rounded panels. Typeface specimens are separated by a thin divider, with small muted uppercase labels introducing each part of the specimen. Size and token labels use the monospace font in a muted color. All colors come from theme tokens, so every page follows light and dark mode.

This page is a developer and designer reference tool, not a user-facing feature.

## Acceptance
1. The Roles page shows one sample per font role: body, headings, and code.
2. Each role sample displays the role name, token name, text set in that role's font, and the resolved font stack.
3. The Typefaces page shows a specimen for Wright Sans.
4. Each specimen shows the typeface name, role, weights, notes, character set, display sizes, type scale, and an in-context sample.
5. Adding an entry to the typeface list adds a new specimen and a new line in every comparison sample.
6. Missing or unresolved role tokens display a graceful fallback.
7. All three pages follow the active light or dark theme.
8. The Typefaces page shows a specimen for the Claude-traced Wright Sans candidate, marked as a candidate, with a weight ramp of its four weights.
9. The Comparison page sets every sample in both the ChatGPT draft and the Claude trace at the same size and weight.
10. Candidate fonts render on these pages while the published stylesheet contains only the fonts in use.
