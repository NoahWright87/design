import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ThemeProvider } from '../../tokens/ThemeProvider';

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'success', 'warning', 'error'],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

// Variant examples
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

// Size examples
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
    variant: 'primary',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
    variant: 'primary',
  },
};

// State examples
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'primary',
  },
}; 