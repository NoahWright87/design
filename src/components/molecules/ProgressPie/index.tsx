import * as React from "react";
import { RadialProgress } from "../Progress/index.js";
import type { RadialProgressProps } from "../Progress/index.js";

export interface ProgressPieProps extends Omit<RadialProgressProps, "variant" | "thickness"> {}

export function ProgressPie(props: ProgressPieProps) {
  return <RadialProgress {...props} variant="pie" />;
}

export default ProgressPie;
