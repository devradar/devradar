# Project Context & Rules

You are an expert Frontend Developer working on a "State of the Art" 2025 web application.
This is a **frontend-only SPA** (Single Page Application) with **no backend**. All data is stored in the browser's LocalStorage.

## 1. Tech Stack (Strict Enforcement)

### Frontend (`/web`)

- **Build Tool:** Vite (NOT Create-React-App, NOT Next.js)
- **Framework:** React 19+ with TypeScript (Strict Mode)
- **State Management:**
  - Local State: React Hooks (useState, useReducer, useContext)
  - Data Persistence: LocalStorage (with custom hooks)
  - UI State: Zustand (NO Redux, NO Context API for complex state)
- **Styling:** Tailwind CSS v4 + Shadcn UI + SCSS Modules
- **Routing:** React Router 7
- **Data Storage:** LocalStorage API (wrapped in custom hooks)
- **Icons:** Lucide React

### No Backend

- This project has NO backend server
- NO API calls to external services
- NO database (PostgreSQL, MySQL, etc.)
- All data is stored client-side in LocalStorage

---

## 2. Coding Principles

### The "Local-First" Methodology

- **Client-Side Only:** All logic runs in the browser
- **LocalStorage First:** All persistent data stored in LocalStorage
- **No Server Calls:** Never suggest APIs, fetch calls, or backend endpoints
- **Export/Import:** Provide JSON export/import for data portability

### React Guidelines (Frontend)

- **Components:** Functional components only. Use named exports.
- **Hooks:** Isolate logic into custom hooks (e.g., `useLocalStorage`, `useSkills`).
- **Typing:** NO `any`. Use generic types for data structures.
- **Folder Structure:** Feature-based grouping (e.g., `/features/skills/SkillCard.tsx`) rather than generic `/components` bin.
- **LocalStorage Abstraction:** Create custom hooks to abstract LocalStorage operations
- **Comments:** Write self-documenting code. ONLY use JSDoc for exported functions/components. NO inline comments, section comments, or explanatory comments. Code should be clear without comments.

### Data Management Patterns

#### Custom LocalStorage Hook Pattern

```typescript
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

#### Feature-Specific Hooks

```typescript
// useSkills.ts - Manages skills in LocalStorage
function useSkills() {
  const [skills, setSkills] = useLocalStorage<Skill[]>('skills', [])

  const addSkill = (skill: Skill) => {
    setSkills([...skills, { ...skill, id: generateId() }])
  }

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(skills.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  return { skills, addSkill, updateSkill }
}
```

---

## 3. Anti-Patterns (What to Avoid)

- **Frontend:**
  - NEVER suggest Redux or Redux Toolkit
  - NEVER suggest backend APIs, REST endpoints, or GraphQL
  - NEVER suggest useEffect for data fetching (there's no fetching!)
  - NEVER suggest server-side solutions (authentication, databases, etc.)
  - Avoid class components
  - Don't over-engineer state management - React's built-in hooks are sufficient

- **Backend:**
  - There is NO backend. Don't suggest one.

---

## 4. Specific Workflows

### When adding a new feature that needs data

1. Define TypeScript interfaces for the data structure
2. Create a custom hook using `useLocalStorage`
3. Create the UI components that use the hook
4. Add routes if needed (React Router)

### When user asks about data persistence

1. Explain that data is stored in LocalStorage
2. Suggest export/import functionality for backups
3. Warn about browser data clearing risks

### When user asks about authentication/users

1. Explain this is a single-user, local-only app
2. Data is private to the browser (no sharing across devices)
3. Suggest export/import for moving data between devices

---

## 5. Project Structure

```
web/
├── src/
│   ├── features/           # Feature-based modules
│   │   ├── skills/
│   │   │   ├── SkillCard.tsx
│   │   │   ├── SkillForm.tsx
│   │   │   └── useSkills.ts
│   │   └── diary/
│   │       ├── DiaryEntry.tsx
│   │       └── useDiary.ts
│   ├── hooks/              # Shared custom hooks
│   │   ├── useLocalStorage.ts
│   │   └── useExportImport.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── storage.ts
│   ├── App.tsx
│   └── main.tsx
```

---

## 6. Data Export/Import Pattern

Always provide users with data export/import functionality:

```typescript
// Export data
const exportData = () => {
  const data = {
    skills: localStorage.getItem('skills'),
    diary: localStorage.getItem('diary')
    // ... other data
  }

  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `devradar-backup-${Date.now()}.json`
  link.click()
}

// Import data
const importData = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = JSON.parse(e.target?.result as string)
    Object.entries(data).forEach(([key, value]) => {
      if (value) localStorage.setItem(key, value as string)
    })
  }
  reader.readAsText(file)
}
```
