import React, { useMemo } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { SkillCard } from './SkillCard'
import { useSkills } from '@/hooks/useSkills'
import { useSkillsStore } from '@/stores/useSkillsStore'
import styles from './SkillsList.module.scss'
import type { Skill } from '@/types'

interface UserSkill extends Skill {
  is_custom: boolean
  activity_count?: number
  last_practiced?: string
}

export const SkillsList: React.FC = () => {
  const { skills, isLoading, categories, deleteSkill, getSkillsByCategory } = useSkills()
  const { selectedCategory, setCategory, openAddDialog, openEditDialog } = useSkillsStore()

  const { practicedSkills, unpracticedSkills } = useMemo(() => {
    const filtered = getSkillsByCategory(selectedCategory)
    const practiced = filtered
      .filter((s) => (s.activity_count || 0) > 0)
      .sort((a, b) => (b.activity_count || 0) - (a.activity_count || 0))
    const unpracticed = filtered
      .filter((s) => (s.activity_count || 0) === 0)
      .sort((a, b) => a.name.localeCompare(b.name))
    return { practicedSkills: practiced, unpracticedSkills: unpracticed }
  }, [selectedCategory, getSkillsByCategory])

  const stats = useMemo(() => {
    const totalSkills = skills.length
    const customSkills = skills.filter((s) => s.is_custom).length
    const practicedSkills = skills.filter((s) => (s.activity_count || 0) > 0).length
    const totalActivities = skills.reduce((sum, s) => sum + (s.activity_count || 0), 0)

    return { totalSkills, customSkills, practicedSkills, totalActivities }
  }, [skills])

  const handleEdit = (skill: UserSkill) => {
    openEditDialog(skill.id)
  }

  const handleDelete = (skillId: string) => {
    if (confirm('Are you sure you want to delete this custom skill?')) {
      deleteSkill(skillId)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading skills...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            SKILL <span className={styles.titleAccent}>SUMMARY</span>
          </h1>
          <p className={styles.subtitle}>Skill Tracking & Proficiency</p>
        </div>
        <button className={styles.addButton} onClick={openAddDialog}>
          <Plus size={20} />
          Add Custom
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Total Skills</div>
          <div className={styles.statValue}>{stats.totalSkills}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Practiced</div>
          <div className={styles.statValue}>{stats.practicedSkills}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Custom</div>
          <div className={styles.statValue}>{stats.customSkills}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Activities</div>
          <div className={styles.statValue}>{stats.totalActivities}</div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterLabel}>Filter by Category</div>
        <div className={styles.filterButtons}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {practicedSkills.length === 0 && unpracticedSkills.length === 0 ? (
        <div className={styles.empty}>
          <BookOpen size={48} className={styles.emptyIcon} />
          <div className={styles.emptyText}>No skills found</div>
          <div className={styles.emptyHint}>
            {selectedCategory === 'all'
              ? 'Add your first custom skill to get started'
              : 'No skills in this category'}
          </div>
        </div>
      ) : (
        <>
          {practicedSkills.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleAccent}>{'>'}</span> Practiced Skills
                <span className={styles.count}>({practicedSkills.length})</span>
              </h2>
              <div className={styles.grid}>
                {practicedSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {unpracticedSkills.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleAccent}>{'>'}</span> Available Skills
                <span className={styles.count}>({unpracticedSkills.length})</span>
              </h2>
              <div className={styles.grid}>
                {unpracticedSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
