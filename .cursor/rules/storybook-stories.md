# Storybook Stories

Storybook stories should be properly documented and follow naming conventions.

## Pattern
`stories/**/*.stories.{ts,tsx}`

## Guidelines
1. Use clear, descriptive story names
2. Include JSDoc comments for documentation
3. Group related stories using the `title` property
4. Use proper naming conventions for story files (Component.stories.tsx)

## Example
```typescript
/**
 * Button component stories
 * @module Button
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};
``` 