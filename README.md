# DSA Pattern Recognition

This project is my personal DSA pattern handbook built as an interactive web app.
I wanted one place where I could quickly map a problem to the right pattern, compare approaches, and jump into practice questions.

I vibecoded it.

## What this is

- A pattern recognition guide for coding interviews and problem-solving.
- Split into topic areas like Array/String, Recursion/DP, Trees/Graphs, and advanced patterns.
- Includes framework-style views (`Pattern Map`, `Decision Framework`, `Cross-Pattern Comparison`) for quick direction.
- Problem tables include difficulty + key idea, and each problem links out to LeetCode.
- Comes with a light/dark theme toggle.

## Tech stack

- React 18
- Vite 5
- Vanilla CSS (custom properties + dark/light themes)

## Project structure

```
src/
├── App.jsx                  — thin shell: state + layout composition
├── main.jsx                 — React bootstrap + CSS import
├── index.css                — all styles (themes, layout, components)
├── data/
│   ├── patterns.js          — all 25 DSA patterns as data objects
│   ├── comparisons.js       — 5 cross-pattern comparison cards
│   └── decisions.js         — decision framework rules + checklist
└── components/
    ├── Topbar.jsx            — nav bar, framework tabs, search, theme toggle
    ├── Sidebar.jsx           — topic library navigation
    ├── HomePage.jsx          — stats + clickable pattern grid
    ├── PatternPage.jsx       — generic page renderer for any pattern
    ├── DPOverviewPage.jsx    — DP overview with 10 sub-pattern cards
    ├── DecisionPage.jsx      — 3-step decision framework
    ├── ComparePage.jsx       — side-by-side pattern comparisons
    └── ProblemTable.jsx      — LeetCode problem table with auto-links
```

## How to add a new pattern

Just add a new object to `src/data/patterns.js`:

```js
{
  id: 'mypattern',
  label: 'My Pattern',
  icon: '🔥',
  iconBg: 'var(--blue-bg)',
  subtitle: 'One-line description',
  signals: ['signal 1', 'signal 2'],
  useWhen: ['use case 1'],
  avoidWhen: ['avoid case 1'],
  problems: [
    { difficulty: 'M', name: 'Problem Name', number: '123', insight: 'Key idea' },
  ],
}
```

Then add its `id` to the appropriate category in `CATEGORIES` at the top of the same file. Done — no HTML editing, no build scripts, no parsers.

## License

Personal/project use.
