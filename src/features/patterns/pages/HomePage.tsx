import { Link } from 'react-router-dom'
import { comparisons } from '../../compare/data/comparisons'
import { HOME_CARDS } from '../data/pattern-config'
import { patternMap, patterns } from '../data/patterns'
import styles from './HomePage.module.css'

interface HomePageProps {
  searchQuery: string
}

export function HomePage({ searchQuery }: HomePageProps) {
  const normalizedQuery = searchQuery.toLowerCase().trim()

  const cards = HOME_CARDS.map((id) => patternMap[id]).filter(Boolean)
  const filteredCards = normalizedQuery
    ? cards.filter((pattern) => {
        const text = `${pattern.label} ${pattern.subtitle} ${(pattern.signals ?? []).join(' ')}`.toLowerCase()
        return text.includes(normalizedQuery)
      })
    : cards

  const stats = [
    { value: String(patterns.length), label: 'Patterns', tone: styles.sky },
    { value: '~60', label: 'LeetCode Problems', tone: styles.green },
    { value: String(comparisons.length), label: 'Comparisons', tone: styles.amber },
    { value: '18+', label: 'Decision Rules', tone: styles.berry },
  ]

  return (
    <>
      <section className={styles.hero}>
        <div>
          <h2>Pattern Map</h2>
          <p>
            Learn to map problem signals to the right approach quickly. Start with a pattern card, then jump to curated
            problems and decision hints.
          </p>
        </div>
        <div className={styles.heroPulse} aria-hidden="true" />
      </section>

      <section className={styles.statsRow} aria-label="Handbook stats">
        {stats.map((stat) => (
          <article key={stat.label} className={styles.statBox}>
            <div className={`${styles.statNum} ${stat.tone}`}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </article>
        ))}
      </section>

      <h3 className={styles.sectionTitle}>All Patterns — pick one to dive in</h3>

      <section className={styles.patternGrid} aria-label="Pattern cards">
        {filteredCards.map((pattern, index) => (
          <Link key={pattern.id} className={styles.patternCard} style={{ animationDelay: `${index * 35}ms` }} to={`/patterns/${pattern.id}`}>
            <div className={styles.cardTitle}>{pattern.label}</div>
            <div className={styles.cardTags}>{(pattern.signals ?? []).slice(0, 3).join(' · ')}</div>
          </Link>
        ))}
      </section>
    </>
  )
}
