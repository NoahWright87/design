import * as React from "react";
import "./toggle-icon.css";

export type ToggleIconPreset =
  | "hamburger"   // ☰ → ✕
  | "moon-sun"    // 🌙 → ☀️
  | "circle"      // ○ → ●
  | "arrow"       // → ↓
  | "plus-minus"  // + → −
  | "eye"         // 👁 → 🙈
  | "play-pause"  // ▶ → ⏸
  | "mute"        // 🔊 → 🔇
  | "thumbs"      // 👍 → 👎
  | "heart"       // ♡ → ♥
  | "bookmark"    // ☆ → ★
  | "lock";       // 🔓 → 🔒

/** [offIcon, onIcon] */
const PRESET_ICONS: Record<ToggleIconPreset, [string, string]> = {
  hamburger:   ["☰", "✕"],
  "moon-sun":  ["🌙", "☀️"],
  circle:      ["○", "●"],
  arrow:       ["→", "↓"],
  "plus-minus":["＋", "−"],
  eye:         ["👁", "🙈"],
  "play-pause":["▶", "⏸"],
  mute:        ["🔊", "🔇"],
  thumbs:      ["👍", "👎"],
  heart:       ["♡", "♥"],
  bookmark:    ["☆", "★"],
  lock:        ["🔓", "🔒"],
};

/** Default aria-label for each preset state [off, on] */
const DEFAULT_LABELS: Record<ToggleIconPreset, [string, string]> = {
  hamburger:   ["Open menu", "Close menu"],
  "moon-sun":  ["Switch to dark mode", "Switch to light mode"],
  circle:      ["Select", "Deselect"],
  arrow:       ["Expand", "Collapse"],
  "plus-minus":["Add", "Remove"],
  eye:         ["Show", "Hide"],
  "play-pause":["Play", "Pause"],
  mute:        ["Unmute", "Mute"],
  thumbs:      ["Upvote", "Downvote"],
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
  const [animKey, setAnimKey] = React.useState(0);

  const currentToggled = isControlled ? isToggled : internalToggled;

  function handleClick() {
    const next = !currentToggled;
    if (!isControlled) setInternalToggled(next);
    onChange?.(next);
    setAnimKey((k) => k + 1);
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

  // Hamburger preset uses CSS-drawn lines (animates ☰ → ✕ with pure CSS)
  if (preset === "hamburger") {
    return (
      <button
        type="button"
        className={btnClass}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-pressed={currentToggled}
      >
        <span className="nw-toggle-icon__hamburger" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    );
  }

  const [offIcon, onIcon] = PRESET_ICONS[preset];
  const icon = currentToggled ? onIcon : offIcon;

  const iconClass = [
    "nw-toggle-icon__icon",
    animKey > 0 && "nw-toggle-icon__icon--animate",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={btnClass}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={currentToggled}
    >
      <span key={animKey} className={iconClass} aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

export default ToggleIcon;
