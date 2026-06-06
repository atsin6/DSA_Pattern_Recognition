export type Difficulty = 'E' | 'M' | 'H' | string

export interface Problem {
  difficulty: Difficulty
  name: string
  number: string
  insight: string
}

export interface StateTransitionLine {
  code: string
  comment?: string
}

export interface SubPatternLink {
  id: string
  title: string
  tags: string
}

export interface Pattern {
  id: string
  label: string
  icon: string
  iconBg: string
  subtitle: string
  signals?: string[]
  useWhen?: string[]
  avoidWhen?: string[]
  problems?: Problem[]
  stateTransition?: StateTransitionLine[]
  stateTransitionTitle?: string
  overview?: boolean
  overviewTitle?: string
  overviewSubtitle?: string
  subPatternsTitle?: string
  // Backward-compatible alias; prefer `overview`.
  dpOverview?: boolean
  useWhenTitle?: string
  useWhenIcon?: string
  useWhenColor?: string
  useWhenItems?: string[]
  avoidWhenTitle?: string
  avoidWhenIcon?: string
  avoidWhenColor?: string
  avoidWhenItems?: string[]
  subPatterns?: SubPatternLink[]
  color?: string
}

export interface Category {
  title: string
  ids: string[]
}

export interface FrameworkTab {
  id: string
  path: string
  label: string
  color: string
}

export interface DecisionRule {
  condition: string
  pattern: string
  why: string
  badge: string
  badgeBg: string
  badgeColor: string
}

export interface ComplexityGroup {
  title: string
  titleColor: string
  listClass: string
  items: string[]
}

export interface EliminationChecklistRow {
  question: string
  yes: string
  no: string
}

export interface ComparisonSide {
  name: string
  points: string[]
}

export interface ComparisonCard {
  title: string
  left: ComparisonSide
  right: ComparisonSide
  rule: string
}
