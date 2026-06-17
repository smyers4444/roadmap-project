# Roadmap Project — Product Brief

## What This Is

A client deliverable creation tool for consultants who build project roadmaps. The primary output is a **screenshot of a timeline that goes into a PowerPoint slide**. Excel is the source of truth for data; this tool's job is to render that data beautifully and make it easy to screenshot.

## Primary User & Context

- A consultant creating roadmap deliverables for clients
- Working on a laptop
- Workflow: paste from Excel → choose a view → adjust settings → take a cropped screenshot of just the timeline → drop into deck
- Audience for the screenshot: clients in presentations and written deliverables
- Sometimes the category legend is included in the screenshot; sometimes it isn't

## Core Workflow

1. Paste tab-separated data from Excel (or maintain in-app now that persistence exists)
2. Choose a view based on the audience and project length
3. Toggle settings (weekends, phases, stacked layout, etc.)
4. Take a cropped screenshot of just the timeline area
5. Paste into a PowerPoint slide that has its own header and footer

## Design Principles

| # | Principle | What It Means |
|---|-----------|---------------|
| 1 | **Screenshot-first** | The timeline must look presentation-quality without cleanup. Controls should never appear in the final output. |
| 2 | **View = audience** | The view selector is the most important choice. Each view has a specific job (see Views table). |
| 3 | **Excel owns the data** | Paste/import is the primary entry point. In-app editing is a convenience, not a core workflow. The tool should never fight how data lives in Excel. |
| 4 | **Every task must be legible** | Single-day tasks, short durations, and stacked categories all need readable labels at screenshot scale. If text can't be read, the layout failed. |
| 5 | **Secondary data earns its place** | Phases, week numbers, and other details should only appear when they add meaning. They should be easy to toggle off and shouldn't clutter the view when off. |

## Views

| View | Best For | Notes |
|------|----------|-------|
| Monthly horizontal | Longer projects; phase/category overview for decks where you don't go to task level | Cleanest for screenshots; most client-friendly; most-used view |
| Stacked monthly — Split by Days | Day-level detail; short-duration tasks that would get smooshed in horizontal | Solves the unreadable single-day task problem |
| Stacked monthly — Split by Weeks | Multi-month projects with week-level granularity | Good for showing phase spans across months |
| Stacked weekly | Short projects; week-by-week breakdown | Gets very long for 3+ month projects |
| Calendar | Under review — may overlap with stacked monthly now that stacked exists | Assess whether it still earns its place |

---

## Requirements & Backlog

Grouped by area. **Type:** Bug = broken, Fix = works but wrong, Enhancement = existing feature needs improvement, New = doesn't exist yet, Design = needs design thinking before code. **Status:** Working, Broken, Partial, Missing.

### Layout & Controls

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| L1 | Presentation / clean mode: hide all controls, show only timeline + optional legend | New | Missing | **Biggest single UX win.** Currently requires manual cropping every time. |
| L2 | Redesign control area: 7–8 equal-weight toggle buttons need hierarchy and grouping | Design | Broken UX | View selector is the most important choice but looks like one of many equal buttons. |
| L3 | Redesign task section: import + add + filter layout is clunky and takes too much vertical space | Design | Broken UX | The import panel dominates space that belongs to the timeline. |
| L4 | Configurable priority labels: user defines which phase/category values sort to top + get column shading | New | Missing | Currently hardcoded to "Vacation / Holiday / OOO". v2 settings panel shows editable tag chips. Empty list = feature disabled. |

### Task Editing

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| E1 | Fix in-cell text editing: cursor placement, double-click to select, normal text input behavior | Bug | Broken | Can't click to place cursor; must arrow-key to position; double-click doesn't select; requires Cmd/Ctrl+A. |
| E2 | Drag and drop tasks to reorder rows so they fit visually | Enhancement | Partial | Row drag-to-reorder exists; verify it still works and feels right after layout changes. |
| E3 | Filter by clicking a timeline bar: currently clunky in design | Fix | Partial | Feature exists; interaction and visual design needs polish. |
| E4 | Duplicate task action | New | Missing | Useful for repeated tasks (e.g. two Vacation rows same category different dates). Add to task row actions alongside Remove. |
| E8 | Edit task via modal with real form inputs | New | Missing | Replaces broken in-cell editing. Proper text fields, date pickers, color swatch + hex inputs. Reachable from row "Edit" button. |
| E9 | Right-click a timeline bar to edit that task | New | Missing | Context menu / direct open of the edit modal for that task. Faster than finding the row in the panel. |
| E10 | Prev / next (‹ ›) navigation inside the edit modal | New | Missing | Step through tasks without closing the modal. Order follows current sort. |
| E5 | Task panel: filter tasks by text | Enhancement | Partial | Filter input exists; needs to also filter by hex code (see C3) and work reliably across all fields. |
| E6 | Task panel: click column headers to sort + drag to reorder | Enhancement | Partial | Click any column header to sort (click again to reverse), with a ▲/▼ indicator on the active column. Covers Phase, Phase HEX, Category, Cat HEX, Task, Start, End, Order, Line Padding. Replaces the sort dropdown. Drag handle (⠿) reorders rows manually; dragging resets to manual order. |
| E7 | Task panel: collapsible section below the timeline | Design | Missing | Timeline at top (never moves). Task panel below it — collapses to a thin bar, expands downward adding page height. No overlap. One scroll direction (vertical). Screenshot workflow: timeline always at top of page, panel below it and out of frame. |

### Data Input & Import

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| I1 | Import deduplication bug: same phase/category + different dates incorrectly merges rows | Bug | Broken | Breaks Vacation/Holiday entries that span non-contiguous dates; also affects any repeated category. |
| I2 | Line padding: export includes padding values, but import doesn't re-apply them | Bug | Broken | Round-trip fidelity issue; padding is lost on re-import. |
| I3 | Keep import flexible — do not add strict validation | Guardrail | Working | Spreadsheet paste is a primary workflow. Don't break it for edge cases. |
| I4 | Import must accept ALL export columns (lossless round-trip) | Bug | Partial | Export emits: Phase, Phase Hex, Category, Category HEX, Task, Sub-Task, Owner, Week, Date Start, Date End, **Display Order**, **Line Padding**. v1 import drops Display Order (reassigns sequentially) and Line Padding (I2). v2: export → re-import must reproduce the exact same board, including manual order. When Display Order is absent (fresh Excel paste), fall back to row order as today. |

### Timeline Views & Display

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| V1 | Relative timeline mode: switch from calendar dates to generic Week 1 / Month 1 labels | New | Missing | For projects where dates aren't confirmed yet. Significant feature — needs design before implementation. |
| V2 | Week number + date label in stacked monthly day view | Enhancement | Missing | Needs visual vetting — must not add clutter. Decide whether week number replaces or accompanies the date. |
| V3 | Calendar view date range: picking a single month (e.g. June) bleeds days from the next month | Bug | Broken | Range boundary issue; should show only the selected range and hide overflow dates. |
| V4 | Holiday / Vacation: sort to top + full-height column shading | Enhancement | Partial | Phase/category values matching the priority label list (see L-settings) sort to top AND shade the date columns they cover across all task rows — giving a visual "non-working day" indicator. Shading should be noticeably darker than current. Works best in stacked views (per-day columns); horizontal monthly may show a narrow stripe or skip column shading. Currently hardcoded labels; see Settings for configurable list. |
| V5 | Phase bars: always toggled off in practice; too noisy; short phases can't be read | Design | Working | Consider removing from primary UI or placing behind an advanced/rarely-used toggle. |

### Colors & Theming

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| C1 | Color codes broken: categoryHex no longer applies correctly to task bars | Bug | Broken | Likely broke during the special-priority refactor. High priority — color is central to the deliverable. |
| C2 | Hex palette management: a place to add a list of hex codes as the primary theme | New | Missing | Need to decide: auto-assign colors to categories, or manual dropdown pick per category. Variants (lighter/darker) also needed. Design before code. |
| C3 | Filter bar should filter by hex code / color | Enhancement | Missing | Currently doesn't filter on categoryHex. |
| C4 | Toggle bar color + legend key between Phase hex and Category hex | New | Missing | Switching color source changes what the legend shows too. Design question: is this a per-view setting or global? |
| C5 | Toggle bar label text between Phase name, Category name, and Task name | New | Missing | Related to C4 — bar color source and bar text source should be independently switchable. |

### Screenshot & Export

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| S1 | Legend / category key: must fit cleanly below timeline when included in screenshot | Enhancement | Partial | Needs to fit on a slide that already has a header and footer. Currently may require scrolling to include. |
| S2 | CSV export round-trip fidelity (line padding) | Bug | Broken | See I2 above. |
| S3 | Export: let user name the file and choose the save location | Enhancement | Missing | v1 auto-downloads `roadmap-tasks-<date>.csv` to the default downloads folder. v2 should prompt for filename + location. Use the File System Access API (`showSaveFilePicker`) where supported, with a graceful fallback to the current auto-download (prefilled editable filename) in browsers that lack it. |

### Navigation & Range

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| N1 | Range mode selector — three mutually exclusive (OR) modes | Design | Partial | (a) **Fit to data** — auto-span earliest→latest task. (b) **Specific date range** — two date pickers. (c) **Rolling span** — N weeks/months + Prev/Next paging. One control, three modes. Replaces v1's scattered "Use Date Range / Use Month Span" buttons + span input + prev/next. |
| N2 | Prev / Next paging within Rolling span mode | Enhancement | Working | Page forward/back by the current span. Keep. |
| N3 | Span count input (how many weeks / months shown) | Enhancement | Working | Number input in Rolling span mode. Keep. |
| N4 | Relative timeline mode — generic Week 1 / Month 1 labels | New | Missing | For unconfirmed-date projects. Pairs with Rolling span: column headers show generic numbers instead of dates. See V1. Needs a project "start = week 1" anchor. |
| N5 | Week-number / month-number column headers | Enhancement | Working | Toggle column headers between dates and "Wk 1" / month numbers. Distinct from N4 (which relabels the whole timeline). |

---

## v1 Carryover Features — MUST PRESERVE

These exist in v1 `src/App.tsx` and are core to how the timeline looks and behaves. The v2 mockups simplify presentation but must not drop these. **Read the named functions in v1 before reimplementing.**

| # | Feature | v1 location | Notes for v2 |
|---|---------|-------------|--------------|
| K1 | **Vertical auto-packing** ("reverse Tetris") | `occupiedRanges` collision loop in weekly/stacked render | Non-overlapping tasks share a row to minimize height. **Make it a toggle** ("Compact rows", default ON; OFF = one task per row). Critical for screenshot density. |
| K2 | **Word-wrap + dynamic bar height** | `getTaskHeightForPeriod`, `taskHeights` | Labels that don't fit on one line WRAP to multiple lines and the bar grows taller — **never truncate / ellipsis**. Height computed from wrapped line count; `Line Padding` (`lineHeightAdjust`) adds extra lines on top. Applies to all views incl. narrow stacked-day bars. |
| K3 | **Auto text color (contrast)** | `getTextColor` | Label is black or white based on background luminance. Essential with arbitrary hex. |
| K4 | **Continuation arrows ◀ ▶** | task-bar render | Shown when a task extends beyond the visible window. Pinned to the bar EDGES with the label centered between (not inline). Works together with K2 wrapping. |
| K4b | **Bars float on the grid (horizontal inset)** | `horizontalPadding = 0.3` in render | Each bar is inset ~4px left/right so the column grid shows through the gaps — bars look like they sit on top of the view, not filling cells edge-to-edge. |
| K5 | **Special-priority background overlay** | `blendHexWithWhite`, `isSpecialPriorityTask` | Faded category color painted across vacation/holiday spans. Separate from the full-height non-working-day column shading (V4). |
| K6 | **Drag/drop in BOTH places** | task-table rows + `.task-bar` draggable | Reorder from the task panel AND directly on timeline bars. Both update `displayOrder`. |
| K7 | **Hover tooltips on bars** | `title={[...]}` on `.task-bar` | Full task / sub-task / phase / category / owner / start / end / order on hover. |
| K8 | **Selected-bar highlight** | `selectedTimelineTaskId`, boxShadow | Click a bar → it glows, others dim to ~0.72 opacity, task panel filters to it. Click again clears. |
| K9 | **Legend shows only visible tasks** | `visibleLegendTasks` | Category key reflects only what's in the current window, not the whole dataset. (Phase key removed in Phase 5 with the phase header bars.) |
| K10 | **Filter feedback** | "Showing X task-list results" | Show count when a text filter or timeline selection is active. |
| K11 | **CSV week-number auto-compute** | `getRelativeWeekNumber` in `exportTasks` | When a task has no week value, compute it relative to the earliest task on export. |
| K12 | **Collapsible sections** | `showTaskList`, `showTimeline` | Tasks panel and timeline are independently collapsible. |
| K13 | **Task count + date range + computed duration** | Tasks header render | "Tasks (26) (Jun 22 – Oct 1, 2026, 5 months)". Duration adapts to view (weeks/months). |
| K14 | **Hidden data fields kept for round-trip** | `Task` interface | Sub-Task, Owner, Week stay in the data model + CSV even though the v2 table hides those columns. Do NOT drop from the type or export. |
| K15 | **Add Test Task** | `addTestTask` (dev only) | Keep. Currently gated behind `import.meta.env.DEV`. |
| K16 | **localStorage persistence + date hydration** | `loadStoredTasks`, `hydrateStoredTask` | Save on every change; safely rehydrate Date objects on load. |
| K17 | **Flexible import column mapping** | `importTasks` switch | Many header aliases (phase/stage, date start/start date/start, etc.). Keep forgiving — do NOT tighten (I3). |
| K18 | **Auto-navigate to imported tasks** | end of `importTasks` | After import, jump the view to the earliest imported task. |

---

## Out of Scope (for now)

- Cross-device sync or a backend service
- Multi-user collaboration or sharing
- Drag-and-drop task *date* editing on timeline bars (reorder drag stays; changing dates by dragging is out)
- Deep calendar-view interactions (click to add, edit-in-calendar)

---

## Resolved Decisions

- **Range modes are OR, not AND** — one selector with Fit-to-data / Specific-date-range / Rolling-span (N1).
- **Auto-packing is a toggle** — "Compact rows" ON by default, OFF = one task per row (K1).
- **Keep Add Test Task** (K15) and **drag/drop in both task panel and timeline bars** (K6).
- **Column header click-to-sort replaces the sort dropdown** (E6).
- **Holidays/vacations group onto one row** (none overlap); **vertical** non-working-day column shading only, no horizontal row tint; darker shade.
- **Hidden table columns (Sub-Task/Owner/Week) stay in the data model + CSV** (K14).
- **Relative timeline mode pairs with Rolling span** (N4 + V1).

## Open Design Questions (still need a call)

1. **Hex palette: auto-assign vs. manual?** Lean: auto-assign by default, allow per-category override.
2. **Calendar view: keep or retire?** Now that stacked Split-by-Days exists, calendar may be redundant. Lean: retire unless it earns a distinct use.
3. **Relative timeline mode anchor** — does Week 1 = earliest task's week, or a user-set project start? (Affects N4/V1.)
4. **Phase bars** — remove entirely, or keep behind an advanced toggle? (Always toggled off in practice.)

---

## Build Order — Handoff to Sonnet

Suggested sequence. Each step should `npm run build` clean and stay browser-verifiable. v1 stays untouched (tag `v1`, worktree `../Roadmap Project v1`).

**Phase 0 — Bug fixes first (highest value, lowest risk):**
1. C1 — fix broken category colors on bars.
2. I1 — remove import grouping that merges same-category rows (breaks Vacation).
3. I2 / S2 — line-padding import round-trip.
4. V3 — calendar single-month date bleed (or fold into "retire calendar" decision).

**Phase 1 — Layout shell:**
5. New header (logo · view tabs · Import / ⚙ / Export). Mockup States 1–2.
6. Settings panel (⚙ dropdown): all toggles + range mode (N1) + priority labels + clear-all.
7. Task panel as collapsible section below timeline (E7), with click-to-sort headers (E6) and drag handles (K6).
8. Import as modal (mockup State 3), keeping editable preview (rows add/remove/edit) and flexible mapping (K17).

**Phase 2 — Timeline carryover (port from v1, don't rebuild):**
9. Port K1–K5 (packing + toggle, dynamic height, auto text color, arrows, special overlay).
10. Holiday grouping + vertical column shading (V4) — stacked first, then horizontal.
11. Selection highlight + tooltips + visible-only legend (K7–K9).

**Phase 3 — Net-new:**
12. Edit modal with ‹ › nav (E8/E10) + right-click-to-edit (E9) + duplicate (E4).
13. Color source / label source toggles (C4/C5) + filter-by-hex (C3).
14. Hex palette management (C2).
15. Relative timeline mode (N4 / V1).

**Reference mockup:** `docs/mockups/v2-layout-mockup.html` — open in browser, States 1–7.

---

## Implementation Status — Updated 2026-06-16

### Phase 0 — Bug Fixes ✅ Complete

| Item | Status | Notes |
|------|--------|-------|
| C1 — category colors | ✅ Fixed | All `bgColor` callsites strip leading `#` before prepending. Affects weekly, both stacked monthly, and legend. |
| I1 — import row merging | ✅ Fixed | Removed task deduplication in `importTasks`. Each row becomes its own task, preserving multi-date entries. |
| I2 — line padding round-trip | ✅ Fixed | Export includes `lineHeightAdjust`; import re-applies it. Round-trip now lossless. |
| V3 — calendar date bleed | ⏭️ Deferred | Folded into "retire calendar" design decision. Not blocking other phases. |

### Phase 1 — Layout Shell ✅ Complete

| Item | Status | Notes |
|------|--------|-------|
| 48px v2 header | ✅ Done | Logo · Weekly/Monthly tabs · Import/⚙/Export buttons |
| Settings panel | ✅ Done | Range mode (Fit/Range/Rolling), layout toggles, danger section, backdrop close |
| Import modal | ✅ Done | Paste → preview table → import; flexible column mapping (I3 guardrail: stays forgiving) |
| Task panel UI | ✅ Done | Collapsible tab, sortable table, drag-to-reorder rows |
| New state added | ✅ Done | `showSettingsPanel`, `showImportModal`, `showTaskPanel`, `compactTaskSpacing`, `rangeMode`, `showHexColumns` |

### Phase 2 — Timeline Carryover ✅ Complete

| Item | Status | Notes |
|------|--------|-------|
| K1 — Vertical auto-packing | ✅ Done | "Compact rows" toggle (default ON); OFF = one task per row. Reduces whitespace while preserving readability. |
| K2 — Word-wrap + dynamic height | ✅ Done | Labels wrap to multiple lines; bar height grows. `lineHeightAdjust` adds extra padding. Never truncates/ellipsis. |
| K3 — Auto text color | ✅ Done | Black or white label based on background luminance (contrast). Works with arbitrary hex colors. |
| K4 — Continuation arrows | ✅ Done | ◀ ▶ shown when task extends beyond visible window. Pinned to bar edges. |
| K5 — Special-priority overlay | ✅ Done | Faded category color painted across Vacation/Holiday/OOO spans (separate from column shading). |
| V4 — Holiday/Vacation shading | ✅ Done | Full-height column shading for priority tasks. Works in stacked views; narrow stripe in horizontal monthly. |
| K7–K9 — Tooltips, legend, selection | ✅ Done | Hover shows full task details; click selects task; legend shows only visible categories/phases. |

### Phase 3 — Net-New Features ✅ Complete

| Item | Status | Notes |
|------|--------|-------|
| E8/E10 — Edit modal + Prev/Next | ✅ Done | Modal form with task fields (name, phase, category, dates, owner, etc.). ‹ › buttons step through sorted tasks. |
| E9 — Right-click-to-edit | ✅ Done | Right-click any timeline bar or calendar chip opens edit modal for that task. |
| E4 — Duplicate task | ✅ Done | Row-level action to clone a task (useful for repeated entries like multi-date vacation). |
| C4/C5 — Color/label source | ✅ Done | Settings controls: bar color source (Category/Phase), bar label source (Task/Category/Phase). Live updates all bars + legend. |
| C3 — Filter by hex | ✅ Done | Task filter now matches `phaseHex` and `categoryHex` values (with or without leading `#`). |
| C2 — Hex palette | ✅ Done | 8-color default palette. Auto-assign categories on import; per-category override in settings. Swatches + mapping UI. |
| N4 — Relative timeline | ✅ Done | Toggle: "Relative timeline (Week 1, 2, ...)" in settings. Headers show W1/W2/M1/M2 instead of dates. For unconfirmed-date projects. |

### Phase 4 — Screenshot & Layout Enhancements ✅ Complete

| Item | Status | Notes |
|------|--------|-------|
| **L1 — Presentation mode** | ✅ Complete | Ctrl/Cmd+P toggle or 🎬 button. Hides header, settings, import modal, task panel. Shows timeline + legend only. Dark overlay banner guides exit. Screenshot-ready. |
| **E6 — Column sorting** | ✅ Complete | Column headers clickable for sort. ▲/▼ indicators visible. All columns covered (Phase, Category, Task, Start, End, Order, Line Padding, etc.). Drag handle for manual reorder. |
| **E7 — Task panel layout** | ✅ Complete | Refactored from overlay to structural layout below timeline using flexbox. `.app` uses flex column layout (height: 100vh). `.v2-content-area` wrapper provides scrollable region. Task panel tab/panel use flex-shrink: 0. Single scroll direction (vertical). Timeline stays pinned at top via sticky header. |
| L2 — Control area redesign | ⏭️ Future | View selector needs visual hierarchy (most important choice, not equal weight with toggles). Design work required. |
| L3 — Task section redesign | ⏭️ Future | Import + filter layout currently clunky. Needs UX redesign to reduce vertical footprint. |
| L4 — Configurable priority labels | ⏭️ Future | User-editable list of phase/category values that sort to top + shade columns. Currently hardcoded (Vacation/Holiday/OOO). |

### Design Questions Resolved

| # | Question | Decision | Status |
|---|----------|----------|--------|
| 1 | Hex palette: auto-assign or manual? | Auto-assign by default + per-category override | ✅ Implemented (C2) |
| 2 | Calendar view: keep or retire? | Retire (stacked Split-by-Days is superior; calendar underutilized) | ⏭️ Decision made, pending removal |
| 3 | Relative timeline mode anchor | Week 1 = earliest task's week (user-set start not yet implemented) | ✅ Implemented (N4) |
| 4 | Phase bars: remove or toggle? | Remove from primary UI (rarely used, too noisy) | ✅ Done in Phase 5 (TL1/TL2) |

### Key Carryover Features — All Preserved

All v1 features (K1–K18) remain in the codebase. v2 adds new controls and features without removing functionality. Browser-local persistence, CSV round-trip, flexible import, and drag-drop in both task panel and timeline all working.

---

## Phase 5 — Phase Header Removal (render surgery) ✅ Complete

**Owner: Sonnet/Opus (not Haiku).** Touched the shared render primitive and landed *before* Phase 6, so Haiku reorganizes a stable settings panel. The `showPhaseLabels` flag was load-bearing — it gated task grouping, phase-bar positioning, and the `isWithinPhase` column shading, not just a visual band.

| # | Item | Type | Result |
|---|------|------|--------|
| TL1 | Remove phase header bars from timeline | UX | ✅ Done. Removed the dark phase bands and per-phase grouping from `renderStackedTimelineBoard` and both inline horizontal boards; all tasks now pack into one combined board per period. Phase remains a **color/label source** (C4/C5). |
| TL2 | Remove "Show phases" toggle | UX | ✅ Done. Removed the `showPhaseLabels` state, its Settings → Display toggle, the orphaned "Phase Key" legend, and the unused `phases`/`visibleLegendPhases` derivations. |

**Decision:** Full removal (not default-off). Collapsed onto the existing `showPhaseLabels === false` code path. Build + lint clean; verified in browser (single combined board renders across views).

---

## Phase 6 — UX Polish & Layout Cleanup 📋 Backlog

**Owner: Haiku** (after Phase 5 lands). All items below are mechanical and anchored. The settings-reorg cluster (TP3/TP5/ST1/ST2) is the one borderline group — if state wiring breaks on the JSX move, pull that cluster back to Sonnet.

### Rock-solid for Haiku (CSS + default flips)

| # | Item | Type | Notes & code anchors |
|---|------|------|----------------------|
| LY1 | Background color: grey → white | Style | `#root` and `.app` both set `#f5f5f5` (`src/App.css:48`, `:53`) → white. `body` is already `#ffffff`. |
| LY2 | Page 100% width (remove left overhang) | Layout | Root cause: `#root { width: 1800px; margin: 0 auto }` (`src/App.css:48`). Change to `width: 100%`. (Note: `index.css:17` also defines `#root`; App.css wins.) |
| HD1 | Settings icon padding reduction | Style | Settings ⚙ icon too small relative to button padding. CSS-only. |
| TP1 | Remove vertical grid lines in task table | Style | **Decision: use a CSS variable set to `transparent`** (not white — white couples to background). Add `--task-grid-line: transparent` to `:root`; point `.v2-task-table` cell `border-right` (`src/App.css:655`) at it. Flip the variable to re-enable later. |
| TP4 | Restyle row action buttons | Style | Edit/Copy/Delete row actions (`src/App.tsx:3877`, `:3884`, + delete) → match the `.v2-panel-export` "Export CSV" style (`:3776`): grey outline, icon, larger hit target. |
| DF1 | Change view defaults | Config | `view` `"weeks"`→`"months"` (`src/App.tsx:246`); `timelineLayout` `"horizontal"`→`"stacked"` (`:276`); **stacked split = Split by Days** (`isWeekSplit` path off); `showWeekends` `true`→`false` (`:275`). `compactTaskSpacing` is **already** `true` (`:299`) — no change needed. |
| DF2 | Range Mode default: Fit to data | Config | `rangeMode` default `"rolling"`→`"fit"` (`src/App.tsx:300`). Mode already exists (`:335`) — pure default flip. |

### Settings reorganization cluster (borderline — verify state wiring)

| # | Item | Type | Notes & code anchors |
|---|------|------|----------------------|
| TP2 | Expand "Line Padding" column visibility | Layout | Adjust `.v2-task-table` column widths so "Line Padding" is fully visible even for large values. Currently 85px; may need 100px+. |
| TP3 | Line padding: +/−0.25 increment buttons | Interaction | Add increment/decrement buttons next to the Line Padding input; round-trips via `lineHeightAdjust` (CSV "Line Padding" column). ✅ Done |
| TP5 | Move "Show hex columns" to task settings | IA | Move control from timeline settings → task panel section. Keep state wiring intact. ✅ Done |
| ST1 | Move color palette to task settings | IA | Move hex palette management (`colorPalette`/`categoryColorMap`, `src/App.tsx:306–309`) UI from timeline settings → task panel. ✅ Done |
| ST2 | Range Mode: radio → dropdown | UX | Convert the three `rangeMode` options (`fit`/`range`/`rolling`) from radios to a dropdown. ✅ Done |
| LY3 | Remove "Stacked" as top-level toggle | Navigation | ✅ Complete. Stacking is now controlled only in the Layout section; the header just switches Weekly/Monthly. |
| LY4 | Icon sizing: settings & import buttons | Style | ⚙ and import icon too small. Increase button padding/icon size for better visual weight and hit target. |
| TP6 | Action column width + text padding | Layout | Widen Actions column (`src/App.tsx:3447`); reduce left/right padding on text columns (Phase, Category, Task). Plenty of space available. |
| TP7 | Reduce vertical task spacing | Layout | Tasks stacked too far apart vertically. Reduce margins/gaps between rows and/or row height to tighten vertical density. |
| TP8 | Category key box sizing consistency | Bug | One category key (e.g., "Build Metadata (basic MDM) Architecture") renders smaller than others. Likely text wrapping or flex issue in legend. |
| ST3 | Category palette item top/bottom padding | Layout | Reduce top/bottom padding (but not left/right) on category items in the color palette section. |
| V6 | Month header display & padding | Display | (a) Show "Jun 1 – 30, 2026" format (not "Jun 1 – Jun 30, 2026") when single month; (b) reduce padding below month header text by ~50%; (c) reduce top/bottom padding of week/month column headers by ~50%. |

### Needs scoping (render work — likely Sonnet)

| # | Item | Type | Notes |
|---|------|------|-------|
| TL4 | Week labels in monthly view header | Enhancement | ✅ Complete. Monthly view now shows month labels on top and week labels below with compact header spacing; stacked monthly view uses the same compact header treatment. |

### Deferred — Design-Needed (not yet scoped)

| # | Item | Type | Notes |
|---|------|------|-------|
| TL3 | Consistent day column widths across months | Design | Currently Feb is narrower than March. Decision needed: uniform width or variable? |
| TL5 | Day headers with "Show week/month #" toggle | Design | When showing numbers, keep day-of-week ("Mon 6") or just number ("6")? Space vs. context. |

### Summary

**Phase 5 — Sonnet/Opus:** ✅ TL1, TL2 (phase header removal) complete  
**Phase 6 — Haiku, rock-solid:** LY1, LY2, HD1, TP1, TP4, DF1, DF2  
**Phase 6 — Haiku, settings-reorg cluster:** TP2, TP3, TP5, ST1, ST2  
**Needs scoping (Sonnet):** none  
**Deferred (design-needed):** TL3, TL5  

**Recommended order:** Phase 5 first (stable render base) → Haiku CSS/default-flip batch → Haiku settings-reorg cluster → revisit TL3/TL5 once decisions are made.
