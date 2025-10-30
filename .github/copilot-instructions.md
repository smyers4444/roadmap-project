# Roadmap Project - Copilot Instructions

## Project Overview
This is a **React + TypeScript** project using **Vite** as the build tool. It's a sophisticated weekly planning board application with Gantt-chart style timeline visualization.

## Project Type
- **Framework**: React 19.1 with TypeScript 5.9
- **Build Tool**: Vite 7.1
- **UI Pattern**: Functional components with React hooks
- **Styling**: Custom CSS with CSS Grid and CSS variables
- **State Management**: React useState (no external state library)

## Key Technologies & Dependencies
- **date-fns** (4.1.0) - All date manipulation and formatting
- **react-datepicker** (8.7.0) - Date picker UI component
- **@tanstack/react-table** (8.21.3) - Available but not currently in use
- **ESLint** (9.36.0) - Code quality with TypeScript rules

## Architecture & Code Style

### Component Structure
- Single-file application in `src/App.tsx` (2000+ lines)
- Functional component with hooks-based state management
- No component splitting (intentional for this project size)
- All state lives in the main App component

### State Management Pattern
```typescript
// All state uses useState hooks
const [tasks, setTasks] = useState<Task[]>([]);
const [view, setView] = useState<"weeks" | "months">("weeks");
// No Redux, Context, or other state libraries
```

### Key Interfaces
```typescript
interface Task {
  id: number;
  phase?: string;
  phaseHex?: string;      // Color for phase headers/backgrounds
  category?: string;
  categoryHex?: string;   // Color for task bars
  name: string;
  subTask?: string;
  week?: number;
  owner?: string;
  startDate: Date;
  endDate: Date;
  displayOrder: number;   // For drag-and-drop ordering
}
```

### Algorithm Conventions
- **"Reverse Tetris" Positioning**: Tasks pack vertically from top to bottom
  - Vacation tasks always positioned first (top)
  - Then sorted by start date
  - Collision detection prevents overlaps
  - Percentage-based horizontal positioning (0-100%)
  - Pixel-based vertical positioning (absolute)

- **Text Wrapping Calculation**: 
  - Simulate word wrapping to calculate required lines
  - Dynamic task bar height based on text length
  - Character width averaging: ~8.5px per character

- **Date Normalization**:
  - Always normalize dates to midnight to avoid DST issues
  - Use `new Date(year, month, date)` constructor
  - Math.round() for day calculations to handle floating point

### Color System
- **CSS Variables**: All colors defined in `:root` in `App.css`
- **Phase Colors**: Used for phase header bars and lightened backgrounds
- **Category Colors**: Used for individual task bars
- **Luminance Calculation**: Automatic text color (black/white) based on background
- **Color Lightening**: Blend with white (no transparency/opacity on colors themselves)

### Styling Patterns
- **Fixed Width**: Root div set to 1800px (not responsive)
- **CSS Grid**: For timeline columns
- **Absolute Positioning**: For task bar overlays
- **Collapsible Sections**: Show/hide using conditional rendering
- **Semantic CSS Variables**: `--bg-primary`, `--text-secondary`, etc.

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## File Structure
```
src/
├── App.tsx           # Main application (2000+ lines)
├── App.css           # All styles with CSS variables
├── main.tsx          # React entry point
└── index.css         # Global/reset styles
```

## Coding Guidelines

### When Modifying App.tsx
1. **Preserve Comments**: Extensive inline documentation exists - maintain it
2. **Section Headers**: Keep the `========== SECTION ==========` comment style
3. **Algorithm Comments**: Don't remove explanations of positioning logic
4. **Type Safety**: All functions are properly typed - maintain this
5. **No Breaking Changes**: Be careful with the positioning algorithm - it's complex

### Adding Features
- New state should use `useState` at the top of the App component
- Keep the same functional style (no class components)
- Maintain the existing comment verbosity (this is intentional)
- Use date-fns for all date operations (already imported)
- Follow the existing CSS variable naming convention

### Common Patterns to Follow
```typescript
// Date normalization
const normalizeDate = (date: Date) => 
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Color calculation
const getTextColor = (hexColor: string | undefined) => {
  // ... luminance calculation ...
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Task filtering
const filtered = tasks.filter(task => 
  task.startDate <= periodEnd && task.endDate >= periodStart
);
```

### Testing Locally
- Use "Add Test Task" button for quick testing
- Import sample data using tab-separated format
- Test both weekly and monthly views
- Verify task positioning with different text lengths

## Known Patterns & Conventions

### Import Data Format
```
Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End
Foundation	D40E8C	Initiation	D30C55	Kickoff		John	1/4/2026	1/17/2026
```

### Column Mapping Flexibility
- Supports multiple header name variations (e.g., "Date Start", "Start Date", "Start")
- Date parsing handles MM/DD/YYYY format
- Auto-groups tasks with same Phase/Category/Name

### Performance Considerations
- No virtualization (assumes reasonable task count < 500)
- Task height calculation happens on every render (intentional for simplicity)
- No memoization currently used

## AI Assistant Guidelines

When helping with this project:
1. **Understand the positioning algorithm** before suggesting changes to task rendering
2. **Preserve all detailed comments** - they document complex logic
3. **Test with both view modes** (weeks and months) when making changes
4. **Maintain type safety** - TypeScript strict mode is enabled
5. **Keep the single-file structure** - don't suggest splitting into components unless explicitly requested
6. **Use date-fns functions** - don't introduce other date libraries
7. **Follow the CSS variable system** - don't use inline hex colors
8. **Respect the 1800px fixed width** - this is intentional for the use case

## Debug/Launch Instructions
```bash
# Development
npm run dev
# Then open http://localhost:5173

# Production preview
npm run build && npm run preview
```

No additional IDE configuration needed - works with standard VS Code TypeScript/React setup.

