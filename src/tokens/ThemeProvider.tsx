import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme, Theme } from './theme';
import { Global } from '@emotion/react';
import { globalStyles } from './theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark' | Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = lightTheme }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof initialTheme === 'string') {
      return initialTheme === 'dark' ? darkTheme : lightTheme;
    }
    return initialTheme;
  });

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <EmotionThemeProvider theme={theme}>
        <Global styles={globalStyles} />
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
}; 