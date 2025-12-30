/**
 * Generic LocalStorage abstraction layer
 * Provides type-safe CRUD operations for any data structure
 */

export interface StorageSchema<T> {
    items: T[];
    lastId: number;
}

export class StorageService<T extends { id: string }> {
    private readonly storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    private getStorage(): StorageSchema<T> {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) {
            return { items: [], lastId: 0 };
        }
        try {
            return JSON.parse(raw);
        } catch {
            return { items: [], lastId: 0 };
        }
    }

    private setStorage(data: StorageSchema<T>): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getAll(): T[] {
        return this.getStorage().items;
    }

    getById(id: string): T | null {
        const storage = this.getStorage();
        return storage.items.find((item) => item.id === id) || null;
    }

    add(item: Omit<T, 'id'>): T {
        const storage = this.getStorage();
        const newItem = {
            ...item,
            id: `local-${storage.lastId + 1}`,
        } as T;
        storage.items.push(newItem);
        storage.lastId += 1;
        this.setStorage(storage);
        return newItem;
    }

    update(id: string, updates: Partial<Omit<T, 'id'>>): T | null {
        const storage = this.getStorage();
        const index = storage.items.findIndex((item) => item.id === id);
        if (index === -1) return null;

        const updated = {
            ...storage.items[index],
            ...updates,
        } as T;
        storage.items[index] = updated;
        this.setStorage(storage);
        return updated;
    }

    delete(id: string): boolean {
        const storage = this.getStorage();
        const filtered = storage.items.filter((item) => item.id !== id);
        if (filtered.length === storage.items.length) return false;
        storage.items = filtered;
        this.setStorage(storage);
        return true;
    }

    clear(): void {
        this.setStorage({ items: [], lastId: 0 });
    }

    exportData(): string {
        return JSON.stringify(this.getStorage(), null, 2);
    }

    importData(jsonData: string): boolean {
        try {
            const data = JSON.parse(jsonData);
            this.setStorage(data);
            return true;
        } catch {
            return false;
        }
    }
}
