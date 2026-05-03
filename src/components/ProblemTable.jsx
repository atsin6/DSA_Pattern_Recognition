// Renders a LeetCode problem table from a problems array
// Each problem: { difficulty, name, number, insight }

function lcLink(name, number) {
  const query = number && !number.includes('—') && !number.includes('pattern')
    ? `${number} ${name}`
    : name
  return `https://leetcode.com/problemset/?search=${encodeURIComponent(query)}`
}

function diffClass(d) {
  if (d === 'E') return 'diff E'
  if (d === 'M') return 'diff M'
  if (d === 'H') return 'diff H'
  return 'diff'
}

function diffLabel(d) {
  if (d === 'E') return 'Easy'
  if (d === 'M') return 'Medium'
  if (d === 'H') return 'Hard'
  return d
}

export default function ProblemTable({ problems }) {
  if (!problems || problems.length === 0) return null

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-header">
        <span className="card-icon">🧩</span>
        <span className="card-title" style={{ color: 'var(--purple)' }}>LeetCode Problems</span>
      </div>
      <table className="prob-table">
        <thead>
          <tr>
            <th>Problem no.</th>
            <th>Problem name</th>
            <th>Difficulty</th>
            <th>Key Insight</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((prob, i) => (
            <tr key={i}>
              <td className="prob-no">{prob.number}</td>
              <td className="prob-name">
                <a
                  className="lc-link"
                  href={lcLink(prob.name, prob.number)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {prob.name}
                </a>
              </td>
              <td>
                <span className={diffClass(prob.difficulty)}>{diffLabel(prob.difficulty)}</span>
              </td>
              <td className="prob-note">{prob.insight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
