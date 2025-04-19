import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';
import { ThemeProvider } from '../../tokens/ThemeProvider';

const meta = {
  title: 'Components/Section',
  component: Section,
  argTypes: {
    gutters: {
      control: 'select',
      options: ['none', 'small', 'normal', 'large'],
      description: 'The amount of padding around the section content',
      defaultValue: 'normal'
    },
    bgColor: {
      control: 'select',
      options: ['primary', 'secondary', 'background', 'foreground'],
      description: 'Background color of the section',
      defaultValue: 'background'
    },
    hasBottomBorder: {
      control: 'boolean',
      description: 'Whether the section has a bottom border',
      defaultValue: false
    },
    children: {
      control: 'text',
      description: 'Content of the section'
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof Section>;

// Default section
export const Default: Story = {
  args: {
    children: <div>This is a default section with normal gutters</div>
  }
};

// Section with no gutters
export const NoGutters: Story = {
  args: {
    gutters: 'none',
    children: <div>This is a section with no gutters</div>
  }
};

// Section with small gutters
export const SmallGutters: Story = {
  args: {
    gutters: 'small',
    children: <div>This is a section with small gutters</div>
  }
};

// Section with large gutters
export const LargeGutters: Story = {
  args: {
    gutters: 'large',
    children: <div>This is a section with large gutters</div>
  }
};

// Section with primary background
export const PrimaryBackground: Story = {
  args: {
    bgColor: 'primary',
    children: <div style={{ color: 'white' }}>This is a section with primary background</div>
  }
};

// Section with secondary background
export const SecondaryBackground: Story = {
  args: {
    bgColor: 'secondary',
    children: <div style={{ color: 'white' }}>This is a section with secondary background</div>
  }
};

// Section with bottom border
export const WithBottomBorder: Story = {
  args: {
    hasBottomBorder: true,
    children: <div>This section has a bottom border</div>
  }
};

// Complex example combining multiple features
export const ComplexSection: Story = {
  args: {
    gutters: 'normal',
    bgColor: 'background',
    hasBottomBorder: true,
    children: (
      <div style={{ padding: '20px 0' }}>
        <h2>Complex Section Example</h2>
        <p>This section combines multiple features: normal gutters, background color, and bottom border.</p>
      </div>
    )
  }
};
