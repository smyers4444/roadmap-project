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

Last updated: 2026-06-16 (Phase 3 edit modal smoke-tested; build/lint/diff clean)

## Current Snapshot

The repository is now on the `v2` branch. This is a ground-up redesign effort driven by a product brief at `docs/product-brief.md`. The goal is to move from a feature-accumulation codebase to a design-led product with a clear layout, screenshot-first UX, and cleaner controls.

**v1 is preserved** as a git tag (`v1`) and a local worktree at `../Roadmap Project v1/` running on its own dev server port. v1 should not be modified.

The main implementation lives in `src/App.tsx`, with styling in `src/App.css` and `src/index.css`. Phase 0 bug fixes are complete, Phase 1 (v2 layout shell) is complete, and Phase 2 now has three bounded commits on branch `feat/phase-2-settings`: `3f5f1e2 Wire Phase 2 settings controls`, `a390e0b Tighten Phase 2 timeline carryover`, and `1ead8d6 Extend Phase 2 priority shading`. A follow-up browser pass on 2026-06-16 verified the Compact rows toggle and priority-period shading behavior across weekly horizontal, monthly horizontal, and monthly stacked views. A new Phase 3 edit-modal slice is now in place and browser-checked: row actions open an edit modal with live task fields, and Prev/Next steps through the current sort order.

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

- `codex/phase-3-edit-modal` — active development branch based on `master` at `310231c`; v1 baseline is still preserved as tag `v1`
- Working tree — Phase 3 edit-modal work is now in `src/App.tsx` and `src/App.css`, tracked diff includes `docs/handoff.md`, unrelated `.claude/settings.json` remains dirty, and untracked `AGENTS.md` plus `.agents/` are present
- `../Roadmap Project v1/` — local worktree pinned to v1 tag for side-by-side reference

## How to Run

```bash
npm install
npm run dev
```

v2 (feat/phase-1-layout): `http://localhost:5173` (or 5174 if 5173 is occupied)
v1 (worktree): `cd "../Roadmap Project v1" && npm run dev` → `http://localhost:5174`

## How to Verify

```bash
npm run build
npx eslint src/App.tsx
git diff --check
```

## Design Package — Complete

The v2 design work is done and committed. Do not start implementation without reading both:

- `docs/product-brief.md` — full requirements, carryover inventory (K1–K18), build order
- `docs/mockups/v2-layout-mockup.html` — open in browser; 7 annotated states covering every surface

Four open design questions remain in `product-brief.md` (hex palette, calendar retirement, relative-mode anchor, phase bars). These can be decided during Phase 3; they don't block Phase 0–2.

## Phase 0 Status — Complete (except V3)

| Bug | Status | Notes |
|-----|--------|-------|
| C1 — category colors | Fixed | All 4 `bgColor` callsites now strip any existing `#` before prepending, matching how `blendHexWithWhite` and `getTextColor` already handled it. Affects weekly view, both stacked monthly views, and the category key legend. |
| I1 — import row merging | Fixed | Removed the `GROUP TASKS` block in `importTasks`. Rows are no longer collapsed by `phase\|category\|name` key — every row becomes its own task. |
| I2 — line padding round-trip | Verified working | `case "line padding"` was already present in the import switch. The grouping (I1) was the actual cause of `lineHeightAdjust` loss on re-import. Removing I1 fixes I2 too. |
| V3 — calendar date bleed | Not started | Fold into "retire calendar" decision (open design question #2). |

## Phase 1 Status — Complete

| Item | Status | Notes |
|------|--------|-------|
| 48px v2 header | Done | Logo · Weekly/Monthly/Stacked tabs (centered) · Import/⚙/Export (right) |
| Settings panel | Done | Range mode radio, Layout/Display toggles, Danger section; backdrop closes on outside click |
| Import modal | Done | Paste area → preview table → Import button; z-index 2000 |
| Task panel tab | Done | Collapsed by default (hidden), expands on click to full sortable table |
| compactTaskSpacing state | Done | Wired to all 3 renderStackedTimelineBoard stacked calls |
| Build | Clean | `npm run build` passes with no errors |
| Browser verification | PASS | All 4 flows verified via Playwright headless |

New state added: `showSettingsPanel`, `showImportModal`, `showTaskPanel`, `compactTaskSpacing`, `rangeMode`, `showHexColumns`. Old UI toggles (`showTaskList`, `showImportSection`, `showTimeline`) removed. Calendar state setters removed (no v2 UI controls for calendar navigation).

## Phase 2 Browser Verification — PASS

- `Compact rows` ON/OFF was verified in weekly horizontal, monthly horizontal, monthly stacked split-by-days, and monthly stacked split-by-weeks.
- With `Compact rows` ON, non-overlapping execution tasks share rows; with it OFF, those same tasks step down one row at a time as intended.
- Priority-period shading is visible in weekly horizontal, monthly horizontal, and both monthly stacked split modes for the seeded Holiday/PTO spans.
- The current V4 behavior is hardcoded through `isSpecialPriorityTask` (`Vacation` / `Holiday` / `OOO`) and looks stable enough to close the Phase 2 carryover slice.
- `L4` configurable priority labels should be treated as a Phase 3 / net-new follow-on, not Phase 2 cleanup. The product brief still marks it as `New` + `Missing`, and the current shipped behavior already satisfies the carryover verification target.

## Phase 3 Edit Modal — PASS

- Added a row-level `Edit` action that opens a modal with real form inputs for task name, sub-task, phase, category, owner, week, dates, display order, line padding, and both hex fields.
- Modal edits save immediately and the browser smoke test confirmed the change persists back into the task table row.
- `Prev` / `Next` now steps through tasks in the current sort order, and the browser smoke test confirmed the modal advances from task 1 to task 2.
- The row-level duplicate action remains available alongside the new edit flow.

## Recommended Next Task

Pick the next Phase 3 candidate from `docs/product-brief.md`:
- `C4/C5` label/color source controls are the cleanest follow-on now that the edit modal is in place
- `E9` right-click-to-edit is another small follow-on if direct timeline access is the priority
- `C2` hex palette management can wait until the display/edit affordances settle

## New Chat Start

Read only these two files to orient:

- `CLAUDE.md`
- `docs/handoff.md`

Pull in `src/App.tsx`, `README.md`, `docs/product-brief.md`, or skill files only once the specific task is clear.
