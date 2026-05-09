# Migration Notes

## Architectural move

- Old: monolithic `src/data/patterns.js` + page state switching in `App.jsx`.
- New: route-first shell with feature modules and per-pattern JSON content.

## ID and slug mapping

Pattern IDs are preserved exactly, and now map to URLs:

- `sliding` -> `/patterns/sliding`
- `twoptr` -> `/patterns/twoptr`
- `prefix` -> `/patterns/prefix`
- `hashing` -> `/patterns/hashing`
- `bsearch` -> `/patterns/bsearch`
- `mono` -> `/patterns/mono`
- `backtrack` -> `/patterns/backtrack`
- `greedy` -> `/patterns/greedy`
- `dp` -> `/patterns/dp`
- `dp-linear` -> `/patterns/dp-linear`
- `dp-grid` -> `/patterns/dp-grid`
- `dp-01knap` -> `/patterns/dp-01knap`
- `dp-unbounded` -> `/patterns/dp-unbounded`
- `dp-lcs` -> `/patterns/dp-lcs`
- `dp-lis` -> `/patterns/dp-lis`
- `dp-interval` -> `/patterns/dp-interval`
- `dp-statemachine` -> `/patterns/dp-statemachine`
- `dp-bitmask` -> `/patterns/dp-bitmask`
- `dp-tree` -> `/patterns/dp-tree`
- `trees` -> `/patterns/trees`
- `graphs` -> `/patterns/graphs`
- `uf` -> `/patterns/uf`
- `heap` -> `/patterns/heap`
- `bit` -> `/patterns/bit`
- `trie` -> `/patterns/trie`

Framework routes:

- Pattern Map -> `/`
- Decision Framework -> `/framework/decision`
- Cross-Pattern Comparison -> `/framework/compare`

## Behavior parity highlights

- Theme persistence key remains `dsa-theme`.
- Home search remains pattern-signal-based and now supports shareable URLs via `?q=`.
