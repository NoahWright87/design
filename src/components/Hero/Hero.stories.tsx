import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from './Hero';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to Our Platform</h1>
        <p>This is a hero section that stands out from the rest of the page with a distinctive background color.</p>
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#D06000', color: 'white', border: 'none', borderRadius: '4px' }}>
          Get Started
        </button>
      </div>
    ),
    bgColor: 'secondary',
  },
};

export const WithImageRight: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem' }}>
        <h1>Featured Content</h1>
        <p>This hero section shows an image on the right side with content on the left.</p>
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#D06000', color: 'white', border: 'none', borderRadius: '4px' }}>
          Learn More
        </button>
      </div>
    ),
    image: 'https://picsum.photos/seed/picsum/400/300',
    imageAlt: 'Placeholder image',
    imageAlignment: 'right',
    bgColor: 'secondary',
  },
};

export const WithImageLeft: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem' }}>
        <h1>Product Showcase</h1>
        <p>This hero section shows an image on the left side with content on the right.</p>
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#D06000', color: 'white', border: 'none', borderRadius: '4px' }}>
          View Details
        </button>
      </div>
    ),
    image: 'https://picsum.photos/seed/picsum2/400/300',
    imageAlt: 'Product showcase image',
    imageAlignment: 'left',
    bgColor: 'secondary',
  },
};

export const CustomBackground: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem', color: 'white' }}>
        <h1>Custom Background</h1>
        <p>This hero uses a custom background color from the theme.</p>
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'white', color: '#D06000', border: 'none', borderRadius: '4px' }}>
          Explore Now
        </button>
      </div>
    ),
    image: 'https://picsum.photos/seed/picsum3/400/300',
    imageAlt: 'Feature image',
    imageAlignment: 'right',
    bgColor: 'primary',
  },
};

export const WithoutBorder: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem' }}>
        <h1>No Border Hero</h1>
        <p>This hero section has the bottom border disabled.</p>
        <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#D06000', color: 'white', border: 'none', borderRadius: '4px' }}>
          Continue
        </button>
      </div>
    ),
    image: 'https://picsum.photos/seed/picsum4/400/300',
    imageAlt: 'Hero image',
    hasBottomBorder: false,
    bgColor: 'secondary',
  },
};
