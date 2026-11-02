"use client";
import * as React from "react";
import { getProgressColor, getProgressState, getProgressText, resolveProgressLayers } from "../../../atoms/progress.js";
import type { ProgressColorRange, ProgressLayer, ProgressShape, ProgressState, ProgressTextValue } from "../../../atoms/progress.js";
import { useProgressPulse } from "../../../atoms/useProgressPulse.js";
import { ProgressText } from "../ProgressText/index.js";
import "./progress.css";

export interface ProgressProps {
  /** Accessible name and default visible caption, followed by the percentage. */
  label: string;
  shape?: ProgressShape;
  /** Scalar shortcut. Explicit layers, when supplied, are authoritative. */
  value?: number;
  min?: number;
  max?: number;
  color?: string;
  colorRanges?: readonly ProgressColorRange[];
  textColor?: string;
  text?: ProgressTextValue;
  labelPosition?: "center" | "top" | "bottom" | "left" | "right" | "none";
  segments?: number | null;
  /** Pixels for bars; degrees for radial shapes. */
  gap?: number;
  layers?: readonly ProgressLayer[];
  size?: number;
  thickness?: number;
  layerGap?: number;
  rounded?: boolean;
  pulse?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode | ((state: ProgressState) => React.ReactNode);
}
const positive = (value: number, fallback: number) => Number.isFinite(value) && value > 0 ? value : fallback;
const nonnegative = (value: number, fallback: number) => Number.isFinite(value) && value >= 0 ? value : fallback;
const attributes = (state: ProgressState, label: string, text?: string | false) => ({ role: "progressbar", "aria-label": label, "aria-valuemin": state.min, "aria-valuemax": state.max, "aria-valuenow": state.value, "aria-valuetext": text === false ? undefined : text });

export function Progress({ label, shape = "BarHorizontal", value = 0, min, max = 100, color = "var(--primary)", colorRanges,
  textColor = "var(--background)", text, labelPosition = "center", segments = 0, gap = 3, layers,
  size = 128, thickness = 16, layerGap = 3, rounded = false, pulse = true, className, style, children }: ProgressProps) {
  const scalar = getProgressState({ value, min, max });
  const resolved = resolveProgressLayers(layers ?? [{ id: "value", label, max: 100, series: [{ id: "value", label, value: scalar.percentage, color, colorRanges }] }], max, color, colorRanges);
  const state = layers === undefined ? scalar : resolved[0]?.state ?? getProgressState({ value: 0, max });
  const display = text === undefined ? `${label} ${getProgressText(state)}` : getProgressText(state, text);
  const radial = shape === "Pie" || shape === "Ring";
  const ring = shape === "Ring";
  const vertical = shape === "BarVertical";
  const count = segments && Number.isFinite(segments) && segments > 0 ? Math.min(100, Math.floor(segments)) : 0;
  const diameter = positive(size, 128);
  const radius = Math.max(1, (diameter - 6) / 2);
  const bands = Math.max(1, resolved.length - (ring ? 0 : 1));
  const spacing = Math.min(nonnegative(layerGap, 3), radius / Math.max(1, resolved.length * 2));
  const band = Math.min(positive(thickness, 16), Math.max(0.1, (radius - spacing * Math.max(0, resolved.length - 1) - 0.1) / bands));
  const root = React.useRef<HTMLDivElement>(null);
  const moving = React.useRef<HTMLSpanElement>(null);
  useProgressPulse(root, state, pulse, moving);
  const scalarColors = getProgressColor(scalar.percentage, colorRanges, color, textColor);
  const split = layers === undefined && count < 2 && !ring && labelPosition === "center" && children === undefined;
  const content = children !== undefined ? typeof children === "function" ? children(state) : children : display;
  const visible = labelPosition !== "none" && (children !== undefined || display !== false);
  const caption = <span className="nw-progress-caption" aria-hidden="true"><span>{content}</span></span>;
  return <div className={["nw-progress", `nw-progress--${shape}`, `nw-progress--label-${labelPosition}`, rounded && "nw-progress--rounded", className].filter(Boolean).join(" ")}
    style={style} {...(layers === undefined ? attributes(state, label, display) : { role: "group", "aria-label": label })}>
    <div ref={root} className="nw-progress-canvas" style={{ ...(radial ? { width: diameter, height: diameter } : {}), "--nw-progress-count": count, "--nw-progress-gap": `${nonnegative(gap, 3)}${radial ? "deg" : "px"}` } as React.CSSProperties}>
      {resolved.map((layer, index) => {
        const inset = radial ? (resolved.length - 1 - index) * (band + spacing) : 0;
        const isBand = radial && (ring || index > 0);
        return <span key={layer.id} ref={index === 0 ? moving : undefined} data-layer={layer.id}
          className={`nw-progress-layer${radial ? " nw-progress-layer--radial" : ""}${isBand ? " nw-progress-layer--band" : ""}`}
          style={{ inset, "--nw-progress-band": `${band}px`, "--nw-progress-outline": `${Math.min(positive(layer.outlineWidth ?? 3, 3), 20)}px`, opacity: Math.min(1, Math.max(0, Number.isFinite(layer.opacity ?? 1) ? layer.opacity ?? 1 : 1)) } as React.CSSProperties} aria-hidden="true">
          <span className={`nw-progress-cells${count > 1 ? " nw-progress-cells--segmented" : ""}${radial || index === 0 ? " nw-progress-cells--track" : ""}`}>
            {layer.series.map(series => <span key={series.id} data-series={series.id} data-start={series.start} data-end={series.end}
              className={`nw-progress-series nw-progress-series--${layer.appearance ?? "solid"}`}
              style={{ "--nw-progress-start": `${series.start}%`, "--nw-progress-end": `${series.end}%`, color: series.resolvedColor } as React.CSSProperties} />)}
          </span>
        </span>;
      })}
      {visible && labelPosition === "center" && (split ? <ProgressText percentage={scalar.percentage} shape={radial ? "pie" : vertical ? "vertical" : "bar"} filledColor={scalarColors.textColor}>{String(display)}</ProgressText> : caption)}
    </div>
    {visible && labelPosition !== "center" && caption}
    {layers !== undefined && <span className="nw-progress-values">
      {resolved.map((layer, index) => <span key={layer.id} role="group" aria-label={layer.label}>
        <span {...attributes(layer.state, `${layer.label} total`, index === 0 ? display : getProgressText(layer.state))} />
        {layer.series.map(series => <span key={series.id} {...attributes(getProgressState({ value: series.amount, max: layer.max }), series.label)} />)}
      </span>)}
    </span>}
  </div>;
}
