import * as React from "react";
import { RadialProgress } from "../Progress/index.js";
import type { RadialProgressProps } from "../Progress/index.js";

export interface ProgressRingProps extends Omit<RadialProgressProps, "variant"> {}

export function ProgressRing(props: ProgressRingProps) {
  return <RadialProgress {...props} variant="ring" />;
}

export default ProgressRing;
