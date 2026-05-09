import type { Problem } from '../../../shared/types/domain'
import styles from './ProblemTable.module.css'

interface ProblemTableProps {
  problems?: Problem[]
}

function lcLink(name: string, number: string): string {
  const query = number && !number.includes('—') && !number.includes('pattern') ? `${number} ${name}` : name
  return `https://leetcode.com/problemset/?search=${encodeURIComponent(query)}`
}

function difficultyClass(difficulty: string): string {
  if (difficulty === 'E') return styles.easy
  if (difficulty === 'M') return styles.medium
  if (difficulty === 'H') return styles.hard
  return styles.defaultDiff
}

function difficultyLabel(difficulty: string): string {
  if (difficulty === 'E') return 'Easy'
  if (difficulty === 'M') return 'Medium'
  if (difficulty === 'H') return 'Hard'
  return difficulty
}

export function ProblemTable({ problems }: ProblemTableProps) {
  if (!problems || problems.length === 0) return null

  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <span className={styles.icon}>🧩</span>
        <h3>LeetCode Problems</h3>
      </header>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Problem no.</th>
              <th>Problem name</th>
              <th>Difficulty</th>
              <th>Key Insight</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={`${problem.number}-${problem.name}`}>
                <td className={styles.problemNo}>{problem.number}</td>
                <td>
                  <a href={lcLink(problem.name, problem.number)} target="_blank" rel="noreferrer noopener" className={styles.link}>
                    {problem.name}
                  </a>
                </td>
                <td>
                  <span className={`${styles.diff} ${difficultyClass(problem.difficulty)}`}>{difficultyLabel(problem.difficulty)}</span>
                </td>
                <td className={styles.note}>{problem.insight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
