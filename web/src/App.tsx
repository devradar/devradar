import React, { useEffect } from 'react';
import { Radar } from 'lucide-react';
import { useThemeStore } from './stores/useThemeStore';
import { ThemeToggle } from './components/ThemeToggle';
import { JournalPage } from './features/journal/JournalPage';
import styles from './App.module.scss';

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme;
  }, [theme]);

  return (
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
            <a href="#journal">Journal</a>
            <a href="#skills">Skills</a>
            <a href="#stats">Stats</a>
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
        <JournalPage />
      </main>

      <div className={styles.scanLine}></div>
    </div>
  );
};

export default App;