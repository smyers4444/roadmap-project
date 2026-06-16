# Feature Status: Weekend Toggle

## Status

Implemented in commit `57f0d89` (`Add weekly weekend toggle`).

Verified:

- `npm run build`
- `npx eslint src/App.tsx`
- manual browser check completed by user on 2026-06-15

## Shipped Behavior

Weekly view now includes a `Show weekends` control.

- Default: `on`
- Scope: weekly view only
- Monthly view: unchanged

When the toggle is `off`:

- the weekly timeline renders 5 visible days per week instead of 7
- weekly headers reflect the visible workday range
- task bars use visible-day positioning rather than assuming all 7 days are rendered
- tasks spanning a weekend stay visually continuous from Friday to Monday
- tasks starting or ending on a weekend clip to the nearest visible workday in weekly rendering

This remains a rendering-only feature.

- task `startDate` and `endDate` stay unchanged
- spreadsheet import behavior stays unchanged
- CSV export stays unchanged

## Implementation Notes

The shipped slice added:

1. weekly `showWeekends` UI state
2. shared weekly visible-day math for 7-day and 5-day rendering
3. updated weekly range labels, headers, phase spans, and task positioning
4. visible-task filtering that stays aligned with the rendered weekly day set
5. legend visibility that follows the rendered weekly result

## Follow-On Impact

This work completed the visible-day cleanup needed before broader calendar-style day rendering changes.

That makes [feature-calendar-view.md](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap%20Project/docs/feature-calendar-view.md:1) safer to implement later, because rendered-day math no longer assumes every weekly slice always shows seven visible days.

## Next Related Docs

If the next export-related feature is taken up, read:

- [feature-export-week-number.md](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap%20Project/docs/feature-export-week-number.md:1)
- [handoff.md](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap%20Project/docs/handoff.md:1)
