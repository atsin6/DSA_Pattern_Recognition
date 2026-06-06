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
│   ├── config/
│   │   └── pattern-catalog.json   # Sidebar/home/framework registration data
│   └── patterns/                   # One JSON file per pattern
├── features/
│   ├── patterns/             # Pattern pages, validated content loader
│   ├── framework/            # Decision framework page + data
│   └── compare/              # Cross-pattern comparison page + data
├── shared/
│   ├── styles/               # Global tokens + base styles
│   ├── types/                # Domain interfaces
│   └── ui/                   # Shared topbar + sidebar
└── test/                     # Test setup
```

## Content contract

### Pattern files

Each pattern file in `src/content/patterns/*.json` follows this shape:

- Required: `id`, `label`, `icon`, `iconBg`, `subtitle`
- Optional arrays: `signals`, `useWhen`, `avoidWhen`, `problems`
- Optional overview fields: `overview`, `overviewTitle`, `overviewSubtitle`, `subPatternsTitle`, `subPatterns`
- Optional legacy alias: `dpOverview` (supported for backward compatibility)
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

### Catalog registration file

`src/content/config/pattern-catalog.json` drives:

- `frameworkTabs`
- `categories`
- `homeCards`
- `subPatternIds`
- `categoryTones`

Both pattern JSON and catalog JSON are schema-validated at startup.
The app also cross-validates references (unknown IDs, uncategorized patterns, invalid overview links).

## Adding a new pattern

1. Create `src/content/patterns/<id>.json`.
2. Register `<id>` in `src/content/config/pattern-catalog.json`:
   - Add to one category.
   - Optionally add to `homeCards`.
   - If it is a sub-pattern page, add it to `subPatternIds`.
3. For overview pages (DP/Sliding style), add `subPatterns` links in the overview JSON.
4. Run:

```bash
npm run typecheck
npm run test
npm run build
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
