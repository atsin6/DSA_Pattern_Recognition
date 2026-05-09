import { complexityGroups, decisionRules, eliminationChecklist } from '../data/decisions'
import styles from './DecisionPage.module.css'

export function DecisionPage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.pageIcon}>🗺</div>
        <div>
          <h2>Decision Framework</h2>
          <p>Problem to pattern in under 60 seconds</p>
        </div>
      </header>

      <h3 className={styles.sectionTitle}>Step 1 — Read problem type</h3>
      <section className={styles.decisionTree}>
        {decisionRules.map((rule) => (
          <article key={`${rule.condition}-${rule.pattern}`} className={styles.treeRow}>
            <div className={styles.ifCol}>
              <span>if</span>
              {rule.condition}
            </div>
            <div className={styles.thenCol}>
              <strong>{rule.pattern}</strong>
              <em>{rule.why}</em>
              <mark style={{ background: rule.badgeBg, color: rule.badgeColor }}>{rule.badge}</mark>
            </div>
          </article>
        ))}
      </section>

      <h3 className={styles.sectionTitle}>Step 2 — Verify with complexity</h3>
      <section className={styles.cardsGrid}>
        {complexityGroups.map((group) => (
          <article key={group.title} className={styles.card}>
            <h4 style={{ color: group.titleColor }}>{group.title}</h4>
            <ul className={group.listClass === 'green' ? styles.greenList : group.listClass === 'red' ? styles.redList : styles.neutralList}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <h3 className={styles.sectionTitle}>Step 3 — Quick elimination checklist</h3>
      <section className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Question to ask</th>
                <th>If YES</th>
                <th>If NO</th>
              </tr>
            </thead>
            <tbody>
              {eliminationChecklist.map((row) => (
                <tr key={row.question}>
                  <td>{row.question}</td>
                  <td className={styles.yes}>{row.yes}</td>
                  <td>{row.no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
