import React from "react";
import {
  Layers,
  Code2,
  GitCommit,
  Database,
  Network,
  Boxes,
  Workflow,
  Maximize2,
  Search,
  RotateCcw,
  Cpu,
  Zap,
  Binary,
  GraduationCap,
  Calculator,
  Terminal,
  Hash,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";

export interface DSATopicModule {
  id: string;
  title: string;
  category: "foundations" | "ds" | "algo";
  categoryLabel: string;
  description: string;
  icon: React.ElementType;
  difficulty: "Beginner" | "Medium" | "Advanced";
  topics: string[];
  gradient?: string;
  subtitle?: string;
  difficultyClass?: string;
  slug?: string;
  chaptersCount?: number;
  itemsCount?: number;
  lessonCount?: number;
  problemCount?: number;
  progressPercent?: number;
  isPro?: boolean;
  isUpcoming?: boolean;
}

export const TOPIC_KEYWORDS: Record<string, string[]> = {
  "complexity-foundations": ["complexity", "big o", "analysis"],
  "prog-foundations": ["programming", "foundations", "basics", "syntax", "language", "cpp", "java", "python"],
  "math-dsa": ["math", "number theory", "prime", "sieve", "modular", "gcd"],
  "problem-solving-mindset": ["problem solving", "mindset", "blueprint", "approach"],
  "arrays": ["array", "arrays", "vectors", "prefix sum", "subarray"],
  "strings": ["string", "strings", "pattern", "substring", "palindrome"],
  "linked-list": ["linked", "list", "linkedlist", "node", "singly", "doubly"],
  "stack-queue": ["stack", "queue", "monotonic", "deque"],
  "hashing-maps": ["hash", "hashmap", "hashing", "map", "set"],
  "trees": ["tree", "trees", "bst", "binary tree", "traversal"],
  "heaps": ["heap", "heaps", "priority queue"],
  "graphs": ["graph", "graphs", "bfs", "dfs", "dijkstra", "topological"],
  "two-pointers-window": ["two pointers", "pointer", "pointers", "sliding window", "window"],
  "binary-search": ["binary search", "search", "searching"],
  "sorting-comparators": ["sort", "sorting", "comparator"],
  "recursion-backtracking": ["recursion", "backtrack", "backtracking", "subset", "combination"],
  "dp": ["dynamic programming", "dp", "memoization", "tabulation"],
  "greedy": ["greedy", "intervals"],
  "bit-manipulation": ["bit", "bitwise", "bitmask"],
};

export const TOPIC_GRADIENTS = [
  "from-blue-600 via-indigo-600 to-violet-700",
  "from-cyan-600 via-teal-600 to-emerald-700",
  "from-violet-600 via-purple-600 to-pink-700",
  "from-amber-500 via-orange-600 to-rose-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-indigo-600 via-purple-600 to-violet-700",
  "from-rose-600 via-pink-600 to-purple-700",
  "from-purple-600 via-indigo-600 to-blue-700",
  "from-pink-600 via-rose-600 to-red-700",
  "from-sky-600 via-blue-600 to-indigo-700",
  "from-teal-600 via-cyan-600 to-blue-700",
];

export const TOPIC_CSS_GRADIENTS = [
  "linear-gradient(135deg, #2563eb, #4f46e5, #6d28d9)",
  "linear-gradient(135deg, #0891b2, #0d9488, #047857)",
  "linear-gradient(135deg, #7c3aed, #9333ea, #be185d)",
  "linear-gradient(135deg, #f59e0b, #ea580c, #be123c)",
  "linear-gradient(135deg, #059669, #0d9488, #0e7490)",
  "linear-gradient(135deg, #4f46e5, #7c3aed, #6d28d9)",
  "linear-gradient(135deg, #e11d48, #db2777, #7e22ce)",
  "linear-gradient(135deg, #9333ea, #4f46e5, #1d4ed8)",
  "linear-gradient(135deg, #db2777, #e11d48, #b91c1c)",
  "linear-gradient(135deg, #0284c7, #2563eb, #4338ca)",
  "linear-gradient(135deg, #0d9488, #0891b2, #1d4ed8)",
];

export function getTopicGradient(module: DSATopicModule, index: number = 0): string {
  if (module.gradient) return module.gradient;
  const hash = module.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TOPIC_GRADIENTS[(hash + index) % TOPIC_GRADIENTS.length];
}

export function getTopicGradientStyle(module: DSATopicModule, index: number = 0): string {
  const hash = module.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TOPIC_CSS_GRADIENTS[(hash + index) % TOPIC_CSS_GRADIENTS.length];
}

export const dsaModules: DSATopicModule[] = [
  // ── 1. FUNDAMENTALS ────────────────────────────────────────────────────────
  {
    id: "complexity-foundations",
    title: "Complexity & Big O Analysis",
    category: "foundations",
    categoryLabel: "Fundamentals",
    description: "Master Big O notation, time & space complexity, recursion call stacks, and dry run techniques.",
    icon: GraduationCap,
    difficulty: "Beginner",
    topics: ["Big-O Notation", "Time & Space Analysis", "Recursion Basics", "Pseudocode"],
  },
  {
    id: "prog-foundations",
    title: "Programming Foundations",
    category: "foundations",
    categoryLabel: "Fundamentals",
    description: "Memory layout, pass-by-reference vs value, control flow, functions, and dry-run execution.",
    icon: Terminal,
    difficulty: "Beginner",
    topics: ["Control Flow", "Functions & Scope", "Memory Stack", "Debugging"],
  },
  {
    id: "math-dsa",
    title: "Math & Number Theory",
    category: "foundations",
    categoryLabel: "Fundamentals",
    description: "Primes, Sieve of Eratosthenes, GCD/LCM, Modular Exponentiation, and Combinatorics.",
    icon: Calculator,
    difficulty: "Beginner",
    topics: ["Sieve of Eratosthenes", "Euclidean GCD", "Modular Arithmetic", "nCr / nPr"],
  },
  {
    id: "problem-solving-mindset",
    title: "Problem Solving Mindset",
    category: "foundations",
    categoryLabel: "Fundamentals",
    description: "Learn how to approach unseen coding problems, communicate edge cases, and refine solutions.",
    icon: Sparkles,
    difficulty: "Beginner",
    topics: ["Interview Blueprint", "Edge Case Analysis", "Dry Run Steps", "Communication"],
  },

  // ── 2. DATA STRUCTURES ───────────────────────────────────────────────────
  {
    id: "arrays",
    title: "Arrays",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "Static vs dynamic memory, prefix sums, difference arrays, 2D arrays, and in-place transformations.",
    icon: Layers,
    difficulty: "Beginner",
    topics: ["Memory Layout", "Prefix Sum", "Kadane's Algo", "Dutch National Flag"],
  },
  {
    id: "strings",
    title: "Strings & Pattern Matching",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "ASCII, immutability, frequency arrays, sliding window substrings, KMP and Rabin-Karp hashing.",
    icon: Code2,
    difficulty: "Beginner",
    topics: ["Character Maps", "Palindromes", "KMP Algorithm", "Anagrams"],
  },
  {
    id: "linked-list",
    title: "Linked Lists",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "Pointers, node references, Floyd's cycle detection, list reversal, and LRU Cache implementations.",
    icon: GitCommit,
    difficulty: "Medium",
    topics: ["Singly & Doubly", "Cycle Detection", "Merge Lists", "LRU Cache"],
  },
  {
    id: "stack-queue",
    title: "Stack & Queue Patterns",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "LIFO vs FIFO, Min Stack, Monotonic Stacks (Next Greater Element), and sliding window deque.",
    icon: Database,
    difficulty: "Medium",
    topics: ["Valid Parentheses", "Monotonic Stack", "Histogram Area", "Deque Max"],
  },
  {
    id: "hashing-maps",
    title: "Hashing & HashMaps",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "Hash functions, collision resolution, HashMap/HashSet patterns, frequency counting, and prefix states.",
    icon: Hash,
    difficulty: "Medium",
    topics: ["Collision Handling", "Subarray Sum K", "LRU / LFU Cache", "Group Anagrams"],
  },
  {
    id: "trees",
    title: "Trees & Binary Search Trees",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "Tree traversals (Pre, In, Post, Level-order), BST operations, Lowest Common Ancestor (LCA), and Tries.",
    icon: Network,
    difficulty: "Advanced",
    topics: ["DFS & BFS", "BST Validate", "LCA Problem", "Trie Prefix Tree"],
  },
  {
    id: "heaps",
    title: "Heaps & Priority Queues",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "Min/Max heaps, heapify in O(N), top-K elements pattern, median of data stream, and custom priority queues.",
    icon: Boxes,
    difficulty: "Medium",
    topics: ["Heapify", "Kth Largest", "Merge K Lists", "Stream Median"],
  },
  {
    id: "graphs",
    title: "Graph Data Structures",
    category: "ds",
    categoryLabel: "Data Structures",
    description: "Adjacency lists, BFS/DFS traversal, Topological Sort, Dijkstra's shortest path, DSU, and MST algorithms.",
    icon: Workflow,
    difficulty: "Advanced",
    topics: ["BFS & DFS", "Kahn's Algo", "Dijkstra", "Disjoint Set (DSU)"],
  },

  // ── 3. ALGORITHMS ─────────────────────────────────────────────────────────
  {
    id: "two-pointers-window",
    title: "Two Pointers & Sliding Window",
    category: "algo",
    categoryLabel: "Algorithms Track",
    description: "Optimize brute force O(N²) solutions down to O(N) using opposite, equi-directional, and fast/slow pointers.",
    icon: Maximize2,
    difficulty: "Medium",
    topics: ["2-Sum / 3-Sum", "Fixed Window", "Variable Window", "Fast & Slow Pointers"],
  },
  {
    id: "binary-search",
    title: "Searching & Binary Search",
    category: "algo",
    categoryLabel: "Algorithms Track",
    description: "Lower/upper bounds, searching in rotated arrays, and binary search on continuous answer spaces.",
    icon: Search,
    difficulty: "Medium",
    topics: ["Rotated Array", "2D Matrix Search", "Answer Space BS", "Aggressive Cows"],
  },
  {
    id: "sorting-comparators",
    title: "Sorting & Comparators",
    category: "algo",
    categoryLabel: "Algorithms Track",
    description: "Merge Sort, Quick Sort, Counting Sort, Radix Sort, Cycle Sort, and custom comparator logic.",
    icon: ArrowUpDown,
    difficulty: "Medium",
    topics: ["Merge Sort", "Quick Sort", "Custom Comparators", "Cycle Sort"],
  },
  {
    id: "recursion-backtracking",
    title: "Recursion & Backtracking",
    category: "algo",
    categoryLabel: "Algorithms Track",
    description: "Call stack mechanics, decision trees, subsets, permutations, N-Queens, and constraint satisfaction.",
    icon: RotateCcw,
    difficulty: "Advanced",
    topics: ["Subsets & Combo", "N-Queens", "Sudoku Solver", "Word Search"],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    category: "algo",
    categoryLabel: "Algorithms Track",
    description: "Overlapping subproblems, optimal substructure, 1D/2D DP, Knapsack variants, LIS, and state compression.",
    icon: Cpu,
    difficulty: "Advanced",
    topics: ["Memoization", "Tabulation", "0/1 Knapsack", "LCS & LIS"],
  },
  {
    id: "greedy",
    title: "Greedy Algorithms",
    category: "algo",
    categoryLabel: "Algorithms Track",
    description: "Local choice optimization, activity selection, fractional knapsack, Huffman coding, and interval scheduling.",
    icon: Zap,
    difficulty: "Medium",
    topics: ["Interval Merge", "Activity Select", "Gas Station", "Huffman Code"],
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    category: "algo",
    categoryLabel: "Algorithms Track",
    description: "Bitwise operators, XOR properties, subset generation via bitmasks, Brian Kernighan's bit-counting algorithm.",
    icon: Binary,
    difficulty: "Medium",
    topics: ["Bitwise Ops", "XOR Tricks", "Bitmasking", "Single Number"],
  },
];
