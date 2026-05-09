# DSA Pattern Recognition

A route-driven, data-validated DSA handbook built with React + TypeScript.

## What this app does

- Helps map problem signals to DSA patterns quickly.
- Provides three framework views:
  - Pattern Map (`/`)
  - Decision Framework (`/framework/decision`)
  - Cross-Pattern Comparison (`/framework/compare`)
- Supports deep links for every pattern page (`/patterns/:patternId`).
- Keeps home search URL-shareable with query params (`/?q=...`).
- Includes light/dark theme persistence via `localStorage['dsa-theme']`.

## Tech stack

- React 18
- React Router 6
- TypeScript
- Vite 5
- Zod schema validation for content
- Vitest + React Testing Library
- CSS Modules + design tokens

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run test
npm run test:watch
```

## Project structure

```text
src/
├── app/                      # App shell + route composition
├── content/
│   └── patterns/             # One JSON file per pattern
├── features/
│   ├── patterns/             # Pattern pages, tables, validated content loader
│   ├── framework/            # Decision framework page + data
│   └── compare/              # Cross-pattern comparison page + data
├── shared/
│   ├── styles/               # Global tokens + base styles
│   ├── types/                # Domain interfaces
│   └── ui/                   # Shared topbar + sidebar
└── test/                     # Test setup
```

## Content contract (JSON)

Each pattern file in `src/content/patterns/*.json` follows this shape:

- Required: `id`, `label`, `icon`, `iconBg`, `subtitle`
- Optional arrays: `signals`, `useWhen`, `avoidWhen`, `problems`
- Optional DP fields: `dpOverview`, `useWhenTitle`, `useWhenItems`, `avoidWhenTitle`, `avoidWhenItems`, `subPatterns`
- Optional transition fields: `stateTransitionTitle`, `stateTransition`

Example problem row:

```json
{
  "difficulty": "M",
  "name": "Longest Substring Without Repeating Characters",
  "number": "3",
  "insight": "Variable window + HashMap"
}
```

At startup, all pattern JSON files are validated with Zod. Invalid rows fail fast with actionable issue paths.

## Adding a new pattern

1. Create `src/content/patterns/<id>.json`.
2. Ensure it matches the schema in `src/features/patterns/data/pattern-schema.ts`.
3. Add `<id>` to category/home configs in `src/features/patterns/data/pattern-config.ts`.
4. Run:

```bash
npm run typecheck
npm run test
```

## Routing contract

- `/`
- `/framework/decision`
- `/framework/compare`
- `/patterns/:patternId`

Unknown pattern IDs render an explicit not-found card in-app.

## Accessibility and responsive behavior

- Semantic links/buttons for all interactive navigation surfaces.
- Keyboard-visible focus rings.
- Motion respects `prefers-reduced-motion`.
- Mobile topic drawer replaces desktop sidebar under tablet breakpoints.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributor workflow and [MIGRATION.md](./MIGRATION.md) for old-to-new mapping notes.
