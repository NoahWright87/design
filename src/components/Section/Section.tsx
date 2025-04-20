import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../../tokens/ThemeProvider';

export type BackgroundColor = 'primary' | 'secondary' | 'background' | 'foreground';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Background color of the section
   * @default 'background'
   */
  bgColor?: BackgroundColor;
  /**
   * Whether to apply horizontal padding
   * @default 'normal'
   */
  gutters?: 'none' | 'small' | 'normal' | 'large';
  /**
   * Whether to show a bottom border
   * @default false
   */
  hasBottomBorder?: boolean;
}

const StyledSection = styled.section<{
  bgColor: BackgroundColor;
  gutters: 'none' | 'small' | 'normal' | 'large';
  hasBottomBorder: boolean;
}>`
  width: 100%;
  background-color: ${props => `var(--color-${props.bgColor})`};
  padding-top: 3rem;
  padding-bottom: 3rem;
  ${props => {
    switch (props.gutters) {
      case 'none':
        return '';
      case 'small':
        return 'padding-left: 1rem; padding-right: 1rem;';
      case 'normal':
        return 'padding-left: 2rem; padding-right: 2rem;';
      case 'large':
        return 'padding-left: 4rem; padding-right: 4rem;';
      default:
        return 'padding-left: 2rem; padding-right: 2rem;';
    }
  }}
  ${props => props.hasBottomBorder && `border-bottom: 1px solid var(--color-primary);`}
`;

export const Section = ({
  children,
  bgColor = 'background',
  gutters = 'normal',
  hasBottomBorder = false,
  ...rest
}: SectionProps): React.ReactElement => {
  return (
    <StyledSection 
      bgColor={bgColor} 
      gutters={gutters} 
      hasBottomBorder={hasBottomBorder}
      {...rest}
    >
      {children}
    </StyledSection>
  );
};
