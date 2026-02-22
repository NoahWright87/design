import * as React from "react";

/**
 * Plays a waggle (side-to-side shake) animation on `ref` whenever
 * `trigger` transitions from falsy → truthy.
 */
export function useWaggle(
  trigger: string | undefined,
  ref: React.RefObject<HTMLElement | null>
): void {
  const prev = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    const appeared = !!trigger && !prev.current;
    prev.current = trigger;
    if (!appeared || !ref.current) return;

    const el = ref.current;
    el.classList.remove("nw-waggling");
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add("nw-waggling");

    const cleanup = () => el.classList.remove("nw-waggling");
    el.addEventListener("animationend", cleanup, { once: true });
  }, [trigger, ref]);
}
