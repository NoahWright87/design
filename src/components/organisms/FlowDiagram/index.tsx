"use client";
import * as React from "react";
import { usePrefersReducedMotion } from "../../../atoms/usePrefersReducedMotion.js";
import { cssColor } from "./dots.js";
import { FlowEngine, type EngineModel } from "./engine.js";
import { buildEdges, type EdgeGeometry, type Pt } from "./geometry.js";
import { FONT_SIZE, normalize, placeNodes, type PlacedNode } from "./layout.js";
import { parseFlowDiagram } from "./parse.js";
import type { FlowDiagramData, FlowDiagramLayout, FlowEdge } from "./types.js";
import "./flowDiagram.css";

export * from "./types.js";
export { parseFlowDiagram, parseFlowTokens } from "./parse.js";
export { BUILTIN_DOT_TYPES } from "./dots.js";

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
  summary: string[];
}

function describeEdge(e: FlowEdge, names: Map<string, string>): string {
  const from = names.get(e.from) ?? e.from;
  const to = names.get(e.to) ?? e.to;
  const parts = (e.flows ?? []).map((f) => {
    const dir = f.reverse ? ` from ${to} back to ${from}` : "";
    const pile = f.pile ? `, up to ${f.pile} waiting` : "";
    return `${f.type} ${f.dpm ?? 60} per minute${dir}${pile}`;
  });
  const label = e.label ? ` (${e.label})` : "";
  return `${from} to ${to}${label}${parts.length ? `: ${parts.join("; ")}` : ""}.`;
}

function buildModel(data: FlowDiagramData, layout?: FlowDiagramLayout): Model {
  const diagram = normalize(data);
  const placement = placeNodes(diagram, layout);
  const edges = buildEdges(diagram.edges, placement.byId);

  // Fit the view to nodes, curved edges and labels.
  let { x, y, w, h } = placement.bounds;
  let x2 = x + w;
  let y2 = y + h;
  const pad = 16;
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

/**
 * A flowchart whose edges can carry streams of moving, color-coded dots.
 * Lines sit at the bottom, dots travel above the lines, and symbols sit on top,
 * so dots appear from under one node and slip under the next.
 */
export function FlowDiagram({
  source,
  diagram,
  layout,
  speed = 70,
  dotSize = 4,
  paused = false,
  title = "Flow diagram",
  className,
  style,
}: FlowDiagramProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const controls = React.useRef<{ sync: () => void } | null>(null);
  const flags = React.useRef({ paused, reduced });
  flags.current = { paused, reduced };
  const descId = React.useId();

  // Keyed on content, so inline objects re-created on every render keep the animation running.
  const key = `${source ?? ""}\u0000${JSON.stringify(diagram ?? null)}\u0000${JSON.stringify(layout ?? null)}`;
  const model = React.useMemo(
    () => buildModel(diagram ?? (source ? parseFlowDiagram(source) : { edges: [] }), layout),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const engine = new FlowEngine(canvas, model.engine, { speed, dotSize });
    if (!engine.hasDots) return;
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
    };
  }, [model, speed, dotSize]);

  React.useEffect(() => {
    controls.current?.sync();
  }, [paused, reduced]);

  const { x, y, w, h } = model.engine.viewBox;
  const viewBox = `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;

  return (
    <figure
      className={["nw-flow", className].filter(Boolean).join(" ")}
      style={{ maxWidth: `${Math.ceil(w)}px`, ...style }}
    >
      <div className="nw-flow__stage" role="img" aria-label={title} aria-describedby={descId}>
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
          {model.edges
            .filter((geo) => geo.edge.label)
            .map((geo, i) => {
              const label = geo.edge.label!;
              const lw = label.length * 6.6 + 12;
              return (
                <g key={i}>
                  <rect
                    className="nw-flow__edge-label-bg"
                    x={geo.mid.x - lw / 2}
                    y={geo.mid.y - 10}
                    width={lw}
                    height={20}
                    rx={4}
                  />
                  <text
                    className="nw-flow__edge-label"
                    x={geo.mid.x}
                    y={geo.mid.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>
      <figcaption id={descId} className="nw-flow__summary">
        {model.summary.map((line, i) => (
          <span key={i}>{line} </span>
        ))}
      </figcaption>
    </figure>
  );
}

export default FlowDiagram;
