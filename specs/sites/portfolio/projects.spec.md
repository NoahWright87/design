# Personal Portfolio Site — Projects Page

## Purpose
The Projects page displays a curated grid of six project examples, each shown as a card with an image, description, optional skill labels, and a call-to-action link. It demonstrates the Card component in a gallery context.

## Related
- [Portfolio Site Overview](../portfolio.spec.md)
- [Card component](../../components/organisms/card/card.spec.md)
- [Pill component](../../components/molecules/pill/pill.spec.md)

## Contract

### Inputs
Content from the Nonsense Atom (project names, descriptions, call-to-action labels, skill names, and abstract images).

### Outputs
A page with six project cards arranged in a responsive grid, each linking to a placeholder external site.

### Guarantees / Constraints
- All six project cards use the same structural layout.
- All project links point to the same placeholder external destination.
- Skill labels appear on three to four cards; the remaining cards have none.

## Behavior

The page is static display. Card images, titles, descriptions, and skill labels are generated from the Nonsense Atom. Clicking a project button opens the external link in a new tab.

## Interface

### Page Structure
- Standard site header at top.
- Introductory paragraph above the grid.
- Responsive project grid.
- Standard site footer.

### Project Cards
Each card contains:
1. An image at the top with a consistent aspect ratio.
2. A project title as a heading.
3. A short description paragraph.
4. Optional skill labels displayed as pills in a row (on three to four cards).
5. A call-to-action button at the bottom.

### Grid Layout
On large screens: three columns. On medium screens: two columns. On small screens: single column. Consistent spacing between cards at all breakpoints.

### Responsive Behavior
Cards maintain their aspect ratio as the grid reflows. Hamburger menu in the header on small screens.

## Acceptance
1. Exactly six project cards are displayed.
2. An introductory paragraph is visible above the grid.
3. Cards follow a three-column layout on desktop, two-column on tablet, single column on mobile.
4. Each card has an image, title, description, and a call-to-action button.
5. Skill labels appear on three to four cards; other cards omit them.
6. All project buttons link to the external placeholder destination and open in a new tab.
7. The grid reflows correctly across all three layouts.
8. The hamburger menu functions on small screens.
9. Header and footer are present and consistent.
