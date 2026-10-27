// src/components/Navbar.tsx
import React from "react";
import { Plus, Search, X, Moon, Sun } from "lucide-react";

interface NavbarProps {
  onNewTaskClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewTaskClick,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-800 transition-colors duration-200 shrink-0">
      {/* App Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl text-white shadow-sm shadow-indigo-200 dark:shadow-none">
          <span className="font-bold text-lg tracking-wider">|'|</span>
        </div>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-none">
            DevFlow Kanban
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Portfolio-grade project management board
          </p>
        </div>
      </div>

      {/* Feature 1: Live Search Bar */}
      <div className="hidden md:flex items-center relative w-80">
        <Search
          size={16}
          className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title or tag..."
          className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-md cursor-pointer"
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Actions: Theme Toggle & New Task CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors cursor-pointer"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onNewTaskClick}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
