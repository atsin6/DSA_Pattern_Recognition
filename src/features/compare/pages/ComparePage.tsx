import { comparisons } from '../data/comparisons'
import styles from './ComparePage.module.css'

export function ComparePage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageIcon}>⚔</div>
        <div>
          <h2>Cross-Pattern Comparison</h2>
          <p>Choose the right pattern when two options seem equally plausible.</p>
        </div>
      </header>

      {comparisons.map((comparison) => (
        <article key={comparison.title} className={styles.vsCard}>
          <h3>{comparison.title}</h3>
          <div className={styles.body}>
            <section>
              <h4>{comparison.left.name}</h4>
              <ul>
                {comparison.left.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4>{comparison.right.name}</h4>
              <ul>
                {comparison.right.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          </div>
          <p className={styles.rule}>
            <strong>Rule:</strong> {comparison.rule}
          </p>
        </article>
      ))}
    </>
  )
}
