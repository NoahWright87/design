import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Ocean } from './Ocean';
import { ThemeProvider } from '../../tokens/ThemeProvider';

const meta = {
  title: 'Components/Ocean',
  component: Ocean,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    height: {
      control: 'text',
      description: 'Height of the ocean component',
    },
    width: {
      control: 'text',
      description: 'Width of the ocean component',
    },
  },
} satisfies Meta<typeof Ocean>;

export default meta;
type Story = StoryObj<typeof Ocean>;

export const Default: Story = {
  args: {
    height: '300px',
    width: '100%',
  },
};

export const Sunset: Story = {
  args: {
    height: '400px',
    width: '100%',
  },
};

export const Narrow: Story = {
  args: {
    height: '200px',
    width: '400px',
  },
};