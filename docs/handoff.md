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

Last updated: 2026-06-16 (Phase 4: L1 complete on feat/phase-4-presentation-mode; Phase 5 backlog documented; product-brief updated with Phases 0-4 status)

## Current Snapshot

Roadmap Project v2 redesign—ground-up rewrite driven by product brief, targeting screenshot-first UX for client deliverables. v1 preserved as tag `v1` and worktree `../Roadmap Project v1/`.

**Current branch:** `feat/phase-4-presentation-mode` (11 commits ahead of master)
- L1 Presentation mode: complete, verified
- E6 Column sorting: verified working
- E7 Task panel layout: complete, refactored to collapsible section below timeline
- Product-brief: updated with Phases 0-4 status + Phase 5 backlog (17 items)
- Master branch: 1 commit ahead (handoff update from earlier session)

**Latest commits on feat/phase-4-presentation-mode:**
- [new] E7: Refactor task panel layout—flexbox structure, scrollable content area, single scroll direction
- `f1a1ccd` Mark TL5 as design decision: undecided on day-of-week display
- `c5f0182` Add TL4: Week labels in monthly view header
- `ec828c6` Fix: Add top padding in presentation mode to prevent banner overlay
- `4384fb5` Add L1 Presentation mode—hide all controls, show timeline only

**Build:** `npm run build` passes clean. Lint: `npx eslint src/App.tsx` clean.

## Phases Status

| Phase | Status | Notes |
|-------|--------|-------|
| 0 | ✅ Complete | C1, I1, I2 fixed; V3 deferred |
| 1 | ✅ Complete | Layout shell, header, settings, import modal, task panel |
| 2 | ✅ Complete | Timeline carryover: packing, wrapping, auto-color, special overlays |
| 3 | ✅ Complete | Edit modal, color/label toggles, hex palette, relative timeline |
| 4a (L1) | ✅ Complete | Presentation mode: Ctrl+P toggle, hides controls, shows timeline only |
| 4b (E6) | ✅ Verified | Column header sorting already working; no action needed |
| 4c (E7) | ✅ Complete | Task panel layout refactor: flexbox structure, scrollable content area, single scroll direction |
| **5** | 📋 **Backlog** | **17 UX polish items documented; ready for prioritization** |

## Phase 4 — L1 Presentation Mode ✅ Complete

**Feature:** Hide all controls (header, settings, import modal, task panel), show timeline + legend only. Screenshot-ready.

**Implementation:**
- Keyboard: Ctrl/Cmd+P
- UI button: 🎬 in header
- Dark overlay banner shows exit instructions
- Auto-closes open panels on activation
- Fixed: added `paddingTop: 40px` to prevent banner overlay on timeline

**Verification:** Build clean, feature tested (presentation mode accessible, banner visible, timeline unobstructed).

## Phase 4 — E7 Task Panel Layout Refactor ✅ Complete

**Feature:** Refactor task panel from overlay-based to structural layout below timeline. Single scroll direction (vertical), no overlaps, clean flexbox architecture.

**Implementation:**
- Changed `.app` layout from `position: relative` to `display: flex; flex-direction: column; height: 100vh`
- Added `.v2-content-area` wrapper: `flex: 1; overflow-y: auto` (scrollable content region)
- Task panel tab/panel: `flex-shrink: 0` (don't shrink, maintain consistent height)
- Table wrapper in panel: `flex: 1; overflow-y: auto` (allows panel table to scroll while panel itself doesn't)
- Header: remains sticky with `z-index: 100` (stays visible during scroll)
- Single scroll direction: entire page scrolls vertically as one unit

**Verification:** Build clean, lint clean, structure properly separated.

## Phase 5 — UX Polish & Layout Cleanup 📋 Backlog

17 items documented in `docs/product-brief.md`:

**Quick wins (low effort):**
- LY1: white background (not grey)
- LY2: 100% viewport width (remove left overhang)
- HD1: settings icon padding
- TP1: remove vertical grid lines in task table
- TP4: restyle action buttons (grey outline, bigger, trash icon for delete)
- TL1/TL2: remove phase header bars + toggle
- DF1/DF2: change defaults (monthly/stacked/weekends-off/compact, fit-to-data range mode)

**Medium lift:**
- TP2: expand Line Padding column visibility
- TP3: line padding auto-increment by 0.25
- TP5: move "Show hex columns" to task settings
- ST1: move color palette to task settings
- ST2: Range Mode radio → dropdown

**Design-needed (undecided):**
- TL3: consistent day column widths across month boundaries
- TL4: week labels in monthly view header
- TL5: day header display with "Show week/month #" toggle (keep "Mon" or just "6"?)

## What v1 Has (all preserved in v2)

- Editable task table with drag-to-reorder
- Tab-separated spreadsheet import with preview
- Weekly and monthly timeline views (horizontal and stacked layouts)
- Stacked monthly split-by-days/weeks
- Calendar view
- Weekend toggle
- Timeline-click task selection filter
- CSV export (includes week number)
- Browser-local task persistence
- Special priority treatment (Vacation/Holiday/OOO)
- Category legend

## How to Run

```bash
npm install
npm run dev
```

v2 (master/branches): `http://localhost:5173`
v1 (worktree): `cd ../Roadmap\ Project\ v1 && npm run dev` → `http://localhost:5174`

## How to Verify

```bash
npm run build
npx eslint src/App.tsx
git diff --check
```

## Next Steps

**Option A: Merge L1 to master**
- `git checkout master`
- `git merge feat/phase-4-presentation-mode`
- Creates PR or direct merge
- Clears the feature branch

**Option B: Start Phase 5 work**
- Create new branch `feat/phase-5-ux-polish`
- Batch quick wins first (7–8 items, ~1–2 hours)
- Then medium-lift refinements
- Leave design-needed items for later decision

**Recommended:** Merge L1 first (clean state), then start Phase 5 on a fresh branch.

## New Chat Start

Read first:
- `README.md`
- `CLAUDE.md`
- `docs/handoff.md` (this file)

Then:
- `docs/product-brief.md` — Phases 0–5 status + full requirements
- `src/App.tsx` — main implementation (~3700 lines, organized in 3 layers)

If starting Phase 5 work, consult the "Quick wins" checklist and design items in product-brief.md Phase 5 section.
