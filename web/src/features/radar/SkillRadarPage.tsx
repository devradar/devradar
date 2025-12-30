import React, { useState } from 'react'
import { SKILL_LEVEL_DEFINITIONS } from '@/config/app-config'
import { useSkills } from '@/hooks/useSkills'
import styles from './SkillRadarPage.module.scss'
import type { Skill } from '@/types'

interface TooltipData {
    skill: string
    x: number
    y: number
}

export const SkillRadarPage: React.FC = () => {
    const hashString = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    const getSkillPosition = (skill: Skill & { last_level: number }, skillsInSameArea: (Skill)[], index: number) => {
        const categoryIndex = categories.indexOf(skill.category_name);
        if (categoryIndex === -1) return null;

        const level = skill.last_level || 1;
        const ringIndex = rings - level;

        const innerRadius = ringIndex === 0 ? pointRadius : ringRadii[ringIndex - 1];
        const outerRadius = ringRadii[ringIndex];
        const ringThickness = outerRadius - innerRadius;

        const quadrantAngleStart = (categoryIndex * 360) / quadrants;
        const quadrantAngleRange = 360 / quadrants;

        const hash = hashString(skill.id + skill.name);
        const total = skillsInSameArea.length;

        const cols = Math.max(1, Math.ceil(Math.sqrt(total * 1.5)));
        const rows = Math.max(1, Math.ceil(total / cols));

        const col = index % cols;
        const row = Math.floor(index / cols);

        const angleMargin = 0.05;
        const radiusMargin = 0.1;

        const usableAngleRange = quadrantAngleRange * (1 - 2 * angleMargin);
        const usableRadiusRange = ringThickness * (1 - 2 * radiusMargin);

        const angleStep = usableAngleRange / cols;
        const radiusStep = usableRadiusRange / rows;

        const angleJitter = ((hash % 100) / 100 - 0.5) * angleStep * 0.25;
        const radiusJitter = (((hash >> 8) % 100) / 100 - 0.5) * radiusStep * 0.25;

        const angle = quadrantAngleStart + (quadrantAngleRange * angleMargin) + (col * angleStep) + (angleStep / 2) + angleJitter;
        const radius = innerRadius + (ringThickness * radiusMargin) + (row * radiusStep) + (radiusStep / 2) + radiusJitter;

        const angleRad = ((angle - 90) * Math.PI) / 180;
        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);

        return { x, y };
    };
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);

    const centerX = 500
    const centerY = 500
    const maxRadius = 450
    const rings = 5
    const pointRadius = 18

    const categories = ['Frameworks', 'Languages & Tools', 'Platforms', 'Patterns & Practices']
    const quadrants = categories.length

    const { skills } = useSkills()
    const practicedSkills = skills.filter(s => (s.activity_count || 0) > 0 && s.last_level)
    const skillsByCategory = practicedSkills.reduce((acc, skill) => {
        const cat = skill.category_name
        const level = skill.last_level || 1
        const key = `${cat}-${level}`
        if (!acc[key]) acc[key] = []
        acc[key].push(skill as Skill & { last_level: number })
        return acc
    }, {} as Record<string, (Skill & { last_level: number })[]>);
    const ringRadii = Array.from({ length: rings }, (_, i) =>
        maxRadius * ((i + 1) / rings)
    );
    const ringLabels = SKILL_LEVEL_DEFINITIONS.map(def => def.label).reverse();

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
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {ringRadii.map((radius, index) => (
                        <circle
                            key={`ring-${index}`}
                            cx={centerX}
                            cy={centerY}
                            r={radius}
                            fill="none"
                            stroke={index === rings - 1 ? '#00e676' : '#666'}
                            strokeWidth={index === rings - 1 ? 3 : 2}
                            opacity={0.6 + (index * 0.08)}
                            filter={index === rings - 1 ? 'url(#glow)' : 'none'}
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

                    {Array.from({ length: quadrants }, (_, i) => {
                        const angle = (i * 360) / quadrants
                        const angleRad = ((angle - 90) * Math.PI) / 180
                        const x2 = centerX + maxRadius * Math.cos(angleRad)
                        const y2 = centerY + maxRadius * Math.sin(angleRad)

                        return (
                            <line
                                key={`quadrant-${i}`}
                                x1={centerX}
                                y1={centerY}
                                x2={x2}
                                y2={y2}
                                stroke="#555"
                                strokeWidth={1.5}
                                opacity={0.7}
                            />
                        )
                    })}

                    {categories.map((category, i) => {
                        const angle = (i * 360) / quadrants + (360 / quadrants / 2)
                        const angleRad = ((angle - 90) * Math.PI) / 180
                        const labelRadius = maxRadius + 50
                        const x = centerX + labelRadius * Math.cos(angleRad)
                        const y = centerY + labelRadius * Math.sin(angleRad)

                        return (
                            <text
                                key={`category-${i}`}
                                x={x}
                                y={y}
                                fontSize="16"
                                fontWeight="700"
                                fill="#00e676"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ textTransform: 'uppercase' }}
                            >
                                {category}
                            </text>
                        )
                    })}

                    {Object.entries(skillsByCategory).flatMap(([_, categorySkills]) =>
                        categorySkills.map((skill, index) => {
                            const position = getSkillPosition(skill, categorySkills, index)
                            if (!position) return null

                            return (
                                <g
                                    key={`skill-${skill.id}`}
                                    onMouseEnter={() => setTooltip({ skill: skill.name, x: position.x, y: position.y })}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <circle
                                        cx={position.x}
                                        cy={position.y}
                                        r={pointRadius}
                                        fill="#00e676"
                                        stroke="#000"
                                        strokeWidth={1.5}
                                        opacity={0.9}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <text
                                        x={position.x}
                                        y={position.y}
                                        fontSize="14"
                                        fontWeight="700"
                                        fill="#000"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {skill.name.charAt(0).toUpperCase()}
                                    </text>
                                </g>
                            )
                        })
                    )}

                    {tooltip && (
                        <g>
                            <rect
                                x={tooltip.x - 50}
                                y={tooltip.y - 40}
                                width={100}
                                height={28}
                                rx={4}
                                fill="#000"
                                opacity={0.9}
                            />
                            <text
                                x={tooltip.x}
                                y={tooltip.y - 26}
                                fontSize="13"
                                fontWeight="600"
                                fill="#00e676"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ pointerEvents: 'none' }}
                            >
                                {tooltip.skill}
                            </text>
                        </g>
                    )}
                </svg>
            </div>
            <div style={{ maxWidth: 900, margin: '2rem auto 0', background: '#181f1b', borderRadius: 12, boxShadow: '0 2px 12px #0002', padding: '1.5rem' }}>
                <h2 style={{ color: '#00e676', fontWeight: 700, fontSize: 22, marginBottom: 16, letterSpacing: 1 }}>Skill Data Points</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #222' }}>
                            <th style={{ textAlign: 'left', color: '#00e676', padding: '8px 6px' }}>Skill</th>
                            <th style={{ textAlign: 'left', color: '#00e676', padding: '8px 6px' }}>Level</th>
                            <th style={{ textAlign: 'left', color: '#00e676', padding: '8px 6px' }}>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {practicedSkills.map(skill => (
                            <tr key={skill.id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '8px 6px', color: '#fff' }}>{skill.name}</td>
                                <td style={{ padding: '8px 6px', color: '#fff' }}>{skill.last_level}</td>
                                <td style={{ padding: '8px 6px', color: '#fff' }}>{skill.category_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
