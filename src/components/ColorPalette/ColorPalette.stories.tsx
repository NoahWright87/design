import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPalette } from './ColorPalette';
import { ThemeProvider } from '../../tokens/ThemeProvider';

const meta = {
  title: 'Design System/Colors',
  component: ColorPalette,
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const Default: Story = {}; 