import type { Pattern } from '../../../shared/types/domain'
import { ProblemTable } from '../components/ProblemTable'
import styles from './PatternPage.module.css'

interface PatternPageProps {
  pattern: Pattern
}

function StateTransitionCard({
  title,
  stateTransition,
}: {
  title?: string
  stateTransition?: Pattern['stateTransition']
}) {
  if (!stateTransition || stateTransition.length === 0) return null

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <span className={styles.cardIcon}>🔑</span>
        <h3>{title ?? 'State Transition'}</h3>
      </header>
      <code className={styles.transitionCode}>
        {stateTransition.map((line, index) => (
          <span key={`${line.code}-${index}`}>
            {line.code}
            {line.comment && <em>{` ${line.comment}`}</em>}
            {index < stateTransition.length - 1 && <br />}
          </span>
        ))}
      </code>
    </section>
  )
}

export function PatternPage({ pattern }: PatternPageProps) {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageIcon} style={{ background: pattern.iconBg }}>
          {pattern.icon}
        </div>
        <div>
          <h2>{pattern.label}</h2>
          <p>{pattern.subtitle}</p>
        </div>
      </header>

      {!!pattern.signals?.length && (
        <section className={styles.cardsGrid}>
          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <span className={styles.cardIcon}>📡</span>
              <h3>Recognition Signals</h3>
            </header>
            <div className={styles.tagList}>
              {pattern.signals.map((signal) => (
                <span key={signal} className={styles.tag}>
                  {signal}
                </span>
              ))}
            </div>
          </article>

          <article className={styles.card}>
            <header className={styles.cardHeader}>
              <span className={styles.cardIcon}>⚖️</span>
              <h3>When to Use / Avoid</h3>
            </header>
            <div className={styles.useGrid}>
              <section className={`${styles.useBox} ${styles.useYes}`}>
                <h4>Use When</h4>
                <ul>
                  {(pattern.useWhen ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className={`${styles.useBox} ${styles.useNo}`}>
                <h4>Avoid When</h4>
                <ul>
                  {(pattern.avoidWhen ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        </section>
      )}

      <StateTransitionCard title={pattern.stateTransitionTitle} stateTransition={pattern.stateTransition} />

      <ProblemTable problems={pattern.problems} />
    </>
  )
}
