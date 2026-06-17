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
 *    - Special priority tasks always appear at the top
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
 *       - Special background bars (category-colored overlay)
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
import { useEffect, useRef, useState, type ReactNode } from "react";

// Third-party component for date selection
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Date utility functions from date-fns library
import { startOfWeek, addDays, format, startOfMonth, endOfMonth, addMonths, getMonth, endOfWeek, eachDayOfInterval, differenceInCalendarDays } from "date-fns";

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

const getTaskDateBounds = (taskList: Task[]) => {
  if (taskList.length === 0) {
    return null;
  }

  const allDates = taskList.flatMap((task) => [task.startDate, task.endDate]);
  const start = new Date(Math.min(...allDates.map((date) => date.getTime())));
  const end = new Date(Math.max(...allDates.map((date) => date.getTime())));

  return {
    start: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
    end: new Date(end.getFullYear(), end.getMonth(), end.getDate()),
  };
};

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

interface TimelineUnit {
  key: string;
  start: Date;
  end: Date;
  label: string;
  title: string;
}

interface TimelineHeaderGroup {
  key: string;
  label: string;
  title: string;
  span: number;
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
  const [view, setView] = useState<"weeks" | "months" | "calendar">("months");

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
  const [sortBy, setSortBy] = useState<"phase" | "phaseHex" | "name" | "category" | "categoryHex" | "startDate" | "endDate" | "displayOrder" | "lineHeightAdjust">("displayOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // UI visibility toggles (kept for potential future use; v2 hides these panels by default)

  // Drag and drop state for reordering tasks
  const [draggedTask, setDraggedTask] = useState<number | null>(null);

  // Toggle between showing week numbers or dates in weekly view
  const [showWeekNumbers, setShowWeekNumbers] = useState(false);
  const [showMonthNumbers, setShowMonthNumbers] = useState(false);
  const [showWeekends, setShowWeekends] = useState(false);
  const [timelineLayout, setTimelineLayout] = useState<"horizontal" | "stacked">("stacked");
  const [monthStackSplit, setMonthStackSplit] = useState<"day" | "week">("day");
  
  // Toggle for showing/hiding phase labels and colors
  const [barColorSource, setBarColorSource] = useState<"category" | "phase">("category");
  const [barLabelSource, setBarLabelSource] = useState<"task" | "category" | "phase">("task");

  // Date range filter for monthly view
  const [useCustomMonthRange, setUseCustomMonthRange] = useState(false);
  const [customMonthStart, setCustomMonthStart] = useState<Date | null>(null);
  const [customMonthEnd, setCustomMonthEnd] = useState<Date | null>(null);
  const [calendarMonthSpan] = useState(2);
  const [useCustomCalendarRange] = useState(false);
  const [customCalendarStart] = useState<Date | null>(null);
  const [customCalendarEnd] = useState<Date | null>(null);

  // v2 layout shell state
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showColorsPanel, setShowColorsPanel] = useState(false);
  const colorsPanelAnchorRef = useRef<HTMLButtonElement>(null);
  const [colorsPanelPos, setColorsPanelPos] = useState<{ top: number; right: number }>({ top: 60, right: 12 });
  const settingsPanelAnchorRef = useRef<HTMLButtonElement>(null);
  const [settingsPanelPos, setSettingsPanelPos] = useState<{ top: number; right: number }>({ top: 60, right: 12 });
  const [taskSettingsDisplayExpanded, setTaskSettingsDisplayExpanded] = useState(true);
  const [taskSettingsPhasesExpanded, setTaskSettingsPhasesExpanded] = useState(false);
  const [taskSettingsCategoriesExpanded, setTaskSettingsCategoriesExpanded] = useState(false);
  const [taskSettingsDangerExpanded, setTaskSettingsDangerExpanded] = useState(true);
  const [settingsRangeModeExpanded, setSettingsRangeModeExpanded] = useState(true);
  const [settingsLayoutExpanded, setSettingsLayoutExpanded] = useState(true);
  const [settingsDisplayExpanded, setSettingsDisplayExpanded] = useState(true);
  const [settingsColorsExpanded, setSettingsColorsExpanded] = useState(true);
  const [settingsDangerExpanded, setSettingsDangerExpanded] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [compactTaskSpacing, setCompactTaskSpacing] = useState(true);
  const [rangeMode, setRangeMode] = useState<"fit" | "range" | "rolling">("fit");

  // N4: Relative timeline mode (Week 1 / Month 1 instead of dates)
  const [useRelativeTimeline, setUseRelativeTimeline] = useState(false);

  // C2: Hex palette management
  const [colorPalette] = useState<string[]>([
    "FF6B6B", "4ECDC4", "45B7D1", "FFA07A", "98D8C8", "F7DC6F", "BB8FCE", "85C1E2",
  ]); // Palette of hex codes without # prefix
  const [categoryColorMap, setCategoryColorMap] = useState<Record<string, string>>({}); // category name -> palette index
  const [phaseHexMap, setPhaseHexMap] = useState<Record<string, string>>({}); // phase name -> hex color
  const [categoryHexMap, setCategoryHexMap] = useState<Record<string, string>>({}); // category name -> hex color
  const [showHexColumns, setShowHexColumns] = useState(true);

  // L1: Presentation mode (hide all controls)
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentationHeaderVisible, setPresentationHeaderVisible] = useState(false);
  const presentationHeaderTimeoutRef = useRef<number | null>(null);

  // Compute unique phases and categories from tasks
  const phases = Array.from(new Set(tasks.map((t) => t.phase).filter(Boolean))) as string[];
  const categories = Array.from(new Set(tasks.map((t) => t.category).filter(Boolean))) as string[];

  useEffect(() => {
    try {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore storage write failures so task editing still works in restricted browsers.
    }
  }, [tasks]);

  // L1: Keyboard shortcut for presentation mode (Ctrl/Cmd+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setPresentationMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // L1: Close all panels when entering presentation mode
  useEffect(() => {
    if (presentationMode) {
      setShowSettingsPanel(false);
      setShowImportModal(false);
      setShowTaskPanel(false);
    }
  }, [presentationMode]);

  useEffect(() => {
    const clearPresentationHeaderTimeout = () => {
      if (presentationHeaderTimeoutRef.current !== null) {
        window.clearTimeout(presentationHeaderTimeoutRef.current);
        presentationHeaderTimeoutRef.current = null;
      }
    };

    if (!presentationMode) {
      clearPresentationHeaderTimeout();
      setPresentationHeaderVisible(false);
      return;
    }

    const showPresentationHeader = () => {
      setPresentationHeaderVisible(true);
      clearPresentationHeaderTimeout();
      presentationHeaderTimeoutRef.current = window.setTimeout(() => {
        setPresentationHeaderVisible(false);
      }, 2000);
    };

    showPresentationHeader();
    window.addEventListener("pointermove", showPresentationHeader);

    return () => {
      clearPresentationHeaderTimeout();
      window.removeEventListener("pointermove", showPresentationHeader);
    };
  }, [presentationMode]);

  useEffect(() => {
    // Weekly view: keep "fit to data" reactive, mirroring monthly. When tasks
    // change (e.g. a task is added outside the current span), re-fit the weekly
    // range so nothing ends up off-screen. Other weekly range modes are driven
    // by the Range-mode dropdown and manual navigation, so do nothing here.
    if (view === "weeks") {
      if (rangeMode !== "fit") {
        return;
      }
      const bounds = getTaskDateBounds(tasks);
      if (!bounds) {
        return;
      }
      const weekStart = startOfWeek(bounds.start);
      setCurrentWeek(weekStart);
      setWeekSpan(
        Math.max(
          1,
          Math.ceil((bounds.end.getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
        )
      );
      return;
    }

    if (view !== "months") {
      return;
    }

    if (rangeMode === "rolling") {
      setUseCustomMonthRange(false);
      setCustomMonthStart(null);
      setCustomMonthEnd(null);
      return;
    }

    const bounds = getTaskDateBounds(tasks);

    if (!bounds) {
      if (rangeMode === "fit") {
        setUseCustomMonthRange(false);
        setCustomMonthStart(null);
        setCustomMonthEnd(null);
      }
      return;
    }

    setUseCustomMonthRange(true);

    if (rangeMode === "fit") {
      setCustomMonthStart(bounds.start);
      setCustomMonthEnd(bounds.end);
      return;
    }

    setCustomMonthStart((currentStart) => currentStart ?? bounds.start);
    setCustomMonthEnd((currentEnd) => currentEnd ?? bounds.end);
  }, [rangeMode, tasks, view]);

  useEffect(() => {
    if (editingTaskId !== null && !tasks.some((task) => task.id === editingTaskId)) {
      setEditingTaskId(null);
    }
  }, [editingTaskId, tasks]);

  // ==================== TASK MANAGEMENT FUNCTIONS ====================

  /**
   * Adds a new empty task to the task list
   * Generates unique ID and display order
   */
  const addTask = () => {
    const { newId, newDisplayOrder } = getNextTaskIdentity();
    setTasks((prev) => [
      ...prev,
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
    setEditingTaskId(newId);
    setShowTaskPanel(true);
  };

  const addTestTask = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    const newDisplayOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.displayOrder || 0)) + 1 : 1;
    setTasks([
      ...tasks,
      {
        id: newId,
        phase: "Test Phase",
        phaseHex: "007acc",
        category: "Test Category",
        categoryHex: "007acc",
        name: "Test Task",
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        displayOrder: newDisplayOrder,
      },
    ]);
  };

  const getNextTaskIdentity = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
    const newDisplayOrder = tasks.length > 0 ? Math.max(...tasks.map((task) => task.displayOrder || 0)) + 1 : 1;
    return { newId, newDisplayOrder };
  };

  /**
   * Updates a specific field of a task
   * @param id - Task ID to update
   * @param field - Field name to update
   * @param value - New value for the field
   */
  const updateTask = (id: number, field: keyof Task, value: Date | string | number) => {
    // Functional updater: callers like the Colors panel invoke this in a loop
    // over many tasks within one event handler. React batches those calls, so a
    // closure-captured `tasks` snapshot would make every call but the last lose
    // its change. Reading `prev` composes the updates correctly.
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const updateTaskFields = (id: number, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
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

  const duplicateTask = (task: Task) => {
    const { newId, newDisplayOrder } = getNextTaskIdentity();
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        id: newId,
        displayOrder: newDisplayOrder,
      },
    ]);
  };

  const openTaskEditor = (taskId: number) => {
    setEditingTaskId(taskId);
    setShowTaskPanel(true);
  };

  const closeTaskEditor = () => {
    setEditingTaskId(null);
  };

  const stepTaskEditor = (direction: -1 | 1) => {
    const currentIndex = filteredAndSortedTasks.findIndex((task) => task.id === editingTaskId);
    if (currentIndex === -1) {
      return;
    }

    const nextTask = filteredAndSortedTasks[currentIndex + direction];
    if (nextTask) {
      setEditingTaskId(nextTask.id);
    }
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

    const parseImportedDate = (value: string) => {
      const dateParts = value.split("/");
      if (dateParts.length === 3) {
        const [month, day, year] = dateParts;
        const parsedYear = parseInt(year, 10);
        const normalizedYear = year.trim().length === 2 ? 2000 + parsedYear : parsedYear;
        return new Date(normalizedYear, parseInt(month, 10) - 1, parseInt(day, 10));
      }

      return new Date(value);
    };

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
              taskData.startDate = parseImportedDate(value);
            } else {
              taskData.startDate = new Date();
            }
            break;
          case "date end":
          case "end date":
          case "end":
            if (value) {
              // Try to parse MM/DD/YYYY format
              taskData.endDate = parseImportedDate(value);
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
          case "display order":
          case "order":
          case "sort order": {
            // Preserve manual ordering on CSV round-trip; blank/invalid falls
            // through to the running counter below (I3: stay forgiving).
            const parsedOrder = value ? parseInt(value, 10) : NaN;
            if (!Number.isNaN(parsedOrder)) {
              taskData.displayOrder = parsedOrder;
            }
            break;
          }
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
          displayOrder: typeof taskData.displayOrder === "number" ? taskData.displayOrder : nextDisplayOrder++,
          lineHeightAdjust: typeof taskData.lineHeightAdjust === "number" ? taskData.lineHeightAdjust : 0,
        };
        newTasks.push(newTask);
      }
    });

    const finalTasks = newTasks;

    // C2: Auto-assign categories to palette colors
    const newCategories = new Set(finalTasks.map((t) => t.category).filter(Boolean));
    const updatedMap = { ...categoryColorMap };
    let nextPaletteIndex = Object.keys(updatedMap).length;

    newCategories.forEach((category) => {
      if (category && !updatedMap[category]) {
        updatedMap[category] = String(nextPaletteIndex % colorPalette.length);
        nextPaletteIndex += 1;
      }
    });

    if (Object.keys(updatedMap).length > Object.keys(categoryColorMap).length) {
      setCategoryColorMap(updatedMap);
    }

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

  const getRelativeWeekNumberFromAnchor = (date: Date, anchorDate: Date) => {
    const anchorWeek = startOfWeek(anchorDate);
    const targetWeek = startOfWeek(date);

    return Math.round((targetWeek.getTime() - anchorWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  };

  const getRelativeMonthNumber = (date: Date, taskList: Task[]) => {
    if (taskList.length === 0) return 1;

    const firstTaskDate = new Date(Math.min(...taskList.map((task) => task.startDate.getTime())));
    const firstTaskMonth = startOfMonth(firstTaskDate);
    const targetMonth = startOfMonth(date);

    return (targetMonth.getFullYear() - firstTaskMonth.getFullYear()) * 12
      + (getMonth(targetMonth) - getMonth(firstTaskMonth))
      + 1;
  };

  const formatCompactMonthRange = (start: Date, end: Date) => {
    const sameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth();

    if (sameMonth) {
      return `${format(start, "MMM d")} – ${end.getDate()}`;
    }

    return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
  };

  const getWeeklyPeriodEnd = () => addDays(currentWeek, weekSpan * 7 - 1);

  const isWeekendDate = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getVisibleWeekDays = (weekStart: Date) =>
    Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)).filter((date) => showWeekends || !isWeekendDate(date));

  const getVisibleMonthDays = (monthStart: Date) =>
    eachDayOfInterval({ start: startOfMonth(monthStart), end: endOfMonth(monthStart) })
      .filter((date) => showWeekends || !isWeekendDate(date));

  const getDayTimelineUnits = (days: Date[]): TimelineUnit[] =>
    days.map((day) => ({
      key: day.toISOString(),
      start: normalizeDate(day),
      end: normalizeDate(day),
      label: format(day, "EEE d"),
      title: format(day, "MMM dd, yyyy"),
    }));

  const getOwnedWeekDayUnitsForMonth = (monthStart: Date): TimelineUnit[] => {
    const normalizedMonthStart = normalizeDate(startOfMonth(monthStart));
    const normalizedMonthEnd = normalizeDate(endOfMonth(monthStart));
    const units: TimelineUnit[] = [];

    for (
      let cursor = startOfWeek(normalizedMonthStart);
      normalizeDate(cursor).getTime() <= normalizedMonthEnd.getTime();
      cursor = addDays(cursor, 7)
    ) {
      const weekStart = normalizeDate(cursor);
      const ownedVisibleDays = getVisibleWeekDays(weekStart).filter((day) => {
        const normalizedDay = normalizeDate(day).getTime();
        return normalizedDay >= normalizedMonthStart.getTime() && normalizedDay <= normalizedMonthEnd.getTime();
      });

      ownedVisibleDays.forEach((day) => {
        units.push({
          key: `${monthStart.toISOString()}-${day.toISOString()}`,
          start: normalizeDate(day),
          end: normalizeDate(day),
          label: format(day, "EEE d"),
          title: format(day, "MMM dd, yyyy"),
        });
      });
    }

    return units;
  };

  const getWeekHeaderGroupsForUnits = (units: TimelineUnit[]): TimelineHeaderGroup[] => {
    const groups: TimelineHeaderGroup[] = [];

    units.forEach((unit) => {
      const weekKey = startOfWeek(unit.start).toISOString();
      const existingGroup = groups[groups.length - 1];

      if (!existingGroup || existingGroup.key !== weekKey) {
        groups.push({
          key: weekKey,
          label: "",
          title: "",
          span: 1,
        });
        return;
      }

      existingGroup.span += 1;
    });

    return groups.map((group) => {
      const groupUnits = units.filter((unit) => startOfWeek(unit.start).toISOString() === group.key);
      const firstUnit = groupUnits[0];
      const lastUnit = groupUnits[groupUnits.length - 1];
      const isSingleDay = firstUnit.start.getTime() === lastUnit.start.getTime();
      const sameMonth = firstUnit.start.getMonth() === lastUnit.start.getMonth()
        && firstUnit.start.getFullYear() === lastUnit.start.getFullYear();

      return {
        ...group,
        label: isSingleDay
          ? format(firstUnit.start, "MMM d")
          : sameMonth
            ? `${format(firstUnit.start, "MMM d")} - ${format(lastUnit.start, "d")}`
            : `${format(firstUnit.start, "MMM d")} - ${format(lastUnit.start, "MMM d")}`,
        title: isSingleDay
          ? format(firstUnit.start, "MMM dd, yyyy")
          : `${format(firstUnit.start, "MMM dd, yyyy")} - ${format(lastUnit.start, "MMM dd, yyyy")}`,
      };
    });
  };

  const getWeekHeaderGroupsForDays = (days: Date[]): TimelineHeaderGroup[] => {
    const groups: TimelineHeaderGroup[] = [];

    days.forEach((day) => {
      const weekKey = startOfWeek(day).toISOString();
      const existingGroup = groups[groups.length - 1];

      if (!existingGroup || existingGroup.key !== weekKey) {
        groups.push({
          key: weekKey,
          label: "",
          title: "",
          span: 1,
        });
        return;
      }

      existingGroup.span += 1;
    });

    return groups.map((group, index) => {
      const groupDays = days.filter((day) => startOfWeek(day).toISOString() === group.key);
      const firstDay = groupDays[0];
      const lastDay = groupDays[groupDays.length - 1];

      return {
        ...group,
        label: `Week ${index + 1}`,
        title: `${format(firstDay, "MMM dd, yyyy")} - ${format(lastDay, "MMM dd, yyyy")}`,
      };
    });
  };

  const getTaskPositionForUnits = (
    task: Task,
    units: TimelineUnit[],
    periodStart: Date,
    periodEnd: Date,
  ) => {
    const totalUnits = units.length;

    if (totalUnits === 0) return null;

    const taskStartInPeriod = normalizeDate(task.startDate > periodStart ? task.startDate : periodStart).getTime();
    const taskEndInPeriod = normalizeDate(task.endDate < periodEnd ? task.endDate : periodEnd).getTime();

    const startOffset = units.findIndex((unit) => unit.end.getTime() >= taskStartInPeriod);
    let endOffset = -1;

    for (let index = units.length - 1; index >= 0; index -= 1) {
      if (units[index].start.getTime() <= taskEndInPeriod) {
        endOffset = index;
        break;
      }
    }

    if (startOffset === -1 || endOffset === -1 || startOffset > endOffset) {
      return null;
    }

    const start = (startOffset / totalUnits) * 100;
    const width = ((endOffset - startOffset + 1) / totalUnits) * 100;

    return { start, width, startIndex: startOffset, endIndex: endOffset };
  };

  const getTaskPositionForVisibleDays = (
    task: Task,
    visibleDays: Date[],
    periodStart: Date,
    periodEnd: Date,
  ) => getTaskPositionForUnits(task, getDayTimelineUnits(visibleDays), periodStart, periodEnd);

  // ==================== COLUMN GENERATION ====================

  // Generate array of start dates for each week column
  const weekColumns = Array.from({ length: weekSpan }, (_, i) => addDays(currentWeek, i * 7));
  const visibleWeekColumns = weekColumns.map((weekStart) => getVisibleWeekDays(weekStart));
  const visibleWeeklyDays = visibleWeekColumns.flat();

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
      const searchHex = searchLower.replace(/^#/, "");
      const matchesText = (value?: string) => Boolean(value && value.toLowerCase().includes(searchLower));
      const matchesHex = (value?: string) => Boolean(value && value.replace(/^#/, "").toLowerCase().includes(searchHex));
      filtered = filtered.filter(
        (task) =>
          matchesText(task.name) ||
          matchesText(task.phase) ||
          matchesText(task.category) ||
          matchesText(task.subTask) ||
          matchesText(task.owner) ||
          matchesText(task.phaseHex) ||
          matchesText(task.categoryHex) ||
          matchesHex(task.phaseHex) ||
          matchesHex(task.categoryHex)
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
        case "phaseHex":
          comparison = (a.phaseHex || "").localeCompare(b.phaseHex || "");
          break;
        case "categoryHex":
          comparison = (a.categoryHex || "").localeCompare(b.categoryHex || "");
          break;
        case "lineHeightAdjust":
          comparison = (a.lineHeightAdjust ?? 0) - (b.lineHeightAdjust ?? 0);
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
  const editingTask = editingTaskId === null ? null : tasks.find((task) => task.id === editingTaskId) ?? null;
  const editingTaskIndex = editingTask === null
    ? -1
    : filteredAndSortedTasks.findIndex((task) => task.id === editingTask.id);
  const calendarPeriodStart = useCustomCalendarRange && customCalendarStart
    ? customCalendarStart
    : startOfMonth(currentMonth);
  const calendarPeriodEnd = useCustomCalendarRange && customCalendarEnd
    ? customCalendarEnd
    : endOfMonth(addMonths(currentMonth, calendarMonthSpan - 1));
  const calendarGridStart = startOfWeek(calendarPeriodStart);
  const calendarGridEnd = endOfWeek(calendarPeriodEnd);
  const calendarDays = eachDayOfInterval({ start: calendarGridStart, end: calendarGridEnd });
  const calendarWeeks = Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, index) => calendarDays.slice(index * 7, index * 7 + 7));
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

  const isSpecialPriorityTask = (task: Task) => {
    const phase = (task.phase || "").trim().toLowerCase();
    const category = (task.category || "").trim().toLowerCase();

    return ["vacation", "holiday", "ooo"].some((keyword) => phase.includes(keyword) || category.includes(keyword));
  };

  const getTaskBarColorHex = (task: Task) => {
    if (barColorSource === "phase") {
      return task.phaseHex;
    }
    // For category: check if category is mapped to palette, fall back to explicit categoryHex
    if (task.category && categoryColorMap[task.category]) {
      const paletteIndex = parseInt(categoryColorMap[task.category], 10);
      if (paletteIndex >= 0 && paletteIndex < colorPalette.length) {
        return colorPalette[paletteIndex];
      }
    }
    return task.categoryHex;
  };

  const getTaskBarColorValue = (task: Task) => {
    const colorHex = getTaskBarColorHex(task);
    return colorHex ? `#${colorHex.replace(/^#/, "")}` : "var(--task-bg-fallback)";
  };

  const getTaskBarText = (task: Task) => {
    if (barLabelSource === "phase") {
      return task.phase || task.name;
    }

    if (barLabelSource === "category") {
      return task.category || task.name;
    }

    return task.name;
  };

  const getColorKeyLabel = () => (barColorSource === "phase" ? "Phase Key:" : "Category Key:");

  const getColorKeyValue = (task: Task) => (barColorSource === "phase" ? task.phase : task.category);

  const getTaskVerticalLayout = ({
    sortedTasks,
    getPosition,
    taskHeights,
    topPadding,
    compactRows,
  }: {
    sortedTasks: Task[];
    getPosition: (task: Task) => { start: number; width: number } | null;
    taskHeights: Map<number, number>;
    topPadding: number;
    compactRows: boolean;
  }) => {
    const taskPositions = new Map<number, number>();
    const occupiedRanges: Array<{ start: number; end: number; top: number; bottom: number }> = [];
    let nextRowTop = topPadding;

    sortedTasks.forEach((task) => {
      const position = getPosition(task);
      if (!position) return;

      const taskHeight = taskHeights.get(task.id) || 30;
      const horizontalPadding = 0.3;
      const taskStart = position.start + horizontalPadding;
      const taskEnd = position.start + position.width - horizontalPadding;
      let bestTop = nextRowTop;

      if (compactRows) {
        bestTop = topPadding;

        for (const occupied of occupiedRanges) {
          const tolerance = 0.1;
          const horizontalOverlap = !(taskEnd <= occupied.start + tolerance || taskStart >= occupied.end - tolerance);

          if (horizontalOverlap) {
            bestTop = Math.max(bestTop, occupied.bottom);
          }
        }
      } else {
        nextRowTop += taskHeight;
      }

      taskPositions.set(task.id, bestTop);
      occupiedRanges.push({
        start: taskStart,
        end: taskEnd,
        top: bestTop,
        bottom: bestTop + taskHeight,
      });
    });

    let totalHeight = 0;
    occupiedRanges.forEach((range) => {
      totalHeight = Math.max(totalHeight, range.bottom);
    });

    return { taskPositions, occupiedRanges, totalHeight };
  };

  const getSpecialPriorityColumnColors = (
    taskList: Task[],
    columns: Array<{ start: Date; end: Date }>,
    ratio = 0.78,
  ) => {
    const columnColors = new Map<number, string>();

    taskList
      .filter((task) => isSpecialPriorityTask(task))
      .forEach((task) => {
        const taskStart = normalizeDate(task.startDate).getTime();
        const taskEnd = normalizeDate(task.endDate).getTime();

        columns.forEach((column, index) => {
          if (columnColors.has(index)) {
            return;
          }

          const columnStart = normalizeDate(column.start).getTime();
          const columnEnd = normalizeDate(column.end).getTime();

          if (taskStart <= columnEnd && taskEnd >= columnStart) {
            columnColors.set(index, blendHexWithWhite(getTaskBarColorHex(task), ratio));
          }
        });
      });

    return columnColors;
  };

  const getCalendarChipLabel = (task: Task, day: Date) => {
    const label = getTaskBarText(task);
    const isStartDay = normalizeDate(task.startDate).getTime() === normalizeDate(day).getTime();
    if (isStartDay) {
      return label;
    }

    const taskStartsThisWeek = startOfWeek(task.startDate).getTime() === startOfWeek(day).getTime();
    return taskStartsThisWeek ? label : `${label} (cont.)`;
  };

  const isCalendarDayInRange = (day: Date) => {
    const normalizedDay = normalizeDate(day).getTime();
    return normalizedDay >= normalizeDate(calendarPeriodStart).getTime()
      && normalizedDay <= normalizeDate(calendarPeriodEnd).getTime();
  };

  const getCalendarDayLabel = (day: Date) => {
    const normalizedDay = normalizeDate(day).getTime();
    const normalizedStart = normalizeDate(calendarPeriodStart).getTime();
    return day.getDate() === 1 || normalizedDay === normalizedStart ? format(day, "MMM d") : format(day, "d");
  };

  const getPreviousVisibleCalendarDay = (day: Date) => {
    const gridStartTime = normalizeDate(calendarGridStart).getTime();
    let candidate = addDays(day, -1);

    while (normalizeDate(candidate).getTime() >= gridStartTime) {
      if (showWeekends || !isWeekendDate(candidate)) {
        return candidate;
      }
      candidate = addDays(candidate, -1);
    }

    return null;
  };

  const isCalendarMonthStartDay = (day: Date) => {
    const normalizedDay = normalizeDate(day).getTime();
    const normalizedStart = normalizeDate(calendarPeriodStart).getTime();
    if (day.getDate() === 1 || normalizedDay === normalizedStart) {
      return true;
    }

    const previousVisibleDay = getPreviousVisibleCalendarDay(day);
    if (!previousVisibleDay) {
      return false;
    }

    return previousVisibleDay.getMonth() !== day.getMonth()
      || previousVisibleDay.getFullYear() !== day.getFullYear();
  };

  const getCalendarWeekTaskSegments = (week: Date[]) => {
    const visibleDays = week.filter((day) => showWeekends || !isWeekendDate(day));
    const normalizedVisibleDays = visibleDays.map((day) => normalizeDate(day).getTime());

    const segments = timelineTasks
      .map((task) => {
        const normalizedStart = normalizeDate(task.startDate).getTime();
        const normalizedEnd = normalizeDate(task.endDate).getTime();

        const startIndex = normalizedVisibleDays.findIndex((dayTime) => dayTime >= normalizedStart);
        let endIndex = -1;

        for (let index = normalizedVisibleDays.length - 1; index >= 0; index -= 1) {
          if (normalizedVisibleDays[index] <= normalizedEnd) {
            endIndex = index;
            break;
          }
        }

        if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
          return null;
        }

        return {
          task,
          startIndex,
          endIndex,
        };
      })
      .filter((segment): segment is { task: Task; startIndex: number; endIndex: number } => segment !== null)
      .sort((a, b) => (a.task.displayOrder || 0) - (b.task.displayOrder || 0));

    const occupiedLanes: Array<Array<{ startIndex: number; endIndex: number }>> = [];

    return segments.map((segment) => {
      let lane = 0;

      while (true) {
        const laneSegments = occupiedLanes[lane] || [];
        const overlapsExisting = laneSegments.some(
          (existing) => !(segment.endIndex < existing.startIndex || segment.startIndex > existing.endIndex)
        );

        if (!overlapsExisting) {
          laneSegments.push({ startIndex: segment.startIndex, endIndex: segment.endIndex });
          occupiedLanes[lane] = laneSegments;
          return {
            ...segment,
            lane,
          };
        }

        lane += 1;
      }
    });
  };

  const getTaskHeightForPeriod = (task: Task, widthPercent: number, addSafetyLine: boolean) => {
    const actualWidth = (widthPercent / 100) * 1800;
    const textWidth = actualWidth - 16;
    const charsPerLine = Math.max(1, Math.floor(textWidth / 7.2));
    const words = task.name.split(" ");
    let lines = 1;
    let currentLineLength = 0;

    words.forEach((word) => {
      const wordLength = word.length;
      if (currentLineLength === 0) {
        currentLineLength = wordLength;
      } else if (currentLineLength + 1 + wordLength <= charsPerLine) {
        currentLineLength += 1 + wordLength;
      } else {
        lines += 1;
        currentLineLength = wordLength;
      }
    });

    if (addSafetyLine && currentLineLength > charsPerLine * 0.85) {
      lines += 1;
    }

    let height;
    if (lines === 1) {
      height = 36;
    } else if (lines === 2) {
      height = 50;
    } else {
      height = 50 + (lines - 2) * 16;
    }

    height += (task.lineHeightAdjust ?? 0) * 16;

    return Math.max(28, height);
  };

  const renderStackedTimelineBoard = ({
    periodKey,
    title,
    units,
    periodStart,
    periodEnd,
    visibleTasks,
    compactSpacing = false,
    compactHeaderPadding = false,
    compactTaskSpacing = false,
    headerGroups,
    showInnerUnitGridlines = true,
  }: {
    periodKey: string;
    title: ReactNode;
    units: TimelineUnit[];
    periodStart: Date;
    periodEnd: Date;
    visibleTasks: Task[];
    compactSpacing?: boolean;
    compactHeaderPadding?: boolean;
    compactTaskSpacing?: boolean;
    headerGroups?: TimelineHeaderGroup[];
    showInnerUnitGridlines?: boolean;
  }) => {
    if (units.length === 0) {
      return null;
    }

    const getPosition = (task: Task) => getTaskPositionForUnits(task, units, periodStart, periodEnd);

    return (
      <div key={periodKey} className={`stacked-period-card${compactSpacing ? " stacked-period-card--compact" : ""}`}>
        <div className="stacked-period-title">{title}</div>
        <div
          className="stacked-period-board-scroll"
          style={{ overflowX: units.length > 12 ? "auto" : "visible" }}
        >
          <div
            className="board"
            style={{
              minWidth: units.length > 12 ? `${Math.max(units.length * 52, 760)}px` : undefined,
            }}
          >
            <div
              className="board-header"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${units.length}, minmax(0, 1fr))`,
              }}
            >
              {headerGroups
                ? headerGroups.map((group, index) => (
                  <div
                    key={`${periodKey}-header-group-${group.key}`}
                    className={`day-header${compactHeaderPadding ? " day-header--compact" : ""}`}
                    style={{
                      gridColumn: `span ${group.span}`,
                      borderRight: index < headerGroups.length - 1 ? "1px solid var(--border-dark)" : "none",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                    title={group.title}
                  >
                    ({group.label})
                  </div>
                ))
                : units.map((unit, index) => {
                  const nextUnit = units[index + 1];
                  const isWeekendGap = nextUnit ? differenceInCalendarDays(nextUnit.start, unit.start) > 1 : false;

                  // N4: Compute relative label if timeline mode enabled
                  const displayLabel = useRelativeTimeline
                    ? periodKey === "week"
                      ? `W${index + 1}`
                      : `M${index + 1}`
                    : unit.label;

                  return (
                    <div
                      key={`${periodKey}-header-${unit.key}`}
                      className={`day-header${compactHeaderPadding ? " day-header--compact" : ""}`}
                      style={{
                        borderRight: index === units.length - 1
                          ? "none"
                          : isWeekendGap
                            ? "4px solid var(--border-dark)"
                            : "1px solid var(--border-dark)",
                      }}
                      title={unit.title}
                    >
                      {displayLabel}
                    </div>
                  );
                })}
            </div>

            {(() => {
              const phaseTasks = visibleTasks;

              if (phaseTasks.length === 0) {
                return null;
              }

              const taskHeights = new Map<number, number>();
              phaseTasks.forEach((task) => {
                const position = getPosition(task);
                if (!position) return;
                const baseHeight = getTaskHeightForPeriod(task, position.width, true);
                taskHeights.set(task.id, compactTaskSpacing ? Math.max(24, baseHeight - 4) : baseHeight);
              });

              const sortedPhaseTasks = [...phaseTasks].sort((a, b) => {
                const aIsVacation = isSpecialPriorityTask(a);
                const bIsVacation = isSpecialPriorityTask(b);

                if (aIsVacation && !bIsVacation) return -1;
                if (!aIsVacation && bIsVacation) return 1;

                return (a.displayOrder || 0) - (b.displayOrder || 0);
              });

              const phaseTopPadding = compactTaskSpacing ? 4 : 8;
              const {
                taskPositions: phaseTaskPositions,
                totalHeight: phaseTotalHeight,
              } = getTaskVerticalLayout({
                sortedTasks: sortedPhaseTasks,
                getPosition,
                taskHeights,
                topPadding: phaseTopPadding,
                compactRows: compactTaskSpacing,
              });
              const specialPriorityColumnColors = new Map<number, string>();

              phaseTasks
                .filter((task) => isSpecialPriorityTask(task))
                .forEach((task) => {
                  units.forEach((unit, index) => {
                    const unitStart = normalizeDate(unit.start).getTime();
                    const unitEnd = normalizeDate(unit.end).getTime();
                    const taskStart = normalizeDate(task.startDate).getTime();
                    const taskEnd = normalizeDate(task.endDate).getTime();

                    if (taskStart <= unitEnd && taskEnd >= unitStart && !specialPriorityColumnColors.has(index)) {
                      specialPriorityColumnColors.set(index, blendHexWithWhite(task.categoryHex, 0.78));
                    }
                  });
                });

              return (
                <div key={`${periodKey}-board`} style={{ position: "relative" }}>
                  <div style={{ position: "relative", minHeight: `${Math.max(compactTaskSpacing ? 28 : 40, phaseTotalHeight + (compactTaskSpacing ? 2 : 0))}px` }}>
                    <div
                      style={{
                        width: "100%",
                        position: "relative",
                        display: "grid",
                        gridTemplateColumns: `repeat(${units.length}, minmax(0, 1fr))`,
                        backgroundColor: "var(--bg-primary)",
                        minHeight: `${Math.max(compactTaskSpacing ? 28 : 40, phaseTotalHeight + (compactTaskSpacing ? 2 : 0))}px`,
                        borderBottom: "1px solid var(--border-medium)",
                      }}
                    >
                      {units.map((_, index) => {
                        const nextUnit = units[index + 1];
                        const isWeekBoundary = nextUnit
                          ? startOfWeek(units[index].start).getTime() !== startOfWeek(nextUnit.start).getTime()
                          : false;
                        const isWeekendGap = nextUnit
                          ? differenceInCalendarDays(nextUnit.start, units[index].start) > 1
                          : false;
                        const borderRight = index === units.length - 1
                          ? "none"
                          : isWeekendGap
                            ? "4px solid var(--border-dark)"
                            : showInnerUnitGridlines
                              ? "1px solid var(--border-medium)"
                              : isWeekBoundary
                                ? "1px solid var(--border-medium)"
                                : "none";

                        return (
                          <div
                            key={`${periodKey}-day-cell-${index}`}
                            className="day-cell"
                            style={{
                              borderRight,
                              backgroundColor: specialPriorityColumnColors.get(index),
                            }}
                          />
                        );
                      })}

                      {phaseTasks.map((task) => {
                        const position = getPosition(task);
                        if (!position) return null;

                        const top = phaseTaskPositions.get(task.id) || 0;
                        const horizontalPadding = 0.3;
                        const bgColor = getTaskBarColorValue(task);
                        const textColor = getTextColor(getTaskBarColorHex(task));
                        const taskStartsBeforeView = task.startDate < periodStart;
                        const taskEndsAfterView = task.endDate > periodEnd;
                        const labelPaddingLeft = taskStartsBeforeView ? "6px" : "0";
                        const labelPaddingRight = taskEndsAfterView ? "6px" : "0";

                        return (
                          <div
                            key={`${periodKey}-task-${task.id}`}
                            className="task-bar"
                            draggable
                            aria-pressed={selectedTimelineTaskId === task.id}
                            onDragStart={() => handleDragStart(task.id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(task.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => toggleTimelineTaskSelection(task.id)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              openTaskEditor(task.id);
                            }}
                            title={[
                              `Task: ${task.name}`,
                              task.subTask ? `Sub-Task: ${task.subTask}` : "",
                              task.phase ? `Phase: ${task.phase}` : "",
                              task.category ? `Category: ${task.category}` : "",
                              task.owner ? `Owner: ${task.owner}` : "",
                              `Start: ${format(task.startDate, "MMM dd, yyyy")}`,
                              `End: ${format(task.endDate, "MMM dd, yyyy")}`,
                              `ID: ${task.displayOrder}`,
                            ].filter(Boolean).join("\n")}
                            style={{
                              left: `calc(${position.start}% + ${horizontalPadding}%)`,
                              width: `calc(${position.width}% - ${horizontalPadding * 2}%)`,
                              top: `${top}px`,
                              backgroundColor: bgColor,
                              color: textColor,
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              opacity: draggedTask === task.id ? 0.5 : selectedTimelineTaskId !== null && selectedTimelineTaskId !== task.id ? 0.72 : 1,
                              transition: "opacity 0.2s, box-shadow 0.2s, transform 0.2s",
                              boxShadow: selectedTimelineTaskId === task.id ? "0 0 0 3px rgba(37, 99, 235, 0.45), 0 0 0 6px rgba(255, 255, 255, 0.9)" : undefined,
                            }}
                          >
                            {taskStartsBeforeView ? (
                              <span style={{ marginLeft: "4px", fontWeight: "bold", fontSize: "1.1em" }}>◀</span>
                            ) : null}
                            <span
                              style={{
                                flex: 1,
                                minWidth: 0,
                                textAlign: "center",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "normal",
                                paddingLeft: labelPaddingLeft,
                                paddingRight: labelPaddingRight,
                              }}
                            >
                              {getTaskBarText(task)}
                            </span>
                            {taskEndsAfterView ? (
                              <span style={{ marginRight: "4px", fontWeight: "bold", fontSize: "1.1em" }}>▶</span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  // ==================== RENDER ====================

  const activeTab = view === "weeks" ? "weekly" : "monthly";

  return (
    <div className="app">

      {/* ─── v2 HEADER ─── */}
      <header
        className={`v2-header${presentationMode ? " v2-header--presentation" : ""}${
          presentationMode && !presentationHeaderVisible ? " v2-header--hidden" : ""
        }`}
      >
          <span className="v2-logo">Roadmap</span>
          {presentationMode ? (
            <div className="v2-presentation-indicator">
              Presentation mode. Press Ctrl/Cmd+P or the screen button to exit.
            </div>
          ) : (
            <div className="v2-view-tabs">
              <button
                className={`v2-tab${activeTab === "weekly" ? " active" : ""}`}
                onClick={() => setView("weeks")}
              >
                Weekly
              </button>
              <button
                className={`v2-tab${activeTab === "monthly" ? " active" : ""}`}
                onClick={() => setView("months")}
              >
                Monthly
              </button>
            </div>
          )}
          <div className="v2-header-actions">
            {!presentationMode && (
              <>
                <button
                  className="v2-btn v2-btn-ghost"
                  onClick={() => { setShowImportModal(true); setShowSettingsPanel(false); }}
                >
                  Import
                </button>
                <button className="v2-btn v2-btn-dark" onClick={exportTasks}>
                  Export CSV
                </button>
              </>
            )}
            <button
              className={`v2-btn v2-btn-ghost${presentationMode ? "" : " v2-btn-icon"}`}
              onClick={() => setPresentationMode((prev) => !prev)}
              title={presentationMode ? "Exit presentation mode (Ctrl+P)" : "Presentation mode (Ctrl+P)"}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              {presentationMode && <span style={{ marginLeft: "8px" }}>Exit Presentation</span>}
            </button>
            {!presentationMode && (
              <button
                ref={settingsPanelAnchorRef}
                className={`v2-btn v2-btn-ghost v2-btn-icon${showSettingsPanel ? " v2-btn-active" : ""}`}
                onClick={() => {
                  const rect = settingsPanelAnchorRef.current?.getBoundingClientRect();
                  if (rect) {
                    setSettingsPanelPos({
                      top: rect.bottom + 6,
                      right: window.innerWidth - rect.right,
                    });
                  }
                  setShowSettingsPanel((p) => !p);
                }}
                title="Settings"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
            )}
          </div>
      </header>

      {/* ─── SETTINGS PANEL ─── */}
      {!presentationMode && showSettingsPanel && (
        <>
          <div className="v2-settings-backdrop" onClick={() => setShowSettingsPanel(false)} />
          <div className="v2-settings-panel" style={{ position: "fixed", top: settingsPanelPos.top, right: settingsPanelPos.right, zIndex: 1001 }}>

            {/* Range mode (N1) */}
            <div className="v2-settings-section">
              <div className="v2-settings-heading" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }} onClick={() => setSettingsRangeModeExpanded(p => !p)}>
                <span>Range mode</span><span style={{ fontSize: "14px" }}>{settingsRangeModeExpanded ? "▾" : "▸"}</span>
              </div>
              {settingsRangeModeExpanded && <>
              <select
                value={rangeMode}
                onChange={(e) => {
                  const newMode = e.target.value as typeof rangeMode;
                  if (newMode === "fit") {
                    setRangeMode("fit");
                    if (view === "weeks") {
                      const bounds = getTaskDateBounds(tasks);
                      if (!bounds) {
                        return;
                      }
                      setCurrentWeek(startOfWeek(bounds.start));
                      setWeekSpan(Math.max(1, Math.ceil((bounds.end.getTime() - startOfWeek(bounds.start).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1));
                    }
                  } else if (newMode === "rolling") {
                    setRangeMode("rolling");
                    setUseCustomMonthRange(false);
                    setCustomMonthStart(null);
                    setCustomMonthEnd(null);
                  } else {
                    setRangeMode(newMode);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  fontSize: "11px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <option value="fit">Fit to data</option>
                <option value="range">Specific date range</option>
                <option value="rolling">Rolling span</option>
              </select>
              {rangeMode === "range" && view !== "weeks" && (
                <div style={{ marginTop: "6px" }}>
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
                      <button className="v2-btn-sm" style={{ width: "100%", textAlign: "left" }}>
                        {customMonthStart && customMonthEnd
                          ? `${format(customMonthStart, "MMM dd")} – ${format(customMonthEnd, "MMM dd, yyyy")}`
                          : customMonthStart
                            ? `${format(customMonthStart, "MMM dd, yyyy")} – …`
                            : "Select date range"}
                      </button>
                    }
                  />
                </div>
              )}
              {rangeMode === "rolling" && (
                <div className="v2-settings-controls-row">
                  <button className="v2-btn-sm-icon" onClick={view === "weeks" ? prevWeek : prevMonth}>‹ Prev</button>
                  <input
                    type="number"
                    value={view === "weeks" ? weekSpan : monthSpan}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      if (view === "weeks") setWeekSpan(val);
                      else setMonthSpan(val);
                    }}
                    style={{ width: "42px", height: "24px", border: "1px solid #ddd", borderRadius: "4px", padding: "0 6px", fontSize: "11px" }}
                  />
                  <span style={{ fontSize: "11px", color: "#666" }}>{view === "weeks" ? "wks" : "mos"}</span>
                  <button className="v2-btn-sm-icon" onClick={view === "weeks" ? nextWeek : nextMonth}>Next ›</button>
                </div>
              )}
              </>}
            </div>

            <hr className="v2-divider" />

            {/* Layout */}
            <div className="v2-settings-section">
              <div className="v2-settings-heading" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }} onClick={() => setSettingsLayoutExpanded(p => !p)}>
                <span>Layout</span><span style={{ fontSize: "14px" }}>{settingsLayoutExpanded ? "▾" : "▸"}</span>
              </div>
              {settingsLayoutExpanded && <>
              <div className="v2-toggle-row">
                <span className="v2-toggle-label">Stacked layout</span>
                <div
                  className={`v2-toggle${timelineLayout === "stacked" ? " on" : ""}`}
                  onClick={() => {
                    const next = timelineLayout === "stacked" ? "horizontal" : "stacked";
                    setTimelineLayout(next);
                    if (view === "calendar") setView("months");
                  }}
                />
              </div>
              {timelineLayout === "stacked" && view === "months" && (
                <div className="v2-toggle-row">
                  <span className="v2-toggle-label">Split by weeks</span>
                  <div
                    className={`v2-toggle${monthStackSplit === "week" ? " on" : ""}`}
                    onClick={() => setMonthStackSplit(monthStackSplit === "week" ? "day" : "week")}
                  />
                </div>
              )}
              <div className="v2-toggle-row">
                <span className="v2-toggle-label">Compact rows</span>
                <div
                  className={`v2-toggle${compactTaskSpacing ? " on" : ""}`}
                  onClick={() => setCompactTaskSpacing((p) => !p)}
                />
              </div>
              </>}
            </div>

            <hr className="v2-divider" />

            {/* Display */}
            <div className="v2-settings-section">
              <div className="v2-settings-heading" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }} onClick={() => setSettingsDisplayExpanded(p => !p)}>
                <span>Display</span><span style={{ fontSize: "14px" }}>{settingsDisplayExpanded ? "▾" : "▸"}</span>
              </div>
              {settingsDisplayExpanded && <>
              <div className="v2-toggle-row">
                <span className="v2-toggle-label">Show weekends</span>
                <div
                  className={`v2-toggle${showWeekends ? " on" : ""}`}
                  onClick={() => setShowWeekends((p) => !p)}
                />
              </div>
              <div className="v2-toggle-row">
                <span className="v2-toggle-label">Show week / month #</span>
                <div
                  className={`v2-toggle${(view === "weeks" ? showWeekNumbers : showMonthNumbers) ? " on" : ""}`}
                  onClick={() => {
                    if (view === "weeks") setShowWeekNumbers((p) => !p);
                    else setShowMonthNumbers((p) => !p);
                  }}
                />
              </div>
              <div className="v2-toggle-row">
                <span className="v2-toggle-label">Relative timeline (Week 1, 2, ...)</span>
                <div
                  className={`v2-toggle${useRelativeTimeline ? " on" : ""}`}
                  onClick={() => setUseRelativeTimeline((p) => !p)}
                />
              </div>
              </>}
            </div>

            <hr className="v2-divider" />

            {/* Colors */}
            <div className="v2-settings-section">
              <div className="v2-settings-heading" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }} onClick={() => setSettingsColorsExpanded(p => !p)}>
                <span>Colors</span><span style={{ fontSize: "14px" }}>{settingsColorsExpanded ? "▾" : "▸"}</span>
              </div>
              {settingsColorsExpanded && <>
              <div className="v2-settings-group">
                <div className="v2-settings-subheading">Bar color source</div>
                <div className="v2-settings-pills">
                  <button
                    className={`v2-btn-sm${barColorSource === "category" ? " v2-btn-sm-active" : ""}`}
                    aria-pressed={barColorSource === "category"}
                    onClick={() => setBarColorSource("category")}
                  >
                    Category
                  </button>
                  <button
                    className={`v2-btn-sm${barColorSource === "phase" ? " v2-btn-sm-active" : ""}`}
                    aria-pressed={barColorSource === "phase"}
                    onClick={() => setBarColorSource("phase")}
                  >
                    Phase
                  </button>
                </div>
              </div>
              <div className="v2-settings-group" style={{ marginTop: "10px" }}>
                <div className="v2-settings-subheading">Bar label source</div>
                <div className="v2-settings-pills">
                  <button
                    className={`v2-btn-sm${barLabelSource === "task" ? " v2-btn-sm-active" : ""}`}
                    aria-pressed={barLabelSource === "task"}
                    onClick={() => setBarLabelSource("task")}
                  >
                    Task
                  </button>
                  <button
                    className={`v2-btn-sm${barLabelSource === "category" ? " v2-btn-sm-active" : ""}`}
                    aria-pressed={barLabelSource === "category"}
                    onClick={() => setBarLabelSource("category")}
                  >
                    Category
                  </button>
                  <button
                    className={`v2-btn-sm${barLabelSource === "phase" ? " v2-btn-sm-active" : ""}`}
                    aria-pressed={barLabelSource === "phase"}
                    onClick={() => setBarLabelSource("phase")}
                  >
                    Phase
                  </button>
                </div>
              </div>
              </>}
            </div>

            <hr className="v2-divider" />

            {/* Danger */}
            <div className="v2-settings-section">
              <div className="v2-settings-heading" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }} onClick={() => setSettingsDangerExpanded(p => !p)}>
                <span>Danger</span><span style={{ fontSize: "14px" }}>{settingsDangerExpanded ? "▾" : "▸"}</span>
              </div>
              {settingsDangerExpanded && <button
                className="v2-btn-sm"
                style={{ color: "#c0392b", borderColor: "#e0b0b0", width: "100%" }}
                onClick={() => {
                  if (window.confirm(`Clear all ${tasks.length} tasks? This cannot be undone.`)) {
                    setTasks([]);
                    setSelectedTimelineTaskId(null);
                    setShowSettingsPanel(false);
                  }
                }}
              >
                Clear all tasks
              </button>}
            </div>

          </div>
        </>
      )}

      {/* ─── IMPORT MODAL ─── */}
      {!presentationMode && showImportModal && (
        <div
          className="v2-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowImportModal(false);
              setShowImportTable(false);
              setImportData([]);
            }
          }}
        >
          <div className="v2-modal">
            <div className="v2-modal-header">
              <span className="v2-modal-title">Import tasks</span>
              <button
                className="v2-modal-close"
                onClick={() => {
                  setShowImportModal(false);
                  setShowImportTable(false);
                  setImportData([]);
                }}
              >
                ✕
              </button>
            </div>
            <div className="v2-modal-body">
              <p className="v2-modal-hint">
                Paste tab-separated rows from Excel. Headers optional — columns auto-detected.
                Accepts every column the CSV export emits (incl. Display Order &amp; Line Padding) for a lossless round-trip.
                Preview rows are editable; add/remove before importing. No row merging.
              </p>
              <textarea
                className="v2-paste-area"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={"Phase\tPhase Hex\tCategory\tCategory HEX\tTask\tSub-Task\tOwner\tDate Start\tDate End"}
                rows={5}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                <button className="v2-btn v2-btn-ghost" onClick={parseImportData}>Parse data</button>
                {showImportTable && importData.length > 0 && (
                  <>
                    <button
                      className="v2-btn v2-btn-dark"
                      onClick={() => { importTasks(); setShowImportModal(false); }}
                    >
                      Import {importData.length} task{importData.length !== 1 ? "s" : ""}
                    </button>
                    <button
                      className="v2-btn v2-btn-ghost"
                      onClick={() => { setShowImportTable(false); setImportData([]); }}
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
              {showImportTable && importData.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div className="v2-preview-label">
                    Preview — {importData.length} row{importData.length !== 1 ? "s" : ""} detected (editable)
                  </div>
                  <div style={{ overflowX: "auto", marginTop: "6px" }}>
                    <table className="v2-preview-table">
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
                              <button onClick={() => removeImportRow(rowIndex)}>✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button style={{ marginTop: "8px" }} onClick={addImportRow}>+ Add row</button>
                </div>
              )}
            </div>
            <div className="v2-modal-footer">
              <button
                className="v2-btn v2-btn-ghost"
                onClick={() => {
                  setShowImportModal(false);
                  setShowImportTable(false);
                  setImportData([]);
                }}
              >
                Cancel
              </button>
              {showImportTable && importData.length > 0 && (
                <button
                  className="v2-btn v2-btn-dark"
                  onClick={() => { importTasks(); setShowImportModal(false); }}
                >
                  Import {importData.length} task{importData.length !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT MODAL ─── */}
      {editingTask && (
        <div
          className="v2-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeTaskEditor();
            }
          }}
        >
          <div className="v2-modal v2-edit-modal">
            <div className="v2-modal-header">
              <div>
                <span className="v2-modal-title">Edit task</span>
                <div className="v2-edit-subtitle">
                  {editingTaskIndex >= 0
                    ? `Task ${editingTaskIndex + 1} of ${filteredAndSortedTasks.length}`
                    : "Task details"}
                </div>
              </div>
              <button className="v2-modal-close" onClick={closeTaskEditor}>✕</button>
            </div>
            <div className="v2-modal-body">
              <p className="v2-modal-hint">
                Changes save instantly. Use Prev/Next to move through tasks in the current sort order.
              </p>
              <div className="v2-edit-grid">
                <label className="v2-edit-field v2-edit-field--wide">
                  <span className="v2-edit-label">Task</span>
                  <input
                    type="text"
                    value={editingTask.name || ""}
                    onChange={(e) => updateTaskFields(editingTask.id, { name: e.target.value })}
                  />
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">Phase</span>
                  <input
                    type="text"
                    value={editingTask.phase || ""}
                    onChange={(e) => updateTaskFields(editingTask.id, { phase: e.target.value })}
                  />
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">Phase HEX</span>
                  <div className="v2-edit-color-row">
                    <span
                      className="v2-edit-color-swatch"
                      style={{
                        backgroundColor: editingTask.phaseHex ? `#${editingTask.phaseHex.replace(/^#/, "")}` : "var(--bg-fallback)",
                      }}
                    />
                    <input
                      type="text"
                      value={editingTask.phaseHex || ""}
                      onChange={(e) => updateTaskFields(editingTask.id, { phaseHex: e.target.value })}
                      placeholder="hex"
                    />
              </div>
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">Category</span>
                  <input
                    type="text"
                    value={editingTask.category || ""}
                    onChange={(e) => updateTaskFields(editingTask.id, { category: e.target.value })}
                  />
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">Category HEX</span>
                  <div className="v2-edit-color-row">
                    <span
                      className="v2-edit-color-swatch"
                      style={{
                        backgroundColor: editingTask.categoryHex ? `#${editingTask.categoryHex.replace(/^#/, "")}` : "var(--task-bg-fallback)",
                      }}
                    />
                    <input
                      type="text"
                      value={editingTask.categoryHex || ""}
                      onChange={(e) => updateTaskFields(editingTask.id, { categoryHex: e.target.value })}
                      placeholder="hex"
                    />
                  </div>
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">Start</span>
                  <DatePicker
                    selected={editingTask.startDate}
                    onChange={(date) => updateTaskFields(editingTask.id, { startDate: date || editingTask.startDate })}
                    dateFormat="M/d/yy"
                    popperClassName="task-date-picker-popper"
                  />
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">End</span>
                  <DatePicker
                    selected={editingTask.endDate}
                    onChange={(date) => updateTaskFields(editingTask.id, { endDate: date || editingTask.endDate })}
                    dateFormat="M/d/yy"
                    popperClassName="task-date-picker-popper"
                  />
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">Display Order</span>
                  <input
                    type="number"
                    value={editingTask.displayOrder}
                    onChange={(e) => updateTaskFields(editingTask.id, { displayOrder: Number(e.target.value) })}
                  />
                </label>
                <label className="v2-edit-field">
                  <span className="v2-edit-label">Line Padding</span>
                  <input
                    type="number"
                    value={editingTask.lineHeightAdjust ?? 0}
                    onChange={(e) => updateTaskFields(editingTask.id, { lineHeightAdjust: Number(e.target.value) })}
                    step={0.25}
                  />
                </label>
              </div>
            </div>
            <div className="v2-modal-footer v2-edit-modal-footer">
              <button
                className="v2-btn v2-btn-danger"
                onClick={() => { if (window.confirm(`Delete "${editingTask.name || 'this task'}"? This cannot be undone.`)) { removeTask(editingTask.id); closeTaskEditor(); } }}
              >
                Delete
              </button>
              <button
                className="v2-btn v2-btn-ghost"
                onClick={() => stepTaskEditor(-1)}
                disabled={editingTaskIndex <= 0}
              >
                ‹ Prev
              </button>
              <button
                className="v2-btn v2-btn-ghost"
                onClick={() => duplicateTask(editingTask)}
              >
                Duplicate
              </button>
              <button
                className="v2-btn v2-btn-ghost"
                onClick={() => stepTaskEditor(1)}
                disabled={editingTaskIndex === -1 || editingTaskIndex >= filteredAndSortedTasks.length - 1}
              >
                Next ›
              </button>
              <button
                className="v2-btn v2-btn-dark"
                onClick={closeTaskEditor}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONTENT AREA (scrollable) ─── */}
      <div className="v2-content-area" style={{ paddingTop: presentationMode ? "48px" : "0" }}>
        {/* ─── TIMELINE CANVAS ─── */}
        <div className="v2-canvas">
        <div>
            {/* ==================== WEEKLY VIEW TIMELINE ==================== */}
            {/* 
              Weekly view uses a "reverse Tetris" packing algorithm to minimize vertical space.
              Tasks are positioned from top to bottom, fitting into the first available space.
              
              Key features:
              - Dynamic task height based on text wrapping (word-wrap simulation)
              - Special priority tasks always appear at the top (sorted first)
              - Tasks are grouped by phase with colored header bars
              - Horizontal positioning uses percentage-based layout for responsiveness
              - Vertical positioning uses absolute positioning with collision detection
            */}
            {view === "weeks" && timelineLayout === "horizontal" &&
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
                visibleTasks.forEach((task) => {
                  const position = getTaskPosition(task);
                  if (!position) return;
                  // Shared helper (also used by the stacked views) — includes the
                  // wrap safety line so text never clips in screenshots.
                  taskHeights.set(task.id, getTaskHeightForPeriod(task, position.width, true));
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
                    {[""].map((phase) => {
                      const phaseTasks = visibleTasks; // Phases removed: all tasks render in one combined board
                      if (phaseTasks.length === 0) return null;

                      // ========== TASK POSITIONING ==========
                      // Apply the packing algorithm across all tasks
                      const phaseTaskPositions = new Map<number, number>();
                      const phaseOccupiedRanges: Array<{ start: number; end: number; top: number; bottom: number }> = [];
                      const phaseTopPadding = 8;

                      // Sort phase tasks by: 1) Special priority first, 2) Display order
                      const sortedPhaseTasks = [...phaseTasks].sort((a, b) => {
                        const aIsVacation = isSpecialPriorityTask(a);
                        const bIsVacation = isSpecialPriorityTask(b);

                      // Special priority tasks always come first (appear at top)
                        if (aIsVacation && !bIsVacation) return -1;
                        if (!aIsVacation && bIsVacation) return 1;

                        // For non-priority tasks or priority ties, use display order
                        return (a.displayOrder || 0) - (b.displayOrder || 0);
                      });

                      const { taskPositions: packedPhaseTaskPositions, occupiedRanges: packedPhaseOccupiedRanges } = getTaskVerticalLayout({
                        sortedTasks: sortedPhaseTasks,
                        getPosition: getTaskPosition,
                        taskHeights,
                        topPadding: phaseTopPadding,
                        compactRows: compactTaskSpacing,
                      });
                      packedPhaseTaskPositions.forEach((top, taskId) => {
                        phaseTaskPositions.set(taskId, top);
                      });
                      phaseOccupiedRanges.push(...packedPhaseOccupiedRanges);
                      const specialPriorityColumnColors = getSpecialPriorityColumnColors(
                        phaseTasks,
                        weekColumns.map((week) => ({ start: week, end: addDays(week, 6) })),
                      );

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
                          {/* ========== TASK AREA ========== */}
                          {/* Container for all task bars in the combined board */}
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
                              {weekColumns.map((_, index) => (
                                <div
                                  key={index}
                                  className="day-cell"
                                  style={{
                                    backgroundColor: specialPriorityColumnColors.get(index),
                                    ...(index === weekColumns.length - 1 ? { borderRight: "none" } : {}),
                                  }}
                                ></div>
                              ))}

                              {/* Individual task bars with calculated positions */}
                              {phaseTasks.map((task) => {
                                const position = getTaskPosition(task);
                                if (!position) return null;
                                const { start, width } = position;
                                const top = phaseTaskPositions.get(task.id) || 0; // Vertical position from packing algorithm
                                const horizontalPadding = 0.3; // Small gap between adjacent tasks
                                
                                // Use category color for all task bars, including priority tasks
                                const bgColor = getTaskBarColorValue(task);
                                const textColor = getTextColor(getTaskBarColorHex(task));
                                
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
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      openTaskEditor(task.id);
                                    }}
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
                                      `Top: ${top}px`
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
                                    <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>{getTaskBarText(task)}</span>
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
            {view === "weeks" && timelineLayout === "stacked" && (
              <div className="stacked-timeline">
                {weekColumns.map((week, index) => {
                  const visibleDays = visibleWeekColumns[index];
                  const periodStart = normalizeDate(week);
                  const periodEnd = normalizeDate(addDays(week, 6));
                  const periodTasks = timelineTasks.filter((task) => {
                    if (task.startDate > periodEnd || task.endDate < periodStart) {
                      return false;
                    }

                    return getTaskPositionForVisibleDays(task, visibleDays, periodStart, periodEnd) !== null;
                  });

                  if (periodTasks.length === 0) {
                    return renderStackedTimelineBoard({
                      periodKey: `week-${week.toISOString()}`,
                      title: showWeekNumbers ? `Week ${index + 1}` : `${format(periodStart, "MMM dd")} - ${format(periodEnd, "MMM dd, yyyy")}`,
                      units: getDayTimelineUnits(visibleDays),
                      periodStart,
                      periodEnd,
                      visibleTasks: [],
                      compactSpacing: true,
                      compactTaskSpacing,
                    });
                  }

                  let weekNumber = index + 1;
                  if (showWeekNumbers && tasks.length > 0) {
                    const allDates = tasks.map((task) => task.startDate);
                    const firstTaskDate = new Date(Math.min(...allDates.map((date) => date.getTime())));
                    const firstTaskWeek = startOfWeek(firstTaskDate);
                    const weeksDiff = Math.round((week.getTime() - firstTaskWeek.getTime()) / (7 * 24 * 60 * 60 * 1000));
                    weekNumber = weeksDiff + 1;
                  }

                  return renderStackedTimelineBoard({
                    periodKey: `week-${week.toISOString()}`,
                    title: showWeekNumbers ? `Week ${weekNumber}` : `${format(periodStart, "MMM dd")} - ${format(periodEnd, "MMM dd, yyyy")}`,
                    units: getDayTimelineUnits(visibleDays),
                    periodStart,
                    periodEnd,
                    visibleTasks: periodTasks,
                    compactSpacing: true,
                    compactTaskSpacing,
                  });
                })}
              </div>
            )}
            {view === "months" && timelineLayout === "horizontal" &&
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
                const weekHeaderGroups = getWeekHeaderGroupsForDays(visibleMonthlyDays);
                visibleTasks.forEach((task) => {
                  const position = getMonthTaskPosition(task);
                  if (!position) return;
                  // Shared helper with the wrap safety line ON — matches weekly and
                  // both stacked views. (Previously this block omitted the safety
                  // line, so monthly-horizontal bars could clip text in screenshots.)
                  taskHeights.set(task.id, getTaskHeightForPeriod(task, position.width, true));
                });

                return (
                  <div className="board">
                    {/* ========== MONTH HEADER ROW ========== */}
                    <div 
                      className="board-header"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${monthColumns.length}, 1fr)`,
                        }}
                      >
                        {monthColumns.map((month, index) => {
                          const monthNumber = showMonthNumbers ? getRelativeMonthNumber(month, tasks) : index + 1;

                          return (
                          <div
                              key={`month-${month.toISOString()}`}
                              className="day-header day-header--compact"
                            style={{
                                borderRight: index < monthColumns.length - 1 ? "1px solid var(--border-dark)" : "none",
                                fontSize: "0.8rem",
                              }}
                              title={`${format(month, "MMM dd, yyyy")} – ${format(endOfMonth(month), "MMM dd, yyyy")}`}
                            >
                              {showMonthNumbers ? `Month ${monthNumber}` : format(month, "MMM yyyy")}
                            </div>
                          );
                        })}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${weekHeaderGroups.length}, 1fr)`,
                        }}
                      >
                        {weekHeaderGroups.map((group, index) => (
                          <div
                            key={`month-week-${group.key}`}
                            className="day-header day-header--compact"
                            style={{
                              borderRight: index < weekHeaderGroups.length - 1 ? "1px solid var(--border-dark)" : "none",
                              fontSize: "0.75rem",
                              color: "var(--text-secondary)",
                            }}
                            title={group.title}
                          >
                            {group.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ========== PHASE SECTIONS ========== */}
                    {/* Each phase gets its own section with a header bar and task area */}
                    {/* When phase grouping is disabled, treat all tasks as a single group */}
                    {[""].map((phase) => {
                      const phaseTasks = visibleTasks; // Phases removed: all tasks render in one combined board
                      if (phaseTasks.length === 0) return null;

                      // ========== TASK POSITIONING ==========
                      // Apply the packing algorithm across all tasks
                      const phaseTaskPositions = new Map<number, number>();
                      const phaseOccupiedRanges: Array<{ start: number; end: number; top: number; bottom: number }> = [];
                      const phaseTopPadding = 8;

                      // Sort phase tasks by: 1) Special priority first, 2) Display order
                      const sortedPhaseTasks = [...phaseTasks].sort((a, b) => {
                        const aIsVacation = isSpecialPriorityTask(a);
                        const bIsVacation = isSpecialPriorityTask(b);

                        // Special priority tasks always come first (appear at top)
                        if (aIsVacation && !bIsVacation) return -1;
                        if (!aIsVacation && bIsVacation) return 1;

                        // For non-priority tasks or priority ties, use display order
                        return (a.displayOrder || 0) - (b.displayOrder || 0);
                      });

                      const { taskPositions: packedPhaseTaskPositions, occupiedRanges: packedPhaseOccupiedRanges } = getTaskVerticalLayout({
                        sortedTasks: sortedPhaseTasks,
                        getPosition: getMonthTaskPosition,
                        taskHeights,
                        topPadding: phaseTopPadding,
                        compactRows: compactTaskSpacing,
                      });
                      packedPhaseTaskPositions.forEach((top, taskId) => {
                        phaseTaskPositions.set(taskId, top);
                      });
                      phaseOccupiedRanges.push(...packedPhaseOccupiedRanges);
                      const specialPriorityColumnColors = getSpecialPriorityColumnColors(
                        phaseTasks,
                        monthColumns.map((month) => ({ start: month, end: endOfMonth(month) })),
                      );

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
                          {/* ========== TASK AREA ========== */}
                          {/* Container for all task bars in the combined board */}
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
                              {monthColumns.map((_, index) => (
                                <div
                                  key={index}
                                  className="day-cell"
                                  style={{
                                    backgroundColor: specialPriorityColumnColors.get(index),
                                    ...(index === monthColumns.length - 1 ? { borderRight: "none" } : {}),
                                  }}
                                ></div>
                              ))}

                              {/* Individual task bars with calculated positions */}
                              {phaseTasks.map((task) => {
                                const position = getMonthTaskPosition(task);
                                if (!position) return null;
                                const { start, width } = position;
                                const top = phaseTaskPositions.get(task.id) || 0; // Vertical position from packing algorithm
                                const horizontalPadding = 0.3; // Small gap between adjacent tasks
                                
                                // Use category color for all task bars, including priority tasks
                                const bgColor = getTaskBarColorValue(task);
                                const textColor = getTextColor(getTaskBarColorHex(task));
                                
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
                                    onContextMenu={(e) => {
                                      e.preventDefault();
                                      openTaskEditor(task.id);
                                    }}
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
                                      `Top: ${top}px`
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
                                    <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>{getTaskBarText(task)}</span>
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
            {view === "months" && timelineLayout === "stacked" && (
              <div className="stacked-timeline stacked-timeline--compact">
                {monthColumns.map((month) => {
                  const isWeekSplit = monthStackSplit === "week";
                  const units = monthStackSplit === "day"
                    ? getDayTimelineUnits(getVisibleMonthDays(month))
                    : getOwnedWeekDayUnitsForMonth(month);
                  const periodStart = isWeekSplit
                    ? (units[0]?.start ?? normalizeDate(startOfMonth(month)))
                    : normalizeDate(startOfMonth(month));
                  const periodEnd = isWeekSplit
                    ? (units[units.length - 1]?.end ?? normalizeDate(endOfMonth(month)))
                    : normalizeDate(endOfMonth(month));
                  const headerGroups = isWeekSplit ? getWeekHeaderGroupsForUnits(units) : undefined;
                  const monthRangeStart = monthColumns[0] ?? currentMonth;
                  const periodTasks = timelineTasks.filter((task) => {
                    if (task.startDate > periodEnd || task.endDate < periodStart) {
                      return false;
                    }

                    return getTaskPositionForUnits(task, units, periodStart, periodEnd) !== null;
                  });

                  return renderStackedTimelineBoard({
                    periodKey: `month-${month.toISOString()}`,
                    title: (
                      <>
                        <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>
                          {showMonthNumbers
                            ? `Month ${getRelativeMonthNumber(month, tasks)}`
                            : `${formatCompactMonthRange(periodStart, periodEnd)}, ${format(periodEnd, "yyyy")}`}
                        </span>
                        <span
                          style={{
                            marginLeft: "12px",
                            fontWeight: 400,
                            color: "var(--text-muted)",
                          }}
                        >
                          weeks {getRelativeWeekNumberFromAnchor(periodStart, monthRangeStart)} – {getRelativeWeekNumberFromAnchor(periodEnd, monthRangeStart)}
                        </span>
                      </>
                    ),
                    units,
                    periodStart,
                    periodEnd,
                    visibleTasks: periodTasks,
                    compactSpacing: true,
                    compactHeaderPadding: isWeekSplit,
                    compactTaskSpacing,
                    headerGroups,
                    showInnerUnitGridlines: !isWeekSplit,
                  });
                })}
              </div>
            )}
            {view === "calendar" &&
              (() => {
                const visibleCalendarDays = (week: Date[]) => week.filter((day) => showWeekends || !isWeekendDate(day));

                return (
                  <div className="calendar-board">
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
                      (() => {
                        const visibleDays = visibleCalendarDays(week);
                        const weekTaskSegments = getCalendarWeekTaskSegments(week);
                        const laneCount = weekTaskSegments.length > 0
                          ? Math.max(...weekTaskSegments.map((segment) => segment.lane)) + 1
                          : 0;
                        const gridTemplateRows = laneCount > 0
                          ? `36px repeat(${laneCount}, 36px) 6px`
                          : "56px";

                        return (
                          <div
                            key={`calendar-week-${weekIndex}`}
                            className="calendar-week-row calendar-week-grid"
                            style={{
                              gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))`,
                              gridTemplateRows,
                            }}
                          >
                            {visibleDays.map((day, index) => (
                              (() => {
                                const isMonthStart = isCalendarMonthStartDay(day);

                                return (
                                  <div
                                    key={day.toISOString()}
                                    className={`calendar-day-cell${isCalendarDayInRange(day) ? "" : " calendar-day-cell--outside"}${isMonthStart ? " calendar-day-cell--month-start" : ""}`}
                                    style={{
                                      gridColumn: `${index + 1}`,
                                      gridRow: `1 / ${laneCount + 3}`,
                                    }}
                                  >
                                    {isMonthStart ? (
                                      <div className="calendar-day-number calendar-day-number--month-start">
                                        <span className="calendar-day-month">{format(day, "MMM")}</span>
                                        <span className="calendar-day-date">{format(day, "d")}</span>
                                      </div>
                                    ) : (
                                      <div className="calendar-day-number">{getCalendarDayLabel(day)}</div>
                                    )}
                                  </div>
                                );
                              })()
                            ))}
                            {weekTaskSegments.map(({ task, startIndex, endIndex, lane }) => {
                              const colorHex = getTaskBarColorHex(task);
                              const colorValue = colorHex ? `#${colorHex.replace(/^#/, "")}` : "var(--accent-primary)";
                              const isSelected = selectedTimelineTaskId === task.id;
                              const segmentStartDay = visibleDays[startIndex];
                              const taskStartsBeforeSegment = normalizeDate(task.startDate).getTime() < normalizeDate(segmentStartDay).getTime();
                              const taskEndsAfterSegment = normalizeDate(task.endDate).getTime() > normalizeDate(visibleDays[endIndex]).getTime();

                              return (
                                <button
                                  key={`${task.id}-week-${weekIndex}`}
                                  type="button"
                                  className={`calendar-task-chip${isSelected ? " calendar-task-chip--selected" : ""}`}
                                  aria-pressed={isSelected}
                                  onClick={() => toggleTimelineTaskSelection(task.id)}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    openTaskEditor(task.id);
                                  }}
                                  title={[
                              `Task: ${task.name}`,
                              task.phase ? `Phase: ${task.phase}` : "",
                              task.category ? `Category: ${task.category}` : "",
                                    task.owner ? `Owner: ${task.owner}` : "",
                                    `Start: ${format(task.startDate, "MMM dd, yyyy")}`,
                                    `End: ${format(task.endDate, "MMM dd, yyyy")}`,
                                  ].filter(Boolean).join("\n")}
                            style={{
                              gridColumn: `${startIndex + 1} / ${endIndex + 2}`,
                              gridRow: `${lane + 2}`,
                              alignSelf: "center",
                              backgroundColor: blendHexWithWhite(getTaskBarColorHex(task)),
                              borderColor: colorValue,
                              color: "var(--text-primary)",
                              opacity: selectedTimelineTaskId !== null && !isSelected ? 0.78 : 1,
                            }}
                                >
                                  <span className="calendar-task-chip-dot" style={{ backgroundColor: colorValue }}></span>
                                  {taskStartsBeforeSegment && (
                                    <span className="calendar-task-arrow calendar-task-arrow--start">◀</span>
                                  )}
                                  <span className="calendar-task-chip-label">{getCalendarChipLabel(task, segmentStartDay)}</span>
                                  {taskEndsAfterSegment && (
                                    <span className="calendar-task-arrow calendar-task-arrow--end">▶</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()
                    ))}
                  </div>
                );
              })()}
            {view === "calendar" && (
              <div className="calendar-footer-note">
                Tasks are saved in this browser only. Export CSV when you need a portable copy or backup.
              </div>
            )}
        </div>
      </div>

      {/* ─── LEGENDS ─── */}
      <div className="v2-canvas" style={{ paddingTop: 0 }}>
        {(() => {
          const visibleColorValues = Array.from(
            new Set(
              visibleLegendTasks
                .map((task) => getColorKeyValue(task))
                .filter((value): value is string => Boolean(value && value.trim())),
            ),
          );

          if (visibleColorValues.length === 0) return null;

          return (
            <div style={{ padding: "15px", backgroundColor: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border-light)" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>{getColorKeyLabel()}</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", columnGap: "12px", rowGap: "8px" }}>
                {visibleColorValues.map((value) => {
                  const taskWithValue = visibleLegendTasks.find((task) => getColorKeyValue(task) === value);
                  const colorHex = getTaskBarColorHex(taskWithValue || visibleLegendTasks[0]);
                  const color = colorHex ? `#${colorHex.replace(/^#/, "")}` : "var(--task-bg-fallback)";
                  return (
                    <div key={value} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ width: "20px", height: "20px", minWidth: "20px", minHeight: "20px", flexShrink: 0, backgroundColor: color, borderRadius: "3px", border: "1px solid var(--border-medium)" }} />
                      <span style={{ color: "var(--text-primary)", fontSize: "0.875rem", lineHeight: "1.2" }}>{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* ─── TASK PANEL ─── */}
      {!presentationMode && (
        <div
          className={`v2-task-panel-tab${showTaskPanel ? " expanded" : ""}`}
          onClick={() => setShowTaskPanel((p) => !p)}
        >
          <span className="v2-panel-tab-label">Tasks</span>
          <span className="v2-panel-tab-count">
            {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? "s" : ""}
            {tasks.length > 0 && (() => {
              const allDates = tasks.flatMap((t) => [t.startDate, t.endDate]);
              const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
              const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
              return ` · ${format(minDate, "MMM d, yyyy")} – ${format(maxDate, "MMM d, yyyy")}`;
            })()}
          </span>
          <span className="v2-panel-tab-arrow">{showTaskPanel ? "▼ collapse" : "▲ expand"}</span>
        </div>
      )}

      {!presentationMode && showTaskPanel && (
        <div className="v2-task-panel">
          <div className="v2-panel-toolbar">
            <input
              className="v2-panel-filter"
              placeholder="Filter tasks…"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            {(filterText.trim() || selectedTimelineTask) && (
              <span style={{ fontSize: "11px", color: "#888", whiteSpace: "nowrap" }}>
                {filteredAndSortedTasks.length} result{filteredAndSortedTasks.length !== 1 ? "s" : ""}
                {selectedTimelineTask && (
                  <>
                    {" · "}
                    <button
                      style={{ fontSize: "11px", background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0 }}
                      onClick={(e) => { e.stopPropagation(); setSelectedTimelineTaskId(null); }}
                    >
                      ✕ clear
                    </button>
                  </>
                )}
              </span>
            )}
            <button className="v2-panel-add" onClick={(e) => { e.stopPropagation(); addTask(); }}>+ Add task</button>
            <button className="v2-panel-export" onClick={(e) => { e.stopPropagation(); exportTasks(); }}>Export CSV</button>
            <button
              ref={colorsPanelAnchorRef}
              className={`v2-btn v2-btn-ghost v2-btn-icon${showColorsPanel ? " v2-btn-active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                const rect = colorsPanelAnchorRef.current?.getBoundingClientRect();
                if (rect) {
                  setColorsPanelPos({
                    top: rect.bottom + 6,
                    right: window.innerWidth - rect.right,
                  });
                }
                setShowColorsPanel((p) => !p);
              }}
              title="Task view settings"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
          <div style={{ overflowX: "auto", overflowY: "auto", flex: "0 0 auto" }}>
            <table className="v2-task-table">
              <thead>
                <tr>
                  <th style={{ width: "18px" }}></th>
                  {(
                    [
                      { key: "displayOrder" as const, label: "Order", width: "48px" },
                      { key: "phase" as const, label: "Phase", width: "13%" },
                      ...(showHexColumns ? [{ key: "phaseHex" as const, label: "Phase HEX", width: "80px" }] : []),
                      { key: "category" as const, label: "Category", width: "16%" },
                      ...(showHexColumns ? [{ key: "categoryHex" as const, label: "Cat HEX", width: "76px" }] : []),
                      { key: "name" as const, label: "Task", width: "auto" },
                      { key: "startDate" as const, label: "Start", width: "68px" },
                      { key: "endDate" as const, label: "End", width: "68px" },
                      { key: "lineHeightAdjust" as const, label: "Line Pad", width: "100px" },
                    ] as Array<{ key: typeof sortBy; label: string; width: string }>
                  ).map((col) => (
                    <th
                      key={col.key}
                      className={`v2-th-sortable${sortBy === col.key ? " sorted" : ""}`}
                      style={{ width: col.width }}
                      onClick={() => {
                        if (sortBy === col.key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        else { setSortBy(col.key); setSortOrder("asc"); }
                      }}
                    >
                      {col.label}
                      {sortBy === col.key && (
                        <span style={{ fontSize: "8px", marginLeft: "2px" }}>{sortOrder === "asc" ? "▲" : "▼"}</span>
                      )}
                    </th>
                  ))}
                  <th style={{ width: "110px" }}>Actions</th>
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
                    style={{ backgroundColor: t.id === draggedTask ? "var(--bg-secondary)" : undefined }}
                  >
                    <td><span style={{ color: "#ccc", cursor: "grab", fontSize: "12px", userSelect: "none" }}>⠇</span></td>
                    <td>{t.displayOrder}</td>
                    <td><input type="text" value={t.phase || ""} onChange={(e) => updateTask(t.id, "phase", e.target.value)} /></td>
                    {showHexColumns && (
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          {t.phaseHex && <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: `#${t.phaseHex.replace(/^#/, "")}`, display: "inline-block", border: "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />}
                          <input type="text" value={t.phaseHex || ""} onChange={(e) => updateTask(t.id, "phaseHex", e.target.value)} placeholder="hex" />
                        </div>
                      </td>
                    )}
                    <td><input type="text" value={t.category || ""} onChange={(e) => updateTask(t.id, "category", e.target.value)} /></td>
                    {showHexColumns && (
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          {t.categoryHex && <span style={{ width: "9px", height: "9px", borderRadius: "2px", backgroundColor: `#${t.categoryHex.replace(/^#/, "")}`, display: "inline-block", border: "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />}
                          <input type="text" value={t.categoryHex || ""} onChange={(e) => updateTask(t.id, "categoryHex", e.target.value)} placeholder="hex" />
                        </div>
                      </td>
                    )}
                    <td><input type="text" value={t.name || ""} onChange={(e) => updateTask(t.id, "name", e.target.value)} /></td>
                    <td>
                      <DatePicker
                        selected={t.startDate}
                        onChange={(date) => updateTask(t.id, "startDate", date || new Date())}
                        dateFormat="M/d/yy"
                        popperClassName="task-date-picker-popper"
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={t.endDate}
                        onChange={(date) => updateTask(t.id, "endDate", date || new Date())}
                        dateFormat="M/d/yy"
                        popperClassName="task-date-picker-popper"
                      />
                    </td>
                    <td className="v2-task-table-line-pad-cell">
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button
                          className="v2-task-row-action"
                          title="Decrease by 0.25"
                          onClick={() => updateTask(t.id, "lineHeightAdjust", Math.max(0, (t.lineHeightAdjust ?? 0) - 0.25))}
                          style={{ padding: "2px 4px", fontSize: "11px" }}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={t.lineHeightAdjust ?? 0}
                          onChange={(e) => updateTask(t.id, "lineHeightAdjust", Number(e.target.value))}
                          step={0.25}
                          style={{ width: "40px", textAlign: "center" }}
                        />
                        <button
                          className="v2-task-row-action"
                          title="Increase by 0.25"
                          onClick={() => updateTask(t.id, "lineHeightAdjust", (t.lineHeightAdjust ?? 0) + 0.25)}
                          style={{ padding: "2px 4px", fontSize: "11px" }}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="v2-task-table-actions-cell">
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          className="v2-task-row-action"
                          title="Edit"
                          onClick={() => openTaskEditor(t.id)}
                        >
                          ✎
                        </button>
                        <button
                          className="v2-task-row-action"
                          title="Duplicate"
                          onClick={() => duplicateTask(t)}
                        >
                          ⧉
                        </button>
                        <button
                          className="v2-task-row-action delete"
                          title="Remove"
                          onClick={() => { if (window.confirm(`Delete "${t.name || 'this task'}"? This cannot be undone.`)) removeTask(t.id); }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="v2-panel-footer">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} · drag ⠇ to reorder · click a header to sort
            <span style={{ marginLeft: "10px" }}>Saved in this browser only.</span>
          </div>
        </div>
      )}

      {!presentationMode && showColorsPanel && (
        <>
          <div className="v2-settings-backdrop" onClick={() => setShowColorsPanel(false)} />
          <div className="v2-settings-panel" style={{ position: "fixed", top: colorsPanelPos.top, right: colorsPanelPos.right, zIndex: 1001, width: "248px", height: "fit-content", maxHeight: "calc(100vh - 48px)", overflowY: "auto" }}>
            <div className="v2-settings-section" style={{ marginTop: "0" }}>
              <div className="v2-settings-heading" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }} onClick={() => setTaskSettingsDisplayExpanded(p => !p)}>
                <span>Display</span><span style={{ fontSize: "14px" }}>{taskSettingsDisplayExpanded ? "▾" : "▸"}</span>
              </div>
              {taskSettingsDisplayExpanded && <>
              <div className="v2-toggle-row">
                <span className="v2-toggle-label">Show hex columns</span>
                <input
                  type="checkbox"
                  checked={showHexColumns}
                  onChange={(e) => setShowHexColumns(e.target.checked)}
                  style={{ cursor: "pointer", width: "14px", height: "14px" }}
                />
              </div>
              {import.meta.env.DEV && (
                <button
                  className="v2-btn-sm"
                  style={{ width: "100%", marginTop: "6px" }}
                  onClick={() => { addTestTask(); setShowColorsPanel(false); }}
                >
                  Add test task
                </button>
              )}
              </>}
            </div>

            <hr className="v2-divider" />

            <div className="v2-settings-section">
              <div
                className="v2-settings-heading"
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }}
                onClick={() => setTaskSettingsPhasesExpanded(e => !e)}
              >
                <span>Phases</span>
                <span style={{ fontSize: "14px" }}>{taskSettingsPhasesExpanded ? "▾" : "▸"}</span>
              </div>
              {taskSettingsPhasesExpanded && (phases.length === 0 ? (
                <em style={{ color: "#999", fontSize: "11px" }}>No phases</em>
              ) : (
                phases.map((phase) => (
                  <div key={phase} className="v2-toggle-row">
                    <span className="v2-toggle-label">{phase}</span>
                    <input
                      type="text"
                      value={phaseHexMap[phase] || ""}
                      onChange={(e) => {
                        const newHex = e.target.value;
                        setPhaseHexMap({ ...phaseHexMap, [phase]: newHex });
                        tasks.filter(t => t.phase === phase).forEach(t => updateTask(t.id, "phaseHex", newHex));
                      }}
                      placeholder="#000000"
                      maxLength={7}
                      style={{ width: "70px", padding: "3px 6px", fontSize: "11px", border: "1px solid #ddd", borderRadius: "4px", fontFamily: "inherit" }}
                    />
                  </div>
                ))
              ))}
            </div>

            <hr className="v2-divider" />

            <div className="v2-settings-section">
              <div
                className="v2-settings-heading"
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }}
                onClick={() => setTaskSettingsCategoriesExpanded(e => !e)}
              >
                <span>Categories</span>
                <span style={{ fontSize: "14px" }}>{taskSettingsCategoriesExpanded ? "▾" : "▸"}</span>
              </div>
              {taskSettingsCategoriesExpanded && (categories.length === 0 ? (
                <em style={{ color: "#999", fontSize: "11px" }}>No categories</em>
              ) : (
                categories.map((cat) => (
                  <div key={cat} className="v2-toggle-row">
                    <span className="v2-toggle-label">{cat}</span>
                    <input
                      type="text"
                      value={categoryHexMap[cat] || ""}
                      onChange={(e) => {
                        const newHex = e.target.value;
                        setCategoryHexMap({ ...categoryHexMap, [cat]: newHex });
                        tasks.filter(t => t.category === cat).forEach(t => updateTask(t.id, "categoryHex", newHex));
                      }}
                      placeholder="#000000"
                      maxLength={7}
                      style={{ width: "70px", padding: "3px 6px", fontSize: "11px", border: "1px solid #ddd", borderRadius: "4px", fontFamily: "inherit" }}
                    />
                  </div>
                ))
              ))}
            </div>

            <hr className="v2-divider" />

            <div className="v2-settings-section">
              <div className="v2-settings-heading" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", userSelect: "none" }} onClick={() => setTaskSettingsDangerExpanded(p => !p)}>
                <span>Danger</span><span style={{ fontSize: "14px" }}>{taskSettingsDangerExpanded ? "▾" : "▸"}</span>
              </div>
              {taskSettingsDangerExpanded && <button
                className="v2-btn-sm"
                style={{ color: "#c0392b", borderColor: "#e0b0b0", width: "100%" }}
                onClick={() => {
                  if (window.confirm(`Clear all ${tasks.length} tasks? This cannot be undone.`)) {
                    setTasks([]);
                    setSelectedTimelineTaskId(null);
                    setShowColorsPanel(false);
                  }
                }}
              >
                Clear all tasks
              </button>}
            </div>
          </div>
        </>
      )}
      </div>

      <div style={{ height: "16px" }} />
    </div>
  );
}

export default App;

