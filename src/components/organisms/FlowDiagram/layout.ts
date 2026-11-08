import type {
  FlowDiagramData,
  FlowDiagramLayout,
  FlowDirection,
  FlowEdge,
  FlowNode,
  FlowNodeShape,
} from "./types.js";

export interface NormalizedDiagram {
  direction: FlowDirection;
  nodes: Required<FlowNode>[];
  edges: FlowEdge[];
  dots: FlowDiagramData["dots"];
}

export interface PlacedNode extends Required<FlowNode> {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Placement {
  nodes: PlacedNode[];
  byId: Map<string, PlacedNode>;
  bounds: { x: number; y: number; w: number; h: number };
}

/** Fill in implied nodes, labels and shapes; drop edges that reference nothing. */
export function normalize(data: FlowDiagramData): NormalizedDiagram {
  const map = new Map<string, Required<FlowNode>>();
  const add = (node: FlowNode) => {
    const prev = map.get(node.id);
    map.set(node.id, {
      id: node.id,
      label: node.label ?? prev?.label ?? node.id,
      shape: node.shape ?? prev?.shape ?? "rect",
    });
  };
  const listed = Array.isArray(data.nodes)
    ? data.nodes
    : Object.entries(data.nodes ?? {}).map(([id, n]) => ({ ...n, id }));
  listed.forEach(add);
  const edges = (data.edges ?? []).filter((e) => e && e.from && e.to);
  for (const e of edges) {
    if (!map.has(e.from)) add({ id: e.from });
    if (!map.has(e.to)) add({ id: e.to });
  }
  return { direction: data.direction ?? "LR", nodes: [...map.values()], edges, dots: data.dots };
}

const FONT_SIZE = 14;
const CHAR_W = 7.8;

export function measureNode(label: string, shape: FlowNodeShape): { w: number; h: number } {
  const text = Math.max(label.length, 1) * CHAR_W;
  if (shape === "circle") {
    const d = Math.max(56, text + 26);
    return { w: d, h: d };
  }
  if (shape === "diamond") return { w: Math.max(84, text + 60), h: 60 };
  return { w: Math.min(Math.max(84, text + 32), 240), h: 44 };
}

export { FONT_SIZE };

/** Layered placement: ranks follow the edges (cycles broken), order within a rank reduces crossings. */
export function autoLayout(diagram: NormalizedDiagram): Map<string, [number, number]> {
  const ids = diagram.nodes.map((n) => n.id);
  const index = new Map(ids.map((id, i) => [id, i]));
  const out: number[][] = ids.map(() => []);
  const links: Array<[number, number]> = [];
  for (const e of diagram.edges) {
    const a = index.get(e.from)!;
    const b = index.get(e.to)!;
    if (a !== b) links.push([a, b]);
  }
  links.forEach(([a], i) => out[a].push(i));

  // Break cycles: edges that point back into the current DFS path are ignored for ranking.
  const state = new Array<number>(ids.length).fill(0);
  const back = new Set<number>();
  const visit = (u: number) => {
    state[u] = 1;
    for (const li of out[u]) {
      const v = links[li][1];
      if (state[v] === 1) back.add(li);
      else if (state[v] === 0) visit(v);
    }
    state[u] = 2;
  };
  ids.forEach((_, i) => state[i] === 0 && visit(i));
  const forward = links.filter((_, i) => !back.has(i));

  // Longest-path ranks.
  const rank = new Array<number>(ids.length).fill(0);
  const indeg = new Array<number>(ids.length).fill(0);
  forward.forEach(([, b]) => indeg[b]++);
  const queue = ids.map((_, i) => i).filter((i) => indeg[i] === 0);
  while (queue.length) {
    const u = queue.shift()!;
    for (const [a, b] of forward) {
      if (a !== u) continue;
      rank[b] = Math.max(rank[b], rank[u] + 1);
      if (--indeg[b] === 0) queue.push(b);
    }
  }

  const maxRank = Math.max(0, ...rank);
  const layers: number[][] = Array.from({ length: maxRank + 1 }, () => []);
  ids.forEach((_, i) => layers[rank[i]].push(i));

  // Barycenter sweeps to reduce crossings.
  const pos = new Array<number>(ids.length).fill(0);
  const syncPos = () => layers.forEach((layer) => layer.forEach((n, i) => (pos[n] = i - (layer.length - 1) / 2)));
  syncPos();
  const neighbors = (n: number, down: boolean) =>
    forward.filter(([a, b]) => (down ? b === n : a === n)).map(([a, b]) => (down ? a : b));
  for (let pass = 0; pass < 4; pass++) {
    const down = pass % 2 === 0;
    const order = down ? layers.slice(1) : layers.slice(0, -1).reverse();
    for (const layer of order) {
      const score = new Map<number, number>();
      for (const n of layer) {
        const ns = neighbors(n, down);
        score.set(n, ns.length ? ns.reduce((s, m) => s + pos[m], 0) / ns.length : pos[n]);
      }
      layer.sort((a, b) => score.get(a)! - score.get(b)!);
      syncPos();
    }
  }

  const cells = new Map<string, [number, number]>();
  ids.forEach((id, i) => {
    const r = rank[i];
    const p = pos[i];
    const dir = diagram.direction;
    if (dir === "LR") cells.set(id, [r, p]);
    else if (dir === "RL") cells.set(id, [maxRank - r, p]);
    else if (dir === "TB") cells.set(id, [p, r]);
    else cells.set(id, [p, maxRank - r]);
  });
  return cells;
}

const MARGIN = 28;

/** Turn grid cells (manual where given, automatic elsewhere) into node boxes in diagram units. */
export function placeNodes(diagram: NormalizedDiagram, layout?: FlowDiagramLayout): Placement {
  const auto = autoLayout(diagram);
  const sizes = diagram.nodes.map((n) => measureNode(n.label, n.shape));
  const maxW = Math.max(84, ...sizes.map((s) => s.w));
  const maxH = Math.max(44, ...sizes.map((s) => s.h));
  const horizontal = diagram.direction === "LR" || diagram.direction === "RL";
  // Generous spacing along the flow leaves room for traveling label-pills and piles.
  const colStep = maxW + (horizontal ? 150 : 48);
  const rowStep = maxH + (horizontal ? 56 : 130);

  const nodes: PlacedNode[] = diagram.nodes.map((n, i) => {
    const cell = layout?.[n.id] ?? auto.get(n.id) ?? [0, 0];
    return { ...n, ...sizes[i], x: cell[0] * colStep, y: cell[1] * rowStep };
  });

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x - n.w / 2);
    minY = Math.min(minY, n.y - n.h / 2);
    maxX = Math.max(maxX, n.x + n.w / 2);
    maxY = Math.max(maxY, n.y + n.h / 2);
  }
  if (!nodes.length) minX = minY = maxX = maxY = 0;
  const bounds = {
    x: minX - MARGIN,
    y: minY - MARGIN,
    w: maxX - minX + MARGIN * 2,
    h: maxY - minY + MARGIN * 2,
  };
  return { nodes, byId: new Map(nodes.map((n) => [n.id, n])), bounds };
}
