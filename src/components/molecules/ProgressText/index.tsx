import * as React from "react";
import { getProgressState } from "../../../atoms/progress.js";
import "./progressText.css";

export interface ProgressTextProps {
  percentage: number;
  children: string;
  filledColor?: string;
  trackColor?: string;
  shape?: "bar" | "pie";
}

/** Position inside an indicator's relative container, sharing its fill percentage. */
export function ProgressText({
  percentage,
  children,
  filledColor = "var(--background)",
  trackColor = "var(--foreground)",
  shape = "bar",
}: ProgressTextProps) {
  const fill = getProgressState({ value: percentage }).percentage;
  return (
    <span
      className={`nw-progress-text${shape === "pie" ? " nw-progress-text--pie" : ""}`}
      style={shape === "pie" ? { "--nw-progress-angle": `${fill * 3.6}deg` } as React.CSSProperties : undefined}
      aria-hidden="true"
    >
      <span style={{ color: trackColor, clipPath: shape === "bar" ? `inset(0 0 0 ${fill}%)` : undefined }}>{children}</span>
      <span style={{ color: filledColor, clipPath: shape === "bar" ? `inset(0 ${100 - fill}% 0 0)` : undefined }}>{children}</span>
    </span>
  );
}
