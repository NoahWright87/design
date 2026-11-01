import * as React from "react";
import { getProgressState } from "../../../atoms/progress.js";
import "./progressText.css";

export interface ProgressTextProps {
  percentage: number;
  children: string;
  filledColor?: string;
  trackColor?: string;
  shape?: "bar" | "vertical" | "pie";
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
  const trackClip = shape === "vertical" ? `inset(0 0 ${fill}% 0)` : `inset(0 0 0 ${fill}%)`;
  const fillClip = shape === "vertical" ? `inset(${100 - fill}% 0 0 0)` : `inset(0 ${100 - fill}% 0 0)`;
  return (
    <span
      className={`nw-progress-text${shape === "pie" ? " nw-progress-text--pie" : ""}`}
      style={shape === "pie" ? { "--nw-progress-angle": `${fill * 3.6}deg` } as React.CSSProperties : undefined}
      aria-hidden="true"
    >
      <span style={{ color: trackColor, clipPath: shape === "pie" ? undefined : trackClip }}>{children}</span>
      <span style={{ color: filledColor, clipPath: shape === "pie" ? undefined : fillClip }}>{children}</span>
    </span>
  );
}
