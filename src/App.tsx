// src/App.tsx
import { useState } from "react";
import { useBoard } from "./hooks/useBoard";
import { Navbar } from "./components/Navbar";
import { Board } from "./components/Board";
import { TaskModal } from "./components/TaskModal";
import type { Priority, Subtask } from "./types/kanban";

export function App() {
  const { board, addTask, deleteTask, toggleSubtask, moveTask } = useBoard();

  // Modal State Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string>("col-todo");

  // Handler when clicking "New Task" in the Navbar
  const handleOpenNavbarModal = () => {
    setTargetColumnId("col-todo");
    setIsModalOpen(true);
  };

  // Handler when clicking the "+" button inside a specific column header
  const handleOpenColumnModal = (columnId: string) => {
    setTargetColumnId(columnId);
    setIsModalOpen(true);
  };

  // Handler when submitting the task form modal
  const handleSaveTask = (taskData: {
    title: string;
    description: string;
    priority: Priority;
    tags: string[];
    dueDate: string;
    subtasks: Subtask[];
  }) => {
    addTask(targetColumnId, taskData);
  };

  const activeColumnTitle = board.columns[targetColumnId]?.title || "To Do";

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
      {/* Top Navbar */}
      <Navbar onNewTaskClick={handleOpenNavbarModal} />

      {/* Main Kanban Board View */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden flex flex-col pt-6">
        <Board
          board={board}
          onDeleteTask={deleteTask}
          onToggleSubtask={toggleSubtask}
          onAddTaskClick={handleOpenColumnModal}
          onMoveTask={moveTask}
        />
      </main>

      {/* Interactive Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        columnTitle={activeColumnTitle}
      />
    </div>
  );
}

export default App;
