import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { SunReflection } from './SunReflection';

interface OceanProps {
  /**
   * Height of the ocean component
   */
  height?: string;
  /**
   * Width of the ocean component (defaults to 100%)
   */
  width?: string;
}

const OceanContainer = styled.div<{ height: string; width: string }>`
    position: relative;
    height: ${props => props.height};
    width: ${props => props.width};
    background: linear-gradient(to bottom, var(--color-background) 85%, var(--color-primaryDark) 150%);
    overflow: hidden;
`;

const Sun = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-primary);
  bottom: -50px;
  left: 10px;
  opacity: 0.9;
  box-shadow: 0 0 50px var(--color-primary);
`;

const Wave = styled.div<{ delay: string; animationDuration: string }>`
  position: absolute;
  width: 200%;
  height: 100%;
  background-color: var(--color-background);
  bottom: 0;
  left: 0;
  opacity: 0.8;
  border-radius: 100%;
  animation: wave ${props => props.animationDuration} ease-in-out infinite;
  animation-delay: ${props => props.delay};
  transform: translateX(0) translateZ(0) scaleY(1);

  @keyframes wave {
    0% {
      transform: translateX(0) translateZ(0) scaleY(1);
    }
    50% {
      transform: translateX(-25%) translateZ(0) scaleY(0.8);
    }
    100% {
      transform: translateX(-50%) translateZ(0) scaleY(1);
    }
  }
`;

export const Ocean = ({ 
  height = '200px',
  width = '100%'
}: OceanProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Optional: Add responsive behavior or interaction effects
  useEffect(() => {
    const container = containerRef.current;
    
    // You could add event listeners or additional animations here
    
    return () => {
      // Clean up any listeners or animations
    };
  }, []);

  return ( <>
    <OceanContainer ref={containerRef} height={height} width={width}>
      <Sun />
      {/* <Wave delay="0s" animationDuration="7s" /> */}
      {/* <Wave delay="-2s" animationDuration="9s" /> */}
      {/* <Wave delay="-4s" animationDuration="11s" /> */}
    </OceanContainer>
      <SunReflection />
  </>
  );
};

export default Ocean;