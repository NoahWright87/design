# FlowDiagram — Flowcharts with Moving Traffic

## Purpose
FlowDiagram draws a flowchart whose lines can carry streams of small, color-coded dots. Motion carries the meaning: steady traffic shows flow, color shows the kind of traffic (success, error, or any custom type), and loose piles show work waiting at a bottleneck. It is a set of chart primitives, a snapshot of "the factory floor seen from above", rather than a traffic simulation: each line does exactly what its author writes. Content comes from Mermaid-flavored text or a JSON/YAML-shaped object, and layout can live in a separate file.

## Related
- [Design System Base Spec](../../../design-system.spec.md)
- [Mermaid flowchart syntax](https://mermaid.js.org/syntax/flowchart.html), the basis of the text format
- Reduced motion handling: `usePrefersReducedMotion`

## Contract

### Inputs
- **source** (text, optional): Mermaid-flavored flowchart text.
- **diagram** (object, optional): the same content as data, as a JSON or YAML file would describe it. Used instead of `source` when both are given.
- **layout** (object, optional): grid cells for nodes, keyed by node id, as `[column, row]`. Fractions are allowed. Nodes left out are placed automatically.
- **speed** (number, default 70): how fast dots travel, in diagram units per second.
- **dotSize** (number, default 4): dot radius in diagram units.
- **paused** (boolean, default false): freezes the dots where they are.
- **title** (text, default "Flow diagram"): the accessible name.
- **className**, **style**: passed to the outer element.

Diagram content:
- **direction**: left-to-right (default), right-to-left, top-to-bottom, or bottom-to-top.
- **nodes**: id, label (defaults to the id), and shape: rectangle, rounded, stadium, circle, or diamond. Nodes mentioned only by edges are added automatically.
- **edges**: from, to, optional label, line style (solid, dashed, dotted, thick), arrowheads (none, end, both), optional line color token, and a list of dot streams.
- **dot streams**: a dot type, a rate in dots per minute (default 60, one per second), an optional pile size, and an optional reverse direction.
- **dot types**: built-ins are the color tokens (foreground, primary, secondary, confirm, danger) plus the aliases success and ok (confirm color) and error and fail (danger color). Custom types name a color token and a shape: circle, square, or diamond.

### Outputs
- A responsive figure that scales to its container's width, up to its natural size.
- A text description for assistive technology that lists every edge and its traffic.

### Guarantees / Constraints
- Layers stack in a fixed order: lines at the bottom, dots above the lines, symbols and edge labels on top. Dots appear from under one node and slip under the next.
- Each dot gets a random layer when it spawns and keeps it, so overlapping dots stay in a stable order and traffic looks organic.
- Each stream is independent: it spawns at its own rate whatever the other edges do.
- The component renders on the server as complete static SVG; dots start in the browser.
- Colors come from the design-system tokens and follow live theme changes.
- Only `react` and `react-dom` are required.

## Behavior

**Steady flow:** A stream spawns dots at its rate with a little random spacing. Dots travel along the line at a slightly varied pace and with a slight sideways offset, then disappear under the destination node.

**Color-coded traffic:** An edge can carry several streams. `success:90 error:10` sends mostly green dots with the occasional red one along the same line.

**Piles:** A stream with a pile size gathers its dots in a loose, messy cluster just before the destination node. Once the pile is full, each new arrival lets the oldest dot in that pile slip into the node. Streams on the same edge keep separate counts and share one pile area, so different traffic can back up by different amounts.

**Two-way traffic:** A reversed stream travels from the edge's destination back to its source and piles at the source end.

**Opening mid-flow:** The diagram opens already in motion, with dots spread along the lines and piles formed, as if it had been running for a while.

**Reduced motion:** When the reader prefers reduced motion, the diagram shows that mid-flow snapshot as a still picture.

**Off-screen and paused:** Animation stops while the diagram is scrolled out of view or paused, and resumes from the same moment.

**Layout:** Nodes are arranged in layers that follow the edges; cycles are allowed, and the order within each layer is chosen to reduce crossings. Cells given in `layout` override the automatic position for those nodes. Several edges between the same two nodes fan out to either side, and an edge that would pass through another node bows around it. An edge from a node to itself draws as a loop above the node.

**Text format:** The text follows Mermaid's flowchart syntax: the `flowchart` or `graph` header with a direction, node shapes in brackets, chained links (`A --> B --> C`), solid, dashed, thick and no-arrow links, double-ended links, and labels in either the `-- text -->` or the `-->|text|` form. Dot streams can be written two ways:
- Inline, in the label: `A --success--> B` or `A --success:90 error:10|5--> B`. A label made entirely of dot tokens becomes dots, and any other label stays a label.
- On indented lines under an edge, one or more tokens per line, optionally behind `%%` so plain Mermaid tools still render the file.

A token is a type name, an optional `:rate`, an optional `|pile`, and an optional leading `<` for reverse traffic. A bare word counts as a token only when it names a known dot type. Any token written with a rate, pile, or `<` counts even when its type is undeclared, and then uses the foreground color. Indented lines also accept `color=<token>` and `line=<style>` to style the line. Custom dot types are declared anywhere with `%% dot <name> color=<token> shape=<shape>`. Subgraphs and Mermaid styling statements are skipped.

**Empty states:** An edge without streams is a plain static line. A diagram without any streams is a static flowchart.

## Interface
The diagram reads as a calm, minimal flowchart: softly tinted nodes with thin outlines, muted lines, and bright dots as the main source of color. Edge labels sit on a small background patch at the middle of the line, above the dots. Dots are small enough that dozens per line still read as a stream.

Authors can keep content and layout apart: a Mermaid or JSON file holds the nodes, edges and traffic, and an optional layout file pins chosen nodes to grid cells.

For accessibility, the figure has an image role with the title as its name, and a visually hidden caption describes each edge in words, for example "Requests to API: success 90 per minute; error 10 per minute."

## Acceptance
1. Mermaid flowchart text renders nodes with the five bracket shapes and the declared direction.
2. Solid, dashed, thick, and no-arrow links render with matching line styles and arrowheads; double-ended links have arrowheads at both ends.
3. Link labels in both the `-- text -->` and `-->|text|` forms render at the middle of the line.
4. A label made of dot tokens produces dot streams instead of a label.
5. Indented token lines, with or without `%%`, add streams to the edge above them.
6. Dot rates default to 60 per minute, and a stated rate changes the spawn frequency.
7. Built-in types and aliases use the matching token colors; declared custom types use their color and shape.
8. Dots draw above lines and below nodes and labels.
9. Each dot keeps a stable, randomly assigned layer, so overlapping dots hold a steady order.
10. A stream with a pile size keeps up to that many dots in a loose cluster at the arrival end, releasing the oldest into the node as new ones arrive.
11. A reversed stream travels from the destination to the source.
12. `layout` cells override automatic placement for the listed nodes.
13. Parallel edges fan out, and edges route around nodes they would otherwise cross.
14. The diagram opens mid-flow; with reduced motion it shows a still snapshot.
15. Animation stops when off-screen or `paused`, and `speed` and `dotSize` change travel speed and dot size.
16. Dot colors update when the theme changes.
17. Server rendering produces the full static diagram without errors.
18. The caption describes every edge and its traffic.
