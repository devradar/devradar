import { useState, useMemo, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { useJournalStore } from '@/stores/useJournalStore';
import type { UserActivity } from '@/types';
import { SKILLS_CONFIG, ACTIVITY_TYPES_CONFIG } from '@/config/skills-config';
import styles from './JournalDialog.module.scss';

const LEVEL_OPTIONS = [
    { value: 1, label: 'Novice', description: 'Just starting out' },
    { value: 2, label: 'Beginner', description: 'Learning the basics' },
    { value: 3, label: 'Competent', description: 'Can work independently' },
    { value: 4, label: 'Proficient', description: 'Deep understanding' },
    { value: 5, label: 'Expert', description: 'Mastery level' },
];

interface JournalDialogProps {
    addEntry: (entry: Omit<UserActivity, 'id' | 'created_at' | 'updated_at'>) => void;
    updateEntry: (id: string, updates: Partial<Omit<UserActivity, 'id' | 'created_at'>>) => void;
}

export function JournalDialog({ addEntry, updateEntry }: JournalDialogProps) {
    const { isAddDialogOpen, editingEntry, closeAddDialog } = useJournalStore();

    const [skillName, setSkillName] = useState(editingEntry?.skill_name || '');
    const [skillCategoryFilter, setSkillCategoryFilter] = useState(editingEntry?.skill_category || 'all');
    const [activityName, setActivityName] = useState(editingEntry?.activity_name || '');
    const [level, setLevel] = useState(editingEntry?.level || 3);
    const [description, setDescription] = useState(editingEntry?.description || '');
    const [date, setDate] = useState(editingEntry?.date || new Date().toISOString().split('T')[0]);

    // Reset form when dialog opens/closes or when editing a different entry
    useEffect(() => {
        if (isAddDialogOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSkillName(editingEntry?.skill_name || '');
            setSkillCategoryFilter(editingEntry?.skill_category || 'all');
            setActivityName(editingEntry?.activity_name || '');
            setLevel(editingEntry?.level || 3);
            setDescription(editingEntry?.description || '');
            setDate(editingEntry?.date || new Date().toISOString().split('T')[0]);
        }
    }, [isAddDialogOpen, editingEntry]);

    const availableCategories = useMemo(() => {
        const categories = new Set(SKILLS_CONFIG.map(s => s.category_name));
        return ['all', ...Array.from(categories).sort()];
    }, []);

    const filteredSkills = useMemo(() => {
        if (skillCategoryFilter === 'all') return SKILLS_CONFIG;
        return SKILLS_CONFIG.filter(s => s.category_name === skillCategoryFilter);
    }, [skillCategoryFilter]);

    const selectedSkill = useMemo(() => {
        return SKILLS_CONFIG.find(s => s.name === skillName);
    }, [skillName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!skillName || !activityName || !description.trim() || !date) {
            return;
        }

        const skillCategory = selectedSkill?.category_name || 'Unknown';

        if (editingEntry) {
            updateEntry(editingEntry.id, {
                skill_name: skillName,
                skill_category: skillCategory,
                activity_name: activityName,
                level,
                description: description.trim(),
                date,
            });
        } else {
            addEntry({
                skill_name: skillName,
                skill_category: skillCategory,
                activity_name: activityName,
                level,
                description: description.trim(),
                date,
            });
        }

        closeAddDialog();
    };

    if (!isAddDialogOpen) return null;

    return (
        <div className={styles.overlay} onClick={closeAddDialog}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {editingEntry ? 'EDIT' : 'NEW'} <span>ENTRY</span>
                    </h2>
                    <button className={styles.closeButton} onClick={closeAddDialog}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} key={editingEntry?.id || 'new'}>
                    {/* Area 1: Skill Selection */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Which skill did you practice?</h3>
                            <p className={styles.sectionSubtitle}>Select the skill you worked on</p>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="category-filter" className={styles.label}>
                                Filter by Category
                            </label>
                            <div className={styles.categoryFilters}>
                                {availableCategories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        className={`${styles.categoryFilterBtn} ${skillCategoryFilter === category ? styles.categoryFilterBtnActive : ''}`}
                                        onClick={() => setSkillCategoryFilter(category)}
                                    >
                                        {category === 'all' ? 'All' : category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="skill" className={styles.label}>
                                Skill *
                            </label>
                            <select
                                id="skill"
                                value={skillName}
                                onChange={(e) => setSkillName(e.target.value)}
                                className={styles.select}
                                required
                            >
                                <option value="">Select a skill</option>
                                {filteredSkills.map((skill) => (
                                    <option key={skill.id} value={skill.name}>
                                        {skill.name}
                                    </option>
                                ))}
                            </select>
                            {selectedSkill && (
                                <div className={styles.skillInfo}>
                                    <span className={styles.skillCategory}>{selectedSkill.category_name}</span>
                                    <span className={styles.skillDescription}>{selectedSkill.description}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Area 2: Activity Details */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>What did you do?</h3>
                            <p className={styles.sectionSubtitle}>Tell us about the context and your experience</p>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="date" className={styles.label}>
                                <Calendar size={14} />
                                <span>When did this happen? *</span>
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={styles.input}
                                max={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="activity" className={styles.label}>
                                In what context? *
                            </label>
                            <select
                                id="activity"
                                value={activityName}
                                onChange={(e) => setActivityName(e.target.value)}
                                className={styles.select}
                                required
                            >
                                <option value="">Select activity context</option>
                                {ACTIVITY_TYPES_CONFIG.map((activity) => (
                                    <option key={activity.slug} value={activity.name}>
                                        {activity.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="level" className={styles.label}>
                                Your proficiency level *
                            </label>
                            <div className={styles.levelGrid}>
                                {LEVEL_OPTIONS.map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={`${styles.levelOption} ${level === opt.value ? styles.levelOptionActive : ''}`}
                                        onClick={() => setLevel(opt.value)}
                                    >
                                        <div className={styles.levelNumber}>{opt.value}</div>
                                        <div className={styles.levelLabel}>{opt.label}</div>
                                        <div className={styles.levelDescription}>{opt.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="description" className={styles.label}>
                                What exactly did you do? *
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your activities, challenges faced, what you learned, outcomes achieved..."
                                className={styles.textarea}
                                required
                                rows={6}
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button type="button" className={styles.btnCancel} onClick={closeAddDialog}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.btnSubmit}>
                            {editingEntry ? 'Update' : 'Save'} Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
