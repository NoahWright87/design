import { isKnownDotType } from "./dots.js";
import type {
  FlowArrow,
  FlowDiagramData,
  FlowDirection,
  FlowDotShape,
  FlowDotType,
  FlowEdge,
  FlowLineStyle,
  FlowNode,
  FlowNodeShape,
  FlowStream,
} from "./types.js";

const LINE_STYLES: FlowLineStyle[] = ["solid", "dashed", "dotted", "thick"];
const DOT_SHAPES: FlowDotShape[] = ["circle", "square", "diamond"];
const FLOW_TOKEN = /^(<)?([A-Za-z_]\w*)(?::(\d+(?:\.\d+)?))?(?:\|(\d+))?$/;
const IGNORED_KEYWORDS = /^(subgraph|end|classDef|class|style|linkStyle|click|direction|accTitle|accDescr)\b/;

interface EdgeAttrs {
  flows: FlowStream[];
  color?: string;
  line?: FlowLineStyle;
}

/**
 * Parse dot tokens such as `success:90 error:10|5 <primary` plus `color=` / `line=` settings.
 * Returns null unless every token is valid, so ordinary labels stay labels.
 */
export function parseFlowTokens(text: string, dots?: Record<string, FlowDotType>): EdgeAttrs | null {
  const tokens = text.trim().split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) return null;
  const attrs: EdgeAttrs = { flows: [] };
  for (const token of tokens) {
    const setting = /^(color|line)=(\w+)$/.exec(token);
    if (setting) {
      if (setting[1] === "color") attrs.color = setting[2];
      else if ((LINE_STYLES as string[]).includes(setting[2])) attrs.line = setting[2] as FlowLineStyle;
      else return null;
      continue;
    }
    const m = FLOW_TOKEN.exec(token);
    // A bare word counts only if it names a dot type; explicit syntax (`:`, `|`, `<`) always counts.
    if (!m || !(isKnownDotType(m[2], dots) || m[1] || m[3] !== undefined || m[4] !== undefined)) return null;
    const flow: FlowStream = { type: m[2] };
    if (m[3] !== undefined) flow.dpm = Number(m[3]);
    if (m[4] !== undefined) flow.pile = Number(m[4]);
    if (m[1]) flow.reverse = true;
    attrs.flows.push(flow);
  }
  return attrs;
}

function applyAttrs(edge: FlowEdge, attrs: EdgeAttrs) {
  if (attrs.flows.length) edge.flows = [...(edge.flows ?? []), ...attrs.flows];
  if (attrs.color) edge.color = attrs.color;
  if (attrs.line) edge.line = attrs.line;
}

const SHAPE_BRACKETS: Array<[string, string, FlowNodeShape]> = [
  ["([", "])", "stadium"],
  ["((", "))", "circle"],
  ["[(", ")]", "rect"],
  ["[[", "]]", "rect"],
  ["{{", "}}", "diamond"],
  ["[", "]", "rect"],
  ["(", ")", "round"],
  ["{", "}", "diamond"],
  [">", "]", "rect"],
];

function unquote(text: string): string {
  const t = text.trim();
  return t.length >= 2 && t.startsWith('"') && t.endsWith('"') ? t.slice(1, -1) : t;
}

/** Plain links: `-->`, `---`, `==>`, `===`, `-.->`, `-.-`, optionally prefixed with `<`. */
const PLAIN_LINK = /^(<?)(-{2,}>|-{3,}|={2,}>|={3,}|-\.+->|-\.+-)/;
/** Text-link openers: `-- text -->`, `== text ==>`, `-. text .->`. */
const TEXT_LINK_OPEN = /^(<?)(--|==|-\.)/;
const TEXT_LINK_CLOSE: Record<string, RegExp> = {
  "--": /-{2,}>|-{3,}/,
  "==": /={2,}>|={3,}/,
  "-.": /\.-+>|\.-+/,
};
/** `|label|`; a `|` followed by a digit stays inside, so `|error:10|5|` works. */
const PIPE_LABEL = /^\s*\|((?:[^|]|\|(?=\d))*)\|/;

function linkKind(op: string, leftArrow: boolean): { line: FlowLineStyle; arrow: FlowArrow } {
  const line: FlowLineStyle = op.includes("=") ? "thick" : op.includes(".") ? "dashed" : "solid";
  const end = op.endsWith(">");
  const arrow: FlowArrow = end ? (leftArrow ? "both" : "end") : "none";
  return { line, arrow };
}

class LineScanner {
  pos = 0;
  constructor(readonly text: string) {}
  get rest() {
    return this.text.slice(this.pos);
  }
  skipSpace() {
    while (this.pos < this.text.length && /\s/.test(this.text[this.pos])) this.pos++;
  }
  done() {
    this.skipSpace();
    return this.pos >= this.text.length;
  }
}

function readNode(s: LineScanner, nodes: Map<string, FlowNode>, order: string[]): string | null {
  s.skipSpace();
  const m = /^[A-Za-z0-9_]+/.exec(s.rest);
  if (!m) return null;
  const id = m[0];
  s.pos += id.length;
  let node = nodes.get(id);
  if (!node) {
    node = { id };
    nodes.set(id, node);
    order.push(id);
  }
  for (const [open, close, shape] of SHAPE_BRACKETS) {
    if (!s.rest.startsWith(open)) continue;
    const end = s.text.indexOf(close, s.pos + open.length);
    if (end < 0) continue;
    node.label = unquote(s.text.slice(s.pos + open.length, end));
    node.shape = shape;
    s.pos = end + close.length;
    break;
  }
  return id;
}

interface Link {
  line: FlowLineStyle;
  arrow: FlowArrow;
  text?: string;
}

function readLink(s: LineScanner): Link | null {
  s.skipSpace();
  const plain = PLAIN_LINK.exec(s.rest);
  if (plain) {
    s.pos += plain[0].length;
    const link: Link = linkKind(plain[2], plain[1] === "<");
    const pipe = PIPE_LABEL.exec(s.rest);
    if (pipe) {
      link.text = pipe[1].trim();
      s.pos += pipe[0].length;
    }
    return link;
  }
  const open = TEXT_LINK_OPEN.exec(s.rest);
  if (!open) return null;
  const after = s.pos + open[0].length;
  const close = TEXT_LINK_CLOSE[open[2]].exec(s.text.slice(after));
  if (!close) return null;
  const text = s.text.slice(after, after + close.index).trim();
  s.pos = after + close.index + close[0].length;
  const op = open[2] === "-." ? `-${close[0]}` : close[0];
  return { ...linkKind(op, open[1] === "<"), text };
}

/**
 * Parse Mermaid-flavored flowchart text into diagram data.
 *
 * Supports the flowchart header, node shapes, chained links, link labels, and dot
 * tokens either inside the label (`A --success:90--> B`) or on indented lines under
 * an edge, optionally behind `%%` so plain Mermaid still renders the file.
 * Dot types are declared with `%% dot <name> color=<token> shape=<shape>`.
 */
export function parseFlowDiagram(text: string): FlowDiagramData {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const dots: Record<string, FlowDotType> = {};

  // Pass 1: dot declarations, so they can appear anywhere in the file.
  for (const raw of lines) {
    const m = /^\s*(?:%%\s*)?dot\s+([A-Za-z_]\w*)((?:\s+\w+=\w+)+)\s*$/.exec(raw);
    if (!m) continue;
    const def: FlowDotType = { color: "foreground" };
    for (const [, key, value] of m[2].matchAll(/(\w+)=(\w+)/g)) {
      if (key === "color") def.color = value;
      if (key === "shape" && (DOT_SHAPES as string[]).includes(value)) def.shape = value as FlowDotShape;
    }
    dots[m[1]] = def;
  }

  let direction: FlowDirection | undefined;
  const nodes = new Map<string, FlowNode>();
  const order: string[] = [];
  const edges: FlowEdge[] = [];
  let lastEdge: FlowEdge | null = null;

  for (const raw of lines) {
    const line = raw.replace(/;\s*$/, "");
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^\s*(?:%%\s*)?dot\s+\w+\s+\w+=/.test(line)) continue;

    const header = /^(flowchart|graph)\b\s*(LR|RL|TB|TD|BT)?/i.exec(trimmed);
    if (header) {
      const dir = header[2]?.toUpperCase();
      direction = dir === "TD" ? "TB" : (dir as FlowDirection | undefined);
      continue;
    }

    const indented = /^\s/.test(line);
    const body = trimmed.replace(/^%%\s*/, "");
    if (indented && lastEdge) {
      const attrs = parseFlowTokens(body, dots);
      if (attrs) {
        applyAttrs(lastEdge, attrs);
        continue;
      }
    }
    if (trimmed.startsWith("%%") || IGNORED_KEYWORDS.test(trimmed)) continue;

    // Statement: node (link node)*
    const s = new LineScanner(trimmed);
    let from = readNode(s, nodes, order);
    if (!from) continue;
    while (!s.done()) {
      const link = readLink(s);
      if (!link) break;
      const to = readNode(s, nodes, order);
      if (!to) break;
      const edge: FlowEdge = { from, to, line: link.line, arrow: link.arrow };
      if (link.text) {
        const attrs = parseFlowTokens(link.text, dots);
        if (attrs) applyAttrs(edge, attrs);
        else edge.label = unquote(link.text);
      }
      edges.push(edge);
      lastEdge = edge;
      from = to;
    }
  }

  return {
    direction,
    nodes: order.map((id) => nodes.get(id)!),
    edges,
    dots: Object.keys(dots).length ? dots : undefined,
  };
}
