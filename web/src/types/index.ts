export interface Skill {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  reference_url: string
  created_at: string
  updated_at: string
  category_name: string
}

export interface ActivityType {
  slug: string
  name: string
  weight_multiplier: number
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  skill_name: string
  skill_category: string
  activity_name: string
  level: number
  description: string
  date: string
  created_at: string
  updated_at: string
}
