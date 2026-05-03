// Top navigation bar — title, badge, framework tabs, search, theme toggle

import { FRAMEWORK_TABS, FRAMEWORK_IDS } from '../data/patterns'

export default function Topbar({
  activePageId,
  onNavigate,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  activeSectionLabel,
}) {
  const isFrameworkPage = FRAMEWORK_IDS.includes(activePageId)

  return (
    <div className="topbar">
      <h1>DSA Pattern Recognition</h1>
      <span className="badge">Interview Cheat Sheet</span>

      <div className="topbar-context">
        <div className="framework-tabs">
          {FRAMEWORK_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`framework-tab-btn ${activePageId === tab.id ? 'active' : ''}`}
              onClick={() => onNavigate(tab.id)}
            >
              <span className="framework-tab-dot" style={{ background: tab.color }} />
              {tab.label}
            </button>
          ))}
        </div>
        {!isFrameworkPage && (
          <span className="active-section-pill" title={activeSectionLabel}>
            {activeSectionLabel}
          </span>
        )}
      </div>

      <div className="search-wrap">
        <input
          type="text"
          id="searchInput"
          placeholder="Search patterns, problems..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="topbar-toggle-wrap">
        <button
          type="button"
          className="theme-toggle-btn"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={onToggleTheme}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-icon theme-toggle-sun" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4.3" />
                <path d="M12 2.8v2.3M12 18.9v2.3M21.2 12h-2.3M5.1 12H2.8M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6M18.8 18.8l-1.6-1.6M6.8 6.8 5.2 5.2" />
              </svg>
            </span>
            <span className="theme-toggle-icon theme-toggle-moon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M20.3 14.2A8.8 8.8 0 1 1 9.8 3.7a7.1 7.1 0 0 0 10.5 10.5Z" />
              </svg>
            </span>
            <span className="theme-toggle-thumb" />
          </span>
        </button>
      </div>
    </div>
  )
}
