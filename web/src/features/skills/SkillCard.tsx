import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '@/stores/useJournalStore';
import styles from './SkillCard.module.scss';
import type { Skill } from '@/types';

interface UserSkill extends Skill {
    is_custom: boolean;
    activity_count?: number;
    last_practiced?: string;
    last_level?: number;
}

interface SkillCardProps {
    skill: UserSkill;
    onEdit: (skill: UserSkill) => void;
    onDelete: (skillId: string) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const { openAddDialog } = useJournalStore();
    const activityCount = skill.activity_count || 0;

    // Use the level from the most recent journal entry
    const proficiencyLevel = skill.last_level || 0;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    const handleCardClick = () => {
        if (activityCount > 0) {
            // For practiced skills: navigate to filtered journal view
            navigate(`/journal?skill=${encodeURIComponent(skill.name)}`);
        } else {
            // For unpracticed skills: open journal entry dialog with skill pre-selected
            openAddDialog(skill.name);
        }
    };

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation(); // Prevent card click when clicking action buttons
        action();
    };

    return (
        <div className={styles.skillCard} onClick={handleCardClick}>
            <div className={styles.header}>
                <h3 className={styles.skillName}>{skill.name}</h3>
                {skill.is_custom && <span className={styles.customBadge}>CUSTOM</span>}
            </div>

            <div className={styles.content}>
                <div className={styles.category}>{skill.category_name}</div>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Activities</span>
                        <span className={styles.statValue}>{activityCount}</span>
                    </div>
                    {activityCount > 0 && (
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Level</span>
                            <span className={styles.statValue}>{proficiencyLevel}</span>
                        </div>
                    )}
                </div>

                {activityCount > 0 && (
                    <>
                        <div className={styles.proficiency}>
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.proficiencyBar} ${i < proficiencyLevel ? styles.active : ''}`}
                                />
                            ))}
                        </div>
                        <div className={styles.lastPracticed}>
                            Last: {formatDate(skill.last_practiced)}
                        </div>
                    </>
                )}

                {skill.is_custom && (
                    <div className={styles.actions}>
                        <button
                            className={styles.actionBtn}
                            onClick={(e) => handleActionClick(e, () => onEdit(skill))}
                            title="Edit skill"
                        >
                            <Edit2 size={14} />
                            Edit
                        </button>
                        <button
                            className={`${styles.actionBtn} ${styles.delete}`}
                            onClick={(e) => handleActionClick(e, () => onDelete(skill.id))}
                            title="Delete skill"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
