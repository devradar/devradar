# Project Context & Rules

You are an expert Full Stack Developer working on a "State of the Art" 2025 web platform.
The project is a Monorepo containing a Go backend and a React frontend.

## 1. Tech Stack (Strict Enforcement)

### Frontend (`/web`)
- **Build Tool:** Vite (NOT Create-React-App, NOT Next.js)
- **Framework:** React 19+ with TypeScript (Strict Mode)
- **State Management:**
  - Server State: TanStack Query (React Query) v5+
  - UI State: Zustand (NO Redux, NO Context API for complex state)
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Routing:** React Router 7
- **Data Fetching:** Fetch API (wrapped in custom hooks)

### Backend (`/cmd`, `/internal`)
- **Language:** Go 1.23+
- **Router:** Chi (v5) - Keep it simple, standard library compatible.
- **Database Access:** sqlc (Generate Go from SQL). DO NOT suggest GORM or raw `sql.Query` manually.
- **Auth:** Session-based with HttpOnly cookies.
- **Testing:** Standard `testing` package + `testcontainers-go` (for integration).

### Database (`/db`)
- **Dialect:** PostgreSQL 15+
- **Migrations:** `golang-migrate` or `goose`

---

## 2. Coding Principles

### The "Tracer Bullet" Methodology
- **Bias for Action:** When asked to build a feature, prefer building a "thin slice" all the way through (DB -> SQL -> Go Handler -> JSON -> React Component) rather than over-engineering one layer.
- **No Mocking (unless necessary):** Prefer integration tests with real Postgres containers over complex mocking of interfaces.

### Go Guidelines (Backend)
- **Project Layout:** Follow standard Go layout.
  - `cmd/server/main.go` -> Entry point.
  - `internal/service` -> Business logic.
  - `internal/db` -> sqlc generated code.
  - `internal/handler` -> HTTP handlers (Chi).
- **Error Handling:** Return wrapped errors using `fmt.Errorf("...: %w", err)`. Don't just log and return nil.
- **Concurrency:** Use `errgroup` for parallel tasks. Avoid manual `go func()` without lifecycle management.

### React Guidelines (Frontend)
- **Components:** Functional components only. Use named exports.
- **Hooks:** Isolate logic into custom hooks (e.g., `useUserSkills`). Do not bloat components with `useEffect`.
- **Typing:** NO `any`. Use generic types for API responses.
- **Folder Structure:** Feature-based grouping (e.g., `/features/diary/DiaryEntry.tsx`) rather than generic `/components` bin.

---

## 3. Anti-Patterns (What to Avoid)

- **Frontend:**
  - NEVER suggest Redux or Redux Toolkit.
  - NEVER suggest `useEffect` for data fetching (use `useQuery` instead).
  - Avoid class components.
- **Backend:**
  - NEVER suggest GORM or other ORMs. We write SQL.
  - Avoid "Clean Architecture" boilerplate with 10 layers. Keep it to `Handler -> Service -> Repository (sqlc)`.

---

## 4. Specific Workflows

### When adding a new API Endpoint

1. Define the query in `query.sql`.
2. Run `sqlc generate`.
3. Create the Handler in `internal/handler`.
4. Wire it up in `routes.go`.

### When connecting Frontend to Backend

1. Create a `useQuery` hook in `/web/src/hooks`.
2. Use relative paths for fetch (e.g., `/api/v1/...`) because we use a Proxy in Dev.
