import rawPatternCatalog from '../../../content/config/pattern-catalog.json'
import type { Category, FrameworkTab } from '../../../shared/types/domain'
import { patternCatalogSchema } from './pattern-catalog-schema'

const parsedCatalog = patternCatalogSchema.safeParse(rawPatternCatalog)

if (!parsedCatalog.success) {
  const issueText = parsedCatalog.error.issues
    .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
    .join('; ')
  throw new Error(`Invalid pattern catalog config: ${issueText}`)
}

const catalog = parsedCatalog.data

export const CATEGORIES: Category[] = catalog.categories.map((category) => ({
  title: category.title,
  ids: [...category.ids],
}))

export const FRAMEWORK_TABS: FrameworkTab[] = catalog.frameworkTabs.map((tab) => ({ ...tab }))

export const FRAMEWORK_IDS = FRAMEWORK_TABS.map((tab) => tab.id)

export const HOME_CARDS = [...catalog.homeCards]
export const SUB_PATTERN_IDS = [...catalog.subPatternIds]

const SUB_IDS = new Set(SUB_PATTERN_IDS)

export function isSubPattern(id: string): boolean {
  return SUB_IDS.has(id)
}

const CATEGORY_TONES: Record<string, { main: string; sub: string }> = {
  ...catalog.categoryTones,
}

const CATEGORY_BY_ID = (() => {
  const map = new Map<string, string>()
  for (const category of CATEGORIES) {
    for (const id of category.ids) {
      if (!map.has(id)) map.set(id, category.title)
    }
  }
  return map
})()

export function categoryColor(id: string): string {
  const category = CATEGORY_BY_ID.get(id)
  if (!category) return 'var(--tone-sky)'

  const tones = CATEGORY_TONES[category]
  if (!tones) return 'var(--tone-sky)'

  return SUB_IDS.has(id) ? tones.sub : tones.main
}

const FRAMEWORK_PATH_TO_ID = new Map(FRAMEWORK_TABS.map((tab) => [tab.path, tab.id]))
const FRAMEWORK_ID_TO_PATH = new Map(FRAMEWORK_TABS.map((tab) => [tab.id, tab.path]))

export function frameworkPathToId(pathname: string): string | undefined {
  return FRAMEWORK_PATH_TO_ID.get(pathname)
}

export function pageIdToPath(pageId: string): string {
  const frameworkPath = FRAMEWORK_ID_TO_PATH.get(pageId)
  if (frameworkPath) return frameworkPath
  return `/patterns/${pageId}`
}

export function validatePatternCatalog(patternIds: string[]): void {
  const patternSet = new Set(patternIds)

  const requireKnownIds = (ids: string[], source: string) => {
    const unknown = ids.filter((id) => !patternSet.has(id))
    if (unknown.length > 0) {
      throw new Error(`${source} references unknown pattern ids: ${unknown.join(', ')}`)
    }
  }

  const categoryIds = CATEGORIES.flatMap((category) => category.ids)
  requireKnownIds(categoryIds, 'categories')
  requireKnownIds(HOME_CARDS, 'homeCards')
  requireKnownIds(SUB_PATTERN_IDS, 'subPatternIds')

  const assignedCategories = new Set(categoryIds)
  const uncategorized = patternIds.filter((id) => !assignedCategories.has(id))
  if (uncategorized.length > 0) {
    throw new Error(`Patterns missing category assignment: ${uncategorized.join(', ')}`)
  }

  const idToCategory = new Map<string, string>()
  for (const category of CATEGORIES) {
    for (const id of category.ids) {
      const previous = idToCategory.get(id)
      if (previous && previous !== category.title) {
        throw new Error(`Pattern id "${id}" is assigned to multiple categories: ${previous}, ${category.title}`)
      }
      idToCategory.set(id, category.title)
    }
  }

  const seenFrameworkIds = new Set<string>()
  const seenFrameworkPaths = new Set<string>()
  for (const tab of FRAMEWORK_TABS) {
    if (seenFrameworkIds.has(tab.id)) {
      throw new Error(`Duplicate framework tab id: ${tab.id}`)
    }
    if (seenFrameworkPaths.has(tab.path)) {
      throw new Error(`Duplicate framework tab path: ${tab.path}`)
    }
    seenFrameworkIds.add(tab.id)
    seenFrameworkPaths.add(tab.path)
  }
}
