// src/types/kanban.ts

export type Priority = "low" | "medium" | "high";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  subtasks: Subtask[];
  dueDate?: string;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[]; // Ordered list of task IDs in this column
}

export interface BoardState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[]; // Ordered list of column IDs
}
