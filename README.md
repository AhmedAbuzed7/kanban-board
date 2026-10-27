# 🚀 DevFlow Kanban | Portfolio-Grade Project Management Board

> A fully responsive, feature-rich Kanban task management application built with modern React, TypeScript, and Tailwind CSS. Designed with a robust local-first state architecture and mobile-optimized views.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-for-the-badge&logo=vite&logoColor=white)

---

## ✨ Overview

**DevFlow Kanban** is a high-performance project management dashboard built to simulate professional task tracking tools like Jira or Trello. It was engineered to solve common frontend state-management challenges while providing an impeccably smooth user experience across both desktop and mobile viewports.

---

## 🛠️ Key Features & Architecture

- **Normalized State Management:** Uses a custom `useBoard` hook that decouples tasks and columns using dictionary lookups (`Record<string, Task>`) paired with ordered ID arrays, ensuring clean scaling and zero performance degradation.
- **Robust Local-First Persistence:** Automatically synchronizes and persists all board state, tasks, columns, and user preferences to the browser’s `localStorage`.
- **Full CRUD & Inline Editing:**
  - Add, edit, and delete tasks with priority labels (Low, Medium, High), comma-separated tags, due dates, and interactive subtask checklists.
  - **Dynamic Column Management:** Add custom workflow columns, delete obsolete columns, and **inline-rename column titles** with a single click.
- **Live Search & Filtering Bar:** Instantly filter tasks in real-time across titles, descriptions, and tags.
- **Persistent Light / Dark Mode:** Integrated theme switcher powered by Tailwind CSS with persistent state storage across sessions.
- **Cross-Column Task Movement:** Features intuitive HTML5 drag-and-drop mechanics alongside a quick-action card menu to effortlessly move tasks between columns.
- **Responsive Mobile Tab-Switcher:** Designed with mobile-first constraints in mind—automatically collapsing wide columns into an adaptive single-column tab layout for mobile devices (<640px).

---

## 💻 Tech Stack

- **Frontend Framework:** React with functional hooks and strict TypeScript typing.
- **Styling:** Tailwind CSS (v4) for utility-first responsive styling and custom variants.
- **Icons:** Lucide React for crisp, scalable vector UI indicators.
- **Build Tool:** Vite for lightning-fast bundling, HMR, and optimal production builds.

---

## 🚀 Getting Started Locally

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AhmedAbuzed7/kanban-board.git](https://github.com/AhmedAbuzed7/kanban-board.git)
   cd kanban-board
   ```
