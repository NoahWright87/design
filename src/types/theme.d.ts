import { Theme } from '../tokens/theme';

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