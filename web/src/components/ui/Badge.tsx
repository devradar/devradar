import React from 'react'
import styles from './Badge.module.scss'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const badgeClass = `${styles.badge} ${styles[variant]} ${styles[size]} ${className}`

  return <span className={badgeClass}>{children}</span>
}
