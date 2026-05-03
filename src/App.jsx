import { useEffect, useState } from 'react'
import patterns, { patternMap, FRAMEWORK_IDS } from './data/patterns'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import HomePage from './components/HomePage'
import DecisionPage from './components/DecisionPage'
import ComparePage from './components/ComparePage'
import PatternPage from './components/PatternPage'
import DPOverviewPage from './components/DPOverviewPage'

export default function App() {
  const [activePageId, setActivePageId] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('dsa-theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    window.localStorage.setItem('dsa-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const handleSearch = (value) => {
    setSearchQuery(value)
    if (value.trim()) {
      setActivePageId('home')
    }
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const activeSectionLabel = patternMap[activePageId]?.label ?? 'Pattern Map'

  function renderPage(id) {
    if (id === 'home') return <HomePage onNavigate={setActivePageId} searchQuery={searchQuery} />
    if (id === 'decision') return <DecisionPage />
    if (id === 'compare') return <ComparePage />

    const pattern = patternMap[id]
    if (!pattern) return null

    if (pattern.dpOverview) {
      return <DPOverviewPage pattern={pattern} onNavigate={setActivePageId} />
    }

    return <PatternPage pattern={pattern} />
  }

  // All page IDs: framework + all patterns
  const allPageIds = [...FRAMEWORK_IDS, ...patterns.map((p) => p.id)]

  return (
    <div className={`legacy-shell theme-${theme}`}>
      <Topbar
        activePageId={activePageId}
        onNavigate={setActivePageId}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeSectionLabel={activeSectionLabel}
      />

      <div className="layout">
        <Sidebar activePageId={activePageId} onNavigate={setActivePageId} />

        <main className="main">
          {allPageIds.map((id) => (
            <div
              key={id}
              className={`page ${activePageId === id ? 'active' : ''}`}
              id={`page-${id}`}
            >
              {activePageId === id && renderPage(id)}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
