import { useState, useEffect, useCallback } from 'react'

/**
 * Generic hook for localStorage persistence
 * Provides type-safe read/write operations with automatic JSON serialization
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue
        setValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error)
      }
    },
    [key, value]
  )

  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setValue(initialValue)
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [value, setStoredValue, clearValue] as const
}

/**
 * Hook for managing collections with automatic ID generation
 * Perfect for managing arrays of objects with CRUD operations
 */
export function useLocalStorageCollection<T extends { id: string }>(
  key: string,
  initialItems: T[] = []
) {
  const [items, setItems, clearItems] = useLocalStorage(key, initialItems)

  const addItem = useCallback(
    (item: Omit<T, 'id'>) => {
      const newItem = {
        ...item,
        id: crypto.randomUUID()
      } as T

      setItems((prev) => [...prev, newItem])
      return newItem
    },
    [setItems]
  )

  const updateItem = useCallback(
    (id: string, updates: Partial<Omit<T, 'id'>>) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    },
    [setItems]
  )

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    },
    [setItems]
  )

  const getItem = useCallback(
    (id: string) => {
      return items.find((item) => item.id === id) || null
    },
    [items]
  )

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    setItems,
    clearItems
  }
}
