# Feature Plan: Calendar View

## Purpose

This note captures the recommended approach for adding a `Calendar` view to the roadmap board instead of pursuing a separate `Horizontal | Vertical` layout mode.

The goal is to introduce a date-grid view that complements the current timeline without replacing the existing task table, weekly timeline, or monthly timeline.

Reference mockups:

- [calendar-view-mockup.png](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap Project/docs/mockups/calendar-view-mockup.png) - first concept, broader visual exploration
- [calendar-view-mockup-v2.png](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap Project/docs/mockups/calendar-view-mockup-v2.png) - closer to the current app layout and controls

## Recommendation

Treat calendar as a third view mode:

- `Weeks`
- `Months`
- `Calendar`

Do not add a separate layout toggle for this feature.

The calendar view should reuse the same underlying task data, filtering rules, and selection behavior that already power the task table and timeline.

## Product Behavior

The existing task table remains the editing source of truth.

Current limitation to preserve during planning:

- the app is currently session-only and does not save tasks across page refreshes
- imported data must be re-imported after refresh unless persistence is added in a separate slice

The calendar view should be read-first and planning-friendly:

- show tasks inside calendar date cells based on overlap with each day
- support the existing text filter and timeline-click task selection behavior where sensible
- preserve the current task count, legends, and visible-state expectations
- avoid becoming a second editing surface in the first implementation slice

Recommended first version:

- monthly calendar grid
- one month visible at a time
- previous/next month navigation
- clear rendering for multi-day tasks that span across weeks
- simple task chips or stacked rows inside each day cell

## Why This Version Is Better

- fits the roadmap-planning use case more directly than a vertical timeline variant
- adds a genuinely different planning lens instead of another rendering orientation
- keeps `Weeks` and `Months` separate from any future presentation experiments
- lowers the risk of expanding the current timeline code into four orientation combinations

## Guardrails

- keep spreadsheet import behavior unchanged
- keep CSV export behavior unchanged
- do not imply durable save behavior in the first calendar slice unless persistence is implemented separately
- keep task selection logic aligned across task table and visual views
- do not break manual drag ordering in the task table
- do not collapse `Weeks` and `Months` into a combined or overloaded control

## Dependency

This feature should build on the existing weekly visible-day cleanup and current timeline selection behavior, but it does not require a horizontal-versus-vertical abstraction first.

The weekend-toggle work is still useful groundwork because it already separated rendered-day logic from raw task dates.

See [feature-weekend-toggle.md](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap%20Project/docs/feature-weekend-toggle.md:1).

## Recommended Definition Of Calendar View

Use a standard month-style calendar grid:

- columns represent days of the week
- rows represent calendar weeks within the visible month
- each task appears on every visible day it overlaps
- multi-day tasks should stay visually traceable across adjacent cells when possible

For the first slice, prioritize legibility over dense packing. It is acceptable to cap visible tasks per day cell and show a `+N more` overflow label if needed.

## Implementation Slices

1. Add calendar view state
- extend the existing `Weeks | Months` control to include `Calendar`
- keep current weekly and monthly behaviors unchanged

2. Extract day-overlap helpers
- add shared logic for determining whether a task is visible on a given day
- reuse normalized date handling so calendar rendering matches export and timeline assumptions

3. Add monthly calendar navigation and grid rendering
- render one month at a time
- include leading and trailing days needed to fill full calendar weeks
- keep month navigation separate from weekly and monthly timeline navigation
- keep the first slice honest about session-only state unless a save mechanism ships at the same time

4. Render task chips inside day cells
- show task name with category or phase color cues
- preserve selected-task emphasis if a timeline/table selection is active
- keep cell layout readable before attempting advanced packing

5. Verify view alignment
- tasks shown in calendar must still exist in the task table
- filters must narrow calendar results consistently
- imported and manually added tasks must appear correctly
- weekly and monthly timeline views must remain unchanged

## Suggested Follow-Up

1. ship `Calendar` as a separate view mode, not a layout variant
2. deliver read-only monthly calendar rendering first
3. evaluate whether click-to-select from calendar cells should mirror timeline bar selection
4. only after that, decide whether week-style calendar or drag interactions are worth adding
