import { patternSchema } from './pattern-schema'
import { patterns, validateUniquePatternIds } from './patterns'

describe('pattern content validation', () => {
  it('loads all pattern content files', () => {
    const ids = patterns.map((pattern) => pattern.id)

    expect(patterns.length).toBeGreaterThan(0)
    expect(ids).toEqual(
      expect.arrayContaining([
        'sliding',
        'sliding-fixed',
        'sliding-longest',
        'sliding-shortest',
        'sliding-atmost',
        'sliding-freq',
        'dp',
      ]),
    )
  })

  it('throws on duplicate ids', () => {
    expect(() => validateUniquePatternIds([...patterns, { ...patterns[0] }])).toThrow('Duplicate pattern id detected')
  })

  it('provides actionable schema issues for invalid problem rows', () => {
    const invalidPattern = {
      ...patterns[0],
      problems: [{ difficulty: 'E', name: 'Bad problem', number: '1' }],
    }

    const result = patternSchema.safeParse(invalidPattern)

    expect(result.success).toBe(false)

    if (!result.success) {
      const hasInsightPathIssue = result.error.issues.some((issue) => issue.path.join('.') === 'problems.0.insight')
      expect(hasInsightPathIssue).toBe(true)
    }
  })
})
