import * as React from "react";
import "./toggle-icon.css";

export type ToggleIconPreset =
  | "hamburger"   // Menu → close
  | "moon-sun"    // Sun → crescent (true means dark mode)
  | "circle"      // ○ → ●
  | "arrow"       // → ↓
  | "plus-minus"  // + → −
  | "eye"         // Visible → hidden
  | "play-pause"  // ▶ → ⏸
  | "mute"        // Muted → audible
  | "thumbs"      // 👍 → 👎
  | "heart"       // ♡ → ♥
  | "bookmark"    // Outline → filled bookmark
  | "lock";       // 🔓 → 🔒

/** Default aria-label for each preset state [off, on] */
const DEFAULT_LABELS: Record<ToggleIconPreset, [string, string]> = {
  hamburger:   ["Open menu", "Close menu"],
  "moon-sun":  ["Switch to dark mode", "Switch to light mode"],
  circle:      ["Select", "Deselect"],
  arrow:       ["Expand", "Collapse"],
  "plus-minus":["Add", "Remove"],
  eye:         ["Hide", "Show"],
  "play-pause":["Play", "Pause"],
  mute:        ["Unmute", "Mute"],
  thumbs:      ["Downvote", "Upvote"],
  heart:       ["Like", "Unlike"],
  bookmark:    ["Save", "Unsave"],
  lock:        ["Lock", "Unlock"],
};

export interface ToggleIconProps {
  /** Built-in icon pair. */
  preset: ToggleIconPreset;
  /** Controlled toggled state. */
  isToggled?: boolean;
  /** Uncontrolled initial state. */
  defaultToggled?: boolean;
  /** Called with the new toggled value after each click. */
  onChange?: (toggled: boolean) => void;
  /**
   * Accessible button label. Defaults to the preset's built-in label
   * for the current state (e.g. "Open menu" / "Close menu").
   */
  label?: string;
  /** Icon size. @default "md" */
  size?: "sm" | "md" | "lg";
}

function IconGeometry({ preset, maskId }: { preset: ToggleIconPreset; maskId: string }) {
  switch (preset) {
    case "hamburger": return <>
      <path className="nw-icon__menu-top" d="M4 6H20" />
      <path className="nw-icon__menu-middle" d="M4 12H20" />
      <path className="nw-icon__menu-bottom" d="M4 18H20" />
    </>;
    case "moon-sun": return <>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: "luminance" }}>
          <rect width="24" height="24" fill="white" stroke="none" />
          <circle className="nw-icon__moon-cutout" cx="24" cy="0" r="6" fill="black" stroke="none" />
        </mask>
      </defs>
      <g className="nw-icon__celestial">
        <circle className="nw-icon__sun-disc" cx="12" cy="12" r="6" mask={`url(#${maskId})`} fill="currentColor" stroke="none" />
        <g className="nw-icon__rays">
          {Array.from({ length: 8 }, (_, i) => <path key={i} d="M12 2V3.5" transform={`rotate(${i * 45} 12 12)`} />)}
        </g>
      </g>
    </>;
    case "circle": return <circle className="nw-icon__fill" cx="12" cy="12" r="8" />;
    case "arrow": return <g className="nw-icon__arrow"><path d="M4 12H20M13 5L20 12L13 19" /></g>;
    case "plus-minus": return <><path d="M5 12H19" /><path className="nw-icon__plus" d="M12 5V19" /></>;
    case "eye": return <>
      <path d="M2 12C6 4 18 4 22 12C18 20 6 20 2 12Z" />
      <circle className="nw-icon__pupil" cx="12" cy="12" r="3" />
      <path className="nw-icon__slash" pathLength="1" d="M3 3L21 21" />
    </>;
    case "play-pause": return <g fill="currentColor" strokeLinejoin="round">
      <path className="nw-icon__play-left" d="M6 4L12 8L12 16L6 20Z" />
      <path className="nw-icon__play-right" d="M12 8L20 12L20 12L12 16Z" />
    </g>;
    case "mute": return <>
      <path d="M3 9H7L12 5V19L7 15H3Z" />
      <g className="nw-icon__sound"><path d="M16 8C18 10 18 14 16 16" /><path d="M19 5C23 9 23 15 19 19" /></g>
      <g className="nw-icon__muted"><path d="M16 9L22 15M22 9L16 15" /></g>
    </>;
    case "thumbs": return <g className="nw-icon__thumb"><path d="M7 10L11 3C12 1 15 3 14 6L13 9H19C21 9 21 11 20.5 13L19 19C18.8 20 18 21 17 21H7ZM3 10H7V21H3Z" /></g>;
    case "heart": return <path className="nw-icon__fill nw-icon__favorite" d="M20.5 5.5C18 3 14 4 12 7C10 4 6 3 3.5 5.5C0 9 3 14 12 21C21 14 24 9 20.5 5.5Z" />;
    case "bookmark": return <path className="nw-icon__fill nw-icon__favorite" d="M6 3H18V21L12 17L6 21Z" />;
    case "lock": return <>
      <path className="nw-icon__shackle" d="M8 11V7A4 4 0 0 1 16 7V11" />
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M12 15V17" />
    </>;
  }
}

export function ToggleIcon({
  preset,
  isToggled,
  defaultToggled = false,
  onChange,
  label,
  size = "md",
}: ToggleIconProps) {
  const isControlled = isToggled !== undefined;
  const [internalToggled, setInternalToggled] = React.useState(defaultToggled);
  const maskId = `nw-icon-moon-${React.useId().replace(/:/g, "")}`;

  const currentToggled = isControlled ? isToggled : internalToggled;

  function handleClick() {
    const next = !currentToggled;
    if (!isControlled) setInternalToggled(next);
    onChange?.(next);
  }

  const [offLabel, onLabel] = DEFAULT_LABELS[preset];

  const ariaLabel = label ?? (currentToggled ? onLabel : offLabel);

  const btnClass = [
    "nw-toggle-icon",
    `nw-toggle-icon--${size}`,
    currentToggled && "nw-toggle-icon--open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={btnClass}
      data-preset={preset}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={currentToggled}
      aria-expanded={preset === "hamburger" ? currentToggled : undefined}
    >
      <svg className="nw-toggle-icon__svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <IconGeometry preset={preset} maskId={maskId} />
      </svg>
    </button>
  );
}

export default ToggleIcon;
