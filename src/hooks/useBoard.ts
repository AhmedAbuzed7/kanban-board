// src/hooks/useBoard.ts
import { useState, useEffect } from "react";
import type { BoardState, Task } from "../types/kanban";

const LOCAL_STORAGE_KEY = "devflow_kanban_board_v1";

const initialBoard: BoardState = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Design landing page wireframes",
      description:
        "Create high-fidelity wireframes for the new SaaS landing page using Figma.",
      columnId: "col-todo",
      priority: "high",
      tags: ["Design", "UI/UX"],
      dueDate: "2026-05-15",
      createdAt: new Date().toISOString(),
      subtasks: [
        { id: "sub-1", title: "Hero section layout", completed: true },
        { id: "sub-2", title: "Pricing table component", completed: false },
      ],
    },
    "task-2": {
      id: "task-2",
      title: "Configure Tailwind CSS v4",
      description:
        "Update project configuration and verify build output with Vite.",
      columnId: "col-inprogress",
      priority: "medium",
      tags: ["Frontend", "Setup"],
      dueDate: "2026-05-10",
      createdAt: new Date().toISOString(),
      subtasks: [{ id: "sub-3", title: "Install packages", completed: true }],
    },
    "task-3": {
      id: "task-3",
      title: "Implement OAuth authentication",
      description:
        "Integrate Google and GitHub social login providers using Supabase Auth.",
      columnId: "col-todo",
      priority: "high",
      tags: ["Backend", "Security"],
      dueDate: "2026-06-01",
      createdAt: new Date().toISOString(),
      subtasks: [
        { id: "sub-4", title: "Set up Supabase project", completed: true },
        { id: "sub-5", title: "Create login UI buttons", completed: false },
        { id: "sub-6", title: "Handle session tokens", completed: false },
      ],
    },
    "task-4": {
      id: "task-4",
      title: "Write unit tests for custom hooks",
      description:
        "Add Vitest and React Testing Library coverage for useBoard state management.",
      columnId: "col-inprogress",
      priority: "low",
      tags: ["Testing", "QA"],
      dueDate: "2026-05-20",
      createdAt: new Date().toISOString(),
      subtasks: [
        { id: "sub-7", title: "Configure Vitest environment", completed: true },
        {
          id: "sub-8",
          title: "Test local storage persistence",
          completed: true,
        },
      ],
    },
    "task-5": {
      id: "task-5",
      title: "Deploy application to Netlify",
      description:
        "Connect GitHub repository to Netlify for continuous automated deployments.",
      columnId: "col-done",
      priority: "medium",
      tags: ["DevOps", "Release"],
      dueDate: "2026-05-02",
      createdAt: new Date().toISOString(),
      subtasks: [
        { id: "sub-9", title: "Build production bundle", completed: true },
        {
          id: "sub-10",
          title: "Verify environment variables",
          completed: true,
        },
      ],
    },
  },
  columns: {
    "col-todo": {
      id: "col-todo",
      title: "To Do",
      taskIds: ["task-1", "task-3"],
    },
    "col-inprogress": {
      id: "col-inprogress",
      title: "In Progress",
      taskIds: ["task-2", "task-4"],
    },
    "col-done": {
      id: "col-done",
      title: "Done",
      taskIds: ["task-5"],
    },
  },
  columnOrder: ["col-todo", "col-inprogress", "col-done"],
};

export const useBoard = () => {
  const [board, setBoard] = useState<BoardState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error("Failed to load board state from localStorage", err);
    }
    return initialBoard;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(board));
    } catch (err) {
      console.error("Failed to save board state to localStorage", err);
    }
  }, [board]);

  const deleteTask = (taskId: string) => {
    setBoard((prev) => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const columnId = task.columnId;
      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newColumns = { ...prev.columns };
      newColumns[columnId] = {
        ...newColumns[columnId],
        taskIds: newColumns[columnId].taskIds.filter((id) => id !== taskId),
      };

      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns,
      };
    });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setBoard((prev) => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const updatedSubtasks = task.subtasks.map((sub) =>
        sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub,
      );

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...task,
            subtasks: updatedSubtasks,
          },
        },
      };
    });
  };

  const addTask = (
    columnId: string,
    taskData: {
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      tags: string[];
      dueDate: string;
      subtasks: { id: string; title: string; completed: boolean }[];
    },
  ) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      columnId,
      createdAt: new Date().toISOString(),
      ...taskData,
    };

    setBoard((prev) => {
      const column = prev.columns[columnId];
      if (!column) return prev;

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            taskIds: [...column.taskIds, newTaskId],
          },
        },
      };
    });
  };

  const updateTask = (
    taskId: string,
    taskData: {
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      tags: string[];
      dueDate: string;
      subtasks: { id: string; title: string; completed: boolean }[];
    },
  ) => {
    setBoard((prev) => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const updatedTask: Task = {
        ...task,
        ...taskData,
      };

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: updatedTask,
        },
      };
    });
  };

  const moveTask = (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number,
  ) => {
    setBoard((prev) => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const sourceCol = prev.columns[sourceColumnId];
      const destCol = prev.columns[destinationColumnId];
      if (!sourceCol || !destCol) return prev;

      const updatedTask = { ...task, columnId: destinationColumnId };

      if (sourceColumnId === destinationColumnId) {
        const newTaskIds = [...sourceCol.taskIds];
        const oldIndex = newTaskIds.indexOf(taskId);
        if (oldIndex > -1) {
          newTaskIds.splice(oldIndex, 1);
        }
        newTaskIds.splice(newIndex, 0, taskId);

        return {
          ...prev,
          tasks: { ...prev.tasks, [taskId]: updatedTask },
          columns: {
            ...prev.columns,
            [sourceColumnId]: { ...sourceCol, taskIds: newTaskIds },
          },
        };
      } else {
        const sourceTaskIds = sourceCol.taskIds.filter((id) => id !== taskId);
        const destTaskIds = [...destCol.taskIds];
        destTaskIds.splice(newIndex, 0, taskId);

        return {
          ...prev,
          tasks: { ...prev.tasks, [taskId]: updatedTask },
          columns: {
            ...prev.columns,
            [sourceColumnId]: { ...sourceCol, taskIds: sourceTaskIds },
            [destinationColumnId]: { ...destCol, taskIds: destTaskIds },
          },
        };
      }
    });
  };

  const addColumn = (title: string) => {
    if (!title.trim()) return;
    const colId = `col-${Date.now()}`;

    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [colId]: {
          id: colId,
          title: title.trim(),
          taskIds: [],
        },
      },
      columnOrder: [...prev.columnOrder, colId],
    }));
  };

  const updateColumn = (columnId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setBoard((prev) => {
      const column = prev.columns[columnId];
      if (!column) return prev;

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            title: newTitle.trim(),
          },
        },
      };
    });
  };

  const deleteColumn = (columnId: string) => {
    setBoard((prev) => {
      if (prev.columnOrder.length <= 1) return prev;

      const newColumns = { ...prev.columns };
      const columnToDelete = newColumns[columnId];
      if (!columnToDelete) return prev;

      const newTasks = { ...prev.tasks };
      columnToDelete.taskIds.forEach((taskId) => {
        delete newTasks[taskId];
      });

      delete newColumns[columnId];
      const newColumnOrder = prev.columnOrder.filter((id) => id !== columnId);

      return {
        ...prev,
        tasks: newTasks,
        columns: newColumns,
        columnOrder: newColumnOrder,
      };
    });
  };

  return {
    board,
    deleteTask,
    toggleSubtask,
    addTask,
    updateTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
  };
};
