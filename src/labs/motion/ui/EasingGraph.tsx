import * as React from "react";
import styles from "./EasingGraph.module.css";

export interface EasingGraphProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}

function cubic(a: number, b: number, c: number, d: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
}

function describeCurve(y1: number, y2: number) {
  if (y1 > 1 || y2 > 1) {
    return "overshoots above the target value";
  }

  if (y1 < 0 || y2 < 0) {
    return "dips below the starting value";
  }

  if (y1 < y2) {
    return "accelerates into the target value";
  }

  if (y1 > y2) {
    return "decelerates into the target value";
  }

  return "moves evenly toward the target value";
}

export function EasingGraph({ x1, y1, x2, y2, label = "Easing curve" }: EasingGraphProps) {
  const W = 280;
  const H = 200;
  const xMin = 0;
  const xMax = 1;
  const yMin = -1;
  const yMax = 2;

  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
  const sy = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

  const p0 = { x: 0, y: 0 };
  const p1 = { x: x1, y: y1 };
  const p2 = { x: x2, y: y2 };
  const p3 = { x: 1, y: 1 };

  const path = `M ${sx(p0.x)} ${sy(p0.y)} C ${sx(p1.x)} ${sy(p1.y)} ${sx(p2.x)} ${sy(p2.y)} ${sx(p3.x)} ${sy(p3.y)}`;
  const description = `${label}: cubic bezier ${x1}, ${y1}, ${x2}, ${y2}; ${describeCurve(y1, y2)}.`;

  const y0 = sy(0);
  const y1line = sy(1);

  const samples = 40;
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = cubic(p0.x, p1.x, p2.x, p3.x, t);
    const y = cubic(p0.y, p1.y, p2.y, p3.y, t);
    pts.push({ x: sx(x), y: sy(y) });
  }

  return (
    <div className={styles.easingGraph} tabIndex={0} aria-label={description}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label={description}>
        <rect x="0" y="0" width={W} height={H} rx="14" ry="14" className={styles.eg__bg} />
        <line x1="0" y1={y0} x2={W} y2={y0} className={styles.eg__grid} />
        <line x1="0" y1={y1line} x2={W} y2={y1line} className={styles.eg__grid} />

        <line x1={sx(p0.x)} y1={sy(p0.y)} x2={sx(p1.x)} y2={sy(p1.y)} className={styles.eg__handle} />
        <line x1={sx(p3.x)} y1={sy(p3.y)} x2={sx(p2.x)} y2={sy(p2.y)} className={styles.eg__handle} />

        <path d={path} className={styles.eg__curve} />
        <circle r="5" className={styles.eg__playhead}>
          <animateMotion dur="1.6s" repeatCount="indefinite" path={path} />
        </circle>

        {pts.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r={idx % 4 === 0 ? 2.2 : 1.4} className={styles.eg__dot} />
        ))}

        <circle cx={sx(p0.x)} cy={sy(p0.y)} r="4" className={styles.eg__p} />
        <circle cx={sx(p3.x)} cy={sy(p3.y)} r="4" className={styles.eg__p} />
        <circle cx={sx(p1.x)} cy={sy(p1.y)} r="4" className={styles.eg__cp} />
        <circle cx={sx(p2.x)} cy={sy(p2.y)} r="4" className={styles.eg__cp} />

        <text x="10" y={y0 - 6} className={styles.eg__label}>
          y=0
        </text>
        <text x="10" y={y1line - 6} className={styles.eg__label}>
          y=1
        </text>
      </svg>
    </div>
  );
}
