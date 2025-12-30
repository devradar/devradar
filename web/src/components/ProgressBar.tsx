import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
    level: number;
    max?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ level, max = 5 }) => {
    return (
        <div className={styles.proficiency}>
            {[...Array(max)].map((_, i) => (
                <div
                    key={i}
                    className={`${styles.proficiencyBar} ${i < level ? styles.active : ''}`}
                />
            ))}
        </div>
    );
};
