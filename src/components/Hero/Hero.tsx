import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Section, SectionProps } from '../Section/Section';

export type ImageAlignment = 'left' | 'right';

export interface HeroProps extends Omit<SectionProps, 'gutters' | 'hasBottomBorder'> {
  /**
   * Image to display in the hero section
   */
  image?: string;
  /**
   * Alt text for the image
   */
  imageAlt?: string;
  /**
   * Position of the image, either left or right
   * @default 'right'
   */
  imageAlignment?: ImageAlignment;
  /**
   * Whether to show bottom border
   * @default true
   */
  hasBottomBorder?: boolean;
}

const StyledHeroContent = styled.div<{ imageAlignment: ImageAlignment }>`
  display: flex;
  flex-direction: ${props => props.imageAlignment === 'left' ? 'row' : 'row-reverse'};
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1.5rem;
  }
`;

export const Hero: React.FC<HeroProps> = ({
  children,
  image,
  imageAlt = '',
  imageAlignment = 'right',
  bgColor = 'secondary',
  hasBottomBorder = true,
  ...sectionProps
}) => {
  return (
    <Section 
      gutters="none" 
      bgColor={bgColor} 
      hasBottomBorder={hasBottomBorder}
      {...sectionProps}
    >
      <StyledHeroContent imageAlignment={imageAlignment}>
        <ContentContainer>
          {children}
        </ContentContainer>
        {image && (
          <ImageContainer>
            <img src={image} alt={imageAlt} />
          </ImageContainer>
        )}
      </StyledHeroContent>
    </Section>
  );
};
