import { create } from 'zustand';
import type { UserActivity } from '@/types';

interface JournalStore {
    // Dialog state
    isAddDialogOpen: boolean;
    editingEntry: UserActivity | null;

    // Actions
    openAddDialog: () => void;
    closeAddDialog: () => void;
    openEditDialog: (entry: UserActivity) => void;
    closeEditDialog: () => void;
}

export const useJournalStore = create<JournalStore>((set) => ({
    isAddDialogOpen: false,
    editingEntry: null,

    openAddDialog: () => set({ isAddDialogOpen: true, editingEntry: null }),
    closeAddDialog: () => set({ isAddDialogOpen: false }),
    openEditDialog: (entry) => set({ isAddDialogOpen: true, editingEntry: entry }),
    closeEditDialog: () => set({ isAddDialogOpen: false, editingEntry: null }),
}));
