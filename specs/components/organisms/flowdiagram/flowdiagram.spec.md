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
- **labelMotion** ("travel" or "still", default "travel"): whether labels on lines with traffic ride along as slow pills or sit still beside the line. Reduced motion always uses "still".
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

**Label-pills:** Each stream has one dot that carries its label as a pill: the edge's label, or the dot type's name when the edge has none. The pill is a small capsule outlined in the stream's color. Its colored mark leads in the direction of travel and the text trails behind it, like a little train. The newest dot to leave the source takes the role, grows into a pill as it emerges from under the node, and slows to about a third of dot speed so the text is readable while other dots overtake it. Before it reaches the destination node or a pile, it shrinks back into an ordinary dot and the role passes to the next newest dot. Pills of different types on the same line and direction keep a pill's length apart. Lines too short for a pill to travel show their label beside the line instead.

**Holding a dot:** Hovering any visible dot with a mouse turns it into its stream's pill and holds it still while everything else keeps moving. A tooltip above it names the label, the dot type with its color, its rate, its pile size, and the route. Moving away lets the pill carry on slowly along the line. A click or a tap pins the dot the same way until the next click or tap on empty space or on the same dot, so holding works on touch screens too. Touch targets are larger than mouse targets. Only dots in view can be held; dots tucked under a node are left alone.

**Keyboard:** The diagram is focusable when it has traffic. The arrow keys step through the streams, holding each stream's pill and announcing its details; Escape or leaving the diagram releases it.

**Still labels:** With `labelMotion` set to "still", or when the reader prefers reduced motion, labels sit just beside the middle of their line (above horizontal lines, to the right of vertical ones) with a soft outline in the background color, so passing dots stay visible. Hovering, clicking and tapping still turn any dot into a pill with a tooltip; released dots return to plain dots.

**Reduced motion:** When the reader prefers reduced motion, the diagram shows that mid-flow snapshot as a still picture, with still labels.

**Off-screen and paused:** Animation stops while the diagram is scrolled out of view or paused, and resumes from the same moment.

**Layout:** Nodes are arranged in layers that follow the edges; cycles are allowed, and the order within each layer is chosen to reduce crossings. Cells given in `layout` override the automatic position for those nodes. Several edges between the same two nodes fan out to either side, and an edge that would pass through another node bows around it. An edge from a node to itself draws as a loop above the node.

**Text format:** The text follows Mermaid's flowchart syntax: the `flowchart` or `graph` header with a direction, node shapes in brackets, chained links (`A --> B --> C`), solid, dashed, thick and no-arrow links, double-ended links, and labels in either the `-- text -->` or the `-->|text|` form. Dot streams can be written two ways:
- Inline, in the label: `A --success--> B` or `A --success:90 error:10|5--> B`. A label made entirely of dot tokens becomes dots, and any other label stays a label.
- On indented lines under an edge, one or more tokens per line, optionally behind `%%` so plain Mermaid tools still render the file.

A token is a type name, an optional `:rate`, an optional `|pile`, and an optional leading `<` for reverse traffic. A bare word counts as a token only when it names a known dot type. Any token written with a rate, pile, or `<` counts even when its type is undeclared, and then uses the foreground color. Indented lines also accept `color=<token>` and `line=<style>` to style the line. Custom dot types are declared anywhere with `%% dot <name> color=<token> shape=<shape>`. Subgraphs and Mermaid styling statements are skipped.

**Empty states:** An edge without streams is a plain static line. A diagram without any streams is a static flowchart.

## Interface
The diagram reads as a calm, minimal flowchart: softly tinted nodes with thin outlines, muted lines, and bright dots as the main source of color. Labels ride the traffic as small outlined pills, or sit beside the line with a soft outline, so they leave the dots in view. Pills draw above plain dots, and a held pill draws above everything on the canvas. The tooltip matches the design system's tooltip: inverted colors and small text. Dots are small enough that dozens per line still read as a stream.

Authors can keep content and layout apart: a Mermaid or JSON file holds the nodes, edges and traffic, and an optional layout file pins chosen nodes to grid cells.

For accessibility, the diagram has the title as its name and a visually hidden caption that describes each edge in words, for example "Requests to API: success 90 per minute; error 10 per minute." A diagram with traffic is a focusable group with a visible focus ring and a hint about the arrow keys. A diagram without traffic is a plain image.

## Acceptance
1. Mermaid flowchart text renders nodes with the five bracket shapes and the declared direction.
2. Solid, dashed, thick, and no-arrow links render with matching line styles and arrowheads; double-ended links have arrowheads at both ends.
3. Link labels in both the `-- text -->` and `-->|text|` forms are shown: as traveling pills on lines with traffic, and beside the middle of the line otherwise.
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
19. Each stream has one slow label-pill showing the edge label (or the type name), mark leading and text trailing, handed to the newest dot and shrunk back to a dot before the destination or a pile.
20. Same-direction pills on one line keep a pill's length apart.
21. Hovering a visible dot holds it as a pill with a tooltip while other dots keep moving; leaving resumes it.
22. Clicking or tapping a dot pins it; clicking or tapping empty space or the same dot releases it.
23. Arrow keys step through streams with announced details; Escape or blur releases.
24. `labelMotion="still"` and reduced motion place labels beside their lines, and holding still works.
