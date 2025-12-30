import { create } from 'zustand'
import type { UserActivity } from '@/types'

interface JournalStore {
  // Dialog state
  isAddDialogOpen: boolean
  editingEntry: UserActivity | null
  preselectedSkillName: string | null

  // Actions
  openAddDialog: (skillName?: string) => void
  closeAddDialog: () => void
  openEditDialog: (entry: UserActivity) => void
  closeEditDialog: () => void
}

export const useJournalStore = create<JournalStore>((set) => ({
  isAddDialogOpen: false,
  editingEntry: null,
  preselectedSkillName: null,

  openAddDialog: (skillName?: string) =>
    set({ isAddDialogOpen: true, editingEntry: null, preselectedSkillName: skillName || null }),
  closeAddDialog: () => set({ isAddDialogOpen: false, preselectedSkillName: null }),
  openEditDialog: (entry) =>
    set({ isAddDialogOpen: true, editingEntry: entry, preselectedSkillName: null }),
  closeEditDialog: () =>
    set({ isAddDialogOpen: false, editingEntry: null, preselectedSkillName: null })
}))
