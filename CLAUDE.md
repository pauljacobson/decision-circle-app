# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Decision Circle App - a React + TypeScript application that helps users compare multiple opportunities using interactive wheel visualizations. Users can create up to 3 opportunity wheels, rate various considerations (factors) for each, and see visual comparisons to aid decision-making.

**Key Features:**
- Interactive circular visualizations (SVG-based)
- Real-time comparison analytics
- Secure input validation and sanitization
- Export capabilities (JSON, SVG)
- Responsive design with Tailwind CSS

## Project Structure

```
decision-circle-app/
├── src/
│   ├── components/          # React components
│   │   ├── CircleWheel.tsx      # Wheel visualization component
│   │   ├── ComparisonBars.tsx   # Comparison display component
│   │   └── ErrorBoundary.tsx    # Error handling wrapper
│   ├── utils/               # Utility functions
│   │   ├── validation.ts        # Input sanitization and validation
│   │   ├── calculations.ts      # Business logic calculations
│   │   └── exports.ts           # Export utilities (JSON, SVG, WebP)
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles + Tailwind
│   └── vite-env.d.ts        # Vite TypeScript declarations
├── public/                  # Static assets
├── dist/                    # Production build output (gitignored)
├── node_modules/            # Dependencies (gitignored)
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── .gitignore               # Git ignore rules
```

## Development Commands

```bash
# Install dependencies (run this first after cloning)
npm install

# Start development server
npm run dev
# Opens on http://localhost:5173 (or next available port)
# Hot module replacement enabled for instant updates

# Build for production
npm run build
# Output in dist/ directory
# Includes TypeScript compilation + Vite bundling

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Architecture & Design Patterns

### Technology Stack
- **React 18**: UI framework with hooks-based state management
- **TypeScript 5.6**: Static typing for improved code quality and IDE support
- **Vite 6**: Ultra-fast build tool and dev server
- **Tailwind CSS 3**: Utility-first CSS framework
- **Lucide React**: Modern icon library

### Component Architecture

The application follows a **modular component architecture**:

1. **App.tsx** - Main container component
   - Manages global state (wheels, UI state)
   - Coordinates child components
   - Handles all user interactions and data updates

2. **CircleWheel.tsx** - Visualization component
   - Pure presentational component
   - Renders SVG-based circular charts
   - Receives data via props, no internal state

3. **ComparisonBars.tsx** - Analytics component
   - Calculates and displays comparisons
   - Uses utility functions from `calculations.ts`

4. **ErrorBoundary.tsx** - Error handling component
   - Class component (required by React for error boundaries)
   - Catches JavaScript errors in child tree
   - Displays user-friendly error UI

### TypeScript Type System

**Type Definitions** (`src/types.ts`):
```typescript
interface Segment {
  id: number
  name: string      // Max 50 chars, sanitized
  value: number     // 0-10 range, validated
}

interface Wheel {
  id: number
  name: string      // Max 50 chars, sanitized
  color: string     // Hex format, validated
  segments: Segment[]
}
```

**Constants** (`APP_CONSTANTS` in `types.ts`):
- All magic numbers are defined as constants
- Type-safe with TypeScript `as const`
- Centralized configuration

### State Management Pattern

Uses React's built-in `useState` hooks with **immutable update patterns**:

```typescript
// ✅ Correct: Immutable pattern
setWheels(wheels.map(w =>
  w.id === wheelId ? { ...w, newProperty: value } : w
))

// ❌ Wrong: Mutates state directly
wheels[0].name = "New Name"
setWheels(wheels)
```

**Why immutable updates?**
- React detects changes correctly
- Prevents subtle bugs
- Enables time-travel debugging
- Required for React's reconciliation algorithm

## Security Best Practices

### Input Validation & Sanitization

**All user inputs are validated** before being used or stored. See `src/utils/validation.ts`:

```typescript
// XSS Prevention
validateWheelName(input)      // Removes <script>, event handlers, etc.
validateSegmentName(input)    // Sanitizes consideration names
validateValue(input)          // Clamps to 0-10 range
validateColor(input)          // Validates hex color format
validateFileName(input)       // Prevents directory traversal
```

**Security measures:**
1. **HTML/Script Tag Removal**: Strips `<>` characters
2. **Event Handler Removal**: Removes `onclick=`, `onload=`, etc.
3. **Protocol Filtering**: Removes `javascript:` protocol
4. **Length Limits**: Enforces max lengths (50 chars for names)
5. **Type Validation**: Ensures correct data types
6. **Range Clamping**: Numeric values kept within bounds

### Safe Export Functions

Export utilities (`src/utils/exports.ts`) implement:
- Filename sanitization (prevents path traversal)
- Blob API safety (no eval or innerHTML)
- Proper cleanup (URL.revokeObjectURL)
- Error handling with try/catch

### Error Boundary

Production-grade error handling:
- Catches errors before they crash the app
- Shows user-friendly error messages
- Logs errors to console (can be extended to error tracking services)
- Provides recovery options (try again, reload)

## Code Quality Standards

### Documentation Requirements

1. **File-level comments**: Every file has a JSDoc header explaining purpose
2. **Function documentation**: All exported functions have JSDoc comments with:
   - Description of what it does
   - `@param` tags for parameters
   - `@returns` tag for return value
   - `@example` usage examples
3. **Inline comments**: Complex logic explained with inline comments

### TypeScript Best Practices

1. **No `any` types**: All variables and functions are properly typed
2. **Strict mode enabled**: `tsconfig.json` has strict: true
3. **Interface over type**: Use `interface` for object shapes
4. **Explicit return types**: Functions declare return types
5. **Const assertions**: Use `as const` for literal types

### React Best Practices

1. **Functional components**: Use function components with hooks
2. **Props interface**: Every component has typed props interface
3. **Key props**: All mapped elements have unique `key` props
4. **Accessibility**:
   - ARIA labels (`aria-label`, `aria-labelledby`)
   - Semantic HTML
   - Keyboard navigation support
   - Role attributes for custom widgets
5. **Performance**:
   - Components are kept small and focused
   - No unnecessary re-renders
   - Event handlers are defined at component level

### Naming Conventions

- **Components**: PascalCase (e.g., `CircleWheel`, `ComparisonBars`)
- **Functions**: camelCase (e.g., `validateWheelName`, `addSegment`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_WHEELS`, `COLOR_PALETTE`)
- **Interfaces**: PascalCase (e.g., `Wheel`, `Segment`)
- **Files**: Match component/export name

### File Organization

- **One component per file**: Each component in separate file
- **Related code together**: Utilities grouped by function
- **Index exports**: Use index.ts for clean imports (if needed)
- **Type co-location**: Types in dedicated `types.ts` file

## Testing & Validation

### Pre-deployment Checklist

Before committing code, ensure:
1. ✅ TypeScript compiles without errors: `npm run build`
2. ✅ No linting errors: `npm run lint`
3. ✅ App runs in dev mode: `npm run dev`
4. ✅ All inputs tested with XSS attempts (e.g., `<script>alert('XSS')</script>`)
5. ✅ Export functions work correctly
6. ✅ Responsive design tested (mobile, tablet, desktop)

### Manual Testing Guidelines

1. **Input validation**:
   - Try entering `<script>` tags
   - Try very long strings (>50 chars)
   - Try special characters
   - Try negative numbers
   - Try numbers > 10

2. **State management**:
   - Add/remove wheels
   - Add/remove segments
   - Update values and verify wheel updates
   - Test undo/redo scenarios

3. **Export functionality**:
   - Export to JSON and verify structure
   - Export to SVG and open in browser
   - Verify filenames are sanitized

## Common Development Tasks

### Adding a New Validation Rule

1. Add validation function to `src/utils/validation.ts`
2. Add comprehensive JSDoc documentation
3. Export the function
4. Import and use in appropriate component
5. Test with various inputs

### Adding a New Component

1. Create file in `src/components/`
2. Define props interface
3. Add JSDoc documentation
4. Implement component logic
5. Export as default
6. Import in parent component

### Modifying Data Types

1. Update interface in `src/types.ts`
2. Update sample data in `App.tsx`
3. Update validation functions if needed
4. Check TypeScript errors: `npm run build`
5. Fix any type errors that appear

### Adding New Constants

1. Add to `APP_CONSTANTS` in `src/types.ts`
2. Use `as const` for type safety
3. Replace any hard-coded values with constant
4. Update documentation if user-facing

## Troubleshooting

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run build
```

### Development Server Issues

```bash
# Kill all node processes
killall node

# Restart dev server
npm run dev
```

### Build Failures

1. Check for TypeScript errors
2. Verify all imports are correct
3. Ensure all dependencies are installed
4. Try: `rm -rf node_modules && npm install`

## Performance Considerations

1. **Component rendering**: Components are optimized to prevent unnecessary re-renders
2. **SVG performance**: Wheel visualizations use efficient SVG path generation
3. **Bundle size**: Production build is ~170KB (53KB gzipped)
4. **Lazy loading**: Not currently implemented (may add for future features)

## Accessibility (a11y)

The application follows WCAG 2.1 Level AA guidelines:
- All interactive elements have keyboard support
- Color contrast ratios meet standards
- ARIA labels provided for screen readers
- Semantic HTML structure
- Focus indicators visible

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari, Chrome Android

## Future Enhancements (Not Yet Implemented)

- Local storage persistence
- Import JSON functionality
- More export formats (PNG, PDF)
- Drag-and-drop segment reordering
- Dark mode
- Keyboard shortcuts
- Multi-language support

## Important Constraints

- **Maximum 3 wheels**: Prevents decision paralysis
- **Minimum 2 wheels**: Required for comparison
- **Maximum 20 segments per wheel**: UX limitation
- **Minimum 1 segment**: Required for valid wheel
- **Values: 0-10 range**: Standard rating scale
- **Name lengths: 50 characters**: Prevents UI overflow
- **Color palette**: `['#60A5FA', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6']`

## Contact & Support

For questions about code architecture, security, or TypeScript best practices, refer to:
- React Documentation: https://react.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Vite Guide: https://vite.dev
- OWASP Security Practices: https://owasp.org
