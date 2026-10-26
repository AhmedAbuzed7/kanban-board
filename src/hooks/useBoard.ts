// src/hooks/useBoard.ts
import { useState, useEffect } from "react";
import type { BoardState, Task } from "../types/kanban";
import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_KEY = "kanban_board_state_v1";

const initialBoardState: BoardState = {
  tasks: {
    "task-1": {
      id: "task-1",
      columnId: "col-todo",
      title: "Design landing page wireframes",
      description:
        "Create high-fidelity wireframes for the new SaaS landing page using Figma.",
      priority: "high",
      tags: ["Design", "UI/UX"],
      subtasks: [
        { id: "sub-1", title: "Hero section layout", completed: true },
        { id: "sub-2", title: "Pricing table component", completed: false },
      ],
      dueDate: "2026-05-15",
      createdAt: new Date().toISOString(),
    },
    "task-2": {
      id: "task-2",
      columnId: "col-inprogress",
      title: "Configure Tailwind CSS v4",
      description:
        "Update project configuration and verify build output with Vite.",
      priority: "medium",
      tags: ["Frontend", "Setup"],
      subtasks: [{ id: "sub-3", title: "Install packages", completed: true }],
      dueDate: "2026-05-10",
      createdAt: new Date().toISOString(),
    },
  },
  columns: {
    "col-todo": {
      id: "col-todo",
      title: "To Do",
      taskIds: ["task-1"],
    },
    "col-inprogress": {
      id: "col-inprogress",
      title: "In Progress",
      taskIds: ["task-2"],
    },
    "col-done": {
      id: "col-done",
      title: "Done",
      taskIds: [],
    },
  },
  columnOrder: ["col-todo", "col-inprogress", "col-done"],
};

export function useBoard() {
  const [board, setBoard] = useState<BoardState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse board state from localStorage", e);
      }
    }
    return initialBoardState;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(board));
  }, [board]);

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
          [taskId]: { ...task, subtasks: updatedSubtasks },
        },
      };
    });
  };

  const addTask = (
    columnId: string,
    taskData: Omit<Task, "id" | "columnId" | "createdAt">,
  ) => {
    const newTaskId = `task-${uuidv4().slice(0, 8)}`;
    const newTask: Task = {
      ...taskData,
      id: newTaskId,
      columnId,
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
    };

    setBoard((prev: BoardState) => ({
      ...prev,
      tasks: { ...prev.tasks, [newTaskId]: newTask },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          taskIds: [...prev.columns[columnId].taskIds, newTaskId],
        },
      },
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setBoard((prev: BoardState) => {
      const task = prev.tasks[taskId];
      if (!task) return prev;
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: { ...task, ...updates },
        },
      };
    });
  };

  const deleteTask = (taskId: string) => {
    setBoard((prev: BoardState) => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const column = prev.columns[task.columnId];
      const newColumn = {
        ...column,
        taskIds: column.taskIds.filter((id: string) => id !== taskId),
      };

      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [task.columnId]: newColumn,
        },
      };
    });
  };

  // Move task across columns or reorder within the same column
  const moveTask = (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number,
  ) => {
    setBoard((prev) => {
      const sourceCol = prev.columns[sourceColumnId];
      const destCol = prev.columns[destinationColumnId];

      if (!sourceCol || !destCol) return prev;

      const newSourceTaskIds = Array.from(sourceCol.taskIds);
      const sourceIndex = newSourceTaskIds.indexOf(taskId);
      if (sourceIndex > -1) {
        newSourceTaskIds.splice(sourceIndex, 1);
      }

      if (sourceColumnId === destinationColumnId) {
        newSourceTaskIds.splice(newIndex, 0, taskId);
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColumnId]: {
              ...sourceCol,
              taskIds: newSourceTaskIds,
            },
          },
        };
      }

      const newDestTaskIds = Array.from(destCol.taskIds);
      newDestTaskIds.splice(newIndex, 0, taskId);

      const updatedTask = {
        ...prev.tasks[taskId],
        columnId: destinationColumnId,
      };

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: updatedTask,
        },
        columns: {
          ...prev.columns,
          [sourceColumnId]: {
            ...sourceCol,
            taskIds: newSourceTaskIds,
          },
          [destinationColumnId]: {
            ...destCol,
            taskIds: newDestTaskIds,
          },
        },
      };
    });
  };

  return {
    board,
    setBoard,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    moveTask,
  };
}
