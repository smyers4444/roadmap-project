# Roadmap Project Reference

## Core Product Definition

Roadmap Project is a React-based planning board for managing timeline work in a table-first workflow with a visual roadmap view. It should make it easy to enter, reorder, import, and review project tasks without forcing heavyweight planning ceremony.

## Capability Map

- Manual roadmap editing: add, edit, remove, and reorder tasks directly in the table.
- Spreadsheet-assisted planning: paste tab-separated rows, preview them, edit them, and import them into the task list.
- Weekly planning view: shorter-horizon timeline with more detail.
- Monthly planning view: longer-horizon timeline for broader sequencing.
- Phase grouping: organize tasks visually by phase when useful.
- CSV export: preserve task data and manual order outside the app.
- Color-guided readability: use phase/category colors without losing text clarity.

## Feature Priority Guidance

Prefer changes in this order unless the user redirects:

1. Reliable task entry and import behavior.
2. Accurate timeline rendering and visibility.
3. Predictable ordering, sorting, and grouping behavior.
4. Usable export and import round-tripping.
5. UI cleanup and maintainability improvements.

## Workflow Guidance

- Treat manual entry and spreadsheet import as equally important workflows.
- Avoid silent failure in import or export flows. Prefer clear fallback behavior or direct user feedback.
- When a change affects the timeline, verify both the task table state and the visual rendering state.
- Keep the app understandable for a user resuming an older project rather than a team with deep framework knowledge.

## Tooling Guidance

- Keep the current Vite/React/TypeScript workflow working with `npm run build`.
- Use lint when making broader code-quality changes, but do not force a tooling rewrite just to satisfy style preferences.
- Be cautious about dependency additions; this project does not need extra packages by default.

## Documentation Guidance

When behavior changes, update:

- `README.md` for user-facing workflow/setup changes
- `.github/copilot-instructions.md` for repo conventions or verification expectations

If only internal cleanup changed and the user-facing flow is the same, keep documentation updates minimal and intentional.
