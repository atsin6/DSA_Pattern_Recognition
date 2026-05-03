// Cross-pattern comparison cards for the Compare page

export const comparisons = [
  {
    title: 'Sliding Window  vs  Two Pointers',
    left: {
      name: 'Sliding Window',
      points: [
        'Contiguous subarray / substring',
        'Frequency / count constraint within window',
        'Window expands/shrinks based on HashMap state',
        'Array can be unsorted',
      ],
    },
    right: {
      name: 'Two Pointers',
      points: [
        'Pair / triplet sum with target',
        'Array must be sorted (or sorting valid)',
        'Pointers move toward each other (not same direction)',
        'In-place modification / partition',
      ],
    },
    rule: 'If you need a HashMap inside the loop → Sliding Window. If sorted + pair search → Two Pointers.',
  },
  {
    title: 'BFS  vs  DFS',
    left: {
      name: 'BFS',
      points: [
        'Shortest path in unweighted graph',
        'Level-by-level processing needed',
        'Minimum steps / hops',
        'Uses Queue — iterative naturally',
      ],
    },
    right: {
      name: 'DFS',
      points: [
        'Connected components / flood fill',
        'Cycle detection',
        'Path existence / backtracking',
        'Uses Stack / recursion naturally',
      ],
    },
    rule: 'Need shortest path or minimum steps → BFS. Need all paths, cycle, or connectivity → DFS.',
  },
  {
    title: 'Greedy  vs  Dynamic Programming',
    left: {
      name: 'Greedy',
      points: [
        'Local optimal = global optimal (provable)',
        'No backtracking needed',
        'Interval / scheduling problems',
        'O(n log n) after sort',
      ],
    },
    right: {
      name: 'Dynamic Programming',
      points: [
        'Choices affect future states',
        'Overlapping subproblems',
        'Count of ways, not just yes/no',
        '0/1 decisions (include or skip)',
      ],
    },
    rule: 'Try Greedy first. If a counterexample breaks it → use DP. 0/1 Knapsack always needs DP.',
  },
  {
    title: 'Heap  vs  Sorting',
    left: {
      name: 'Heap (Priority Queue)',
      points: [
        'Data arrives dynamically (stream)',
        'Repeatedly need current min/max',
        'k-th element with online updates',
        'O(n log k) for top-k problems',
      ],
    },
    right: {
      name: 'Sorting',
      points: [
        'All data available upfront',
        'Need full order once',
        'Simpler code, same O(n log n)',
        'Random access after sorting needed',
      ],
    },
    rule: 'Static data + single sort pass → Sort. Dynamic/streaming data + repeated min/max → Heap.',
  },
  {
    title: 'Prefix Sum  vs  Sliding Window',
    left: {
      name: 'Prefix Sum',
      points: [
        'Count subarrays with exact sum = k',
        'Many random range queries',
        'Negative numbers in array',
        'Combines with HashMap for count',
      ],
    },
    right: {
      name: 'Sliding Window',
      points: [
        'Longest/shortest window with constraint',
        'All numbers non-negative (monotone sum)',
        'Fixed window size',
        'Window shrinks/grows dynamically',
      ],
    },
    rule: 'Contains negative numbers + exact sum count → Prefix Sum. Non-negative + max/min length window → Sliding Window.',
  },
]
