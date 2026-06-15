# Roadmap Project

Roadmap Project is a React + TypeScript planning board for building and reviewing project timelines. It combines an editable task table with a visual roadmap that can be viewed by week or by month.

## What It Does

- Create and edit roadmap tasks with phase, category, owner, start date, end date, and manual line-height padding.
- Reorder tasks by dragging rows in the task table.
- Filter and sort tasks directly in the editor.
- Switch between weekly and monthly timeline views.
- Toggle date labels versus week/month numbers.
- Group tasks by phase, or collapse phase grouping into a single timeline.
- Paste tab-separated task data from a spreadsheet, preview it, edit it, and import it.
- Export the current task list to CSV.
- Show category and phase legends for the visible timeline.

## Task Fields

Each task supports these fields:

- `Phase`
- `Phase HEX`
- `Category`
- `Category HEX`
- `Task`
- `Sub-Task`
- `Owner`
- `Line Padding`
- `Date Start`
- `Date End`
- `Display Order`

## Timeline Views

### Weekly View

- Navigate backward or forward by week.
- Pick a starting date from the date picker.
- Change how many weeks are visible.
- Toggle between date ranges and week numbers.

### Monthly View

- Navigate backward or forward by month.
- Change how many months are visible.
- Switch between a fixed month span and a custom date range.
- Toggle between month labels and month numbers.

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

The export action downloads the current task list as a CSV file.

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
- The current build is not clean yet: `npm run build` fails on unused variables in `src/App.tsx`.
