/** Which way the diagram reads when nodes are placed automatically. */
export type FlowDirection = "LR" | "RL" | "TB" | "BT";

/** Node outlines, matching Mermaid's flowchart brackets. */
export type FlowNodeShape = "rect" | "round" | "stadium" | "circle" | "diamond";

/** Edge line styles. Mermaid's `-.->` is `dashed`, `==>` is `thick`. */
export type FlowLineStyle = "solid" | "dashed" | "dotted" | "thick";

/** Arrowheads drawn on an edge. Mermaid's `---` is `none`, `-->` is `end`, `<-->` is `both`. */
export type FlowArrow = "none" | "end" | "both";

/** Shapes a traveling dot can take. */
export type FlowDotShape = "circle" | "square" | "diamond";

/**
 * A color token name from the design system (`primary`, `confirm`, `danger`, ...).
 * It is resolved as `var(--<name>)`.
 */
export type FlowColor = string;

/** A kind of traffic: what its dots look like. */
export interface FlowDotType {
  color: FlowColor;
  shape?: FlowDotShape;
}

/** One stream of dots traveling along an edge. */
export interface FlowStream {
  /** Dot type name: a built-in (`success`, `error`, `primary`, ...) or one declared in `dots`. */
  type: string;
  /** Dots spawned per minute. Defaults to 60 (one per second). */
  dpm?: number;
  /** When set, up to this many dots gather in a loose pile at the arrival end. */
  pile?: number;
  /** When true, dots travel from `to` back to `from`. */
  reverse?: boolean;
}

export interface FlowNode {
  id: string;
  /** Text shown inside the node. Defaults to the id. */
  label?: string;
  shape?: FlowNodeShape;
}

export interface FlowEdge {
  from: string;
  to: string;
  /** Text shown at the middle of the edge. */
  label?: string;
  line?: FlowLineStyle;
  arrow?: FlowArrow;
  /** Line color token. Defaults to a muted foreground. */
  color?: FlowColor;
  /** Streams of dots traveling along this edge. */
  flows?: FlowStream[];
}

/**
 * The object form of a diagram. This is what JSON or YAML content files describe,
 * and what `parseFlowDiagram()` produces from Mermaid-style text.
 */
export interface FlowDiagramData {
  direction?: FlowDirection;
  /** Nodes, as a list or keyed by id. Nodes mentioned only in edges are added automatically. */
  nodes?: FlowNode[] | Record<string, Omit<FlowNode, "id">>;
  edges: FlowEdge[];
  /** Custom dot types, or overrides for built-in ones. */
  dots?: Record<string, FlowDotType>;
}

/**
 * Grid cells for nodes, kept separate from content: `{ review: [1, 0] }` puts
 * `review` in column 1, row 0. Fractions are allowed. Nodes left out are placed automatically.
 */
export type FlowDiagramLayout = Record<string, [number, number]>;
