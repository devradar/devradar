import { StorageService } from './storage.service';
import { SKILLS_CONFIG } from '@/config/skills-config';
import type { Skill } from '@/types';

const STORAGE_KEY = 'devradar_skills';

interface UserSkill extends Skill {
    is_custom: boolean;
    activity_count?: number;
    last_practiced?: string;
}

class SkillsStorageService extends StorageService<UserSkill> {
    constructor() {
        super(STORAGE_KEY);
        this.initializeDefaultSkills();
    }

    private initializeDefaultSkills(): void {
        const existing = this.getAll();
        if (existing.length === 0) {
            // Initialize with predefined skills from config
            const storage = { items: [] as UserSkill[], lastId: 0 };
            SKILLS_CONFIG.forEach((skill) => {
                storage.items.push({
                    ...skill,
                    is_custom: false,
                    activity_count: 0,
                });
            });
            storage.lastId = SKILLS_CONFIG.length;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
        }
    }

    getAllSkills(): UserSkill[] {
        return this.getAll();
    }

    getSkillsByCategory(category: string): UserSkill[] {
        return this.getAll().filter((skill) => skill.category_name === category);
    }

    getSkillByName(name: string): UserSkill | null {
        return this.getAll().find((skill) => skill.name === name) || null;
    }

    addCustomSkill(skill: Omit<UserSkill, 'id' | 'created_at' | 'updated_at' | 'is_custom'>): UserSkill {
        const now = new Date().toISOString();
        return this.add({
            ...skill,
            created_at: now,
            updated_at: now,
            is_custom: true,
            activity_count: 0,
        });
    }

    updateSkill(id: string, updates: Partial<Omit<UserSkill, 'id' | 'created_at' | 'is_custom'>>): UserSkill | null {
        const now = new Date().toISOString();
        return this.update(id, {
            ...updates,
            updated_at: now,
        });
    }

    deleteCustomSkill(id: string): boolean {
        const skill = this.getById(id);
        if (!skill || !skill.is_custom) {
            return false; // Cannot delete predefined skills
        }
        return this.delete(id);
    }

    getCategories(): string[] {
        const skills = this.getAll();
        const categories = new Set(skills.map((s) => s.category_name));
        return Array.from(categories).sort();
    }

    updateActivityCount(skillName: string, count: number, lastPracticed: string): void {
        const skill = this.getSkillByName(skillName);
        if (skill) {
            this.updateSkill(skill.id, {
                activity_count: count,
                last_practiced: lastPracticed,
            });
        }
    }
}

export const skillsService = new SkillsStorageService();
