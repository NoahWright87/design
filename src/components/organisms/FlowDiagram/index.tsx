"use client";
import * as React from "react";
import { usePrefersReducedMotion } from "../../../atoms/usePrefersReducedMotion.js";
import { cssColor, resolveDotType } from "./dots.js";
import { FlowEngine, streamCanTravel, type EngineModel, type TipInfo } from "./engine.js";
import { buildEdges, pointAt, type EdgeGeometry, type Pt } from "./geometry.js";
import { FONT_SIZE, normalize, placeNodes, type PlacedNode } from "./layout.js";
import { parseFlowDiagram } from "./parse.js";
import type { FlowDiagramData, FlowDiagramLayout, FlowEdge, FlowStream } from "./types.js";
import "./flowDiagram.css";

export * from "./types.js";
export { parseFlowDiagram, parseFlowTokens } from "./parse.js";
export { BUILTIN_DOT_TYPES } from "./dots.js";

/** How labels on lines with traffic behave. */
export type FlowLabelMotion = "travel" | "still";

export interface FlowDiagramProps {
  /** Mermaid-flavored flowchart text, with optional dot tokens. */
  source?: string;
  /** The object form (from JSON, YAML, or code). Used instead of `source` when both are given. */
  diagram?: FlowDiagramData;
  /** Grid cells for nodes, kept separate from content. Nodes left out are placed automatically. */
  layout?: FlowDiagramLayout;
  /** Dot travel speed in diagram units per second. Defaults to 70. */
  speed?: number;
  /** Dot radius in diagram units. Defaults to 4. */
  dotSize?: number;
  /**
   * `"travel"` (default): one dot per stream carries the label as a slow-moving pill.
   * `"still"`: labels sit beside their lines. Reduced motion always uses `"still"`.
   */
  labelMotion?: FlowLabelMotion;
  /** Freezes the dots where they are. Defaults to false. */
  paused?: boolean;
  /** Accessible name for the diagram. Defaults to "Flow diagram". */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface Model {
  nodes: PlacedNode[];
  edges: EdgeGeometry[];
  engine: EngineModel;
  names: Map<string, string>;
  summary: string[];
}

function rateText(flow: FlowStream): string {
  return `${flow.dpm ?? 60} per minute`;
}

function describeEdge(e: FlowEdge, names: Map<string, string>): string {
  const from = names.get(e.from) ?? e.from;
  const to = names.get(e.to) ?? e.to;
  const parts = (e.flows ?? []).map((f) => {
    const dir = f.reverse ? ` from ${to} back to ${from}` : "";
    const pile = f.pile ? `, up to ${f.pile} waiting` : "";
    return `${f.type} ${rateText(f)}${dir}${pile}`;
  });
  const label = e.label ? ` (${e.label})` : "";
  return `${from} to ${to}${label}${parts.length ? `: ${parts.join("; ")}` : ""}.`;
}

function buildModel(data: FlowDiagramData, layout?: FlowDiagramLayout): Model {
  const diagram = normalize(data);
  const placement = placeNodes(diagram, layout);
  const edges = buildEdges(diagram.edges, placement.byId);

  // Fit the view to nodes, curved edges, and room for labels beside the lines.
  let { x, y, w, h } = placement.bounds;
  let x2 = x + w;
  let y2 = y + h;
  const pad = 22;
  for (const geo of edges) {
    for (const p of geo.track.points) {
      x = Math.min(x, p.x - pad);
      y = Math.min(y, p.y - pad);
      x2 = Math.max(x2, p.x + pad);
      y2 = Math.max(y2, p.y + pad);
    }
  }
  const viewBox = { x, y, w: x2 - x, h: y2 - y };
  const names = new Map(diagram.nodes.map((n) => [n.id, n.label]));
  return {
    nodes: placement.nodes,
    edges,
    engine: { edges, dots: diagram.dots, viewBox },
    names,
    summary: diagram.edges.map((e) => describeEdge(e, names)),
  };
}

function arrowPoints(tip: Pt, dx: number, dy: number, thick: boolean): string {
  const len = thick ? 12 : 9;
  const half = thick ? 6 : 4.5;
  const bx = tip.x - dx * len;
  const by = tip.y - dy * len;
  return [
    `${tip.x.toFixed(1)},${tip.y.toFixed(1)}`,
    `${(bx - dy * half).toFixed(1)},${(by + dx * half).toFixed(1)}`,
    `${(bx + dy * half).toFixed(1)},${(by - dx * half).toFixed(1)}`,
  ].join(" ");
}

function edgeArrows(geo: EdgeGeometry): string[] {
  const { points } = geo.track;
  const arrow = geo.edge.arrow ?? "end";
  const thick = geo.edge.line === "thick";
  const head = (tip: Pt, prev: Pt) => {
    const len = Math.hypot(tip.x - prev.x, tip.y - prev.y) || 1;
    return arrowPoints(tip, (tip.x - prev.x) / len, (tip.y - prev.y) / len, thick);
  };
  const out: string[] = [];
  if (arrow !== "none") out.push(head(points[points.length - 1], points[points.length - 2]));
  if (arrow === "both") out.push(head(points[0], points[1]));
  return out;
}

/** Place a still label just beside the middle of its line: above horizontal lines, right of vertical ones. */
function sideLabel(geo: EdgeGeometry) {
  const m = pointAt(geo.track, geo.track.length / 2);
  let nx = -m.dy;
  let ny = m.dx;
  if (ny > 0.2 || (Math.abs(ny) <= 0.2 && nx < 0)) {
    nx = -nx;
    ny = -ny;
  }
  const gap = 10;
  const anchor = nx > 0.6 ? "start" : nx < -0.6 ? "end" : "middle";
  const baseline = ny < -0.6 ? "auto" : ny > 0.6 ? "hanging" : "central";
  return { x: m.x + nx * gap, y: m.y + ny * gap, anchor, baseline } as const;
}

function NodeShape({ node }: { node: PlacedNode }) {
  const { x, y, w, h } = node;
  const left = x - w / 2;
  const top = y - h / 2;
  switch (node.shape) {
    case "circle":
      return <circle className="nw-flow__node" cx={x} cy={y} r={w / 2} />;
    case "diamond":
      return (
        <polygon
          className="nw-flow__node"
          points={`${x},${top} ${x + w / 2},${y} ${x},${top + h} ${left},${y}`}
        />
      );
    default: {
      const rx = node.shape === "stadium" ? h / 2 : node.shape === "round" ? 14 : 6;
      return <rect className="nw-flow__node" x={left} y={top} width={w} height={h} rx={rx} />;
    }
  }
}

interface TipView {
  title: string;
  type: string;
  color: string;
  detail: string;
  pile?: string;
  route?: string;
  left: number;
  top: number;
  below: boolean;
  align: "start" | "center" | "end";
  keyboard: boolean;
}

function tipView(model: Model, tip: TipInfo): TipView | null {
  const geo = model.edges[tip.edgeIndex];
  const flow = geo?.edge.flows?.[tip.flowIndex];
  if (!geo || !flow) return null;
  const e = geo.edge;
  const from = model.names.get(e.from) ?? e.from;
  const to = model.names.get(e.to) ?? e.to;
  const [a, b] = flow.reverse ? [to, from] : [from, to];
  const vb = model.engine.viewBox;
  const left = ((tip.x - vb.x) / vb.w) * 100;
  const top = ((tip.y - vb.y) / vb.h) * 100;
  return {
    title: e.label ?? `${a} → ${b}`,
    route: e.label ? `${a} → ${b}` : undefined,
    type: flow.type,
    color: cssColor(resolveDotType(flow.type, model.engine.dots).color),
    detail: rateText(flow),
    pile: flow.pile ? `Pile of up to ${flow.pile}` : undefined,
    left,
    top,
    below: top < 30,
    align: left < 18 ? "start" : left > 82 ? "end" : "center",
    keyboard: tip.keyboard,
  };
}

/**
 * A flowchart whose edges can carry streams of moving, color-coded dots.
 * Lines sit at the bottom, dots travel above the lines, and symbols sit on top,
 * so dots appear from under one node and slip under the next. One dot per stream
 * carries the label as a slow pill; hovering, clicking or tapping any dot turns it
 * into the pill and holds it still while the rest keep moving.
 */
export function FlowDiagram({
  source,
  diagram,
  layout,
  speed = 70,
  dotSize = 4,
  labelMotion = "travel",
  paused = false,
  title = "Flow diagram",
  className,
  style,
}: FlowDiagramProps) {
  const reduced = usePrefersReducedMotion();
  const travel = labelMotion === "travel" && !reduced;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const engineRef = React.useRef<FlowEngine | null>(null);
  const controls = React.useRef<{ sync: () => void } | null>(null);
  const flags = React.useRef({ paused, reduced, travel });
  flags.current = { paused, reduced, travel };
  const pointerType = React.useRef("mouse");
  const [tip, setTip] = React.useState<TipInfo | null>(null);
  const descId = React.useId();

  // Keyed on content, so inline objects re-created on every render keep the animation running.
  const key = `${source ?? ""}\u0000${JSON.stringify(diagram ?? null)}\u0000${JSON.stringify(layout ?? null)}`;
  const model = React.useMemo(
    () => buildModel(diagram ?? (source ? parseFlowDiagram(source) : { edges: [] }), layout),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  const hasTraffic = model.edges.some((g) => (g.edge.flows ?? []).some((f) => (f.dpm ?? 60) > 0));

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const engine = new FlowEngine(canvas, model.engine, {
      speed,
      dotSize,
      travelingLabels: flags.current.travel,
    });
    if (!engine.hasDots) return;
    engine.onTip = setTip;
    engineRef.current = engine;
    engine.resize();
    engine.refreshColors();
    engine.prewarm();
    engine.draw();

    let raf = 0;
    let last = 0;
    let visible = true;
    const tick = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      engine.step(dt);
      engine.draw();
      raf = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      const run = visible && !flags.current.paused && !flags.current.reduced;
      engine.animating = run;
      if (run && !raf) {
        last = 0;
        raf = window.requestAnimationFrame(tick);
      } else if (!run && raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    controls.current = { sync };

    const redraw = () => {
      engine.resize();
      engine.draw();
    };
    const recolor = () => {
      engine.refreshColors();
      engine.draw();
    };
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(redraw) : null;
    resizeObserver?.observe(canvas);
    const themeObserver = typeof MutationObserver !== "undefined" ? new MutationObserver(recolor) : null;
    themeObserver?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    const scheme = window.matchMedia?.("(prefers-color-scheme: dark)");
    scheme?.addEventListener?.("change", recolor);
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          })
        : null;
    io?.observe(canvas);
    sync();

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      themeObserver?.disconnect();
      scheme?.removeEventListener?.("change", recolor);
      io?.disconnect();
      controls.current = null;
      engineRef.current = null;
      setTip(null);
    };
  }, [model, speed, dotSize]);

  React.useEffect(() => {
    controls.current?.sync();
  }, [paused, reduced]);

  React.useEffect(() => {
    engineRef.current?.setTravelingLabels(travel);
  }, [travel]);

  /** Convert a pointer position to diagram units, plus a hit radius sized in screen pixels. */
  const locate = (clientX: number, clientY: number, px: number) => {
    const stage = stageRef.current!;
    const rect = stage.getBoundingClientRect();
    const vb = model.engine.viewBox;
    const k = vb.w / (rect.width || 1);
    return { x: vb.x + (clientX - rect.left) * k, y: vb.y + (clientY - rect.top) * k, r: px * k };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    pointerType.current = e.pointerType;
    const engine = engineRef.current;
    if (!engine || e.pointerType !== "mouse") return;
    const { x, y, r } = locate(e.clientX, e.clientY, 12);
    const over = engine.pointerMove(x, y, r);
    if (stageRef.current) stageRef.current.style.cursor = over ? "pointer" : "";
  };

  const onPointerLeave = () => {
    engineRef.current?.pointerLeave();
    if (stageRef.current) stageRef.current.style.cursor = "";
  };

  const onClick = (e: React.MouseEvent) => {
    const engine = engineRef.current;
    if (!engine) return;
    const { x, y, r } = locate(e.clientX, e.clientY, pointerType.current === "mouse" ? 12 : 24);
    engine.tap(x, y, r);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const engine = engineRef.current;
    if (!engine) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") engine.focusStream(1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") engine.focusStream(-1);
    else if (e.key === "Escape") engine.focusStream(null);
    else return;
    e.preventDefault();
  };

  const view = tip ? tipView(model, tip) : null;
  const { x, y, w, h } = model.engine.viewBox;
  const viewBox = `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;

  return (
    <figure
      className={["nw-flow", className].filter(Boolean).join(" ")}
      style={{ maxWidth: `${Math.ceil(w)}px`, ...style }}
    >
      <div
        ref={stageRef}
        className="nw-flow__stage"
        role={hasTraffic ? "group" : "img"}
        aria-roledescription={hasTraffic ? "flow diagram" : undefined}
        aria-label={title}
        aria-describedby={descId}
        tabIndex={hasTraffic ? 0 : undefined}
        onPointerMove={hasTraffic ? onPointerMove : undefined}
        onPointerDown={hasTraffic ? (e) => (pointerType.current = e.pointerType) : undefined}
        onPointerLeave={hasTraffic ? onPointerLeave : undefined}
        onClick={hasTraffic ? onClick : undefined}
        onKeyDown={hasTraffic ? onKeyDown : undefined}
        onBlur={hasTraffic ? () => engineRef.current?.focusStream(null) : undefined}
      >
        <svg className="nw-flow__layer" viewBox={viewBox} aria-hidden="true" focusable="false">
          {model.edges.map((geo, i) => {
            const e = geo.edge;
            const edgeStyle = e.color
              ? ({ "--nw-flow-edge-color": cssColor(e.color) } as React.CSSProperties)
              : undefined;
            return (
              <g key={i} style={edgeStyle}>
                <path className={`nw-flow__edge nw-flow__edge--${e.line ?? "solid"}`} d={geo.d} />
                {edgeArrows(geo).map((pts, j) => (
                  <polygon key={j} className="nw-flow__arrow" points={pts} />
                ))}
              </g>
            );
          })}
        </svg>
        <canvas ref={canvasRef} className="nw-flow__canvas" aria-hidden="true" />
        <svg className="nw-flow__layer nw-flow__top" viewBox={viewBox} aria-hidden="true" focusable="false">
          {model.nodes.map((node) => (
            <g key={node.id}>
              <NodeShape node={node} />
              <text
                className="nw-flow__node-label"
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={FONT_SIZE}
              >
                {node.label}
              </text>
            </g>
          ))}
          {model.edges.map((geo, i) => {
            const label = geo.edge.label;
            if (!label) return null;
            // Traveling pills carry the label on lines long enough for them; elsewhere it sits beside the line.
            const carried =
              travel &&
              (geo.edge.flows ?? []).some((f) => (f.dpm ?? 60) > 0 && streamCanTravel(geo, f, dotSize));
            if (carried) return null;
            const pos = sideLabel(geo);
            return (
              <text
                key={i}
                className="nw-flow__edge-label"
                x={pos.x}
                y={pos.y}
                textAnchor={pos.anchor}
                dominantBaseline={pos.baseline}
                fontSize={12}
              >
                {label}
              </text>
            );
          })}
        </svg>
        {view && (
          <div
            className="nw-flow__tip"
            data-place={view.below ? "below" : "above"}
            data-align={view.align}
            style={{ left: `${view.left}%`, top: `${view.top}%` }}
          >
            <span className="nw-flow__tip-title">{view.title}</span>
            <span className="nw-flow__tip-row">
              <span className="nw-flow__tip-swatch" style={{ background: view.color }} />
              {view.type} · {view.detail}
            </span>
            {view.pile && <span className="nw-flow__tip-row">{view.pile}</span>}
            {view.route && <span className="nw-flow__tip-route">{view.route}</span>}
          </div>
        )}
      </div>
      <figcaption id={descId} className="nw-flow__sr">
        {model.summary.map((line, i) => (
          <span key={i}>{line} </span>
        ))}
        {hasTraffic && <span>Use the arrow keys to inspect each stream of traffic.</span>}
      </figcaption>
      <div className="nw-flow__sr" aria-live="polite">
        {view?.keyboard ? `${view.title}: ${view.type}, ${view.detail}${view.pile ? `, ${view.pile}` : ""}.` : ""}
      </div>
    </figure>
  );
}

export default FlowDiagram;
