// src/components/Board.tsx
import React, { useState } from "react";
import type { BoardState } from "../types/kanban";
import { Column } from "./Column";

interface BoardProps {
  board: BoardState;
  onDeleteTask: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddTaskClick: (columnId: string) => void;
  onMoveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number,
  ) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onDeleteTask,
  onToggleSubtask,
  onAddTaskClick,
  onMoveTask,
}) => {
  // Mobile active tab state (defaults to first column)
  const [activeMobileColumnId, setActiveMobileColumnId] = useState<string>(
    board.columnOrder[0] || "col-todo",
  );

  return (
    <div className="flex flex-col h-full w-full">
      {/* Mobile Column Switcher (Visible only on small screens < 640px) */}
      <div className="flex sm:hidden items-center justify-between px-4 pb-4 gap-2">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          const isActive = columnId === activeMobileColumnId;
          const taskCount = column.taskIds.length;

          return (
            <button
              key={columnId}
              onClick={() => setActiveMobileColumnId(columnId)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white text-gray-600 border border-gray-200/80"
              }`}
            >
              <span>{column.title}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {taskCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Column Container */}
      {/* Mobile View: Shows single active column at 100% width */}
      {/* Desktop View (sm:): Shows all columns in horizontal scrollable row */}
      <div className="flex-1 overflow-x-auto px-4 sm:px-6 pb-4">
        {/* Mobile View (< sm) */}
        <div className="block sm:hidden h-full">
          {board.columns[activeMobileColumnId] && (
            <Column
              column={board.columns[activeMobileColumnId]}
              columns={board.columns}
              tasks={board.columns[activeMobileColumnId].taskIds
                .map((taskId) => board.tasks[taskId])
                .filter(Boolean)}
              onDeleteTask={onDeleteTask}
              onToggleSubtask={onToggleSubtask}
              onAddTaskClick={onAddTaskClick}
              onMoveTask={onMoveTask}
              isMobile
            />
          )}
        </div>

        {/* Desktop View (>= sm) */}
        <div className="hidden sm:flex items-start gap-6 h-full">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const columnTasks = column.taskIds
              .map((taskId) => board.tasks[taskId])
              .filter(Boolean);

            return (
              <Column
                key={column.id}
                column={column}
                columns={board.columns}
                tasks={columnTasks}
                onDeleteTask={onDeleteTask}
                onToggleSubtask={onToggleSubtask}
                onAddTaskClick={onAddTaskClick}
                onMoveTask={onMoveTask}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
