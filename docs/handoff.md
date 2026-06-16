# Handoff Notes

## Maintenance Instructions

This file is a rolling current-state brief for handing work to another chat and for quickly resuming the project after time away. Keep it concise.

- Replace stale status instead of appending a running journal.
- Keep the file near 1-2 pages when practical.
- Record durable repo rules in `.github/copilot-instructions.md`, not here.
- Record skill-specific behavior in `.codex/skills/`, not here.
- Use this file as the first current-state read for a fresh chat after `README.md`.
- Prefer current branch/worktree status, recent changes, verification state, and next steps over broad project history.
- Update this file after material implementation changes, commits, or verification results.
- Always leave the next recommended task clear enough for a new agent to start.

Last updated: 2026-06-15 (calendar polish follow-up implemented and manually verified)

## Current Snapshot

The repository contains a working React + TypeScript roadmap planning board built with Vite.

The app combines:

- an editable task table
- a tab-separated spreadsheet import flow with preview/edit before import
- weekly and monthly timeline views plus a calendar view
- drag-and-drop task ordering
- CSV export of the current tasks
- browser-local task persistence on the current device/browser

The main implementation lives in `src/App.tsx`, with styling in `src/App.css` and `src/index.css`.

Recent repo-level cleanup work has added project-local Codex skills and refreshed repo instructions:

- `.codex/skills/roadmap-project/`: project-specific implementation guidance
- `.codex/skills/roadmap-wrap-up/`: project-specific wrap-up and handoff guidance
- `.codex/skills/fresh-look-review/`: project-agnostic independent review skill, cleaned up for reuse
- `.github/copilot-instructions.md`: rewritten to match this repo's actual React/Vite workflow and guardrails

There are now separate feature notes for:

- completed weekend-toggle work at `docs/feature-weekend-toggle.md`
- calendar-view planning and mockups at `docs/feature-calendar-view.md`
- CSV week-number export work at `docs/feature-export-week-number.md`
- proposed timeline-click filtering work at `docs/feature-timeline-click-filters-list.md`

Calendar-view mockup asset:

- `docs/mockups/calendar-view-mockup.png`
- `docs/mockups/calendar-view-mockup-v2.png`

## Branch And Working Tree

Recent committed baseline before this feature:

- `57f0d89` `Add weekly weekend toggle`
- `4d75c8f` `Update roadmap feature docs`
- `11ef02f` `Export week number in CSV`

Current implemented UI state:

- Timeline task bars in both weekly and monthly view support single-select filtering into the task table only.
- The timeline stays fully visible, with the selected bar highlighted and the other bars slightly de-emphasized.
- Repeat-click clears the selection, and the task filter area exposes a visible clear action.
- A new calendar view is available as a third view mode with month-span or exact-date-range controls, week-spanning task bars, selection highlighting, a clearer month-start callout, and browser-local persistence messaging placed outside the calendar board for cleaner screenshots.
- `Show weekends` now affects weekly view, calendar view, and monthly timeline rendering.

## How to Run

Install dependencies:

```bash
npm install
```

Start the local app:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

## How to Verify

Run:

```bash
npm run build
```

When lint-sensitive logic changes:

```bash
npm run lint
```

Current caveat:

- `npm run lint` currently scans `.history/` snapshot files and reports many unrelated legacy errors.
- Use `npx eslint src/App.tsx` as the meaningful targeted lint check for the active app file until lint scope is narrowed.

Useful manual checks:

- add a task manually and confirm it appears in the task table and timeline
- import tab-separated rows and confirm they become real tasks
- confirm the task count updates after import
- switch between weekly, monthly, and calendar views
- refresh after adding or importing tasks and confirm the board reloads from browser-local storage
- in calendar view, switch between month-span mode and exact date-range mode and confirm the visible grid updates correctly
- in calendar view, show more than one month at once and confirm the date labels stay readable across month boundaries
- in calendar view, confirm week-spanning task bars stay aligned inside each visible week row, keep centered labels, and only show continuation arrows when the task extends beyond that week segment
- in calendar view with weekends hidden, confirm month changes still remain visible when the first of the month falls on a hidden weekend
- in weekly view, toggle `Show weekends` and confirm headers and bar positions compress to visible workdays
- in monthly view, toggle `Show weekends` and confirm task bars compress horizontally while task dates stay unchanged
- in calendar view, toggle `Show weekends` and confirm weekend columns hide/show
- export tasks to CSV when tasks are present

Latest verification, 2026-06-15:

- `npm run build`: passes
- `npm run lint`: fails on existing `.history/` snapshot files outside the active change set
- `npx eslint src/App.tsx`: passes
- `git diff --check`: passes
- browser/manual persistence verification: passed across add, edit, import, drag reorder, clear-all, and refresh, per user report
- browser/manual timeline-click verification: passed, per user report
- CSV export sanity check: export code still uses the full `tasks` array sorted by `displayOrder`, so timeline-click selection does not narrow the exported file
- browser/manual calendar verification: passed, per user report across calendar render, multi-month/date-range controls, week-spanning bars, spacing/alignment polish, weekend hiding, hidden-weekend month transitions, and month-view weekend compression

## Latest Change

Latest feature update, 2026-06-15:

- Implemented a read-only calendar view based on the v2 mockup direction.
- Added calendar week-segment task bars with selection highlighting aligned to the task table filter behavior.
- Fixed calendar weekend hiding, month picker overlay stacking, and month-view weekend compression.
- Added browser-local task persistence with safe date hydration on reload.
- Extended calendar view with multi-month span controls and exact date-range selection.
- Reworked calendar task layout so labels stay centered regardless of continuation arrows, spacing is screenshot-friendly, and the browser-local persistence note sits outside the rounded calendar board.
- Added a month-start callout treatment that still marks the new month when weekends are hidden and the first lands off-grid.

## Key Guardrails

- Keep spreadsheet paste/import flexible. Do not tighten it without a clear user request.
- Keep the task table and timeline behavior aligned. If imported or edited tasks do not appear in both places, treat that as a regression.
- Preserve CSV export when task fields or ordering behavior changes.
- Prefer incremental cleanup over major refactors. `src/App.tsx` is intentionally still the center of the app.
- Do not create commits or pull requests without explicit user confirmation.
- Update `README.md`, `.github/copilot-instructions.md`, and this file when setup, workflow, import behavior, or repo guidance changes materially.

## Recommended Next Task

1. Decide whether the next slice should be persistence follow-through beyond browser-local storage or additional screenshot/share polish such as print framing and export-friendly presentation.
2. If persistence moves forward, keep the current browser-local behavior explicit until cross-session or portable storage is actually implemented.
3. Keep spreadsheet import flexible and preserve CSV export based on the full task list in manual `displayOrder`.
4. Keep broader calendar interactions such as drag/edit-in-calendar and cross-device sync out of scope until sharing expectations are clearer.

## New Chat Start

Start with:

- `README.md`
- `.github/copilot-instructions.md`
- `docs/handoff.md`
- `src/App.tsx`

If the task is skill-related, also read:

- `.codex/skills/roadmap-project/SKILL.md`
- `.codex/skills/roadmap-wrap-up/SKILL.md`
