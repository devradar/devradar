import { useEffect, useRef } from 'react'
import { Plus, Filter } from 'lucide-react'
import type { UserActivity } from '@/types'
import { JournalEntry } from './JournalEntry'
import { useJournalStore } from '@/stores/useJournalStore'
import styles from './JournalList.module.scss'

interface JournalListProps {
  entries: UserActivity[]
  hasMore: boolean
  isInitialized: boolean
  loadMore: () => void
  deleteEntry: (id: string) => void
  categoryFilter: string
  setCategory: (category: string) => void
  availableCategories: string[]
  skillNameFilter: string | null
  setSkillName: (skillName: string | null) => void
}

export function JournalList({
  entries,
  hasMore,
  isInitialized,
  loadMore,
  deleteEntry,
  categoryFilter,
  setCategory,
  availableCategories,
  skillNameFilter,
  setSkillName
}: JournalListProps) {
  const { openAddDialog } = useJournalStore()
  const observerTarget = useRef<HTMLDivElement>(null)

  const handleAddEntry = () => {
    openAddDialog(skillNameFilter || undefined)
  }

  useEffect(() => {
    if (!isInitialized) {
      loadMore()
    }
  }, [isInitialized, loadMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loadMore])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            SKILL <span className={styles.titleAccent}>JOURNAL</span>
          </h1>
          <p className={styles.subtitle}>Track your learning journey</p>
        </div>
        <button className={styles.addButton} onClick={handleAddEntry}>
          <Plus size={20} strokeWidth={3} />
          <span>New Entry</span>
        </button>
      </div>

      {availableCategories.length > 1 && (
        <div className={styles.filterBar}>
          {skillNameFilter ? (
            <div className={styles.filterRow}>
              <div className={styles.filterLabel}>
                <Filter size={16} />
                <span>Filtered by skill:</span>
              </div>
              <div className={styles.filterBadge}>
                <span>{skillNameFilter}</span>
                <button
                  className={styles.filterBadgeRemove}
                  onClick={() => setSkillName(null)}
                  aria-label="Remove filter"
                >
                  ×
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.filterRow}>
              <div className={styles.filterLabel}>
                <Filter size={16} />
                <span>Filter by category:</span>
              </div>
              <div className={styles.filterButtons}>
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    className={`${styles.filterButton} ${categoryFilter === category ? styles.filterButtonActive : ''}`}
                    onClick={() => setCategory(category)}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.entriesList}>
        {entries.map((entry) => (
          <JournalEntry
            key={entry.id}
            entry={entry}
            onDelete={deleteEntry}
            onSkillClick={setSkillName}
          />
        ))}
      </div>

      {hasMore && entries.length > 0 && (
        <div ref={observerTarget} className={styles.loading}>
          <div className={styles.loadingDot} />
          <p>Loading more entries...</p>
        </div>
      )}

      {!hasMore && entries.length > 0 && (
        <p className={styles.endMessage}>
          End of journal • {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      )}

      {entries.length === 0 && isInitialized && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No journal entries yet</p>
          <p className={styles.emptySubtitle}>Start tracking your skills and learning activities</p>
          <button className={styles.emptyButton} onClick={handleAddEntry}>
            Create your first entry
          </button>
        </div>
      )}
    </div>
  )
}
