import * as React from "react";
import "./image.css";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Aspect ratio (e.g., '16/9', '4/3', '1/1'). Defaults to maintain natural aspect ratio. */
  aspectRatio?: string;
  /** Object-fit CSS property */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /** Border radius (circular, rounded, or none) */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function Image({
  src,
  alt,
  aspectRatio,
  objectFit = 'cover',
  rounded = 'md',
  className = '',
  style,
  ...props
}: ImageProps) {
  const roundedClass = rounded !== 'none' ? `nw-image--rounded-${rounded}` : '';
  
  const combinedStyle: React.CSSProperties = {
    ...style,
    aspectRatio: aspectRatio || undefined,
    objectFit,
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`nw-image ${roundedClass} ${className}`.trim()}
      style={combinedStyle}
      {...props}
    />
  );
}

export default Image;
