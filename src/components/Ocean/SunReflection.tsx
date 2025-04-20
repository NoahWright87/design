import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const animationSpeed = 5; // seconds
const rippleCount = 20; // Number of ripples
const ripppleDistance = 30; // Distance ripples travel
const rippleDistanceVariance = 5; // Variance in distance
const wobbleWidth = 5;


// Animation keyframe
const ripple = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0px) scaleX(1);
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    transform: translateY(40px) scaleX(0.0);
  }
`;

function randomRipple() {
    const endY = (ripppleDistance - rippleDistanceVariance) + Math.random() * 2 * rippleDistanceVariance;
    const randomX1 = -wobbleWidth + 2 * Math.random() * wobbleWidth;
    const randomX2 = -wobbleWidth + 2 * Math.random() * wobbleWidth;
    const randomX3 = -wobbleWidth + 2 * Math.random() * wobbleWidth;
    const randomX4 = -wobbleWidth + 2 * Math.random() * wobbleWidth;

    return keyframes`
    0% {
        opacity: 1;
        transform: translateY(0px) scaleX(1) translateX($0px);
    }
    25% {
        transform: translateY(${endY * .25}px) scaleX(0.80) translateX(${randomX1}px);
    }
    50% {
        transform: translateY(${endY * .50}px) scaleX(0.6) translateX(${randomX2}px);
    }
    75% {
        transform: translateY(${endY * .75}px) scaleX(0.40) translateX(${randomX3}px);
    }
    100% {
        opacity: 0;
        transform: translateY(${endY}px) scaleX(0.20) translateX(${randomX4}px); );
    }
    `;
}


const horizontalWobbles = [
    keyframes`
    0% {
        transform: translateX(0px);
    }
    50% {
        transform: translateX(-10px);
    }
    100% {
        transform: translateX(0px);
    }
    `,
    keyframes`
    0% {
        transform: translateX(0px);
    }
    50% {
        transform: translateX(10px);
    }
    100% {
        transform: translateX(0px);
    }
    `,
    

]

// Styled SVG container
const ReflectionSvg = styled.svg`
  width: 100%;
  height: 100%;
    position: absolute;
    bottom: -170px;
    left: -140px;
`;

// Styled reflection rectangle
const ReflectionRect = styled.rect<{ animDelay: number; rectWidth: number; animation: ReturnType<typeof keyframes> }>`
    animation: ${props => props.animation} ${animationSpeed}s linear ${props => props.animDelay}s infinite;
    transform-origin: center;
    fill: var(--color-primary);
    width: ${props => props.rectWidth}px;
    height: 1px;
`;

// Sun circle
const SunCircle = styled.circle`
    fill: var(--color-primary);
    clip-path: polygon(0% 50%, 100% 50%, 100% 0%, 0% 0%);
`;

const SunCircleReflection = styled.circle`
    fill: var(--color-primary);
    opacity: 0.5;
    clip-path: polygon(0% 50%, 100% 50%, 100% 0%, 0% 0%);
`;

// SunReflection component
export const SunReflection = (): React.ReactElement => {
  const reflections = Array.from({ length: rippleCount }, (_, i) => ({
    delay: (i * animationSpeed) / rippleCount + Math.random() * 1.5, // Random delay for each reflection
    x: 80,
    width: 40,
    animation: randomRipple(),
}));

  return (
    <ReflectionSvg viewBox="0 0 200 100">
      {/* Sun */}
      <SunCircle cx="50%" cy="20" r="20" />

      {/* Reflections */}
      {/*}
      {reflections.map((r, i) => (
        <ReflectionRect
          key={i}
          x={r.x}
          y={20}
          animDelay={r.delay}
          rectWidth={r.width}
          animation={r.animation} 
        />
      ))}
        */}
    </ReflectionSvg>
  );
};
