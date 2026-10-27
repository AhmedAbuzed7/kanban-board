// src/components/Board.tsx
import React, { useState } from "react";
import type { BoardState, Task } from "../types/kanban";
import { Column } from "./Column";
import { Plus } from "lucide-react";

interface BoardProps {
  board: BoardState;
  searchQuery: string;
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
  onAddColumn: (title: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  searchQuery,
  onDeleteTask,
  onToggleSubtask,
  onAddTaskClick,
  onMoveTask,
  onEditTask,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
}) => {
  const [activeMobileColumnId, setActiveMobileColumnId] = useState<string>(
    board.columnOrder[0] || "col-todo",
  );
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const filterTasks = (taskIds: string[]) => {
    return taskIds
      .map((taskId) => board.tasks[taskId])
      .filter(Boolean)
      .filter((task) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description
          .toLowerCase()
          .includes(query);
        const matchesTags = task.tags.some((tag) =>
          tag.toLowerCase().includes(query),
        );
        return matchesTitle || matchesDescription || matchesTags;
      });
  };

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    onAddColumn(newColumnTitle.trim());
    setNewColumnTitle("");
    setIsAddingColumn(false);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Mobile Column Switcher */}
      <div className="flex sm:hidden items-center justify-between px-4 pb-4 gap-2">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          const isActive = columnId === activeMobileColumnId;
          const filteredCount = filterTasks(column.taskIds).length;

          return (
            <button
              key={columnId}
              onClick={() => setActiveMobileColumnId(columnId)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200/80 dark:border-gray-800"
              }`}
            >
              <span>{column.title}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {filteredCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-x-auto px-4 sm:px-6 pb-4">
        {/* Mobile View */}
        <div className="block sm:hidden h-full">
          {board.columns[activeMobileColumnId] && (
            <Column
              column={board.columns[activeMobileColumnId]}
              columns={board.columns}
              tasks={filterTasks(board.columns[activeMobileColumnId].taskIds)}
              onDeleteTask={onDeleteTask}
              onToggleSubtask={onToggleSubtask}
              onAddTaskClick={onAddTaskClick}
              onMoveTask={onMoveTask}
              onEditTask={onEditTask}
              onUpdateColumn={onUpdateColumn}
              onDeleteColumn={onDeleteColumn}
              isMobile
            />
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:flex items-start justify-start gap-6 h-full w-max">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            const columnTasks = filterTasks(column.taskIds);

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
                onEditTask={onEditTask}
                onUpdateColumn={onUpdateColumn}
                onDeleteColumn={onDeleteColumn}
              />
            );
          })}

          {/* Add Column Button / Form */}
          <div className="w-80 sm:w-96 shrink-0">
            {isAddingColumn ? (
              <form
                onSubmit={handleCreateColumn}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col gap-3"
              >
                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xs uppercase tracking-wider">
                  New Column
                </h4>
                <input
                  type="text"
                  autoFocus
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  placeholder="Column title (e.g. QA Review)..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-gray-100"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingColumn(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Add Column
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-100/80 dark:hover:bg-gray-900/60 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add another column</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
