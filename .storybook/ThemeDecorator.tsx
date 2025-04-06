import React from 'react';
import { ThemeProvider } from '../src/tokens/ThemeProvider';
import { Global } from '@emotion/react';
import { globalStyles } from '../src/tokens/theme';

export const ThemeDecorator = (Story: React.ComponentType, context: any) => {
  const isDark = context.globals.theme === 'dark';

  return (
    <ThemeProvider initialTheme={isDark ? 'dark' : 'light'}>
      <Global styles={globalStyles} />
      <Story {...context} />
    </ThemeProvider>
  );
}; 