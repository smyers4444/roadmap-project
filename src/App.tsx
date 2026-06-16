/**
 * ============================================================================
 * WEEKLY PLANNING BOARD - ROADMAP TIMELINE APPLICATION
 * ============================================================================
 *
 * A React-based project planning and timeline visualization tool that displays
 * tasks in a Gantt-chart style layout with phase grouping and advanced features.
 *
 * KEY FEATURES:
 * -------------
 * 1. Dual View Modes:
 *    - Weekly View: Shows tasks across multiple weeks with detailed daily resolution
 *    - Monthly View: Shows tasks across multiple months for long-term planning
 *
 * 2. Phase Grouping:
 *    - Tasks are grouped by project phases (e.g., "Foundation & Discovery")
 *    - Each phase has a colored header bar and background
 *    - Phase colors are customizable via hex codes
 *
 * 3. Smart Task Positioning:
 *    - "Reverse Tetris" algorithm packs tasks vertically to minimize whitespace
 *    - Tasks are positioned from top to bottom, finding first available space
 *    - Vacation tasks always appear at the top
 *    - Collision detection prevents overlapping tasks
 *
 * 4. Dynamic Text Wrapping:
 *    - Task bar heights automatically adjust based on text length
 *    - Word-wrap simulation calculates required number of lines
 *    - Ensures all text is readable within the task bar
 *
 * 5. Color Management:
 *    - Phase colors (for phase headers and backgrounds)
 *    - Category colors (for individual task bars)
 *    - Automatic text color calculation for readability (black/white based on luminance)
 *    - Color lightening by blending with white (no transparency)
 *
 * 6. Task Management:
 *    - Create, edit, remove, and duplicate tasks
 *    - Drag-and-drop reordering in task list
 *    - Filter tasks by text search
 *    - Sort tasks by multiple criteria
 *
 * 7. Data Import:
 *    - Import tasks from tab-separated data (e.g., Excel paste)
 *    - Preview and edit imported data before adding
 *    - Flexible column mapping supports various header names
 *
 * 8. Navigation:
 *    - Navigate forward/backward through weeks or months
 *    - Jump to specific dates via date picker
 *    - Configurable number of weeks/months to display
 *
 * TECHNICAL ARCHITECTURE:
 * ----------------------
 * - React 18+ with TypeScript
 * - Functional components with hooks (useState)
 * - date-fns library for date manipulation
 * - CSS Grid for responsive column layout
 * - Absolute positioning for task bar overlays
 * - Percentage-based horizontal positioning (0-100%)
 * - Pixel-based vertical positioning with collision detection
 *
 * LAYOUT STRUCTURE:
 * ----------------
 * - Top: View controls and navigation
 * - Task List Section: Editable table with drag-drop reordering
 * - Import Section: Tab-separated data import with preview
 * - Timeline Section: Visual Gantt-chart timeline
 *   - Header row with week/month labels
 *   - Phase sections (one per phase):
 *     - Phase header bar (colored, spans phase duration)
 *     - Task area grid:
 *       - Background grid cells (for borders)
 *       - Phase background overlay (semi-transparent)
 *       - Vacation background bars (gray overlay)
 *       - Individual task bars (positioned by algorithm)
 * - Legends: Phase colors and category colors reference
 *
 * POSITIONING ALGORITHM:
 * ---------------------
 * 1. Calculate visible period (start/end dates)
 * 2. Filter tasks that overlap with visible period
 * 3. Calculate task heights based on text wrapping
 * 4. Sort tasks (vacation first, then by date, then display order)
 * 5. For each task:
 *    a. Calculate horizontal position (percentage of timeline)
 *    b. Find first available vertical position (check for collisions)
 *    c. Record occupied space (bounding box)
 * 6. Calculate total height needed for all tasks
 * 7. Render task bars at calculated positions
 *
 * ============================================================================
 */

// React imports
import { useEffect, useState } from "react";

// Third-party component for date selection
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Date utility functions from date-fns library
import { startOfWeek, addDays, format, startOfMonth, endOfMonth, addMonths, getMonth, endOfWeek, eachDayOfInterval, isSameMonth } from "date-fns";

// Custom styles for the application
import "./App.css";

/**
 * Task interface defining the structure of each task item
 * Used for both the task list and timeline visualization
 */
interface Task {
  id: number; // Unique identifier for the task
  phase?: string; // Project phase (e.g., "Foundation & Discovery")
  phaseHex?: string; // Hex color code for phase background
  category?: string; // Task category for grouping
  categoryHex?: string; // Hex color code for category
  name: string; // Task name/title
  subTask?: string; // Optional sub-task description
  week?: number; // Optional week number reference
  owner?: string; // Person responsible for the task
  startDate: Date; // Task start date
  endDate: Date; // Task end date (inclusive)
  displayOrder: number; // For drag-and-drop ordering
  lineHeightAdjust?: number; // Optional extra wrapped lines for timeline height control
}

const TASKS_STORAGE_KEY = "roadmap-project.tasks.v1";

interface StoredTask {
  id: number;
  phase?: string;
  phaseHex?: string;
  category?: string;
  categoryHex?: string;
  name: string;
  subTask?: string;
  week?: number;
  owner?: string;
  startDate: string;
  endDate: string;
  displayOrder: number;
  lineHeightAdjust?: number;
}

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

const hydrateStoredTask = (value: unknown): Task | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const task = value as Partial<StoredTask>;

  if (typeof task.id !== "number" || typeof task.name !== "string" || typeof task.displayOrder !== "number") {
    return null;
  }

  const startDate = new Date(task.startDate ?? "");
  const endDate = new Date(task.endDate ?? "");

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return null;
  }

  return {
    id: task.id,
    phase: typeof task.phase === "string" ? task.phase : "",
    phaseHex: typeof task.phaseHex === "string" ? task.phaseHex : "",
    category: typeof task.category === "string" ? task.category : "",
    categoryHex: typeof task.categoryHex === "string" ? task.categoryHex : "",
    name: task.name,
    subTask: typeof task.subTask === "string" ? task.subTask : "",
    week: typeof task.week === "number" && !Number.isNaN(task.week) ? task.week : undefined,
    owner: typeof task.owner === "string" ? task.owner : "",
    startDate,
    endDate,
    displayOrder: task.displayOrder,
    lineHeightAdjust: typeof task.lineHeightAdjust === "number" && !Number.isNaN(task.lineHeightAdjust)
      ? task.lineHeightAdjust
      : 0,
  };
};

const loadStoredTasks = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => hydrateStoredTask(item))
      .filter((task): task is Task => task !== null);
  } catch {
    return [];
  }
};

function App() {
  // ==================== STATE MANAGEMENT ====================

  // Main task list is restored from browser-local storage when available
  const [tasks, setTasks] = useState<Task[]>(() => loadStoredTasks());

  // Timeline view mode: "weeks" or "months"
  const [view, setView] = useState<"weeks" | "months" | "calendar">("weeks");

  // Current week/month being displayed in the timeline
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  // Number of weeks/months to display in the timeline
  const [monthSpan, setMonthSpan] = useState(2); // Show 2 months by default (~60 days, similar to 7 weeks = 49 days)
  const [weekSpan, setWeekSpan] = useState(7);

  // Import functionality state
  const [importText, setImportText] = useState(""); // Raw tab-separated text from user
  const [importData, setImportData] = useState<Array<Record<string, string>>>([]); // Parsed import data
  const [showImportTable, setShowImportTable] = useState(false); // Show/hide import preview table

  // Filtering and sorting state
  const [filterText, setFilterText] = useState(""); // Text search filter
  const [selectedTimelineTaskId, setSelectedTimelineTaskId] = useState<number | null>(null); // Timeline click selection filter
  const [sortBy, setSortBy] = useState<"phase" | "name" | "category" | "startDate" | "endDate" | "displayOrder">("displayOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // UI visibility toggles
  const [showTaskList, setShowTaskList] = useState(true);
  const [showImportSection, setShowImportSection] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);

  // Drag and drop state for reordering tasks
  const [draggedTask, setDraggedTask] = useState<number | null>(null);

  // Toggle between showing week numbers or dates in weekly view
  const [showWeekNumbers, setShowWeekNumbers] = useState(false);
  const [showMonthNumbers, setShowMonthNumbers] = useState(false);
  const [showWeekends, setShowWeekends] = useState(true);
  
  // Toggle for showing/hiding phase labels and colors
  const [showPhaseLabels, setShowPhaseLabels] = useState(true);

  // Date range filter for monthly view
  const [useCustomMonthRange, setUseCustomMonthRange] = useState(false);
  const [customMonthStart, setCustomMonthStart] = useState<Date | null>(null);
  const [customMonthEnd, setCustomMonthEnd] = useState<Date | null>(null);
  const showDevTaskButton = import.meta.env.DEV;

  useEffect(() => {
    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage write failures so task editing still works in restricted browsers.
    }
  }, [tasks]);

  // ==================== TASK MANAGEMENT FUNCTIONS ====================

  /**
   * Adds a new empty task to the task list
   * Generates unique ID and display order
   */
  const addTask = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newDisplayOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.displayOrder || 0)) + 1 : 1;
    setTasks([
      ...tasks,
      {
        id: newId,
        phase: "",
        phaseHex: "",
        category: "",
        categoryHex: "",
        name: "",
        subTask: "",
        owner: "",
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        displayOrder: newDisplayOrder,
        lineHeightAdjust: 0,
      },
    ]);
  };

  const addTestTask = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newDisplayOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.displayOrder || 0)) + 1 : 1;
    setTasks([
      ...tasks,
      {
        id: newId,
        phase: "Test Phase",
        category: "Test Category",
        name: "Test Task",
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        displayOrder: newDisplayOrder,
      },
    ]);
  };

  /**
   * Updates a specific field of a task
   * @param id - Task ID to update
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const updateTask = (id: number, field: keyof Task, value: Date | string | number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  /**
   * Removes a task from the list
   * @param id - Task ID to remove
   */
  const removeTask = (id: number) => {
    if (selectedTimelineTaskId === id) {
      setSelectedTimelineTaskId(null);
    }
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // ==================== DRAG AND DROP HANDLERS ====================

  /**
   * Initiates drag operation when user starts dragging a task row
   * @param taskId - ID of the task being dragged
   */
  const handleDragStart = (taskId: number) => {
    setDraggedTask(taskId);
  };

  /**
   * Handles drag over event to allow drop
   * @param e - React drag event
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   * Handles drop event to reorder tasks
   * Calculates new display order and shifts other tasks accordingly
   * @param targetTaskId - ID of the task where the dragged task was dropped
   */
  const handleDrop = (targetTaskId: number) => {
    if (draggedTask === null || draggedTask === targetTaskId) return;

    const draggedTaskObj = tasks.find((t) => t.id === draggedTask);
    const targetTaskObj = tasks.find((t) => t.id === targetTaskId);

    if (!draggedTaskObj || !targetTaskObj) return;

    const draggedOrder = draggedTaskObj.displayOrder;
    const targetOrder = targetTaskObj.displayOrder;

    const newTasks = tasks.map((t) => {
      if (t.id === draggedTask) {
        return { ...t, displayOrder: targetOrder };
      } else if (draggedOrder < targetOrder) {
        // Moving down: shift items between old and new position up
        if (t.displayOrder > draggedOrder && t.displayOrder <= targetOrder) {
          return { ...t, displayOrder: t.displayOrder - 1 };
        }
      } else {
        // Moving up: shift items between new and old position down
        if (t.displayOrder >= targetOrder && t.displayOrder < draggedOrder) {
          return { ...t, displayOrder: t.displayOrder + 1 };
        }
      }
      return t;
    });

    setTasks(newTasks);
    // Automatically switch to displayOrder sorting to show the reordering
    setSortBy("displayOrder");
  };

  /**
   * Cleans up drag state when drag operation ends
   */
  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  // ==================== IMPORT FUNCTIONS ====================

  /**
   * Parses tab-separated text data into structured rows and columns
   * Expects first row to be headers, followed by data rows
   */
  const parseImportData = () => {
    if (!importText.trim()) return;

    const lines = importText.trim().split("\n");
    if (lines.length < 2) return; // Need at least header + 1 data row

    const headers = lines[0].split("\t").map((h) => h.trim());
    const dataLines = lines.slice(1);

    const parsedData = dataLines.map((line) => {
      const values = line.split("\t").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      return row;
    });

    setImportData(parsedData);
    setShowImportTable(true);
  };

  /**
   * Updates a specific cell in the import preview table
   * @param rowIndex - Row index to update
   * @param column - Column name to update
   * @param value - New value for the cell
   */
  const updateImportData = (rowIndex: number, column: string, value: string) => {
    const newData = [...importData];
    newData[rowIndex] = { ...newData[rowIndex], [column]: value };
    setImportData(newData);
  };

  /**
   * Removes a row from the import preview table
   * @param rowIndex - Index of row to remove
   */
  const removeImportRow = (rowIndex: number) => {
    setImportData(importData.filter((_, index) => index !== rowIndex));
  };

  /**
   * Adds a new empty row to the import preview table
   */
  const addImportRow = () => {
    if (importData.length > 0) {
      const newRow = { ...importData[0] };
      Object.keys(newRow).forEach((key) => (newRow[key] = ""));
      setImportData([...importData, newRow]);
    }
  };

  /**
   * Converts import data into Task objects and adds them to the main task list
   * Maps various header names to Task properties (e.g., "Date Start" -> startDate)
   * Navigates timeline to show the earliest imported task
   */
  const importTasks = () => {
    const newTasks: Task[] = [];
    let nextId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    let nextDisplayOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.displayOrder || 0)) + 1 : 1;

    importData.forEach((row) => {
      const taskData: Partial<Omit<Task, "id">> = {};

      // Map import columns to Task properties based on header names
      Object.keys(row).forEach((header) => {
        const value = row[header] || "";
        const lowerHeader = header.toLowerCase().trim();
        switch (lowerHeader) {
          case "phase":
          case "stage":
            taskData.phase = value;
            break;
          case "phase hex":
          case "phase-hex":
          case "phasehex":
            taskData.phaseHex = value;
            break;
          case "category":
            taskData.category = value;
            break;
          case "category hex":
            taskData.categoryHex = value;
            break;
          case "sub-task":
          case "subtask":
          case "sub task":
            taskData.subTask = value;
            break;
          case "week":
            taskData.week = value ? parseInt(value) : undefined;
            break;
          case "date start":
          case "start date":
          case "start":
            if (value) {
              // Try to parse MM/DD/YYYY format
              const dateParts = value.split("/");
              if (dateParts.length === 3) {
                const [month, day, year] = dateParts;
                taskData.startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              } else {
                taskData.startDate = new Date(value);
              }
            } else {
              taskData.startDate = new Date();
            }
            break;
          case "date end":
          case "end date":
          case "end":
            if (value) {
              // Try to parse MM/DD/YYYY format
              const dateParts = value.split("/");
              if (dateParts.length === 3) {
                const [month, day, year] = dateParts;
                taskData.endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              } else {
                taskData.endDate = new Date(value);
              }
            } else {
              taskData.endDate = new Date();
            }
            break;
          case "task":
          case "task name":
          case "name":
          case "title":
          case "description":
            taskData.name = value;
            break;
          case "owner":
          case "assigned to":
          case "assignee":
          case "responsible":
            taskData.owner = value;
            break;
          case "line padding":
          case "lineheight":
          case "line height":
            taskData.lineHeightAdjust = value ? parseInt(value, 10) || 0 : 0;
            break;
        }
      });

      // Be forgiving with imported spreadsheets that omit a dedicated task column.
      // Some older sheets place the task label in Category or Sub-Task instead.
      if (!taskData.name) {
        taskData.name = taskData.category || taskData.subTask;
      }

      if (taskData.name) {
        const newTask = {
          id: nextId++,
          phase: taskData.phase,
          phaseHex: taskData.phaseHex,
          category: taskData.category,
          categoryHex: taskData.categoryHex,
          name: taskData.name,
          subTask: taskData.subTask,
          week: taskData.week,
          owner: taskData.owner,
          startDate: taskData.startDate || new Date(),
          endDate: taskData.endDate || new Date(),
          displayOrder: nextDisplayOrder++,
          lineHeightAdjust: typeof taskData.lineHeightAdjust === "number" ? taskData.lineHeightAdjust : 0,
        };
        newTasks.push(newTask);
      }
    });

    // ========== GROUP TASKS ==========
    // Group tasks with same phase, category, and name
    // Combine into single task with earliest start and latest end date
    // Concatenate sub-tasks and owners
    const groupedTasksMap = new Map<string, Task>();

    newTasks.forEach((task) => {
      const groupKey = `${task.phase}|${task.category}|${task.name}`;

      if (groupedTasksMap.has(groupKey)) {
        // Task group already exists, merge this task into it
        const existingTask = groupedTasksMap.get(groupKey)!;

        // Update start date to earliest
        if (task.startDate < existingTask.startDate) {
          existingTask.startDate = task.startDate;
        }

        // Update end date to latest
        if (task.endDate > existingTask.endDate) {
          existingTask.endDate = task.endDate;
        }

        // Combine sub-tasks (if different)
        if (task.subTask && task.subTask !== existingTask.subTask) {
          existingTask.subTask = existingTask.subTask ? `${existingTask.subTask}; ${task.subTask}` : task.subTask;
        }

        // Combine owners (if different)
        if (task.owner && task.owner !== existingTask.owner) {
          existingTask.owner = existingTask.owner ? `${existingTask.owner}; ${task.owner}` : task.owner;
        }
      } else {
        // First task in this group
        groupedTasksMap.set(groupKey, { ...task });
      }
    });

    // Convert grouped tasks back to array
    const finalTasks = Array.from(groupedTasksMap.values());

    // Add grouped tasks to the main list and navigate to show them
    if (finalTasks.length > 0) {
      const updatedTasks = [...tasks, ...finalTasks];
      setTasks(updatedTasks);

      // Navigate to show the imported tasks
      const earliestTask = finalTasks.reduce((earliest, task) => (task.startDate < earliest.startDate ? task : earliest), finalTasks[0]);
      setCurrentWeek(startOfWeek(earliestTask.startDate));
      setCurrentMonth(startOfMonth(earliestTask.startDate));

      // Clear import state
      setImportText("");
      setImportData([]);
      setShowImportTable(false);
    } else {
      alert('No importable tasks were found. Make sure each row has a task name, or put the task text in the Category column for older sheet formats.');
    }
  };

  // ==================== EXPORT TASKS ====================

  /** Export tasks to CSV file with manual ordering preserved */
  const exportTasks = () => {
    if (tasks.length === 0) {
      alert("No tasks to export");
      return;
    }

    // Sort by displayOrder to preserve manual arrangement
    const sortedTasks = [...tasks].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // Helper function to escape CSV values (wrap in quotes if contains comma, quote, or newline)
    const escapeCsv = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Create CSV header
    const header = "Phase,Phase Hex,Category,Category HEX,Task,Sub-Task,Owner,Week,Date Start,Date End,Display Order,Line Padding";

    // Convert tasks to CSV rows
    const rows = sortedTasks.map(task => {
      const startDate = format(task.startDate, "MM/dd/yyyy");
      const endDate = format(task.endDate, "MM/dd/yyyy");
      const weekValue = typeof task.week === "number" && !Number.isNaN(task.week)
        ? task.week
        : getRelativeWeekNumber(task.startDate, sortedTasks);

      return [
        escapeCsv(task.phase || ""),
        escapeCsv(task.phaseHex || ""),
        escapeCsv(task.category || ""),
        escapeCsv(task.categoryHex || ""),
        escapeCsv(task.name || ""),
        escapeCsv(task.subTask || ""),
        escapeCsv(task.owner || ""),
        weekValue.toString(),
        startDate,
        endDate,
        task.displayOrder.toString(),
        (task.lineHeightAdjust ?? 0).toString()
      ].join(",");
    });

    // Combine header and rows
    const csvContent = [header, ...rows].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roadmap-tasks-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ==================== TIMELINE NAVIGATION ====================

  /** Navigate to next period (weeks or months) */
  const nextWeek = () => setCurrentWeek(addDays(currentWeek, weekSpan * 7));
  const prevWeek = () => setCurrentWeek(addDays(currentWeek, -weekSpan * 7));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, monthSpan));
  const prevMonth = () => setCurrentMonth(addMonths(currentMonth, -monthSpan));

  const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const getRelativeWeekNumber = (date: Date, taskList: Task[]) => {
    if (taskList.length === 0) return 1;

    const firstTaskDate = new Date(Math.min(...taskList.map((task) => task.startDate.getTime())));
    const firstTaskWeek = startOfWeek(firstTaskDate);
    const targetWeek = startOfWeek(date);

    return Math.round((targetWeek.getTime() - firstTaskWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  };

  const getWeeklyPeriodEnd = () => addDays(currentWeek, weekSpan * 7 - 1);

  const isWeekendDate = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getVisibleWeekDays = (weekStart: Date) =>
    Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)).filter((date) => showWeekends || !isWeekendDate(date));

  // ==================== COLUMN GENERATION ====================

  // Generate array of start dates for each week column
  const weekColumns = Array.from({ length: weekSpan }, (_, i) => addDays(currentWeek, i * 7));
  const visibleWeekColumns = weekColumns.map((weekStart) => getVisibleWeekDays(weekStart));
  const visibleWeeklyDays = visibleWeekColumns.flat();
  const weeklyRangeStart = visibleWeeklyDays[0] || currentWeek;
  const weeklyRangeEnd = visibleWeeklyDays[visibleWeeklyDays.length - 1] || getWeeklyPeriodEnd();

  // Generate array of start dates for each month column
  // Use custom date range if enabled, otherwise use currentMonth + monthSpan
  const monthColumns = (() => {
    if (useCustomMonthRange && customMonthStart && customMonthEnd) {
      const start = startOfMonth(customMonthStart);
      const end = startOfMonth(customMonthEnd);
      const monthCount = (end.getFullYear() - start.getFullYear()) * 12 + (getMonth(end) - getMonth(start)) + 1;
      return Array.from({ length: monthCount }, (_, i) => addMonths(start, i));
    }
    return Array.from({ length: monthSpan }, (_, i) => addMonths(currentMonth, i));
  })();
  const monthlyPeriodStart = useCustomMonthRange && customMonthStart
    ? customMonthStart
    : startOfMonth(currentMonth);
  const monthlyPeriodEnd = useCustomMonthRange && customMonthEnd
    ? customMonthEnd
    : endOfMonth(addMonths(currentMonth, monthSpan - 1));
  const visibleMonthlyDays = eachDayOfInterval({ start: normalizeDate(monthlyPeriodStart), end: normalizeDate(monthlyPeriodEnd) })
    .filter((date) => showWeekends || !isWeekendDate(date));

  // ==================== FILTERING AND SORTING ====================

  /**
   * Returns tasks filtered by the current search text.
   */
  const getTextFilteredTasks = () => {
    let filtered = tasks;

    // Apply text filter across multiple task fields
    if (filterText.trim()) {
      const searchLower = filterText.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.name.toLowerCase().includes(searchLower) ||
          (task.phase && task.phase.toLowerCase().includes(searchLower)) ||
          (task.category && task.category.toLowerCase().includes(searchLower)) ||
          (task.subTask && task.subTask.toLowerCase().includes(searchLower)) ||
          (task.owner && task.owner.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  };

  const getTaskListFilteredTasks = () => {
    let filtered = getTextFilteredTasks();

    if (selectedTimelineTaskId !== null) {
      filtered = filtered.filter((task) => task.id === selectedTimelineTaskId);
    }

    return filtered;
  };

  /**
   * Returns filtered and sorted tasks based on current filter text and sort settings
   * Filters by text search across multiple fields
   * Sorts by selected field with secondary sort by displayOrder
   */
  const getFilteredAndSortedTasks = () => {
    const filtered = getTaskListFilteredTasks();

    // Apply sort with displayOrder as secondary sort for ties
    return [...filtered].sort((a, b) => {
      let comparison = 0;

      // Compare based on selected sort field
      switch (sortBy) {
        case "phase":
          comparison = (a.phase || "").localeCompare(b.phase || "");
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "startDate":
          comparison = a.startDate.getTime() - b.startDate.getTime();
          break;
        case "endDate":
          comparison = a.endDate.getTime() - b.endDate.getTime();
          break;
        case "displayOrder":
          comparison = (a.displayOrder || 0) - (b.displayOrder || 0);
          break;
      }

      // If primary sort results in a tie, use displayOrder as secondary sort
      if (comparison === 0) {
        comparison = (a.displayOrder || 0) - (b.displayOrder || 0);
      }

      // Apply sort order direction (ascending or descending)
      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  /**
   * Returns filtered tasks sorted by displayOrder.
   * Used for timeline visualization where the original manual order is important.
   */
  const getFilteredTasksSortedByDisplayOrder = () => {
    return [...getTextFilteredTasks()].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  };

  const filteredAndSortedTasks = getFilteredAndSortedTasks();
  const timelineTasks = getFilteredTasksSortedByDisplayOrder();
  const selectedTimelineTask = selectedTimelineTaskId === null
    ? null
    : tasks.find((task) => task.id === selectedTimelineTaskId) ?? null;
  const calendarMonthStart = startOfMonth(currentMonth);
  const calendarMonthEnd = endOfMonth(currentMonth);
  const calendarGridStart = startOfWeek(calendarMonthStart);
  const calendarGridEnd = endOfWeek(calendarMonthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarGridStart, end: calendarGridEnd });
  const calendarWeeks = Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, index) => calendarDays.slice(index * 7, index * 7 + 7));
  const phases = [...new Set(timelineTasks.map((t) => t.phase).filter((c) => c && c.trim()))];
  const categories = [...new Set(timelineTasks.map((t) => t.category).filter((c) => c && c.trim()))];
  const legendPeriodStart = view === "weeks"
    ? currentWeek
    : view === "calendar"
      ? calendarGridStart
      : useCustomMonthRange && customMonthStart
        ? customMonthStart
        : startOfMonth(currentMonth);
  const legendPeriodEnd = view === "weeks"
    ? getWeeklyPeriodEnd()
    : view === "calendar"
      ? calendarGridEnd
      : useCustomMonthRange && customMonthEnd
        ? customMonthEnd
        : endOfMonth(addMonths(currentMonth, monthSpan - 1));
  const visibleLegendTasks = timelineTasks.filter((task) => {
    if (task.startDate > legendPeriodEnd || task.endDate < legendPeriodStart) {
      return false;
    }
    return true;
  });
  const visibleLegendPhases = phases.filter((phase) => visibleLegendTasks.some((task) => task.phase === phase));

  const toggleTimelineTaskSelection = (taskId: number) => {
    setSelectedTimelineTaskId((currentId) => (currentId === taskId ? null : taskId));
  };

  // Unused helper function - kept for reference
  // const assignTaskRows = (tasks: Task[]) => {
  //   const sortedTasks = [...tasks].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  //   const taskRows: Map<number, number> = new Map()
  //   const rowEndDates: Date[] = []
  //   sortedTasks.forEach(task => {
  //     let assignedRow = -1
  //     for (let i = 0; i < rowEndDates.length; i++) {
  //       if (task.startDate > rowEndDates[i]) {
  //         assignedRow = i
  //         rowEndDates[i] = task.endDate
  //         break
  //       }
  //     }
  //     if (assignedRow === -1) {
  //       assignedRow = rowEndDates.length
  //       rowEndDates.push(task.endDate)
  //     }
  //     taskRows.set(task.id, assignedRow)
  //   })
  //   return taskRows
  // }

  // ==================== POSITIONING CALCULATIONS ====================

  /**
   * Calculates the horizontal position and width of a task bar in weekly view
   * Returns percentage-based start and width values for CSS positioning
   *
   * @param task - Task to calculate position for
   * @returns Object with start (left position %) and width (%)
   *
   * Algorithm:
   * 1. Normalize dates to midnight to avoid DST issues
   * 2. Clip task to visible period (only show part that's visible)
   * 3. Calculate day offsets from period start
   * 4. Convert to percentages (0-100%) for CSS positioning
   * 5. Add 1 to width calculation to include end day (endDate is inclusive)
   */
  const getTaskPosition = (task: Task) => {
    const periodStart = normalizeDate(currentWeek);
    const periodEnd = normalizeDate(getWeeklyPeriodEnd());
    const totalDays = visibleWeeklyDays.length;

    if (totalDays === 0) return null;

    const taskStartInPeriod = normalizeDate(task.startDate > periodStart ? task.startDate : periodStart);
    const taskEndInPeriod = normalizeDate(task.endDate < periodEnd ? task.endDate : periodEnd);

    const startOffset = visibleWeeklyDays.findIndex((date) => normalizeDate(date).getTime() >= taskStartInPeriod.getTime());
    let endOffset = -1;
    for (let index = visibleWeeklyDays.length - 1; index >= 0; index -= 1) {
      if (normalizeDate(visibleWeeklyDays[index]).getTime() <= taskEndInPeriod.getTime()) {
        endOffset = index;
        break;
      }
    }

    if (startOffset === -1 || endOffset === -1 || startOffset > endOffset) {
      return null;
    }

    const start = (startOffset / totalDays) * 100;
    const width = ((endOffset - startOffset + 1) / totalDays) * 100;

    return { start, width };
  };

  /**
   * Calculates the horizontal position and width of a task bar in monthly view
   * Similar to getTaskPosition but works with month boundaries instead of weeks
   *
   * @param task - Task to calculate position for
   * @returns Object with start (left position %) and width (%)
   */
  const getMonthTaskPosition = (task: Task) => {
    const totalDays = visibleMonthlyDays.length;
    if (totalDays === 0) return null;

    const periodStart = normalizeDate(monthlyPeriodStart);
    const periodEnd = normalizeDate(monthlyPeriodEnd);
    const taskStartInPeriod = normalizeDate(task.startDate > periodStart ? task.startDate : periodStart);
    const taskEndInPeriod = normalizeDate(task.endDate < periodEnd ? task.endDate : periodEnd);

    const startOffset = visibleMonthlyDays.findIndex((date) => normalizeDate(date).getTime() >= taskStartInPeriod.getTime());
    let endOffset = -1;
    for (let index = visibleMonthlyDays.length - 1; index >= 0; index -= 1) {
      if (normalizeDate(visibleMonthlyDays[index]).getTime() <= taskEndInPeriod.getTime()) {
        endOffset = index;
        break;
      }
    }

    if (startOffset === -1 || endOffset === -1 || startOffset > endOffset) {
      return null;
    }

    const start = (startOffset / totalDays) * 100;
    const width = ((endOffset - startOffset + 1) / totalDays) * 100;

    return { start, width };
  };

  // ==================== COLOR UTILITY FUNCTIONS ====================

  /**
   * Calculates appropriate text color (black or white) based on background luminance
   * Uses relative luminance formula to determine if background is light or dark
   *
   * @param hexColor - Hex color code (with or without #)
   * @returns "#000000" for light backgrounds, "#ffffff" for dark backgrounds
   */
  const getTextColor = (hexColor: string | undefined) => {
    if (!hexColor) return "white";

    // Remove # if present
    const hex = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return dark text for light backgrounds, light text for dark backgrounds
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const blendHexWithWhite = (hexColor: string | undefined, ratio = 0.82) => {
    if (!hexColor) return "var(--bg-secondary)";

    const hex = hexColor.replace("#", "");
    if (hex.length !== 6) return "var(--bg-secondary)";

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const blend = (value: number) => Math.round(value + (255 - value) * ratio);

    return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
  };

  const isTaskVisibleOnDay = (task: Task, day: Date) => {
    const normalizedDay = normalizeDate(day).getTime();
    const normalizedStart = normalizeDate(task.startDate).getTime();
    const normalizedEnd = normalizeDate(task.endDate).getTime();
    return normalizedStart <= normalizedDay && normalizedEnd >= normalizedDay;
  };

  const getCalendarChipLabel = (task: Task, day: Date) => {
    const isStartDay = normalizeDate(task.startDate).getTime() === normalizeDate(day).getTime();
    return isStartDay ? task.name : `${task.name} (cont.)`;
  };

  // ==================== RENDER ====================

  return (
    <div className="app">
      <h1>Weekly Planning Board</h1>

      {/* View selector and navigation controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <select value={view} onChange={(e) => setView(e.target.value as "weeks" | "months" | "calendar")}>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="calendar">Calendar</option>
        </select>
        {view === "weeks" && (
          <div className="week-nav">
            <button onClick={prevWeek}>Previous</button>
            <DatePicker
              selected={currentWeek}
              onChange={(date) => setCurrentWeek(startOfWeek(date || new Date()))}
              dateFormat="MMM dd, yyyy"
              customInput={
                <button style={{ padding: "8px 12px", cursor: "pointer" }}>
                  {format(weeklyRangeStart, "MMM dd")} - {format(weeklyRangeEnd, "MMM dd, yyyy")}
                </button>
              }
            />
            <button onClick={nextWeek}>Next</button>
            <input
              type="number"
              value={weekSpan}
              onChange={(e) => setWeekSpan(Math.max(1, Number(e.target.value)))}
              min="1"
              style={{ width: "60px", padding: "8px" }}
            />
            <span>Weeks</span>
            <button onClick={() => setShowWeekends(!showWeekends)}>{showWeekends ? "Hide Weekends" : "Show Weekends"}</button>
            <button onClick={() => setShowWeekNumbers(!showWeekNumbers)}>{showWeekNumbers ? "Show Dates" : "Show Week Numbers"}</button>
            <button onClick={() => setShowPhaseLabels(!showPhaseLabels)}>{showPhaseLabels ? "Hide Phases" : "Show Phases"}</button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to clear all ${tasks.length} tasks? This cannot be undone.`)) {
                  setTasks([]);
                  setSelectedTimelineTaskId(null);
                }
              }}
              style={{ backgroundColor: "var(--color-red-600)", color: "var(--color-white)" }}
            >
              Clear All Tasks
            </button>
          </div>
        )}
        {view === "months" && (
          <div className="month-nav">
            <button onClick={() => {
              setUseCustomMonthRange(!useCustomMonthRange);
              if (useCustomMonthRange) {
                // Reset to default mode
                setCustomMonthStart(null);
                setCustomMonthEnd(null);
              } else {
                // Initialize with earliest and latest task dates
                if (tasks.length > 0) {
                  const allDates = tasks.flatMap((t) => [t.startDate, t.endDate]);
                  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
                  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
                  setCustomMonthStart(minDate);
                  setCustomMonthEnd(maxDate);
                } else {
                  setCustomMonthStart(new Date());
                  setCustomMonthEnd(new Date());
                }
              }
            }}>
              {useCustomMonthRange ? "Use Month Span" : "Use Date Range"}
            </button>
            
            {!useCustomMonthRange && (
              <>
                <button onClick={prevMonth}>Previous</button>
                <span>
                  {format(currentMonth, "MMM yyyy")} - {format(addMonths(currentMonth, monthSpan - 1), "MMM yyyy")}
                </span>
                <button onClick={nextMonth}>Next</button>
                <input
                  type="number"
                  value={monthSpan}
                  onChange={(e) => setMonthSpan(Math.max(1, Number(e.target.value)))}
                  min="1"
                  style={{ width: "60px", padding: "8px" }}
                />
                <span>Months</span>
              </>
            )}
            
            {useCustomMonthRange && (
              <>
                <DatePicker
                  selectsRange={true}
                  startDate={customMonthStart || undefined}
                  endDate={customMonthEnd || undefined}
                  popperPlacement="bottom-start"
                  popperClassName="month-date-picker-popper"
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setCustomMonthStart(start);
                    setCustomMonthEnd(end);
                  }}
                  dateFormat="MMM dd, yyyy"
                  customInput={
                    <button style={{ padding: "8px 12px", cursor: "pointer" }}>
                      {customMonthStart && customMonthEnd 
                        ? `${format(customMonthStart, "MMM dd")} - ${format(customMonthEnd, "MMM dd, yyyy")}`
                        : customMonthStart
                        ? `${format(customMonthStart, "MMM dd, yyyy")} - ...`
                        : "Select date range"}
                    </button>
                  }
                />
              </>
            )}
            <button onClick={() => setShowMonthNumbers(!showMonthNumbers)}>{showMonthNumbers ? "Show Dates" : "Show Month Numbers"}</button>
            <button onClick={() => setShowWeekends(!showWeekends)}>{showWeekends ? "Hide Weekends" : "Show Weekends"}</button>
            <button onClick={() => setShowPhaseLabels(!showPhaseLabels)}>{showPhaseLabels ? "Hide Phases" : "Show Phases"}</button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to clear all ${tasks.length} tasks? This cannot be undone.`)) {
                  setTasks([]);
                  setSelectedTimelineTaskId(null);
                }
              }}
              style={{ backgroundColor: "var(--color-red-600)", color: "var(--color-white)" }}
            >
              Clear All Tasks
            </button>
          </div>
        )}
        {view === "calendar" && (
          <div className="month-nav">
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>Previous</button>
            <DatePicker
              selected={currentMonth}
              onChange={(date) => setCurrentMonth(startOfMonth(date || new Date()))}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              customInput={
                <button style={{ padding: "8px 12px", cursor: "pointer" }}>
                  {format(currentMonth, "MMM yyyy")}
                </button>
              }
            />
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</button>
            <button onClick={() => setShowWeekends(!showWeekends)}>{showWeekends ? "Hide Weekends" : "Show Weekends"}</button>
            <button onClick={() => setShowPhaseLabels(!showPhaseLabels)}>{showPhaseLabels ? "Hide Phases" : "Show Phases"}</button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to clear all ${tasks.length} tasks? This cannot be undone.`)) {
                  setTasks([]);
                  setSelectedTimelineTaskId(null);
                }
              }}
              style={{ backgroundColor: "var(--color-red-600)", color: "var(--color-white)" }}
            >
              Clear All Tasks
            </button>
          </div>
        )}
      </div>
      <div className="section-container">
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "var(--bg-secondary)",
            borderBottom: showTaskList ? "1px solid var(--border-light)" : "none",
            margin: showTaskList ? "-1.5rem -1.5rem 1rem -1.5rem" : "-1.5rem",
          }}
        >
          <h3 style={{ margin: 0, cursor: "pointer", userSelect: "none", fontSize: "1rem" }} onClick={() => setShowTaskList(!showTaskList)}>
            {showTaskList ? "▼" : "▶"} Tasks ({filteredAndSortedTasks.length})
            {filteredAndSortedTasks.length > 0 &&
              (() => {
                const allDates = filteredAndSortedTasks.flatMap((t) => [t.startDate, t.endDate]);
                const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
                const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
                
                // Calculate duration based on current view
                let duration = "";
                if (view === "weeks") {
                  const weeksDiff = Math.round((maxDate.getTime() - minDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
                  const totalWeeks = weeksDiff + 1; // Include both start and end weeks
                  duration = totalWeeks === 1 ? "1 week" : `${totalWeeks} weeks`;
                } else {
                  const monthsDiff = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());
                  const totalMonths = monthsDiff + 1; // Include both start and end months
                  duration = totalMonths === 1 ? "1 month" : `${totalMonths} months`;
                }
                
                return (
                  <span style={{ fontWeight: "normal", color: "var(--text-muted)", marginLeft: "8px" }}>
                    ({format(minDate, "MMM dd, yyyy")} – {format(maxDate, "MMM dd, yyyy")}, {duration})
                  </span>
                );
              })()}
          </h3>
        </div>
        {showTaskList && (
          <>
            {/* Import Tasks Section */}
            {/* <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--debug-color2)" }}> */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "var(--bg-secondary)",
                  borderBottom: showImportSection ? "1px solid var(-border-light)" : "none",
                  margin: showImportSection ? "0 0 1rem 0" : "0",
                  borderRadius: "4px",
                }}
              >
                <h3 style={{ margin: 0, cursor: "pointer", userSelect: "none", fontSize: "1rem" }} onClick={() => setShowImportSection(!showImportSection)}>
                  {showImportSection ? "▼" : "▶"} Import Tasks from Table
                </h3>
              </div>
              {showImportSection && (
                <>
                  <p>Paste tab-separated data below. First row should be headers.</p>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Phase&#9;Phase Hex&#9;Category&#9;Category HEX&#9;Task&#9;Sub-Task&#9;Owner&#9;Date Start&#9;Date End&#10;Foundation & Discovery&#9;D40E8C&#9;Project Initiation&#9;D30C55&#9;Project Kickoff & Setup&#9;&#9;&#9;1/4/2026&#9;1/17/2026"
                    rows={6}
                    style={{ width: "100%", fontFamily: "monospace" }}
                  />
                  <div style={{ marginTop: "10px" }}>
                    <button onClick={parseImportData} style={{ marginRight: "10px" }}>
                      Parse Data
                    </button>
                    {showImportTable && (
                      <>
                        <button onClick={importTasks} style={{ marginRight: "10px" }}>
                          Import Tasks
                        </button>
                        <button
                          onClick={() => {
                            setShowImportTable(false);
                            setImportData([]);
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>

                  {showImportTable && importData.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h4>Review and Edit Data</h4>
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              {Object.keys(importData[0]).map((header) => (
                                <th key={header}>{header}</th>
                              ))}
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importData.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {Object.keys(row).map((header) => (
                                  <td key={header}>
                                    <input
                                      type="text"
                                      value={row[header]}
                                      onChange={(e) => updateImportData(rowIndex, header, e.target.value)}
                                      style={{ width: "100%" }}
                                    />
                                  </td>
                                ))}
                                <td>
                                  <button onClick={() => removeImportRow(rowIndex)}>Remove</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button onClick={addImportRow} style={{ marginTop: "10px" }}>
                          Add Row
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <button onClick={addTask}>Add Task</button>
            {showDevTaskButton && (
              <button onClick={addTestTask} style={{ marginLeft: "10px" }}>
                Add Test Task
              </button>
            )}
            {/* Export Tasks Button */}
            {/* <div style={{ marginBottom: "1rem" }}> */}
              <button onClick={exportTasks} style={{ backgroundColor: "var(--success-color)", color: "black" }}>
                Export Tasks to CSV
              </button>
              <span style={{ marginLeft: "10px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                ({tasks.length} total tasks, exports all tasks in manual order)
              </span>
              {(filterText.trim() || selectedTimelineTask) && (
                <span style={{ marginLeft: "10px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Showing {filteredAndSortedTasks.length} task-list result{filteredAndSortedTasks.length === 1 ? "" : "s"}
                </span>
              )}
              <span style={{ marginLeft: "10px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Saved in this browser only.
              </span>
            {/* </div> */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Filter tasks..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ flex: 1 }}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "phase" | "name" | "category" | "startDate" | "endDate" | "displayOrder")}
              >
                <option value="displayOrder">Sort by Manual Order</option>
                <option value="phase">Sort by Phase</option>
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="startDate">Sort by Start Date</option>
                <option value="endDate">Sort by End Date</option>
              </select>
              <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} style={{ padding: "8px 12px" }}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
              {selectedTimelineTask && (
                <>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    Timeline selection: <strong>{selectedTimelineTask.name}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedTimelineTaskId(null)}
                    style={{ padding: "8px 12px" }}
                  >
                    Clear Timeline Selection
                  </button>
                </>
              )}
            </div>
            <table className="task-table">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}></th>
                  <th style={{ width: "50px" }}>Order</th>
                  <th>Phase</th>
                  <th>Phase HEX</th>
                  <th>Category</th>
                  <th>Category HEX</th>
                  <th>Task</th>
                  <th>Sub-Task</th>
                  <th>Owner</th>
                  <th>Line Padding</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTasks.map((t) => (
                  <tr
                    key={t.id}
                    draggable
                    onDragStart={() => handleDragStart(t.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(t.id)}
                    onDragEnd={handleDragEnd}
                    style={{
                      opacity: draggedTask === t.id ? 0.5 : 1,
                      cursor: "move",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <td style={{ cursor: "grab", textAlign: "center", fontSize: "1.2rem", color: "var(--text-muted)" }} title="Drag to reorder">
                      ⋮⋮
                    </td>
                    <td style={{ textAlign: "center", fontWeight: "bold", color: "var(--text-muted)" }}>{t.displayOrder}</td>
                    <td>
                      <input type="text" value={t.phase || ""} onChange={(e) => updateTask(t.id, "phase", e.target.value)} />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={t.phaseHex || ""}
                        onChange={(e) => updateTask(t.id, "phaseHex", e.target.value)}
                        placeholder="e.g., 0070C0"
                      />
                    </td>
                    <td>
                      <input type="text" value={t.category} onChange={(e) => updateTask(t.id, "category", e.target.value)} />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={t.categoryHex || ""}
                        onChange={(e) => updateTask(t.id, "categoryHex", e.target.value)}
                        placeholder="e.g., 0070C0"
                      />
                    </td>
                    <td>
                      <input type="text" value={t.name} onChange={(e) => updateTask(t.id, "name", e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={t.subTask || ""} onChange={(e) => updateTask(t.id, "subTask", e.target.value)} />
                    </td>
                    <td>
                      <input type="text" value={t.owner || ""} onChange={(e) => updateTask(t.id, "owner", e.target.value)} />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={t.lineHeightAdjust ?? 0}
                        onChange={(e) => updateTask(t.id, "lineHeightAdjust", Number(e.target.value))}
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={t.startDate}
                        onChange={(date) => updateTask(t.id, "startDate", date || new Date())}
                        dateFormat="yyyy-MM-dd"
                      />
                    </td>
                    <td>
                      <DatePicker selected={t.endDate} onChange={(date) => updateTask(t.id, "endDate", date || new Date())} dateFormat="yyyy-MM-dd" />
                    </td>
                    <td>
                      <button onClick={() => removeTask(t.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}</div>
      <div className="section-container">        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "var(--bg-secondary)",
            borderBottom: showTimeline ? "1px solid var(--border-medium)" : "none",
            margin: showTimeline ? "-1.5rem -1.5rem 0 -1.5rem" : "-1.5rem",
          }}
        >
          <h3 style={{ cursor: "pointer", userSelect: "none", margin: 0, fontSize: "1rem" }} onClick={() => setShowTimeline(!showTimeline)}>
            {showTimeline ? "▼" : "▶"} Timeline
          </h3>
        </div>
        {showTimeline && (
          <div style={{ marginTop: "1rem" }}>
            {/* ==================== WEEKLY VIEW TIMELINE ==================== */}
            {/* 
              Weekly view uses a "reverse Tetris" packing algorithm to minimize vertical space.
              Tasks are positioned from top to bottom, fitting into the first available space.
              
              Key features:
              - Dynamic task height based on text wrapping (word-wrap simulation)
              - Vacation tasks always appear at the top (sorted first)
              - Tasks are grouped by phase with colored header bars
              - Horizontal positioning uses percentage-based layout for responsiveness
              - Vertical positioning uses absolute positioning with collision detection
            */}
            {view === "weeks" &&
              (() => {
                // Calculate visible period and filter tasks that overlap with it
                const periodStart = currentWeek;
                const periodEnd = getWeeklyPeriodEnd();
                const visibleTasks = timelineTasks.filter((task) => {
                  if (task.startDate > periodEnd || task.endDate < periodStart) {
                    return false;
                  }

                  return getTaskPosition(task) !== null;
                });

                // ========== TASK HEIGHT CALCULATION ==========
                // Calculate dynamic heights based on text wrapping to ensure text fits
                const taskHeights = new Map<number, number>();
                const debugInfo = new Map<number, string>();
                visibleTasks.forEach((task) => {
                  const position = getTaskPosition(task);
                  if (!position) return;
                  const { width } = position;
                  const actualWidth = (width / 100) * 1800; // Approximate pixel width
                  const textWidth = actualWidth - 16; // Account for padding (increased from 10 to 16)
                  const charsPerLine = Math.max(1, Math.floor(textWidth / 7.2)); // Consolas 13px ≈ 7.5px per char (slightly conservative)

                  // Simulate word wrapping to count actual lines needed
                  const words = task.name.split(" ");
                  let lines = 1;
                  let currentLineLength = 0;

                  words.forEach((word) => {
                    const wordLength = word.length;
                    if (currentLineLength === 0) {
                      // First word on line
                      currentLineLength = wordLength;
                    } else if (currentLineLength + 1 + wordLength <= charsPerLine) {
                      // Word fits on current line (including space)
                      currentLineLength += 1 + wordLength;
                    } else {
                      // Word needs new line
                      lines++;
                      currentLineLength = wordLength;
                    }
                  });
                  
                  // Add safety margin - add one more line to prevent overflow
                  // This ensures text never gets cut off even with font rendering variations
                  if (currentLineLength > charsPerLine * 0.85) {
                    lines++;
                  }

                  // Calculate height based on number of lines
                  let height;
                  if (lines === 1) {
                    height = 36;
                  } else if (lines === 2) {
                    height = 50;
                  } else {
                    height = 50 + (lines - 2) * 16;
                  }
                  const manualExtraLines = task.lineHeightAdjust ?? 0;
                  height += manualExtraLines * 16;
                  height = Math.max(28, height);

                  taskHeights.set(task.id, height);
                  debugInfo.set(task.id, `W:${actualWidth.toFixed(0)}px T:${textWidth.toFixed(0)}px C:${charsPerLine} L:${lines} H:${height}px\nStart:${periodStart.toDateString()}\nEnd:${periodEnd.toDateString()}`);
                });

                // ========== TASK SORTING ==========
                // "Reverse Tetris" algorithm: Pack tasks to the top
                // Sort by: 1) Vacation first, 2) Display order for manual arrangement
                const sortedTasks = [...visibleTasks].sort((a, b) => {
                  const aIsVacation = a.name.toLowerCase().includes("vacation") || a.phase?.toUpperCase() === "OOO";
                  const bIsVacation = b.name.toLowerCase().includes("vacation") || b.phase?.toUpperCase() === "OOO";

                  // Vacation tasks always come first (appear at top)
                  if (aIsVacation && !bIsVacation) return -1;
                  if (!aIsVacation && bIsVacation) return 1;

                  // For non-vacation tasks or vacation ties, use display order
                  return (a.displayOrder || 0) - (b.displayOrder || 0);
                });

                // ========== VERTICAL POSITIONING ==========
                // Pack tasks into vertical space using collision detection
                const taskPositions = new Map<number, number>();
                const occupiedRanges: Array<{ start: number; end: number; top: number; bottom: number }> = [];
                const topPadding = 8; // Padding from top of timeline

                // For each task, find the first available vertical position
                sortedTasks.forEach((task) => {
                  const position = getTaskPosition(task);
                  if (!position) return;
                  const { start, width } = position;
                  const taskHeight = taskHeights.get(task.id) || 30;
                  const horizontalPadding = 0.3; // Small gap between adjacent tasks
                  const taskStart = start + horizontalPadding;
                  const taskEnd = start + width - horizontalPadding;

                  // Find the lowest available position (pack upward)
                  let bestTop = topPadding;

                  // Check all existing tasks for horizontal overlap
                  for (const occupied of occupiedRanges) {
                    // Check if tasks overlap horizontally (with tolerance for floating point precision)
                    const tolerance = 0.1;
                    const horizontalOverlap = !(taskEnd <= occupied.start + tolerance || taskStart >= occupied.end - tolerance);

                    if (horizontalOverlap) {
                      // They overlap horizontally, so this task must be below the occupied task
                      bestTop = Math.max(bestTop, occupied.bottom);
                    }
                  }

                  // Record this task's position and occupied space
                  taskPositions.set(task.id, bestTop);
                  occupiedRanges.push({
                    start: taskStart,
                    end: taskEnd,
                    top: bestTop,
                    bottom: bestTop + taskHeight,
                  });
                });

                // Calculate total height needed for all tasks
                let totalHeight = 0;
                occupiedRanges.forEach((range) => {
                  totalHeight = Math.max(totalHeight, range.bottom);
                });

                return (
                  <div className="board">
                    {/* ========== WEEK HEADER ROW ========== */}
                    <div 
                      className="board-header"
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${weekSpan}, 1fr)`,
                      }}
                    >
                      {weekColumns.map((week, index) => {
                        const visibleDays = visibleWeekColumns[index];
                        const firstVisibleDay = visibleDays[0] || week;
                        const lastVisibleDay = visibleDays[visibleDays.length - 1] || addDays(week, 6);
                        // Calculate week number relative to first task or just use index
                        let weekNumber = index + 1;
                        if (showWeekNumbers && tasks.length > 0) {
                          const allDates = tasks.map((t) => t.startDate);
                          const firstTaskDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
                          const firstTaskWeek = startOfWeek(firstTaskDate);
                          const weeksDiff = Math.round((week.getTime() - firstTaskWeek.getTime()) / (7 * 24 * 60 * 60 * 1000));
                          weekNumber = weeksDiff + 1;
                        }

                        return (
                          <div 
                            key={index} 
                            className="day-header"
                            style={{
                              borderRight: index < weekColumns.length - 1 ? "1px solid var(--border-dark)" : "none",
                            }}
                            title={`${format(firstVisibleDay, "MMM dd")} – ${format(lastVisibleDay, "MMM dd, yyyy")}`}
                          >
                            {showWeekNumbers ? `Wk ${weekNumber}` : `${format(firstVisibleDay, "MMM dd")} – ${format(lastVisibleDay, "MMM dd")}`}
                          </div>
                        );
                      })}
                    </div>

                    {/* ========== PHASE SECTIONS ========== */}
                    {/* Each phase gets its own section with a header bar and task area */}
                    {/* When phase grouping is disabled, treat all tasks as a single group */}
                    {(showPhaseLabels ? phases : [""]).map((phase) => {
                      const phaseTasks = showPhaseLabels 
                        ? visibleTasks.filter((t) => t.phase === phase)
                        : visibleTasks; // All tasks in one group when not grouped by phase
                      if (phaseTasks.length === 0) return null; // Skip empty phases

                      // Calculate phase start/end dates from all tasks in this phase
                      const phaseStart = normalizeDate(new Date(Math.min(...phaseTasks.map((t) => t.startDate.getTime()))));
                      const phaseEnd = normalizeDate(new Date(Math.max(...phaseTasks.map((t) => t.endDate.getTime()))));

                      // Get phase color from first task in phase
                      const phaseTask = phaseTasks[0];

                      // Calculate phase header position based on earliest and latest task dates
                      const phasePosition = getTaskPosition({
                        ...phaseTask,
                        startDate: phaseStart,
                        endDate: phaseEnd,
                      });
                      if (!phasePosition) return null;
                      const { start, width } = phasePosition;

                      // ========== PHASE TASK POSITIONING ==========
                      // Apply same packing algorithm within this phase
                      const phaseTaskPositions = new Map<number, number>();
                      const phaseOccupiedRanges: Array<{ start: number; end: number; top: number; bottom: number }> = [];
                      const phaseTopPadding = 8;

                      // Sort phase tasks by: 1) Vacation first, 2) Display order
                      const sortedPhaseTasks = [...phaseTasks].sort((a, b) => {
                        const aIsVacation = a.name.toLowerCase().includes("vacation") || a.phase?.toUpperCase() === "OOO";
                        const bIsVacation = b.name.toLowerCase().includes("vacation") || b.phase?.toUpperCase() === "OOO";

                        // Vacation tasks always come first (appear at top)
                        if (aIsVacation && !bIsVacation) return -1;
                        if (!aIsVacation && bIsVacation) return 1;

                        // For non-vacation tasks or vacation ties, use display order
                        return (a.displayOrder || 0) - (b.displayOrder || 0);
                      });

                      sortedPhaseTasks.forEach((task) => {
                        const position = getTaskPosition(task);
                        if (!position) return;
                        const { start: taskStart, width: taskWidth } = position;
                        const taskHeight = taskHeights.get(task.id) || 30;
                        const horizontalPadding = 0.3;
                        const taskStartPos = taskStart + horizontalPadding;
                        const taskEndPos = taskStart + taskWidth - horizontalPadding;

                        let bestTop = phaseTopPadding;

                        for (const occupied of phaseOccupiedRanges) {
                          const tolerance = 0.1;
                          const horizontalOverlap = !(taskEndPos <= occupied.start + tolerance || taskStartPos >= occupied.end - tolerance);

                          if (horizontalOverlap) {
                            bestTop = Math.max(bestTop, occupied.bottom);
                          }
                        }

                        phaseTaskPositions.set(task.id, bestTop);
                        phaseOccupiedRanges.push({
                          start: taskStartPos,
                          end: taskEndPos,
                          top: bestTop,
                          bottom: bestTop + taskHeight,
                        });
                      });

                      let phaseTotalHeight = 0;
                      phaseOccupiedRanges.forEach((range) => {
                        phaseTotalHeight = Math.max(phaseTotalHeight, range.bottom);
                      });

                      return (
                        <div
                          key={`phase-section-${phase}`}
                          style={{
                            position: "relative",
                          }}
                        >
                          {/* ========== PHASE HEADER BAR ========== */}
                          {/* Background grid for phase header with light background matching task area */}
                          {showPhaseLabels && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${weekSpan}, 1fr)`,
                                minHeight: "34px",
                                position: "relative",
                                borderTop: "2px solid var(--border-medium)",
                                overflow: "hidden",
                                backgroundColor: "var(--bg-primary)" /* White background to match task grid below */
                              }}
                            >
                              {/* Grid cells to create column structure with visible borders in greyed areas */}
                              {weekColumns.map((_, index) => {
                                // Calculate if this column is within the phase boundaries
                                const columnPercent = (index / weekSpan) * 100;
                                const isWithinPhase = columnPercent >= start && columnPercent < (start + width);
                                
                                return (
                                  <div 
                                    key={index} 
                                    style={{ 
                                      position: "relative",
                                      // Show border only in greyed areas (outside phase) and not on last column
                                      borderRight: !isWithinPhase && index < weekColumns.length - 1 
                                        ? "1px solid var(--border-medium)" 
                                        : "none",
                                    }}
                                  >
                                  </div>
                                );
                              })}
                              {/* Absolute positioned phase label bar spanning phase duration */}
                              <div
                                style={{
                                  position: "absolute",
                                  left: `${start}%`,
                                  width: `${width}%`,
                                  top: "0px",
                                  height: "100%",
                                  // backgroundColor: "#5C4D43",
                                  backgroundColor: "var(--color-gray-900)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  color: "var(--color-white)",
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  letterSpacing: "0.05em",
                                  boxSizing: "border-box",
                                  zIndex: 1,
                                  paddingLeft: "4px",
                                  paddingRight: "4px",
                                }}
                              >
                                {phaseStart < periodStart ? (
                                  <span style={{ marginRight: "8px", fontWeight: "bold", fontSize: "1.1em", paddingLeft: "5px" }}>◀</span>
                                ) : (
                                  <span style={{ width: "1.1em", marginRight: "8px" }}></span>
                                )}
                                <span style={{ flex: 1, textAlign: "center" }}>
                                  {(() => {
                                    if (tasks.length === 0) {
                                      return phase;
                                    }
                                    
                                    const allDates = tasks.map((t) => t.startDate);
                                    const firstTaskDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
                                    const firstTaskWeek = startOfWeek(firstTaskDate);
                                    
                                    const phaseStartWeek = startOfWeek(phaseStart);
                                    const phaseEndWeek = startOfWeek(phaseEnd);
                                    
                                    const startWeekNum = Math.round((phaseStartWeek.getTime() - firstTaskWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
                                    const endWeekNum = Math.round((phaseEndWeek.getTime() - firstTaskWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
                                    
                                    const weekRange = startWeekNum === endWeekNum 
                                      ? `Week ${startWeekNum}`
                                      : `Weeks ${startWeekNum}-${endWeekNum}`;
                                    
                                    return `${weekRange}: ${phase}`;
                                  })()}
                                </span>
                                {phaseEnd > periodEnd ? (
                                  <span style={{ marginLeft: "8px", fontWeight: "bold", fontSize: "1.1em", paddingRight: "5px" }}>▶</span>
                                ) : (
                                  <span style={{ width: "1.1em", marginLeft: "8px" }}></span>
                                )}
                              </div>
                              
                              {/* Remove the percentage-based divider lines - using grid cell borders instead */}
                            </div>
                          )}

                          {/* ========== TASK AREA ========== */}
                          {/* Container for all task bars within this phase */}
                          <div style={{ position: "relative", minHeight: `${Math.max(40, phaseTotalHeight)}px` }}>
                            {/* Grid for column structure */}
                            <div
                              style={{ 
                                width: "100%",
                                position: "relative",
                                display: "grid",
                                gridTemplateColumns: `repeat(${weekSpan}, 1fr)`,
                                backgroundColor: "var(--bg-primary)",
                                minHeight: `${Math.max(40, phaseTotalHeight)}px`,
                                borderBottom: "1px solid var(--border-medium)",
                              }}
                            >
                              {/* Grid cells with borders (except last column) */}
                              {weekColumns.map((_, index) => {
                                // Calculate if this column is within the phase boundaries
                                const columnPercent = (index / weekSpan) * 100;
                                const isWithinPhase = columnPercent >= start && columnPercent < (start + width);
                                
                                return (
                                  <div 
                                    key={index} 
                                    className="day-cell" 
                                    style={{
                                      ...(index === weekColumns.length - 1 ? { borderRight: "none" } : {}),
                                      // Dim the border if outside phase boundaries
                                      ...(!isWithinPhase && index < weekColumns.length - 1 ? { borderRight: "1px solid var(--border-medium)" } : {}),
                                    }}
                                  ></div>
                                );
                              })}

                              {/* Phase background bar - semi-transparent overlay */}
                              {showPhaseLabels && (
                                <div
                                  style={{
                                    position: "absolute",
                                    left: `${start}%`,
                                    width: `${width}%`,
                                    top: "-2px",
                                    height: "calc(100% + 2px)",
                                    // backgroundColor: bgColorSectionLight,
                                    opacity: 0.6,
                                    zIndex: 0,
                                    pointerEvents: "none",
                                  }}
                                />
                              )}

                              {/* Grey overlays REMOVED for consistent light background throughout */}

                              {/* Vacation background bars - gray overlay for vacation periods */}
                              {phaseTasks
                                .filter((task) => task.name.toLowerCase().includes("vacation") || task.phase?.toUpperCase() === "OOO")
                                .map((task) => {
                                  const position = getTaskPosition(task);
                                  if (!position) return null;
                                  const { start, width } = position;
                                  return (
                                    <div
                                      key={`vacation-bg-${task.id}`}
                                      style={{
                                        position: "absolute",
                                        left: `${start}%`,
                                        width: `${width}%`,
                                        top: "0px",
                                        height: "100%",
                                        backgroundColor: "#DDD6D0",
                                        zIndex: 0,
                                        opacity: 0.7,
                                      }}
                                    />
                                  );
                                })}

                              {/* Individual task bars with calculated positions */}
                              {phaseTasks.map((task) => {
                                const position = getTaskPosition(task);
                                if (!position) return null;
                                const { start, width } = position;
                                const top = phaseTaskPositions.get(task.id) || 0; // Vertical position from packing algorithm
                                const horizontalPadding = 0.3; // Small gap between adjacent tasks
                                
                                // Use default color for vacation/OOO tasks, otherwise use category color
                                const isVacationTask = task.name.toLowerCase().includes("vacation") || task.phase?.toUpperCase() === "OOO";
                                const bgColor = isVacationTask ? "#645b56" : (task.categoryHex ? `#${task.categoryHex}` : "var(--task-bg-fallback)");
                                const textColor = isVacationTask ? getTextColor("645b56") : getTextColor(task.categoryHex);
                                
                                // Check if task extends beyond visible timeline
                                const taskStartsBeforeView = task.startDate < periodStart;
                                const taskEndsAfterView = task.endDate > periodEnd;
                                
                                return (
                                  <div
                                    key={task.id}
                                    className="task-bar"
                                    draggable
                                    aria-pressed={selectedTimelineTaskId === task.id}
                                    onDragStart={() => handleDragStart(task.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(task.id)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => toggleTimelineTaskSelection(task.id)}
                                    title={[
                                      `Task: ${task.name}`,
                                      task.subTask ? `Sub-Task: ${task.subTask}` : '',
                                      task.phase ? `Phase: ${task.phase}` : '',
                                      task.category ? `Category: ${task.category}` : '',
                                      task.owner ? `Owner: ${task.owner}` : '',
                                                                           `Start: ${format(task.startDate, 'MMM dd, yyyy')}`,
                                      `End: ${format(task.endDate, 'MMM dd, yyyy')}`,
                                      `ID: ${task.displayOrder}`,
                                      '',
                                      `Top: ${top}px`,
                                      debugInfo.get(task.id) || ''
                                    ].filter(Boolean).join('\n')}
                                    style={{
                                      left: `calc(${start}% + ${horizontalPadding}%)`,
                                      width: `calc(${width}% - ${horizontalPadding * 2}%)`,
                                      top: `${top}px`,
                                      backgroundColor: bgColor,
                                      color: textColor,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      cursor: "pointer",
                                      opacity: draggedTask === task.id ? 0.5 : selectedTimelineTaskId !== null && selectedTimelineTaskId !== task.id ? 0.72 : 1,
                                      transition: "opacity 0.2s, box-shadow 0.2s, transform 0.2s",
                                      boxShadow: selectedTimelineTaskId === task.id ? "0 0 0 3px rgba(37, 99, 235, 0.45), 0 0 0 6px rgba(255, 255, 255, 0.9)" : undefined,
                                    }}
                                  >
                                    {taskStartsBeforeView && (
                                      <span style={{ marginLeft: "4px", fontWeight: "bold", fontSize: "1.1em" }}>◀</span>
                                    )}
                                    <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>{task.name}</span>
                                    {taskEndsAfterView && (
                                      <span style={{ marginRight: "4px", fontWeight: "bold", fontSize: "1.1em" }}>▶</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            {/* ==================== MONTHLY VIEW TIMELINE ==================== */}
            {/*
              Monthly view follows same structure as weekly view but with months as columns:
              - Columns represent months instead of weeks  
              - Month boundaries are used for calculations
              - Same visual styling as weekly view (matching phase headers, grey overlays, dimmed gridlines)
              - Same "reverse Tetris" packing algorithm for vertical positioning
              - Arrows indicate when phases/tasks extend beyond visible timeline
            */}
            {view === "months" &&
              (() => {
                // Calculate visible period and filter tasks that overlap with it
                const periodStart = useCustomMonthRange && customMonthStart 
                  ? customMonthStart 
                  : startOfMonth(currentMonth);
                const periodEnd = useCustomMonthRange && customMonthEnd
                  ? customMonthEnd
                  : endOfMonth(addMonths(currentMonth, monthSpan - 1));
                const visibleTasks = timelineTasks.filter((task) => {
                  if (task.startDate > periodEnd || task.endDate < periodStart) {
                    return false;
                  }

                  return getMonthTaskPosition(task) !== null;
                });

                // ========== TASK HEIGHT CALCULATION ==========
                // Calculate dynamic heights based on text wrapping to ensure text fits
                const taskHeights = new Map<number, number>();
                const debugInfo = new Map<number, string>();
                visibleTasks.forEach((task) => {
                  const position = getMonthTaskPosition(task);
                  if (!position) return;
                  const { width } = position;
                  const actualWidth = (width / 100) * 1800; // Approximate pixel width
                  const textWidth = actualWidth - 16; // Account for padding (increased from 10 to 16)
                  const charsPerLine = Math.max(1, Math.floor(textWidth / 7.2)); // Consolas 13px ≈ 7.2px per char

                  // Simulate word wrapping to count actual lines needed
                  const words = task.name.split(" ");
                  let lines = 1;
                  let currentLineLength = 0;

                  words.forEach((word) => {
                    const wordLength = word.length;
                    if (currentLineLength === 0) {
                      // First word on line
                      currentLineLength = wordLength;
                    } else if (currentLineLength + 1 + wordLength <= charsPerLine) {
                      // Word fits on current line (including space)
                      currentLineLength += 1 + wordLength;
                    } else {
                      // Word needs new line
                      lines++;
                      currentLineLength = wordLength;
                    }
                  });
                  
                  // // Add safety margin - bump up lines by 1 if we're close to the edge
                  // if (currentLineLength > charsPerLine * 0.85) {
                  //   lines++;
                  // }

                  // Calculate height based on number of lines
                  let height;
                  if (lines === 1) {
                    height = 36;
                  } else if (lines === 2) {
                    height = 50;
                  } else {
                    height = 50 + (lines - 2) * 16;
                  }
                  const manualExtraLines = task.lineHeightAdjust ?? 0;
                  height += manualExtraLines * 16;
                  height = Math.max(28, height);

                  taskHeights.set(task.id, height);
                  debugInfo.set(task.id, `W:${actualWidth.toFixed(0)}px T:${textWidth.toFixed(0)}px C:${charsPerLine} L:${lines} H:${height}px\nStart:${periodStart.toDateString()}\nEnd:${periodEnd.toDateString()}`);
                });

                // ========== TASK SORTING ==========
                // "Reverse Tetris" algorithm: Pack tasks to the top
                // Sort by: 1) Vacation first, 2) Display order for manual arrangement
                const sortedTasks = [...visibleTasks].sort((a, b) => {
                  const aIsVacation = a.name.toLowerCase().includes("vacation") || a.phase?.toUpperCase() === "OOO";
                  const bIsVacation = b.name.toLowerCase().includes("vacation") || b.phase?.toUpperCase() === "OOO";

                  // Vacation tasks always come first (appear at top)
                  if (aIsVacation && !bIsVacation) return -1;
                  if (!aIsVacation && bIsVacation) return 1;

                  // For non-vacation tasks or vacation ties, use display order
                  return (a.displayOrder || 0) - (b.displayOrder || 0);
                });

                // ========== VERTICAL POSITIONING ==========
                // Pack tasks into vertical space using collision detection
                const taskPositions = new Map<number, number>();
                const occupiedRanges: Array<{ start: number; end: number; top: number; bottom: number }> = [];
                const topPadding = 8; // Padding from top of timeline

                // For each task, find the first available vertical position
                sortedTasks.forEach((task) => {
                  const position = getMonthTaskPosition(task);
                  if (!position) return;
                  const { start, width } = position;
                  const taskHeight = taskHeights.get(task.id) || 30;
                  const horizontalPadding = 0.3; // Small gap between adjacent tasks
                  const taskStart = start + horizontalPadding;
                  const taskEnd = start + width - horizontalPadding;

                  // Find the lowest available position (pack upward)
                  let bestTop = topPadding;

                  // Check all existing tasks for horizontal overlap
                  for (const occupied of occupiedRanges) {
                    // Check if tasks overlap horizontally (with tolerance for floating point precision)
                    const tolerance = 0.1;
                    const horizontalOverlap = !(taskEnd <= occupied.start + tolerance || taskStart >= occupied.end - tolerance);

                    if (horizontalOverlap) {
                      // They overlap horizontally, so this task must be below the occupied task
                      bestTop = Math.max(bestTop, occupied.bottom);
                    }
                  }

                  // Record this task's position and occupied space
                  taskPositions.set(task.id, bestTop);
                  occupiedRanges.push({
                    start: taskStart,
                    end: taskEnd,
                    top: bestTop,
                    bottom: bestTop + taskHeight,
                  });
                });

                // Calculate total height needed for all tasks
                let totalHeight = 0;
                occupiedRanges.forEach((range) => {
                  totalHeight = Math.max(totalHeight, range.bottom);
                });

                return (
                  <div className="board">
                    {/* ========== MONTH HEADER ROW ========== */}
                    <div 
                      className="board-header"
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${monthColumns.length}, 1fr)`,
                      }}
                    >
                      {monthColumns.map((month, index) => {
                        // Calculate month number relative to first task or just use index
                        let monthNumber = index + 1;
                        if (showMonthNumbers && tasks.length > 0) {
                          const allDates = tasks.map((t) => t.startDate);
                          const firstTaskDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
                          const firstTaskMonth = startOfMonth(firstTaskDate);
                          const monthsDiff = (month.getFullYear() - firstTaskMonth.getFullYear()) * 12 + (getMonth(month) - getMonth(firstTaskMonth));
                          monthNumber = monthsDiff + 1;
                        }
                        
                        return (
                          <div 
                            key={index} 
                            className="day-header"
                            style={{
                              borderRight: index < monthColumns.length - 1 ? "1px solid var(--border-dark)" : "none",
                            }}
                            title={`${format(month, "MMM dd, yyyy")} – ${format(endOfMonth(month), "MMM dd, yyyy")}`}
                          >
                            {showMonthNumbers ? `Month ${monthNumber}` : format(month, "MMM yyyy")}
                          </div>
                        );
                      })}
                    </div>

                    {/* ========== PHASE SECTIONS ========== */}
                    {/* Each phase gets its own section with a header bar and task area */}
                    {/* When phase grouping is disabled, treat all tasks as a single group */}
                    {(showPhaseLabels ? phases : [""]).map((phase) => {
                      const phaseTasks = showPhaseLabels 
                        ? visibleTasks.filter((t) => t.phase === phase)
                        : visibleTasks; // All tasks in one group when not grouped by phase
                      if (phaseTasks.length === 0) return null; // Skip empty phases

                      // Calculate phase start/end dates from all tasks in this phase
                      const normalizeToMidnight = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
                      const phaseStart = normalizeToMidnight(new Date(Math.min(...phaseTasks.map((t) => t.startDate.getTime()))));
                      const phaseEnd = normalizeToMidnight(new Date(Math.max(...phaseTasks.map((t) => t.endDate.getTime()))));

                      // Get phase color from first task in phase
                      const phaseTask = phaseTasks[0];

                      // Calculate phase header position based on earliest and latest task dates
                      const phasePosition = getMonthTaskPosition({
                        ...phaseTask,
                        startDate: phaseStart,
                        endDate: phaseEnd,
                      });
                      if (!phasePosition) return null;
                      const { start, width } = phasePosition;

                      // ========== PHASE TASK POSITIONING ==========
                      // Apply same packing algorithm within this phase
                      const phaseTaskPositions = new Map<number, number>();
                      const phaseOccupiedRanges: Array<{ start: number; end: number; top: number; bottom: number }> = [];
                      const phaseTopPadding = 8;

                      // Sort phase tasks by: 1) Vacation first, 2) Display order
                      const sortedPhaseTasks = [...phaseTasks].sort((a, b) => {
                        const aIsVacation = a.name.toLowerCase().includes("vacation") || a.phase?.toUpperCase() === "OOO";
                        const bIsVacation = b.name.toLowerCase().includes("vacation") || b.phase?.toUpperCase() === "OOO";

                        // Vacation tasks always come first (appear at top)
                        if (aIsVacation && !bIsVacation) return -1;
                        if (!aIsVacation && bIsVacation) return 1;

                        // For non-vacation tasks or vacation ties, use display order
                        return (a.displayOrder || 0) - (b.displayOrder || 0);
                      });

                      sortedPhaseTasks.forEach((task) => {
                        const position = getMonthTaskPosition(task);
                        if (!position) return;
                        const { start: taskStart, width: taskWidth } = position;
                        const taskHeight = taskHeights.get(task.id) || 30;
                        const horizontalPadding = 0.3;
                        const taskStartPos = taskStart + horizontalPadding;
                        const taskEndPos = taskStart + taskWidth - horizontalPadding;

                        let bestTop = phaseTopPadding;

                        for (const occupied of phaseOccupiedRanges) {
                          const tolerance = 0.1;
                          const horizontalOverlap = !(taskEndPos <= occupied.start + tolerance || taskStartPos >= occupied.end - tolerance);

                          if (horizontalOverlap) {
                            bestTop = Math.max(bestTop, occupied.bottom);
                          }
                        }

                        phaseTaskPositions.set(task.id, bestTop);
                        phaseOccupiedRanges.push({
                          start: taskStartPos,
                          end: taskEndPos,
                          top: bestTop,
                          bottom: bestTop + taskHeight,
                        });
                      });

                      let phaseTotalHeight = 0;
                      phaseOccupiedRanges.forEach((range) => {
                        phaseTotalHeight = Math.max(phaseTotalHeight, range.bottom);
                      });

                      return (
                        <div
                          key={`phase-section-${phase}`}
                          style={{
                            position: "relative",
                          }}
                        >
                          {/* ========== PHASE HEADER BAR ========== */}
                          {/* Background grid for phase header with light background matching task area */}
                          {showPhaseLabels && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: `repeat(${monthColumns.length}, 1fr)`,
                                minHeight: "35px",
                                position: "relative",
                                borderTop: "5px solid var(--border-medium)",
                                overflow: "hidden",
                                backgroundColor: "var(--bg-primary)" /* White background to match task grid below */
                              }}
                            >
                              {/* Grid cells to create column structure with visible borders in greyed areas */}
                              {monthColumns.map((_, index) => {
                                // Calculate if this column is within the phase boundaries
                                const columnPercent = (index / monthColumns.length) * 100;
                                const isWithinPhase = columnPercent >= start && columnPercent < (start + width);
                                
                                return (
                                  <div 
                                    key={index} 
                                    style={{ 
                                      position: "relative",
                                      // Show border only in greyed areas (outside phase) and not on last column
                                      borderRight: !isWithinPhase && index < monthColumns.length - 1 
                                        ? "1px solid rgba(0, 0, 0, 0.15)" 
                                        : "none",
                                    }}
                                  >
                                  </div>
                                );
                              })}
                              {/* Absolute positioned phase label bar spanning phase duration */}
                              <div
                                style={{
                                  position: "absolute",
                                  left: `${start}%`,
                                  width: `${width}%`,
                                  top: "0px",
                                  height: "100%",
                                  backgroundColor: "var(--color-gray-900)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  color: "var(--color-white)",
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  letterSpacing: "0.05em",
                                  boxSizing: "border-box",
                                  zIndex: 1,
                                  paddingLeft: "4px",
                                  paddingRight: "4px",
                                }}
                              >
                                {phaseStart < periodStart ? (
                                  <span style={{ marginRight: "8px", fontWeight: "bold", fontSize: "1.1em", paddingLeft: "5px" }}>◀</span>
                                ) : (
                                  <span style={{ width: "1.1em", marginRight: "8px" }}></span>
                                )}
                                <span style={{ flex: 1, textAlign: "center" }}>
                                  {(() => {
                                    if (tasks.length === 0) {
                                      return phase;
                                    }
                                    
                                    // Calculate month numbers for phase start and end
                                    const allDates = tasks.map((t) => t.startDate);
                                    const firstTaskDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
                                    const firstTaskMonth = startOfMonth(firstTaskDate);
                                    
                                    const phaseStartMonth = startOfMonth(phaseStart);
                                    const phaseEndMonth = startOfMonth(phaseEnd);
                                    
                                    const startMonthNum = (phaseStartMonth.getFullYear() - firstTaskMonth.getFullYear()) * 12 + (getMonth(phaseStartMonth) - getMonth(firstTaskMonth)) + 1;
                                    const endMonthNum = (phaseEndMonth.getFullYear() - firstTaskMonth.getFullYear()) * 12 + (getMonth(phaseEndMonth) - getMonth(firstTaskMonth)) + 1;
                                    
                                    const monthRange = startMonthNum === endMonthNum 
                                      ? `Month ${startMonthNum}`
                                      : `Months ${startMonthNum}-${endMonthNum}`;
                                    
                                    return `${monthRange}: ${phase}`;
                                  })()}
                                </span>
                                {phaseEnd > periodEnd ? (
                                  <span style={{ marginLeft: "8px", fontWeight: "bold", fontSize: "1.1em", paddingRight: "5px" }}>▶</span>
                                ) : (
                                  <span style={{ width: "1.1em", marginLeft: "8px" }}></span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* ========== TASK AREA ========== */}
                          {/* Container for all task bars within this phase */}
                          <div style={{ position: "relative", minHeight: `${Math.max(40, phaseTotalHeight)}px` }}>
                            {/* Grid for column structure */}
                            <div
                              style={{ 
                                width: "100%",
                                position: "relative",
                                display: "grid",
                                gridTemplateColumns: `repeat(${monthColumns.length}, 1fr)`,
                                backgroundColor: "var(--bg-primary)",
                                minHeight: `${Math.max(40, phaseTotalHeight)}px`,
                                borderBottom: "1px solid var(--border-medium)",
                              }}
                            >
                              {/* Grid cells with borders (except last column) */}
                              {monthColumns.map((_, index) => {
                                // Calculate if this column is within the phase boundaries
                                const columnPercent = (index / monthColumns.length) * 100;
                                const isWithinPhase = columnPercent >= start && columnPercent < (start + width);
                                
                                return (
                                  <div 
                                    key={index} 
                                    className="day-cell" 
                                    style={{
                                      ...(index === monthColumns.length - 1 ? { borderRight: "none" } : {}),
                                      // Dim the border if outside phase boundaries
                                      ...(!isWithinPhase && index < monthColumns.length - 1 ? { borderRight: "1px solid var(--border-medium)" } : {}),
                                    }}
                                  ></div>
                                );
                              })}

                              {/* Phase background bar - semi-transparent overlay */}
                              {showPhaseLabels && (
                                <div
                                  style={{
                                    position: "absolute",
                                    left: `${start}%`,
                                    width: `${width}%`,
                                    top: "-2px",
                                    height: "calc(100% + 2px)",
                                    opacity: 0.6,
                                    zIndex: 0,
                                    pointerEvents: "none",
                                  }}
                                />
                              )}

                              {/* Grey overlays REMOVED for consistent light background throughout */}

                              {/* Vacation background bars - gray overlay for vacation periods */}
                              {phaseTasks
                                .filter((task) => task.name.toLowerCase().includes("vacation") || task.phase?.toUpperCase() === "OOO")
                                .map((task) => {
                                  const position = getMonthTaskPosition(task);
                                  if (!position) return null;
                                  const { start, width } = position;
                                  return (
                                    <div
                                      key={`vacation-bg-${task.id}`}
                                      style={{
                                        position: "absolute",
                                        left: `${start}%`,
                                        width: `${width}%`,
                                        top: "0px",
                                        height: "100%",
                                        backgroundColor: "#DDD6D0",
                                        zIndex: 0,
                                        opacity: 0.7,
                                      }}
                                    />
                                  );
                                })}

                              {/* Individual task bars with calculated positions */}
                              {phaseTasks.map((task) => {
                                const position = getMonthTaskPosition(task);
                                if (!position) return null;
                                const { start, width } = position;
                                const top = phaseTaskPositions.get(task.id) || 0; // Vertical position from packing algorithm
                                const horizontalPadding = 0.3; // Small gap between adjacent tasks
                                
                                // Use default color for vacation/OOO tasks, otherwise use category color
                                const isVacationTask = task.name.toLowerCase().includes("vacation") || task.phase?.toUpperCase() === "OOO";
                                const bgColor = isVacationTask ? "#645b56" : (task.categoryHex ? `#${task.categoryHex}` : "var(--task-bg-fallback)");
                                const textColor = isVacationTask ? getTextColor("645b56") : getTextColor(task.categoryHex);
                                
                                // Check if task extends beyond visible timeline
                                const taskStartsBeforeView = task.startDate < periodStart;
                                const taskEndsAfterView = task.endDate > periodEnd;
                                
                                return (
                                  <div
                                    key={task.id}
                                    className="task-bar"
                                    draggable
                                    aria-pressed={selectedTimelineTaskId === task.id}
                                    onDragStart={() => handleDragStart(task.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(task.id)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => toggleTimelineTaskSelection(task.id)}
                                    title={[
                                      `Task: ${task.name}`,
                                      task.subTask ? `Sub-Task: ${task.subTask}` : '',
                                      task.phase ? `Phase: ${task.phase}` : '',
                                      task.category ? `Category: ${task.category}` : '',
                                      task.owner ? `Owner: ${task.owner}` : '',
                                      `Start: ${format(task.startDate, 'MMM dd, yyyy')}`,
                                      `End: ${format(task.endDate, 'MMM dd, yyyy')}`,
                                      `ID: ${task.displayOrder}`,
                                      '',
                                      `Top: ${top}px`,
                                      debugInfo.get(task.id) || ''
                                    ].filter(Boolean).join('\n')}
                                    style={{
                                      left: `calc(${start}% + ${horizontalPadding}%)`,
                                      width: `calc(${width}% - ${horizontalPadding * 2}%)`,
                                      top: `${top}px`,
                                      backgroundColor: bgColor,
                                      color: textColor,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      cursor: "pointer",
                                      opacity: draggedTask === task.id ? 0.5 : selectedTimelineTaskId !== null && selectedTimelineTaskId !== task.id ? 0.72 : 1,
                                      transition: "opacity 0.2s, box-shadow 0.2s, transform 0.2s",
                                      boxShadow: selectedTimelineTaskId === task.id ? "0 0 0 3px rgba(37, 99, 235, 0.45), 0 0 0 6px rgba(255, 255, 255, 0.9)" : undefined,
                                    }}
                                  >
                                    {taskStartsBeforeView && (
                                      <span style={{ marginLeft: "4px", fontWeight: "bold", fontSize: "1.1em" }}>◀</span>
                                    )}
                                    <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>{task.name}</span>
                                    {taskEndsAfterView && (
                                      <span style={{ marginRight: "4px", fontWeight: "bold", fontSize: "1.1em" }}>▶</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            {view === "calendar" &&
              (() => {
                const visibleTasks = timelineTasks.filter((task) => task.startDate <= calendarGridEnd && task.endDate >= calendarGridStart);
                const visibleCalendarDays = (week: Date[]) => week.filter((day) => showWeekends || !isWeekendDate(day));

                return (
                  <div className="calendar-board">
                    <div className="calendar-helper-text">Calendar view shows tasks on each day they overlap.</div>
                    <div
                      className="calendar-grid calendar-grid-header"
                      style={{ gridTemplateColumns: `repeat(${showWeekends ? 7 : 5}, minmax(0, 1fr))` }}
                    >
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayLabel) => (
                        (!showWeekends && (dayLabel === "Sat" || dayLabel === "Sun")) ? null : (
                        <div key={dayLabel} className="calendar-day-label">
                          {dayLabel}
                        </div>
                        )
                      ))}
                    </div>
                    {calendarWeeks.map((week, weekIndex) => (
                      <div
                        key={`calendar-week-${weekIndex}`}
                        className="calendar-grid"
                        style={{ gridTemplateColumns: `repeat(${showWeekends ? 7 : 5}, minmax(0, 1fr))` }}
                      >
                        {visibleCalendarDays(week).map((day, index, days) => {
                          const tasksForDay = visibleTasks.filter((task) => isTaskVisibleOnDay(task, day));

                          return (
                            <div
                              key={day.toISOString()}
                              className={`calendar-day-cell${isSameMonth(day, currentMonth) ? "" : " calendar-day-cell--outside"}`}
                              style={index === days.length - 1 ? { borderRight: "none" } : undefined}
                            >
                              <div className="calendar-day-number">{format(day, "d")}</div>
                              <div className="calendar-day-tasks">
                                {tasksForDay.map((task) => {
                                  const colorHex = task.categoryHex || task.phaseHex;
                                  const colorValue = colorHex ? `#${colorHex}` : "var(--accent-primary)";
                                  const isSelected = selectedTimelineTaskId === task.id;

                                  return (
                                    <button
                                      key={`${task.id}-${day.toISOString()}`}
                                      type="button"
                                      className={`calendar-task-chip${isSelected ? " calendar-task-chip--selected" : ""}`}
                                      aria-pressed={isSelected}
                                      onClick={() => toggleTimelineTaskSelection(task.id)}
                                      title={[
                                        `Task: ${task.name}`,
                                        task.phase ? `Phase: ${task.phase}` : "",
                                        task.category ? `Category: ${task.category}` : "",
                                        task.owner ? `Owner: ${task.owner}` : "",
                                        `Start: ${format(task.startDate, "MMM dd, yyyy")}`,
                                        `End: ${format(task.endDate, "MMM dd, yyyy")}`,
                                      ].filter(Boolean).join("\n")}
                                      style={{
                                        backgroundColor: blendHexWithWhite(colorHex),
                                        borderColor: colorValue,
                                        color: "var(--text-primary)",
                                        opacity: selectedTimelineTaskId !== null && !isSelected ? 0.78 : 1,
                                      }}
                                    >
                                      <span className="calendar-task-chip-dot" style={{ backgroundColor: colorValue }}></span>
                                      <span className="calendar-task-chip-label">{getCalendarChipLabel(task, day)}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div className="calendar-footer-note">
                      Tasks are saved in this browser only. Export CSV when you need a portable copy or backup.
                    </div>
                  </div>
                );
              })()}
          </div>
        )}

        {/* ==================== LEGENDS ==================== */}

        {/* Category Legend: Shows only categories for visible tasks in the current timeline view */}
        {showTimeline && categories.length > 0 && (() => {
          // Get unique categories from visible tasks
          const visibleCategories = Array.from(new Set(visibleLegendTasks.map(t => t.category).filter(Boolean)));
          if (visibleCategories.length === 0) return null;
          
          return (
            <div style={{ marginTop: "1rem", padding: "15px", backgroundColor: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
              <h4 style={{ margin: "0 0 12px 0", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Category Key:</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                {visibleCategories.map((category) => {
                  const categoryTask = timelineTasks.find((t) => t.category === category);
                  const hexColor = categoryTask?.categoryHex ? `#${categoryTask.categoryHex}` : "var(--color-blue-500)";
                  return (
                    <div key={category} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: hexColor,
                          borderRadius: "4px",
                          border: "2px solid var(--border-overlay-light)",
                          flexShrink: 0,
                        }}
                      ></div>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500, lineHeight: "24px" }}>{category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Phase Legend: Shows all phases with their colors */}
        {showTimeline && showPhaseLabels && visibleLegendPhases.length > 0 && (
          <div style={{ marginTop: "1rem", padding: "15px", backgroundColor: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
            <h4 style={{ margin: "0 0 12px 0", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>Phase Key:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {visibleLegendPhases.map((phase) => {
                return (
                  <div key={phase} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: "var(--color-gray-900)",
                        borderRadius: "4px",
                        border: "2px solid var(--border-overlay-light)",
                        flexShrink: 0,
                      }}
                    ></div>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500, lineHeight: "24px" }}>{phase}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

