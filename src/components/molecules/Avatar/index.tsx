import * as React from "react";
import "./avatar.css";

export interface AvatarProps {
  src?: string;
  alt?: string;
  label?: string; // fallback initial
  size?: number; // default 32px
  onClick?: () => void;
}

export function Avatar({ src, alt, label, size = 32, onClick }: AvatarProps) {
  const content = src ? (
    <img className="nw-avatar__img" src={src} alt={alt || label || ""} />
  ) : (
    <span className="nw-avatar__fallback" aria-hidden>
      {(label || "").trim().charAt(0).toUpperCase()}
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
        aria-label={alt || label || "Avatar"}
      >
        {content}
      </button>
    );
  }

  return (
    <span className="nw-avatar" style={commonStyle} aria-label={alt || label || "Avatar"}>
      {content}
    </span>
  );
}

export default Avatar;
