# Handoff Notes

## Maintenance Instructions

This file is a rolling current-state brief for handing work to another chat and for quickly resuming the project after time away. Keep it concise.

- Replace stale status instead of appending a running journal.
- Keep the file near 1-2 pages when practical.
- Record durable repo rules in `CLAUDE.md`, not here.
- Record skill-specific behavior in `.claude/skills/`, not here.
- Use this file as the first current-state read for a fresh chat after `README.md`.
- Prefer current branch/worktree status, recent changes, verification state, and next steps over broad project history.
- Update this file after material implementation changes, commits, or verification results.
- Always leave the next recommended task clear enough for a new agent to start.

Last updated: 2026-06-16 (v2 branch created; docs cleaned up; product brief written)

## Current Snapshot

The repository is now on the `v2` branch. This is a ground-up redesign effort driven by a product brief at `docs/product-brief.md`. The goal is to move from a feature-accumulation codebase to a design-led product with a clear layout, screenshot-first UX, and cleaner controls.

**v1 is preserved** as a git tag (`v1`) and a local worktree at `../Roadmap Project v1/` running on its own dev server port. v1 should not be modified.

The main implementation lives in `src/App.tsx`, with styling in `src/App.css` and `src/index.css`. No v2 implementation work has started yet — the codebase is currently identical to v1.

## What v1 Has (all still in the codebase)

- Editable task table with drag-to-reorder
- Tab-separated spreadsheet import with preview before import
- Weekly and monthly timeline views (horizontal and stacked layouts)
- Stacked monthly split-by-days and split-by-weeks modes
- Calendar view
- Weekend toggle (affects weekly, monthly, and calendar views)
- Timeline-click task selection filter
- CSV export (includes week number)
- Browser-local task persistence
- Special priority treatment for Vacation / Holiday / OOO tasks
- Category key / legend

## v2 Direction

See `docs/product-brief.md` for the full brief. Key points:

- **Primary output is a screenshot** that goes into a PowerPoint deck
- **Excel is the data source** — paste/import is the primary entry workflow
- **Monthly horizontal view** is the most-used and most client-friendly
- **Stacked layouts** solve the unreadable single-day-task problem
- **Calendar view** is under review — may overlap with stacked monthly now that stacked exists

**Design principles driving v2:**
1. Screenshot-first — timeline must look presentation-quality without manual cleanup
2. View = audience — view selector is the most important control, not one of eight equal buttons
3. Every task must be legible at screenshot scale
4. Controls live out of the way; the timeline owns the space

## Branch and Working Tree

- `master` — v1 baseline, tagged as `v1`
- `v2` — active development branch (current)
- `../Roadmap Project v1/` — local worktree pinned to v1 tag for side-by-side reference

## How to Run

```bash
npm install
npm run dev
```

v2: `http://localhost:5173`
v1 (worktree): `cd "../Roadmap Project v1" && npm run dev` → `http://localhost:5174`

## How to Verify

```bash
npm run build
npx eslint src/App.tsx
```

## Recommended Next Task

1. Design the v2 layout — agree on where controls live, what presentation mode looks like, and what the user sees first — before writing any code. Create mockups in `docs/mockups/`.
2. Answer the five open design questions in `docs/product-brief.md` before implementation begins.
3. Fix the color codes bug (C1 in product brief) — high priority since color is central to the deliverable.
4. Fix the import deduplication bug (I1) — breaks Vacation/Holiday entries.

## New Chat Start

Read only these two files to orient:

- `CLAUDE.md`
- `docs/handoff.md`

Pull in `src/App.tsx`, `README.md`, `docs/product-brief.md`, or skill files only once the specific task is clear.
