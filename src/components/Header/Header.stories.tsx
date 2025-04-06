import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Global } from '@emotion/react';
import { globalStyles } from '../../tokens/theme';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <>
        <Global styles={globalStyles} />
        <Story />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {},
};

export const CustomNavItems: Story = {
  args: {
    navItems: [
      { label: 'Products', href: '/products' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blog' },
      { label: 'Support', href: '/support' },
    ],
  },
}; 