# devradar

<p align="center">
  <img src="assets/logo-text.png">
  <br>
  Track and present your skills as developer.
  Actively manage team competencies as leader.
</p>

[![License](https://badgen.net/badge/license/COPYRIGHT/orange)](LICENSE)
[![TypeScript](https://badgen.net/badge/code/TypeScript/blue)](https://www.typescriptlang.org/)
[![Standard](https://badgen.net/badge/code%20style/standard/pink)](https://standardjs.com/)

[![E2E Test](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/gumn5q/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/gumn5q/runs)

[![devradar.io](https://github.com/devradar/devradar/workflows/devradar.io/badge.svg?branch=master)](https://github.com/devradar/devradar/actions?query=workflow%3Adevradar.io)
[![Cross-OS Test](https://github.com/devradar/devradar/workflows/Cross-OS%20Test/badge.svg)](https://github.com/devradar/devradar/actions?query=workflow%3A%22Cross-OS+Test%22)
[![Cross-Browser Test](https://github.com/devradar/devradar/workflows/Cross-Browser%C2%A0Test/badge.svg)](https://github.com/devradar/devradar/actions?query=workflow%3ACross-Browser%C2%A0Test)

## 🚀 Tech Stack

### Frontend (`/web`)

- **Framework:** React + TypeScript (Vite)
- **State:** TanStack Query (Server State) + Zustand (UI State)
- **Styling:** Tailwind CSS + Shadcn UI
- **Routing:** React Router
- **Visuals:** Recharts

### Backend (`/backend`)

- **Language:** Go
- **Router:** Chi
- **Database Access:** sqlc (Type-safe SQL generation)
- **Database:** PostgreSQL
- **Auth:** OAuth2 (GitHub/Google) with HttpOnly Sessions

### Recommendation Engine _[Planned]_

- Python (FastAPI + Scikit-learn)

---

## 🎯 Project Goals

1.  **Skill Journal:** A "diary" view for users to log daily activities and link them to specific skills.
2.  **Visual Analytics:** Graphical dashboards to visualize competence growth over time.
3.  **Smart Recommendations:** A system that suggests new skills or activities based on the user's history and similar users' data.

---

## 🛠️ Development Setup

This project uses **VS Code Dev Containers** to ensure a consistent environment. You do not need to install Go, Node.js, or Postgres locally on your machine—only Docker.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Running)
- [VS Code](https://code.visualstudio.com/)
- [Remote - Containers Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Quick Start

1.  **Clone the repo:**

2.  **Open in Container:**

3.  **Wait for Initialization:**

4.  **Start Development Servers:**
    Open the integrated terminal (Ctrl+`) inside VS Code.

    **Terminal 1 (Backend):**

    ```bash
    # Runs the Go server with live reloading (Air)
    # Ensure you have 'air' installed or run 'go run cmd/server/main.go'
    go run cmd/server/main.go
    ```

    **Terminal 2 (Frontend):**

    ```bash
    cd web
    npm install
    npm run dev
    ```

5.  **Access the App:**
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend API: [http://localhost:8080](http://localhost:8080)
    - Database: `localhost:5432` (User: `postgres`, Pass: `postgres`, DB: `postgres`)

---

## 🗺️ Roadmap & Step Plan

We follow the "Tracer Bullet" methodology: building thin, complete slices of functionality rather than isolated layers.

### Phase 1: The Foundation (Tracer Bullet)

- [ ] Set up Monorepo structure (Go + Vite).
- [ ] Configure Dev Container with Postgres.
- [ ] **Goal:** A `/api/health` endpoint that queries the DB and is displayed on the React frontend.

### Phase 2: Auth & Infrastructure

- [ ] Implement GitHub OAuth flow (Backend-for-Frontend pattern).
- [ ] Secure cookies (HttpOnly, SameSite).
- [ ] Deploy "Skeleton" to Production (Railway + Vercel) to verify cross-domain cookies.

### Phase 3: The Diary Core

- [ ] Design DB Schema (`users`, `skills`, `activities`).
- [ ] Generate Go code with `sqlc`.
- [ ] Build "Add Activity" form (React Hook Form + Zod).
- [ ] Build "Activity Feed" (Infinite Scroll with React Query).

### Phase 4: Visualization & Intelligence

- [ ] Create Aggregation Queries in SQL (Competence over time).
- [ ] Implement Charts using Recharts.
- [ ] Spin up Python Microservice (FastAPI).
- [ ] Implement basic recommendation algorithm.

---

## ☁️ Deployment Setup

We use a split-stack deployment strategy for cost and performance optimization.

### Architecture

| Component    | Provider              | Reason                                                                     |
| :----------- | :-------------------- | :------------------------------------------------------------------------- |
| **Frontend** | **Vercel**            | Global CDN, optimized for Vite/React static assets.                        |
| **Backend**  | **Railway**           | Easy Docker deployment, runs close to the DB.                              |
| **Database** | **Railway** (or Neon) | Managed Postgres.                                                          |
| **DNS**      | **Custom Domain**     | Required for shared cookies (e.g., `app.domain.com` and `api.domain.com`). |

### Production Environment Variables

**Backend (Railway):**

```env
PORT=8080
DATABASE_URL=postgres://...
GO_ENV=production
# OAuth
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
# Security
SESSION_SECRET=...
FRONTEND_URL=[https://app.yourdomain.com](https://app.yourdomain.com)
```
