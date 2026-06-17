# Code Review Findings — `src/App.tsx`

Review date: 2026-06-17. Scope: whole-file review of `src/App.tsx` against the
current `master` (Phase 6 UX polish merged, commit `4a75ba2`). Each finding was
verified against the actual code, and the fixes were verified in the browser.

> Note: an earlier review in this effort was accidentally run against a stale,
> pre-Phase-6 checkout (local `master` was 38 commits behind `origin/master`).
> That review and its branch were discarded; `master` was synced and the review
> redone. The redo surfaced finding #1 below, which only exists in Phase 6 code.

## Status (branch `code-review-fixes-v2`)

Verified with `npm run build` + `npx eslint src/App.tsx` (both clean) and browser
checks on the running dev server.

| # | Severity | Item | Status |
|---|----------|------|--------|
| 1 | Critical | Colors panel bulk color change loses all but the last task | ✅ Fixed — verified all 3 same-category tasks update |
| 2 | Warning | CSV `Display Order` exports but never re-imports | ✅ Fixed — verified order preserved (30/10/20) |
| 3 | Warning | Monthly-horizontal omitted the wrap safety line (text clip risk) | ✅ Fixed — now routes through shared helper with safety line on |
| 4 | Warning | `debugInfo` layout metrics leaked into task-bar tooltips | ✅ Fixed — all `debugInfo` removed |
| 5 | Warning | "Fit to data" is reactive in monthly but not weekly | ✅ Fixed — weekly fit now re-fits on task changes |
| 6 | Info | Height calc duplicated 3× (root cause of #3 and #4) | ✅ Fixed — both horizontal blocks now call `getTaskHeightForPeriod` |

---

## #1 — Colors panel bulk update loses all but the last task (Critical) ✅

**Where:** `updateTask` / `updateTaskFields` (`src/App.tsx:448`, `452`); Colors panel
inputs (`src/App.tsx:3636`, `3660`).

**Problem:** `updateTask` used `setTasks(tasks.map(...))`, reading `tasks` from the render
closure. The Colors panel changes a phase/category color by looping:
`tasks.filter(...).forEach(t => updateTask(t.id, "categoryHex", newHex))`. React 18 batches
those `setTasks` calls and each one starts from the *same stale* `tasks` snapshot, so every
update except the last is overwritten. Result: when two or more tasks share a phase or
category, only the **last** one keeps the new color; the rest silently revert (and the
revert persists to localStorage). This is a Phase 6 regression — the Colors panel was added
in Phase 6 (TP8).

**Fix (applied):** switched both `updateTask` and `updateTaskFields` to the functional
updater form, so each call composes on the latest pending state:

```ts
setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
```

**Verified:** set three tasks to the same category, changed that category's hex once in the
Colors panel → all three tasks' `categoryHex` updated (bars `rgb(255,0,255)`), not just the
last. Before the fix only the last task would have changed.

---

## #2 — CSV `Display Order` round-trip (Warning) ✅

**Where:** export header (`src/App.tsx:800`); importer switch (no `display order` case);
task build (`displayOrder: nextDisplayOrder++`).

**Problem:** Export writes a `Display Order` column and the import modal advertises a
lossless round-trip, but `importTasks` had no case to read the column back, so re-importing
an exported CSV discarded manual ordering (every row got a fresh sequential value).

**Fix (applied):** added a forgiving import case (`display order` / `order` / `sort order`)
that parses the value into `taskData.displayOrder`, and used it in the task build with a
fallback to the running counter when absent/blank. Kept forgiving per the I3 importer
guardrail.

**Verified:** imported rows with Display Order 30/10/20 → tasks kept those exact values
instead of being reassigned sequentially.

---

## #3 + #6 — Monthly-horizontal safety line + height-calc duplication (Warning/Info) ✅

**Where:** weekly-horizontal and monthly-horizontal height blocks; shared helper
`getTaskHeightForPeriod` (`src/App.tsx:1617`).

**Problem:** The text-wrap/height math was hand-copied into both horizontal view IIFEs
instead of using the existing `getTaskHeightForPeriod` helper (which the stacked views
already call). The copies had drifted: the **monthly** copy had the wrap "safety line"
(one extra line when text nearly fills the last line) **commented out**, while weekly and
both stacked views had it on. So monthly-horizontal bars could compute one line short and
clip text — bad for the screenshot deliverable.

**Fix (applied):** replaced both inline blocks with
`getTaskHeightForPeriod(task, position.width, true)`. This removes ~100 lines of duplication
(#6) and brings monthly-horizontal in line with every other view (#3). **This does change
monthly-horizontal rendering** for tasks whose text nearly fills the last line — they now
get the same safety line as elsewhere (slightly taller bars, no clipping). This aligns with
the "every task must be legible" product principle. Monthly-horizontal is a non-default path
(default view is monthly + stacked).

**Verified:** build + lint clean; app renders correctly.

---

## #4 — Debug metrics leaked into tooltips (Warning) ✅

**Where:** `debugInfo` maps built in the two horizontal IIFEs and injected into each task
bar's `title` (e.g. `W:1440px T:1424px C:197 L:2 H:50px`).

**Problem:** The instrumentation string was visible to any user hovering a task bar in the
horizontal views, with no DEV guard. The stacked views never had it.

**Fix (applied):** removed the `debugInfo` map construction, the `.set(...)` calls, and the
`debugInfo.get(...)` tooltip entries. Fixed for free by the #3/#6 consolidation (the
helper never produced debug output) plus removing the tooltip lines.

**Verified:** no `debugInfo` references remain in the source; tooltips now end at `Top:`.

---

## #5 — "Fit to data" reactive in monthly but not weekly (Warning) ✅

**Where:** range effect (`src/App.tsx:350`); weekly fit also handled in the view-mode
dropdown onChange (~`src/App.tsx:2045`).

**Problem:** In monthly view, "Fit to data" was reactive — adding a task outside the current
window re-fit the visible range automatically. In weekly view, fit was applied once when
selected from the dropdown and never re-fit, so a task added outside the fitted range stayed
invisible until the user re-selected the mode.

**Decision:** make weekly consistent with monthly (auto re-fit), per the "weekly and monthly
views should stay behaviorally consistent" guidance.

**Fix (applied):** added a `view === "weeks"` branch at the top of the range effect. When
`rangeMode === "fit"`, it recomputes `currentWeek` (start of week of the earliest task) and
`weekSpan` (weeks needed to reach the latest task) on every `tasks` change — the same
computation the dropdown uses, now reactive. Other weekly range modes are left to the
dropdown and manual navigation.

**Verified:** in weekly + fit with one task (Jun 17), the span fit to 2 weeks. Importing a
task dated Aug 15 auto-expanded the weekly view to 10 weeks (Jun 14 → Aug 22), bringing the
new task on-screen. Before the fix the span would have stayed at 2 weeks.
