// Home page — stats row + clickable pattern grid

import { HOME_CARDS, patternMap } from '../data/patterns'

const stats = [
  { value: '15', label: 'Patterns', color: 'var(--blue)' },
  { value: '~60', label: 'LeetCode Problems', color: 'var(--green)' },
  { value: '5', label: 'Comparisons', color: 'var(--amber)' },
  { value: '30+', label: 'Decision Rules', color: 'var(--purple)' },
]

export default function HomePage({ onNavigate, searchQuery }) {
  const q = (searchQuery || '').toLowerCase().trim()

  const cards = HOME_CARDS.map((id) => patternMap[id]).filter(Boolean)

  const filteredCards = q
    ? cards.filter((pat) => {
        const text = `${pat.label} ${pat.subtitle} ${(pat.signals || []).join(' ')}`.toLowerCase()
        return text.includes(q)
      })
    : cards

  return (
    <>
      <div className="stats-row">
        {stats.map((s, i) => (
          <div key={i} className="stat-box">
            <div className="stat-num" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-title">All Patterns — click to jump</div>

      <div className="pattern-grid" id="patternGrid">
        {filteredCards.map((pat) => (
          <div
            key={pat.id}
            className="pattern-card"
            onClick={() => onNavigate(pat.id)}
          >
            <div className="pc-title">{pat.label}</div>
            <div className="pc-tags">
              {(pat.signals || []).slice(0, 3).join(' · ')}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
