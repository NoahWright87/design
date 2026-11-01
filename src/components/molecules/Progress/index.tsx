"use client";
import * as React from "react";
import { getProgressColor, getProgressState, getProgressText } from "../../../atoms/progress.js";
import type { ProgressIndicatorProps, ProgressLayerOptions, ProgressState } from "../../../atoms/progress.js";
import { useProgressPulse } from "../../../atoms/useProgressPulse.js";
import { ProgressText } from "../ProgressText/index.js";
import "./progress.css";

export interface ProgressPresentationProps extends ProgressIndicatorProps {
  className?: string;
  style?: React.CSSProperties;
  /** Decorative custom content replaces the default visible text. */
  children?: React.ReactNode | ((progress: ProgressState) => React.ReactNode);
}

export interface LinearProgressProps extends ProgressPresentationProps {
  orientation?: "horizontal" | "vertical";
  rounded?: boolean;
  /** Visual divisions; fractional cells preserve the exact percentage. */
  segments?: number;
  gap?: number;
}

export interface RadialProgressProps extends ProgressPresentationProps {
  variant?: "pie" | "ring";
  size?: number;
  thickness?: number;
}

interface ProgressBaseProps extends LinearProgressProps, RadialProgressProps {
  geometry: "linear" | "radial";
}

const positive = (value: number | undefined, fallback: number) => value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;

function progressAttributes(progress: ProgressState, label: string, text?: string | false) {
  return {
    role: "progressbar",
    "aria-label": label,
    "aria-valuemin": progress.min,
    "aria-valuemax": progress.max,
    "aria-valuenow": progress.value,
    "aria-valuetext": text === false ? undefined : text,
  };
}

/** All geometry wrappers share value resolution, layering, semantics and motion. */
function ProgressBase({
  geometry, value, min, max, label, text, color = "var(--primary)",
  textColor = "var(--background)", colorRanges, pulse = true, layers = [],
  orientation = "horizontal", rounded = false, segments = 1, gap = 3,
  variant = "pie", size = 128, thickness = 16, className, style, children,
}: ProgressBaseProps) {
  const progress = getProgressState({ value, min, max });
  const colors = getProgressColor(progress.percentage, colorRanges, color, textColor);
  const display = getProgressText(progress, text);
  const diameter = positive(size, 128);
  const ringWidth = Math.min(positive(thickness, 16), Math.max(1, (diameter - 6) / 2 - 1));
  const count = Math.min(100, Math.max(1, Math.floor(positive(segments, 1))));
  const spacing = Number.isFinite(gap) && gap >= 0 ? gap : 3;
  const radial = geometry === "radial";
  const vertical = !radial && orientation === "vertical";
  const ring = radial && variant === "ring";
  const divided = !radial && count > 1;
  const root = React.useRef<HTMLDivElement>(null);
  const fill = React.useRef<HTMLSpanElement>(null);
  useProgressPulse(root, progress, pulse, fill);

  // Stable IDs preserve each layer's transition through reordering; first ID wins.
  const unique = new Map<string, ProgressLayerOptions>();
  for (const layer of layers) if (!unique.has(layer.id)) unique.set(layer.id, layer);
  const auxiliary = [...unique.values()];
  const grouped = auxiliary.length > 0;
  const plate = grouped || divided;
  const fillClass = radial ? "nw-progress-pie__fill" : "nw-progress-bar__fill";

  const paint = (state: ProgressState, fillColor: string, layer?: ProgressLayerOptions) => {
    const band = layer?.thickness !== undefined || layer?.placement === "over";
    const bandWidth = positive(layer?.thickness, 6);
    const surfaceStyle: React.CSSProperties = radial
      ? { "--nw-progress-band": `${band ? Math.min(bandWidth, ring ? ringWidth : diameter / 2) : ringWidth}px` } as React.CSSProperties
      : band ? { clipPath: vertical ? `inset(0 0 0 max(0px, calc(100% - ${bandWidth}px)))` : `inset(0 0 max(0px, calc(100% - ${bandWidth}px)) 0)` } : {};
    const fillStyle: React.CSSProperties = radial
      ? { "--nw-progress-angle": `${state.percentage * 3.6}deg`, color: fillColor } as React.CSSProperties
      : { [vertical ? "height" : "width"]: `${state.percentage}%`, backgroundColor: fillColor };
    return <span
      key={layer ? `layer:${layer.id}` : "primary"}
      className={`nw-progress-surface${radial && (ring || band) ? " nw-progress-surface--band" : ""}`}
      style={surfaceStyle}
      data-progress-layer={layer?.id ?? "primary"}
      aria-hidden="true"
    >
      <span ref={layer ? undefined : fill} className={fillClass} style={fillStyle} />
    </span>;
  };
  const paintLayer = (layer: ProgressLayerOptions) => {
    const state = getProgressState(layer);
    return paint(state, getProgressColor(state.percentage, layer.colorRanges, layer.color ?? color).color, layer);
  };
  const classes = [
    "nw-progress", radial ? "nw-progress-pie" : "nw-progress-bar",
    vertical && "nw-progress--vertical", ring && "nw-progress--ring",
    divided && "nw-progress--segmented", rounded && !radial && "nw-progress-bar--rounded", className,
  ].filter(Boolean).join(" ");
  const rootStyle = {
    ...(radial ? { width: diameter, height: diameter } : {}),
    "--nw-progress-band": `${ringWidth}px`,
    "--nw-progress-segments": count,
    "--nw-progress-gap": `${spacing}px`,
    ...style,
  } as React.CSSProperties;

  return <div ref={root} className={classes} style={rootStyle}
    {...(grouped ? { role: "group", "aria-label": label } : progressAttributes(progress, label, display))}>
    <span className={`nw-progress-track${ring ? " nw-progress-surface--band" : ""}`} aria-hidden="true" />
    {auxiliary.filter(layer => layer.placement !== "over").map(paintLayer)}
    {paint(progress, colors.color)}
    {auxiliary.filter(layer => layer.placement === "over").map(paintLayer)}
    {children !== undefined
      ? <span className="nw-progress-content" aria-hidden="true">{typeof children === "function" ? children(progress) : children}</span>
      : display !== false && (plate
        ? <span className="nw-progress-label" aria-hidden="true"><span>{display}</span></span>
        : <ProgressText shape={radial ? "pie" : vertical ? "vertical" : "bar"} percentage={ring ? 0 : progress.percentage} filledColor={colors.textColor}>{display}</ProgressText>)}
    {grouped && <span className="nw-progress-values">
      <span {...progressAttributes(progress, label, display)} />
      {auxiliary.map(layer => <span key={layer.id} {...progressAttributes(getProgressState(layer), layer.label)} />)}
    </span>}
  </div>;
}

/** Public composable base for bars in either orientation and segmented meters. */
export function LinearProgress(props: LinearProgressProps) {
  return <ProgressBase {...props} geometry="linear" />;
}

/** Public composable base for solid pies and rings. */
export function RadialProgress(props: RadialProgressProps) {
  return <ProgressBase {...props} geometry="radial" />;
}
