import type { Preview } from "@storybook/react";
// import '../src/tokens/colors.css';
import './global.css';
import { withTheme } from './withTheme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        // { name: 'light', value: '#FFFF00' },
        { name: 'light', value: 'var(--color-background)' },
        { name: 'dark', value: 'var(--color-foreground)' },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [withTheme],
};

export default preview; 