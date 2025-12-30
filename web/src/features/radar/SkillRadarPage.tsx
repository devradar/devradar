import React from 'react'
import { SKILL_LEVEL_DEFINITIONS } from '@/config/app-config'
import styles from './SkillRadarPage.module.scss'

export const SkillRadarPage: React.FC = () => {
    const centerX = 500
    const centerY = 500
    const maxRadius = 450
    const rings = 5

    const ringRadii = Array.from({ length: rings }, (_, i) =>
        maxRadius * ((i + 1) / rings)
    )

    const ringLabels = SKILL_LEVEL_DEFINITIONS.map(def => def.label).reverse()

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.title}>
                        SKILL <span className={styles.titleAccent}>RADAR</span>
                    </h1>
                    <p className={styles.subtitle}>Visual Skill Proficiency Map</p>
                </div>
            </div>
            <div className={styles.radarWrapper}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid meet"
                    className={styles.radar}
                >
                    {ringRadii.map((radius, index) => (
                        <circle
                            key={`ring-${index}`}
                            cx={centerX}
                            cy={centerY}
                            r={radius}
                            fill="none"
                            stroke="#555"
                            strokeWidth={index === rings - 1 ? 2 : 1}
                        />
                    ))}

                    {ringRadii.map((radius, index) => {
                        const angle = -90
                        const angleRad = (angle * Math.PI) / 180
                        const x = centerX + radius * Math.cos(angleRad)
                        const y = centerY + radius * Math.sin(angleRad)

                        return (
                            <text
                                key={`label-${index}`}
                                x={x}
                                y={y - 8}
                                fontSize="13"
                                fontWeight="500"
                                fill="#00e676"
                                textAnchor="middle"
                            >
                                {ringLabels[index]}
                            </text>
                        )
                    })}

                    <line
                        x1={centerX}
                        y1={centerY - maxRadius}
                        x2={centerX}
                        y2={centerY + maxRadius}
                        stroke="#444"
                        strokeWidth={0.5}
                        opacity={0.5}
                    />
                    <line
                        x1={centerX - maxRadius}
                        y1={centerY}
                        x2={centerX + maxRadius}
                        y2={centerY}
                        stroke="#444"
                        strokeWidth={0.5}
                        opacity={0.5}
                    />
                </svg>
            </div>
        </div>
    )
}
