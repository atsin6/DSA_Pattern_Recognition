import { useEffect, useState } from 'react'
import { legacyStyles, legacyTree } from './contentModel'

const FRAMEWORK_PAGE_IDS = ['home', 'decision', 'compare']
const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

const styleCache = new Map()

function parseInlineStyle(styleText = '') {
  if (!styleText) {
    return undefined
  }

  if (styleCache.has(styleText)) {
    return styleCache.get(styleText)
  }

  const styleObject = {}
  styleText
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const separatorIndex = pair.indexOf(':')
      if (separatorIndex < 0) {
        return
      }
      const key = pair.slice(0, separatorIndex).trim()
      const value = pair.slice(separatorIndex + 1).trim()
      if (!key || !value) {
        return
      }
      const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      styleObject[camelKey] = value
    })

  styleCache.set(styleText, styleObject)
  return styleObject
}

function classTokens(className = '') {
  return className.split(/\s+/).filter(Boolean)
}

function hasClass(node, className) {
  return classTokens(node.attrs?.class ?? '').includes(className)
}

function getNodeText(node) {
  if (!node) {
    return ''
  }
  if (node.type === 'text') {
    return node.text
  }
  return (node.children ?? []).map(getNodeText).join('')
}

function parseShowPageTarget(onclick = '') {
  const match = onclick.match(/showPage\('([^']+)'\)/)
  return match ? match[1] : null
}

function normalizeLabel(text) {
  return text.replace(/\s+/g, ' ').trim()
}

function findFirstElement(nodes, predicate) {
  return nodes.find((node) => node.type === 'element' && predicate(node))
}

function extractBaseLayout(tree) {
  const topbarNode = findFirstElement(tree, (node) => hasClass(node, 'topbar'))
  const layoutNode = findFirstElement(tree, (node) => hasClass(node, 'layout'))
  if (!topbarNode || !layoutNode) {
    throw new Error('Could not build layout model from content tree')
  }

  const sidebarNode = findFirstElement(layoutNode.children ?? [], (node) => node.tag === 'nav')
  const mainNode = findFirstElement(layoutNode.children ?? [], (node) => node.tag === 'main')
  if (!sidebarNode || !mainNode) {
    throw new Error('Could not extract sidebar/main from content tree')
  }

  return { topbarNode, sidebarNode, mainNode }
}

function extractTopbarInfo(topbarNode) {
  const titleNode = findFirstElement(topbarNode.children ?? [], (node) => node.tag === 'h1')
  const badgeNode = findFirstElement(topbarNode.children ?? [], (node) => hasClass(node, 'badge'))
  return {
    title: normalizeLabel(getNodeText(titleNode) || 'DSA Pattern Recognition'),
    badge: normalizeLabel(getNodeText(badgeNode) || ''),
  }
}

function extractNavDotColor(navItemNode) {
  const dotNode = findFirstElement(navItemNode.children ?? [], (node) => hasClass(node, 'nav-dot'))
  const style = parseInlineStyle(dotNode?.attrs?.style ?? '')
  return style?.background ?? 'var(--blue)'
}

function extractNavigation(sidebarNode) {
  const sections = []
  const itemsById = {}
  let currentSection = null

  for (const child of sidebarNode.children ?? []) {
    if (child.type !== 'element') {
      continue
    }
    if (hasClass(child, 'sidebar-section')) {
      currentSection = {
        title: normalizeLabel(getNodeText(child)),
        items: [],
      }
      sections.push(currentSection)
      continue
    }
    if (hasClass(child, 'nav-item')) {
      const pageId = child.attrs?.['data-page'] ?? parseShowPageTarget(child.attrs?.onclick ?? '') ?? ''
      if (!pageId) {
        continue
      }
      const item = {
        id: pageId,
        label: normalizeLabel(getNodeText(child)),
        color: extractNavDotColor(child),
        isSub: hasClass(child, 'nav-sub'),
      }
      if (currentSection) {
        currentSection.items.push(item)
      }
      itemsById[item.id] = item
    }
  }

  const frameworkTabs = sections
    .flatMap((section) => section.items)
    .filter((item) => FRAMEWORK_PAGE_IDS.includes(item.id))

  const topicSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !FRAMEWORK_PAGE_IDS.includes(item.id)),
    }))
    .filter((section) => section.items.length > 0)

  return { sections, topicSections, frameworkTabs, itemsById }
}

function extractPages(mainNode) {
  return (mainNode.children ?? [])
    .filter((node) => node.type === 'element' && node.tag === 'div' && hasClass(node, 'page'))
    .map((node) => ({
      id: (node.attrs?.id ?? '').replace(/^page-/, ''),
      node,
    }))
    .filter((page) => page.id)
}

const baseLayout = extractBaseLayout(legacyTree)
const topbarInfo = extractTopbarInfo(baseLayout.topbarNode)
const navigation = extractNavigation(baseLayout.sidebarNode)
const pages = extractPages(baseLayout.mainNode)
const pageIds = new Set(pages.map((page) => page.id))

function toReactProps(node) {
  const props = {}
  for (const [name, rawValue] of Object.entries(node.attrs ?? {})) {
    if (name === 'class' || name === 'style' || name === 'onclick' || name === 'oninput') {
      continue
    }
    const value = rawValue === '' ? true : rawValue
    if (name === 'for') {
      props.htmlFor = value
    } else if (name === 'colspan') {
      props.colSpan = Number(value) || value
    } else if (name === 'rowspan') {
      props.rowSpan = Number(value) || value
    } else if (name === 'tabindex') {
      props.tabIndex = Number(value) || value
    } else {
      props[name] = value
    }
  }

  const styleObject = parseInlineStyle(node.attrs?.style ?? '')
  if (styleObject && Object.keys(styleObject).length > 0) {
    props.style = styleObject
  }
  return props
}

function tableLooksLikeProblemTable(node) {
  if (!hasClass(node, 'prob-table')) {
    return false
  }
  const rows = (node.children ?? []).filter((child) => child.type === 'element' && child.tag === 'tr')
  return rows.some((row) =>
    (row.children ?? []).some((cell) => cell.type === 'element' && hasClass(cell, 'prob-name')),
  )
}

function isDifficultyHeader(rowNode) {
  const headerText = normalizeLabel(getNodeText(rowNode)).toLowerCase()
  return headerText.includes('difficulty') && headerText.includes('problem')
}

function findProblemMeta(problemText) {
  const match = problemText.match(/^(.*)\((\d+)\)\s*$/)
  if (!match) {
    return { number: '—', name: problemText, query: problemText }
  }
  const name = match[1].trim()
  const number = match[2]
  return {
    number,
    name,
    query: `${number} ${name}`,
  }
}

function renderProblemTable(node, context, keyPrefix) {
  const rows = (node.children ?? []).filter((child) => child.type === 'element' && child.tag === 'tr')
  const props = {
    ...toReactProps(node),
    key: keyPrefix,
    className: node.attrs?.class ?? '',
  }

  const bodyRows = rows.filter((row) => !isDifficultyHeader(row))

  return (
    <table {...props}>
      <tr key={`${keyPrefix}-header`}>
        <th>Problem no.</th>
        <th>Problem name</th>
        <th>Difficulty</th>
        <th>Key Insight</th>
      </tr>
      {bodyRows.map((row, rowIndex) => {
        const cells = (row.children ?? []).filter((child) => child.type === 'element' && child.tag === 'td')
        if (cells.length < 3) {
          return renderNode(row, context, `${keyPrefix}-row-${rowIndex}`)
        }

        const difficultyCell = cells[0]
        const problemCell = cells[1]
        const insightCell = cells[2]
        const problemText = normalizeLabel(getNodeText(problemCell))
        const problemMeta = findProblemMeta(problemText)
        const problemLink = `https://leetcode.com/problemset/?search=${encodeURIComponent(problemMeta.query)}`

        return (
          <tr key={`${keyPrefix}-row-${rowIndex}`}>
            <td className="prob-no">{problemMeta.number}</td>
            <td className="prob-name">
              <a className="lc-link" href={problemLink} target="_blank" rel="noreferrer noopener">
                {problemMeta.name}
              </a>
            </td>
            <td className={difficultyCell.attrs?.class ?? ''}>
              {renderNodes(difficultyCell.children ?? [], context, `${keyPrefix}-diff-${rowIndex}`)}
            </td>
            <td className={insightCell.attrs?.class ?? ''}>
              {renderNodes(insightCell.children ?? [], context, `${keyPrefix}-insight-${rowIndex}`)}
            </td>
          </tr>
        )
      })}
    </table>
  )
}

function renderNodes(nodes, context, keyPrefix) {
  return nodes
    .map((node, index) => renderNode(node, context, `${keyPrefix}-${index}`))
    .filter((node) => node !== null)
}

function renderNode(node, context, keyPath) {
  if (node.type === 'text') {
    return node.text
  }

  if (node.type !== 'element') {
    return null
  }

  if (node.tag === 'script') {
    return null
  }

  if (tableLooksLikeProblemTable(node)) {
    return renderProblemTable(node, context, keyPath)
  }

  const props = toReactProps(node)
  props.key = keyPath

  const className = node.attrs?.class ?? ''
  if (className) {
    props.className = className
  }

  const cardTarget = parseShowPageTarget(node.attrs?.onclick ?? '')
  if (hasClass(node, 'pattern-card') && cardTarget && pageIds.has(cardTarget)) {
    const cardText = normalizeLabel(getNodeText(node)).toLowerCase()
    if (context.query && !cardText.includes(context.query)) {
      return null
    }
    props.onClick = () => context.onNavigate(cardTarget)
  }

  const Tag = node.tag
  if (VOID_TAGS.has(node.tag)) {
    return <Tag {...props} />
  }

  return <Tag {...props}>{renderNodes(node.children ?? [], context, keyPath)}</Tag>
}

export default function App() {
  const [activePageId, setActivePageId] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('dsa-theme')
    return savedTheme === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    window.localStorage.setItem('dsa-theme', theme)
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const normalizedQuery = searchQuery.toLowerCase().trim()
  const activeSectionLabel = navigation.itemsById[activePageId]?.label ?? 'Pattern Map'
  const isFrameworkPage = FRAMEWORK_PAGE_IDS.includes(activePageId)

  return (
    <div className={`legacy-shell theme-${theme}`}>
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

        .legacy-shell .nav-item-topic {
          margin: 2px 4px;
        }

        .legacy-shell .nav-sub {
          padding-left: 24px;
          font-size: 12px;
        }

        .legacy-shell .nav-sub .nav-dot {
          width: 5px;
          height: 5px;
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

        .legacy-shell .theme-toggle-btn {
          margin-left: 0;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
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

      <div className="topbar">
        <h1>{topbarInfo.title}</h1>
        {topbarInfo.badge && <span className="badge">{topbarInfo.badge}</span>}

        <div className="topbar-context">
          {navigation.frameworkTabs.length > 0 && (
            <div className="framework-tabs">
              {navigation.frameworkTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`framework-tab-btn ${activePageId === tab.id ? 'active' : ''}`}
                  onClick={() => setActivePageId(tab.id)}
                >
                  <span className="framework-tab-dot" style={{ background: tab.color }} />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
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
            onChange={(event) => {
              const nextQuery = event.target.value
              setSearchQuery(nextQuery)
              if (nextQuery.trim()) {
                setActivePageId('home')
              }
            }}
          />
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
      </div>

      <div className="layout">
        <nav className="sidebar" id="sidebar">
          <div className="topic-divider">Topic Library</div>
          {navigation.topicSections.map((section) => (
            <div key={section.title}>
              <div className="sidebar-section sidebar-section-topics">{section.title}</div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  data-page={item.id}
                  className={`nav-item nav-item-topic ${item.isSub ? 'nav-sub' : ''} ${
                    activePageId === item.id ? 'active' : ''
                  }`}
                  onClick={() => setActivePageId(item.id)}
                >
                  <span className="nav-dot" style={{ background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <main className="main">
          {pages.map((page) => (
            <div
              key={page.id}
              className={`page ${activePageId === page.id ? 'active' : ''}`}
              id={`page-${page.id}`}
            >
              {renderNodes(page.node.children ?? [], {
                query: normalizedQuery,
                onNavigate: setActivePageId,
              }, `page-${page.id}`)}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
