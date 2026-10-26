// src/components/TaskCard.tsx
import React, { useState, useRef, useEffect } from "react";
import type { Task, Column } from "../types/kanban";
import {
  Trash2,
  Calendar,
  CheckSquare,
  MoreVertical,
  ArrowRight,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  columns: Record<string, Column>;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMoveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number,
  ) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  columns,
  onDelete,
  onToggleSubtask,
  onMoveTask,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const completedSubtasksCount = task.subtasks.filter(
    (s) => s.completed,
  ).length;
  const totalSubtasks = task.subtasks.length;

  const priorityColors = {
    low: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    medium: "bg-amber-50 text-amber-700 border-amber-200/60",
    high: "bg-rose-50 text-rose-700 border-rose-200/60",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        taskId: task.id,
        sourceColumnId: task.columnId,
      }),
    );
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative bg-white p-4 rounded-2xl border border-gray-200/70 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3 select-none"
    >
      {/* Top Row: Tags, Move Menu, & Delete Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-gray-100 text-gray-600 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {/* Quick Move Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title="Move Task"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20 text-xs animate-in fade-in zoom-in duration-150">
                <div className="px-3 py-1 font-semibold text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-50 mb-1">
                  Move to
                </div>
                {Object.values(columns)
                  .filter((col) => col.id !== task.columnId)
                  .map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        onMoveTask(task.id, task.columnId, col.id, 0);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{col.title}</span>
                      <ArrowRight size={12} />
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Delete Button - Always visible on touch/mobile, hover-reveal on desktop */}
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Task Title & Description */}
      <div>
        <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Subtasks Section */}
      {totalSubtasks > 0 && (
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-2.5 flex flex-col gap-2">
          <div
            onClick={() => setShowSubtasks(!showSubtasks)}
            className="flex items-center justify-between text-xs text-gray-600 cursor-pointer select-none font-medium"
          >
            <div className="flex items-center gap-1.5">
              <CheckSquare size={13} className="text-gray-400" />
              <span>Subtasks</span>
            </div>
            <span className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-500">
              {completedSubtasksCount}/{totalSubtasks}
            </span>
          </div>

          {showSubtasks && (
            <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-200/50">
              {task.subtasks.map((sub) => (
                <label
                  key={sub.id}
                  className="flex items-center gap-2 text-xs text-gray-700 hover:bg-white/80 p-1 rounded transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => onToggleSubtask(task.id, sub.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/20 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span
                    className={`${
                      sub.completed
                        ? "line-through text-gray-400 italic"
                        : "text-gray-700"
                    }`}
                  >
                    {sub.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer: Priority & Due Date */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px] text-gray-400">
        <span
          className={`px-2 py-0.5 rounded-md font-medium border capitalize ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};
