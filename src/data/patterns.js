// Every DSA pattern's data — single source of truth.
// PatternPage.jsx renders any entry from this array.

export const CATEGORIES = [
  { title: 'Array / String', ids: ['sliding', 'twoptr', 'prefix', 'hashing', 'bsearch', 'mono'] },
  { title: 'Recursion / DP', ids: ['backtrack', 'greedy', 'dp', 'dp-linear', 'dp-grid', 'dp-01knap', 'dp-unbounded', 'dp-lcs', 'dp-lis', 'dp-interval', 'dp-statemachine', 'dp-bitmask', 'dp-tree'] },
  { title: 'Trees / Graphs', ids: ['trees', 'graphs', 'uf'] },
  { title: 'Advanced', ids: ['heap', 'bit', 'trie'] },
]

export const FRAMEWORK_IDS = ['home', 'decision', 'compare']

export const FRAMEWORK_TABS = [
  { id: 'home', label: 'Pattern Map', color: '#4f8ef7' },
  { id: 'decision', label: 'Decision Framework', color: '#f5a623' },
  { id: 'compare', label: 'Cross-Pattern Comparison', color: '#a07cf7' },
]

// Sub-pages are indented in the sidebar
const SUB_IDS = new Set([
  'dp-linear', 'dp-grid', 'dp-01knap', 'dp-unbounded',
  'dp-lcs', 'dp-lis', 'dp-interval', 'dp-statemachine',
  'dp-bitmask', 'dp-tree',
])

export function isSub(id) {
  return SUB_IDS.has(id)
}

// Color lookup per category
function catColor(id) {
  if (['sliding', 'twoptr', 'prefix', 'hashing'].includes(id)) return '#3fc98a'
  if (['bsearch', 'mono'].includes(id)) return '#2dd4bf'
  if (['backtrack', 'greedy', 'dp'].includes(id)) return '#a07cf7'
  if (SUB_IDS.has(id)) return '#7a5fd4'
  if (['trees', 'graphs', 'uf'].includes(id)) return '#f48060'
  if (['heap', 'bit', 'trie'].includes(id)) return '#f5a623'
  return '#4f8ef7'
}

// Helper to build a problem entry
function p(difficulty, name, number, insight) {
  return { difficulty, name, number, insight }
}

const patterns = [
  // ─── SLIDING WINDOW ───
  {
    id: 'sliding',
    label: 'Sliding Window',
    icon: '🪟',
    iconBg: 'var(--green-bg)',
    subtitle: 'Variable or fixed-size window moving over array/string',
    signals: [
      'subarray / substring', 'contiguous elements', 'longest / shortest window',
      'k distinct characters', 'at most / at least k', 'no repeating characters',
      'max sum of size k', 'minimum window containing all',
    ],
    useWhen: [
      'Contiguous subarray/substring required', 'Fixed or variable window size',
      'Linear scan is enough', 'Frequency constraint within window',
    ],
    avoidWhen: [
      'Non-contiguous elements needed', 'Elements can be reused from anywhere',
      'Need all combinations (use backtracking)', 'Array is unsorted and search is needed',
    ],
    problems: [
      p('E', 'Maximum Average Subarray I', '643', 'Fixed window of size k'),
      p('E', 'Contains Duplicate II', '219', 'Window + HashSet'),
      p('E', 'Best Time to Buy/Sell Stock', '121', 'Track min so far'),
      p('M', 'Longest Substring Without Repeating Characters', '3', 'Variable window + HashMap'),
      p('M', 'Longest Repeating Character Replacement', '424', 'maxFreq trick'),
      p('M', 'Permutation in String', '567', 'Fixed window + freq map'),
      p('H', 'Minimum Window Substring', '76', 'Two-pointer + freq map'),
      p('H', 'Sliding Window Maximum', '239', 'Monotonic deque'),
    ],
  },

  // ─── TWO POINTERS ───
  {
    id: 'twoptr',
    label: 'Two Pointers',
    icon: '👆',
    iconBg: 'var(--green-bg)',
    subtitle: 'Two indices moving toward or away from each other',
    signals: [
      'sorted array', 'pair / triplet with target sum', 'palindrome check',
      'remove duplicates in-place', 'two sorted arrays merge',
      'container with most water', 'partition array',
    ],
    useWhen: [
      'Array is sorted (or can be sorted)', 'Looking for a pair meeting a condition',
      'In-place modification needed', 'Comparing from both ends',
    ],
    avoidWhen: [
      'Array is unsorted and sorting changes answer',
      'Non-contiguous elements with complex condition',
      'Window has frequency/map constraints (use sliding window)',
    ],
    problems: [
      p('E', 'Valid Palindrome', '125', 'Left/right toward center'),
      p('E', 'Squares of a Sorted Array', '977', 'Two ends inward'),
      p('M', 'Two Sum II — Input Array Is Sorted', '167', 'Classic left-right'),
      p('M', '3Sum', '15', 'Fix one, two-pointer rest'),
      p('M', 'Container With Most Water', '11', 'Move smaller side inward'),
      p('H', 'Trapping Rain Water', '42', 'Left/right max arrays'),
      p('H', '4Sum', '18', 'Fix two, two-pointer rest'),
    ],
  },

  // ─── PREFIX SUM ───
  {
    id: 'prefix',
    label: 'Prefix Sum',
    icon: '∑',
    iconBg: 'var(--green-bg)',
    subtitle: 'Precompute cumulative sums for O(1) range queries',
    signals: [
      'range sum query', 'subarray sum = k', 'number of subarrays with sum',
      'multiple queries on same array', '2D grid sum queries', 'contiguous subarray count',
    ],
    useWhen: [
      'Multiple range sum queries needed', 'Count of subarrays with exact sum',
      'Immutable array with repeated queries', 'Difference arrays for range updates',
    ],
    avoidWhen: [
      'Array is modified frequently (use Fenwick tree)',
      'Window size is fixed (sliding window is simpler)',
      'You only need one range sum',
    ],
    problems: [
      p('E', 'Running Sum of 1d Array', '1480', 'Basic prefix build'),
      p('E', 'Range Sum Query — Immutable', '303', 'prefix[r] - prefix[l-1]'),
      p('M', 'Subarray Sum Equals K', '560', 'prefix + HashMap count'),
      p('M', 'Contiguous Array', '525', 'Map first occurrence of prefix'),
      p('M', 'Range Sum Query 2D — Immutable', '304', '2D prefix sum'),
      p('H', 'Maximum Sum of 3 Non-Overlapping Subarrays', '689', 'Prefix + window combo'),
    ],
  },

  // ─── HASHING ───
  {
    id: 'hashing',
    label: 'Hashing',
    icon: '#',
    iconBg: 'var(--green-bg)',
    subtitle: 'HashMap / HashSet for O(1) lookups, counting, grouping',
    signals: [
      'two sum / pair with target', 'frequency count', 'duplicate detection',
      'group / categorize elements', 'anagram check', 'first occurrence / index map',
      'O(1) lookup needed',
    ],
    useWhen: [
      'Need O(1) average lookup', 'Counting occurrences of elements',
      'Grouping elements by a key', 'Checking membership quickly',
    ],
    avoidWhen: [
      'Order/range matters (use sorted array)', 'Memory is very limited',
      'Hash collisions cause correctness issues',
    ],
    problems: [
      p('E', 'Two Sum', '1', 'Map value → index'),
      p('E', 'Valid Anagram', '242', 'Frequency map compare'),
      p('E', 'Contains Duplicate', '217', 'HashSet membership'),
      p('M', 'Group Anagrams', '49', 'Sort key → group list'),
      p('M', 'Top K Frequent Elements', '347', 'Freq map + bucket sort'),
      p('M', 'Longest Consecutive Sequence', '128', 'HashSet + check start'),
      p('H', 'Minimum Window Substring', '76', 'Two maps + window'),
    ],
  },

  // ─── BINARY SEARCH ───
  {
    id: 'bsearch',
    label: 'Binary Search',
    icon: '⚡',
    iconBg: 'var(--teal-bg)',
    subtitle: 'Eliminate half the search space each iteration — O(log n)',
    signals: [
      'sorted array', 'find target in sorted', 'minimize / maximize answer',
      'search on answer space', 'rotated sorted array', 'find peak / boundary',
      'kth smallest/largest in matrix', 'feasibility check monotone',
    ],
    useWhen: [
      'Array or search space is sorted/monotone', 'Answer space is numeric and bounded',
      '"Can we achieve X with capacity Y?" pattern', 'O(log n) required over O(n)',
    ],
    avoidWhen: [
      'Array is unsorted (unless you can binary search answer)',
      "Elements don't have monotone property", 'Need to find all occurrences (use bounds)',
    ],
    problems: [
      p('E', 'Binary Search', '704', 'Classic template'),
      p('E', 'First Bad Version', '278', 'Find left boundary'),
      p('M', 'Find Minimum in Rotated Sorted Array', '153', 'Detect rotation pivot'),
      p('M', 'Search in Rotated Sorted Array', '33', 'Which half is sorted?'),
      p('M', 'Koko Eating Bananas', '875', 'Binary search on answer'),
      p('H', 'Median of Two Sorted Arrays', '4', 'Partition both arrays'),
      p('H', 'Split Array Largest Sum', '410', 'BS on sum space'),
    ],
  },

  // ─── MONOTONIC STACK ───
  {
    id: 'mono',
    label: 'Monotonic Stack/Queue',
    icon: '📊',
    iconBg: 'var(--teal-bg)',
    subtitle: 'Maintain increasing/decreasing order for next-greater type problems',
    signals: [
      'next greater element', 'previous smaller element', 'largest rectangle in histogram',
      'daily temperatures', 'sliding window maximum', 'online stock span',
      'valid parentheses order',
    ],
    useWhen: [
      '"Next greater/smaller" in O(n)', 'Sliding window min/max in O(n)',
      'Span / visible buildings problems',
    ],
    avoidWhen: [
      'Need global max/min (use single pass)', 'Data is not processed sequentially',
      'Arbitrary window queries (use segment tree)',
    ],
    problems: [
      p('E', 'Next Greater Element I', '496', 'Mono stack + hashmap'),
      p('M', 'Daily Temperatures', '739', 'Stack of indices'),
      p('M', 'Online Stock Span', '901', 'Stack of (price, span)'),
      p('M', 'Car Fleet', '853', 'Sort + mono stack by time'),
      p('H', 'Largest Rectangle in Histogram', '84', 'Mono increasing stack'),
      p('H', 'Sliding Window Maximum', '239', 'Mono deque (front = max)'),
    ],
  },

  // ─── BACKTRACKING ───
  {
    id: 'backtrack',
    label: 'Recursion / Backtracking',
    icon: '↩',
    iconBg: 'var(--purple-bg)',
    subtitle: 'Explore all possibilities, prune invalid branches early',
    signals: [
      'all permutations / combinations', 'all subsets / power set',
      'generate all valid strings', 'satisfy constraints', 'N-Queens, Sudoku',
      'word search on grid', 'partition into groups',
    ],
    useWhen: [
      'Enumerate all valid configurations', 'Decision at each step (include/exclude)',
      'Constraint satisfaction problem', 'Small input (n ≤ 20)',
    ],
    avoidWhen: [
      'Need only one optimal answer (use DP/Greedy)',
      'Input is large (exponential blowup)', 'No pruning possible (too slow)',
    ],
    problems: [
      p('E', 'Letter Case Permutation', '784', 'Include/exclude case'),
      p('M', 'Subsets', '78', 'Include/exclude each element'),
      p('M', 'Permutations', '46', 'Swap + recurse + swap back'),
      p('M', 'Combination Sum', '39', 'Reuse elements + pruning'),
      p('H', 'N-Queens', '51', 'Column + diagonal sets'),
      p('H', 'Sudoku Solver', '37', 'Fill + validate + undo'),
    ],
  },

  // ─── GREEDY ───
  {
    id: 'greedy',
    label: 'Greedy',
    icon: '💰',
    iconBg: 'var(--purple-bg)',
    subtitle: 'Make locally optimal choice at each step — no reconsideration',
    signals: [
      'interval scheduling / merging', 'minimum cost / maximum profit',
      'activity selection', 'task scheduling', 'gas station / jump game',
      'assign to minimize conflicts',
    ],
    useWhen: [
      'Local optimal leads to global optimal (provable)',
      'Interval problems (sort by end time)', 'Fractional knapsack',
      'Can prove greedy choice property',
    ],
    avoidWhen: [
      'Choices affect future in non-obvious ways',
      '0/1 Knapsack (use DP)', 'Problem has overlapping subproblems',
    ],
    problems: [
      p('E', 'Assign Cookies', '455', 'Sort both, match smallest fit'),
      p('E', 'Lemonade Change', '860', 'Greedy with denominations'),
      p('M', 'Jump Game', '55', 'Track max reachable index'),
      p('M', 'Non-overlapping Intervals', '435', 'Sort by end, skip overlaps'),
      p('M', 'Gas Station', '134', 'Running sum, reset start'),
      p('H', 'Jump Game II', '45', 'BFS-like greedy levels'),
    ],
  },

  // ─── DP OVERVIEW ───
  {
    id: 'dp',
    label: 'DP — Overview',
    icon: '🧮',
    iconBg: 'var(--purple-bg)',
    subtitle: '10 sub-patterns — click any card to open its detailed page',
    // special rendering — see DPOverviewPage
    dpOverview: true,
    useWhenTitle: 'Use DP When',
    useWhenIcon: '📡',
    useWhenColor: 'var(--blue)',
    useWhenItems: [
      'Recursive solution has repeated sub-calls (overlapping subproblems)',
      'Optimal answer built from optimal sub-answers (optimal substructure)',
      'Need count of ways, min/max cost, or yes/no feasibility',
      'State describable with 1–3 variables',
    ],
    avoidWhenTitle: 'Avoid DP When',
    avoidWhenIcon: '🚫',
    avoidWhenColor: 'var(--red)',
    avoidWhenItems: [
      'No overlapping subproblems → Divide & Conquer',
      'Greedy choice property holds → use Greedy',
      'State space is exponential and no bitmask encoding helps',
      'Problem needs ALL configurations listed → use Backtracking',
    ],
    subPatterns: [
      { id: 'dp-linear', title: '1D Linear DP', tags: 'dp[i] from dp[i-1] or dp[i-2]' },
      { id: 'dp-grid', title: '2D / Grid DP', tags: 'dp[i][j] on matrix / two indices' },
      { id: 'dp-01knap', title: '0/1 Knapsack', tags: 'include or skip each item once' },
      { id: 'dp-unbounded', title: 'Unbounded Knapsack', tags: 'item can be reused unlimited times' },
      { id: 'dp-lcs', title: 'LCS — Two-String DP', tags: 'edit distance · common subseq' },
      { id: 'dp-lis', title: 'LIS', tags: 'longest increasing subsequence' },
      { id: 'dp-interval', title: 'Interval DP', tags: 'dp[i][j] on range segments' },
      { id: 'dp-statemachine', title: 'State Machine DP', tags: 'finite states · buy/sell · cooldown' },
      { id: 'dp-bitmask', title: 'Bitmask DP', tags: 'state as bitmask · n ≤ 20' },
      { id: 'dp-tree', title: 'Tree DP', tags: 'post-order · rerooting · subtree' },
    ],
  },

  // ─── DP: 1D LINEAR ───
  {
    id: 'dp-linear',
    label: '1D Linear DP',
    icon: '〰',
    iconBg: 'var(--purple-bg)',
    subtitle: 'dp[i] depends on one or two previous states — simplest DP form',
    signals: [
      'count ways to climb n steps', 'max/min cost to reach index i',
      "can't pick adjacent elements", 'fibonacci-like recurrence',
      'dp[i] = f(dp[i-1], dp[i-2])', 'paint houses / tile floors',
    ],
    useWhen: [
      'State is a single index i',
      "Each position's answer depends on 1-2 prior positions",
      'Linear scan left-to-right is sufficient',
    ],
    avoidWhen: [
      'State depends on two separate indices (use 2D DP)',
      'Items have weights/values (use Knapsack)',
      'Order within subsequence matters (use LIS)',
    ],
    stateTransition: [
      { code: 'dp[i] = dp[i-1] + dp[i-2]', comment: '// climbing stairs' },
      { code: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i])', comment: '// house robber' },
    ],
    problems: [
      p('E', 'Climbing Stairs', '70', 'dp[i] = dp[i-1] + dp[i-2]'),
      p('E', 'Min Cost Climbing Stairs', '746', 'dp[i] = min(dp[i-1], dp[i-2]) + cost[i]'),
      p('M', 'House Robber', '198', 'Skip adjacent, take max'),
      p('M', 'House Robber II', '213', 'Run twice: [0..n-2] and [1..n-1]'),
      p('M', 'Decode Ways', '91', '1-digit and 2-digit decode branch'),
      p('M', 'Paint House', '256', '3-color dp[i][color] transition'),
      p('H', 'Paint House III', '1473', 'dp[i][j][k] with neighborhood count'),
    ],
  },

  // ─── DP: 2D GRID ───
  {
    id: 'dp-grid',
    label: '2D / Grid DP',
    icon: '⊞',
    iconBg: 'var(--purple-bg)',
    subtitle: 'dp[i][j] — state depends on row i and column j or two sequence indices',
    signals: [
      'm×n grid traversal', 'unique paths in grid',
      'min path sum top-left to bottom-right', 'obstacles in grid',
      'count squares / rectangles', 'cherry pick / gold mine',
    ],
    useWhen: [
      'Problem is on a 2D matrix/grid', 'Movement only right/down (acyclic)',
      'Two pointers advancing on two sequences',
    ],
    avoidWhen: [
      'All-direction movement needed (use BFS/DFS)',
      'Grid has cycles (use Dijkstra/BFS)',
    ],
    stateTransition: [
      { code: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]', comment: '// unique paths' },
      { code: 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])', comment: '// min path sum' },
    ],
    problems: [
      p('E', "Pascal's Triangle", '118', 'dp[i][j] = dp[i-1][j-1] + dp[i-1][j]'),
      p('M', 'Unique Paths', '62', 'Sum from top + left'),
      p('M', 'Unique Paths II', '63', 'Set obstacle cell to 0'),
      p('M', 'Minimum Path Sum', '64', 'Grid DP with cost'),
      p('M', 'Maximal Square', '221', 'dp[i][j] = min(top, left, diag) + 1'),
      p('H', 'Dungeon Game', '174', 'Reverse DP bottom-right to top-left'),
      p('H', 'Cherry Pickup II', '1463', 'dp[row][c1][c2] two pointers together'),
    ],
  },

  // ─── DP: 0/1 KNAPSACK ───
  {
    id: 'dp-01knap',
    label: '0/1 Knapsack',
    icon: '🎒',
    iconBg: 'var(--purple-bg)',
    subtitle: 'Each item used at most once — include or exclude decision',
    signals: [
      'subset sum equals target', 'partition into equal halves',
      'each element used at most once', 'can we reach exactly W?',
      'choose items with total ≤ capacity', 'assign to two groups to minimize diff',
    ],
    useWhen: [
      'Each item appears exactly once', 'Binary choice: take or leave item i',
      'Target sum / capacity is bounded integer',
    ],
    avoidWhen: [
      'Items can be reused (Unbounded Knapsack)',
      'Fractional amounts allowed (Greedy)', 'Need all subsets listed (Backtracking)',
    ],
    stateTransition: [
      { code: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])', comment: '// 2D' },
      { code: 'dp[w] = max(dp[w], dp[w-wt[i]] + val[i])', comment: '// 1D space-opt (iterate w backwards)' },
    ],
    problems: [
      p('M', 'Partition Equal Subset Sum', '416', 'Can we hit sum/2?'),
      p('M', 'Subset Sum', 'pattern — via 416', 'Boolean dp[target]'),
      p('M', 'Last Stone Weight II', '1049', 'Minimize diff between two groups'),
      p('M', 'Target Sum', '494', 'Count subsets with sum = S'),
      p('H', 'Ones and Zeroes', '474', '2D knapsack (m zeros, n ones budget)'),
      p('H', 'Profitable Schemes', '879', '3D knapsack (members, profit)'),
    ],
  },

  // ─── DP: UNBOUNDED KNAPSACK ───
  {
    id: 'dp-unbounded',
    label: 'Unbounded Knapsack',
    icon: '♾',
    iconBg: 'var(--purple-bg)',
    subtitle: 'Same item can be picked unlimited times',
    signals: [
      'unlimited supply of each coin/item', 'min coins to make amount',
      'number of ways to make change', 'item can be reused',
      'word break with dictionary', 'perfect squares sum',
    ],
    useWhen: [
      'Each item/denomination has infinite copies', 'Iterate w forward (allows reuse)',
      '"Minimum coins" / "ways to make amount"',
    ],
    avoidWhen: [
      'Each item appears at most once (0/1 Knapsack)',
      'Each item appears a fixed k times (bounded knapsack)',
    ],
    stateTransition: [
      { code: '// Iterate w FORWARD to allow re-picking same item', comment: '' },
      { code: 'for coin in coins: for w from coin to amount:', comment: '' },
      { code: '  dp[w] = min(dp[w], dp[w - coin] + 1)', comment: '' },
    ],
    problems: [
      p('M', 'Coin Change', '322', 'Min coins — dp[amount] forward loop'),
      p('M', 'Coin Change II', '518', 'Count ways — order of loops matters'),
      p('M', 'Perfect Squares', '279', 'Coins = {1,4,9,...} BFS or DP'),
      p('M', 'Word Break', '139', 'dp[i] = any dp[j] && word[j..i] valid'),
      p('H', 'Word Break II', '140', 'Backtracking + memoization'),
      p('H', 'Integer Break', '343', 'Unbounded split on integer parts'),
    ],
  },

  // ─── DP: LCS ───
  {
    id: 'dp-lcs',
    label: 'LCS (Two-String DP)',
    icon: '↔',
    iconBg: 'var(--purple-bg)',
    subtitle: 'dp[i][j] over two sequences — match, skip s1[i], or skip s2[j]',
    signals: [
      'two strings as input', 'longest common subsequence',
      'edit distance (insert/delete/replace)', 'min deletions to make equal',
      'shortest common supersequence', 'wildcard / regex matching',
      'interleaving strings',
    ],
    useWhen: [
      'Problem involves comparing two strings',
      'Alignment / edit operations between two sequences',
      'Matching with wildcards (regex)',
    ],
    avoidWhen: [
      'Single string — use 1D DP or palindrome DP',
      'Subsequence within one string — use LIS',
    ],
    stateTransition: [
      { code: 'if s1[i]==s2[j]: dp[i][j] = dp[i-1][j-1] + 1', comment: '// LCS' },
      { code: 'else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])', comment: '' },
      { code: '// Edit dist: min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1] + (s1[i]!=s2[j]))', comment: '' },
    ],
    problems: [
      p('M', 'Longest Common Subsequence', '1143', 'Classic LCS dp[i][j]'),
      p('M', 'Uncrossed Lines', '1035', 'Identical to LCS'),
      p('M', 'Delete Operation for Two Strings', '583', 'n + m - 2*LCS'),
      p('H', 'Edit Distance', '72', '3-way transition: ins/del/replace'),
      p('H', 'Shortest Common Supersequence', '1092', 'Reconstruct from LCS table'),
      p('H', 'Regular Expression Matching', '10', "'*' matches 0 or more of prev char"),
    ],
  },

  // ─── DP: LIS ───
  {
    id: 'dp-lis',
    label: 'LIS',
    icon: '↗',
    iconBg: 'var(--purple-bg)',
    subtitle: 'dp[i] = longest increasing subsequence ending at index i',
    signals: [
      'longest increasing / non-decreasing subsequence',
      'count of increasing subsequences', 'maximum envelope nesting',
      'longest chain of pairs', 'patience sorting',
    ],
    useWhen: [
      'Finding longest ordered subsequence', 'Pairs or envelopes sorted and nested',
      'O(n log n) required: binary search + tails array',
    ],
    avoidWhen: [
      "Contiguous subarray needed (use Kadane's / sliding window)",
      'Two strings involved (use LCS)',
    ],
    stateTransition: [
      { code: 'O(n²): dp[i] = max(dp[j]+1) for all j<i where nums[j]<nums[i]', comment: '' },
      { code: 'O(n log n): maintain tails[], binary search for insert position', comment: '' },
    ],
    problems: [
      p('M', 'Longest Increasing Subsequence', '300', 'O(n²) DP or O(n log n) patience sort'),
      p('M', 'Number of Longest Increasing Subsequences', '673', 'Track length + count arrays'),
      p('M', 'Longest Bitonic Subsequence', 'pattern', 'LIS from left + LIS from right'),
      p('M', 'Maximum Length of Pair Chain', '646', 'Sort by end, LIS on pairs'),
      p('H', 'Russian Doll Envelopes', '354', 'Sort by w asc, h desc → LIS on h'),
      p('H', 'Longest Increasing Path in Matrix', '329', 'DFS + memo on matrix'),
    ],
  },

  // ─── DP: INTERVAL ───
  {
    id: 'dp-interval',
    label: 'Interval DP',
    icon: '⊨',
    iconBg: 'var(--purple-bg)',
    subtitle: 'dp[i][j] — solve subproblem on range [i, j] using a split point k',
    signals: [
      'split array at index k to solve left + right',
      'matrix chain multiplication', 'burst balloons / remove boxes',
      'minimum cost to merge stones', 'palindrome partitioning cost',
      'score after parenthesizing',
    ],
    useWhen: [
      'Optimal answer for [i,j] depends on split at k',
      'Problem asks about contiguous segments/ranges',
      'Smaller intervals combine into larger ones',
    ],
    avoidWhen: [
      'No "split" structure (use 1D or 2D DP)',
      'Intervals from input — check greedy first',
    ],
    stateTransition: [
      { code: '// Iterate by length, then start, then split point k', comment: '' },
      { code: 'for len 2..n: for i 0..n-len: j = i+len-1:', comment: '' },
      { code: '  dp[i][j] = min over k in [i, j-1] of dp[i][k] + dp[k+1][j] + cost', comment: '' },
    ],
    problems: [
      p('M', 'Palindromic Substrings', '647', 'Expand from center or dp[i][j]'),
      p('M', 'Longest Palindromic Subsequence', '516', 'dp[i][j] = dp[i+1][j-1]+2 if match'),
      p('H', 'Burst Balloons', '312', 'Last balloon k in [i,j] to burst'),
      p('H', 'Strange Printer', '664', 'Interval DP on print ranges'),
      p('H', 'Remove Boxes', '546', 'dp[i][j][k] with extra trailing boxes'),
      p('H', 'Minimum Cost to Merge Stones', '1000', 'Split every k piles, interval DP'),
    ],
  },

  // ─── DP: STATE MACHINE ───
  {
    id: 'dp-statemachine',
    label: 'State Machine DP',
    icon: '⚙',
    iconBg: 'var(--purple-bg)',
    subtitle: 'Finite number of states with defined transitions — buy/sell/hold/cooldown',
    signals: [
      'buy and sell stock with constraints', 'cooldown period after action',
      'at most k transactions', 'hold / not hold state',
      'transaction fee', 'finite states with named transitions',
    ],
    useWhen: [
      'Problem has explicit states (hold/sold/rest)',
      'Transitions between states are clear', 'State space is small and bounded',
    ],
    avoidWhen: [
      'States are not well-defined or enumerable',
      'No cooldown/transaction limit (simple greedy works)',
    ],
    stateTransitionTitle: 'State Transition (Stock with Cooldown)',
    stateTransition: [
      { code: 'hold[i] = max(hold[i-1], rest[i-1] - price[i])', comment: '' },
      { code: 'sold[i] = hold[i-1] + price[i]', comment: '' },
      { code: 'rest[i] = max(rest[i-1], sold[i-1])', comment: '' },
    ],
    problems: [
      p('E', 'Best Time to Buy and Sell Stock', '121', '1 transaction — track min price'),
      p('M', 'Best Time to Buy and Sell Stock II', '122', 'Unlimited — greedy sum of rises'),
      p('M', 'Best Time to Buy and Sell Stock with Cooldown', '309', '3 states: hold, sold, rest'),
      p('M', 'Best Time to Buy and Sell Stock with Fee', '714', '2 states: hold, cash'),
      p('H', 'Best Time to Buy and Sell Stock III', '123', 'At most 2 transactions — 4 states'),
      p('H', 'Best Time to Buy and Sell Stock IV', '188', 'At most k transactions — 2k states'),
    ],
  },

  // ─── DP: BITMASK ───
  {
    id: 'dp-bitmask',
    label: 'Bitmask DP',
    icon: '⊕',
    iconBg: 'var(--purple-bg)',
    subtitle: 'State encoded as bitmask — track which subset of items are used',
    signals: [
      'n ≤ 20 elements', 'visit all nodes / assign all tasks',
      'subset of items used so far', 'traveling salesman / assignment',
      'partition into k subsets', 'cover all requirements',
    ],
    useWhen: [
      'n ≤ 20 (2^n states feasible)', 'Need to track which items are included',
      'Order matters within the subset',
    ],
    avoidWhen: [
      'n > 20 (2^n too large)', "Order doesn't matter (use standard knapsack)",
      'Simple subset sum without ordering',
    ],
    stateTransition: [
      { code: '// dp[mask][i] = min cost to visit nodes in mask, ending at i', comment: '' },
      { code: 'for mask in 0..2^n: for i where mask&(1<<i):', comment: '' },
      { code: '  dp[mask|(1<<j)][j] = min(dp[mask][i] + dist[i][j])', comment: '' },
    ],
    problems: [
      p('M', 'Partition to K Equal Sum Subsets', '698', 'Bitmask + backtracking hybrid'),
      p('H', 'Shortest Path Visiting All Nodes', '847', 'BFS + bitmask state'),
      p('H', 'Minimum XOR Sum of Two Arrays', '1879', 'Assignment DP with bitmask'),
      p('H', 'Find the Shortest Superstring', '943', 'TSP-style bitmask DP'),
      p('H', 'Stickers to Spell Word', '691', 'BFS/DP on character coverage mask'),
    ],
  },

  // ─── DP: TREE ───
  {
    id: 'dp-tree',
    label: 'Tree DP',
    icon: '🌿',
    iconBg: 'var(--purple-bg)',
    subtitle: 'Post-order DFS — compute answer at each node from child results',
    signals: [
      'max/min path in tree', 'independent set on tree (no adjacent nodes)',
      'subtree size / depth', 'diameter of tree', 'min cameras to cover tree',
      'rerooting / centroid DP', 'coloring tree nodes with constraints',
    ],
    useWhen: [
      "Each node's answer depends on its children",
      'Choosing include/exclude for nodes in tree', 'Aggregating subtree info upward',
    ],
    avoidWhen: [
      'Graph has cycles (not a tree)', 'Answer only needs traversal — use simple DFS',
    ],
    stateTransitionTitle: 'State Transition (House Robber on Tree)',
    stateTransition: [
      { code: 'dfs(node) → (rob, skip):', comment: '' },
      { code: '  rob = node.val + sum(skip[child] for child)', comment: '' },
      { code: '  skip = sum(max(rob[c], skip[c]) for child)', comment: '' },
    ],
    problems: [
      p('M', 'House Robber III', '337', 'Post-order (rob, skip) pair'),
      p('M', 'Diameter of Binary Tree', '543', 'Max left depth + right depth'),
      p('M', 'Longest Univalue Path', '687', 'Post-order path through parent'),
      p('H', 'Binary Tree Maximum Path Sum', '124', 'Post-order + global max update'),
      p('H', 'Binary Tree Cameras', '968', '3-state greedy DP: covered/camera/uncovered'),
      p('H', 'Sum of Distances in Tree', '834', 'Rerooting DP — 2 DFS passes'),
    ],
  },

  // ─── TREES ───
  {
    id: 'trees',
    label: 'Trees',
    icon: '🌲',
    iconBg: 'var(--coral-bg)',
    subtitle: 'DFS (pre/in/post-order) and BFS (level-order) on tree structures',
    signals: [
      'binary tree / BST', 'tree height / depth', 'path sum',
      'lowest common ancestor', 'serialize / deserialize tree',
      'level order traversal', 'validate BST', 'diameter / balanced check',
    ],
    useWhen: [
      'DFS for path, depth, ancestor problems', 'BFS for level-order / minimum depth',
      'Inorder for BST (gives sorted order)', 'Post-order when child info needed first',
    ],
    avoidWhen: [
      'Shortest path in weighted graph (use Dijkstra)',
      'Graph has cycles (use DFS + visited set)',
    ],
    problems: [
      p('E', 'Maximum Depth of Binary Tree', '104', 'Post-order DFS'),
      p('E', 'Invert Binary Tree', '226', 'Swap children recursively'),
      p('E', 'Symmetric Tree', '101', 'Mirror DFS'),
      p('M', 'Binary Tree Level Order Traversal', '102', 'BFS with queue'),
      p('M', 'Validate Binary Search Tree', '98', 'Pass min/max bounds'),
      p('M', 'Lowest Common Ancestor of BST', '235', 'BST property navigation'),
      p('H', 'Binary Tree Maximum Path Sum', '124', 'Post-order + global max'),
      p('H', 'Serialize and Deserialize Binary Tree', '297', 'Preorder + delimiter'),
    ],
  },

  // ─── GRAPHS ───
  {
    id: 'graphs',
    label: 'Graphs (BFS/DFS/Topo)',
    icon: '🕸',
    iconBg: 'var(--coral-bg)',
    subtitle: 'Traversal, shortest path, connectivity, ordering',
    signals: [
      'connected components', 'shortest path (unweighted)', 'cycle detection',
      'topological sort / prerequisites', 'island count / flood fill',
      'bipartite check', 'word ladder / transformation',
    ],
    useWhen: [
      'BFS → shortest path / min steps', 'DFS → connected components / cycle',
      'Topo sort → dependency ordering', 'Dijkstra → weighted shortest path',
    ],
    avoidWhen: [
      'Tree problem (no cycles, no need for visited set)',
      'Weighted shortest path without Dijkstra/Bellman-Ford',
    ],
    problems: [
      p('E', 'Flood Fill', '733', 'DFS/BFS from start cell'),
      p('M', 'Number of Islands', '200', 'DFS + mark visited'),
      p('M', 'Course Schedule', '207', 'Topo sort / cycle detect'),
      p('M', 'Rotting Oranges', '994', 'Multi-source BFS'),
      p('M', 'Pacific Atlantic Water Flow', '417', 'Reverse BFS from edges'),
      p('H', 'Word Ladder', '127', 'BFS on word graph'),
      p('H', 'Alien Dictionary', '269', 'Topo sort from char order'),
    ],
  },

  // ─── UNION FIND ───
  {
    id: 'uf',
    label: 'Union Find',
    icon: '🔗',
    iconBg: 'var(--coral-bg)',
    subtitle: 'Efficiently track and merge disjoint components',
    signals: [
      'dynamic connectivity', 'number of connected components',
      'cycle detection in undirected graph', 'union operations online',
      "Kruskal's MST", 'friends / accounts merge',
    ],
    useWhen: [
      'Dynamic merging of groups', 'Online union + find queries',
      'Connectivity without full BFS/DFS',
    ],
    avoidWhen: [
      'Directed graph (use DFS + visited)', 'Need path between two nodes (use BFS)',
      "Edges are weighted (use Prim's / Dijkstra)",
    ],
    problems: [
      p('E', 'Find if Path Exists in Graph', '1971', 'Union all edges, find source'),
      p('M', 'Number of Connected Components', '323', 'Count distinct roots'),
      p('M', 'Redundant Connection', '684', 'Edge that creates cycle'),
      p('M', 'Accounts Merge', '721', 'Email → union accounts'),
      p('H', 'Number of Islands II', '305', 'Online union as land added'),
    ],
  },

  // ─── HEAP ───
  {
    id: 'heap',
    label: 'Heap / Priority Queue',
    icon: '⛰',
    iconBg: 'var(--amber-bg)',
    subtitle: 'Maintain sorted-by-priority access in O(log n)',
    signals: [
      'top K elements', 'Kth largest / smallest', 'merge K sorted lists',
      'median from data stream', 'next smallest in matrix',
      'task scheduling with cooldown', "Dijkstra's algorithm",
    ],
    useWhen: [
      'Repeatedly need min or max element', 'Dynamic stream of data with K-query',
      'Merging multiple sorted structures', 'Weighted graph shortest path',
    ],
    avoidWhen: [
      'Static data — just sort it O(n log n)', 'Need random access (use array)',
      'Only need a single pass max/min',
    ],
    problems: [
      p('E', 'Last Stone Weight', '1046', 'Max-heap simulation'),
      p('E', 'Kth Largest Element in a Stream', '703', 'Min-heap of size k'),
      p('M', 'Kth Largest Element in Array', '215', 'Min-heap or quickselect'),
      p('M', 'Task Scheduler', '621', 'Max-heap + cooldown queue'),
      p('M', 'K Closest Points to Origin', '973', 'Max-heap of size k'),
      p('H', 'Find Median from Data Stream', '295', 'Two heaps (max+min)'),
      p('H', 'Merge k Sorted Lists', '23', 'Min-heap with list nodes'),
    ],
  },

  // ─── BIT MANIPULATION ───
  {
    id: 'bit',
    label: 'Bit Manipulation',
    icon: '⊕',
    iconBg: 'var(--amber-bg)',
    subtitle: 'XOR, AND, OR, shifts for O(1) tricks and subset enumeration',
    signals: [
      'single number (others appear twice)', 'power of 2 check', 'count set bits',
      'XOR to find missing/duplicate', 'subset enumeration with bitmask',
      'swap without temp',
    ],
    useWhen: [
      'Operations on individual bits needed', 'XOR trick for unique/missing element',
      'Small n (≤20) subset enumeration', 'Space-O(1) replacement for hashmap',
    ],
    avoidWhen: [
      "Problem doesn't involve integers/bits", 'Bitmask DP state > 2^20 (too large)',
      'Readability matters more than micro-optimization',
    ],
    problems: [
      p('E', 'Single Number', '136', 'XOR all elements'),
      p('E', 'Number of 1 Bits', '191', 'n & (n-1) clears lowest bit'),
      p('E', 'Power of Two', '231', 'n & (n-1) == 0'),
      p('M', 'Sum of Two Integers', '371', 'XOR sum + AND carry'),
      p('M', 'Counting Bits', '338', 'dp[i] = dp[i>>1] + (i&1)'),
      p('H', 'Maximum AND Sum of Array', '2171', 'Bitmask DP'),
    ],
  },

  // ─── TRIE ───
  {
    id: 'trie',
    label: 'Trie',
    icon: '🔤',
    iconBg: 'var(--amber-bg)',
    subtitle: 'Character-by-character tree for prefix matching',
    signals: [
      'prefix search / autocomplete', 'word exists in dictionary',
      'search with wildcards (.)', 'words with common prefix',
      'replace words in sentence', 'stream of characters match',
    ],
    useWhen: [
      'Multiple prefix queries on same word set', 'Wildcard character matching needed',
      'Many shared prefixes (space efficient)',
    ],
    avoidWhen: [
      'Simple word lookup (HashSet is enough)', 'No prefix operation (sorted array better)',
      'Memory is tight (Trie has overhead)',
    ],
    problems: [
      p('M', 'Implement Trie', '208', 'TrieNode with children array'),
      p('M', 'Design Add and Search Words Data Structure', '211', "DFS on '.' wildcard"),
      p('M', 'Replace Words', '648', 'Trie prefix match'),
      p('H', 'Word Search II', '212', 'Trie + DFS on grid'),
      p('H', 'Concatenated Words', '472', 'Trie + DP'),
    ],
  },
]

// Add computed color field
patterns.forEach((pat) => {
  pat.color = catColor(pat.id)
})

// Build a lookup map
export const patternMap = Object.fromEntries(patterns.map((pat) => [pat.id, pat]))

// Home page pattern cards (all non-sub non-dp-overview patterns, plus dp)
export const HOME_CARDS = [
  'sliding', 'twoptr', 'prefix', 'hashing', 'bsearch', 'backtrack',
  'greedy', 'dp', 'trees', 'graphs', 'heap', 'mono', 'bit', 'trie', 'uf',
]

export default patterns
