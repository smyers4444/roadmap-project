# Feature Status: Export Week Number In CSV

## Status

Implemented in commit `11ef02f` (`Export week number in CSV`).

Verification completed for code quality on this implementation slice:

- `npm run build`
- `npx eslint src/App.tsx`

Recommended manual follow-up:

- CSV export check for imported and manually created tasks

## Shipped Behavior

CSV export now includes a `Week` column.

Export order:

`Phase,Phase Hex,Category,Category HEX,Task,Sub-Task,Owner,Week,Date Start,Date End,Display Order,Line Padding`

Week export behavior is forgiving:

1. if a task already has `task.week`, that value is exported
2. if `task.week` is missing, the app derives a relative week number from the task `startDate`

The derived value:

- normalizes to the start of the task's week
- compares against the earliest task week in the current task list
- exports a relative week number starting at `1`

This keeps CSV export useful for both imported tasks and manual tasks.

## Guardrails Preserved

- import behavior remains flexible
- export still preserves manual task order
- no existing CSV columns were removed
- the file download flow remains unchanged

## Implementation Notes

The shipped slice added:

1. a relative week-number helper in `src/App.tsx`
2. a `Week` CSV header between `Owner` and `Date Start`
3. export fallback logic so manual tasks still receive a sensible week number

## Remaining Verification

Before considering this fully wrapped:

1. export a file from imported tasks that already contain `Week`
2. export a file from manually created tasks without `Week`
3. confirm the downloaded CSV column order and values look correct in a spreadsheet

## Next Related Docs

For current repo state and next steps, read:

- [handoff.md](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap%20Project/docs/handoff.md:1)
- [feature-layout-orientation-toggle.md](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap%20Project/docs/feature-layout-orientation-toggle.md:1)
