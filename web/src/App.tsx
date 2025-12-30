import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useThemeStore } from './stores/useThemeStore'
import { Layout } from './components/Layout'
import { JournalPage } from './features/journal/JournalPage'
import { SkillsPage } from './features/skills/SkillsPage'
import { SkillRadarPage } from './features/radar/SkillRadarPage'
import { StatsPage } from './features/stats/StatsPage'
import { SettingsPage } from './features/settings/SettingsPage'

const App = () => {
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme
  }, [theme])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/journal" replace />} />
          <Route path="/radar" element={<SkillRadarPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/summary" element={<SkillsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
