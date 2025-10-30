# Roadmap Project# Roadmap Project



A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.



## Features## Features



### Task Management### Task Management

- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields

  - Phase, Category, Task Name, Sub-Task  - Phase, Category, Task Name, Sub-Task

  - Owner assignment  - Owner assignment

  - Start and End dates  - Start and End dates

  - Color coding (Phase HEX, Category HEX)  - Color coding (Phase HEX, Category HEX)

- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table

- **Smart Filtering**: Real-time text search across all task fields- **Smart Filtering**: Real-time text search across all task fields

- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)



### Visualization Modes### Visualization Modes

- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)

  - Toggle between week numbers and date ranges  - Toggle between week numbers and date ranges

  - Daily resolution for precise task placement  - Daily resolution for precise task placement

- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)

  - Toggle between month numbers and date labels  - Toggle between month numbers and date labels

  - Month-level resolution for strategic overview  - Month-level resolution for strategic overview



### Smart Task Positioning### Smart Task Positioning

- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace

  - Collision detection prevents overlapping  - Collision detection prevents overlapping

  - Tasks sorted by vacation priority, then date, then display order  - Tasks sorted by vacation priority, then date, then display order

- **Dynamic Height Calculation**: Task bars automatically adjust based on text content- **Dynamic Height Calculation**: Task bars automatically adjust based on text content

  - Word-wrap simulation ensures text fits within bars  - Word-wrap simulation ensures text fits within bars

  - Multi-line support for longer task names  - Multi-line support for longer task names

- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline



### Phase & Category Management### Phase & Category Management

- **Phase Grouping**: Tasks organized into phases with colored header bars- **Phase Grouping**: Tasks organized into phases with colored header bars

  - Phase-specific background colors (lightened for readability)  - Phase-specific background colors (lightened for readability)

  - Week/month range labels for each phase  - Week/month range labels for each phase

  - Toggle phase visibility on/off  - Toggle phase visibility on/off

- **Color Intelligence**: - **Color Intelligence**: 

  - Automatic text color calculation (black/white) based on background luminance  - Automatic text color calculation (black/white) based on background luminance

  - Color lightening via white blending (no transparency)  - Color lightening via white blending (no transparency)

  - Separate colors for phases (headers/backgrounds) and categories (task bars)  - Separate colors for phases (headers/backgrounds) and categories (task bars)

- **Visual Legends**: Reference guides showing all phase and category colors- **Visual Legends**: Reference guides showing all phase and category colors



### Data Import### Data Import

- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications

- **Flexible Column Mapping**: Automatically recognizes various header names:- **Flexible Column Mapping**: Automatically recognizes various header names:

  - "Phase", "Stage" → Phase  - "Phase", "Stage" → Phase

  - "Date Start", "Start Date", "Start" → Start Date  - "Date Start", "Start Date", "Start" → Start Date

  - "Task", "Task Name", "Name", "Title", "Description" → Task Name  - "Task", "Task Name", "Name", "Title", "Description" → Task Name

  - And more...  - And more...

- **Preview & Edit**: Review imported data in an editable table before adding to timeline- **Preview & Edit**: Review imported data in an editable table before adding to timeline

- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name

  - Combines date ranges (earliest start, latest end)  - Combines date ranges (earliest start, latest end)

  - Concatenates sub-tasks and owners  - Concatenates sub-tasks and owners

- **Auto-Navigation**: Timeline automatically jumps to show imported tasks- **Auto-Navigation**: Timeline automatically jumps to show imported tasks



### Navigation & Display### Navigation & Display

- **Time Navigation**: Previous/Next buttons to move through timeline- **Time Navigation**: Previous/Next buttons to move through timeline

- **Date Picker**: Jump to specific dates- **Date Picker**: Jump to specific dates

- **Configurable Spans**: Adjust number of weeks/months displayed- **Configurable Spans**: Adjust number of weeks/months displayed

- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections

- **Clear All**: Bulk delete all tasks (with confirmation)- **Clear All**: Bulk delete all tasks (with confirmation)



## Getting Started## Getting Started



### Prerequisites### Prerequisites



- Node.js (version 16 or higher)- Node.js (version 16 or higher)

- npm or yarn- npm or yarn



### Installation### Installation



1. Clone the repository:1. Clone the repository:

   ```bash   ```bash

   git clone <repository-url>   git clone <repository-url>

   cd "Roadmap Project"   cd "Roadmap Project"

   ```   ```



2. Install dependencies:2. Install dependencies:

   ```bash   ```bash

   npm install   npm install

   ```   ```



### Running the Application### Running the Application



Start the development server:Start the development server:

```bash```bash

npm run devnpm run dev

``````



Open [http://localhost:5173](http://localhost:5173) in your browser.Open [http://localhost:5173](http://localhost:5173) in your browser.



### Building for Production### Building for Production



```bash```bash

npm run buildnpm run build

``````



The optimized build will be in the `dist/` directory.The optimized build will be in the `dist/` directory.



### Preview Production Build### Preview Production Build



```bash```bash

npm run previewnpm run preview

``````



## Usage Guide## Usage Guide



### Adding Tasks Manually### Adding Tasks Manually



1. Click **Add Task** button1. Click **Add Task** button

2. Fill in task details in the table:2. Fill in task details in the table:

   - **Phase**: Project phase name (e.g., "Foundation & Discovery")   - **Phase**: Project phase name (e.g., "Foundation & Discovery")

   - **Phase HEX**: Color code for phase (e.g., "D40E8C")   - **Phase HEX**: Color code for phase (e.g., "D40E8C")

   - **Category**: Task category (e.g., "Project Initiation")   - **Category**: Task category (e.g., "Project Initiation")

   - **Category HEX**: Color code for task bar (e.g., "D30C55")   - **Category HEX**: Color code for task bar (e.g., "D30C55")

   - **Task**: Task name/description   - **Task**: Task name/description

   - **Sub-Task**: Optional sub-task details   - **Sub-Task**: Optional sub-task details

   - **Owner**: Person responsible   - **Owner**: Person responsible

   - **Start/End Date**: Use date pickers to select dates   - **Start/End Date**: Use date pickers to select dates

3. Tasks automatically appear in the timeline3. Tasks automatically appear in the timeline



### Importing Tasks from Spreadsheet### Importing Tasks from Spreadsheet



1. Prepare tab-separated data (copy from Excel):1. Prepare tab-separated data (copy from Excel):

   ```   ```

   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End

   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026

   ```   ```



2. Click **▶ Import Tasks from Table** to expand the import section2. Click **▶ Import Tasks from Table** to expand the import section

3. Paste data into the text area3. Paste data into the text area

4. Click **Parse Data** to preview4. Click **Parse Data** to preview

5. Edit any cells in the preview table if needed5. Edit any cells in the preview table if needed

6. Click **Import Tasks** to add to timeline6. Click **Import Tasks** to add to timeline



### Navigating the Timeline### Navigating the Timeline



- **Change View**: Switch between "Weeks" and "Months" view- **Change View**: Switch between "Weeks" and "Months" view

- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date

- **Adjust Span**: Change the number of weeks/months visible- **Adjust Span**: Change the number of weeks/months visible

- **Toggle Displays**: - **Toggle Displays**: 

  - Show Week Numbers / Show Dates  - Show Week Numbers / Show Dates

  - Show/Hide Phases  - Show/Hide Phases

- **Filter**: Use the search box to find specific tasks- **Filter**: Use the search box to find specific tasks

- **Sort**: Select sort criteria and toggle ascending/descending order- **Sort**: Select sort criteria and toggle ascending/descending order



### Visual Indicators### Visual Indicators



- **Colored Bars**: Tasks displayed with category colors- **Colored Bars**: Tasks displayed with category colors

- **Phase Headers**: Colored bars showing phase duration with week/month ranges- **Phase Headers**: Colored bars showing phase duration with week/month ranges

- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after

- **Vacation Bars**: Gray background overlay for vacation periods- **Vacation Bars**: Gray background overlay for vacation periods

- **Hover Effects**: Task bars lift up with shadow on hover- **Hover Effects**: Task bars lift up with shadow on hover



## Technologies Used## Technologies Used



- **React** 19.1 - UI framework- **React** 19.1 - UI framework

- **TypeScript** 5.9 - Type safety- **TypeScript** 5.9 - Type safety

- **Vite** 7.1 - Build tool and dev server- **Vite** 7.1 - Build tool and dev server

- **date-fns** 4.1 - Date manipulation utilities- **date-fns** 4.1 - Date manipulation utilities

- **react-datepicker** 8.7 - Date selection component- **react-datepicker** 8.7 - Date selection component

- **ESLint** 9.36 - Code linting- **ESLint** 9.36 - Code linting

- **CSS Grid & Absolute Positioning** - Layout system- **CSS Grid & Absolute Positioning** - Layout system



## Architecture Highlights## Architecture Highlights



- **Functional Components**: React hooks (useState) for state management- **Functional Components**: React hooks (useState) for state management

- **Collision Detection**: Intelligent vertical positioning algorithm- **Collision Detection**: Intelligent vertical positioning algorithm

- **Responsive Columns**: Percentage-based horizontal positioning- **Responsive Columns**: Percentage-based horizontal positioning

- **Date Normalization**: Handles DST issues by normalizing to midnight- **Date Normalization**: Handles DST issues by normalizing to midnight

- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation

- **Color Calculations**: Luminance-based text color selection for accessibility- **Color Calculations**: Luminance-based text color selection for accessibility



## Project Structure



```A React-based web application for managing tasks and timelines with data table functionality and visual board views.

├── src/

│   ├── App.tsx       # Main application (2000+ lines)## Features

│   ├── App.css       # All styles with CSS variables

│   ├── main.tsx      # React entry point- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)

│   └── index.css     # Global/reset styles- Date pickers for selecting start and end dates

├── public/           # Static assets- Import tasks from tab-separated data with review and edit functionality

├── .github/          # Copilot instructions- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)

└── vite.config.ts    # Build configuration- Automatic navigation and filtering of tasks within time ranges

```- Add, edit, and remove tasks directly in the table or board

- Console logging for debugging import process

## License

## Getting Started

This project is available for use under standard software development practices.

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.

## Features

### Task Management
- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields
  - Phase, Category, Task Name, Sub-Task
  - Owner assignment
  - Start and End dates
  - Color coding (Phase HEX, Category HEX)
- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table
- **Smart Filtering**: Real-time text search across all task fields
- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)

### Visualization Modes
- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)
  - Toggle between week numbers and date ranges
  - Daily resolution for precise task placement
- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)
  - Toggle between month numbers and date labels
  - Month-level resolution for strategic overview

### Smart Task Positioning
- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace
  - Collision detection prevents overlapping
  - Tasks sorted by vacation priority, then date, then display order
- **Dynamic Height Calculation**: Task bars automatically adjust based on text content
  - Word-wrap simulation ensures text fits within bars
  - Multi-line support for longer task names
- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline

### Phase & Category Management
- **Phase Grouping**: Tasks organized into phases with colored header bars
  - Phase-specific background colors (lightened for readability)
  - Week/month range labels for each phase
  - Toggle phase visibility on/off
- **Color Intelligence**: 
  - Automatic text color calculation (black/white) based on background luminance
  - Color lightening via white blending (no transparency)
  - Separate colors for phases (headers/backgrounds) and categories (task bars)
- **Visual Legends**: Reference guides showing all phase and category colors

### Data Import
- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications
- **Flexible Column Mapping**: Automatically recognizes various header names:
  - "Phase", "Stage" → Phase
  - "Date Start", "Start Date", "Start" → Start Date
  - "Task", "Task Name", "Name", "Title", "Description" → Task Name
  - And more...
- **Preview & Edit**: Review imported data in an editable table before adding to timeline
- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name
  - Combines date ranges (earliest start, latest end)
  - Concatenates sub-tasks and owners
- **Auto-Navigation**: Timeline automatically jumps to show imported tasks

### Navigation & Display
- **Time Navigation**: Previous/Next buttons to move through timeline
- **Date Picker**: Jump to specific dates
- **Configurable Spans**: Adjust number of weeks/months displayed
- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections
- **Clear All**: Bulk delete all tasks (with confirmation)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Roadmap Project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Adding Tasks Manually

1. Click **Add Task** button
2. Fill in task details in the table:
   - **Phase**: Project phase name (e.g., "Foundation & Discovery")
   - **Phase HEX**: Color code for phase (e.g., "D40E8C")
   - **Category**: Task category (e.g., "Project Initiation")
   - **Category HEX**: Color code for task bar (e.g., "D30C55")
   - **Task**: Task name/description
   - **Sub-Task**: Optional sub-task details
   - **Owner**: Person responsible
   - **Start/End Date**: Use date pickers to select dates
3. Tasks automatically appear in the timeline

### Importing Tasks from Spreadsheet

1. Prepare tab-separated data (copy from Excel):
   ```
   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End
   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026
   ```

2. Click **▶ Import Tasks from Table** to expand the import section
3. Paste data into the text area
4. Click **Parse Data** to preview
5. Edit any cells in the preview table if needed
6. Click **Import Tasks** to add to timeline

### Navigating the Timeline

- **Change View**: Switch between "Weeks" and "Months" view
- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date
- **Adjust Span**: Change the number of weeks/months visible
- **Toggle Displays**: 
  - Show Week Numbers / Show Dates
  - Show/Hide Phases
- **Filter**: Use the search box to find specific tasks
- **Sort**: Select sort criteria and toggle ascending/descending order

### Visual Indicators

- **Colored Bars**: Tasks displayed with category colors
- **Phase Headers**: Colored bars showing phase duration with week/month ranges
- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after
- **Vacation Bars**: Gray background overlay for vacation periods
- **Hover Effects**: Task bars lift up with shadow on hover

## Technologies Used

- **React** 19.1 - UI framework
- **TypeScript** 5.9 - Type safety
- **Vite** 7.1 - Build tool and dev server
- **date-fns** 4.1 - Date manipulation utilities
- **react-datepicker** 8.7 - Date selection component
- **ESLint** 9.36 - Code linting
- **CSS Grid & Absolute Positioning** - Layout system

## Architecture Highlights

- **Functional Components**: React hooks (useState) for state management
- **Collision Detection**: Intelligent vertical positioning algorithm
- **Responsive Columns**: Percentage-based horizontal positioning
- **Date Normalization**: Handles DST issues by normalizing to midnight
- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation
- **Color Calculations**: Luminance-based text color selection for accessibility



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns





A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.



## Features## Features



### Task Management### Task Management

- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields

  - Phase, Category, Task Name, Sub-Task  - Phase, Category, Task Name, Sub-Task

  - Owner assignment  - Owner assignment

  - Start and End dates  - Start and End dates

  - Color coding (Phase HEX, Category HEX)  - Color coding (Phase HEX, Category HEX)

- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table

- **Smart Filtering**: Real-time text search across all task fields- **Smart Filtering**: Real-time text search across all task fields

- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)



### Visualization Modes### Visualization Modes

- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)

  - Toggle between week numbers and date ranges  - Toggle between week numbers and date ranges

  - Daily resolution for precise task placement  - Daily resolution for precise task placement

- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)

  - Toggle between month numbers and date labels  - Toggle between month numbers and date labels

  - Month-level resolution for strategic overview  - Month-level resolution for strategic overview



### Smart Task Positioning### Smart Task Positioning

- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace

  - Collision detection prevents overlapping  - Collision detection prevents overlapping

  - Tasks sorted by vacation priority, then date, then display order  - Tasks sorted by vacation priority, then date, then display order

- **Dynamic Height Calculation**: Task bars automatically adjust based on text content- **Dynamic Height Calculation**: Task bars automatically adjust based on text content

  - Word-wrap simulation ensures text fits within bars  - Word-wrap simulation ensures text fits within bars

  - Multi-line support for longer task names  - Multi-line support for longer task names

- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline



### Phase & Category Management### Phase & Category Management

- **Phase Grouping**: Tasks organized into phases with colored header bars- **Phase Grouping**: Tasks organized into phases with colored header bars

  - Phase-specific background colors (lightened for readability)  - Phase-specific background colors (lightened for readability)

  - Week/month range labels for each phase  - Week/month range labels for each phase

  - Toggle phase visibility on/off  - Toggle phase visibility on/off

- **Color Intelligence**: - **Color Intelligence**: 

  - Automatic text color calculation (black/white) based on background luminance  - Automatic text color calculation (black/white) based on background luminance

  - Color lightening via white blending (no transparency)  - Color lightening via white blending (no transparency)

  - Separate colors for phases (headers/backgrounds) and categories (task bars)  - Separate colors for phases (headers/backgrounds) and categories (task bars)

- **Visual Legends**: Reference guides showing all phase and category colors- **Visual Legends**: Reference guides showing all phase and category colors



### Data Import### Data Import

- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications

- **Flexible Column Mapping**: Automatically recognizes various header names:- **Flexible Column Mapping**: Automatically recognizes various header names:

  - "Phase", "Stage" → Phase  - "Phase", "Stage" → Phase

  - "Date Start", "Start Date", "Start" → Start Date  - "Date Start", "Start Date", "Start" → Start Date

  - "Task", "Task Name", "Name", "Title", "Description" → Task Name  - "Task", "Task Name", "Name", "Title", "Description" → Task Name

  - And more...  - And more...

- **Preview & Edit**: Review imported data in an editable table before adding to timeline- **Preview & Edit**: Review imported data in an editable table before adding to timeline

- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name

  - Combines date ranges (earliest start, latest end)  - Combines date ranges (earliest start, latest end)

  - Concatenates sub-tasks and owners  - Concatenates sub-tasks and owners

- **Auto-Navigation**: Timeline automatically jumps to show imported tasks- **Auto-Navigation**: Timeline automatically jumps to show imported tasks



### Navigation & Display### Navigation & Display

- **Time Navigation**: Previous/Next buttons to move through timeline- **Time Navigation**: Previous/Next buttons to move through timeline

- **Date Picker**: Jump to specific dates- **Date Picker**: Jump to specific dates

- **Configurable Spans**: Adjust number of weeks/months displayed- **Configurable Spans**: Adjust number of weeks/months displayed

- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections

- **Clear All**: Bulk delete all tasks (with confirmation)- **Clear All**: Bulk delete all tasks (with confirmation)



## Getting Started## Getting Started



### Prerequisites### Prerequisites



- Node.js (version 16 or higher)- Node.js (version 16 or higher)

- npm or yarn- npm or yarn



### Installation### Installation



1. Clone the repository:1. Clone the repository:

   ```bash   ```bash

   git clone <repository-url>   git clone <repository-url>

   cd "Roadmap Project"   cd "Roadmap Project"

   ```   ```



2. Install dependencies:2. Install dependencies:

   ```bash   ```bash

   npm install   npm install

   ```   ```



### Running the Application### Running the Application



Start the development server:Start the development server:

```bash```bash

npm run devnpm run dev

``````



Open [http://localhost:5173](http://localhost:5173) in your browser.Open [http://localhost:5173](http://localhost:5173) in your browser.



### Building for Production### Building for Production



```bash```bash

npm run buildnpm run build

``````



The optimized build will be in the `dist/` directory.The optimized build will be in the `dist/` directory.



### Preview Production Build### Preview Production Build



```bash```bash

npm run previewnpm run preview

``````



## Usage Guide## Usage Guide



### Adding Tasks Manually### Adding Tasks Manually



1. Click **Add Task** button1. Click **Add Task** button

2. Fill in task details in the table:2. Fill in task details in the table:

   - **Phase**: Project phase name (e.g., "Foundation & Discovery")   - **Phase**: Project phase name (e.g., "Foundation & Discovery")

   - **Phase HEX**: Color code for phase (e.g., "D40E8C")   - **Phase HEX**: Color code for phase (e.g., "D40E8C")

   - **Category**: Task category (e.g., "Project Initiation")   - **Category**: Task category (e.g., "Project Initiation")

   - **Category HEX**: Color code for task bar (e.g., "D30C55")   - **Category HEX**: Color code for task bar (e.g., "D30C55")

   - **Task**: Task name/description   - **Task**: Task name/description

   - **Sub-Task**: Optional sub-task details   - **Sub-Task**: Optional sub-task details

   - **Owner**: Person responsible   - **Owner**: Person responsible

   - **Start/End Date**: Use date pickers to select dates   - **Start/End Date**: Use date pickers to select dates

3. Tasks automatically appear in the timeline3. Tasks automatically appear in the timeline



### Importing Tasks from Spreadsheet### Importing Tasks from Spreadsheet



1. Prepare tab-separated data (copy from Excel):1. Prepare tab-separated data (copy from Excel):

   ```   ```

   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End

   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026

   ```   ```



2. Click **▶ Import Tasks from Table** to expand the import section2. Click **▶ Import Tasks from Table** to expand the import section

3. Paste data into the text area3. Paste data into the text area

4. Click **Parse Data** to preview4. Click **Parse Data** to preview

5. Edit any cells in the preview table if needed5. Edit any cells in the preview table if needed

6. Click **Import Tasks** to add to timeline6. Click **Import Tasks** to add to timeline



### Navigating the Timeline### Navigating the Timeline



- **Change View**: Switch between "Weeks" and "Months" view- **Change View**: Switch between "Weeks" and "Months" view

- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date

- **Adjust Span**: Change the number of weeks/months visible- **Adjust Span**: Change the number of weeks/months visible

- **Toggle Displays**: - **Toggle Displays**: 

  - Show Week Numbers / Show Dates  - Show Week Numbers / Show Dates

  - Show/Hide Phases  - Show/Hide Phases

- **Filter**: Use the search box to find specific tasks- **Filter**: Use the search box to find specific tasks

- **Sort**: Select sort criteria and toggle ascending/descending order- **Sort**: Select sort criteria and toggle ascending/descending order



### Visual Indicators### Visual Indicators



- **Colored Bars**: Tasks displayed with category colors- **Colored Bars**: Tasks displayed with category colors

- **Phase Headers**: Colored bars showing phase duration with week/month ranges- **Phase Headers**: Colored bars showing phase duration with week/month ranges

- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after

- **Vacation Bars**: Gray background overlay for vacation periods- **Vacation Bars**: Gray background overlay for vacation periods

- **Hover Effects**: Task bars lift up with shadow on hover- **Hover Effects**: Task bars lift up with shadow on hover



## Technologies Used## Technologies Used



- **React** 19.1 - UI framework- **React** 19.1 - UI framework

- **TypeScript** 5.9 - Type safety- **TypeScript** 5.9 - Type safety

- **Vite** 7.1 - Build tool and dev server- **Vite** 7.1 - Build tool and dev server

- **date-fns** 4.1 - Date manipulation utilities- **date-fns** 4.1 - Date manipulation utilities

- **react-datepicker** 8.7 - Date selection component- **react-datepicker** 8.7 - Date selection component

- **ESLint** 9.36 - Code linting- **ESLint** 9.36 - Code linting

- **CSS Grid & Absolute Positioning** - Layout system- **CSS Grid & Absolute Positioning** - Layout system



## Architecture Highlights## Architecture Highlights



- **Functional Components**: React hooks (useState) for state management- **Functional Components**: React hooks (useState) for state management

- **Collision Detection**: Intelligent vertical positioning algorithm- **Collision Detection**: Intelligent vertical positioning algorithm

- **Responsive Columns**: Percentage-based horizontal positioning- **Responsive Columns**: Percentage-based horizontal positioning

- **Date Normalization**: Handles DST issues by normalizing to midnight- **Date Normalization**: Handles DST issues by normalizing to midnight

- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation

- **Color Calculations**: Luminance-based text color selection for accessibility- **Color Calculations**: Luminance-based text color selection for accessibility



## Project Structure



```A React-based web application for managing tasks and timelines with data table functionality and visual board views.

├── src/

│   ├── App.tsx       # Main application (2000+ lines)## Features

│   ├── App.css       # All styles with CSS variables

│   ├── main.tsx      # React entry point- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)

│   └── index.css     # Global/reset styles- Date pickers for selecting start and end dates

├── public/           # Static assets- Import tasks from tab-separated data with review and edit functionality

├── .github/          # Copilot instructions- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)

└── vite.config.ts    # Build configuration- Automatic navigation and filtering of tasks within time ranges

```- Add, edit, and remove tasks directly in the table or board

- Console logging for debugging import process

## License

## Getting Started

This project is available for use under standard software development practices.

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.

## Features

### Task Management
- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields
  - Phase, Category, Task Name, Sub-Task
  - Owner assignment
  - Start and End dates
  - Color coding (Phase HEX, Category HEX)
- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table
- **Smart Filtering**: Real-time text search across all task fields
- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)

### Visualization Modes
- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)
  - Toggle between week numbers and date ranges
  - Daily resolution for precise task placement
- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)
  - Toggle between month numbers and date labels
  - Month-level resolution for strategic overview

### Smart Task Positioning
- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace
  - Collision detection prevents overlapping
  - Tasks sorted by vacation priority, then date, then display order
- **Dynamic Height Calculation**: Task bars automatically adjust based on text content
  - Word-wrap simulation ensures text fits within bars
  - Multi-line support for longer task names
- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline

### Phase & Category Management
- **Phase Grouping**: Tasks organized into phases with colored header bars
  - Phase-specific background colors (lightened for readability)
  - Week/month range labels for each phase
  - Toggle phase visibility on/off
- **Color Intelligence**: 
  - Automatic text color calculation (black/white) based on background luminance
  - Color lightening via white blending (no transparency)
  - Separate colors for phases (headers/backgrounds) and categories (task bars)
- **Visual Legends**: Reference guides showing all phase and category colors

### Data Import
- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications
- **Flexible Column Mapping**: Automatically recognizes various header names:
  - "Phase", "Stage" → Phase
  - "Date Start", "Start Date", "Start" → Start Date
  - "Task", "Task Name", "Name", "Title", "Description" → Task Name
  - And more...
- **Preview & Edit**: Review imported data in an editable table before adding to timeline
- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name
  - Combines date ranges (earliest start, latest end)
  - Concatenates sub-tasks and owners
- **Auto-Navigation**: Timeline automatically jumps to show imported tasks

### Navigation & Display
- **Time Navigation**: Previous/Next buttons to move through timeline
- **Date Picker**: Jump to specific dates
- **Configurable Spans**: Adjust number of weeks/months displayed
- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections
- **Clear All**: Bulk delete all tasks (with confirmation)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Roadmap Project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Adding Tasks Manually

1. Click **Add Task** button
2. Fill in task details in the table:
   - **Phase**: Project phase name (e.g., "Foundation & Discovery")
   - **Phase HEX**: Color code for phase (e.g., "D40E8C")
   - **Category**: Task category (e.g., "Project Initiation")
   - **Category HEX**: Color code for task bar (e.g., "D30C55")
   - **Task**: Task name/description
   - **Sub-Task**: Optional sub-task details
   - **Owner**: Person responsible
   - **Start/End Date**: Use date pickers to select dates
3. Tasks automatically appear in the timeline

### Importing Tasks from Spreadsheet

1. Prepare tab-separated data (copy from Excel):
   ```
   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End
   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026
   ```

2. Click **▶ Import Tasks from Table** to expand the import section
3. Paste data into the text area
4. Click **Parse Data** to preview
5. Edit any cells in the preview table if needed
6. Click **Import Tasks** to add to timeline

### Navigating the Timeline

- **Change View**: Switch between "Weeks" and "Months" view
- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date
- **Adjust Span**: Change the number of weeks/months visible
- **Toggle Displays**: 
  - Show Week Numbers / Show Dates
  - Show/Hide Phases
- **Filter**: Use the search box to find specific tasks
- **Sort**: Select sort criteria and toggle ascending/descending order

### Visual Indicators

- **Colored Bars**: Tasks displayed with category colors
- **Phase Headers**: Colored bars showing phase duration with week/month ranges
- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after
- **Vacation Bars**: Gray background overlay for vacation periods
- **Hover Effects**: Task bars lift up with shadow on hover

## Technologies Used

- **React** 19.1 - UI framework
- **TypeScript** 5.9 - Type safety
- **Vite** 7.1 - Build tool and dev server
- **date-fns** 4.1 - Date manipulation utilities
- **react-datepicker** 8.7 - Date selection component
- **ESLint** 9.36 - Code linting
- **CSS Grid & Absolute Positioning** - Layout system

## Architecture Highlights

- **Functional Components**: React hooks (useState) for state management
- **Collision Detection**: Intelligent vertical positioning algorithm
- **Responsive Columns**: Percentage-based horizontal positioning
- **Date Normalization**: Handles DST issues by normalizing to midnight
- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation
- **Color Calculations**: Luminance-based text color selection for accessibility



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns





A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.



## Features## Features



### Task Management### Task Management

- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields

  - Phase, Category, Task Name, Sub-Task  - Phase, Category, Task Name, Sub-Task

  - Owner assignment  - Owner assignment

  - Start and End dates  - Start and End dates

  - Color coding (Phase HEX, Category HEX)  - Color coding (Phase HEX, Category HEX)

- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table

- **Smart Filtering**: Real-time text search across all task fields- **Smart Filtering**: Real-time text search across all task fields

- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)



### Visualization Modes### Visualization Modes

- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)

  - Toggle between week numbers and date ranges  - Toggle between week numbers and date ranges

  - Daily resolution for precise task placement  - Daily resolution for precise task placement

- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)

  - Toggle between month numbers and date labels  - Toggle between month numbers and date labels

  - Month-level resolution for strategic overview  - Month-level resolution for strategic overview



### Smart Task Positioning### Smart Task Positioning

- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace

  - Collision detection prevents overlapping  - Collision detection prevents overlapping

  - Tasks sorted by vacation priority, then date, then display order  - Tasks sorted by vacation priority, then date, then display order

- **Dynamic Height Calculation**: Task bars automatically adjust based on text content- **Dynamic Height Calculation**: Task bars automatically adjust based on text content

  - Word-wrap simulation ensures text fits within bars  - Word-wrap simulation ensures text fits within bars

  - Multi-line support for longer task names  - Multi-line support for longer task names

- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline



### Phase & Category Management### Phase & Category Management

- **Phase Grouping**: Tasks organized into phases with colored header bars- **Phase Grouping**: Tasks organized into phases with colored header bars

  - Phase-specific background colors (lightened for readability)  - Phase-specific background colors (lightened for readability)

  - Week/month range labels for each phase  - Week/month range labels for each phase

  - Toggle phase visibility on/off  - Toggle phase visibility on/off

- **Color Intelligence**: - **Color Intelligence**: 

  - Automatic text color calculation (black/white) based on background luminance  - Automatic text color calculation (black/white) based on background luminance

  - Color lightening via white blending (no transparency)  - Color lightening via white blending (no transparency)

  - Separate colors for phases (headers/backgrounds) and categories (task bars)  - Separate colors for phases (headers/backgrounds) and categories (task bars)

- **Visual Legends**: Reference guides showing all phase and category colors- **Visual Legends**: Reference guides showing all phase and category colors



### Data Import### Data Import

- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications

- **Flexible Column Mapping**: Automatically recognizes various header names:- **Flexible Column Mapping**: Automatically recognizes various header names:

  - "Phase", "Stage" → Phase  - "Phase", "Stage" → Phase

  - "Date Start", "Start Date", "Start" → Start Date  - "Date Start", "Start Date", "Start" → Start Date

  - "Task", "Task Name", "Name", "Title", "Description" → Task Name  - "Task", "Task Name", "Name", "Title", "Description" → Task Name

  - And more...  - And more...

- **Preview & Edit**: Review imported data in an editable table before adding to timeline- **Preview & Edit**: Review imported data in an editable table before adding to timeline

- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name

  - Combines date ranges (earliest start, latest end)  - Combines date ranges (earliest start, latest end)

  - Concatenates sub-tasks and owners  - Concatenates sub-tasks and owners

- **Auto-Navigation**: Timeline automatically jumps to show imported tasks- **Auto-Navigation**: Timeline automatically jumps to show imported tasks



### Navigation & Display### Navigation & Display

- **Time Navigation**: Previous/Next buttons to move through timeline- **Time Navigation**: Previous/Next buttons to move through timeline

- **Date Picker**: Jump to specific dates- **Date Picker**: Jump to specific dates

- **Configurable Spans**: Adjust number of weeks/months displayed- **Configurable Spans**: Adjust number of weeks/months displayed

- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections

- **Clear All**: Bulk delete all tasks (with confirmation)- **Clear All**: Bulk delete all tasks (with confirmation)



## Getting Started## Getting Started



### Prerequisites### Prerequisites



- Node.js (version 16 or higher)- Node.js (version 16 or higher)

- npm or yarn- npm or yarn



### Installation### Installation



1. Clone the repository:1. Clone the repository:

   ```bash   ```bash

   git clone <repository-url>   git clone <repository-url>

   cd "Roadmap Project"   cd "Roadmap Project"

   ```   ```



2. Install dependencies:2. Install dependencies:

   ```bash   ```bash

   npm install   npm install

   ```   ```



### Running the Application### Running the Application



Start the development server:Start the development server:

```bash```bash

npm run devnpm run dev

``````



Open [http://localhost:5173](http://localhost:5173) in your browser.Open [http://localhost:5173](http://localhost:5173) in your browser.



### Building for Production### Building for Production



```bash```bash

npm run buildnpm run build

``````



The optimized build will be in the `dist/` directory.The optimized build will be in the `dist/` directory.



### Preview Production Build### Preview Production Build



```bash```bash

npm run previewnpm run preview

``````



## Usage Guide## Usage Guide



### Adding Tasks Manually### Adding Tasks Manually



1. Click **Add Task** button1. Click **Add Task** button

2. Fill in task details in the table:2. Fill in task details in the table:

   - **Phase**: Project phase name (e.g., "Foundation & Discovery")   - **Phase**: Project phase name (e.g., "Foundation & Discovery")

   - **Phase HEX**: Color code for phase (e.g., "D40E8C")   - **Phase HEX**: Color code for phase (e.g., "D40E8C")

   - **Category**: Task category (e.g., "Project Initiation")   - **Category**: Task category (e.g., "Project Initiation")

   - **Category HEX**: Color code for task bar (e.g., "D30C55")   - **Category HEX**: Color code for task bar (e.g., "D30C55")

   - **Task**: Task name/description   - **Task**: Task name/description

   - **Sub-Task**: Optional sub-task details   - **Sub-Task**: Optional sub-task details

   - **Owner**: Person responsible   - **Owner**: Person responsible

   - **Start/End Date**: Use date pickers to select dates   - **Start/End Date**: Use date pickers to select dates

3. Tasks automatically appear in the timeline3. Tasks automatically appear in the timeline



### Importing Tasks from Spreadsheet### Importing Tasks from Spreadsheet



1. Prepare tab-separated data (copy from Excel):1. Prepare tab-separated data (copy from Excel):

   ```   ```

   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End

   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026

   ```   ```



2. Click **▶ Import Tasks from Table** to expand the import section2. Click **▶ Import Tasks from Table** to expand the import section

3. Paste data into the text area3. Paste data into the text area

4. Click **Parse Data** to preview4. Click **Parse Data** to preview

5. Edit any cells in the preview table if needed5. Edit any cells in the preview table if needed

6. Click **Import Tasks** to add to timeline6. Click **Import Tasks** to add to timeline



### Navigating the Timeline### Navigating the Timeline



- **Change View**: Switch between "Weeks" and "Months" view- **Change View**: Switch between "Weeks" and "Months" view

- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date

- **Adjust Span**: Change the number of weeks/months visible- **Adjust Span**: Change the number of weeks/months visible

- **Toggle Displays**: - **Toggle Displays**: 

  - Show Week Numbers / Show Dates  - Show Week Numbers / Show Dates

  - Show/Hide Phases  - Show/Hide Phases

- **Filter**: Use the search box to find specific tasks- **Filter**: Use the search box to find specific tasks

- **Sort**: Select sort criteria and toggle ascending/descending order- **Sort**: Select sort criteria and toggle ascending/descending order



### Visual Indicators### Visual Indicators



- **Colored Bars**: Tasks displayed with category colors- **Colored Bars**: Tasks displayed with category colors

- **Phase Headers**: Colored bars showing phase duration with week/month ranges- **Phase Headers**: Colored bars showing phase duration with week/month ranges

- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after

- **Vacation Bars**: Gray background overlay for vacation periods- **Vacation Bars**: Gray background overlay for vacation periods

- **Hover Effects**: Task bars lift up with shadow on hover- **Hover Effects**: Task bars lift up with shadow on hover



## Technologies Used## Technologies Used



- **React** 19.1 - UI framework- **React** 19.1 - UI framework

- **TypeScript** 5.9 - Type safety- **TypeScript** 5.9 - Type safety

- **Vite** 7.1 - Build tool and dev server- **Vite** 7.1 - Build tool and dev server

- **date-fns** 4.1 - Date manipulation utilities- **date-fns** 4.1 - Date manipulation utilities

- **react-datepicker** 8.7 - Date selection component- **react-datepicker** 8.7 - Date selection component

- **ESLint** 9.36 - Code linting- **ESLint** 9.36 - Code linting

- **CSS Grid & Absolute Positioning** - Layout system- **CSS Grid & Absolute Positioning** - Layout system



## Architecture Highlights## Architecture Highlights



- **Functional Components**: React hooks (useState) for state management- **Functional Components**: React hooks (useState) for state management

- **Collision Detection**: Intelligent vertical positioning algorithm- **Collision Detection**: Intelligent vertical positioning algorithm

- **Responsive Columns**: Percentage-based horizontal positioning- **Responsive Columns**: Percentage-based horizontal positioning

- **Date Normalization**: Handles DST issues by normalizing to midnight- **Date Normalization**: Handles DST issues by normalizing to midnight

- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation

- **Color Calculations**: Luminance-based text color selection for accessibility- **Color Calculations**: Luminance-based text color selection for accessibility



## Project Structure



```A React-based web application for managing tasks and timelines with data table functionality and visual board views.

├── src/

│   ├── App.tsx       # Main application (2000+ lines)## Features

│   ├── App.css       # All styles with CSS variables

│   ├── main.tsx      # React entry point- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)

│   └── index.css     # Global/reset styles- Date pickers for selecting start and end dates

├── public/           # Static assets- Import tasks from tab-separated data with review and edit functionality

├── .github/          # Copilot instructions- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)

└── vite.config.ts    # Build configuration- Automatic navigation and filtering of tasks within time ranges

```- Add, edit, and remove tasks directly in the table or board

- Console logging for debugging import process

## License

## Getting Started

This project is available for use under standard software development practices.

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.

## Features

### Task Management
- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields
  - Phase, Category, Task Name, Sub-Task
  - Owner assignment
  - Start and End dates
  - Color coding (Phase HEX, Category HEX)
- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table
- **Smart Filtering**: Real-time text search across all task fields
- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)

### Visualization Modes
- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)
  - Toggle between week numbers and date ranges
  - Daily resolution for precise task placement
- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)
  - Toggle between month numbers and date labels
  - Month-level resolution for strategic overview

### Smart Task Positioning
- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace
  - Collision detection prevents overlapping
  - Tasks sorted by vacation priority, then date, then display order
- **Dynamic Height Calculation**: Task bars automatically adjust based on text content
  - Word-wrap simulation ensures text fits within bars
  - Multi-line support for longer task names
- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline

### Phase & Category Management
- **Phase Grouping**: Tasks organized into phases with colored header bars
  - Phase-specific background colors (lightened for readability)
  - Week/month range labels for each phase
  - Toggle phase visibility on/off
- **Color Intelligence**: 
  - Automatic text color calculation (black/white) based on background luminance
  - Color lightening via white blending (no transparency)
  - Separate colors for phases (headers/backgrounds) and categories (task bars)
- **Visual Legends**: Reference guides showing all phase and category colors

### Data Import
- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications
- **Flexible Column Mapping**: Automatically recognizes various header names:
  - "Phase", "Stage" → Phase
  - "Date Start", "Start Date", "Start" → Start Date
  - "Task", "Task Name", "Name", "Title", "Description" → Task Name
  - And more...
- **Preview & Edit**: Review imported data in an editable table before adding to timeline
- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name
  - Combines date ranges (earliest start, latest end)
  - Concatenates sub-tasks and owners
- **Auto-Navigation**: Timeline automatically jumps to show imported tasks

### Navigation & Display
- **Time Navigation**: Previous/Next buttons to move through timeline
- **Date Picker**: Jump to specific dates
- **Configurable Spans**: Adjust number of weeks/months displayed
- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections
- **Clear All**: Bulk delete all tasks (with confirmation)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Roadmap Project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Adding Tasks Manually

1. Click **Add Task** button
2. Fill in task details in the table:
   - **Phase**: Project phase name (e.g., "Foundation & Discovery")
   - **Phase HEX**: Color code for phase (e.g., "D40E8C")
   - **Category**: Task category (e.g., "Project Initiation")
   - **Category HEX**: Color code for task bar (e.g., "D30C55")
   - **Task**: Task name/description
   - **Sub-Task**: Optional sub-task details
   - **Owner**: Person responsible
   - **Start/End Date**: Use date pickers to select dates
3. Tasks automatically appear in the timeline

### Importing Tasks from Spreadsheet

1. Prepare tab-separated data (copy from Excel):
   ```
   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End
   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026
   ```

2. Click **▶ Import Tasks from Table** to expand the import section
3. Paste data into the text area
4. Click **Parse Data** to preview
5. Edit any cells in the preview table if needed
6. Click **Import Tasks** to add to timeline

### Navigating the Timeline

- **Change View**: Switch between "Weeks" and "Months" view
- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date
- **Adjust Span**: Change the number of weeks/months visible
- **Toggle Displays**: 
  - Show Week Numbers / Show Dates
  - Show/Hide Phases
- **Filter**: Use the search box to find specific tasks
- **Sort**: Select sort criteria and toggle ascending/descending order

### Visual Indicators

- **Colored Bars**: Tasks displayed with category colors
- **Phase Headers**: Colored bars showing phase duration with week/month ranges
- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after
- **Vacation Bars**: Gray background overlay for vacation periods
- **Hover Effects**: Task bars lift up with shadow on hover

## Technologies Used

- **React** 19.1 - UI framework
- **TypeScript** 5.9 - Type safety
- **Vite** 7.1 - Build tool and dev server
- **date-fns** 4.1 - Date manipulation utilities
- **react-datepicker** 8.7 - Date selection component
- **ESLint** 9.36 - Code linting
- **CSS Grid & Absolute Positioning** - Layout system

## Architecture Highlights

- **Functional Components**: React hooks (useState) for state management
- **Collision Detection**: Intelligent vertical positioning algorithm
- **Responsive Columns**: Percentage-based horizontal positioning
- **Date Normalization**: Handles DST issues by normalizing to midnight
- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation
- **Color Calculations**: Luminance-based text color selection for accessibility



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns





A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.



## Features## Features



### Task Management### Task Management

- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields

  - Phase, Category, Task Name, Sub-Task  - Phase, Category, Task Name, Sub-Task

  - Owner assignment  - Owner assignment

  - Start and End dates  - Start and End dates

  - Color coding (Phase HEX, Category HEX)  - Color coding (Phase HEX, Category HEX)

- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table

- **Smart Filtering**: Real-time text search across all task fields- **Smart Filtering**: Real-time text search across all task fields

- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)



### Visualization Modes### Visualization Modes

- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)

  - Toggle between week numbers and date ranges  - Toggle between week numbers and date ranges

  - Daily resolution for precise task placement  - Daily resolution for precise task placement

- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)

  - Toggle between month numbers and date labels  - Toggle between month numbers and date labels

  - Month-level resolution for strategic overview  - Month-level resolution for strategic overview



### Smart Task Positioning### Smart Task Positioning

- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace

  - Collision detection prevents overlapping  - Collision detection prevents overlapping

  - Tasks sorted by vacation priority, then date, then display order  - Tasks sorted by vacation priority, then date, then display order

- **Dynamic Height Calculation**: Task bars automatically adjust based on text content- **Dynamic Height Calculation**: Task bars automatically adjust based on text content

  - Word-wrap simulation ensures text fits within bars  - Word-wrap simulation ensures text fits within bars

  - Multi-line support for longer task names  - Multi-line support for longer task names

- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline



### Phase & Category Management### Phase & Category Management

- **Phase Grouping**: Tasks organized into phases with colored header bars- **Phase Grouping**: Tasks organized into phases with colored header bars

  - Phase-specific background colors (lightened for readability)  - Phase-specific background colors (lightened for readability)

  - Week/month range labels for each phase  - Week/month range labels for each phase

  - Toggle phase visibility on/off  - Toggle phase visibility on/off

- **Color Intelligence**: - **Color Intelligence**: 

  - Automatic text color calculation (black/white) based on background luminance  - Automatic text color calculation (black/white) based on background luminance

  - Color lightening via white blending (no transparency)  - Color lightening via white blending (no transparency)

  - Separate colors for phases (headers/backgrounds) and categories (task bars)  - Separate colors for phases (headers/backgrounds) and categories (task bars)

- **Visual Legends**: Reference guides showing all phase and category colors- **Visual Legends**: Reference guides showing all phase and category colors



### Data Import### Data Import

- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications

- **Flexible Column Mapping**: Automatically recognizes various header names:- **Flexible Column Mapping**: Automatically recognizes various header names:

  - "Phase", "Stage" → Phase  - "Phase", "Stage" → Phase

  - "Date Start", "Start Date", "Start" → Start Date  - "Date Start", "Start Date", "Start" → Start Date

  - "Task", "Task Name", "Name", "Title", "Description" → Task Name  - "Task", "Task Name", "Name", "Title", "Description" → Task Name

  - And more...  - And more...

- **Preview & Edit**: Review imported data in an editable table before adding to timeline- **Preview & Edit**: Review imported data in an editable table before adding to timeline

- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name

  - Combines date ranges (earliest start, latest end)  - Combines date ranges (earliest start, latest end)

  - Concatenates sub-tasks and owners  - Concatenates sub-tasks and owners

- **Auto-Navigation**: Timeline automatically jumps to show imported tasks- **Auto-Navigation**: Timeline automatically jumps to show imported tasks



### Navigation & Display### Navigation & Display

- **Time Navigation**: Previous/Next buttons to move through timeline- **Time Navigation**: Previous/Next buttons to move through timeline

- **Date Picker**: Jump to specific dates- **Date Picker**: Jump to specific dates

- **Configurable Spans**: Adjust number of weeks/months displayed- **Configurable Spans**: Adjust number of weeks/months displayed

- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections

- **Clear All**: Bulk delete all tasks (with confirmation)- **Clear All**: Bulk delete all tasks (with confirmation)



## Getting Started## Getting Started



### Prerequisites### Prerequisites



- Node.js (version 16 or higher)- Node.js (version 16 or higher)

- npm or yarn- npm or yarn



### Installation### Installation



1. Clone the repository:1. Clone the repository:

   ```bash   ```bash

   git clone <repository-url>   git clone <repository-url>

   cd "Roadmap Project"   cd "Roadmap Project"

   ```   ```



2. Install dependencies:2. Install dependencies:

   ```bash   ```bash

   npm install   npm install

   ```   ```



### Running the Application### Running the Application



Start the development server:Start the development server:

```bash```bash

npm run devnpm run dev

``````



Open [http://localhost:5173](http://localhost:5173) in your browser.Open [http://localhost:5173](http://localhost:5173) in your browser.



### Building for Production### Building for Production



```bash```bash

npm run buildnpm run build

``````



The optimized build will be in the `dist/` directory.The optimized build will be in the `dist/` directory.



### Preview Production Build### Preview Production Build



```bash```bash

npm run previewnpm run preview

``````



## Usage Guide## Usage Guide



### Adding Tasks Manually### Adding Tasks Manually



1. Click **Add Task** button1. Click **Add Task** button

2. Fill in task details in the table:2. Fill in task details in the table:

   - **Phase**: Project phase name (e.g., "Foundation & Discovery")   - **Phase**: Project phase name (e.g., "Foundation & Discovery")

   - **Phase HEX**: Color code for phase (e.g., "D40E8C")   - **Phase HEX**: Color code for phase (e.g., "D40E8C")

   - **Category**: Task category (e.g., "Project Initiation")   - **Category**: Task category (e.g., "Project Initiation")

   - **Category HEX**: Color code for task bar (e.g., "D30C55")   - **Category HEX**: Color code for task bar (e.g., "D30C55")

   - **Task**: Task name/description   - **Task**: Task name/description

   - **Sub-Task**: Optional sub-task details   - **Sub-Task**: Optional sub-task details

   - **Owner**: Person responsible   - **Owner**: Person responsible

   - **Start/End Date**: Use date pickers to select dates   - **Start/End Date**: Use date pickers to select dates

3. Tasks automatically appear in the timeline3. Tasks automatically appear in the timeline



### Importing Tasks from Spreadsheet### Importing Tasks from Spreadsheet



1. Prepare tab-separated data (copy from Excel):1. Prepare tab-separated data (copy from Excel):

   ```   ```

   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End

   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026

   ```   ```



2. Click **▶ Import Tasks from Table** to expand the import section2. Click **▶ Import Tasks from Table** to expand the import section

3. Paste data into the text area3. Paste data into the text area

4. Click **Parse Data** to preview4. Click **Parse Data** to preview

5. Edit any cells in the preview table if needed5. Edit any cells in the preview table if needed

6. Click **Import Tasks** to add to timeline6. Click **Import Tasks** to add to timeline



### Navigating the Timeline### Navigating the Timeline



- **Change View**: Switch between "Weeks" and "Months" view- **Change View**: Switch between "Weeks" and "Months" view

- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date

- **Adjust Span**: Change the number of weeks/months visible- **Adjust Span**: Change the number of weeks/months visible

- **Toggle Displays**: - **Toggle Displays**: 

  - Show Week Numbers / Show Dates  - Show Week Numbers / Show Dates

  - Show/Hide Phases  - Show/Hide Phases

- **Filter**: Use the search box to find specific tasks- **Filter**: Use the search box to find specific tasks

- **Sort**: Select sort criteria and toggle ascending/descending order- **Sort**: Select sort criteria and toggle ascending/descending order



### Visual Indicators### Visual Indicators



- **Colored Bars**: Tasks displayed with category colors- **Colored Bars**: Tasks displayed with category colors

- **Phase Headers**: Colored bars showing phase duration with week/month ranges- **Phase Headers**: Colored bars showing phase duration with week/month ranges

- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after

- **Vacation Bars**: Gray background overlay for vacation periods- **Vacation Bars**: Gray background overlay for vacation periods

- **Hover Effects**: Task bars lift up with shadow on hover- **Hover Effects**: Task bars lift up with shadow on hover



## Technologies Used## Technologies Used



- **React** 19.1 - UI framework- **React** 19.1 - UI framework

- **TypeScript** 5.9 - Type safety- **TypeScript** 5.9 - Type safety

- **Vite** 7.1 - Build tool and dev server- **Vite** 7.1 - Build tool and dev server

- **date-fns** 4.1 - Date manipulation utilities- **date-fns** 4.1 - Date manipulation utilities

- **react-datepicker** 8.7 - Date selection component- **react-datepicker** 8.7 - Date selection component

- **ESLint** 9.36 - Code linting- **ESLint** 9.36 - Code linting

- **CSS Grid & Absolute Positioning** - Layout system- **CSS Grid & Absolute Positioning** - Layout system



## Architecture Highlights## Architecture Highlights



- **Functional Components**: React hooks (useState) for state management- **Functional Components**: React hooks (useState) for state management

- **Collision Detection**: Intelligent vertical positioning algorithm- **Collision Detection**: Intelligent vertical positioning algorithm

- **Responsive Columns**: Percentage-based horizontal positioning- **Responsive Columns**: Percentage-based horizontal positioning

- **Date Normalization**: Handles DST issues by normalizing to midnight- **Date Normalization**: Handles DST issues by normalizing to midnight

- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation

- **Color Calculations**: Luminance-based text color selection for accessibility- **Color Calculations**: Luminance-based text color selection for accessibility



## Project Structure



```A React-based web application for managing tasks and timelines with data table functionality and visual board views.

├── src/

│   ├── App.tsx       # Main application (2000+ lines)## Features

│   ├── App.css       # All styles with CSS variables

│   ├── main.tsx      # React entry point- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)

│   └── index.css     # Global/reset styles- Date pickers for selecting start and end dates

├── public/           # Static assets- Import tasks from tab-separated data with review and edit functionality

├── .github/          # Copilot instructions- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)

└── vite.config.ts    # Build configuration- Automatic navigation and filtering of tasks within time ranges

```- Add, edit, and remove tasks directly in the table or board

- Console logging for debugging import process

## License

## Getting Started

This project is available for use under standard software development practices.

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A sophisticated React-based weekly planning board for managing project tasks and timelines with Gantt-chart style visualization. Features advanced task positioning algorithms, phase grouping, and dual view modes for short-term and long-term planning.

## Features

### Task Management
- **Interactive Task List**: Add, edit, remove, and duplicate tasks with comprehensive fields
  - Phase, Category, Task Name, Sub-Task
  - Owner assignment
  - Start and End dates
  - Color coding (Phase HEX, Category HEX)
- **Drag-and-Drop Reordering**: Rearrange tasks by dragging rows in the task table
- **Smart Filtering**: Real-time text search across all task fields
- **Flexible Sorting**: Sort by phase, category, name, dates, or display order (ascending/descending)

### Visualization Modes
- **Weekly View**: Detailed view showing tasks across configurable week spans (default: 7 weeks)
  - Toggle between week numbers and date ranges
  - Daily resolution for precise task placement
- **Monthly View**: Long-term planning across configurable month spans (3, 6, or 12 months)
  - Toggle between month numbers and date labels
  - Month-level resolution for strategic overview

### Smart Task Positioning
- **"Reverse Tetris" Algorithm**: Automatically packs tasks vertically to minimize whitespace
  - Collision detection prevents overlapping
  - Tasks sorted by vacation priority, then date, then display order
- **Dynamic Height Calculation**: Task bars automatically adjust based on text content
  - Word-wrap simulation ensures text fits within bars
  - Multi-line support for longer task names
- **Visual Indicators**: Arrows (◀ ▶) show when tasks extend beyond visible timeline

### Phase & Category Management
- **Phase Grouping**: Tasks organized into phases with colored header bars
  - Phase-specific background colors (lightened for readability)
  - Week/month range labels for each phase
  - Toggle phase visibility on/off
- **Color Intelligence**: 
  - Automatic text color calculation (black/white) based on background luminance
  - Color lightening via white blending (no transparency)
  - Separate colors for phases (headers/backgrounds) and categories (task bars)
- **Visual Legends**: Reference guides showing all phase and category colors

### Data Import
- **Tab-Separated Import**: Paste data from Excel or other spreadsheet applications
- **Flexible Column Mapping**: Automatically recognizes various header names:
  - "Phase", "Stage" → Phase
  - "Date Start", "Start Date", "Start" → Start Date
  - "Task", "Task Name", "Name", "Title", "Description" → Task Name
  - And more...
- **Preview & Edit**: Review imported data in an editable table before adding to timeline
- **Intelligent Grouping**: Automatically merges tasks with same phase/category/name
  - Combines date ranges (earliest start, latest end)
  - Concatenates sub-tasks and owners
- **Auto-Navigation**: Timeline automatically jumps to show imported tasks

### Navigation & Display
- **Time Navigation**: Previous/Next buttons to move through timeline
- **Date Picker**: Jump to specific dates
- **Configurable Spans**: Adjust number of weeks/months displayed
- **Collapsible Sections**: Show/hide Tasks, Import, and Timeline sections
- **Clear All**: Bulk delete all tasks (with confirmation)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Roadmap Project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Adding Tasks Manually

1. Click **Add Task** button
2. Fill in task details in the table:
   - **Phase**: Project phase name (e.g., "Foundation & Discovery")
   - **Phase HEX**: Color code for phase (e.g., "D40E8C")
   - **Category**: Task category (e.g., "Project Initiation")
   - **Category HEX**: Color code for task bar (e.g., "D30C55")
   - **Task**: Task name/description
   - **Sub-Task**: Optional sub-task details
   - **Owner**: Person responsible
   - **Start/End Date**: Use date pickers to select dates
3. Tasks automatically appear in the timeline

### Importing Tasks from Spreadsheet

1. Prepare tab-separated data (copy from Excel):
   ```
   Phase	Phase Hex	Category	Category HEX	Task	Sub-Task	Owner	Date Start	Date End
   Foundation & Discovery	D40E8C	Project Initiation	D30C55	Project Kickoff & Setup			1/4/2026	1/17/2026
   ```

2. Click **▶ Import Tasks from Table** to expand the import section
3. Paste data into the text area
4. Click **Parse Data** to preview
5. Edit any cells in the preview table if needed
6. Click **Import Tasks** to add to timeline

### Navigating the Timeline

- **Change View**: Switch between "Weeks" and "Months" view
- **Navigate**: Use Previous/Next buttons or click the date range button to pick a specific date
- **Adjust Span**: Change the number of weeks/months visible
- **Toggle Displays**: 
  - Show Week Numbers / Show Dates
  - Show/Hide Phases
- **Filter**: Use the search box to find specific tasks
- **Sort**: Select sort criteria and toggle ascending/descending order

### Visual Indicators

- **Colored Bars**: Tasks displayed with category colors
- **Phase Headers**: Colored bars showing phase duration with week/month ranges
- **Arrows**: ◀ indicates task starts before visible timeline, ▶ indicates task ends after
- **Vacation Bars**: Gray background overlay for vacation periods
- **Hover Effects**: Task bars lift up with shadow on hover

## Technologies Used

- **React** 19.1 - UI framework
- **TypeScript** 5.9 - Type safety
- **Vite** 7.1 - Build tool and dev server
- **date-fns** 4.1 - Date manipulation utilities
- **react-datepicker** 8.7 - Date selection component
- **ESLint** 9.36 - Code linting
- **CSS Grid & Absolute Positioning** - Layout system

## Architecture Highlights

- **Functional Components**: React hooks (useState) for state management
- **Collision Detection**: Intelligent vertical positioning algorithm
- **Responsive Columns**: Percentage-based horizontal positioning
- **Date Normalization**: Handles DST issues by normalizing to midnight
- **Smart Text Wrapping**: Word-wrap simulation for dynamic height calculation
- **Color Calculations**: Luminance-based text color selection for accessibility



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns



A React-based web application for managing tasks and timelines with data table functionality and visual board views.

## Features

- Interactive data table for managing tasks with extended fields (category, sub-category, owner, phase, etc.)
- Date pickers for selecting start and end dates
- Import tasks from tab-separated data with review and edit functionality
- Visual board views for weeks (4-week spans) and months (configurable spans: 3, 6, 12 months)
- Automatic navigation and filtering of tasks within time ranges
- Add, edit, and remove tasks directly in the table or board
- Console logging for debugging import process

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Usage

1. Use the table to add, edit, or remove tasks with fields like name, category, sub-category, owner, phase, start date, end date.
2. Import tasks by pasting tab-separated data in the import section. First row should be headers like: Category	Sub-Category	Week	Date Start	Date End	Task	Owner	Phase	Category HEX
3. Parse the data to review and edit in a table before importing.
4. Switch between weeks and months view to see the planning board.
5. Navigate between time periods using the Previous/Next buttons.
6. Tasks are displayed as bars spanning their duration within the visible time range.
7. After importing, the view automatically navigates to show the imported tasks.

## Technologies Used

- React
- TypeScript
- Vite
- react-datepicker
- date-fns
