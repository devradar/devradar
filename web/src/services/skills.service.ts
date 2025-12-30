import { SKILLS } from '@/config/skills'
import type { Skill } from '@/types'

const STORAGE_KEY = 'devradar_skills'

interface UserSkill extends Skill {
  is_custom: boolean
  activity_count?: number
  last_practiced?: string
}

interface SkillsStorage {
  items: UserSkill[]
  lastId: number
}

function getStorage(): SkillsStorage {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    // Initialize with predefined skills from config on first load
    const storage: SkillsStorage = { items: [], lastId: 0 }
    SKILLS.forEach((skill) => {
      storage.items.push({
        ...skill,
        is_custom: false,
        activity_count: 0
      })
    })
    storage.lastId = SKILLS.length
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
    return storage
  }
  try {
    return JSON.parse(raw)
  } catch {
    return { items: [], lastId: 0 }
  }
}

function setStorage(data: SkillsStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const skillsService = {
  getAllSkills(): UserSkill[] {
    return getStorage().items
  },

  getSkillsByCategory(category: string): UserSkill[] {
    return getStorage().items.filter((skill) => skill.category_name === category)
  },

  getSkillByName(name: string): UserSkill | null {
    return getStorage().items.find((skill) => skill.name === name) || null
  },

  getCategories(): string[] {
    const skills = getStorage().items
    const categories = new Set(skills.map((s) => s.category_name))
    return Array.from(categories).sort()
  },

  addCustomSkill(
    skill: Omit<UserSkill, 'id' | 'is_custom'>
  ): UserSkill {
    const storage = getStorage()
    const newSkill: UserSkill = {
      ...skill,
      id: `custom-${storage.lastId + 1}`,
      is_custom: true
    }
    storage.items.push(newSkill)
    storage.lastId += 1
    setStorage(storage)
    return newSkill
  },

  updateSkill(id: string, updates: Partial<Omit<UserSkill, 'id'>>): UserSkill | null {
    const storage = getStorage()
    const index = storage.items.findIndex((skill) => skill.id === id)
    if (index === -1) return null

    const updated: UserSkill = {
      ...storage.items[index],
      ...updates
    }
    storage.items[index] = updated
    setStorage(storage)
    return updated
  },

  deleteCustomSkill(id: string): boolean {
    const storage = getStorage()
    const skill = storage.items.find((s) => s.id === id)
    if (!skill || !skill.is_custom) {
      return false // Cannot delete predefined skills
    }
    storage.items = storage.items.filter((skill) => skill.id !== id)
    setStorage(storage)
    return true
  },

  updateActivityCount(skillName: string, count: number, lastPracticed: string): void {
    const storage = getStorage()
    const index = storage.items.findIndex((skill) => skill.name === skillName)
    if (index !== -1) {
      storage.items[index] = {
        ...storage.items[index],
        activity_count: count,
        last_practiced: lastPracticed
      }
      setStorage(storage)
    }
  },

  exportData(): string {
    return JSON.stringify(getStorage(), null, 2)
  },

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      setStorage(data)
      return true
    } catch {
      return false
    }
  }
}
