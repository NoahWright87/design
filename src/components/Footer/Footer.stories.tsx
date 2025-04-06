import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';
import { ThemeProvider } from '../../tokens/ThemeProvider';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {},
}; 