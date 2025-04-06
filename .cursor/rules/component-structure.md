# Component Structure

Components should follow a consistent structure with imports, types, and exports.

## Pattern
`src/components/**/*.{ts,tsx}`

## Guidelines
1. Imports should be at the top of the file
2. Types and interfaces should be defined before the component
3. Component definition should follow the types
4. Exports should be at the bottom of the file

## Example
```typescript
import React from 'react';
import { SomeType } from './types';

interface ComponentProps {
  // props definition
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // component implementation
};
``` 