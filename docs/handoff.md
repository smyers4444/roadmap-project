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

Last updated: 2026-06-16 (Phase 5 complete on branch `phase-5-remove-phase-headers`, PR open)

## Current Snapshot

Roadmap Project v2 redesign—ground-up rewrite driven by product brief (`docs/product-brief.md`), targeting screenshot-first UX for client deliverables. v1 preserved as tag `v1` and worktree `../Roadmap Project v1/`.

**Branch:** `phase-5-remove-phase-headers` (off master; Phase 5 committed, PR open for merge)

**Latest commits:**
- `19f6f09` Update handoff: Phase 4 L1 complete, E6 verified, E7 scoped (post-merge on master)
- [Phase 4 merge] Merged PR #10: Presentation mode + task panel layout refactor
- `2c56bb3` E7: Refactor task panel layout to structural section below timeline
- `ab89363` Update handoff: Phase 4 complete, ready for merge or Phase 5 start

**Build:** `npm run build` passes clean. Dev server: `npm run dev` → `http://localhost:5173`.

## Phases Status

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 0 | Bug fixes (C1, I1, I2, V3) | ✅ Complete | Category colors, import grouping, line padding round-trip fixed |
| 1 | Layout shell | ✅ Complete | Header, settings panel, import modal, task panel UI |
| 2 | Timeline carryover | ✅ Complete | Packing, text wrapping, auto-color, special priority shading |
| 3 | Edit modal + colors | ✅ Complete | Modal editing, color/label source toggles, hex palette, relative timeline |
| **4a** | **L1 Presentation mode** | **✅ Complete** | Ctrl+P toggle, hides all controls, shows timeline + legend only |
| **4b** | **E6 Column sorting** | **✅ Complete** | Already implemented; verified working |
| **4c** | **E7 Task panel layout** | **✅ Complete** | Refactored to flexbox: single scroll direction, timeline pinned, task panel below |
| **5** | **Phase header removal (TL1, TL2)** | **✅ Complete** | Sonnet/Opus work. Phase bands + `showPhaseLabels` toggle removed; all tasks pack into one combined board per period. Committed on `phase-5-remove-phase-headers`, PR open. |
| **6** | **UX Polish (Haiku, 12 items)** | **📋 Backlog** | CSS + default flips + settings reorg. Anchored in product-brief.md. Starts after Phase 5 merges. |

## Phase 4 — Complete (L1 + E6 + E7)

### L1 Presentation Mode ✅

- **Keyboard:** Ctrl/Cmd+P
- **UI button:** 🎬 in header
- **Behavior:** Hides header, settings, import modal, task panel; shows dark overlay banner with exit instructions
- **Technical:** Added `paddingTop: 40px` to app when active (prevents banner overlay on timeline)

### E6 Column Header Sorting ✅

Already implemented and verified working. No changes needed.
- Column headers clickable for sort (▲/▼ indicators)
- All columns supported: Phase, Phase HEX, Category, Cat HEX, Task, Start, End, Order, Line Padding
- Row drag-to-reorder with ⠇ drag handle

### E7 Task Panel Layout ✅

**Merged to master in PR #10.** Refactored from overlay to structural layout:
- **Layout:** `.app` uses flexbox column (height: 100vh), new `.v2-content-area` wrapper with `overflow-y: auto` for single scrollable region
- **Header:** Sticky at top (z-index: 100), doesn't move when scrolling
- **Timeline + Legends:** Inside scrollable content area
- **Task Panel:** Below timeline in DOM flow, expands/collapses, adds to page height
- **Result:** Single scroll direction (vertical), timeline pinned at top, no overlaps
- **Verification:** All features tested, builds and lints clean

## Phase 5 — Phase Header Removal (TL1, TL2) ✅

**Complete on `phase-5-remove-phase-headers` (PR open).** Sonnet/Opus work — touched the shared render primitive, so it was split out from the Haiku batch and landed first.

- **TL1** — Removed the dark phase header bands and per-phase grouping from `renderStackedTimelineBoard` and both inline horizontal boards. All tasks now pack into one combined board per period. Phase remains a color/label source (C4/C5).
- **TL2** — Removed the `showPhaseLabels` state, its Settings → Display toggle, the orphaned "Phase Key" legend, and the unused `phases`/`visibleLegendPhases` derivations.
- **Approach:** collapsed onto the existing `showPhaseLabels === false` path (already working) rather than inventing new layout.
- **Verified:** `npm run build` clean, `npx eslint src/App.tsx` clean, browser render confirmed.

## Phase 6 — UX Polish (Haiku) 📋

Anchored and prioritized in `docs/product-brief.md`. Starts **after Phase 5 merges** so Haiku reorganizes a stable settings panel.
- **Rock-solid (CSS + default flips):** LY1 white bg, LY2 100% width, HD1 icon padding, TP1 grid lines (transparent variable), TP4 row buttons, DF1 defaults (months/stacked/split-by-days/weekends-off), DF2 fit-to-data default.
- **Settings-reorg cluster (borderline):** TP2, TP3, TP5, ST1, ST2 — pull back to Sonnet if state wiring breaks on the JSX move.
- **Deferred (design-needed):** TL3 day column widths, TL5 day header display.

## Next Steps

1. **Merge Phase 5 PR** into master and delete the remote branch.
2. **Then Phase 6** (Haiku): branch off updated master; do the rock-solid batch first (LY1, LY2, HD1, TP1, TP4, DF1, DF2), then the settings-reorg cluster (TP2, TP3, TP5, ST1, ST2 — pull back to Sonnet if state wiring breaks).
3. **Defer** TL3/TL5 until day-column and day-header decisions are made.

## New Chat Start

Read these first:
- `README.md`
- `CLAUDE.md`
- `docs/handoff.md` (this file)
- `docs/product-brief.md` (for Phase 5/6 backlog and design decisions)

Current state: Phases 0–4 complete and merged to master. Phase 5 (phase header removal, TL1+TL2) complete on `phase-5-remove-phase-headers` with an open PR. Phase 6 (Haiku UX polish) documented and waiting for Phase 5 to merge. All v1 carryover features preserved. Build clean, lint clean.
