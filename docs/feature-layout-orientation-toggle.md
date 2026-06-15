# Feature Plan: Layout Orientation Toggle

## Purpose

This note captures the recommended approach for adding `Horizontal | Vertical` layout options without replacing the current `Weeks | Months` view toggle.

The goal is to make orientation and time scale independent controls:

- `View: Weeks | Months`
- `Layout: Horizontal | Vertical`

## Recommendation

Treat layout orientation as a second dimension of the timeline UI, not as a replacement for the existing week/month view control.

Recommended defaults:

- `View`: keep current behavior
- `Layout`: `Horizontal` by default

This means the app should eventually support:

- weekly horizontal
- weekly vertical
- monthly horizontal
- monthly vertical

## Product Behavior

The `Weeks | Months` control should remain visible and usable in both layout modes.

The `Horizontal | Vertical` control should remain visible and usable in both time-scale modes.

These controls should not overwrite each other. They should compose.

## Recommended Definition Of Vertical

Use stacked time sections.

- in weekly view, each week becomes a full-width stacked section
- in monthly view, each month becomes a full-width stacked section
- inside each section, the internal time flow can still read left-to-right where needed

This is safer than rotating the entire rendering model because it preserves the current timeline logic while changing the stacking direction of the visible periods.

## Why This Version Is Better

- preserves the existing `Weeks | Months` mental model
- keeps orientation as a presentation choice
- makes future layout work more consistent across weekly and monthly views
- lowers the risk of special-case behavior that only exists in one time scale

## Dependency

This feature should follow the weekend-toggle work.

The visible-day math needed for weekend hiding will make later weekly layout work cleaner, and the orientation effort should reuse that cleanup instead of fighting it.

See [feature-weekend-toggle.md](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap%20Project/docs/feature-weekend-toggle.md:1).

## Implementation Slices

1. Add orientation state
- keep the existing `Weeks | Months` state
- add a separate `Horizontal | Vertical` state

2. Extract shared timeline data math
- separate timeline data preparation from JSX layout structure
- reuse the same task visibility and positioning rules where possible

3. Add weekly vertical rendering
- one stacked section per visible week
- preserve task bars, phase grouping, legends, and clipping markers

4. Add monthly vertical rendering
- one stacked section per visible month
- preserve monthly navigation, date-range assumptions, and task visibility behavior

5. Verify the four combinations
- weekly horizontal
- weekly vertical
- monthly horizontal
- monthly vertical

## Suggested Follow-Up

After the weekend toggle is implemented and stable:

1. split timeline rendering into shared data math plus layout-specific JSX
2. add the `Horizontal | Vertical` control beside the existing `Weeks | Months` control
3. ship weekly vertical first if you want an incremental rollout
4. then extend the same orientation model to monthly view
