import type { Pattern } from '../../../shared/types/domain'
import { categoryColor, isSubPattern, validatePatternCatalog } from './pattern-config'
import { patternSchema } from './pattern-schema'

type JsonModule = { default: unknown }

const patternFileModules = import.meta.glob('../../../content/patterns/*.json', { eager: true })

const rawPatternEntries: [string, unknown][] = Object.entries(patternFileModules)
  .map(([path, mod]): [string, unknown] => {
    const fileName = path.split('/').pop() ?? path
    const maybeModule = mod as JsonModule | unknown

    if (typeof maybeModule === 'object' && maybeModule !== null && 'default' in maybeModule) {
      return [fileName, (maybeModule as JsonModule).default]
    }

    return [fileName, maybeModule]
  })
  .sort(([a], [b]) => a.localeCompare(b))

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

export function validateOverviewSubPatternLinks(collection: Pattern[]): void {
  const ids = new Set(collection.map((pattern) => pattern.id))

  for (const pattern of collection) {
    if (!pattern.subPatterns || pattern.subPatterns.length === 0) continue

    for (const sub of pattern.subPatterns) {
      if (!ids.has(sub.id)) {
        throw new Error(`Overview pattern "${pattern.id}" links to unknown sub-pattern id: ${sub.id}`)
      }
      if (!isSubPattern(sub.id)) {
        throw new Error(
          `Overview pattern "${pattern.id}" links to "${sub.id}" but it is not registered in subPatternIds`,
        )
      }
    }
  }
}

validateUniquePatternIds(parsedPatterns)
validatePatternCatalog(parsedPatterns.map((pattern) => pattern.id))
validateOverviewSubPatternLinks(parsedPatterns)

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
