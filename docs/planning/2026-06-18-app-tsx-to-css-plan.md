# App.tsx → App.css Separation Plan

## Summary
Audit `src/App.tsx` for styling that should live in `src/App.css`, then split the work into small, non-overlapping chunks that preserve behavior. The goal is to keep TSX focused on structure, state, event handling, geometry, and class selection, while moving static presentation into CSS.

## Chunked Implementation
1. `Shell and panel chrome`
   - Move static layout/styling from the content shell, settings panel wrappers, and section headers into CSS classes.
   - Keep only dynamic placement values in TSX, such as anchored panel `top/right` values.
   - Prefer modifier classes for interactive/collapsible header states instead of inline flex/cursor styles.

2. `Timeline and calendar state styling`
   - Replace inline selection/dim/drag visual state on timeline bars and calendar chips with modifier classes.
   - Keep runtime geometry in TSX (`left`, `top`, `width`, `gridColumn`, `gridRow`, `gridTemplateColumns`, `gridTemplateRows`).
   - Keep data-driven colors in TSX only where they depend on task values, but move state appearance to CSS.

3. `Task table and task panel`
   - Move table shell styles, column widths where they are fixed, action button spacing, drag handle styling, and footer spacing into CSS classes.
   - Replace repeated inline flex wrappers and control sizing with reusable utility/modifier classes.
   - Preserve table behavior, drag-and-drop, sorting, and editing exactly as-is.

4. `Legend and repeated micro-patterns`
   - Extract repeated legend row/swatch styles and similar small flex-based visual patterns into reusable classes.
   - Keep swatch colors dynamic, but move sizing, border, radius, and text treatment to CSS.

5. `Cleanup pass`
   - Remove any leftover inline styles that are purely visual and not tied to runtime geometry or logic.
   - Verify there are no behavior changes, only class and stylesheet changes.

## Test Plan
- Run `npm run build`.
- Run `npx eslint src/App.tsx` for the active source file.
- Do a quick browser smoke check of:
  - header and settings panel rendering
  - task panel open/close behavior
  - timeline selection/drag states
  - calendar chips and legend rendering
  - table editing and row actions

## Assumptions
- No application logic will move into CSS.
- Dynamic geometry stays in TSX.
- The work will be implemented in small slices, one chunk at a time, to reduce risk and make subagent review easier.
- The repo’s current visual system should be preserved rather than redesigned.
