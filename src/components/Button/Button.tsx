import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export interface ButtonProps {
  /**
   * The content of the button
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * The variant of the button
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  /**
   * The size of the button
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

const baseStyles = css`
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent;
  font-family: inherit;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(0);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    transition: all 0.1s ease-in-out;
  }
`;

const getVariantStyles = (variant: string) => ({
  primary: css`
    background-color: var(--color-primary);
    color: var(--color-background);

    &:hover:not(:disabled) {
      color: var(--color-foreground);
      border-color: var(--color-foreground);
    }
  `,
  secondary: css`
    background-color: var(--color-secondary);
    color: var(--color-background);

    &:hover:not(:disabled) {
      color: var(--color-foreground);
      border-color: var(--color-foreground);
    }
  `,
  outline: css`
    background-color: transparent;
    border-color: var(--color-primary);
    color: var(--color-primary);

    &:hover:not(:disabled) {
      color: var(--color-foreground);
      border-color: var(--color-foreground);
    }
  `,
  success: css`
    background-color: var(--color-success);
    color: var(--color-background);

    &:hover:not(:disabled) {
      color: var(--color-foreground);
      border-color: var(--color-foreground);
    }
  `,
  warning: css`
    background-color: var(--color-warning);
    color: var(--color-background);

    &:hover:not(:disabled) {
      color: var(--color-foreground);
      border-color: var(--color-foreground);
    }
  `,
  error: css`
    background-color: var(--color-error);
    color: var(--color-background);

    &:hover:not(:disabled) {
      color: var(--color-foreground);
      border-color: var(--color-foreground);
    }
  `,
}[variant]);

const sizeStyles = {
  small: css`
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  `,
  medium: css`
    padding: 0.5rem 1rem;
    font-size: 1rem;
  `,
  large: css`
    padding: 0.75rem 1.5rem;
    font-size: 1.25rem;
  `,
};

const StyledButton = styled.button<{ styles: any }>`
  ${props => props.styles}
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  const styles = [baseStyles, getVariantStyles(variant), sizeStyles[size]];

  return (
    <StyledButton
      styles={styles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
}; 