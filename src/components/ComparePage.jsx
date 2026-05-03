// Cross-pattern comparison page

import { comparisons } from '../data/comparisons'

function ComparisonCard({ data }) {
  return (
    <div className="vs-card">
      <div className="vs-header">{data.title}</div>
      <div className="vs-body">
        <div className="vs-col">
          <div className="vs-col-title" style={{ color: 'var(--blue-text)' }}>{data.left.name}</div>
          <ul>
            {data.left.points.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>
        <div className="vs-col">
          <div className="vs-col-title" style={{ color: 'var(--green-text)' }}>{data.right.name}</div>
          <ul>
            {data.right.points.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="vs-rule">
        <strong>Rule:</strong> {data.rule}
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <>
      <div className="page-header">
        <div className="page-icon" style={{ background: 'var(--purple-bg)' }}>⚔</div>
        <div>
          <div className="page-title">Cross-Pattern Comparison</div>
          <div className="page-subtitle">Choose the right pattern when two seem applicable</div>
        </div>
      </div>

      {comparisons.map((comp, i) => (
        <ComparisonCard key={i} data={comp} />
      ))}
    </>
  )
}
