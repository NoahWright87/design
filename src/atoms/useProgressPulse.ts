"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { ProgressState } from "./progress.js";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

/** A shape-independent squash/stretch when progress arrives at either endpoint. */
export function useProgressPulse(
  ref: RefObject<HTMLElement>,
  progress: Pick<ProgressState, "isEmpty" | "isFull">,
  enabled = true
): void {
  const reduced = usePrefersReducedMotion();
  const boundary = progress.isEmpty ? "empty" : progress.isFull ? "full" : "active";
  const previous = useRef(boundary);

  useEffect(() => {
    const arrived = boundary !== previous.current && boundary !== "active";
    previous.current = boundary;
    const element = ref.current;
    if (!arrived || !enabled || reduced || !element?.animate) return;

    // Different peaks on each axis give the pulse its small, elastic wobble.
    const animation = element.animate([
      { transform: "scale(1, 1)", offset: 0 },
      { transform: "scale(1.035, 1.08)", offset: 0.24 },
      { transform: "scale(1.02, 1.16)", offset: 0.38 },
      { transform: "scale(0.985, 0.94)", offset: 0.62 },
      { transform: "scale(1.008, 1.035)", offset: 0.8 },
      { transform: "scale(1, 1)", offset: 1 },
    ], { duration: 520, easing: "ease-in-out" });

    return () => animation.cancel();
  }, [boundary, enabled, reduced, ref]);
}
