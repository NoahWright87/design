import React from 'react';
import styled from '@emotion/styled';

const StyledFooter = styled.footer`
  background-color: var(--color-background);
  color: var(--color-foreground);
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--color-primary);
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

const FooterLink = styled.a`
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--color-primaryDark);
  }
`;

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <FooterText>
        Made with ❤️ by{' '}
        <FooterLink href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
          Your Name
        </FooterLink>
      </FooterText>
    </StyledFooter>
  );
};

export default Footer; 