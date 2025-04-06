import React from 'react';
import { useGlobals } from '@storybook/preview-api';
import { Decorator } from '@storybook/react';

export const withTheme: Decorator = (Story, context) => {
  const [{ theme }] = useGlobals();
  
  React.useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);
  
  return <Story {...context} />;
}; 