import type { PlacedNode } from "./layout.js";
import type { FlowEdge } from "./types.js";

export interface Pt {
  x: number;
  y: number;
}

/** A sampled edge path with cumulative arc lengths, so positions along it are cheap lookups. */
export interface Track {
  points: Pt[];
  cum: number[];
  length: number;
}

export interface EdgeGeometry {
  edge: FlowEdge;
  track: Track;
  /** SVG path data for the line. */
  d: string;
  mid: Pt;
}

/** Whether a point lies inside a node's outline (grown by `pad`). */
export function insideNode(n: PlacedNode, p: Pt, pad = 0): boolean {
  const dx = Math.abs(p.x - n.x);
  const dy = Math.abs(p.y - n.y);
  const hw = n.w / 2 + pad;
  const hh = n.h / 2 + pad;
  if (n.shape === "circle") return dx * dx + dy * dy <= hw * hw;
  if (n.shape === "diamond") return dx / hw + dy / hh <= 1;
  return dx <= hw && dy <= hh;
}

type Curve = (t: number) => Pt;

const quad = (a: Pt, c: Pt, b: Pt): Curve => (t) => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};

const cubic = (a: Pt, c1: Pt, c2: Pt, b: Pt): Curve => (t) => {
  const u = 1 - t;
  const w0 = u * u * u;
  const w1 = 3 * u * u * t;
  const w2 = 3 * u * t * t;
  const w3 = t * t * t;
  return {
    x: w0 * a.x + w1 * c1.x + w2 * c2.x + w3 * b.x,
    y: w0 * a.y + w1 * c1.y + w2 * c2.y + w3 * b.y,
  };
};

/** Find the parameter where the curve crosses a node outline, between an inside and an outside value. */
function crossing(curve: Curve, node: PlacedNode, tin: number, tout: number, pad: number): number {
  for (let i = 0; i < 24; i++) {
    const mid = (tin + tout) / 2;
    if (insideNode(node, curve(mid), pad)) tin = mid;
    else tout = mid;
  }
  return tout;
}

export function buildTrack(points: Pt[]): Track {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return { points, cum, length: cum[cum.length - 1] };
}

export function reverseTrack(track: Track): Track {
  return buildTrack([...track.points].reverse());
}

/**
 * Position and unit direction at distance `s` along a track. Beyond either end the
 * position continues straight, so dots can slip under the nodes at both ends.
 */
export function pointAt(track: Track, s: number): { x: number; y: number; dx: number; dy: number } {
  const { points, cum, length } = track;
  const n = points.length;
  let i: number;
  if (s <= 0) i = 0;
  else if (s >= length) i = n - 2;
  else {
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (cum[m] <= s) lo = m;
      else hi = m;
    }
    i = lo;
  }
  const a = points[i];
  const b = points[i + 1];
  const seg = cum[i + 1] - cum[i] || 1;
  const dx = (b.x - a.x) / seg;
  const dy = (b.y - a.y) / seg;
  const along = s - cum[i];
  return { x: a.x + dx * along, y: a.y + dy * along, dx, dy };
}

const SAMPLES = 64;
const GAP = 3;

function sampleTrimmed(curve: Curve, from: PlacedNode, to: PlacedNode): Pt[] | null {
  // Coarse scan for where the curve leaves the source and enters the target.
  const steps = 96;
  let tStart = -1;
  let tEnd = -1;
  for (let i = 0; i <= steps; i++) {
    if (!insideNode(from, curve(i / steps), GAP)) {
      tStart = crossing(curve, from, Math.max(0, (i - 1) / steps), i / steps, GAP);
      break;
    }
  }
  for (let i = steps; i >= 0; i--) {
    if (!insideNode(to, curve(i / steps), GAP)) {
      tEnd = crossing(curve, to, Math.min(1, (i + 1) / steps), i / steps, GAP);
      break;
    }
  }
  if (tStart < 0 || tEnd < 0 || tEnd <= tStart) return null;
  const points: Pt[] = [];
  for (let i = 0; i <= SAMPLES; i++) points.push(curve(tStart + ((tEnd - tStart) * i) / SAMPLES));
  return points;
}

function hitsOthers(curve: Curve, skip: PlacedNode[], nodes: PlacedNode[]): boolean {
  for (let i = 1; i < 40; i++) {
    const p = curve(i / 40);
    for (const n of nodes) if (!skip.includes(n) && insideNode(n, p, 10)) return true;
  }
  return false;
}

function pathData(points: Pt[]): string {
  return points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
}

/**
 * Route every edge. Parallel edges between the same two nodes fan out to either side,
 * and an edge that would cross another node bows around it.
 */
export function buildEdges(edges: FlowEdge[], byId: Map<string, PlacedNode>): EdgeGeometry[] {
  const nodes = [...byId.values()];
  const groups = new Map<string, FlowEdge[]>();
  const keyOf = (e: FlowEdge) => [e.from, e.to].sort().join("\u0000");
  for (const e of edges) {
    const k = keyOf(e);
    groups.set(k, [...(groups.get(k) ?? []), e]);
  }

  const result: EdgeGeometry[] = [];
  for (const edge of edges) {
    const a = byId.get(edge.from);
    const b = byId.get(edge.to);
    if (!a || !b) continue;

    let curve: Curve;
    if (a === b) {
      const top = a.y - a.h / 2;
      const lift = 56;
      const group = groups.get(keyOf(edge))!;
      const extra = group.indexOf(edge) * 22;
      curve = cubic(
        { x: a.x + a.w * 0.2, y: a.y },
        { x: a.x + a.w * 0.45 + extra, y: top - lift - extra },
        { x: a.x - a.w * 0.45 - extra, y: top - lift - extra },
        { x: a.x - a.w * 0.2, y: a.y },
      );
    } else {
      // Normal measured from a fixed ordering of the pair, so A→B and B→A bow to opposite sides.
      const [p, q] = edge.from < edge.to ? [a, b] : [b, a];
      const len = Math.hypot(q.x - p.x, q.y - p.y) || 1;
      const nx = -(q.y - p.y) / len;
      const ny = (q.x - p.x) / len;
      const group = groups.get(keyOf(edge))!;
      const base = (group.indexOf(edge) - (group.length - 1) / 2) * 56;
      const make = (bulge: number) =>
        quad(a, { x: (a.x + b.x) / 2 + nx * bulge, y: (a.y + b.y) / 2 + ny * bulge }, b);
      curve = make(base);
      if (hitsOthers(curve, [a, b], nodes)) {
        const sign = base < 0 ? -1 : 1;
        for (const extra of [60, 100, 150, 210, 280]) {
          const tries = base === 0 ? [extra, -extra] : [base + sign * extra];
          const found = tries.map(make).find((c) => !hitsOthers(c, [a, b], nodes));
          if (found) {
            curve = found;
            break;
          }
        }
      }
    }

    const points = sampleTrimmed(curve, a, b);
    if (!points) continue;
    const track = buildTrack(points);
    const m = pointAt(track, track.length / 2);
    result.push({ edge, track, d: pathData(points), mid: { x: m.x, y: m.y } });
  }
  return result;
}
