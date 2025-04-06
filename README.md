# Design System

A shared component library built with React and Storybook for Next.js applications.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd design
```

2. Install dependencies:
```bash
npm install
```

3. Start Storybook:
```bash
npm run storybook
```

This will open Storybook in your default browser at `http://localhost:6006`.

## Development

### Project Structure

```
src/
  components/     # React components
    Button/      # Example component
      Button.tsx
      Button.css
      Button.stories.tsx
```

### Adding New Components

1. Create a new directory in `src/components/` for your component
2. Create the component file (e.g., `ComponentName.tsx`)
3. Create the styles file (e.g., `ComponentName.css`)
4. Create the stories file (e.g., `ComponentName.stories.tsx`)

### Using Components in Your Next.js Project

1. Install this package in your Next.js project:
```bash
npm install [your-package-name]
```

2. Import and use components:
```tsx
import { Button } from '[your-package-name]';

export default function MyComponent() {
  return (
    <Button variant="primary" size="medium">
      Click me
    </Button>
  );
}
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.