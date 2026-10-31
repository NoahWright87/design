"use client";
import * as React from "react";
import { getProgressColor, getProgressState, getProgressText } from "../../../atoms/progress.js";
import type { ProgressIndicatorProps } from "../../../atoms/progress.js";
import { useProgressPulse } from "../../../atoms/useProgressPulse.js";
import { ProgressText } from "../ProgressText/index.js";
import "./progressPie.css";

export interface ProgressPieProps extends ProgressIndicatorProps {
  /** Diameter in CSS pixels. Defaults to 128. */
  size?: number;
}

export function ProgressPie({
  value,
  min,
  max,
  label,
  text,
  size = 128,
  color = "var(--primary)",
  textColor = "var(--background)",
  colorRanges,
  pulse = true,
}: ProgressPieProps) {
  const progress = getProgressState({ value, min, max });
  const colors = getProgressColor(progress.percentage, colorRanges, color, textColor);
  const display = getProgressText(progress, text);
  const diameter = Number.isFinite(size) && size > 0 ? size : 128;
  const ref = React.useRef<HTMLDivElement>(null);
  const fillRef = React.useRef<HTMLSpanElement>(null);
  useProgressPulse(ref, progress, pulse, fillRef);

  return (
    <div
      ref={ref}
      className="nw-progress-pie"
      style={{ width: diameter, height: diameter }}
      role="progressbar"
      aria-label={label}
      aria-valuemin={progress.min}
      aria-valuemax={progress.max}
      aria-valuenow={progress.value}
      aria-valuetext={display === false ? undefined : display}
    >
      <span
        ref={fillRef}
        className="nw-progress-pie__fill"
        style={{ "--nw-progress-angle": `${progress.percentage * 3.6}deg`, color: colors.color } as React.CSSProperties}
      />
      {display !== false && <ProgressText shape="pie" percentage={progress.percentage} filledColor={colors.textColor}>{display}</ProgressText>}
    </div>
  );
}

export default ProgressPie;
