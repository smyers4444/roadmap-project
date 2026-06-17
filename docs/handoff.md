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

Last updated: 2026-06-17 (ui-polish branch: task panel polish, settings panel anchoring, Dev task moved to Task View Settings)

## Current Snapshot

Roadmap Project v2 redesign—ground-up rewrite driven by product brief (`docs/product-brief.md`), targeting screenshot-first UX for client deliverables. v1 preserved as tag `v1` and worktree `../Roadmap Project v1/`.

**Branch:** `ui-polish` (off master; all prior phases merged to master)

**Latest commits (this branch):**
- `d34068a` feat: move Dev task button to Task View Settings as "Add test task"
- `f5fae87` style: task panel tab and footer polish
- `b566a7e` feat: add collapsible sections to all settings panel headings
- `e90fe91` style: restyle Task View Settings to match roadmap settings panel
- `7b1cc3e` feat: add delete button to edit modal with confirmation warning

**Build:** `npm run build` passes clean. Dev server: `npm run dev` → `http://localhost:5173`.

## Phases Status

| Phase | Task | Status | Notes |
|-------|------|--------|-------|
| 0 | Bug fixes (C1, I1, I2, V3) | ✅ Complete | Category colors, import grouping, line padding round-trip fixed |
| 1 | Layout shell | ✅ Complete | Header, settings panel, import modal, task panel UI |
| 2 | Timeline carryover | ✅ Complete | Packing, text wrapping, auto-color, special priority shading |
| 3 | Edit modal + colors | ✅ Complete | Modal editing, color/label source toggles, hex palette, relative timeline |
| 4a | L1 Presentation mode | ✅ Complete | Ctrl+P toggle, hides all controls, shows timeline + legend only |
| 4b | E6 Column sorting | ✅ Complete | Already implemented; verified working |
| 4c | E7 Task panel layout | ✅ Complete | Flexbox column layout, single scroll direction, task panel below timeline |
| 5 | Phase header removal (TL1, TL2) | ✅ Complete | Phase bands removed; all tasks pack into one combined board per period |
| 6 | UX Polish (Haiku, 12 items) | ✅ Complete | All items done; merged to master |
| **7** | **UI Polish (ongoing)** | **🚀 In Progress** | On `ui-polish` branch — see below |

## Phase 7 — UI Polish (ui-polish branch)

### Completed this session

- **Outer padding** — Header, canvas, task panel tab, and task panel margins increased from 16px to 20–30px so the roadmap doesn't sit flush against the viewport edge. Canvas: 30px L/R, 10px top. Task panel: 30px L/R, 24px top gap.
- **Edit modal field removal** — Sub-task, Owner, and Week fields removed from the task edit modal. These fields still exist on the task object, still import from CSV, and still export to CSV — they are just not editable through the modal.
- **Delete button in edit modal** — Red outlined "Delete" button added to the far left of the edit modal footer (`.v2-btn-danger` style). Clicking it prompts `window.confirm()` with the task name before removing the task and closing the modal.
- **Delete confirmation in task list** — The ✕ button in the task list rows now also prompts `window.confirm()` before removing a task (same message pattern).
- **Task View Settings restyle** — Panel now uses `v2-settings-*` classes throughout, matching the roadmap settings panel visual language. Panel height is dynamic (`height: fit-content`) so it shrinks when sections are collapsed.
- **Collapsible sections** — All section headings in both the roadmap settings panel and Task View Settings are now clickable expand/collapse toggles with a 14px arrow indicator. Phases and Categories default collapsed; all other sections default expanded. State variables: `settingsRangeModeExpanded`, `settingsLayoutExpanded`, `settingsDisplayExpanded`, `settingsColorsExpanded`, `settingsDangerExpanded`, `taskSettingsDisplayExpanded`, `taskSettingsPhasesExpanded`, `taskSettingsCategoriesExpanded`, `taskSettingsDangerExpanded`.
- **Task panel tab + footer polish** — Tab resting bg `#fafafa`, hover `#f0f0f0`; collapse/expand text darkens on hover; footer text darkened to `#888`; gap between last task row and footer removed (overrode global `table { margin-bottom: 1rem }` with `margin-bottom: 0` on `.v2-task-table`).
- **Dev task → Add test task** — "Dev task" button removed from toolbar; added as "Add test task" under Display in Task View Settings (DEV-only via `import.meta.env.DEV`). Test task now seeds `phaseHex` and `categoryHex` with `007acc` (the app's fallback blue).
- **Anchored settings panels** — Both settings panels now open anchored to their trigger button (`position: fixed`, `top: rect.bottom + 6`, `right: window.innerWidth - rect.right`) using `useRef` + `getBoundingClientRect()`. Roadmap settings gear moved to far-right header position (Import → Export CSV → Presentation → Settings).

### Remaining items

- User-directed items as they come up (original list items 5/6 were reprioritized in favor of in-session requests).

## Key Architecture Notes

- `src/App.tsx` is a deliberate monolith (~3700 lines). Edit modal ~line 2430; task list delete button ~line 3520; Task View Settings panel ~line 3570.
- `subTask`, `owner`, and `week` fields still exist on the `Task` type and are preserved in import/export — only removed from the edit UI.
- `.v2-btn-danger` is a new CSS class in `App.css` (red outline, light red hover) — reuse it for any future destructive-action buttons.
- Hex colors stored without `#` prefix throughout (e.g. `"FF5733"` not `"#FF5733"`).
- Collapsible pattern: `useState(bool)` + `onClick={() => setSomeExpanded(p => !p)}` on the heading div + `{expanded && <content />}` (use a `<> </>` fragment when wrapping multiple siblings).
- Anchored panel pattern: `useRef<HTMLButtonElement>` on trigger button + `useState<{top,right}>` for position + `getBoundingClientRect()` on click → `position: fixed` panel. Both settings panels use this pattern (`settingsPanelAnchorRef` / `colorsPanelAnchorRef`).
- Global `table { margin-bottom: 1rem }` rule exists in `App.css` — override with `margin-bottom: 0` on any v2 table class to avoid unwanted gaps.

## Next Steps

**Technical:** Continue user-directed UI polish items as they arise. The branch is clean and build-verified.

**Practical:** Open the app, expand the Tasks panel, and work through the remaining list items one at a time.

**PR:** `ui-polish` branch is clean and build-verified. Ready to PR when the full list is complete (or at a natural stopping point).

## New Chat Start

**Read first:**
- `README.md` — overview and setup
- `CLAUDE.md` — project guidance and conventions
- `docs/handoff.md` — this file

**Current state:** All prior phases merged to master. `ui-polish` branch has 8 commits of UI polish: outer padding, edit modal cleanup, delete+confirm, Task View Settings restyle, collapsible sections, task panel tab/footer polish, Dev task moved to settings, and anchored settings panels with gear button reordered to far right. Build clean. Continue with user-directed UI polish items.
