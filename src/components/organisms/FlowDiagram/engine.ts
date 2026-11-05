import { resolveDotType, tokenName } from "./dots.js";
import type { EdgeGeometry, Track } from "./geometry.js";
import { pointAt, reverseTrack } from "./geometry.js";
import type { FlowDotShape, FlowDotType } from "./types.js";

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
}

interface Stream {
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
}

const TRAVEL = 0;
const PILED = 1;
const LEAVING = 2;
const DEAD = 3;

interface Dot {
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
}

/**
 * Spawns, moves and draws the dots for one diagram on a canvas.
 * Each edge stream is independent: it spawns at its own rate and its dots either
 * slip under the destination node or gather in that stream's pile.
 */
export class FlowEngine {
  private streams: Stream[] = [];
  private dots: Dot[] = [];
  private time = 0;
  private colors = new Map<string, string>();
  private ctx: CanvasRenderingContext2D | null = null;
  private scale = 1;
  private dpr = 1;

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
    for (const geo of this.model.edges) {
      const flows = geo.edge.flows ?? [];
      if (!flows.length) continue;
      const reversed = flows.some((f) => f.reverse) ? reverseTrack(geo.track) : null;
      const thick = geo.edge.line === "thick";
      // Streams arriving at the same end share one pile area, sized for all of them.
      const capAt = (rev: boolean) =>
        flows.filter((f) => Boolean(f.reverse) === rev).reduce((sum, f) => sum + Math.max(0, f.pile ?? 0), 0);
      for (const flow of flows) {
        const track = flow.reverse ? reversed! : geo.track;
        const dpm = flow.dpm ?? 60;
        if (!(dpm > 0)) continue;
        const look = resolveDotType(flow.type, this.model.dots);
        const pileCap = Math.max(0, Math.floor(flow.pile ?? 0));
        const total = capAt(Boolean(flow.reverse));
        const pileRadius = total ? r * (1.15 * Math.sqrt(total) + 1) : 0;
        const centerS = Math.max(track.length * 0.5, track.length - pileRadius - r);
        const c = pointAt(track, centerS);
        const interval = 60 / dpm;
        this.streams.push({
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
        });
      }
    }
  }

  get hasDots(): boolean {
    return this.streams.length > 0;
  }

  /** Read the current theme's token colors from the canvas's own styles. */
  refreshColors() {
    if (typeof window === "undefined") return;
    const style = window.getComputedStyle(this.canvas);
    this.colors.clear();
    for (const s of this.streams) {
      if (this.colors.has(s.colorToken)) continue;
      const value = style.getPropertyValue(`--${s.colorToken}`).trim();
      this.colors.set(s.colorToken, value || s.colorToken);
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
  }

  private spawn(stream: Stream) {
    const dot: Dot = {
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
    };
    const p = pointAt(stream.track, dot.s);
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
      const oldest = stream.piled.shift()!;
      oldest.mode = LEAVING;
      const end = pointAt(stream.track, stream.endAt);
      oldest.tx = end.x;
      oldest.ty = end.y;
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
    const speed = this.options.speed;
    let dead = 0;
    const settle = Math.min(1, dt * 6);
    for (const dot of this.dots) {
      const stream = dot.stream;
      if (dot.mode === TRAVEL) {
        dot.s += speed * dot.pace * dt;
        if (stream.pileCap > 0 && dot.s >= stream.joinAt) this.joinPile(dot);
        else if (dot.s >= stream.endAt) {
          dot.mode = DEAD;
          dead++;
          continue;
        }
        if (dot.mode === TRAVEL) {
          const p = pointAt(stream.track, dot.s);
          const fade = Math.min(1, Math.max(0, dot.s) / 12, Math.max(0, stream.track.length - dot.s) / 12);
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

  draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const { x, y } = this.model.viewBox;
    const k = this.scale * this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(k, 0, 0, k, -x * k, -y * k);
    const r = this.options.dotSize;
    let current = "";
    for (const dot of this.dots) {
      const color = this.colors.get(dot.stream.colorToken) ?? dot.stream.colorToken;
      if (color !== current) {
        ctx.fillStyle = color;
        current = color;
      }
      ctx.beginPath();
      const shape = dot.stream.shape;
      if (shape === "square") {
        ctx.rect(dot.x - r * 0.9, dot.y - r * 0.9, r * 1.8, r * 1.8);
      } else if (shape === "diamond") {
        const d = r * 1.3;
        ctx.moveTo(dot.x, dot.y - d);
        ctx.lineTo(dot.x + d, dot.y);
        ctx.lineTo(dot.x, dot.y + d);
        ctx.lineTo(dot.x - d, dot.y);
        ctx.closePath();
      } else {
        ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }
}
