# Feature Plan: Weekend Toggle

## Purpose

This note captures the recommended approach for adding a weekly-view toggle that shows or hides weekends.

The goal is to improve workweek planning without changing the task data model, import flow, or CSV export behavior.

## Recommendation

Add a weekly-view control named `Show weekends`.

- Default: `on`
- Scope: weekly view only
- Monthly view: unchanged

When the toggle is `off`, Saturday and Sunday should be removed from the rendered weekly grid instead of only being visually muted.

## Product Behavior

When weekends are hidden:

- the weekly timeline renders 5 visible days per week instead of 7
- task data still keeps real calendar `startDate` and `endDate`
- imported and manually created tasks keep their original dates
- CSV export remains unchanged

This should be a rendering-only feature, not a data transformation feature.

## Rendering Rules

- weekly headers should reflect the visible day set
- weekly task positioning should be based on visible workdays only
- tasks spanning a weekend should appear continuous from Friday to Monday, with hidden days skipped visually
- tasks starting or ending on a weekend should keep their real dates, but weekly rendering should clip them to the nearest visible workday

## Implementation Slices

1. Add weekly UI state
- add `showWeekends` state in `src/App.tsx`
- add a control near the existing weekly view controls

2. Extract visible-day math
- introduce a weekly visible-day model for either 7-day or 5-day rendering
- stop assuming `weekSpan * 7` for all weekly calculations

3. Update weekly header rendering
- weekly headers should use the visible-day model
- weekly grid cells should match the same day set used by bar positioning

4. Update weekly task positioning
- recalculate `start` and `width` against visible days only
- preserve clipping for tasks outside the current view

5. Verify alignment
- manual tasks appear in both table and weekly timeline
- imported tasks crossing weekends still render sensibly
- phase sections still align with visible task ranges
- legends and counts stay consistent with the displayed task set

## Suggested First Slice

If implementation starts soon, begin with:

1. add the `Show weekends` control
2. extract weekly visible-day math
3. update weekly headers and task positioning
4. verify manual tasks and imported tasks in weekly view
