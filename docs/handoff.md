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

Last updated: 2026-06-15 (timeline-click selection plus export/button cleanup)

## Current Snapshot

The repository contains a working React + TypeScript roadmap planning board built with Vite.

The app combines:

- an editable task table
- a tab-separated spreadsheet import flow with preview/edit before import
- a weekly or monthly timeline view
- drag-and-drop task ordering
- CSV export of the current tasks

The main implementation lives in `src/App.tsx`, with styling in `src/App.css` and `src/index.css`.

Recent repo-level cleanup work has added project-local Codex skills and refreshed repo instructions:

- `.codex/skills/roadmap-project/`: project-specific implementation guidance
- `.codex/skills/roadmap-wrap-up/`: project-specific wrap-up and handoff guidance
- `.codex/skills/fresh-look-review/`: project-agnostic independent review skill, cleaned up for reuse
- `.github/copilot-instructions.md`: rewritten to match this repo's actual React/Vite workflow and guardrails

There are now separate feature notes for:

- completed weekend-toggle work at `docs/feature-weekend-toggle.md`
- proposed layout-orientation work at `docs/feature-layout-orientation-toggle.md`
- CSV week-number export work at `docs/feature-export-week-number.md`
- proposed timeline-click filtering work at `docs/feature-timeline-click-filters-list.md`

## Branch And Working Tree

Recent committed baseline before this feature:

- `57f0d89` `Add weekly weekend toggle`
- `4d75c8f` `Update roadmap feature docs`
- `11ef02f` `Export week number in CSV`

Current feature state for timeline-click task filtering:

- Timeline task bars in both weekly and monthly view now support single-select filtering into the task table only.
- The timeline stays fully visible, with the selected bar highlighted and the other bars slightly de-emphasized.
- Repeat-click clears the selection, and the task filter area exposes a visible clear action.

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
- switch between weekly and monthly views
- in weekly view, toggle `Show weekends` and confirm headers and bar positions compress to visible workdays without affecting monthly view
- export tasks to CSV when tasks are present

Latest verification, 2026-06-15:

- `npm run build`: passes
- `npm run lint`: fails on existing `.history/` snapshot files outside the active change set
- `npx eslint src/App.tsx`: passes
- `git diff --check`: passes
- browser/manual timeline-click verification: passed, per user report
- CSV export sanity check: export code still uses the full `tasks` array sorted by `displayOrder`, so timeline-click selection does not narrow the exported file

## Latest Change

Latest feature update, 2026-06-15:

- Updated single-select timeline-click filtering in `src/App.tsx` so selection narrows only the task table.
- Kept the timeline fully visible and added stronger selected-bar emphasis.
- Confirmed CSV export still runs against the full task list in manual order.
- Gated the user-facing `Add Test Task` button to dev mode only.
- Updated `README.md`, `docs/feature-timeline-click-filters-list.md`, and this handoff note to reflect the revised interaction.

## Key Guardrails

- Keep spreadsheet paste/import flexible. Do not tighten it without a clear user request.
- Keep the task table and timeline behavior aligned. If imported or edited tasks do not appear in both places, treat that as a regression.
- Preserve CSV export when task fields or ordering behavior changes.
- Prefer incremental cleanup over major refactors. `src/App.tsx` is intentionally still the center of the app.
- Do not create commits or pull requests without explicit user confirmation.
- Update `README.md`, `.github/copilot-instructions.md`, and this file when setup, workflow, import behavior, or repo guidance changes materially.

## Recommended Next Task

1. Do a browser pass on the current branch to verify filtered-list drag ordering still feels correct after timeline selection.
2. Then decide whether broader timeline interactions such as phase/category clicks are still desirable or unnecessary.
3. If the timeline interaction model is stabilizing, capture it in a small feature note before the next UI slice.

## New Chat Start

Start with:

- `README.md`
- `.github/copilot-instructions.md`
- `docs/handoff.md`
- `src/App.tsx`

If the task is skill-related, also read:

- `.codex/skills/roadmap-project/SKILL.md`
- `.codex/skills/roadmap-wrap-up/SKILL.md`
