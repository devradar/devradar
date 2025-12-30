import { create } from 'zustand'

interface SkillsStore {
  // Dialog state
  isAddDialogOpen: boolean
  editingSkillId: string | null

  // Filter state
  selectedCategory: string

  // Actions
  openAddDialog: () => void
  closeAddDialog: () => void
  openEditDialog: (skillId: string) => void
  closeEditDialog: () => void
  setCategory: (category: string) => void
}

export const useSkillsStore = create<SkillsStore>((set) => ({
  isAddDialogOpen: false,
  editingSkillId: null,
  selectedCategory: 'all',

  openAddDialog: () => set({ isAddDialogOpen: true, editingSkillId: null }),
  closeAddDialog: () => set({ isAddDialogOpen: false }),
  openEditDialog: (skillId) => set({ isAddDialogOpen: true, editingSkillId: skillId }),
  closeEditDialog: () => set({ isAddDialogOpen: false, editingSkillId: null }),
  setCategory: (category) => set({ selectedCategory: category })
}))
