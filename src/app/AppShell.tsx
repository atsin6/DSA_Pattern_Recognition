import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Topbar } from '../shared/ui/Topbar'
import { Sidebar } from '../shared/ui/Sidebar'
import { ComparePage } from '../features/compare/pages/ComparePage'
import { DecisionPage } from '../features/framework/pages/DecisionPage'
import { DPOverviewPage } from '../features/patterns/pages/DPOverviewPage'
import { HomePage } from '../features/patterns/pages/HomePage'
import { PatternPage } from '../features/patterns/pages/PatternPage'
import { FRAMEWORK_IDS } from '../features/patterns/data/pattern-config'
import { getPatternById, patternMap } from '../features/patterns/data/patterns'
import styles from './AppShell.module.css'

interface ThemeState {
  theme: 'light' | 'dark'
}

function resolvePageId(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname === '/framework/decision') return 'decision'
  if (pathname === '/framework/compare') return 'compare'
  if (pathname.startsWith('/patterns/')) {
    const patternId = decodeURIComponent(pathname.replace('/patterns/', ''))
    return patternMap[patternId] ? patternId : 'home'
  }
  return 'home'
}

function PatternRoute() {
  const { patternId } = useParams<{ patternId: string }>()
  const pattern = getPatternById(patternId)

  if (!pattern) {
    return (
      <section className={styles.notFoundCard}>
        <h2>Pattern not found</h2>
        <p>That route does not match an existing pattern.</p>
      </section>
    )
  }

  if (pattern.dpOverview) {
    return <DPOverviewPage pattern={pattern} />
  }

  return <PatternPage pattern={pattern} />
}

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [{ theme }, setTheme] = useState<ThemeState>(() => {
    const saved = window.localStorage.getItem('dsa-theme')
    return { theme: saved === 'light' ? 'light' : 'dark' }
  })

  useEffect(() => {
    window.localStorage.setItem('dsa-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  const activePageId = useMemo(() => resolvePageId(location.pathname), [location.pathname])
  const activeSectionLabel = patternMap[activePageId]?.label ?? 'Framework'
  const searchQuery = searchParams.get('q') ?? ''
  const isFrameworkPage = FRAMEWORK_IDS.includes(activePageId as (typeof FRAMEWORK_IDS)[number])

  const handleSearchChange = (value: string) => {
    const trimmed = value.trim()
    const nextSearch = trimmed ? `?q=${encodeURIComponent(trimmed)}` : ''
    navigate({ pathname: '/', search: nextSearch })
  }

  const toggleTheme = () => {
    setTheme((prev) => ({ theme: prev.theme === 'dark' ? 'light' : 'dark' }))
  }

  return (
    <div className={`${styles.shell} ${theme === 'dark' ? styles.themeDark : styles.themeLight}`}>
      <Topbar
        activePageId={activePageId}
        activeSectionLabel={activeSectionLabel}
        isFrameworkPage={isFrameworkPage}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        isMobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
      />

      <div className={styles.layout}>
        <Sidebar activePageId={activePageId} mobileOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />

        {mobileNavOpen && <button aria-label="Close navigation" className={styles.backdrop} onClick={() => setMobileNavOpen(false)} type="button" />}

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
            <Route path="/framework/decision" element={<DecisionPage />} />
            <Route path="/framework/compare" element={<ComparePage />} />
            <Route path="/patterns/:patternId" element={<PatternRoute />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
