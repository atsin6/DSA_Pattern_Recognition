# Contributing

## Quick checklist before opening changes

1. `npm run typecheck`
2. `npm run test`
3. `npm run build`

## Pattern content workflow

- Author pattern content in `src/content/patterns/*.json`.
- Keep IDs unique.
- Maintain `problems[].insight` as required text.
- If schema needs expansion, update `src/features/patterns/data/pattern-schema.ts` first.

## Expected test coverage

- Route/deep-link behavior for primary pages.
- URL-backed home search (`?q=`) behavior.
- Theme persistence (`localStorage['dsa-theme']`).
- Content validation guardrails (schema + duplicate IDs).

## Styling conventions

- Use CSS Modules for component/page styles.
- Keep global styles limited to tokens/reset/base rules.
- Prefer semantic tokens over raw hex values for repeated surfaces.
