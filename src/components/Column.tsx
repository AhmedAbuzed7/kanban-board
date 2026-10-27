// src/components/Column.tsx
import React, { useState } from "react";
import type { Column as ColumnType, Task } from "../types/kanban";
import { TaskCard } from "./TaskCard";
import { Plus, Trash2 } from "lucide-react";

interface ColumnProps {
  column: ColumnType;
  columns: Record<string, ColumnType>;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddTaskClick: (columnId: string) => void;
  onMoveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number,
  ) => void;
  onEditTask: (task: Task) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  isMobile?: boolean;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  columns,
  tasks,
  onDeleteTask,
  onToggleSubtask,
  onAddTaskClick,
  onMoveTask,
  onEditTask,
  onUpdateColumn,
  onDeleteColumn,
  isMobile = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateColumn(column.id, editedTitle.trim());
    } else {
      setEditedTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dataRaw = e.dataTransfer.getData("text/plain");
    if (!dataRaw) return;

    try {
      const { taskId, sourceColumnId } = JSON.parse(dataRaw);
      onMoveTask(taskId, sourceColumnId, column.id, tasks.length);
    } catch (err) {
      console.error("Failed to parse dragged task data", err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex flex-col bg-gray-50/80 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200/60 dark:border-gray-800 h-full ${
        isMobile ? "w-full" : "w-80 sm:w-96 shrink-0"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-gray-800 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="px-2 py-0.5 text-xs font-bold bg-white dark:bg-gray-800 border border-indigo-500 rounded text-gray-800 dark:text-gray-100 w-full focus:outline-none"
            />
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className="font-bold text-gray-800 dark:text-gray-200 text-sm truncate cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Click to rename column"
            >
              {column.title}
            </h3>
          )}
          <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full shrink-0">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onAddTaskClick(column.id)}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title={`Add task to ${column.title}`}
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
            title={`Delete column ${column.title}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columns={columns}
            onDelete={onDeleteTask}
            onToggleSubtask={onToggleSubtask}
            onMoveTask={onMoveTask}
            onEdit={onEditTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center text-gray-400 dark:text-gray-600 text-xs">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );
};
