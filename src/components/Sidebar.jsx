// Sidebar navigation component

import { CATEGORIES, isSub } from '../data/patterns'
import { patternMap } from '../data/patterns'

export default function Sidebar({ activePageId, onNavigate }) {
  return (
    <nav className="sidebar" id="sidebar">
      <div className="topic-divider">Topic Library</div>
      {CATEGORIES.map((cat) => (
        <div key={cat.title}>
          <div className="sidebar-section sidebar-section-topics">{cat.title}</div>
          {cat.ids.map((id) => {
            const pat = patternMap[id]
            if (!pat) return null
            const sub = isSub(id)
            return (
              <div
                key={id}
                data-page={id}
                className={`nav-item nav-item-topic ${sub ? 'nav-sub' : ''} ${activePageId === id ? 'active' : ''}`}
                onClick={() => onNavigate(id)}
              >
                <span className="nav-dot" style={{ background: pat.color }} />
                {pat.label}
              </div>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
