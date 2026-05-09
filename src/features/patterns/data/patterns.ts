import type { Pattern } from '../../../shared/types/domain'
import { categoryColor } from './pattern-config'
import { patternSchema } from './pattern-schema'

import backtrack from '../../../content/patterns/backtrack.json'
import bit from '../../../content/patterns/bit.json'
import bsearch from '../../../content/patterns/bsearch.json'
import dp_01knap from '../../../content/patterns/dp-01knap.json'
import dp_bitmask from '../../../content/patterns/dp-bitmask.json'
import dp_grid from '../../../content/patterns/dp-grid.json'
import dp_interval from '../../../content/patterns/dp-interval.json'
import dp_lcs from '../../../content/patterns/dp-lcs.json'
import dp_linear from '../../../content/patterns/dp-linear.json'
import dp_lis from '../../../content/patterns/dp-lis.json'
import dp_statemachine from '../../../content/patterns/dp-statemachine.json'
import dp_tree from '../../../content/patterns/dp-tree.json'
import dp_unbounded from '../../../content/patterns/dp-unbounded.json'
import dp from '../../../content/patterns/dp.json'
import graphs from '../../../content/patterns/graphs.json'
import greedy from '../../../content/patterns/greedy.json'
import hashing from '../../../content/patterns/hashing.json'
import heap from '../../../content/patterns/heap.json'
import mono from '../../../content/patterns/mono.json'
import prefix from '../../../content/patterns/prefix.json'
import sliding from '../../../content/patterns/sliding.json'
import trees from '../../../content/patterns/trees.json'
import trie from '../../../content/patterns/trie.json'
import twoptr from '../../../content/patterns/twoptr.json'
import uf from '../../../content/patterns/uf.json'

const rawPatternEntries: [string, unknown][] = [
  ['backtrack.json', backtrack],
  ['bit.json', bit],
  ['bsearch.json', bsearch],
  ['dp-01knap.json', dp_01knap],
  ['dp-bitmask.json', dp_bitmask],
  ['dp-grid.json', dp_grid],
  ['dp-interval.json', dp_interval],
  ['dp-lcs.json', dp_lcs],
  ['dp-linear.json', dp_linear],
  ['dp-lis.json', dp_lis],
  ['dp-statemachine.json', dp_statemachine],
  ['dp-tree.json', dp_tree],
  ['dp-unbounded.json', dp_unbounded],
  ['dp.json', dp],
  ['graphs.json', graphs],
  ['greedy.json', greedy],
  ['hashing.json', hashing],
  ['heap.json', heap],
  ['mono.json', mono],
  ['prefix.json', prefix],
  ['sliding.json', sliding],
  ['trees.json', trees],
  ['trie.json', trie],
  ['twoptr.json', twoptr],
  ['uf.json', uf],
]

const parsedPatterns: Pattern[] = rawPatternEntries.map(([fileName, data]) => {
  const result = patternSchema.safeParse(data)

  if (!result.success) {
    const issueText = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ')
    throw new Error(`Invalid pattern content in ${fileName}: ${issueText}`)
  }

  return result.data
})

export function validateUniquePatternIds(collection: Pattern[]): void {
  const seenIds = new Set<string>()
  for (const pattern of collection) {
    if (seenIds.has(pattern.id)) {
      throw new Error(`Duplicate pattern id detected: ${pattern.id}`)
    }
    seenIds.add(pattern.id)
  }
}

validateUniquePatternIds(parsedPatterns)

export const patterns: Pattern[] = parsedPatterns.map((pattern) => ({
  ...pattern,
  color: categoryColor(pattern.id),
}))

export const patternMap: Record<string, Pattern> = Object.fromEntries(
  patterns.map((pattern) => [pattern.id, pattern]),
)

export function getPatternById(patternId: string | undefined): Pattern | undefined {
  if (!patternId) return undefined
  return patternMap[patternId]
}
