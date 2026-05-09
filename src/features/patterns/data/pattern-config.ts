import type { Category, FrameworkTab } from '../../../shared/types/domain'

export const CATEGORIES: Category[] = [
  { title: 'Array / String', ids: ['sliding', 'twoptr', 'prefix', 'hashing', 'bsearch', 'mono'] },
  {
    title: 'Recursion / DP',
    ids: [
      'backtrack',
      'greedy',
      'dp',
      'dp-linear',
      'dp-grid',
      'dp-01knap',
      'dp-unbounded',
      'dp-lcs',
      'dp-lis',
      'dp-interval',
      'dp-statemachine',
      'dp-bitmask',
      'dp-tree',
    ],
  },
  { title: 'Trees / Graphs', ids: ['trees', 'graphs', 'uf'] },
  { title: 'Advanced', ids: ['heap', 'bit', 'trie'] },
]

export const FRAMEWORK_IDS = ['home', 'decision', 'compare'] as const

export const FRAMEWORK_TABS: FrameworkTab[] = [
  { id: 'home', label: 'Pattern Map', color: '#4f8ef7' },
  { id: 'decision', label: 'Decision Framework', color: '#f5a623' },
  { id: 'compare', label: 'Cross-Pattern Comparison', color: '#14b8a6' },
]

export const HOME_CARDS = [
  'sliding',
  'twoptr',
  'prefix',
  'hashing',
  'bsearch',
  'backtrack',
  'greedy',
  'dp',
  'trees',
  'graphs',
  'heap',
  'mono',
  'bit',
  'trie',
  'uf',
]

const SUB_IDS = new Set([
  'dp-linear',
  'dp-grid',
  'dp-01knap',
  'dp-unbounded',
  'dp-lcs',
  'dp-lis',
  'dp-interval',
  'dp-statemachine',
  'dp-bitmask',
  'dp-tree',
])

export function isSubPattern(id: string): boolean {
  return SUB_IDS.has(id)
}

export function categoryColor(id: string): string {
  if (['sliding', 'twoptr', 'prefix', 'hashing'].includes(id)) return 'var(--tone-green)'
  if (['bsearch', 'mono'].includes(id)) return 'var(--tone-teal)'
  if (['backtrack', 'greedy', 'dp'].includes(id)) return 'var(--tone-berry)'
  if (SUB_IDS.has(id)) return 'var(--tone-indigo)'
  if (['trees', 'graphs', 'uf'].includes(id)) return 'var(--tone-coral)'
  if (['heap', 'bit', 'trie'].includes(id)) return 'var(--tone-amber)'
  return 'var(--tone-sky)'
}

export function pageIdToPath(pageId: string): string {
  if (pageId === 'home') return '/'
  if (pageId === 'decision') return '/framework/decision'
  if (pageId === 'compare') return '/framework/compare'
  return `/patterns/${pageId}`
}
