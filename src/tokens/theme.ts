import { css } from '@emotion/react';
import { Theme as EmotionTheme } from '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      foreground: string;
      background: string;
      primary: string;
      primaryDark: string;
      secondary: string;
      secondaryDark: string;
      success: string;
      successDark: string;
      warning: string;
      warningDark: string;
      error: string;
      errorDark: string;
    };
  }
}

export interface Theme extends EmotionTheme {
  colors: {
    foreground: string;
    background: string;
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;
    success: string;
    successDark: string;
    warning: string;
    warningDark: string;
    error: string;
    errorDark: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    foreground: '#170017',
    background: '#FFEEFF',
    primary: '#D06000',
    primaryDark: '#C05000',
    secondary: '#963696',
    secondaryDark: '#963696',
    success: '#2E7D32',
    successDark: '#1B5E20',
    warning: '#F57C00',
    warningDark: '#E65100',
    error: '#D32F2F',
    errorDark: '#B71C1C',
  },
};

export const darkTheme: Theme = {
  colors: {
    foreground: lightTheme.colors.background,
    background: lightTheme.colors.foreground,
    primary: lightTheme.colors.primaryDark,
    primaryDark: lightTheme.colors.primary,
    secondary: lightTheme.colors.secondaryDark,
    secondaryDark: lightTheme.colors.secondary,
    success: lightTheme.colors.successDark,
    successDark: lightTheme.colors.success,
    warning: lightTheme.colors.warningDark,
    warningDark: lightTheme.colors.warning,
    error: lightTheme.colors.errorDark,
    errorDark: lightTheme.colors.error,
  },
};

export const globalStyles = css`
  :root {
    ${Object.entries(lightTheme.colors).map(([key, value]) => `--color-${key}: ${value};`).join('\n')}
  }

  .dark-theme {
    ${Object.entries(darkTheme.colors).map(([key, value]) => `--color-${key}: ${value};`).join('\n')}
  }
`;

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

// Theme provider props
export interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark';
} 