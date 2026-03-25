# Task Planner Frontend (React + Vite)

Frontend for the Task Planner app. It connects to the Flask backend and provides task, label, summary, filters, and AI planning UI.

## Tech Stack
- React (JavaScript)
- Vite
- Tailwind CSS + shadcn/ui styles
- `fetch` for API requests

## Prerequisites
- Node.js 18+
- npm

## Setup
1. Go to frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start dev server:
```bash
npm run dev
```

Frontend runs at:
- `http://127.0.0.1:5173` (default Vite)

## Backend Requirement
Run backend separately at:
- `http://127.0.0.1:5000`

API base URL is currently defined in:
- `src/lib/constants.js`

```js
export const API_BASE_URL = "http://127.0.0.1:5000"
```

If backend URL changes, update that constant.

## Available Scripts
- `npm run dev`: start development server
- `npm run build`: production build
- `npm run preview`: preview production build locally
- `npm run lint`: run ESLint

## Project Structure
- `src/api/`
  - `client.js`: shared fetch helper (JSON parsing + error handling)
  - `tasks.js`, `labels.js`, `ai.js`: endpoint functions by domain
- `src/components/common/`: reusable UI states and section components
- `src/components/tasks/`: task form, list, card, filters, summary cards
- `src/components/labels/`: label form and label list
- `src/components/ai/`: AI planner section
- `src/pages/Dashboard.jsx`: main page composition and state handling
- `src/App.jsx`: renders dashboard

## Features Implemented
- Dashboard header
- Task summary cards (`/api/tasks/summary`)
- Task list with edit/delete actions
- Filters by status, priority, title search, and label
- Reusable create/edit task form
- Delete task confirmation dialog
- Label management (list, create, delete)
- AI planning section (`/api/ai/plan`)
- Loading and error states

## Data Flow (Simple)
- Page-level state is managed in `Dashboard.jsx`.
- API logic stays centralized in `src/api/*`.
- Components are kept small and reusable.
- After create/update/delete operations, relevant data is re-fetched.

## Build For Production
```bash
cd frontend
npm run build
npm run preview
```

## Troubleshooting
- If API calls fail, confirm backend is running at `http://127.0.0.1:5000`.
- If Vite shows import errors, restart dev server:
```bash
npm run dev
```
