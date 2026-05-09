import { Link } from 'react-router-dom'
import type { Pattern } from '../../../shared/types/domain'
import styles from './DPOverviewPage.module.css'

interface DPOverviewPageProps {
  pattern: Pattern
}

export function DPOverviewPage({ pattern }: DPOverviewPageProps) {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageIcon} style={{ background: pattern.iconBg }}>
          {pattern.icon}
        </div>
        <div>
          <h2>Dynamic Programming — Overview</h2>
          <p>10 sub-patterns you can use as a fast decision tree.</p>
        </div>
      </header>

      <section className={styles.cardsGrid}>
        <article className={styles.card}>
          <header className={styles.cardHeader}>
            <span>{pattern.useWhenIcon}</span>
            <h3 style={{ color: pattern.useWhenColor }}>{pattern.useWhenTitle}</h3>
          </header>
          <ul className={styles.greenList}>
            {(pattern.useWhenItems ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <header className={styles.cardHeader}>
            <span>{pattern.avoidWhenIcon}</span>
            <h3 style={{ color: pattern.avoidWhenColor }}>{pattern.avoidWhenTitle}</h3>
          </header>
          <ul className={styles.redList}>
            {(pattern.avoidWhenItems ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <h3 className={styles.sectionTitle}>10 DP Sub-Patterns</h3>
      <section className={styles.patternGrid}>
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
