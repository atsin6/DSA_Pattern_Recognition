// Renders a single pattern page from pattern data object
// Covers: page header, signals, use/avoid, state transition, problems

import ProblemTable from './ProblemTable'

function SignalsCard({ signals }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">📡</span>
        <span className="card-title" style={{ color: 'var(--blue)' }}>Recognition Signals</span>
      </div>
      <div className="tag-list">
        {signals.map((s, i) => (
          <span key={i} className="tag blue">{s}</span>
        ))}
      </div>
    </div>
  )
}

function UseAvoidCard({ useWhen, avoidWhen }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-icon">⚖️</span>
        <span className="card-title" style={{ color: 'var(--amber)' }}>When to Use / Avoid</span>
      </div>
      <div className="use-grid">
        <div className="use-box yes">
          <div className="use-label">✓ Use When</div>
          <ul>
            {useWhen.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="use-box no">
          <div className="use-label">✗ Avoid When</div>
          <ul>
            {avoidWhen.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function StateTransitionCard({ stateTransition, title }) {
  if (!stateTransition || stateTransition.length === 0) return null

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="card-header">
        <span className="card-icon">🔑</span>
        <span className="card-title" style={{ color: 'var(--teal)' }}>
          {title || 'State Transition'}
        </span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal-text)', lineHeight: 2 }}>
        {stateTransition.map((line, i) => (
          <span key={i}>
            {line.code}
            {line.comment && <span style={{ color: 'var(--text3)' }}> {line.comment}</span>}
            {i < stateTransition.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function PatternPage({ pattern }) {
  // DP Overview has special rendering — handled by parent
  if (pattern.dpOverview) return null

  return (
    <>
      <div className="page-header">
        <div className="page-icon" style={{ background: pattern.iconBg }}>{pattern.icon}</div>
        <div>
          <div className="page-title">{pattern.label}</div>
          <div className="page-subtitle">{pattern.subtitle}</div>
        </div>
      </div>

      {pattern.signals && pattern.useWhen && (
        <div className="cards-grid">
          <SignalsCard signals={pattern.signals} />
          <UseAvoidCard useWhen={pattern.useWhen} avoidWhen={pattern.avoidWhen} />
        </div>
      )}

      <StateTransitionCard
        stateTransition={pattern.stateTransition}
        title={pattern.stateTransitionTitle}
      />

      <ProblemTable problems={pattern.problems} />
    </>
  )
}
