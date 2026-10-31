"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { ProgressState } from "./progress.js";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

/** A shape-independent squash/stretch when progress arrives at either endpoint. */
export function useProgressPulse(
  ref: RefObject<HTMLElement>,
  progress: Pick<ProgressState, "isEmpty" | "isFull">,
  enabled = true,
  motionRef?: RefObject<HTMLElement>
): void {
  const reduced = usePrefersReducedMotion();
  const boundary = progress.isEmpty ? "empty" : progress.isFull ? "full" : "active";
  const previous = useRef(boundary);

  useEffect(() => {
    const arrived = boundary !== previous.current && boundary !== "active";
    previous.current = boundary;
    const element = ref.current;
    if (!arrived || !enabled || reduced || !element?.animate) return;

    let cancelled = false;
    let animation: Animation | undefined;
    let frame: number | undefined;
    const direction = boundary === "empty" ? -1 : 1;
    const play = () => {
      if (cancelled) return;
      // Stagger the axis peaks; empty mirrors the full pulse around resting size.
      animation = element.animate([
        { transform: "scale(1, 1)", offset: 0 },
        { transform: `scale(${1 + direction * 0.025}, ${1 + direction * 0.045})`, offset: 0.24 },
        { transform: `scale(${1 + direction * 0.015}, ${1 + direction * 0.08})`, offset: 0.38 },
        { transform: `scale(${1 - direction * 0.01}, ${1 - direction * 0.025})`, offset: 0.62 },
        { transform: `scale(${1 + direction * 0.005}, ${1 + direction * 0.015})`, offset: 0.8 },
        { transform: "scale(1, 1)", offset: 1 },
      ], { duration: 520, easing: "ease-in-out" });
    };

    if (motionRef?.current && typeof window !== "undefined") {
      // Let styles commit, then follow the actual transition, including reversals
      // and consumer duration overrides, rather than guessing a timeout.
      frame = window.requestAnimationFrame(() => {
        const movements = motionRef.current?.getAnimations?.() ?? [];
        if (movements.length === 0) play();
        else void Promise.all(movements.map(movement => movement.finished)).then(play, () => {});
      });
    } else play();

    return () => {
      cancelled = true;
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      animation?.cancel();
    };
  }, [boundary, enabled, reduced, ref, motionRef]);
}
