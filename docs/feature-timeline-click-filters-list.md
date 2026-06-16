# Feature Plan: Timeline Click Filters Task List

## Purpose

This note captures the recommended approach for letting users click a timeline item and immediately narrow the editable task list to that item.

The goal is to make the visual roadmap act as a fast entry point into editing without breaking the current filter, import, export, or manual-order workflows.

## Recommendation

When a user clicks a task bar in the timeline, the task list should filter to that task.

Recommended first version:

- clicking a timeline task bar filters the task table to that task row
- the timeline remains visible and does not collapse to the selected task
- clicking the same task again clears that task-selection filter
- a visible clear action should also remove the filter

This should behave as an additive, explicit selection filter rather than as a hidden side effect.

## Product Behavior

Recommended selection behavior:

1. click a task bar in weekly or monthly timeline view
2. the task table filters to the matching task
3. the timeline stays fully visible while the selected task remains easy to identify visually
4. task count and filter messaging reflect the task-list result

Recommended clear behavior:

- clicking the selected task again clears the selection filter
- clearing the existing text filter should not silently clear task selection unless both are intentionally unified
- the UI should expose a clear selection action near the existing filter context

## Why This Version Is Better

- makes the timeline a practical editing surface instead of only a display
- preserves the current table-first editing model while reducing scan time
- builds on the existing table/timeline filter alignment work instead of creating a separate side channel
- keeps the feature small and testable before considering broader phase/category click interactions

## Guardrails

- keep text filtering aligned across the task table and timeline
- let timeline-click selection narrow only the task table
- do not break manual ordering or drag-and-drop in the filtered list
- do not change spreadsheet import behavior
- do not change CSV export behavior
- do not make selection depend on weekly-only or monthly-only logic; the same concept should work in both views

## Suggested Data Model

Prefer a dedicated selected-task filter state instead of overloading the existing text filter.

Recommended state shape:

- `selectedTimelineTaskId: number | null`

Recommended filter rule:

- start from the current text-filtered task set
- if `selectedTimelineTaskId` is present, narrow only the task table to that task
- keep timeline and legends derived from the text-filtered subset, with visual emphasis on the selected task

## Implementation Slices

1. Add selection state
- store the selected task id in `src/App.tsx`
- add a clear action near the existing task-list filter summary

2. Wire timeline clicks
- make task bars clickable in both weekly and monthly views
- toggle selection on repeated click

3. Align filtering
- keep text filtering shared across task table, timeline, and legends
- apply selected-task filtering only to the task table
- keep counts and filter messaging clear about what is actually filtered

4. Add visual feedback
- highlight the selected task bar
- slightly de-emphasize non-selected bars while a selection is active
- show the selected task name or selection status near the table filter context

5. Verify behavior
- click a timeline task and confirm the table narrows correctly
- confirm the rest of the timeline remains visible while the selected task stays obvious
- repeat the click and confirm the filter clears
- verify weekly and monthly behavior both work
- verify drag ordering, import, and export still behave normally

## Suggested First Slice

If implementation starts soon, begin with:

1. add `selectedTimelineTaskId`
2. apply it only to the task-table filtered set
3. make weekly and monthly task bars toggle that selection
4. add a visible clear-selection control
