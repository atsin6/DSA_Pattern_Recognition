import { z } from 'zod'

const problemSchema = z.object({
  difficulty: z.string().min(1),
  name: z.string().min(1),
  number: z.string().min(1),
  insight: z.string().min(1),
})

const stateTransitionLineSchema = z.object({
  code: z.string().min(1),
  comment: z.string().optional(),
})

const subPatternSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tags: z.string().min(1),
})

export const patternSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
  iconBg: z.string().min(1),
  subtitle: z.string().min(1),
  signals: z.array(z.string().min(1)).optional(),
  useWhen: z.array(z.string().min(1)).optional(),
  avoidWhen: z.array(z.string().min(1)).optional(),
  problems: z.array(problemSchema).optional(),
  stateTransition: z.array(stateTransitionLineSchema).optional(),
  stateTransitionTitle: z.string().optional(),
  overview: z.boolean().optional(),
  overviewTitle: z.string().optional(),
  overviewSubtitle: z.string().optional(),
  subPatternsTitle: z.string().optional(),
  // Backward-compatible alias; prefer `overview`.
  dpOverview: z.boolean().optional(),
  useWhenTitle: z.string().optional(),
  useWhenIcon: z.string().optional(),
  useWhenColor: z.string().optional(),
  useWhenItems: z.array(z.string().min(1)).optional(),
  avoidWhenTitle: z.string().optional(),
  avoidWhenIcon: z.string().optional(),
  avoidWhenColor: z.string().optional(),
  avoidWhenItems: z.array(z.string().min(1)).optional(),
  subPatterns: z.array(subPatternSchema).optional(),
})
