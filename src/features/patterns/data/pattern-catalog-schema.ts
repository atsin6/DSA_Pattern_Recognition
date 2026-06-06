import { z } from 'zod'

const frameworkTabSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  label: z.string().min(1),
  color: z.string().min(1),
})

const categorySchema = z.object({
  title: z.string().min(1),
  ids: z.array(z.string().min(1)).min(1),
})

const toneSchema = z.object({
  main: z.string().min(1),
  sub: z.string().min(1),
})

export const patternCatalogSchema = z.object({
  frameworkTabs: z.array(frameworkTabSchema).min(1),
  categories: z.array(categorySchema).min(1),
  homeCards: z.array(z.string().min(1)),
  subPatternIds: z.array(z.string().min(1)),
  categoryTones: z.record(z.string().min(1), toneSchema),
})

export type PatternCatalogConfig = z.infer<typeof patternCatalogSchema>
