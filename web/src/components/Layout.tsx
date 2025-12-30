import React from 'react'
import { NavLink } from 'react-router-dom'
import { Radar } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import styles from './Layout.module.scss'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          {/* LOGO SECTION */}
          <div className={styles.logo}>
            <div className={styles.iconWrapper}>
              <Radar size={20} strokeWidth={3} />
            </div>
            <span className={styles.brandName}>DevRadar</span>
          </div>

          {/* MIDDLE NAVIGATION */}
          <div className={styles.navLinks}>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/summary">Summary</NavLink>
            <NavLink to="/stats">Stats</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </div>

          {/* SYSTEM STATUS & THEME TOGGLE */}
          <div className="flex items-center gap-6">
            <div className={styles.systemStatus}>
              <div className={styles.statusDot} />
              <span>SYS_ACTIVE</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className={styles.main}>{children}</main>
    </div>
  )
}
