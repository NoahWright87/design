import type { Meta, StoryObj } from '@storybook/react';
import { Page } from './Page';

const meta: Meta<typeof Page> = {
  title: 'Examples/Page',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Page>;

export const Default: Story = {}; 