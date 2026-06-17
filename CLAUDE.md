# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Roadmap Project — Claude Code Guide

This repository contains **Roadmap Project**, a local planning board for building and reviewing timeline-based project roadmaps.

## Product Principles

- Make roadmap editing fast enough for day-to-day planning work.
- Keep the visual timeline aligned with the editable task data.
- Treat spreadsheet paste/import as a first-class workflow, not a side feature.
- Preserve flexible manual control over ordering, grouping, and timeline presentation.
- Prefer practical, understandable implementation over architecture churn.

## Current Implementation

- React + TypeScript app built with Vite.
- Main application logic lives in `src/App.tsx`.
- Styling lives primarily in `src/App.css` and `src/index.css`.
- Timeline behavior supports weekly and monthly views.
- Tasks can be added manually, edited in place, imported from tab-separated data, reordered, filtered, and exported to CSV.
- Task data persists in browser-local storage on the current device/browser.
- Date handling is done with `date-fns`.
- No backend service is required. This is a client-side app run through the Vite dev server.
- Project-specific skills live under `.claude/skills/`.

## Architecture — App.tsx Internals

`src/App.tsx` is a deliberate monolith (~3500 lines). It is organized in three layers:

1. **State + logic functions** (top ~1300 lines): all `useState` declarations, task CRUD helpers (`addTask`, `updateTask`, `removeTask`, `importTasks`, `exportTasks`), drag-and-drop handlers, date math, and layout helpers (`getTaskHeightForPeriod`, `getTextColor`, `blendHexWithWhite`, `isSpecialPriorityTask`).

2. **`renderStackedTimelineBoard`** (~lines 1291–1675): a named function that is the core rendering primitive for all stacked/horizontal period boards. It takes `{ periodKey, units, periodStart, periodEnd, visibleTasks, compactTaskSpacing, headerGroups, ... }` and returns the full board JSX including packing algorithm, phase overlays, task bars, and continuation arrows. All five view renderers call it.

3. **Main `return` JSX** (everything after the RENDER comment): the layout shell. Each view combination (`view === "weeks" && timelineLayout === "horizontal"`, etc.) is an inline IIFE that computes local period variables and calls `renderStackedTimelineBoard`. There are five IIFEs: weekly-horizontal, weekly-stacked, monthly-horizontal, monthly-stacked, calendar.

### Key state relationships

- `view` (`"weeks" | "months" | "calendar"`) + `timelineLayout` (`"horizontal" | "stacked"`) together determine the active view — there is no single "current view" state.
- `useCustomMonthRange` + `customMonthStart`/`customMonthEnd` control whether monthly view uses a rolling span or a fixed date range.
- `displayOrder` (number) is the manual sort key; drag-and-drop reorders by shifting these values.
- `lineHeightAdjust` adds extra height lines to a task bar for vertical spacing control; it round-trips through CSV as the "Line Padding" column.

### Hex color convention

`categoryHex` and `phaseHex` are stored **without** a `#` prefix (e.g. `"FF5733"`, not `"#FF5733"`). All rendering callsites prepend `#` when building CSS color strings. `blendHexWithWhite` and `getTextColor` both strip any accidental leading `#` defensively.

### Import column mapping

`importTasks` in `src/App.tsx` uses a `switch (lowerHeader)` to map column names to task fields. The mapping is intentionally forgiving (many aliases per column). Do not tighten it — spreadsheet paste is a primary workflow (I3 guardrail).

## v2 Status

The v2 redesign is merged into `master` (Phases 0–4 complete). The `v1` tag preserves the v1 release, and a local worktree at `../Roadmap Project v1/` runs v1 on port 5174.

- Design is complete: see `docs/product-brief.md` and `docs/mockups/v2-layout-mockup.html`.
- Phases 0–4 (bug fixes, layout shell, timeline carryover, edit modal/colors, presentation mode/sorting/panel layout) are done and merged.
- **Phase 5 (phase header removal — TL1/TL2)** is in progress on branch `phase-5-remove-phase-headers`. **Phase 6** (Haiku UX-polish batch) follows once Phase 5 merges.
- Before touching the render section, read `docs/handoff.md` for current state.

## Development Guidance

- Keep the core planning flow intact: when a task is added or imported, it should become part of the editable task list and the visible timeline.
- Do not make the importer stricter unless the user explicitly asks for stricter validation. Spreadsheet paste is a primary workflow.
- Keep weekly and monthly views behaviorally consistent unless a difference is intentional and documented.
- Preserve CSV export when changing task fields, ordering behavior, or import logic.
- Prefer incremental cleanup over large refactors. `src/App.tsx` is intentionally the center of the app right now.
- Do not add runtime dependencies unless they clearly improve the roadmap workflow and are worth the maintenance cost.
- Do not hard-code user-specific, machine-specific, environment-specific, or deployment-specific values in docs, source, config, or scripts. Prefer repo-owned defaults and documented commands.
- Documentation is part of the implementation. Update `README.md`, `CLAUDE.md`, `docs/handoff.md`, and relevant skill files when changing setup, import/export behavior, task structure, timeline behavior, verification status, or repo workflow.
- Treat `docs/handoff.md` as the rolling current-state snapshot for both new chats and human resume-after-a-gap use. It should stay focused on current branch/worktree state, recent changes, verification status, and the next recommended task.
- Never create commits or pull requests without explicit user confirmation for that specific action.
- Preserve clear labels and usable layout when changing the UI.

## Verification

For most code changes:

```bash
npm run build
```

When touching lint-sensitive logic or general code quality areas, also run:

```bash
npm run lint
```

**Current caveat:** `npm run lint` scans `.history/` snapshot files and currently reports many unrelated errors outside the active app source. Until lint scope is narrowed, use `npx eslint src/App.tsx` as the meaningful check for changes in the main app file.

For browser verification, start the local app:

```bash
npm run dev
```

Then open `http://localhost:5173` and verify the relevant flow:

- manually added tasks appear in the task list and timeline
- imported rows become real tasks
- task counts match the current data
- weekly and monthly views still render correctly
- CSV export still works when tasks are present

## Project-Specific Skills

Three skills are available for Roadmap Project work:

- **roadmap-project** — Use for building, documenting, or reviewing the roadmap app while preserving core product intent.
- **fresh-look-review** — Use for independent, fresh-look reviews of docs, features, or flows to find gaps or contradictions.
- **roadmap-wrap-up** — Use for wrapping up work: syncing docs, running verification, committing changes, and preparing handoffs.
