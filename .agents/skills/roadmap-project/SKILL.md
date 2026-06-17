---
name: roadmap-project
description: Build, document, or review the Roadmap Project planning board. Use when working on roadmap task flows, weekly/monthly timeline behavior, import/export handling, task ordering, project docs, or repo-specific implementation guidance.
---

# Roadmap Project

Use this skill to make changes to Roadmap Project while preserving the core product intent: fast roadmap editing, clear timeline visualization, low-friction spreadsheet import, and practical manual planning controls.

## Required Context

Read these files before substantial implementation or documentation work:

- `README.md` for the current user-facing description, setup, and workflow.
- `AGENTS.md` for repo-specific architecture, conventions, and verification guidance.
- `docs/handoff.md` for the current branch/worktree snapshot, latest verified state, and next recommended task when it exists.
- `package.json` for the current toolchain and scripts.
- `src/App.tsx` for the main application logic and task/timeline behavior.
- `src/App.css` and `src/index.css` when changing styling or layout assumptions.

For quick edits, read only the files directly affected plus `README.md`.

## Implementation Rules

- Preserve the core planning flow: users should be able to add tasks quickly and see them appear in the timeline without extra setup.
- Keep weekly and monthly views behaviorally aligned unless a difference is intentional and documented.
- Treat spreadsheet import as a first-class workflow. Do not make the importer stricter unless the user explicitly wants tighter validation.
- Preserve CSV export whenever task fields or ordering behavior changes.
- Keep task ordering predictable. If drag-and-drop or sort behavior changes, verify both table and timeline assumptions.
- Update docs when changing task fields, import/export format, setup commands, verification expectations, or major UI workflow.
- Keep `docs/handoff.md` current after material implementation changes, commits, or new verification results so a fresh chat can start from the repo's actual current state.
- Prefer incremental cleanup over architecture rewrites. This repo currently centers on a single large `src/App.tsx` file.
- Do not introduce unnecessary runtime dependencies. Keep tooling and app dependencies intentional.

## Verification

For most code changes:

```bash
npm run build
```

When touching lint-sensitive logic or general code quality areas, also run:

```bash
npm run lint
```

When changing user-facing behavior, inspect locally:

```bash
npm run dev
```

Open `http://localhost:5173` and verify the relevant flow, such as:

- manual task creation updates the task table and timeline
- imported rows become real tasks
- weekly and monthly views still render
- export still works when tasks are present
- task counts and timeline visibility match the edited data
