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

### Task Editing

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| E1 | Fix in-cell text editing: cursor placement, double-click to select, normal text input behavior | Bug | Broken | Can't click to place cursor; must arrow-key to position; double-click doesn't select; requires Cmd/Ctrl+A. |
| E2 | Drag and drop tasks to reorder rows so they fit visually | Enhancement | Partial | Row drag-to-reorder exists; verify it still works and feels right after layout changes. |
| E3 | Filter by clicking a timeline bar: currently clunky in design | Fix | Partial | Feature exists; interaction and visual design needs polish. |

### Data Input & Import

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| I1 | Import deduplication bug: same phase/category + different dates incorrectly merges rows | Bug | Broken | Breaks Vacation/Holiday entries that span non-contiguous dates; also affects any repeated category. |
| I2 | Line padding: export includes padding values, but import doesn't re-apply them | Bug | Broken | Round-trip fidelity issue; padding is lost on re-import. |
| I3 | Keep import flexible — do not add strict validation | Guardrail | Working | Spreadsheet paste is a primary workflow. Don't break it for edge cases. |

### Timeline Views & Display

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| V1 | Relative timeline mode: switch from calendar dates to generic Week 1 / Month 1 labels | New | Missing | For projects where dates aren't confirmed yet. Significant feature — needs design before implementation. |
| V2 | Week number + date label in stacked monthly day view | Enhancement | Missing | Needs visual vetting — must not add clutter. Decide whether week number replaces or accompanies the date. |
| V3 | Calendar view date range: picking a single month (e.g. June) bleeds days from the next month | Bug | Broken | Range boundary issue; should show only the selected range and hide overflow dates. |
| V4 | Holiday / Vacation: sort to top, grey out background | Enhancement | Partial | Exists; needs confirmation it still works correctly after the special-priority refactor. |
| V5 | Phase bars: always toggled off in practice; too noisy; short phases can't be read | Design | Working | Consider removing from primary UI or placing behind an advanced/rarely-used toggle. |

### Colors & Theming

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| C1 | Color codes broken: categoryHex no longer applies correctly to task bars | Bug | Broken | Likely broke during the special-priority refactor. High priority — color is central to the deliverable. |
| C2 | Hex palette management: a place to add a list of hex codes as the primary theme | New | Missing | Need to decide: auto-assign colors to categories, or manual dropdown pick per category. Variants (lighter/darker) also needed. Design before code. |
| C3 | Filter bar should filter by hex code / color | Enhancement | Missing | Currently doesn't filter on categoryHex. |

### Screenshot & Export

| # | Item | Type | Status | Notes / Constraints |
|---|------|------|--------|---------------------|
| S1 | Legend / category key: must fit cleanly below timeline when included in screenshot | Enhancement | Partial | Needs to fit on a slide that already has a header and footer. Currently may require scrolling to include. |
| S2 | CSV export round-trip fidelity (line padding) | Bug | Broken | See I2 above. |

---

## Out of Scope (for now)

- Cross-device sync or a backend service
- Multi-user collaboration or sharing
- Drag-and-drop task date editing directly on the timeline bars
- Deep calendar-view interactions (click to add, edit-in-calendar)

---

## Open Design Questions

These need a decision before any code is written:

1. **Hex palette: auto-assign vs. manual?** Auto-assign is lower friction but less control. Manual dropdown gives control but adds steps. Could offer both: auto-assign by default, override per category.
2. **Calendar view: keep or retire?** Now that stacked monthly (Split by Days) exists, does calendar serve a different niche, or is it redundant?
3. **Relative timeline mode: how does it interact with imports?** If dates are in the Excel sheet, how does the tool map them to Week 1, Week 2, etc.? Does it require a project start date?
4. **Presentation mode: toggle or always-on?** A toggle hides controls on demand. Alternatively, the controls could always be in a sidebar that doesn't appear in a standard-width screenshot.
5. **Phase bars: remove from primary UI or keep as advanced option?** If always toggled off, they add visual noise to the controls without adding value.
