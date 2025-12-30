import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../stores/useThemeStore'
import styles from './ThemeToggle.module.scss'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <Sun size={20} className={styles.icon} />
      ) : (
        <Moon size={20} className={styles.icon} />
      )}
    </button>
  )
}
