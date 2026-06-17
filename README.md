# Roadmap Project

Roadmap Project is a React + TypeScript planning board for building and reviewing project timelines. It combines an editable task table with a visual roadmap that can be viewed by week, by month, or in a calendar grid.

## What It Does

- Create and edit roadmap tasks with phase, category, owner, start date, end date, and manual line-height padding.
- Reorder tasks by dragging rows in the task table.
- Filter and sort tasks directly in the editor, with the timeline and legends following the filtered task set.
- Filter tasks by text, `Phase HEX`, or `Category HEX` in the task panel search.
- Click a task bar in weekly or monthly view to isolate that task in the task table while keeping the full timeline visible, with the selected bar visually highlighted until cleared.
- Right-click a task bar or calendar chip to open the edit modal.
- Switch between weekly, monthly, and calendar views.
- Toggle date labels versus week/month numbers.
- Show or hide weekends in weekly, monthly, and calendar rendering.
- Paste tab-separated task data from a spreadsheet, preview it, edit it, and import it.
- Export the current task list to CSV.
- Show a category legend for the visible timeline.
- Choose whether bars use category or phase color, and whether bar labels show task, category, or phase text.
- Persist tasks in browser-local storage on the current device and browser.

## Task Fields

Each task supports these fields:

- `Phase`
- `Phase HEX`
- `Category`
- `Category HEX`
- `Task`
- `Sub-Task`
- `Owner`
- `Week`
- `Line Padding`
- `Date Start`
- `Date End`
- `Display Order`

## Timeline Views

### Weekly View

- Navigate backward or forward by week.
- Pick a starting date from the date picker.
- Change how many weeks are visible.
- Switch between a continuous horizontal board and vertically stacked full-week boards.
- Show or hide weekends without changing the underlying task dates.
- Toggle between date ranges and week numbers.

### Monthly View

- Navigate backward or forward by month.
- Change how many months are visible.
- Switch between a fixed month span and a custom date range.
- Switch between a continuous horizontal board and vertically stacked full-month boards.
- In stacked month layout, switch between day columns and week-range columns inside each month board.
- Toggle between month labels and month numbers.
- Show or hide weekends in the rendered monthly timeline without changing task dates.

### Calendar View

- Navigate backward or forward by the visible calendar span.
- Show one or more months at a time in a read-only calendar grid.
- Switch between a month-span view and a specific date range.
- Show or hide weekends in the calendar grid.
- Click a calendar task bar to mirror timeline task selection behavior in the task table.
- Calendar tasks render as week-spanning bars instead of repeated per-day chips.
- Long tasks continue across week boundaries with centered labels and edge arrows only when the task extends beyond the visible week segment.

## Import and Export

The import tool accepts tab-separated values, which makes it easy to paste from Excel or Google Sheets. After parsing, you can review and edit the imported rows before adding them to the board.

Recognized columns include:

- `Phase`
- `Phase Hex`
- `Category`
- `Category HEX`
- `Task`
- `Sub-Task`
- `Owner`
- `Date Start`
- `Date End`
- `Display Order`
- `Line Padding`

When tasks with the same phase, category, and name are imported together, the app groups them and merges their date range.

The export action downloads the full current task list as a CSV file, including a `Week` column. Export preserves manual `Display Order`, uses the task's stored `Week` value when present, and otherwise derives a relative week number from the task start date so manual tasks still export cleanly.

Current limitation:

- tasks persist only in the current browser on the current device
- the app does not yet offer cross-device sync, shared storage, or file-backed autosave

## Getting Started

### Prerequisites

- Node.js 18 or newer is the safe baseline for the current Vite toolchain.
- npm

### Install

```bash
npm install
```

### Run the App

```bash
npm run dev
```

Vite will start a local dev server, typically at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Tech Stack

- React 19
- TypeScript
- Vite
- `date-fns`
- `react-datepicker`

## Current Repository Notes

- The main app lives in [src/App.tsx](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap Project/src/App.tsx).
- Base styles are split between [src/App.css](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap Project/src/App.css) and [src/index.css](/Users/sarahmyers/Library/CloudStorage/OneDrive-Insight/Documents/GitHub/Roadmap Project/src/index.css).
- `npm run build` currently passes.
- `npm run lint` currently scans `.history/` snapshot files and produces unrelated errors; `npx eslint src/App.tsx` is the useful targeted check for active app changes until lint scope is narrowed.
