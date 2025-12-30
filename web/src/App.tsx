import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Radar } from 'lucide-react';
import { useThemeStore } from './stores/useThemeStore';
import { ThemeToggle } from './components/ThemeToggle';
import { JournalPage } from './features/journal/JournalPage';
import { SkillsPage } from './features/skills/SkillsPage';
import { StatsPage } from './features/stats/StatsPage';
import styles from './App.module.scss';

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.navContainer}>
            {/* LOGO SECTION */}
            <div className={styles.logo}>
              <div className={styles.iconWrapper}>
                <Radar size={20} strokeWidth={3} />
              </div>
              <span className={styles.brandName}>Devradar</span>
            </div>

            {/* MIDDLE NAVIGATION */}
            <div className={styles.navLinks}>
              <NavLink to="/journal">Journal</NavLink>
              <NavLink to="/skills">Skills</NavLink>
              <NavLink to="/stats">Stats</NavLink>
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

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/journal" replace />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>

        <div className={styles.scanLine}></div>
      </div>
    </BrowserRouter>
  );
};

export default App;