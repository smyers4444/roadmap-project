# Handoff Notes

## Maintenance Instructions

This file is a rolling current-state brief for handing work to another chat and for quickly resuming the project after time away. Keep it concise.

- Replace stale status instead of appending a running journal.
- Keep the file near 1-2 pages when practical.
- Record durable repo rules in `CLAUDE.md` (Claude Code) or `.github/copilot-instructions.md` (Copilot), not here.
- Record skill-specific behavior in `.claude/skills/` (Claude Code) or `.codex/skills/` (Copilot), not here.
- Use this file as the first current-state read for a fresh chat after `README.md`.
- Prefer current branch/worktree status, recent changes, verification state, and next steps over broad project history.
- Update this file after material implementation changes, commits, or verification results.
- Always leave the next recommended task clear enough for a new agent to start.

Last updated: 2026-06-16 (weekend-gap divider added to stacked monthly Split-by-Days and stacked weekly views, build-verified, browser-verified)

## Current Snapshot

The repository contains a working React + TypeScript roadmap planning board built with Vite.

The app combines:

- an editable task table
- a tab-separated spreadsheet import flow with preview/edit before import
- weekly and monthly timeline views plus a calendar view
- drag-and-drop task ordering
- CSV export of the current tasks
- browser-local task persistence on the current device/browser
- task-table date pickers that now render above the timeline instead of underneath timeline task bars when the task list is filtered

The main implementation lives in `src/App.tsx`, with styling in `src/App.css` and `src/index.css`.

Recent repo-level cleanup work has added project-local skills and refreshed repo instructions:

**Claude Code setup:**
- `CLAUDE.md`: main project instructions matching React/Vite workflow and guardrails
- `.claude/skills/roadmap-project/SKILL.md`: project-specific implementation guidance
- `.claude/skills/roadmap-wrap-up/SKILL.md`: project-specific wrap-up and handoff guidance
- `.claude/skills/fresh-look-review/SKILL.md`: project-agnostic independent review skill

**Copilot setup:**
- `.github/copilot-instructions.md`: repo instructions matching React/Vite workflow and guardrails
- `.codex/skills/roadmap-project/SKILL.md`: project-specific implementation guidance
- `.codex/skills/roadmap-wrap-up/SKILL.md`: project-specific wrap-up and handoff guidance
- `.codex/skills/fresh-look-review/SKILL.md`: project-agnostic independent review skill

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
- Weekly and monthly timeline views now support both the original continuous horizontal board and a stacked layout mode that renders each visible week or month as its own board while still honoring `Hide Weekends`.
- In stacked monthly layout, users can now switch between day columns and week-range columns inside each month board.
- Stacked monthly `Split by Weeks` now assigns each visible week to exactly one month card instead of duplicating crossover weeks across adjacent months.
- Stacked monthly cards now show the visible date range as the top label instead of just the month name, and stacked weekly/monthly cards both use tighter vertical spacing around titles, headers, and task rows.
- In stacked monthly `Split by Weeks`, tasks now position against the actual owned days inside each displayed week span, so one-day tasks do not stretch across the full week bucket and cross-month tasks render through the owned visible week end.
- In stacked monthly `Split by Weeks`, overlapping boundary weeks now keep the current month's visible in-month workdays even when the calendar week starts in the prior month, so early-month weekday-only tasks still render with `Hide Weekends`.
- Special priority sorting and highlighting now use task `phase` or `category` values such as `Vacation`, `Holiday`, or `OOO`, and task bar colors stay driven by `categoryHex` instead of task name wording.
- Day borders remain visible above special priority overlays after the layered callout styling change.
- In stacked monthly `Split by Weeks`, compact task bars now use the same inline arrow flow as the regular task bars again, rather than special absolute-positioned arrow handling.
- Shared stacked task bars no longer reserve arrow-width placeholders on both sides; label padding now only appears on the side where a continuation arrow is actually shown.
- In stacked monthly `Split by Days` and stacked weekly views, the day-header border and background gridline between Friday and Monday (when weekends are hidden) now renders at 4px instead of 1px, visually marking the collapsed weekend gap.
- In stacked monthly `Split by Weeks`, a visible week span that collapses to one owned day now shows a single date label instead of repeating the same start/end date range.

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
- in weekly view, switch between horizontal and stacked layout and confirm each visible week renders as its own board without changing task selection, drag ordering, or task-table alignment
- in stacked weekly view, confirm the tighter spacing still leaves task labels readable and does not clip tall multi-line bars
- in monthly view, toggle `Show weekends` and confirm task bars compress horizontally while task dates stay unchanged
- in monthly view, switch between horizontal and stacked layout and confirm each visible month renders as its own board while still showing full-month coverage with weekend columns optionally hidden
- in stacked monthly layout, switch between `Split by Days` and `Split by Weeks` and confirm task spans, phase bars, and selection highlighting remain aligned
- in stacked monthly `Split by Weeks`, confirm crossover weeks appear only once, under the month that owns that week column, without duplicated bars or large leading blank areas
- in stacked monthly `Split by Weeks`, confirm one-day tasks render at one-day width, narrow bars still keep readable text, and cross-month tasks render through the owned displayed week span instead of clipping at the raw month end
- in stacked monthly `Split by Weeks` with `Hide Weekends`, add a Friday-only task in the first partial week of a month and confirm it remains visible
- in stacked monthly `Split by Weeks`, confirm continuation arrows and labels behave the same way as the regular inline task bars instead of collapsing into slivers or overlapping text
- confirm stacked task bars without continuation arrows no longer reserve empty left/right arrow space, while bars with continuation arrows still keep a small label gap on only that side
- confirm stacked monthly week headers that contain only one visible owned day render as a single date label, for example `Aug 31`, instead of `Aug 31 - 31`
- in stacked monthly `Split by Days` or stacked weekly view with weekends hidden, confirm the Friday-to-Monday boundary renders with a visibly thicker border (4px) than normal day-to-day borders (1px), while all other day boundaries stay thin
- filter the task list down to one or a few rows, open a task start/end date picker, and confirm the calendar popup stays above the timeline section
- confirm tasks tagged with `Vacation` or `Holiday` in `phase` or `category` still sort to the top and use their `categoryHex` color instead of task-name matching
- confirm day borders remain visible when a `Vacation` or `Holiday` task spans across multiple days
- in stacked monthly view, confirm the top date-range label and tighter week-header/task spacing still look balanced across short and dense months
- in calendar view, toggle `Show weekends` and confirm weekend columns hide/show
- export tasks to CSV when tasks are present

Latest verification, 2026-06-16 (weekend-gap divider):

- `npm run build`: passes
- `npm run lint`: fails on existing `.history/` snapshot files outside the active change set
- `npx eslint src/App.tsx`: passes
- `git diff --check`: passes
- browser/manual persistence verification: passed across add, edit, import, drag reorder, clear-all, and refresh, per user report
- browser/manual timeline-click verification: passed, per user report
- CSV export sanity check: export code still uses the full `tasks` array sorted by `displayOrder`, so timeline-click selection does not narrow the exported file
- browser/manual calendar verification: passed, per user report across calendar render, multi-month/date-range controls, week-spanning bars, spacing/alignment polish, weekend hiding, hidden-weekend month transitions, and month-view weekend compression
- stacked layout and split verification: build-verified and browser-verified (user confirmed weekend-gap divider looks good)
- weekend-gap divider: 4px border at Fri→Mon boundary when weekends hidden, confirmed visually by user

## Latest Change

Latest feature update, 2026-06-16 (weekend-gap divider):

- In stacked monthly `Split by Days` and stacked weekly views with weekends hidden, the day-header border and background gridline between Friday and the following Monday now renders at 4px instead of 1px.
- The thicker border is driven by a calendar-day-gap check (`differenceInCalendarDays > 1` between consecutive visible units), so it appears automatically wherever a weekend was collapsed and nowhere else.
- No change to continuous (non-stacked) monthly or weekly views, which have no per-day gridlines.

Latest feature update, 2026-06-15:

- Implemented a read-only calendar view based on the v2 mockup direction.
- Added calendar week-segment task bars with selection highlighting aligned to the task table filter behavior.
- Fixed calendar weekend hiding, month picker overlay stacking, and month-view weekend compression.
- Added browser-local task persistence with safe date hydration on reload.
- Extended calendar view with multi-month span controls and exact date-range selection.
- Reworked calendar task layout so labels stay centered regardless of continuation arrows, spacing is screenshot-friendly, and the browser-local persistence note sits outside the rounded calendar board.
- Added a month-start callout treatment that still marks the new month when weekends are hidden and the first lands off-grid.

Latest feature update, 2026-06-16:

- Added a weekly/monthly timeline layout toggle so users can switch between the original continuous horizontal board and a stacked per-week or per-month board layout.
- Kept `Hide Weekends` active in stacked mode, so each full week or full month still renders as its own board while hidden weekend columns stay removed from the visible grid.
- Preserved existing task bars, phase sections, timeline-click filtering, CSV export behavior, and browser-local persistence messaging.
- Added a stacked-month split toggle so each month board can render with either day columns or week-range columns without changing the rest of the app layout.
- Tightened stacked weekly/monthly spacing, reduced stacked month week-header padding, and changed stacked monthly titles to show the visible date range.
- Changed stacked monthly `Split by Weeks` to keep week headers while positioning task bars by actual day, so one-day and cross-month tasks render correctly inside owned week spans.
- Fixed stacked monthly `Split by Weeks` so boundary weeks contribute the current month's visible in-month days even when the week starts in the previous month, which restores Friday-only early-month tasks while `Hide Weekends` is active.
- Reverted the experimental compact stacked-month arrow/padding/label hacks and restored the normal inline arrow flow so continuation indicators consume the bar width naturally again.
- Removed shared stacked-bar arrow placeholder spans so only real continuation arrows introduce side-specific label padding.
- Cleaned up stacked monthly week-header formatting so single-day owned spans show a single date instead of a redundant one-day range.
- Assigned the task-table start/end date pickers their own high-z-index popper class so the calendar popup renders above filtered timeline content.
- Switched special-task detection away from task-name matching and onto `phase`/`category` values, while keeping visible colors tied to `categoryHex`.
- Raised the day grid border layer so `Vacation` and `Holiday` callouts no longer hide the visible day separators.

## Key Guardrails

- Keep spreadsheet paste/import flexible. Do not tighten it without a clear user request.
- Keep the task table and timeline behavior aligned. If imported or edited tasks do not appear in both places, treat that as a regression.
- Preserve CSV export when task fields or ordering behavior changes.
- Prefer incremental cleanup over major refactors. `src/App.tsx` is intentionally still the center of the app.
- Do not create commits or pull requests without explicit user confirmation.
- Update `README.md`, `CLAUDE.md`/`.github/copilot-instructions.md`, and this file when setup, workflow, import behavior, or repo guidance changes materially.

## Recommended Next Task

1. Manually verify stacked weekly and stacked monthly layout behavior in the browser, especially weekend hiding, task selection highlighting, long-month horizontal overflow, the stacked month day/week split toggle, and first-partial-week weekday-only tasks.
2. If stacked layout feels right, decide whether the layout toggle and month split toggle should remain plain buttons or become more explicit segmented controls.
3. Keep spreadsheet import flexible and preserve CSV export based on the full task list in manual `displayOrder`.
4. Keep broader calendar interactions such as drag/edit-in-calendar and cross-device sync out of scope until sharing expectations are clearer.

## New Chat Start

Start with:

- `README.md`
- `CLAUDE.md` (Claude Code) or `.github/copilot-instructions.md` (Copilot)
- `docs/handoff.md`
- `src/App.tsx`

If the task is skill-related, also read:

**Claude Code:**
- `.claude/skills/roadmap-project/SKILL.md`
- `.claude/skills/roadmap-wrap-up/SKILL.md`
- `.claude/skills/fresh-look-review/SKILL.md`

**Copilot:**
- `.codex/skills/roadmap-project/SKILL.md`
- `.codex/skills/roadmap-wrap-up/SKILL.md`
- `.codex/skills/fresh-look-review/SKILL.md`
