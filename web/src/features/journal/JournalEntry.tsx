import { Pencil, Trash2 } from 'lucide-react';
import type { UserActivity } from '@/types';
import { useJournalStore } from '@/stores/useJournalStore';
import styles from './JournalEntry.module.scss';

interface JournalEntryProps {
    entry: UserActivity;
    onDelete: (id: string) => void;
    onSkillClick?: (skillName: string) => void;
}

const LEVEL_LABELS = ['', 'Novice', 'Beginner', 'Competent', 'Proficient', 'Expert'];

export function JournalEntry({ entry, onDelete, onSkillClick }: JournalEntryProps) {
    const { openEditDialog } = useJournalStore();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this entry?')) {
            onDelete(entry.id);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.badges}>
                    <span
                        className={styles.badgeSkill}
                        onClick={() => onSkillClick?.(entry.skill_name)}
                        style={{ cursor: onSkillClick ? 'pointer' : 'default' }}
                    >
                        {entry.skill_name}
                    </span>
                    <span className={styles.badgeCategory}>{entry.skill_category}</span>
                    <span className={styles.badgeActivity}>{entry.activity_name}</span>
                    <span className={styles.badgeLevel}>{LEVEL_LABELS[entry.level]}</span>
                </div>
                <p className={styles.date}>
                    {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </p>
            </div>

            <div className={styles.content}>
                <p>{entry.description}</p>
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.btnEdit}
                    onClick={() => openEditDialog(entry)}
                >
                    <Pencil size={14} />
                    <span>Edit</span>
                </button>
                <button
                    className={styles.btnDelete}
                    onClick={handleDelete}
                >
                    <Trash2 size={14} />
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}
