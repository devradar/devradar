import { useState, useCallback, useEffect, useMemo } from 'react'
import { skillsService } from '@/services/skills.service'
import { storageService as journalService } from '@/services/storage-service'
import type { Skill } from '@/types'

interface UserSkill extends Skill {
  is_custom: boolean
  activity_count?: number
  last_practiced?: string
  last_level?: number
}

export function useSkills() {
  const [skills, setSkills] = useState<UserSkill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadSkills = useCallback(() => {
    setIsLoading(true)
    const allSkills = skillsService.getAllSkills()

    // Calculate activity counts from journal entries
    const journalEntries = journalService.getAllEntries()
    const skillStats = new Map<
      string,
      { count: number; lastPracticed: string; lastLevel: number }
    >()

    journalEntries.forEach((entry) => {
      const existing = skillStats.get(entry.skill_name)
      if (!existing || new Date(entry.date) > new Date(existing.lastPracticed)) {
        skillStats.set(entry.skill_name, {
          count: (existing?.count || 0) + 1,
          lastPracticed: entry.date,
          lastLevel: entry.level
        })
      } else {
        skillStats.set(entry.skill_name, {
          ...existing,
          count: existing.count + 1
        })
      }
    })

    // Update skills with activity data
    const enrichedSkills = allSkills.map((skill) => {
      const stats = skillStats.get(skill.name)
      return {
        ...skill,
        activity_count: stats?.count || 0,
        last_practiced: stats?.lastPracticed,
        last_level: stats?.lastLevel
      }
    })

    setSkills(enrichedSkills)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadSkills()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addSkill = useCallback(
    (
      skill: Omit<
        UserSkill,
        'id' | 'created_at' | 'updated_at' | 'is_custom' | 'activity_count' | 'last_practiced'
      >
    ) => {
      skillsService.addCustomSkill(skill)
      loadSkills()
    },
    [loadSkills]
  )

  const updateSkill = useCallback(
    (id: string, updates: Partial<Omit<UserSkill, 'id' | 'created_at' | 'is_custom'>>) => {
      skillsService.updateSkill(id, updates)
      loadSkills()
    },
    [loadSkills]
  )

  const deleteSkill = useCallback(
    (id: string) => {
      const success = skillsService.deleteCustomSkill(id)
      if (success) {
        loadSkills()
      }
      return success
    },
    [loadSkills]
  )

  const getSkillsByCategory = useCallback(
    (category: string) => {
      if (category === 'all') return skills
      return skills.filter((skill) => skill.category_name === category)
    },
    [skills]
  )

  const categories = useMemo(() => {
    return ['all', ...skillsService.getCategories()]
  }, [])

  const skillsWithActivity = useMemo(() => {
    return skills
      .filter((s) => (s.activity_count || 0) > 0)
      .sort((a, b) => (b.activity_count || 0) - (a.activity_count || 0))
  }, [skills])

  return {
    skills,
    isLoading,
    categories,
    skillsWithActivity,
    addSkill,
    updateSkill,
    deleteSkill,
    getSkillsByCategory,
    refresh: loadSkills
  }
}
