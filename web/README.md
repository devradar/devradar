# DevRadar Frontend

This is the React frontend for DevRadar, a client-side only SPA for skill tracking and visualization.

## Tech Stack

- **Build Tool:** Vite
- **Framework:** React 19+ with TypeScript
- **Styling:** Tailwind CSS v4 + SCSS Modules
- **State Management:** React Hooks + LocalStorage
- **Icons:** Lucide React

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Opens development server at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/`

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Architecture

This is a **local-first application** - all data is stored in the browser's LocalStorage. There is no backend server.

### Data Flow

```
User Interaction
    ↓
React Component
    ↓
Custom Hook (e.g., useSkills)
    ↓
LocalStorage API
    ↓
Browser Storage
```

### LocalStorage Patterns

#### Basic LocalStorage Hook

Create reusable hooks to manage LocalStorage:

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from localStorage on mount
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Save to localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
```

#### Feature-Specific Hooks

Build domain-specific hooks on top of `useLocalStorage`:

```typescript
// features/skills/useSkills.ts
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  lastUsed: string;
}

export function useSkills() {
  const [skills, setSkills] = useLocalStorage<Skill[]>('devradar:skills', []);

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: crypto.randomUUID(),
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(skills.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  return { skills, addSkill, updateSkill, deleteSkill };
}
```

#### Using in Components

```typescript
// features/skills/SkillList.tsx
import { useSkills } from './useSkills';

export function SkillList() {
  const { skills, deleteSkill } = useSkills();

  return (
    <div>
      {skills.map(skill => (
        <div key={skill.id}>
          <h3>{skill.name}</h3>
          <button onClick={() => deleteSkill(skill.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

## Project Structure

```
web/
├── src/
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   │
│   ├── features/            # Feature-based modules
│   │   ├── skills/
│   │   │   ├── SkillCard.tsx
│   │   │   ├── SkillForm.tsx
│   │   │   ├── SkillList.tsx
│   │   │   └── useSkills.ts
│   │   │
│   │   └── diary/
│   │       ├── DiaryEntry.tsx
│   │       ├── DiaryList.tsx
│   │       └── useDiary.ts
│   │
│   ├── hooks/               # Shared custom hooks
│   │   ├── useLocalStorage.ts
│   │   └── useExportImport.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── storage.ts
│   │   └── date.ts
│   │
│   ├── components/          # Shared UI components
│   │   └── Button.tsx
│   │
│   ├── assets/              # Static assets
│   └── styles/              # Global styles
│       ├── globals.scss
│       └── _variables.scss
│
├── public/                  # Public static files
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## Data Export/Import

Always provide users with data portability:

### Export Hook Example

```typescript
// hooks/useExportImport.ts
export function useExportImport() {
  const exportData = () => {
    const data = {
      skills: localStorage.getItem('devradar:skills'),
      diary: localStorage.getItem('devradar:diary'),
      settings: localStorage.getItem('devradar:settings'),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devradar-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'exportedAt' && value) {
            localStorage.setItem(key, value as string);
          }
        });
        window.location.reload(); // Refresh to load new data
      } catch (error) {
        console.error('Error importing data:', error);
      }
    };
    reader.readAsText(file);
  };

  return { exportData, importData };
}
```

## Best Practices

### 1. Namespace LocalStorage Keys

Use a consistent prefix to avoid conflicts:

```typescript
const STORAGE_PREFIX = 'devradar:';

// Good
localStorage.setItem('devradar:skills', data);

// Bad
localStorage.setItem('skills', data);
```

### 2. Handle Parse Errors

Always wrap JSON operations in try-catch:

```typescript
try {
  const data = JSON.parse(localStorage.getItem(key) || '[]');
} catch (error) {
  console.error('Failed to parse data:', error);
  return defaultValue;
}
```

### 3. Type Safety

Use TypeScript generics for type-safe storage:

```typescript
function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}
```

### 4. Storage Limits

Be aware of LocalStorage limits (~5-10MB per origin):

- Store only essential data
- Compress large datasets
- Implement data cleanup for old entries
- Warn users when approaching limits

### 5. Data Migration

Version your data structures for future migrations:

```typescript
interface StoredData {
  version: number;
  skills: Skill[];
}

function migrateData(data: any): StoredData {
  if (!data.version) {
    // Migrate from v0 to v1
    return { version: 1, skills: data };
  }
  return data;
}
```

## TypeScript Configuration

This project uses strict TypeScript:

- No `any` types
- Strict null checks enabled
- Use `unknown` for uncertain types
- Generic types for reusable components

## Styling Approach

- **Tailwind CSS** for utility-first styling
- **SCSS Modules** for component-specific styles
- **Shadcn UI** for pre-built components
- Mobile-first responsive design

## Development Tips

### Hot Module Replacement (HMR)

Vite provides fast HMR. If state resets on save:

```typescript
// Preserve state across HMR
if (import.meta.hot) {
  import.meta.hot.accept();
}
```

### DevTools

Use React DevTools and browser DevTools:

- **Application Tab** → Local Storage (inspect data)
- **Console** → Test localStorage operations
- **React DevTools** → Component state inspection

### Debugging LocalStorage

```typescript
// Log all localStorage data
console.log(
  Object.entries(localStorage)
    .filter(([key]) => key.startsWith('devradar:'))
);

// Clear all app data
Object.keys(localStorage)
  .filter(key => key.startsWith('devradar:'))
  .forEach(key => localStorage.removeItem(key));
```

## Performance Optimization

### Memoization

Use React memoization for expensive computations:

```typescript
const sortedSkills = useMemo(
  () => skills.sort((a, b) => b.proficiency - a.proficiency),
  [skills]
);
```

### Lazy Loading

Code-split routes and heavy components:

```typescript
const DiaryPage = lazy(() => import('./features/diary/DiaryPage'));
```

### Virtual Scrolling

For large lists, use virtualization:

```bash
npm install @tanstack/react-virtual
```

## Deployment

Build optimized production bundle:

```bash
npm run build
```

Deploy `dist/` folder to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**
- Any static hosting service

## Contributing

When adding new features:

1. Create feature folder in `src/features/`
2. Implement custom hook for data management
3. Build UI components
4. Add routes if needed
5. Update types in `src/types/`
6. Test with multiple data states (empty, partial, full)

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
