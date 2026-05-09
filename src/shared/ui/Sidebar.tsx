import { NavLink } from 'react-router-dom'
import { CATEGORIES, isSubPattern } from '../../features/patterns/data/pattern-config'
import { patternMap } from '../../features/patterns/data/patterns'
import styles from './Sidebar.module.css'

interface SidebarProps {
  activePageId: string
  mobileOpen: boolean
  onNavigate: () => void
}

export function Sidebar({ activePageId, mobileOpen, onNavigate }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
      <div className={styles.topicDivider}>Topic Library</div>
      {CATEGORIES.map((category) => (
        <section key={category.title}>
          <h2 className={styles.sectionLabel}>{category.title}</h2>
          <ul className={styles.navList}>
            {category.ids.map((id) => {
              const pattern = patternMap[id]
              if (!pattern) return null

              const subPattern = isSubPattern(id)
              return (
                <li key={id}>
                  <NavLink
                    to={`/patterns/${id}`}
                    className={({ isActive }) => `${styles.navItem} ${subPattern ? styles.navSub : ''} ${isActive || activePageId === id ? styles.active : ''}`}
                    onClick={onNavigate}
                  >
                    <span className={styles.navDot} style={{ background: pattern.color }} />
                    {pattern.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </aside>
  )
}
