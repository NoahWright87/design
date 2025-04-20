/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

const logoStyles = css`
  width: 40px;
  height: 40px;
  display: inline-block;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const Logo = (): React.ReactElement => {
  return (
    <div css={logoStyles}>
        {/* TODO: Create a better logo later */}
        <svg viewBox="0 0 100 100" width="80" height="80">
            <path d="
                M10 90 L30 10 
                M40 90 L60 10
                M70 90 L90 10
                " 
                stroke="var(--color-primary)"
                strokeWidth="6"
                fill="none"
                />
            <path d="
                M20 40 L40 90 
                M50 40 L70 90 
            "
                stroke="var(--color-secondary)"
                strokeWidth="6" 
                fill="none"
            />
        </svg>
    </div>
  );
}; 