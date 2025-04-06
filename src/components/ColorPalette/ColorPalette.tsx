import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const ColorSwatch = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  width: 100%;
  height: 100px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.5rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const ColorName = styled.span`
  color: var(--color-foreground);
  font-size: 0.875rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
`;

const ColorValue = styled.span`
  color: var(--color-foreground);
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

export const ColorPalette: React.FC = () => {
  const colors = {
    foreground: 'var(--color-foreground)',
    background: 'var(--color-background)',
    primary: 'var(--color-primary)',
    primaryDark: 'var(--color-primaryDark)',
    secondary: 'var(--color-secondary)',
    secondaryDark: 'var(--color-secondaryDark)',
    success: 'var(--color-success)',
    successDark: 'var(--color-successDark)',
    warning: 'var(--color-warning)',
    warningDark: 'var(--color-warningDark)',
    error: 'var(--color-error)',
    errorDark: 'var(--color-errorDark)',
  };

  return (
    <Container>
      {Object.entries(colors).map(([name, value]) => (
        <ColorSwatch key={name} color={value}>
          <ColorName>{name}</ColorName>
          <ColorValue>{value}</ColorValue>
        </ColorSwatch>
      ))}
    </Container>
  );
}; 