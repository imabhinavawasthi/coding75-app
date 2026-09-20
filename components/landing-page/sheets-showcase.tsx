"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  ExternalLink,
  Code2,
  Building2,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";

interface ProblemRow {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  companies: string[];
  href: string;
}

const SHEETS_DATA: Record<
  string,
  {
    name: string;
    description: string;
    totalProblems: number;
    difficultyCount: { easy: number; medium: number; hard: number };
    problems: ProblemRow[];
  }
> = {
  sde: {
    name: "Pattern Mastery Sheet",
    description: "The gold-standard 180 questions asked repeatedly in Tier-1 technical interviews.",
    totalProblems: 180,
    difficultyCount: { easy: 45, medium: 105, hard: 30 },
    problems: [
      {
        id: "sde-1",
        title: "Set Matrix Zeroes",
        topic: "Arrays",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Google"],
        href: "/dsa",
      },
      {
        id: "sde-2",
        title: "Pascal's Triangle & Variation",
        topic: "Arrays & Math",
        difficulty: "Easy",
        companies: ["Amazon", "Adobe", "Microsoft"],
        href: "/dsa",
      },
      {
        id: "sde-3",
        title: "Next Permutation",
        topic: "Arrays & Two Pointers",
        difficulty: "Medium",
        companies: ["Google", "Meta", "Amazon"],
        href: "/dsa",
      },
      {
        id: "sde-4",
        title: "Kadane's Algorithm (Max Subarray)",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        companies: ["Microsoft", "LinkedIn", "Apple"],
        href: "/dsa",
      },
      {
        id: "sde-5",
        title: "Sort an Array of 0s, 1s and 2s (Dutch Flag)",
        topic: "Arrays",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "ServiceNow"],
        href: "/dsa",
      },
    ],
  },
  blind75: {
    name: "crackDSA Sprint 75",
    description: "The essential 75 pattern-based questions required for high-velocity interview prep.",
    totalProblems: 75,
    difficultyCount: { easy: 20, medium: 45, hard: 10 },
    problems: [
      {
        id: "b75-1",
        title: "Best Time to Buy and Sell Stock",
        topic: "Arrays & Sliding Window",
        difficulty: "Easy",
        companies: ["Amazon", "Google", "Microsoft"],
        href: "/dsa",
      },
      {
        id: "b75-2",
        title: "Contains Duplicate",
        topic: "Hash Table",
        difficulty: "Easy",
        companies: ["Apple", "Amazon", "Adobe"],
        href: "/dsa",
      },
      {
        id: "b75-3",
        title: "Product of Array Except Self",
        topic: "Prefix Sum",
        difficulty: "Medium",
        companies: ["Amazon", "Meta", "Microsoft"],
        href: "/dsa",
      },
      {
        id: "b75-4",
        title: "3Sum (Zero Sum Triplets)",
        topic: "Two Pointers",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Meta"],
        href: "/dsa",
      },
      {
        id: "b75-5",
        title: "Container With Most Water",
        topic: "Two Pointers",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Uber"],
        href: "/dsa",
      },
    ],
  },
  dsa450: {
    name: "0 to Hero DSA Sheet",
    description: "Comprehensive end-to-end curriculum covering every fundamental and edge-case concept.",
    totalProblems: 450,
    difficultyCount: { easy: 110, medium: 260, hard: 80 },
    problems: [
      {
        id: "d450-1",
        title: "Reverse an Array / String In-Place",
        topic: "Basics & Pointers",
        difficulty: "Easy",
        companies: ["Amazon", "TCS", "Infosys"],
        href: "/dsa",
      },
      {
        id: "d450-2",
        title: "Find Min and Max Element in an Array",
        topic: "Arrays",
        difficulty: "Easy",
        companies: ["Microsoft", "Samsung"],
        href: "/dsa",
      },
      {
        id: "d450-3",
        title: "Kth Smallest Element in Unsorted Array",
        topic: "Heap & Quickselect",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Flipkart"],
        href: "/dsa",
      },
      {
        id: "d450-4",
        title: "Union and Intersection of Two Sorted Arrays",
        topic: "Two Pointers",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft"],
        href: "/dsa",
      },
      {
        id: "d450-5",
        title: "Cyclically Rotate an Array by One",
        topic: "Arrays",
        difficulty: "Easy",
        companies: ["Adobe", "Amazon"],
        href: "/dsa",
      },
    ],
  },
};

export function SheetsShowcase() {
  const [selectedSheet, setSelectedSheet] = useState<string>("sde");
  const sheet = SHEETS_DATA[selectedSheet];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Practice the Sheets that{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Top Engineers Swear By
          </span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Don&apos;t practice 2,000 random questions. Focus on the high-yield curated lists that cover every core interview pattern.
        </p>
      </div>

      {/* Sheet Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Object.entries(SHEETS_DATA).map(([key, data]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedSheet(key)}
            className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedSheet === key
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>{data.name}</span>
            <span className="ml-2 opacity-75 font-mono text-xs">({data.totalProblems})</span>
          </button>
        ))}
      </div>

      {/* Selected Sheet Card */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-b from-card via-card to-blue-500/5 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">{sheet.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{sheet.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono">
              {sheet.difficultyCount.easy} Easy
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono">
              {sheet.difficultyCount.medium} Medium
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 font-mono">
              {sheet.difficultyCount.hard} Hard
            </span>
          </div>
        </div>

        {/* Problems List Table */}
        <div className="divide-y divide-border/60 rounded-2xl border border-border/80 overflow-hidden bg-background/60">
          {sheet.problems.map((prob, idx) => (
            <div
              key={prob.id}
              className="flex items-center justify-between p-3.5 sm:p-4 gap-3 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 text-xs font-mono font-bold text-muted-foreground shrink-0 text-center">
                  0{idx + 1}
                </span>

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                    {prob.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{prob.topic}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                    prob.difficulty === "Easy"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : prob.difficulty === "Medium"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : "bg-red-500/15 text-red-600 dark:text-red-400"
                  }`}
                >
                  {prob.difficulty}
                </span>

                <div className="hidden md:flex items-center gap-1">
                  {prob.companies.map((comp) => (
                    <span
                      key={comp}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                    >
                      {comp}
                    </span>
                  ))}
                </div>

                <Link
                  href={prob.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <span>Solve</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Complete solutions with time/space complexity analysis available for all questions.
          </p>

          <Link
            href="/dsa/sheets"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors group"
          >
            <span>Browse Complete {sheet.totalProblems} Questions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
