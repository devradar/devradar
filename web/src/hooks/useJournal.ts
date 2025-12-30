import { useState, useCallback, useMemo } from 'react';
import { storageService } from '@/services/storage-service';
import type { UserActivity } from '@/types';

const PAGE_SIZE = 20;

export function useJournal() {
    const [page, setPage] = useState(0);
    const [entries, setEntries] = useState<UserActivity[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [skillNameFilter, setSkillNameFilter] = useState<string | null>(null);

    const loadMore = useCallback(() => {
        const newEntries = storageService.getPaginatedEntries(
            page,
            PAGE_SIZE,
            categoryFilter === 'all' ? undefined : categoryFilter,
            skillNameFilter || undefined
        );
        if (newEntries.length < PAGE_SIZE) {
            setHasMore(false);
        }
        setEntries((prev) => [...prev, ...newEntries]);
        setPage((p) => p + 1);
        setIsInitialized(true);
    }, [page, categoryFilter, skillNameFilter]);

    const refresh = useCallback(() => {
        setPage(0);
        setEntries([]);
        setHasMore(true);
        const newEntries = storageService.getPaginatedEntries(
            0,
            PAGE_SIZE,
            categoryFilter === 'all' ? undefined : categoryFilter,
            skillNameFilter || undefined
        );
        setEntries(newEntries);
        setPage(1);
        setHasMore(newEntries.length === PAGE_SIZE);
        setIsInitialized(true);
    }, [categoryFilter, skillNameFilter]);

    const addEntry = useCallback((entry: Omit<UserActivity, 'id' | 'created_at' | 'updated_at'>) => {
        storageService.addEntry(entry);
        refresh();
    }, [refresh]);

    const updateEntry = useCallback((id: string, updates: Partial<Omit<UserActivity, 'id' | 'created_at'>>) => {
        storageService.updateEntry(id, updates);
        refresh();
    }, [refresh]);

    const deleteEntry = useCallback((id: string) => {
        storageService.deleteEntry(id);
        refresh();
    }, [refresh]);

    const totalCount = useMemo(() =>
        storageService.getTotalCount(
            categoryFilter === 'all' ? undefined : categoryFilter,
            skillNameFilter || undefined
        ),
        [categoryFilter, skillNameFilter]
    );

    const availableCategories = useMemo(() => {
        const allEntries = storageService.getAllEntries();
        const categories = new Set(allEntries.map(e => e.skill_category).filter(Boolean));
        return ['all', ...Array.from(categories).sort()];
    }, []);

    const setCategory = useCallback((category: string) => {
        setCategoryFilter(category);
        // Reset and reload immediately with new filter
        const newEntries = storageService.getPaginatedEntries(
            0,
            PAGE_SIZE,
            category === 'all' ? undefined : category,
            skillNameFilter || undefined
        );
        setEntries(newEntries);
        setPage(1);
        setHasMore(newEntries.length === PAGE_SIZE);
        setIsInitialized(true);
    }, [skillNameFilter]);

    const setSkillName = useCallback((skillName: string | null) => {
        setSkillNameFilter(skillName);
        if (skillName) {
            // Reset category filter to 'all' when filtering by skill
            setCategoryFilter('all');
        }
        // Reset and reload immediately with new filter
        const newEntries = storageService.getPaginatedEntries(
            0,
            PAGE_SIZE,
            skillName ? undefined : categoryFilter === 'all' ? undefined : categoryFilter,
            skillName || undefined
        );
        setEntries(newEntries);
        setPage(1);
        setHasMore(newEntries.length === PAGE_SIZE);
        setIsInitialized(true);
    }, [categoryFilter]);

    return {
        entries,
        hasMore,
        totalCount,
        isInitialized,
        loadMore,
        refresh,
        addEntry,
        updateEntry,
        deleteEntry,
        categoryFilter,
        setCategory,
        availableCategories,
        skillNameFilter,
        setSkillName,
    };
}
