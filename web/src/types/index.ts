export interface Skill {
  id: string
  name: string
  category_name: string
  slug: string
  description: string
  reference_url: string
}

export interface ActivityType {
  slug: string
  name: string
  weight_multiplier: number
}

export interface UserActivity {
  id: string
  skill_name: string
  skill_category: string
  activity_name: string
  level: number
  description: string
  date: string
}
