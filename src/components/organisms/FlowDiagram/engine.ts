import { resolveDotType, tokenName } from "./dots.js";
import type { EdgeGeometry, Track } from "./geometry.js";
import { pointAt, reverseTrack } from "./geometry.js";
import type { FlowDotShape, FlowDotType, FlowEdge, FlowStream } from "./types.js";

/** Everything the dot engine needs, in diagram units. */
export interface EngineModel {
  edges: EdgeGeometry[];
  dots?: Record<string, FlowDotType>;
  viewBox: { x: number; y: number; w: number; h: number };
}

export interface EngineOptions {
  /** Travel speed in diagram units per second. */
  speed: number;
  /** Dot radius in diagram units. */
  dotSize: number;
  /** Whether one dot per stream carries the label as a slow-moving pill. */
  travelingLabels: boolean;
}

/** What the tooltip should describe: a stream and where its held dot sits. */
export interface TipInfo {
  edgeIndex: number;
  flowIndex: number;
  x: number;
  y: number;
  /** True when the hold came from the keyboard, so it can be announced. */
  keyboard: boolean;
}

const LABEL_FONT_SIZE = 12;
const PILL_HEIGHT = 18;
/** Room around the text: leading mark, gaps and rounded ends. */
const PILL_PADDING = 30;
/** Pills travel at this fraction of their dot's pace, slow enough to read. */
const PILL_PACE = 0.33;

/** Text a stream's label-pill shows: the edge label, or else the dot type. */
export function pillText(edge: FlowEdge, flow: FlowStream): string {
  return edge.label ?? flow.type;
}

/** Rough pill width before fonts are measured; good enough for layout decisions. */
export function estimatePillWidth(text: string): number {
  return text.length * 6.6 + PILL_PADDING;
}

/** Radius of the shared pile area at one end of an edge. */
export function pileRadiusFor(edge: FlowEdge, reverse: boolean, dotSize: number): number {
  const total = (edge.flows ?? [])
    .filter((f) => Boolean(f.reverse) === reverse)
    .reduce((sum, f) => sum + Math.max(0, f.pile ?? 0), 0);
  return total ? dotSize * (1.15 * Math.sqrt(total) + 1) : 0;
}

/** Whether a stream's line is long enough for its label-pill to travel along it. */
export function streamCanTravel(geo: EdgeGeometry, flow: FlowStream, dotSize: number): boolean {
  const pile = flow.pile ? pileRadiusFor(geo.edge, Boolean(flow.reverse), dotSize) * 2 : 0;
  return geo.track.length - pile > estimatePillWidth(pillText(geo.edge, flow)) * 1.1 + 20;
}

interface Stream {
  edgeIndex: number;
  flowIndex: number;
  track: Track;
  colorToken: string;
  shape: FlowDotShape;
  interval: number;
  nextSpawn: number;
  pileCap: number;
  pileCenter: { x: number; y: number };
  pileRadius: number;
  /** Distance along the track where dots join the pile. */
  joinAt: number;
  /** Distance past the end where dots are fully under the node. */
  endAt: number;
  piled: Dot[];
  lateral: number;
  text: string;
  textWidth: number;
  canTravel: boolean;
  reverse: boolean;
  /** The dot currently carrying this stream's label. */
  role: Dot | null;
}

const TRAVEL = 0;
const PILED = 1;
const LEAVING = 2;
const DEAD = 3;

interface Dot {
  id: number;
  stream: Stream;
  mode: number;
  s: number;
  z: number;
  lat: number;
  pace: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  /** 0 = plain dot, 1 = full label-pill. */
  morph: number;
  /** Screen direction of travel: 1 heading right, -1 heading left. The pill's mark leads. */
  dir: number;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Spawns, moves and draws the dots for one diagram on a canvas.
 * Each edge stream is independent: it spawns at its own rate and its dots either
 * slip under the destination node or gather in that stream's pile. One dot per
 * stream can carry the stream's label as a pill; any dot becomes the pill when
 * hovered, clicked, tapped or reached by keyboard, and stays still while held.
 */
export class FlowEngine {
  private streams: Stream[] = [];
  private dots: Dot[] = [];
  private time = 0;
  private nextId = 0;
  private colors = new Map<string, string>();
  private background = "white";
  private foreground = "black";
  private font = `${LABEL_FONT_SIZE}px system-ui, sans-serif`;
  private ctx: CanvasRenderingContext2D | null = null;
  private scale = 1;
  private dpr = 1;
  private hovered: Dot | null = null;
  private pinned: Dot | null = null;
  private focused: Dot | null = null;
  private focusIndex = -1;
  private lastTip = "";
  /** False while paused, off-screen or under reduced motion: interactions then settle instantly. */
  animating = false;
  onTip: ((tip: TipInfo | null) => void) | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly model: EngineModel,
    private readonly options: EngineOptions,
  ) {
    this.ctx = canvas.getContext("2d");
    this.buildStreams();
  }

  private buildStreams() {
    const r = this.options.dotSize;
    const into = r * 2 + 6;
    this.model.edges.forEach((geo, edgeIndex) => {
      const flows = geo.edge.flows ?? [];
      if (!flows.length) return;
      const reversed = flows.some((f) => f.reverse) ? reverseTrack(geo.track) : null;
      const thick = geo.edge.line === "thick";
      flows.forEach((flow, flowIndex) => {
        const track = flow.reverse ? reversed! : geo.track;
        const dpm = flow.dpm ?? 60;
        if (!(dpm > 0)) return;
        const look = resolveDotType(flow.type, this.model.dots);
        const pileCap = Math.max(0, Math.floor(flow.pile ?? 0));
        const pileRadius = pileRadiusFor(geo.edge, Boolean(flow.reverse), r);
        const centerS = Math.max(track.length * 0.5, track.length - pileRadius - r);
        const c = pointAt(track, centerS);
        const interval = 60 / dpm;
        const text = pillText(geo.edge, flow);
        this.streams.push({
          edgeIndex,
          flowIndex,
          track,
          colorToken: tokenName(look.color),
          shape: look.shape,
          interval,
          nextSpawn: Math.random() * interval,
          pileCap,
          pileCenter: { x: c.x, y: c.y },
          pileRadius,
          joinAt: Math.max(0, centerS - pileRadius),
          endAt: track.length + into,
          piled: [],
          lateral: (thick ? 2.5 : 1) + r * 0.6,
          text,
          textWidth: estimatePillWidth(text) - PILL_PADDING,
          canTravel: streamCanTravel(geo, flow, r),
          reverse: Boolean(flow.reverse),
          role: null,
        });
      });
    });
  }

  get hasDots(): boolean {
    return this.streams.length > 0;
  }

  get streamCount(): number {
    return this.streams.length;
  }

  setTravelingLabels(on: boolean) {
    this.options.travelingLabels = on;
    if (!on) for (const s of this.streams) s.role = null;
    this.afterInteraction();
  }

  /** Read the current theme's token colors and font from the canvas's own styles. */
  refreshColors() {
    if (typeof window === "undefined") return;
    const style = window.getComputedStyle(this.canvas);
    const read = (name: string) => style.getPropertyValue(`--${name}`).trim();
    this.colors.clear();
    for (const s of this.streams) {
      if (!this.colors.has(s.colorToken)) this.colors.set(s.colorToken, read(s.colorToken) || s.colorToken);
    }
    this.background = read("background") || "white";
    this.foreground = read("foreground") || "black";
    this.font = `${LABEL_FONT_SIZE}px ${read("font-family") || "system-ui, sans-serif"}`;
    if (this.ctx) {
      this.ctx.font = this.font;
      for (const s of this.streams) s.textWidth = this.ctx.measureText(s.text).width;
    }
  }

  /** Match the canvas backing store to its displayed size. */
  resize() {
    if (typeof window === "undefined") return;
    const cssW = this.canvas.clientWidth;
    const cssH = this.canvas.clientHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(cssW * this.dpr));
    this.canvas.height = Math.max(1, Math.round(cssH * this.dpr));
    this.scale = cssW / this.model.viewBox.w || 1;
  }

  /** Diagram units per CSS pixel, for converting pointer positions and hit sizes. */
  get unitsPerPixel(): number {
    return 1 / (this.scale || 1);
  }

  /** Run the diagram forward so it opens mid-flow, with piles already formed. */
  prewarm() {
    let longest = 0;
    for (const s of this.streams) {
      const travel = s.endAt / this.options.speed;
      const fill = s.pileCap * s.interval;
      longest = Math.max(longest, travel + fill);
    }
    const total = Math.min(longest + 1, 120);
    for (let t = 0; t < total; t += 0.05) this.step(0.05);
    this.settle();
  }

  private isHeld(dot: Dot): boolean {
    return dot === this.hovered || dot === this.pinned || dot === this.focused;
  }

  private pillHalf(stream: Stream): number {
    return (stream.textWidth + PILL_PADDING) / 2;
  }

  /** Where a traveling pill must start shrinking: before the pile, or before the node. */
  private shrinkAt(stream: Stream): number {
    const limit = stream.pileCap > 0 ? stream.joinAt : stream.track.length;
    // The mark leads and the text trails, so only the mark needs room ahead.
    return limit - this.options.dotSize - PILL_HEIGHT / 2 - 8;
  }

  private morphTarget(dot: Dot): number {
    if (this.isHeld(dot)) return 1;
    const stream = dot.stream;
    if (stream.role !== dot) return 0;
    // Grow only once the pill has room to come out from under the source node.
    return dot.s > this.options.dotSize * 3 ? 1 : 0;
  }

  /** Snap every dot to its pill/dot target; used when not animating. */
  private settle() {
    this.updateRoles();
    for (const dot of this.dots) dot.morph = this.morphTarget(dot);
  }

  private updateRoles() {
    for (const stream of this.streams) {
      const role = stream.role;
      if (role && !this.isHeld(role) && (role.mode !== TRAVEL || role.s >= this.shrinkAt(stream))) {
        stream.role = null;
      }
      if (stream.role || !this.options.travelingLabels || !stream.canTravel) continue;
      // Hand the label to the newest dot on the line, so it rides the whole way.
      let newest: Dot | null = null;
      for (const dot of this.dots) {
        if (dot.stream !== stream || dot.mode !== TRAVEL || dot.s >= this.shrinkAt(stream) - this.pillHalf(stream)) continue;
        if (!newest || dot.id > newest.id) newest = dot;
      }
      // Pills of other types on the same line and direction keep their distance instead of overlapping.
      if (newest && this.crowded(stream, newest)) newest = null;
      stream.role = newest;
    }
  }

  private crowded(stream: Stream, candidate: Dot): boolean {
    for (const other of this.streams) {
      if (other === stream || other.edgeIndex !== stream.edgeIndex || other.reverse !== stream.reverse) continue;
      const pill = other.role;
      if (!pill || pill.mode !== TRAVEL) continue;
      // Pills trail behind their mark, so keep a full pill length (the longer one) plus a gap.
      const room = 2 * Math.max(this.pillHalf(stream), this.pillHalf(other)) + 12;
      if (Math.abs(pill.s - candidate.s) < room) return true;
    }
    return false;
  }

  private spawn(stream: Stream) {
    const dot: Dot = {
      id: this.nextId++,
      stream,
      mode: TRAVEL,
      s: -(this.options.dotSize * 2 + 6),
      // A random layer per dot keeps overlaps stable (no flicker) and the traffic organic.
      z: Math.random(),
      lat: (Math.random() * 2 - 1) * stream.lateral,
      pace: 0.88 + Math.random() * 0.24,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      morph: 0,
      dir: 1,
    };
    const p = pointAt(stream.track, dot.s);
    dot.dir = p.dx < -0.05 ? -1 : 1;
    dot.x = p.x;
    dot.y = p.y;
    // Insert in layer order so drawing is a single in-order pass.
    let lo = 0;
    let hi = this.dots.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (this.dots[m].z < dot.z) lo = m + 1;
      else hi = m;
    }
    this.dots.splice(lo, 0, dot);
  }

  private joinPile(dot: Dot) {
    const stream = dot.stream;
    if (stream.piled.length >= stream.pileCap) {
      // Release the oldest dot that isn't being held.
      const i = stream.piled.findIndex((d) => !this.isHeld(d));
      if (i >= 0) {
        const [oldest] = stream.piled.splice(i, 1);
        oldest.mode = LEAVING;
        const end = pointAt(stream.track, stream.endAt);
        oldest.tx = end.x;
        oldest.ty = end.y;
      }
    }
    const angle = Math.random() * Math.PI * 2;
    const radius = stream.pileRadius * Math.sqrt(Math.random());
    dot.mode = PILED;
    dot.tx = stream.pileCenter.x + Math.cos(angle) * radius;
    dot.ty = stream.pileCenter.y + Math.sin(angle) * radius;
    stream.piled.push(dot);
  }

  step(dt: number) {
    this.time += dt;
    for (const stream of this.streams) {
      while (stream.nextSpawn <= this.time) {
        this.spawn(stream);
        stream.nextSpawn += stream.interval * (0.55 + Math.random() * 0.9);
      }
    }
    this.updateRoles();
    const speed = this.options.speed;
    let dead = 0;
    const settle = Math.min(1, dt * 6);
    const morphRate = Math.min(1, dt * 4);
    for (const dot of this.dots) {
      dot.morph += (this.morphTarget(dot) - dot.morph) * morphRate;
      if (this.isHeld(dot)) continue;
      const stream = dot.stream;
      if (dot.mode === TRAVEL) {
        const pace = dot.pace + (PILL_PACE - dot.pace) * smooth(Math.min(1, dot.morph));
        dot.s += speed * pace * dt;
        if (stream.pileCap > 0 && dot.s >= stream.joinAt) this.joinPile(dot);
        else if (dot.s >= stream.endAt) {
          dot.mode = DEAD;
          dead++;
          continue;
        }
        if (dot.mode === TRAVEL) {
          const p = pointAt(stream.track, dot.s);
          // Pills ride the center of the line; plain dots wander slightly to either side.
          const fade =
            Math.min(1, Math.max(0, dot.s) / 12, Math.max(0, stream.track.length - dot.s) / 12) * (1 - dot.morph);
          // Flip only on a clear change of heading, so near-vertical lines don't make pills flicker.
          if (Math.abs(p.dx) > 0.3) dot.dir = p.dx > 0 ? 1 : -1;
          dot.x = p.x - p.dy * dot.lat * fade;
          dot.y = p.y + p.dx * dot.lat * fade;
        }
      }
      if (dot.mode === PILED) {
        dot.x += (dot.tx - dot.x) * settle;
        dot.y += (dot.ty - dot.y) * settle;
      } else if (dot.mode === LEAVING) {
        const dx = dot.tx - dot.x;
        const dy = dot.ty - dot.y;
        const dist = Math.hypot(dx, dy);
        const move = speed * dt;
        if (dist <= move) {
          dot.mode = DEAD;
          dead++;
        } else {
          dot.x += (dx / dist) * move;
          dot.y += (dy / dist) * move;
        }
      }
    }
    if (dead) this.dots = this.dots.filter((d) => d.mode !== DEAD);
  }

  // ---- Interaction -------------------------------------------------------

  private pillBox(dot: Dot) {
    const m = smooth(Math.min(1, dot.morph));
    const r = this.options.dotSize;
    const h = 2 * r + (PILL_HEIGHT - 2 * r) * m;
    const w = 2 * r + (dot.stream.textWidth + PILL_PADDING - 2 * r) * m;
    // The pill grows backward from its leading mark, which stays on the dot.
    const left = dot.dir > 0 ? dot.x + h / 2 - w : dot.x - h / 2;
    return { left, top: dot.y - h / 2, w, h, m };
  }

  /** The topmost dot or pill under a point (diagram units), within `radius`. */
  private hit(x: number, y: number, radius: number): Dot | null {
    for (let i = this.dots.length - 1; i >= 0; i--) {
      const d = this.dots[i];
      if (d.morph < 0.3) continue;
      const b = this.pillBox(d);
      if (x >= b.left - 4 && x <= b.left + b.w + 4 && y >= b.top - 4 && y <= b.top + b.h + 4) return d;
    }
    let best: Dot | null = null;
    let bestDist = radius;
    for (let i = this.dots.length - 1; i >= 0; i--) {
      const d = this.dots[i];
      // Only dots in view count: skip ones tucked under a node at either end.
      if (d.mode === DEAD || d.mode === LEAVING) continue;
      if (d.mode === TRAVEL && (d.s < 0 || d.s > d.stream.track.length)) continue;
      const dist = Math.hypot(d.x - x, d.y - y);
      if (dist < bestDist) {
        best = d;
        bestDist = dist;
      }
    }
    return best;
  }

  /** A held traveling dot takes over its stream's label so it keeps riding when released. */
  private claim(dot: Dot | null) {
    if (dot && dot.mode === TRAVEL && this.options.travelingLabels && dot.stream.canTravel) {
      dot.stream.role = dot;
    }
  }

  pointerMove(x: number, y: number, radius: number): boolean {
    const keep = this.hovered && this.hit(x, y, radius) === this.hovered;
    if (!keep) {
      this.hovered = this.hit(x, y, radius);
      this.claim(this.hovered);
      this.afterInteraction();
    }
    return this.hovered !== null;
  }

  pointerLeave() {
    if (!this.hovered) return;
    this.hovered = null;
    this.afterInteraction();
  }

  /** Click or tap: pin the dot under the point, or release the pin when tapping empty space or the same dot. */
  tap(x: number, y: number, radius: number) {
    const dot = this.hit(x, y, radius);
    this.pinned = dot && dot !== this.pinned ? dot : null;
    this.claim(this.pinned);
    this.afterInteraction();
  }

  /** Keyboard: hold a stream's label dot. `step` moves to the next or previous stream; null clears. */
  focusStream(step: number | null) {
    if (step === null || !this.streams.length) {
      this.focused = null;
      this.focusIndex = -1;
    } else {
      const n = this.streams.length;
      this.focusIndex = this.focusIndex < 0 ? (step > 0 ? 0 : n - 1) : (this.focusIndex + step + n) % n;
      const stream = this.streams[this.focusIndex];
      let pick = stream.role;
      if (!pick) {
        for (const d of this.dots) {
          if (d.stream !== stream || d.mode === DEAD || d.mode === LEAVING) continue;
          if (!pick || (d.mode === TRAVEL && (pick.mode !== TRAVEL || d.id > pick.id))) pick = d;
        }
      }
      this.focused = pick;
      this.claim(pick);
    }
    this.afterInteraction();
  }

  private afterInteraction() {
    if (!this.animating) {
      this.settle();
      this.draw();
    }
    this.emitTip();
  }

  private emitTip() {
    const dot = this.hovered ?? this.focused ?? this.pinned;
    const key = dot ? `${dot.id}:${dot === this.focused && !this.hovered}` : "";
    if (key === this.lastTip) return;
    this.lastTip = key;
    if (!dot) {
      this.onTip?.(null);
      return;
    }
    const b = this.pillBox({ ...dot, morph: 1 });
    this.onTip?.({
      edgeIndex: dot.stream.edgeIndex,
      flowIndex: dot.stream.flowIndex,
      x: b.left + b.w / 2,
      y: b.top,
      keyboard: dot === this.focused && !this.hovered,
    });
  }

  // ---- Drawing -----------------------------------------------------------

  private mark(ctx: CanvasRenderingContext2D, shape: FlowDotShape, x: number, y: number, r: number) {
    ctx.beginPath();
    if (shape === "square") {
      ctx.rect(x - r * 0.9, y - r * 0.9, r * 1.8, r * 1.8);
    } else if (shape === "diamond") {
      const d = r * 1.3;
      ctx.moveTo(x, y - d);
      ctx.lineTo(x + d, y);
      ctx.lineTo(x, y + d);
      ctx.lineTo(x - d, y);
      ctx.closePath();
    } else {
      ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  private capsule(ctx: CanvasRenderingContext2D, left: number, top: number, w: number, h: number) {
    const rad = h / 2;
    ctx.beginPath();
    ctx.moveTo(left + rad, top);
    ctx.lineTo(left + w - rad, top);
    ctx.arc(left + w - rad, top + rad, rad, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(left + rad, top + h);
    ctx.arc(left + rad, top + rad, rad, Math.PI / 2, (Math.PI * 3) / 2);
    ctx.closePath();
  }

  private drawPill(ctx: CanvasRenderingContext2D, dot: Dot, color: string) {
    const r = this.options.dotSize;
    const { left, top, w, h, m } = this.pillBox(dot);
    // Colored capsule, then a background inset that fades in, leaving a colored rim.
    ctx.fillStyle = color;
    this.capsule(ctx, left, top, w, h);
    ctx.fill();
    ctx.globalAlpha = m;
    ctx.fillStyle = this.background;
    this.capsule(ctx, left + 1.5, top + 1.5, w - 3, h - 3);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    this.mark(ctx, dot.stream.shape, dot.x, dot.y, r);
    if (m > 0.05) {
      ctx.globalAlpha = m;
      ctx.fillStyle = this.foreground;
      ctx.font = this.font;
      ctx.textBaseline = "middle";
      ctx.textAlign = dot.dir > 0 ? "right" : "left";
      // Text trails behind the leading mark.
      ctx.fillText(dot.stream.text, dot.x - (r + 5) * dot.dir, dot.y + 0.5);
      ctx.globalAlpha = 1;
    }
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const { x, y } = this.model.viewBox;
    const k = this.scale * this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(k, 0, 0, k, -x * k, -y * k);
    const r = this.options.dotSize;
    const pills: Dot[] = [];
    let current = "";
    for (const dot of this.dots) {
      if (dot.morph > 0.02) {
        pills.push(dot);
        continue;
      }
      const color = this.colors.get(dot.stream.colorToken) ?? dot.stream.colorToken;
      if (color !== current) {
        ctx.fillStyle = color;
        current = color;
      }
      this.mark(ctx, dot.stream.shape, dot.x, dot.y, r);
    }
    // Pills always sit above plain dots; held ones on top of everything.
    pills.sort((a, b) => Number(this.isHeld(a)) - Number(this.isHeld(b)) || a.morph - b.morph);
    for (const dot of pills) {
      this.drawPill(ctx, dot, this.colors.get(dot.stream.colorToken) ?? dot.stream.colorToken);
    }
  }
}
