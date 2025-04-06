# TypeScript Types

Use TypeScript types and interfaces for better type safety and code documentation.

## Pattern
`**/*.{ts,tsx}`

## Guidelines
1. Define types and interfaces for all component props
2. Use proper type annotations for function parameters and return values
3. Leverage TypeScript's utility types when appropriate
4. Avoid using `any` type
5. Use proper type imports and exports

## Example
```typescript
import React from 'react';

// Define types for component props
interface UserProfileProps {
  name: string;
  age: number;
  email?: string;  // Optional property
  roles: Array<'admin' | 'user' | 'guest'>;
}

// Use proper type annotations
export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  age,
  email,
  roles,
}) => {
  // Component implementation
};

// Use utility types when appropriate
type ReadonlyUserProfileProps = Readonly<UserProfileProps>;
type PartialUserProfileProps = Partial<UserProfileProps>;
``` 