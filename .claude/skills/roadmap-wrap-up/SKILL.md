---
name: roadmap-wrap-up
description: Use when wrapping up Roadmap Project work by syncing relevant docs, running verification, committing changes, summarizing updated files, explaining next steps, and preparing a clean handoff or PR recommendation.
---

# Roadmap Wrap-Up

Use this skill at the end of a Roadmap Project implementation, cleanup, or documentation turn when the user asks to wrap up, commit, explain what changed, list updated files, give next steps, or prepare a new chat.

## Workflow

1. Review the working tree with `git status --short`.
2. Search for stale docs or workflow notes related to the change. Prefer focused `rg` terms from the feature, bug, or UI behavior just changed.
3. Update all relevant docs before committing. Always consider:
   - `README.md`
   - `CLAUDE.md`
   - `docs/handoff.md`
   - any touched skill under `.claude/skills/`
   - any setup, workflow, or feature-specific doc affected by the change
4. Run verification appropriate to the touched surface. For this repo, usually:
   - `npm run build`
   - `npm run lint` when code-quality-sensitive logic changed
   - `git diff --check`
5. Ask for explicit confirmation before staging/committing unless the user's latest request already explicitly asked for a commit.
6. Stage and commit the bounded change set only after confirmation, using a direct commit message.
7. After committing or when recommending a commit/PR, report:
   - commit hash and subject
   - verification commands and results
   - docs or skill files updated, with clickable file links
   - a high-level recap of what changed
   - a short documentation recap
   - next step in technical terms
   - next step in practical/user terms
   - whether the change is PR-ready and why
   - whether to move to a new chat
   - a copy-pastable new-chat prompt when moving chats is useful

## Documentation Recap Requirement

When the user asks for a wrap-up or asks what changed, list every updated documentation or skill file separately. Then provide a short recap of what those files now say at the project level, not a line-by-line diff.

The recap should answer:

- What behavior or status changed?
- What workflow or decision is now documented?
- What future work became clearer, safer, or unnecessary?
- What should the next agent read first?

Keep the recap concise and operational.

## New-Chat Prompt

Recommend a new chat when:

- A clean commit has been created.
- `docs/handoff.md` is current.
- The next task is distinct from the completed task.
- The current thread has accumulated enough repo-specific context that a focused reset would reduce confusion.

The prompt should include:

- Repo path.
- Files to read first, usually `README.md`, `CLAUDE.md`, and `docs/handoff.md`.
- Latest commit hash and subject.
- Current implemented state in one short paragraph.
- The exact next task.
- Any guardrails that matter for the next task.

## Commit And PR Confirmation

Never create a commit or pull request without explicit user confirmation for that specific action.

- If the user says "commit that" or equivalent in the latest request, that is sufficient confirmation to commit the current bounded change set.
- If the user asks whether the work is ready, explain whether it is commit-ready or PR-ready, but do not commit or open a PR.
- If the user asks for a PR, confirm the intended branch/change set before opening it unless the latest request already names the PR action and scope clearly.

Recommend a pull request when a clean commit exists, verification has passed or gaps are documented, docs/handoff/skills are current, and the change affects user-facing behavior, import/export behavior, setup workflow, repo process, or project skills.

Do not recommend a pull request for unverified work, incoherent exploratory changes, dirty working trees with unrelated changes, or tiny typo cleanup unless the user wants review or sharing.

## Guardrails

- Do not invent a commit if committing fails.
- Do not commit or open a pull request without explicit confirmation.
- Do not say docs are updated until the stale-doc search and final status support that.
- Do not bury verification failures; report them directly.
- Keep `docs/handoff.md` current when the repo state, verification status, or recommended next task materially changes.
- Keep explanations practical for a user resuming an older project.
- Keep technical wording about import behavior, timeline rendering, ordering, verification, and toolchain state.
- Prefer small bounded commits and short-lived branches over long-lived working branches.
