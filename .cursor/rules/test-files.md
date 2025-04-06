# Test Files

Test files should be colocated with their source files and follow consistent patterns.

## Pattern
`**/*.{test,spec}.{ts,tsx}`

## Guidelines
1. Test files should be in the same directory as the source files they test
2. Use descriptive test names that explain the behavior being tested
3. Follow the pattern: `ComponentName.test.tsx` or `ComponentName.spec.tsx`
4. Group related tests using `describe` blocks
5. Use meaningful test case names in `it` or `test` blocks

## Example
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');
  });
});
``` 