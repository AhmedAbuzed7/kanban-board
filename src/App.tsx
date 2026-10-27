// src/App.tsx
import { useState, useEffect } from "react";
import { useBoard } from "./hooks/useBoard";
import { Navbar } from "./components/Navbar";
import { Board } from "./components/Board";
import { TaskModal } from "./components/TaskModal";
import type { Task } from "./types/kanban";

export function App() {
  const {
    board,
    deleteTask,
    toggleSubtask,
    addTask,
    updateTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
  } = useBoard();

  const [searchQuery, setSearchQuery] = useState("");

  // Dark mode state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("devflow_theme_mode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("devflow_theme_mode", JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (err) {
      console.error("Failed to save theme preference", err);
    }
  }, [isDarkMode]);

  // Modal state for Add/Edit tasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalColumnId, setModalColumnId] = useState<string>("col-todo");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenAddTask = (columnId: string) => {
    setModalColumnId(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setModalColumnId(task.columnId);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const activeColumn = board.columns[modalColumnId];
  const columnTitle = activeColumn ? activeColumn.title : "To Do";

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-200">
      {/* Top Navbar with Search Bar & Theme Toggle */}
      <Navbar
        onNewTaskClick={() =>
          handleOpenAddTask(board.columnOrder[0] || "col-todo")
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Kanban Board Container */}
      <main className="flex-1 overflow-hidden pt-6">
        <Board
          board={board}
          searchQuery={searchQuery}
          onDeleteTask={deleteTask}
          onToggleSubtask={toggleSubtask}
          onAddTaskClick={handleOpenAddTask}
          onMoveTask={moveTask}
          onEditTask={handleOpenEditTask}
          onAddColumn={addColumn}
          onUpdateColumn={updateColumn}
          onDeleteColumn={deleteColumn}
        />
      </main>

      {/* Task Creation / Editing Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        columnTitle={columnTitle}
        initialTask={editingTask}
        onSave={(taskData) => {
          if (editingTask) {
            updateTask(editingTask.id, taskData);
          } else {
            addTask(modalColumnId, taskData);
          }
          setEditingTask(null);
        }}
      />
    </div>
  );
}

export default App;
