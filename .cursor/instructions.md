# Design System Guidelines

## Styling Guidelines

### Theme Implementation
- Use Emotion's styled components for component styling
- Use CSS variables for theme values (e.g., `var(--color-background)`, `var(--color-foreground)`)
- Avoid direct color values in components
- Theme variables are defined in `src/tokens/theme.ts`
- Components should respond to Storybook's built-in theme toggle
- Use opacity for hover states instead of color changes when possible

### Component Structure
- Each component should have its own directory
- Include both component and story files
- Follow consistent naming conventions
- Use TypeScript for type safety
- Document props with JSDoc comments 