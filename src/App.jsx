import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const LEGACY_SOURCE = '/legacy-content.html'
const FRAMEWORK_PAGE_IDS = ['home', 'decision', 'compare']

function setupLegacyHandlers() {
  window.showPage = function showPage(id) {
    document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'))
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'))

    const page = document.getElementById(`page-${id}`)
    if (page) {
      page.classList.add('active')
    }

    const nav = document.querySelector(`[data-page="${id}"]`)
    if (nav) {
      nav.classList.add('active')
      nav.scrollIntoView({ block: 'nearest' })
    }
  }

  window.handleSearch = function handleSearch(query) {
    const normalizedQuery = query.toLowerCase().trim()

    if (!normalizedQuery) {
      document.querySelectorAll('.pattern-card').forEach((card) => {
        card.style.display = ''
      })
      return
    }

    document.querySelectorAll('.pattern-card').forEach((card) => {
      const text = card.textContent.toLowerCase()
      card.style.display = text.includes(normalizedQuery) ? '' : 'none'
    })

    window.showPage('home')
  }
}

function cleanupLegacyHandlers() {
  delete window.showPage
  delete window.handleSearch
}

function normalizeProblemTables() {
  const problemTables = Array.from(document.querySelectorAll('.prob-table')).filter((table) =>
    table.querySelector('td.prob-name'),
  )

  problemTables.forEach((table) => {
    const rows = Array.from(table.querySelectorAll('tr'))
    if (!rows.length) {
      return
    }

    rows[0].innerHTML =
      '<th>Problem no.</th><th>Problem name</th><th>Difficulty</th><th>Key Insight</th>'

    for (let index = 1; index < rows.length; index += 1) {
      const row = rows[index]
      const cells = row.querySelectorAll('td')

      if (cells.length < 3) {
        continue
      }

      const difficultyCell = cells[0]
      const problemCell = cells[1]
      const insightCell = cells[2]
      const rawProblemText = problemCell.textContent.trim()
      const match = rawProblemText.match(/^(.*)\((\d+)\)\s*$/)
      const problemNo = match ? match[2] : '—'
      const problemName = match ? match[1].trim() : rawProblemText
      const searchQuery = match ? `${problemNo} ${problemName}` : problemName
      const problemLink = `https://leetcode.com/problemset/?search=${encodeURIComponent(searchQuery)}`

      row.innerHTML = ''

      const numberTd = document.createElement('td')
      numberTd.className = 'prob-no'
      numberTd.textContent = problemNo

      const nameTd = document.createElement('td')
      nameTd.className = 'prob-name'
      const anchor = document.createElement('a')
      anchor.className = 'lc-link'
      anchor.href = problemLink
      anchor.target = '_blank'
      anchor.rel = 'noreferrer noopener'
      anchor.textContent = problemName
      nameTd.appendChild(anchor)

      const difficultyTd = document.createElement('td')
      difficultyTd.className = difficultyCell.className
      difficultyTd.innerHTML = difficultyCell.innerHTML

      const insightTd = document.createElement('td')
      insightTd.className = insightCell.className
      insightTd.innerHTML = insightCell.innerHTML

      row.append(numberTd, nameTd, difficultyTd, insightTd)
    }
  })
}

function getActiveSectionLabel() {
  const activeNav = document.querySelector('.nav-item.active')
  if (!activeNav) {
    return 'Pattern Map'
  }
  return activeNav.textContent.replace(/\s+/g, ' ').trim()
}

function getActivePageId() {
  const activeNav = document.querySelector('.nav-item.active')
  if (!activeNav) {
    return 'home'
  }
  return activeNav.getAttribute('data-page') ?? 'home'
}

function extractFrameworkTabs() {
  const frameworkPages = new Set(FRAMEWORK_PAGE_IDS)
  return Array.from(document.querySelectorAll('.nav-item'))
    .filter((item) => frameworkPages.has(item.getAttribute('data-page')))
    .map((item) => {
      const pageId = item.getAttribute('data-page') ?? ''
      const label = item.textContent.replace(/\s+/g, ' ').trim()
      const dotElement = item.querySelector('.nav-dot')
      const color = dotElement ? window.getComputedStyle(dotElement).backgroundColor : 'var(--blue)'
      return { id: pageId, label, color }
    })
}

function decorateSidebarNavigation() {
  const sidebar = document.querySelector('.sidebar')
  if (!sidebar) {
    return
  }

  const overviewPages = new Set(['home', 'decision', 'compare'])
  sidebar.querySelectorAll('.nav-item').forEach((item) => {
    const page = item.getAttribute('data-page')
    const isOverview = overviewPages.has(page)
    item.classList.toggle('nav-item-overview', isOverview)
    item.classList.toggle('nav-item-topic', !isOverview)
  })

  const sections = Array.from(sidebar.querySelectorAll('.sidebar-section'))
  sections.forEach((section) => {
    const text = section.textContent.trim().toLowerCase()
    const isOverview = text === 'overview'
    section.classList.toggle('sidebar-section-overview', isOverview)
    section.classList.toggle('sidebar-section-topics', !isOverview)
  })

  const hasTopicDivider = sidebar.querySelector('.topic-divider')
  const firstTopicSection = sections.find((section) => section.classList.contains('sidebar-section-topics'))
  if (!hasTopicDivider && firstTopicSection) {
    const divider = document.createElement('div')
    divider.className = 'topic-divider'
    divider.textContent = 'Topic Library'
    sidebar.insertBefore(divider, firstTopicSection)
  }
}

export default function App() {
  const [legacyStyles, setLegacyStyles] = useState('')
  const [legacyMarkup, setLegacyMarkup] = useState('')
  const [loadError, setLoadError] = useState('')
  const [topbarElement, setTopbarElement] = useState(null)
  const [activeSection, setActiveSection] = useState('Pattern Map')
  const [activePageId, setActivePageId] = useState('home')
  const [frameworkTabs, setFrameworkTabs] = useState([])
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('dsa-theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    let mounted = true

    setupLegacyHandlers()

    fetch(LEGACY_SOURCE)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load legacy content (${response.status})`)
        }
        return response.text()
      })
      .then((htmlText) => {
        if (!mounted) {
          return
        }

        const doc = new DOMParser().parseFromString(htmlText, 'text/html')

        doc.querySelectorAll('script').forEach((scriptEl) => scriptEl.remove())

        const styleText = doc.querySelector('style')?.textContent ?? ''
        const bodyHtml = doc.body?.innerHTML ?? ''

        setLegacyStyles(styleText)
        setLegacyMarkup(bodyHtml)
      })
      .catch((error) => {
        if (mounted) {
          setLoadError(error.message)
        }
      })

    return () => {
      mounted = false
      cleanupLegacyHandlers()
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('dsa-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!legacyMarkup) {
      return
    }

    setTopbarElement(document.querySelector('.topbar'))
    normalizeProblemTables()
    decorateSidebarNavigation()
    setFrameworkTabs(extractFrameworkTabs())
    setActiveSection(getActiveSectionLabel())
    setActivePageId(getActivePageId())
  }, [legacyMarkup])

  useEffect(() => {
    if (!legacyMarkup) {
      return
    }

    const sidebar = document.querySelector('.sidebar')
    if (!sidebar) {
      return
    }

    const syncActiveSection = () => {
      setActiveSection(getActiveSectionLabel())
      setActivePageId(getActivePageId())
    }

    const observer = new MutationObserver(syncActiveSection)
    observer.observe(sidebar, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })
    sidebar.addEventListener('click', syncActiveSection)

    return () => {
      observer.disconnect()
      sidebar.removeEventListener('click', syncActiveSection)
    }
  }, [legacyMarkup])

  if (loadError) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Failed to load content</h1>
        <p>{loadError}</p>
      </main>
    )
  }

  return (
    <>
      <style>{legacyStyles}</style>
      <style>{`
        body[data-theme='dark'] {
          background: #000 !important;
          color: #f4f4f5;
          transition: background-color 0.45s ease, color 0.45s ease;
        }

        body[data-theme='light'] {
          background: #f4f4f5 !important;
          color: #111827;
          transition: background-color 0.45s ease, color 0.45s ease;
        }

        .legacy-shell.theme-dark {
          --bg: #000000;
          --bg2: #0a0a0a;
          --bg3: #121212;
          --border: #202020;
          --border2: #2a2a2a;
          --text: #f4f4f5;
          --text2: #b4b4b8;
          --text3: #8a8a8f;
          --blue: #7aa2ff;
          --blue-bg: #101827;
          --blue-text: #c4d6ff;
          --green: #a1a1aa;
          --green-bg: #161616;
          --green-text: #d4d4d8;
          --amber: #a1a1aa;
          --amber-bg: #161616;
          --amber-text: #d4d4d8;
          --red: #a1a1aa;
          --red-bg: #161616;
          --red-text: #d4d4d8;
          --purple: #a1a1aa;
          --purple-bg: #161616;
          --purple-text: #d4d4d8;
          --teal: #a1a1aa;
          --teal-bg: #161616;
          --teal-text: #d4d4d8;
          --coral: #a1a1aa;
          --coral-bg: #161616;
          --coral-text: #d4d4d8;
          --radius: 6px;
          --radius-lg: 10px;
        }

        .legacy-shell.theme-light {
          --bg: #f4f4f5;
          --bg2: #ffffff;
          --bg3: #f9fafb;
          --border: #e5e7eb;
          --border2: #d1d5db;
          --text: #111827;
          --text2: #4b5563;
          --text3: #6b7280;
          --blue: #2563eb;
          --blue-bg: #dbeafe;
          --blue-text: #1e40af;
          --green: #6b7280;
          --green-bg: #f3f4f6;
          --green-text: #374151;
          --amber: #6b7280;
          --amber-bg: #f3f4f6;
          --amber-text: #374151;
          --red: #6b7280;
          --red-bg: #f3f4f6;
          --red-text: #374151;
          --purple: #6b7280;
          --purple-bg: #f3f4f6;
          --purple-text: #374151;
          --teal: #6b7280;
          --teal-bg: #f3f4f6;
          --teal-text: #374151;
          --coral: #6b7280;
          --coral-bg: #f3f4f6;
          --coral-text: #374151;
          --radius: 6px;
          --radius-lg: 10px;
        }

        .legacy-shell .topbar {
          padding: 12px 20px;
          gap: 12px;
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .legacy-shell .topbar h1 {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .legacy-shell .badge {
          font-size: 10px;
          letter-spacing: 0.02em;
          border-radius: 999px;
          padding: 4px 10px;
        }

        .legacy-shell .search-wrap input {
          width: 240px;
          height: 34px;
          padding-top: 6px;
          padding-bottom: 6px;
          border-radius: 10px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .legacy-shell .topbar .search-wrap {
          display: flex;
          align-items: center;
          order: 3;
          margin-left: 0;
          margin-right: 0;
        }

        .legacy-shell .search-wrap input:focus {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--blue) 18%, transparent);
        }

        .legacy-shell .main {
          padding: 24px 28px 30px;
        }

        .legacy-shell .sidebar {
          width: 228px;
          padding: 12px 8px 18px;
        }

        .legacy-shell .sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .legacy-shell .sidebar::-webkit-scrollbar-thumb {
          background: var(--border2);
          border-radius: 999px;
        }

        .legacy-shell .card,
        .legacy-shell .vs-card,
        .legacy-shell .pattern-card,
        .legacy-shell .quick-table,
        .legacy-shell .decision-tree {
          box-shadow: none !important;
          border-width: 1px !important;
          border-radius: 12px;
          transition: border-color 0.22s ease, transform 0.22s ease, background-color 0.22s ease;
        }

        .legacy-shell .card:hover,
        .legacy-shell .vs-card:hover,
        .legacy-shell .pattern-card:hover {
          transform: translateY(-1px);
          border-color: color-mix(in srgb, var(--blue) 40%, var(--border));
        }

        .legacy-shell .card,
        .legacy-shell .vs-card {
          padding: 16px;
        }

        .legacy-shell .page-title {
          font-size: 22px;
          letter-spacing: -0.01em;
        }

        .legacy-shell .section-title {
          font-size: 12px;
          letter-spacing: 0.06em;
          margin-bottom: 10px;
        }

        .legacy-shell .tag {
          border-radius: 999px;
          padding: 3px 9px;
          font-size: 10px;
          font-weight: 500;
        }

        .legacy-shell .sidebar-section {
          padding: 10px 14px 6px;
        }

        .legacy-shell .sidebar-section-overview {
          color: var(--blue);
          letter-spacing: 0.09em;
          display: none;
        }

        .legacy-shell .sidebar-section-topics {
          color: var(--text3);
          letter-spacing: 0.1em;
        }

        .legacy-shell .topic-divider {
          margin: 10px 12px 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text3);
          border-top: 1px solid var(--border);
          padding-top: 10px;
        }

        .legacy-shell .nav-item {
          margin: 2px 4px;
          border-left: none;
          border-radius: 8px;
          padding: 8px 10px;
        }

        .legacy-shell .nav-item-overview {
          display: none;
        }

        .legacy-shell .nav-item-topic {
          margin: 2px 4px;
        }

        .legacy-shell .nav-item.active {
          border-left-color: transparent;
          box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--blue) 40%, transparent);
        }

        .legacy-shell .page {
          display: none;
          opacity: 0;
          transform: translateY(4px);
        }

        .legacy-shell .page.active {
          display: block;
          opacity: 1;
          transform: translateY(0);
          animation: pageFadeIn 0.32s ease;
        }

        .legacy-shell .page.active > * {
          max-width: 1180px;
        }

        @keyframes pageFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .legacy-shell.theme-light .use-box.yes {
          background: #ecfdf3;
          border: 1px solid #1e4a30;
        }

        .legacy-shell.theme-light .use-box.no {
          background: #fef2f2;
          border: 1px solid #4a1e1e;
        }

        .legacy-shell.theme-light .use-box.yes .use-label {
          color: #166534;
        }

        .legacy-shell.theme-light .use-box.no .use-label {
          color: #991b1b;
        }

        .legacy-shell.theme-light .use-box.yes li {
          color: #14532d;
        }

        .legacy-shell.theme-light .use-box.no li {
          color: #7f1d1d;
        }

        .legacy-shell.theme-dark .use-box.yes {
          background: #0f2a1b;
          border: 1px solid #1e4a30;
        }

        .legacy-shell.theme-dark .use-box.no {
          background: #2a1010;
          border: 1px solid #4a1e1e;
        }

        .legacy-shell.theme-dark .use-box.yes .use-label {
          color: #86efac;
        }

        .legacy-shell.theme-dark .use-box.no .use-label {
          color: #fca5a5;
        }

        .legacy-shell.theme-dark .use-box.yes li {
          color: #bbf7d0;
        }

        .legacy-shell.theme-dark .use-box.no li {
          color: #fecaca;
        }

        .legacy-shell .theme-toggle-btn {
          margin-left: 0;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .legacy-shell .topbar-context {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: auto;
          order: 2;
        }

        .legacy-shell .topbar-toggle-wrap {
          display: flex;
          align-items: center;
          order: 4;
          margin-left: 8px;
        }

        .legacy-shell .framework-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 6px;
        }

        .legacy-shell .framework-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 34px;
          border: 1px solid var(--border2);
          border-radius: 999px;
          background: var(--bg3);
          color: var(--text2);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.01em;
          padding: 0 12px;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .legacy-shell .framework-tab-btn:hover {
          border-color: var(--blue);
          color: var(--text);
          transform: translateY(-1px);
        }

        .legacy-shell .framework-tab-btn.active {
          border-color: color-mix(in srgb, var(--blue) 55%, var(--border2));
          background: color-mix(in srgb, var(--blue) 14%, var(--bg2));
          color: var(--text);
        }

        .legacy-shell .framework-tab-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legacy-shell .active-section-pill {
          border: 1px solid var(--border2);
          background: var(--bg3);
          color: var(--text2);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 500;
          padding: 6px 10px;
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .legacy-shell .theme-toggle-track {
          position: relative;
          display: block;
          width: 58px;
          height: 34px;
          border-radius: 999px;
          background: var(--bg3);
          border: 1px solid var(--border2);
          transition: background-color 0.4s ease, border-color 0.4s ease;
        }

        .legacy-shell .theme-toggle-btn:hover .theme-toggle-track {
          border-color: var(--blue);
        }

        .legacy-shell .theme-toggle-thumb {
          position: absolute;
          top: 3px;
          left: 2px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--text);
          transition: transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.4s ease;
        }

        .legacy-shell.theme-dark .theme-toggle-thumb {
          transform: translateX(27px);
        }

        .legacy-shell .theme-toggle-icon {
          position: absolute;
          top: 9px;
          width: 14px;
          height: 14px;
          color: var(--text2);
          transition: color 0.35s ease, opacity 0.35s ease;
        }

        .legacy-shell .theme-toggle-sun {
          left: 8px;
        }

        .legacy-shell .theme-toggle-moon {
          right: 8px;
        }

        .legacy-shell.theme-light .theme-toggle-sun {
          color: #1d4ed8;
          opacity: 1;
        }

        .legacy-shell.theme-light .theme-toggle-moon {
          color: #374151;
          opacity: 0.82;
        }

        .legacy-shell.theme-dark .theme-toggle-sun {
          color: #e4e4e7;
          opacity: 0.82;
        }

        .legacy-shell.theme-dark .theme-toggle-moon {
          color: #93c5fd;
          opacity: 1;
        }

        .legacy-shell .prob-no {
          width: 94px;
          white-space: nowrap;
          font-family: var(--mono);
          color: var(--text2);
        }

        .legacy-shell .prob-table th {
          font-size: 10px;
          letter-spacing: 0.08em;
          padding-top: 9px;
          padding-bottom: 9px;
          background: var(--bg3);
        }

        .legacy-shell .prob-table td {
          padding-top: 9px;
          padding-bottom: 9px;
        }

        .legacy-shell .prob-table tr:nth-child(2n + 1) td {
          background: color-mix(in srgb, var(--bg3) 45%, transparent);
        }

        .legacy-shell .prob-table tr:hover td {
          background: color-mix(in srgb, var(--blue) 8%, var(--bg2));
        }

        .legacy-shell .lc-link {
          color: var(--text);
          text-decoration: none;
          border-bottom: 1px dashed transparent;
          transition: border-color 0.15s ease, color 0.15s ease;
          font-weight: 500;
        }

        .legacy-shell .lc-link:hover {
          color: var(--blue);
          border-bottom-color: var(--blue);
        }

        .legacy-shell .cards-grid {
          gap: 16px;
          margin-bottom: 22px;
        }

        .legacy-shell .page-subtitle {
          margin-top: 4px;
          color: var(--text2);
        }

        @media (max-width: 900px) {
          .legacy-shell .search-wrap input {
            width: 180px;
          }

          .legacy-shell .topbar-context {
            gap: 8px;
          }

          .legacy-shell .framework-tabs {
            display: none;
          }

          .legacy-shell .active-section-pill {
            display: none;
          }
        }
      `}</style>
      <div className={`legacy-shell theme-${theme}`}>
        {topbarElement &&
          createPortal(
            <>
              <div className="topbar-context">
                {frameworkTabs.length > 0 && (
                  <div className="framework-tabs">
                    {frameworkTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`framework-tab-btn ${activePageId === tab.id ? 'active' : ''}`}
                        onClick={() => window.showPage(tab.id)}
                      >
                        <span className="framework-tab-dot" style={{ background: tab.color }} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
                {!FRAMEWORK_PAGE_IDS.includes(activePageId) && (
                  <span className="active-section-pill" title={activeSection}>
                    {activeSection}
                  </span>
                )}
              </div>
              <div className="topbar-toggle-wrap">
                <button
                  type="button"
                  className="theme-toggle-btn"
                  aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                  onClick={() => setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))}
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
            </>,
            topbarElement,
          )}
        <div dangerouslySetInnerHTML={{ __html: legacyMarkup }} />
      </div>
    </>
  )
}
