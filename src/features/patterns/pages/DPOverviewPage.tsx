import { Link } from 'react-router-dom'
import type { Pattern } from '../../../shared/types/domain'
import styles from './DPOverviewPage.module.css'

interface DPOverviewPageProps {
  pattern: Pattern
}

export function DPOverviewPage({ pattern }: DPOverviewPageProps) {
  const title = pattern.overviewTitle ?? pattern.label
  const subtitle = pattern.overviewSubtitle ?? pattern.subtitle
  const useWhenTitle = pattern.useWhenTitle ?? 'Use When'
  const useWhenIcon = pattern.useWhenIcon ?? '📡'
  const useWhenColor = pattern.useWhenColor ?? 'var(--blue)'
  const avoidWhenTitle = pattern.avoidWhenTitle ?? 'Avoid When'
  const avoidWhenIcon = pattern.avoidWhenIcon ?? '🚫'
  const avoidWhenColor = pattern.avoidWhenColor ?? 'var(--red)'
  const sectionTitle = pattern.subPatternsTitle ?? `${(pattern.subPatterns ?? []).length} Sub-Patterns`

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageIcon} style={{ background: pattern.iconBg }}>
          {pattern.icon}
        </div>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </header>

      <section className={styles.cardsGrid}>
        <article className={styles.card}>
          <header className={styles.cardHeader}>
            <span>{useWhenIcon}</span>
            <h3 style={{ color: useWhenColor }}>{useWhenTitle}</h3>
          </header>
          <ul className={styles.greenList}>
            {(pattern.useWhenItems ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <header className={styles.cardHeader}>
            <span>{avoidWhenIcon}</span>
            <h3 style={{ color: avoidWhenColor }}>{avoidWhenTitle}</h3>
          </header>
          <ul className={styles.redList}>
            {(pattern.avoidWhenItems ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <h3 className={styles.sectionTitle}>{sectionTitle}</h3>
      <section className={styles.patternGrid} aria-label="Sub-pattern cards">
        {(pattern.subPatterns ?? []).map((subPattern, index) => (
          <Link key={subPattern.id} to={`/patterns/${subPattern.id}`} className={styles.patternCard} style={{ animationDelay: `${index * 32}ms` }}>
            <div className={styles.cardTitle}>{subPattern.title}</div>
            <div className={styles.cardTags}>{subPattern.tags}</div>
          </Link>
        ))}
      </section>
    </>
  )
}
