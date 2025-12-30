import type { UserActivity } from '@/types'

const STORAGE_KEY = 'devradar_journal'

interface JournalStorage {
  entries: UserActivity[]
  lastId: number
}

function getStorage(): JournalStorage {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { entries: [], lastId: 0 }
  }
  try {
    return JSON.parse(raw)
  } catch {
    return { entries: [], lastId: 0 }
  }
}

function setStorage(data: JournalStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const storageService = {
  getAllEntries(): UserActivity[] {
    return getStorage().entries
  },

  getPaginatedEntries(
    page: number,
    pageSize: number,
    categoryFilter?: string,
    skillNameFilter?: string
  ): UserActivity[] {
    const allEntries = getStorage().entries
    // Filter by category if provided
    let filtered = categoryFilter
      ? allEntries.filter((e) => e.skill_category === categoryFilter)
      : allEntries
    // Filter by skill name if provided
    if (skillNameFilter) {
      filtered = filtered.filter((e) => e.skill_name === skillNameFilter)
    }
    // Sort by date DESC (newest first), then by skill name alphabetically
    const sorted = [...filtered].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (dateCompare !== 0) return dateCompare
      return a.skill_name.localeCompare(b.skill_name)
    })
    const start = page * pageSize
    return sorted.slice(start, start + pageSize)
  },

  getTotalCount(categoryFilter?: string, skillNameFilter?: string): number {
    const allEntries = getStorage().entries
    let filtered = categoryFilter
      ? allEntries.filter((e) => e.skill_category === categoryFilter)
      : allEntries
    if (skillNameFilter) {
      filtered = filtered.filter((e) => e.skill_name === skillNameFilter)
    }
    return filtered.length
  },

  addEntry(entry: Omit<UserActivity, 'id' | 'created_at' | 'updated_at'>): UserActivity {
    const storage = getStorage()
    const now = new Date().toISOString()
    const newEntry: UserActivity = {
      ...entry,
      id: `local-${storage.lastId + 1}`,
      created_at: now,
      updated_at: now
    }
    storage.entries.push(newEntry)
    storage.lastId += 1
    setStorage(storage)
    return newEntry
  },

  updateEntry(
    id: string,
    updates: Partial<Omit<UserActivity, 'id' | 'created_at'>>
  ): UserActivity | null {
    const storage = getStorage()
    const index = storage.entries.findIndex((e) => e.id === id)
    if (index === -1) return null

    const updated: UserActivity = {
      ...storage.entries[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    storage.entries[index] = updated
    setStorage(storage)
    return updated
  },

  deleteEntry(id: string): boolean {
    const storage = getStorage()
    const filtered = storage.entries.filter((e) => e.id !== id)
    if (filtered.length === storage.entries.length) return false
    storage.entries = filtered
    setStorage(storage)
    return true
  },

  exportData(): string {
    const storage = getStorage()
    return JSON.stringify(storage, null, 2)
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as JournalStorage
      if (!Array.isArray(data.entries) || typeof data.lastId !== 'number') {
        return false
      }
      setStorage(data)
      return true
    } catch {
      return false
    }
  }
}
