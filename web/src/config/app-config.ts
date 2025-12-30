import type { ActivityType } from '@/types'

export const SKILL_LEVEL_DEFINITIONS = [
    { value: 1, label: 'Novice', description: 'Just starting out' },
    { value: 2, label: 'Beginner', description: 'Learning the basics' },
    { value: 3, label: 'Competent', description: 'Can work independently' },
    { value: 4, label: 'Proficient', description: 'Deep understanding' },
    { value: 5, label: 'Expert', description: 'Mastery level' }
] as const

export const LEVEL_LABELS = [
    '',
    ...SKILL_LEVEL_DEFINITIONS.map((def) => def.label)
] as const

export const ACTIVITY_TYPES_CONFIG: Readonly<ActivityType[]> = [
    {
        slug: 'project-work',
        name: 'Project Work',
        weight_multiplier: 1.5
    },
    {
        slug: 'code-review',
        name: 'Code Review',
        weight_multiplier: 1.2
    },
    {
        slug: 'mentoring',
        name: 'Mentoring',
        weight_multiplier: 1.8
    },
    {
        slug: 'self-study',
        name: 'Self Study',
        weight_multiplier: 0.8
    },
    {
        slug: 'training',
        name: 'Professional Training',
        weight_multiplier: 1.0
    }
] as const

export const SKILL_CATEGORIES = {
    FRAMEWORKS: 'Frameworks',
    PLATFORMS: 'Platforms',
    LANGUAGES_TOOLS: 'Languages & Tools',
    PATTERNS_PRACTICES: 'Patterns & Practices'
} as const
