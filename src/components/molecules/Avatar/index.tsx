import * as React from "react";
import "./avatar.css";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  label?: string; // fallback initial
  size?: number; // default 32px
  onClick?: () => void;
}

function getInitials(name?: string): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function Avatar({ src, alt, name, label, size = 32, onClick }: AvatarProps) {
  const content = src ? (
    <img className="nw-avatar__img" src={src} alt={alt || label || name || ""} />
  ) : (
    <span className="nw-avatar__fallback" aria-hidden>
      {getInitials(name || label)}
    </span>
  );

  const commonStyle: React.CSSProperties = { width: size, height: size };

  if (onClick) {
    return (
      <button
        type="button"
        className="nw-avatar"
        style={commonStyle}
        onClick={onClick}
        aria-label={alt || label || name || "Avatar"}
      >
        {content}
      </button>
    );
  }

  return (
    <span className="nw-avatar" style={commonStyle} aria-label={alt || label || name || "Avatar"}>
      {content}
    </span>
  );
}

export default Avatar;
