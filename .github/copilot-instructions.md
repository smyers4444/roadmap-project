# Repository Instructions

This repository contains Roadmap Project, a local planning board for building and reviewing timeline-based project roadmaps.

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
- Date handling is done with `date-fns`.
- No backend service is required. This is a client-side app run through the Vite dev server.
- Project-specific skills live under `.codex/skills/`.

## Development Guidance

- Keep the core planning flow intact: when a task is added or imported, it should become part of the editable task list and the visible timeline.
- Do not make the importer stricter unless the user explicitly asks for stricter validation. Spreadsheet paste is a primary workflow.
- Keep weekly and monthly views behaviorally consistent unless a difference is intentional and documented.
- Preserve CSV export when changing task fields, ordering behavior, or import logic.
- Prefer incremental cleanup over large refactors. `src/App.tsx` is intentionally the center of the app right now.
- Do not add runtime dependencies unless they clearly improve the roadmap workflow and are worth the maintenance cost.
- Do not hard-code user-specific, machine-specific, environment-specific, or deployment-specific values in docs, source, config, or scripts. Prefer repo-owned defaults and documented commands.
- Documentation is part of the implementation. Update `README.md`, `.github/copilot-instructions.md`, `docs/handoff.md`, and relevant skill files when changing setup, import/export behavior, task structure, timeline behavior, verification status, or repo workflow.
- Treat `docs/handoff.md` as the rolling current-state snapshot for both new chats and human resume-after-a-gap use. It should stay focused on current branch/worktree state, recent changes, verification status, and the next recommended task.
- Never create commits or pull requests without explicit user confirmation for that specific action. You may recommend when work is commit-ready or PR-ready.
- Preserve clear labels and usable layout when changing the UI.

## Verification

Run:

```bash
npm run build
```

When touching general code quality or lint-sensitive logic, also run:

```bash
npm run lint
```

For browser verification, start the local app:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173
```

Verify the relevant flow, especially:

- manually added tasks appear in the task list and timeline
- imported rows become real tasks
- task counts match the current data
- weekly and monthly views still render correctly
- CSV export still works when tasks are present
