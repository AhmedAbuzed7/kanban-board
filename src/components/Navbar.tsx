// src/components/Navbar.tsx
import React from "react";
import { Kanban, Plus, Code } from "lucide-react";

interface NavbarProps {
  onNewTaskClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewTaskClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
      {/* Brand / Logo */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200">
          <Kanban size={22} />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">
            DevFlow Kanban
          </h1>
          <p className="text-xs text-gray-500">
            Portfolio-grade project management board
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
        >
          <Code size={16} />
          <span>Source</span>
        </a>

        <button
          onClick={onNewTaskClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
