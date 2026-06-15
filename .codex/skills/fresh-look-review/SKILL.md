---
name: fresh-look-review
description: Use when the user asks for a fresh-look, low-context, independent review of a target path, doc set, feature, build flow, or repo area to find confusing gaps, contradictions, unclear setup, broken assumptions, or documentation/build issues. The review must be run by a separate lower-cost agent when subagents are available, must be read-only, and must produce a Markdown review artifact.
---

# Fresh-Look Review

Use this skill when the user wants an independent fresh look at a target without the assumptions from the current chat.

The goal is to find what does not make sense to a competent newcomer: documentation gaps, broken setup instructions, contradictions, surprising file locations, missing prerequisites, confusing workflow, or behavior that does not match docs.

## Non-Negotiables

- Always run the review through another agent when subagents are available.
- Prefer a lower-cost model for the review agent when model selection is available.
- The review agent must be read-only.
- The review agent must never edit files, stage files, commit, push, open PRs, install dependencies, or mutate project state.
- The review agent should not receive the current chat's conclusions, intended answers, or suspected issues.
- The review output is an artifact for the main agent and user to review; fixes happen only in a separate, explicit follow-up.

## Main Agent Workflow

1. Clarify the target only if it is missing or too broad to review usefully.
2. Spawn a separate review agent with minimal context:
   - repository path
   - target path, feature, flow, or doc set
   - review criteria
   - required output format
   - explicit read-only constraints
3. Continue local non-overlapping work only if useful; do not pre-solve the review.
4. When the review returns, present the artifact as findings.
5. Do not edit, commit, or open PRs unless the user separately asks for follow-up implementation.

If subagents are unavailable, explain that limitation and perform the review in read-only mode yourself, clearly marking it as less independent.

## Review Agent Prompt Template

Use a prompt like this for the subagent:

```text
You are doing an independent fresh-look review. Work read-only.

Repo: <absolute repo path>
Target: <target path / feature / flow / docs>

Read only what a competent newcomer would naturally read to understand or run the target. Do not use prior chat context. Do not edit files. Do not stage, commit, push, open PRs, install dependencies, or mutate state.

Find things that do not make sense: missing docs, stale docs, contradictions, unclear prerequisites, commands that appear wrong, confusing file placement, behavior/doc mismatch, setup/build gaps, or risky assumptions.

Return a Markdown artifact with:
1. A short scope note.
2. A findings table using exactly these columns:
   | # | Severity | Type | File path | Lines/area | Issue | Why it matters | Suggested correction |
3. A short "No findings" statement if there are no issues.
4. A short "Questions" section only for blockers or ambiguities.

Severity values: High, Medium, Low.
Type values: Docs gap, Build/run gap, Workflow gap, Structure gap, Product gap, Risk.

Keep findings concrete and evidence-linked. Do not fix anything.
```

## Artifact Format

The final review artifact must use this Markdown shape:

```markdown
## Fresh-Look Review: <target>

Scope: <one or two sentences about what was reviewed and from what entry points>

| # | Severity | Type | File path | Lines/area | Issue | Why it matters | Suggested correction |
|---|---|---|---|---|---|---|---|
| 1 | Medium | Docs gap | `docs/example.md` | `Setup` | The setup instructions mention a command but not where to run it. | A newcomer may run it from the wrong directory and think the app is broken. | State the working directory before the command. |

## Questions

- <Only include blockers or real ambiguities. Omit this section if empty.>
```

If there are no findings:

```markdown
## Fresh-Look Review: <target>

Scope: <scope>

No findings. The reviewed path was understandable from the available entry points, and no documentation/build/workflow contradictions were found.
```

## Review Scope Guidance

Good targets:

- `docs/`
- `README.md` plus setup instructions
- a feature such as "Local API service setup"
- a flow such as "export and restore an archive"
- a folder such as `.codex/skills/`
- a new-user run path

Avoid reviewing the entire repo unless the user explicitly asks; prefer one coherent target per fresh-look run.

## Main-Agent Summary

After the review agent returns, the main agent should:

- Preserve the artifact format.
- Add a short note identifying which findings are likely actionable now.
- Ask before making fixes.
- Never commit or open a PR without explicit user confirmation.
