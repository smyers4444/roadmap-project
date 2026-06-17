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

Last updated: 2026-06-17 (Phase 6: TP6/TP7/TP8 complete; ST1/TP5 color+hex settings consolidated; TP2 line padding tuned; LY3 stacked header toggle removed; TL4 stacked monthly title compacted on branch `phase-6-ux-polish`)

## Current Snapshot

Roadmap Project v2 redesign—ground-up rewrite driven by product brief (`docs/product-brief.md`), targeting screenshot-first UX for client deliverables. v1 preserved as tag `v1` and worktree `../Roadmap Project v1/`.

**Branch:** `phase-6-ux-polish` (off master; Phase 5 already merged into master)

**Latest commits:**
- `b6164ff` TP8: Use SVG gear icon for task view settings—match Settings button style
- `c58ad0f` TP8: Consolidate task view settings—one gear icon, unified modal
- `cb075e9` TP8: Redesign color settings—modal popup, toolbar button, functional inputs
- `262bab5` TP8: Add dedicated Colors settings panel
- `039cd06` TP8: Fix Category Key inline styles—alignment, spacing, square sizing
- `2283232` TP7: Reduce vertical task row padding from 4px to 2px
- `4300fd0` TP6: Set Actions column width to 110px

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
| **6** | **UX Polish (Haiku, 12 items)** | **🚀 In Progress** | Rock-solid batch (LY1, LY2, HD1, TP1, TP4, DF1, DF2) complete. TP6/TP7/TP8 (Action column, task row padding, Category Key) complete. ST1/TP5 (color settings + hex toggle → task panel modal) complete. TP2 (Line Padding width) complete. Remaining: any design-scoped holdouts. |

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

**Complete & merged to master (PR #11).** Sonnet/Opus work — touched the shared render primitive, so it was split out from the Haiku batch and landed first.

- **TL1** — Removed the dark phase header bands and per-phase grouping from `renderStackedTimelineBoard` and both inline horizontal boards. All tasks now pack into one combined board per period. Phase remains a color/label source (C4/C5).
- **TL2** — Removed the `showPhaseLabels` state, its Settings → Display toggle, the orphaned "Phase Key" legend, and the unused `phases`/`visibleLegendPhases` derivations.
- **Approach:** collapsed onto the existing `showPhaseLabels === false` path (already working) rather than inventing new layout.
- **Verified:** `npm run build` clean, `npx eslint src/App.tsx` clean, browser render confirmed.

## Phase 6 — UX Polish (Haiku) 🚀 In Progress

### Rock-solid batch ✅ Complete

**Branch:** `phase-6-ux-polish` | **Commit:** `795074f`

- **LY1** — Background color: grey (#f5f5f5) → white (#ffffff). Updated `#root` and `.app`.
- **LY2** — Page width: 1800px → 100% (remove left overhang). Updated `#root` width.
- **HD1** — Settings icon padding reduction: button padding 5px 12px → 4px 8px (smaller hit targets for icon-only buttons).
- **TP1** — Vertical grid lines in task table: added CSS variable `--task-grid-line: transparent` (controlled toggleable); applied to `.v2-task-table td` with `:last-child` exception.
- **TP4** — Row action buttons (Edit/Copy/Delete): new `.v2-task-row-action` CSS class matching `.v2-panel-export` style (grey outline, icon-friendly spacing, hover state).
- **DF1** — View defaults: `view` "weeks" → "months", `timelineLayout` "horizontal" → "stacked", `showWeekends` true → false, split type already "day" (Split by Days).
- **DF2** — Range mode default: `rangeMode` "rolling" → "fit" (fit-to-data on startup).

**Verified:** `npm run build` clean, `npx eslint src/App.tsx` clean, browser preview working (white bg, full width, stacked+days layout, no weekends, fit-to-data range).

### TP6, TP7, TP8 batch ✅ Complete

**Branch:** `phase-6-ux-polish`

- **TP6** — Actions column width set to 110px so Edit/Copy/Delete buttons don't wrap.
- **TP7** — Task row vertical padding reduced: `padding: 4px 6px` → `padding: 2px 6px` for denser task list.
- **TP8** — Category Key legend spacing and alignment overhaul:
  - Fixed in `App.tsx` inline styles (the CSS classes in `App.css` for `.category-key-list` etc. are dead code — not referenced in JSX).
  - `rowGap` reduced from 12px → 8px; kept `columnGap: 12px`.
  - Item rows changed from `alignItems: "center"` → `"flex-start"` to eliminate phantom vertical gaps from multi-line labels.
  - Color squares locked: `minWidth/minHeight: 20px`, `flexShrink: 0`.
  - Category name text: `lineHeight: 1.2` for tighter wrapping.
  - Heading bottom margin: 12px → 10px.

**Verified:** `npm run build` clean, browser verified with live task data.

**Note:** `.category-key-list`, `.category-key-item`, `.category-color`, `.category-name` CSS classes in `App.css` are dead code — they have no `className` references in App.tsx. Safe to remove in a future cleanup pass.

### ST1, TP5 batch ✅ Complete

**Branch:** `phase-6-ux-polish` | **Commits:** `262bab5`, `cb075e9`, `c58ad0f`, `b6164ff`

Settings reorganization: consolidated color management + hex toggle into a unified Task View Settings modal.

**What changed:**
- **Old:** Color Palette section in task panel (grid of colors + category mapping dropdowns); Hex toggle as standalone button in task panel toolbar.
- **New:** Dedicated "Task View Settings" modal (gear icon button ⚙ in task panel toolbar) containing Display + Phases + Categories sections.
  - **Display section:** "Show hex columns" checkbox (replaces standalone toggle).
  - **Phases section:** Editable hex colors for each phase found in tasks.
  - **Categories section:** Editable hex colors for each category found in tasks.
  - **Functional:** Editing a phase/category hex color updates all tasks with that phase/category in real-time.
- **Icon:** SVG gear icon matching the Settings gear in the top toolbar (not emoji).
- **Positioning:** Modal pops out centered below task panel when clicked, dismissible via backdrop or close button (X).
- **Removed:** Old "Color Palette" grid display and "Categories mapped" selector UI.

**Verified:** `npm run build` clean, browser verified with live task data, color inputs functional.

## Phase 6 — UX Polish (Haiku) 📋

Anchored and prioritized in `docs/product-brief.md`. Starts **after Phase 5 merges** so Haiku reorganizes a stable settings panel.
- **Rock-solid (CSS + default flips):** LY1 white bg, LY2 100% width, HD1 icon padding, TP1 grid lines (transparent variable), TP4 row buttons, DF1 defaults (months/stacked/split-by-days/weekends-off), DF2 fit-to-data default.
- **Settings-reorg cluster (borderline):** TP2, TP3, TP5, ST1, ST2 — pull back to Sonnet if state wiring breaks on the JSX move.
- **Deferred (design-needed):** TL3 day column widths, TL5 day header display.

## Next Steps

**Remaining Phase 6 work:** none; only deferred design decisions remain.

**✅ Complete:**
- TP2 (Line Padding column width tuned for readability)
- TP3 (Line padding increment buttons)
- TP5 (Hex toggle moved to Task View Settings modal)
- ST1 (Color settings moved to Task View Settings modal, now functional)
- ST2 (Range Mode converted to dropdown)
- LY3 (Removed "Stacked" from the top-level header; stacking is controlled in settings)
- TL4 (Monthly view header now shows month on top, weeks below, with compact sizing; stacked monthly matches the compact treatment)

**After Phase 6 Polish complete:**
- **Merge to master** and open PR for review.
- **Defer TL3/TL5** until day-column width and day-header label decisions are made.

## New Chat Start

**Read first:**
- `README.md` — overview and setup
- `CLAUDE.md` — project guidance and conventions
- `docs/handoff.md` — this file
- `docs/product-brief.md` — Phase 6 remaining items and design decisions

**Current state:** Phases 0–5 merged to master. Phase 6 on `phase-6-ux-polish` branch: rock-solid batch (LY1–TP4, DF1–DF2) + TP6/TP7/TP8 (column widths, padding, legend spacing) + ST1/TP5 (color settings modal, hex toggle consolidated) all complete. TP2 is tuned to `100px` for readability. LY3 and TL4 are now complete; stacked monthly titles now use compact month ranges with the year, followed by a lighter week callout. All v1 features preserved. Build/lint clean, browser verified. Ready for the next scoped UI task or merge to master for PR.
