// DP Overview special page — shows use/avoid lists + 10 sub-pattern cards

import { patternMap } from '../data/patterns'

export default function DPOverviewPage({ pattern, onNavigate }) {
  return (
    <>
      <div className="page-header">
        <div className="page-icon" style={{ background: pattern.iconBg }}>{pattern.icon}</div>
        <div>
          <div className="page-title">Dynamic Programming — Overview</div>
          <div className="page-subtitle">10 sub-patterns — click any card to open its detailed page</div>
        </div>
      </div>

      <div className="cards-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-icon">{pattern.useWhenIcon}</span>
            <span className="card-title" style={{ color: pattern.useWhenColor }}>{pattern.useWhenTitle}</span>
          </div>
          <ul className="bullet-list green">
            {pattern.useWhenItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-icon">{pattern.avoidWhenIcon}</span>
            <span className="card-title" style={{ color: pattern.avoidWhenColor }}>{pattern.avoidWhenTitle}</span>
          </div>
          <ul className="bullet-list red">
            {pattern.avoidWhenItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-title">10 DP Sub-Patterns</div>
      <div className="pattern-grid">
        {pattern.subPatterns.map((sub) => (
          <div
            key={sub.id}
            className="pattern-card"
            onClick={() => onNavigate(sub.id)}
          >
            <div className="pc-title">{sub.title}</div>
            <div className="pc-tags">{sub.tags}</div>
          </div>
        ))}
      </div>
    </>
  )
}
