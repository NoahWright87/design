import React from 'react';
import styled from '@emotion/styled';
import { Logo } from '../Logo';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: var(--color-background);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const NavItem = styled.a`
  color: var(--color-foreground);
  opacity: 0.8;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

interface HeaderProps {
  navItems?: Array<{
    label: string;
    href: string;
  }>;
}

// Changed from React.FC<HeaderProps> to a more compatible function declaration
export const Header = ({
  navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
}: HeaderProps): React.ReactElement => {
  return (
    <StyledHeader>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <Nav>
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href}>
            {item.label}
          </NavItem>
        ))}
      </Nav>
    </StyledHeader>
  );
};