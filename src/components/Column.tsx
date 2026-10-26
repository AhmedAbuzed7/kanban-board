// src/components/Column.tsx
import React from "react";
import type { Column as ColumnType, Task } from "../types/kanban";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";

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
  isMobile = false,
}) => {
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
      className={`flex flex-col bg-gray-50/80 rounded-2xl p-4 border border-gray-200/60 h-full ${
        isMobile ? "w-full" : "w-80 shrink-0"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-sm">{column.title}</h3>
          <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold bg-gray-200/70 text-gray-600 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTaskClick(column.id)}
          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors shadow-2xs cursor-pointer"
          title={`Add task to ${column.title}`}
        >
          <Plus size={16} />
        </button>
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
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-xs">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );
};
