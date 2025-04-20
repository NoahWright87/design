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

export const Footer = (): React.ReactElement => {
  return (
    <StyledFooter>
      <FooterText>
        <FooterLink href="https://github.com/NoahWright87" target="_blank" rel="noopener noreferrer">
          &copy; {new Date().getFullYear()} Noah Wright
        </FooterLink>
      </FooterText>
    </StyledFooter>
  );
};

export default Footer; 