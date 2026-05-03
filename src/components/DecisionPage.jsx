// Decision Framework page — 3-step decision process

import { decisionRules, complexityGroups, eliminationChecklist } from '../data/decisions'

function DecisionTree() {
  return (
    <div className="decision-tree">
      {decisionRules.map((rule, i) => (
        <div key={i} className="dt-row">
          <div className="dt-if">
            <span>if</span>
            {rule.condition}
          </div>
          <div className="dt-then">
            <span className="dt-pattern">{rule.pattern}</span>
            <span className="dt-why">{rule.why}</span>
            <span
              className="dt-badge"
              style={{ background: rule.badgeBg, color: rule.badgeColor }}
            >
              {rule.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ComplexityCards() {
  return (
    <div className="cards-grid three" style={{ marginTop: 0 }}>
      {complexityGroups.map((group, i) => (
        <div key={i} className="card">
          <div className="card-header">
            <span className="card-title" style={{ color: group.titleColor }}>{group.title}</span>
          </div>
          <ul className={`bullet-list ${group.listClass}`}>
            {group.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function EliminationChecklist() {
  return (
    <div className="card" style={{ marginTop: 0 }}>
      <table className="prob-table">
        <thead>
          <tr>
            <th>Question to ask</th>
            <th>If YES</th>
            <th>If NO</th>
          </tr>
        </thead>
        <tbody>
          {eliminationChecklist.map((row, i) => (
            <tr key={i}>
              <td>{row.question}</td>
              <td className="prob-note" style={{ color: 'var(--green-text)' }}>{row.yes}</td>
              <td className="prob-note">{row.no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DecisionPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-icon" style={{ background: 'var(--amber-bg)' }}>🗺</div>
        <div>
          <div className="page-title">Decision Framework</div>
          <div className="page-subtitle">Problem → Pattern in under 60 seconds</div>
        </div>
      </div>

      <div className="section-title">Step 1 — Read problem type</div>
      <DecisionTree />

      <div className="section-title" style={{ marginTop: 32 }}>Step 2 — Verify with complexity</div>
      <ComplexityCards />

      <div className="section-title" style={{ marginTop: 32 }}>Step 3 — Quick elimination checklist</div>
      <EliminationChecklist />
    </>
  )
}
