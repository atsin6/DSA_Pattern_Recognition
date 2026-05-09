import type { ComplexityGroup, DecisionRule, EliminationChecklistRow } from '../../../shared/types/domain'

export const decisionRules: DecisionRule[] = [
  { condition: 'subarray / substring + contiguous constraint', pattern: 'Sliding Window', why: '— variable or fixed window', badge: 'Array', badgeBg: 'var(--tone-green-soft)', badgeColor: 'var(--tone-green-ink)' },
  { condition: 'sorted array + pair/triplet sum', pattern: 'Two Pointers', why: '— converge from both ends', badge: 'Array', badgeBg: 'var(--tone-green-soft)', badgeColor: 'var(--tone-green-ink)' },
  { condition: 'range sum query or subarray sum = k', pattern: 'Prefix Sum', why: '— precompute + HashMap', badge: 'Array', badgeBg: 'var(--tone-green-soft)', badgeColor: 'var(--tone-green-ink)' },
  { condition: 'frequency / duplicate / O(1) lookup', pattern: 'Hashing', why: '— HashMap or HashSet', badge: 'Array', badgeBg: 'var(--tone-green-soft)', badgeColor: 'var(--tone-green-ink)' },
  { condition: 'sorted + search / minimize-maximize answer', pattern: 'Binary Search', why: '— search on value space', badge: 'Search', badgeBg: 'var(--tone-teal-soft)', badgeColor: 'var(--tone-teal-ink)' },
  { condition: 'next greater/smaller / sliding max', pattern: 'Monotonic Stack/Queue', why: '— maintain order property', badge: 'Search', badgeBg: 'var(--tone-teal-soft)', badgeColor: 'var(--tone-teal-ink)' },
  { condition: 'all permutations / subsets / combinations', pattern: 'Backtracking', why: '— enumerate + prune', badge: 'Recursion', badgeBg: 'var(--tone-berry-soft)', badgeColor: 'var(--tone-berry-ink)' },
  { condition: 'local optimal = global optimal + no reconsider', pattern: 'Greedy', why: '— intervals, scheduling', badge: 'Recursion', badgeBg: 'var(--tone-berry-soft)', badgeColor: 'var(--tone-berry-ink)' },
  { condition: 'overlapping subproblems + optimal value', pattern: 'Dynamic Programming', why: '— memoize states', badge: 'Recursion', badgeBg: 'var(--tone-berry-soft)', badgeColor: 'var(--tone-berry-ink)' },
  { condition: 'binary tree / BST traversal or path', pattern: 'Tree DFS / BFS', why: '— post/pre/in-order', badge: 'Tree', badgeBg: 'var(--tone-coral-soft)', badgeColor: 'var(--tone-coral-ink)' },
  { condition: 'shortest path (unweighted)', pattern: 'BFS', why: '— level-by-level expansion', badge: 'Graph', badgeBg: 'var(--tone-coral-soft)', badgeColor: 'var(--tone-coral-ink)' },
  { condition: 'connected components / cycle / flood fill', pattern: 'DFS', why: '— mark visited, recurse', badge: 'Graph', badgeBg: 'var(--tone-coral-soft)', badgeColor: 'var(--tone-coral-ink)' },
  { condition: 'prerequisites / dependency ordering', pattern: 'Topological Sort', why: "— Kahn's BFS or DFS", badge: 'Graph', badgeBg: 'var(--tone-coral-soft)', badgeColor: 'var(--tone-coral-ink)' },
  { condition: 'shortest path (weighted, no negative edges)', pattern: 'Dijkstra (Heap + BFS)', why: '— min-heap on distances', badge: 'Graph', badgeBg: 'var(--tone-coral-soft)', badgeColor: 'var(--tone-coral-ink)' },
  { condition: 'dynamic connectivity / union groups', pattern: 'Union Find', why: '— path compress + rank', badge: 'Graph', badgeBg: 'var(--tone-coral-soft)', badgeColor: 'var(--tone-coral-ink)' },
  { condition: 'top-K / Kth largest / merge K sorted', pattern: 'Heap', why: '— min or max heap of size k', badge: 'Advanced', badgeBg: 'var(--tone-amber-soft)', badgeColor: 'var(--tone-amber-ink)' },
  { condition: 'prefix search / autocomplete / wildcard', pattern: 'Trie', why: '— char-by-char tree', badge: 'Advanced', badgeBg: 'var(--tone-amber-soft)', badgeColor: 'var(--tone-amber-ink)' },
  { condition: 'XOR / unique element / power of 2 / bitmask', pattern: 'Bit Manipulation', why: '— use XOR, AND, shifts', badge: 'Advanced', badgeBg: 'var(--tone-amber-soft)', badgeColor: 'var(--tone-amber-ink)' },
]

export const complexityGroups: ComplexityGroup[] = [
  {
    title: 'O(n) Target',
    titleColor: 'var(--tone-green-ink)',
    listClass: 'green',
    items: ['Sliding Window', 'Two Pointers', 'Prefix Sum (after build)', 'Hashing', 'Monotonic Stack'],
  },
  {
    title: 'O(n log n) Target',
    titleColor: 'var(--tone-amber-ink)',
    listClass: '',
    items: ['Binary Search variants', 'Heap (top-k)', 'Greedy + sort', 'BFS/DFS on graph (E+V)', 'Topo sort (E+V)'],
  },
  {
    title: 'Exponential — Careful',
    titleColor: 'var(--tone-coral-ink)',
    listClass: 'red',
    items: ['Backtracking 2^n or n!', 'DP with large state space', 'Brute force (need pruning)', 'Bitmask DP (2^n states)'],
  },
]

export const eliminationChecklist: EliminationChecklistRow[] = [
  { question: 'Is array sorted (or can sort)?', yes: 'Binary Search / Two Pointers', no: 'Hashing / Sliding Window' },
  { question: 'Are elements contiguous?', yes: 'Sliding Window / Prefix Sum', no: 'Backtracking / DP' },
  { question: 'Is it a tree/graph structure?', yes: 'DFS / BFS / Union Find', no: 'Array patterns' },
  { question: 'Do choices affect each other?', yes: 'DP (not Greedy)', no: 'Greedy is likely fine' },
  { question: 'Need all valid configurations?', yes: 'Backtracking', no: 'DP / Greedy for optimal only' },
  { question: 'Is it a "top-K" or "Kth" query?', yes: 'Heap (dynamic) or Sort (static)', no: 'Other pattern' },
  { question: 'Is data a graph with ordering?', yes: 'Topological Sort', no: 'BFS/DFS for traversal' },
  { question: 'Does problem involve XOR / bits?', yes: 'Bit Manipulation', no: 'Ignore bit tricks' },
]
