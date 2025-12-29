import React, { useEffect, useState } from 'react';
import { Radar, Settings, Activity } from 'lucide-react';
import { useThemeStore } from './stores/useThemeStore';
import { ThemeToggle } from './components/ThemeToggle';
import styles from './App.module.scss';

const App = () => {
  const [users, setUsers] = useState([]);
  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    fetch('http://localhost:8080/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

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
            <a href="#nodes">Nodes</a>
            <a href="#network">Network</a>
            <a href="#logs">Logs</a>
          </div>

          {/* SYSTEM STATUS & SETTINGS */}
          <div className="flex items-center gap-6">
            <div className={styles.systemStatus}>
              <div className={styles.statusDot} />
              <span>SYS_ACTIVE</span>
            </div>
            <ThemeToggle />
            <Settings
              size={20}
              className="text-white/20 hover:text-white transition-colors cursor-pointer"
            />
          </div>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.hero}>
          <h1>DEVRADAR <span>NODES</span></h1>
          <p>Scanning local cluster for active developer entities</p>
        </header>

        <section className={styles.grid}>
          {/* Main Data Panel */}
          <div className={styles.userCard}>
            <div className="flex items-center gap-2 mb-8" style={{ color: 'var(--color-accent-green)' }}>
              <Activity size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Active Personnel</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Full Name</th>
                  <th>Contact Registry</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02]">
                    <td className="font-mono" style={{ color: 'var(--color-accent-green)' }}>[{user.id.toString().padStart(3, '0')}]</td>
                    <td className="font-bold tracking-tight">{user.name}</td>
                    <td className="text-gray-400">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Metrics Panel */}
          <aside className={styles.statusSidebar}>
            <div>
              <h2>Radar<br />Status</h2>
              <p className="text-[10px] font-bold uppercase opacity-60 mt-2">Frequency: 2.4ghz / Active</p>
            </div>
            <div>
              <div className={styles.count}>{users.length}</div>
              <p className="text-xs font-bold uppercase tracking-widest">Entities Located</p>
            </div>
          </aside>
        </section>
      </main>

      <div className={styles.scanLine}></div>
    </div>
  );
};

export default App;