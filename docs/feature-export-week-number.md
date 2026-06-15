# Feature Plan: Export Week Number In CSV

## Purpose

This note captures the recommended approach for adding week-number output to CSV export.

The goal is to make exported roadmap data easier to sort, review, and hand off without changing the task editing flow or making import stricter.

## Recommendation

Add a `Week` column to the exported CSV.

Recommended placement:

- after `Owner`
- before `Date Start`

Recommended export header:

`Phase,Phase Hex,Category,Category HEX,Task,Sub-Task,Owner,Week,Date Start,Date End,Display Order,Line Padding`

## Recommended Week Value

Prefer a forgiving export rule that works for both imported and manually created tasks.

1. If `task.week` already exists, export that value.
2. If `task.week` is blank, derive the week number from the task's `startDate`.

Recommended derived definition:

- use the task's `startDate`
- normalize to the start of that week
- compare against the earliest task week in the current task list
- export a relative week number starting at `1`

This keeps CSV export useful even when tasks were created manually and never received an imported `Week` field.

## Why This Version Is Better

- preserves existing importer flexibility
- does not require users to backfill a new field before export works
- keeps CSV useful for spreadsheet sorting and reporting
- matches the app's existing relative week-number framing more closely than raw ISO week numbers would

## Guardrails

- do not remove any current CSV columns
- do not make import depend on the `Week` column
- do not let export week-number logic drift away from the weekly view's relative week-number mental model without documenting that difference
- preserve manual ordering and the current file download workflow

## Implementation Slices

1. Add the export column
- update the CSV header string in `src/App.tsx`
- insert the week value into each exported row in the same position

2. Extract export week-number logic
- add a small helper for computing export week numbers
- reuse existing date normalization assumptions already used elsewhere in the app

3. Preserve flexible behavior
- export `task.week` when available
- derive a week number when it is missing

4. Verify export output
- export a file with imported tasks that already contain `Week`
- export a file with manually created tasks that do not contain `Week`
- confirm column order stays stable
- confirm CSV export still downloads correctly

## Suggested First Slice

If implementation starts soon, begin with:

1. compute the relative week number helper
2. add the `Week` CSV column
3. verify imported and manual tasks both export sensible week values
