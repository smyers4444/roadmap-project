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

Last updated: 2026-06-15 (weekend toggle implementation)

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

There are now separate feature-planning notes for the proposed timeline enhancements at `docs/feature-weekend-toggle.md` and `docs/feature-layout-orientation-toggle.md`.

## Branch And Working Tree

At the time of this handoff, there are uncommitted local changes.

- `src/App.tsx` now includes a weekly `Show weekends` toggle that switches weekly rendering between 7-day and 5-day visible-day math without changing task data, import behavior, or CSV export.
- `src/App.tsx` still contains the recent import fallback fix and filtered timeline/legend alignment work from the previous slice.
- `README.md` has been updated to mention the new weekly weekend-toggle behavior.

These changes have not been committed yet in the current branch.

The active working branch should be confirmed before committing or opening a PR.

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
- `npx eslint src/App.tsx`: passes
- browser smoke check: not yet run in this handoff

## Latest Change

Latest local changes, 2026-06-15:

- Added a weekly `Show weekends` control in `src/App.tsx`.
- Extracted weekly visible-day math so weekly headers, phase spans, task bars, and visible legends stay aligned in both 7-day and 5-day rendering.
- Weekend hiding is rendering-only: task dates, importer flexibility, and CSV export stay unchanged.
- `README.md` now notes the weekly weekend-toggle behavior.

## Key Guardrails

- Keep spreadsheet paste/import flexible. Do not tighten it without a clear user request.
- Keep the task table and timeline behavior aligned. If imported or edited tasks do not appear in both places, treat that as a regression.
- Preserve CSV export when task fields or ordering behavior changes.
- Prefer incremental cleanup over major refactors. `src/App.tsx` is intentionally still the center of the app.
- Do not create commits or pull requests without explicit user confirmation.
- Update `README.md`, `.github/copilot-instructions.md`, and this file when setup, workflow, import behavior, or repo guidance changes materially.

## Recommended Next Task

1. Verify in the browser that filtering behaves as expected in both weekly and monthly timeline views.
2. Verify the weekly weekend toggle with tasks that start or end on Saturday/Sunday and with tasks that span Friday to Monday.
3. If that looks good, the next contained UI cleanup is to remove or gate the user-facing `Add Test Task` button so the production editing surface stays focused on real planning actions.

## New Chat Start

Start with:

- `README.md`
- `.github/copilot-instructions.md`
- `docs/handoff.md`
- `src/App.tsx`

If the task is skill-related, also read:

- `.codex/skills/roadmap-project/SKILL.md`
- `.codex/skills/roadmap-wrap-up/SKILL.md`
