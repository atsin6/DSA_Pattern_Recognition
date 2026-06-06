import { NavLink } from 'react-router-dom'
import { FRAMEWORK_TABS } from '../../features/patterns/data/pattern-config'
import styles from './Topbar.module.css'

interface TopbarProps {
  activePageId: string
  activeSectionLabel: string
  isFrameworkPage: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  isMobileNavOpen: boolean
  onToggleMobileNav: () => void
}

export function Topbar({
  activePageId,
  activeSectionLabel,
  isFrameworkPage,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  isMobileNavOpen,
  onToggleMobileNav,
}: TopbarProps) {
  void activePageId
  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.mobileMenuButton}
        aria-label={isMobileNavOpen ? 'Close topic navigation' : 'Open topic navigation'}
        aria-expanded={isMobileNavOpen}
        onClick={onToggleMobileNav}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={styles.brandWrap}>
        <h1>DSA Pattern Recognition</h1>
        <span className={styles.badge}>Interview Cheat Sheet</span>
      </div>

      <div className={styles.contextWrap}>
        <nav aria-label="Framework tabs" className={styles.frameworkTabs}>
          {FRAMEWORK_TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) => `${styles.frameworkTabButton} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.frameworkDot} style={{ background: tab.color }} />
              {tab.label}
            </NavLink>
          ))}
        </nav>

        {!isFrameworkPage && <span className={styles.activeSectionPill}>{activeSectionLabel}</span>}
      </div>

      <div className={styles.rightActions}>
        <label className={styles.searchWrap}>
          <span className={styles.srOnly}>Search patterns</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search patterns, signals, problems..."
            aria-label="Search patterns"
          />
        </label>

        <button
          type="button"
          className={styles.themeToggleButton}
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <span className={styles.themeTrack}>
            <span className={styles.themeText}>☀</span>
            <span className={styles.themeText}>☾</span>
            <span className={`${styles.themeThumb} ${theme === 'dark' ? styles.dark : ''}`} />
          </span>
        </button>
      </div>
    </header>
  )
}
