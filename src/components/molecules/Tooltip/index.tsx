"use client";
import * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import "./tooltip.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Trigger content. Hover, keyboard focus, or touch on this reveals the tooltip. */
  children: React.ReactNode;
  /** Tooltip body content. Accepts any node, not just plain text. */
  content: React.ReactNode;
  /** Which side of the trigger the tooltip renders on. Default: `"top"`. */
  placement?: TooltipPlacement;
  /** Delay in ms before showing on hover/focus. Default: `300`. */
  delay?: number;
  /** Delay in ms before hiding once hover/focus ends. Default: `0`. */
  hideDelay?: number;
  /** Disable the tooltip entirely; renders children unmodified. */
  disabled?: boolean;
  /** Additional class name for the trigger wrapper. */
  className?: string;
}

// How long a touch-revealed tooltip stays up before auto-dismissing.
const TOUCH_AUTO_HIDE_MS = 2500;

export function Tooltip({
  children,
  content,
  placement = "top",
  delay = 300,
  hideDelay = 0,
  disabled = false,
  className = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout>>();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const touchTimer = useRef<ReturnType<typeof setTimeout>>();

  const clearTimers = () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
    clearTimeout(touchTimer.current);
  };

  useEffect(() => clearTimers, []);

  const scheduleShow = () => {
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setOpen(true), delay);
  };

  const scheduleHide = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), hideDelay);
  };

  const handleTouchStart = () => {
    clearTimers();
    setOpen(true);
    touchTimer.current = setTimeout(() => setOpen(false), TOUCH_AUTO_HIDE_MS);
  };

  // Tapping anywhere outside dismisses a touch-revealed tooltip early.
  useEffect(() => {
    if (!open) return;
    const onDocTouch = (e: TouchEvent) => {
      const anchor = anchorRef.current;
      if (anchor && e.target instanceof Node && !anchor.contains(e.target)) {
        clearTimeout(touchTimer.current);
        setOpen(false);
      }
    };
    document.addEventListener("touchstart", onDocTouch);
    return () => document.removeEventListener("touchstart", onDocTouch);
  }, [open]);

  if (disabled) return <>{children}</>;

  return (
    <span
      ref={anchorRef}
      className={["nw-tooltip__anchor", className].filter(Boolean).join(" ")}
      aria-describedby={tooltipId}
      onMouseEnter={scheduleShow}
      onMouseLeave={scheduleHide}
      onFocus={scheduleShow}
      onBlur={scheduleHide}
      onTouchStart={handleTouchStart}
    >
      {children}
      <span
        id={tooltipId}
        role="tooltip"
        className={[
          "nw-tooltip",
          `nw-tooltip--${placement}`,
          open && "nw-tooltip--visible",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
