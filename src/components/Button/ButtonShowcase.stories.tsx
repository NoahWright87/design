import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ButtonShowcase } from './ButtonShowcase';
import { ThemeProvider } from '../../tokens/ThemeProvider';

const meta = {
  title: 'Components/Button/Showcase',
  component: ButtonShowcase,
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ButtonShowcase>;

export default meta;
type Story = StoryObj<typeof ButtonShowcase>;

export const Default: Story = {}; 