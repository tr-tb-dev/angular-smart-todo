# Smart To-Do List

[![Build](https://img.shields.io/badge/Build-Deployed-2EA44F)](https://tr-tb-dev.github.io/angular_smart_todo/)

An advanced Angular-based to-do list application with offline capabilities, state management, undo/redo functionality, and a built-in state debugger.

## Live Demo

🚀 [View Live Application](https://tr-tb-dev.github.io/angular_smart_todo/)

## Features

- ✅ Create, edit, and delete todos
- 🎨 Priority levels (Low, Medium, High)
- 🏷️ Tag support for organization
- 🔍 Search and filter capabilities
- ↩️ Undo/Redo functionality
- 💾 Offline support with IndexedDB
- 📊 Real-time statistics
- 🐛 Built-in state debugger
- 📱 Responsive design

## Tech Stack

- Angular 16
- Angular Material
- RxJS
- Dexie (IndexedDB wrapper)
- TypeScript
- SCSS

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`.

### Build

```bash
ng build
```

## Deployment

The application is automatically deployed to GitHub Pages on every push to the `main` branch using GitHub Actions.

## Architecture

- **State Management**: Custom RxJS-based state management with undo/redo support
- **Data Persistence**: IndexedDB via Dexie for offline-first approach
- **Component Architecture**: Standalone components with OnPush change detection
- **Reactive Forms**: Template-driven and reactive forms for user input