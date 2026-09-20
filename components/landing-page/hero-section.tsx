"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  Video,
  FileText,
  CheckCircle2,
  Play,
  Pause,
  Flame,
  ExternalLink,
  ChevronRight,
  Check,
  BookOpen,
  Trophy,
  Server,
  Database,
  Cpu,
  Network,
} from "lucide-react";
import abhinavPic from "@/public/pictures/abhinav.jpeg";

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"sheets" | "contests" | "video" | "resume" | "cs">("sheets");
  const [codeLang, setCodeLang] = useState<"python" | "cpp" | "java">("cpp");
  const [selectedContest, setSelectedContest] = useState<"cf" | "lc" | "cc">("cf");
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<"1x" | "1.25x" | "1.5x">("1.5x");

  // Interactive sheet checklist simulation
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({
    "two-sum": true,
    "longest-substring": true,
    "trapping-rain-water": false,
    "coin-change": false,
  });

  const toggleProblem = (id: string) => {
    setCompletedProblems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="relative isolate pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      {/* ── Aurora Horizon & Orbital Atmosphere (Clean, Modern Non-Grid Design) ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* 1. Luminous Horizon Arc (Apple / Stripe Keynote horizon line) */}
        <div className="absolute -top-[280px] sm:-top-[360px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[450px] sm:h-[550px] rounded-[100%] border-t-2 border-blue-500/35 dark:border-blue-400/40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)]" />
        <div className="absolute -top-[278px] sm:-top-[358px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[450px] sm:h-[550px] rounded-[100%] border-t border-indigo-400/30 dark:border-indigo-300/40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)] blur-[2px]" />

        {/* 2. Top Overhead Aurora Light Beam */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-b from-blue-500/25 via-indigo-600/15 to-transparent rounded-full blur-[90px] animate-pulse duration-[8000ms]" />

        {/* 3. Concentric Orbital Rings (Subtle Celestial Frequency) */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/10 dark:border-blue-400/15 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,white,transparent)]" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full border border-indigo-500/10 dark:border-indigo-400/10 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,white,transparent)]" />

        {/* 4. Atmospheric Side Bloom Orbs (Soft Cyan & Violet Flares) */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 -left-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[130px]" />
      </div>

      {/* Floating Algorithmic Badges */}
      <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/85 border border-blue-500/30 backdrop-blur-md shadow-md text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 absolute top-24 left-10 pointer-events-none animate-bounce duration-[4000ms]">
        <span>⚡ O(N log N) • Binary Search</span>
      </div>
      <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/85 border border-indigo-500/30 backdrop-blur-md shadow-md text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 absolute top-36 right-12 pointer-events-none animate-bounce duration-[5000ms]">
        <span>dp[i][j] • Memoization</span>
      </div>
      <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/85 border border-emerald-500/30 backdrop-blur-md shadow-md text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 absolute bottom-36 left-12 pointer-events-none animate-bounce duration-[6000ms]">
        <span>🎯 98/100 • ATS Resume Match</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        {/* Shimmer Eyebrow Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-tight shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-mono">50,000+</span>
          <span>Learners</span>
          <span className="text-slate-400">•</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">Live Sessions & Masterclasses</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground tracking-tight leading-[1.08]">
            Everything You Need to{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              Crack Tech Interviews & Placements
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master Data Structures & Algorithms, System Design, and CS Fundamentals with battle-tested problem sheets, daily contest editorials, and weekly live mentorship cohorts.
          </p>
        </div>

        {/* Action Button CTA Row (First button: Start Learning for Free) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          {/* First Button: Start Learning for Free */}
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <Code2 className="w-4 h-4 text-blue-100" />
            <span>Start Learning for Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary Button: coding75 Pro */}
          <Link
            href="/pro"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden"
          >
            <Sparkles className="w-4 h-4 text-amber-100 group-hover:rotate-12 transition-transform" />
            <span>Explore coding75 Pro</span>
          </Link>

          {/* Tertiary Button: Browse Sheets */}
          <Link
            href="/dsa/sheets"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-foreground bg-card/85 hover:bg-muted border border-border/80 hover:border-blue-500/40 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Layers className="w-4 h-4 text-primary" />
            <span>Browse Sheets</span>
          </Link>
        </div>

        {/* Value Assurance Row (NO referrals!) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground pt-1">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Check className="w-3.5 h-3.5 text-blue-500" />
            <span>Complete DSA Course</span>
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Check className="w-3.5 h-3.5 text-blue-500" />
            <span>Interview Practice Sheets</span>
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Check className="w-3.5 h-3.5 text-blue-500" />
            <span>Daily Contest Editorials</span>
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Check className="w-3.5 h-3.5 text-blue-500" />
            <span>CS Fundamentals & System Design Notes</span>
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Check className="w-3.5 h-3.5 text-amber-500" />
            <span>Less than ₹10/day on Pro</span>
          </span>
        </div>

        {/* ── Interactive Multi-Tab Showcase Cockpit ── */}
        <div className="pt-6">
          <div className="inline-flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-card/90 border border-blue-500/30 backdrop-blur-md shadow-xl gap-1 sm:gap-1.5 z-20">
            {/* Tab 1: Curated Sheets */}
            <button
              type="button"
              onClick={() => setActiveTab("sheets")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "sheets"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Curated Sheets</span>
            </button>

            {/* Tab 2: CP Contests Discussion */}
            <button
              type="button"
              onClick={() => setActiveTab("contests")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "contests"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>CP Contests Discussion</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 font-bold">
                LIVE
              </span>
            </button>

            {/* Tab 3: Video Lectures */}
            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Lectures</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 font-bold">
                PRO
              </span>
            </button>

            {/* Tab 4: ATS Resume */}
            <button
              type="button"
              onClick={() => setActiveTab("resume")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "resume"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ATS Resume</span>
              <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 font-bold">
                98%
              </span>
            </button>

            {/* Tab 5: CS Fundamentals */}
            <button
              type="button"
              onClick={() => setActiveTab("cs")}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "cs"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>CS Notes</span>
            </button>
          </div>
        </div>

        {/* ── Tabbed Showcase Card Display (Mac Window Frame) ── */}
        <div className="relative mx-auto max-w-5xl rounded-3xl p-1 bg-gradient-to-b from-blue-500/30 via-indigo-500/20 to-border/40 shadow-2xl backdrop-blur-xl">
          <div className="rounded-[22px] bg-card/95 border border-border/80 overflow-hidden shadow-inner text-left">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="text-xs font-mono font-medium text-muted-foreground ml-2 hidden sm:inline">
                  {activeTab === "sheets" && "coding75 • SDE Sheet 180 (Top Tier-1 Placement Questions)"}
                  {activeTab === "contests" && "coding75 • CP Contests Discussion (Codeforces, LeetCode & CodeChef)"}
                  {activeTab === "video" && "coding75 Pro • Dynamic Programming Masterclass (Tree DP)"}
                  {activeTab === "resume" && "coding75 • ATS LaTeX Resume Optimizer (Score: 98/100)"}
                  {activeTab === "cs" && "coding75 • Core CS Fundamentals & High-Yield Interview Revision"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono">
                  {activeTab === "sheets" && "180 Problems"}
                  {activeTab === "contests" && "Live Contest Analysis"}
                  {activeTab === "video" && "1080p 60fps"}
                  {activeTab === "resume" && "ATS Score: 98/100"}
                  {activeTab === "cs" && "40+ Revision Notes"}
                </span>
              </div>
            </div>

            {/* TAB 1: CURATED PROBLEM SHEETS */}
            {activeTab === "sheets" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      SDE Placement Sheet (Curated 180 Problems)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Click checkboxes to test tracking your progress interactively
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      Progress: {Object.values(completedProblems).filter(Boolean).length} / 4 Completed
                    </span>
                    <Link
                      href="/dsa/sheets"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>Explore All Sheets</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Problem Table */}
                <div className="divide-y divide-border/60 rounded-xl border border-border/70 overflow-hidden bg-background/50">
                  {[
                    {
                      id: "two-sum",
                      title: "1. Two Sum",
                      topic: "Arrays & Hash Table",
                      difficulty: "Easy",
                      companies: ["Google", "Amazon", "Microsoft"],
                    },
                    {
                      id: "longest-substring",
                      title: "3. Longest Substring Without Repeating Characters",
                      topic: "Sliding Window",
                      difficulty: "Medium",
                      companies: ["Microsoft", "Uber", "Adobe"],
                    },
                    {
                      id: "trapping-rain-water",
                      title: "42. Trapping Rain Water",
                      topic: "Two Pointers & Monotonic Stack",
                      difficulty: "Hard",
                      companies: ["Google", "Amazon", "ServiceNow"],
                    },
                    {
                      id: "coin-change",
                      title: "322. Coin Change (Fewest Coins)",
                      topic: "Dynamic Programming",
                      difficulty: "Medium",
                      companies: ["Amazon", "Microsoft", "OpenText"],
                    },
                  ].map((prob) => {
                    const isDone = !!completedProblems[prob.id];
                    return (
                      <div
                        key={prob.id}
                        className={`flex items-center justify-between p-3 sm:p-4 gap-3 transition-colors ${
                          isDone ? "bg-emerald-500/[0.04]" : "hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleProblem(prob.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                              isDone
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-border hover:border-primary"
                            }`}
                            aria-label={`Mark ${prob.title} completed`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="min-w-0">
                            <p
                              className={`text-xs sm:text-sm font-semibold truncate ${
                                isDone ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
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

                          <div className="hidden sm:flex items-center gap-1">
                            {prob.companies.slice(0, 2).map((comp) => (
                              <span
                                key={comp}
                                className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>

                          <Link
                            href="/dsa"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <span>Solve</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CP CONTESTS DISCUSSION & EDITORIALS */}
            {activeTab === "contests" && (
              <div className="space-y-0 divide-y divide-border/80">
                {/* Platform Contest Switcher Pills */}
                <div className="p-3 bg-muted/40 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedContest("cf")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedContest === "cf"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-card text-muted-foreground hover:text-foreground border border-border/70"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                      <span>Codeforces 998 (Div. 2)</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full font-mono ${
                        selectedContest === "cf" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        1650
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedContest("lc")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedContest === "lc"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-card text-muted-foreground hover:text-foreground border border-border/70"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                      <span>LeetCode Weekly 428</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full font-mono ${
                        selectedContest === "lc" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        Hard
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedContest("cc")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedContest === "cc"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-card text-muted-foreground hover:text-foreground border border-border/70"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                      <span>CodeChef Starters 170</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded-full font-mono ${
                        selectedContest === "cc" ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        1820
                      </span>
                    </button>
                  </div>

                  <Link
                    href="/contests"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0 hidden sm:inline-flex items-center gap-1"
                  >
                    <span>Browse All Contests</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Main Contest Cockpit Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/80">
                  {/* Code Window Left */}
                  <div className="lg:col-span-7 p-4 sm:p-5 font-mono text-xs space-y-3 bg-card">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <div className="flex items-center gap-1.5">
                        {(["cpp", "python", "java"] as const).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setCodeLang(lang)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                              codeLang === lang
                                ? "bg-primary text-primary-foreground shadow-2xs"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            {lang === "cpp" && "C++ 20 (CP)"}
                            {lang === "python" && "Python 3"}
                            {lang === "java" && "Java 17"}
                          </button>
                        ))}
                      </div>

                      <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>
                          {selectedContest === "cf" && "CF 998 • Problem C (1650)"}
                          {selectedContest === "lc" && "LC 428 • Q3 (Hard)"}
                          {selectedContest === "cc" && "CC 170 • Starters D"}
                        </span>
                      </span>
                    </div>

                    <pre className="text-foreground/90 overflow-x-auto leading-relaxed text-[11px] sm:text-xs">
                      {selectedContest === "cf" && codeLang === "cpp" && (
                        <code>{`#include <bits/stdc++.h>
using namespace std;

// Codeforces 998 (Div. 2) - Problem C: Game with XOR Multiset
void solve() {
    int n; long long k;
    if (!(cin >> n >> k)) return;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    sort(a.begin(), a.end());
    int l = 0, r = n - 1;
    long long totalScore = 0;

    // Two-pointer pairing to dodge anti-hash hack tests: O(N log N)
    while (l < r) {
        long long sum = a[l] + a[r];
        if (sum == k) {
            totalScore++;
            l++; r--;
        } else if (sum < k) {
            l++;
        } else {
            r--;
        }
    }
    cout << totalScore << "\\n";
}`}</code>
                      )}

                      {selectedContest === "cf" && codeLang === "python" && (
                        <code>{`import sys

# Codeforces 998 (Div. 2) - Problem C (Python 3)
def solve():
    lines = sys.stdin.read().split()
    if not lines: return
    t = int(lines[0])
    idx = 1
    for _ in range(t):
        n, k = int(lines[idx]), int(lines[idx+1])
        idx += 2
        a = sorted(int(x) for x in lines[idx:idx+n])
        idx += n
        l, r = 0, n - 1
        score = 0
        while l < r:
            s = a[l] + a[r]
            if s == k:
                score += 1
                l += 1; r -= 1
            elif s < k:
                l += 1
            else:
                r -= 1
        print(score)`}</code>
                      )}

                      {selectedContest === "cf" && codeLang === "java" && (
                        <code>{`import java.io.*;
import java.util.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st;
        int t = Integer.parseInt(br.readLine().trim());
        while (t-- > 0) {
            st = new StringTokenizer(br.readLine());
            int n = Integer.parseInt(st.nextToken());
            long k = Long.parseLong(st.nextToken());
            long[] a = new long[n];
            st = new StringTokenizer(br.readLine());
            for (int i = 0; i < n; i++) a[i] = Long.parseLong(st.nextToken());
            Arrays.sort(a);
            int l = 0, r = n - 1; long score = 0;
            while (l < r) {
                long sum = a[l] + a[r];
                if (sum == k) { score++; l++; r--; }
                else if (sum < k) l++;
                else r--;
            }
            System.out.println(score);
        }
    }
}`}</code>
                      )}

                      {selectedContest === "lc" && (
                        <code>{`class Solution {
public:
    // LeetCode Weekly 428 Q3 - Monotonic Queue & Prefix Invariant
    long long countBeautifulSubstrings(string s, int k) {
        int n = s.size();
        // Precompute modulo root for vowel-consonant balance
        int root = 1;
        while ((root * root) % (4 * k) != 0) root++;

        unordered_map<int, unordered_map<int, int>> countMap;
        countMap[0][0] = 1;
        long long ans = 0;
        int diff = 0, vowels = 0;

        for (int i = 0; i < n; i++) {
            char c = s[i];
            if (c=='a'||c=='e'||c=='i'||c=='o'||c=='u') {
                vowels++; diff++;
            } else {
                diff--;
            }
            ans += countMap[diff][vowels % root]++;
        }
        return ans;
    }
};`}</code>
                      )}

                      {selectedContest === "cc" && (
                        <code>{`#include <bits/stdc++.h>
using namespace std;

// CodeChef Starters 170 - Tree Distance Partitioning (Tree DP)
const int MAXN = 200005;
vector<int> adj[MAXN];
long long subtreeSize[MAXN], ans[MAXN];
int N;

void dfsDown(int u, int p) {
    subtreeSize[u] = 1;
    for (int v : adj[u]) {
        if (v == p) continue;
        dfsDown(v, u);
        subtreeSize[u] += subtreeSize[v];
    }
}

void dfsReroot(int u, int p) {
    for (int v : adj[u]) {
        if (v == p) continue;
        ans[v] = ans[u] + (N - 2 * subtreeSize[v]);
        dfsReroot(v, u);
    }
}`}</code>
                      )}
                    </pre>
                  </div>

                  {/* Right Complexity & Contest Discussion Notes */}
                  <div className="lg:col-span-5 p-4 sm:p-5 space-y-4 bg-muted/20">
                    <div className="space-y-1">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center justify-between">
                        <span>Contest Analysis</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {selectedContest === "cf" && "Codeforces Div. 2"}
                          {selectedContest === "lc" && "LeetCode Weekly"}
                          {selectedContest === "cc" && "CodeChef Starters"}
                        </span>
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl border border-border bg-card">
                          <p className="text-[10px] text-muted-foreground font-medium">Time Complexity</p>
                          <p className="text-xs font-mono font-bold text-foreground">
                            {selectedContest === "cf" && "O(N log N)"}
                            {selectedContest === "lc" && "O(N · √K)"}
                            {selectedContest === "cc" && "O(N) Rerooting"}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-xl border border-border bg-card">
                          <p className="text-[10px] text-muted-foreground font-medium">Contest Rating</p>
                          <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                            {selectedContest === "cf" && "1650 Rating (Div 2 C)"}
                            {selectedContest === "lc" && "2150+ Rating (Hard)"}
                            {selectedContest === "cc" && "1820 Rating (Starters)"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CP Key Insights */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold">
                        Editorial Discussion & Upsolving
                      </p>

                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="p-2.5 rounded-lg bg-card border border-border/80">
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>1. Invariant & Subproblem Structure</span>
                          </p>
                          <p className="text-[11px] mt-0.5">
                            {selectedContest === "cf" &&
                              "Greedy matching via sorted two-pointers strictly maximizes paired subsets without state explosion."}
                            {selectedContest === "lc" &&
                              "Modulo root condition transforms quadratic substring scan into linear prefix hash counting."}
                            {selectedContest === "cc" &&
                              "Rerooting DFS computes all node partitions in O(N) rather than recomputing from scratch."}
                          </p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-card border border-border/80">
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>2. Anti-TLE & Contest Defense</span>
                          </p>
                          <p className="text-[11px] mt-0.5">
                            {selectedContest === "cf" &&
                              "Using sort + two pointers prevents adversarial anti-hash tests from hacking unordered_map to O(N²)."}
                            {selectedContest === "lc" &&
                              "Precomputing the minimal square root bound minimizes hash table footprint and cache misses."}
                            {selectedContest === "cc" &&
                              "Flatten recursion or reserve recursion depth to avoid stack overflow under deep tree tests."}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <Link
                          href="/contests"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all"
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>All Contest Discussions</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/contests/leetcode-potd"
                          className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold transition-all"
                        >
                          <span>Daily POTD</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PRO VIDEO LECTURE WHITEBOARD */}
            {activeTab === "video" && (
              <div className="relative bg-slate-950 text-white p-4 sm:p-6 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Left: Whiteboard Canvas */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-xs font-mono font-bold text-blue-400">
                          Lecture 42 • Dynamic Programming on Trees
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {(["1x", "1.25x", "1.5x"] as const).map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => setPlaybackSpeed(spd)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                              playbackSpeed === spd
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                          >
                            {spd}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Diagram preview box */}
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
                      <p className="text-slate-400 text-[11px]">
                        // Tree DP State: dp[u][0] = without u, dp[u][1] = with u
                      </p>
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-blue-300 space-y-1">
                        <p className="text-amber-400">Root Node (1)</p>
                        <p className="pl-4">├── Child (2) → dp[2][0] + max(dp[3][...])</p>
                        <p className="pl-4">└── Child (3) → Subtree optimum value</p>
                      </div>
                    </div>

                    {/* Playback scrubber */}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <button
                        type="button"
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center cursor-pointer transition-colors"
                      >
                        {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <span className="font-mono text-[11px]">18:45 / 45:10</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full w-[42%] bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Right: Instructor Profile */}
                  <div className="md:col-span-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-blue-500/50 shadow-lg">
                      <Image
                        src={abhinavPic}
                        alt="Abhinav Awasthi"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">Abhinav Awasthi</p>
                      <p className="text-xs text-slate-400">Lead Mentor & Course Instructor</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <Link
                        href="/pro"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Join Live Cohort</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ATS LATEX RESUME BUILDER */}
            {activeTab === "resume" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      FAANG-Vetted ATS LaTeX Resume Optimizer
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Real-time keyword matching, single-column clean format, and one-click export
                    </p>
                  </div>
                  <Link
                    href="/resume"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shrink-0"
                  >
                    <span>Build Your Resume (100% Free)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left Resume Preview */}
                  <div className="md:col-span-8 p-4 rounded-xl border border-border bg-background font-mono text-[11px] space-y-2.5">
                    <div className="text-center pb-2 border-b border-border/60">
                      <p className="font-bold text-sm text-foreground">ALEX CHEN</p>
                      <p className="text-[10px] text-muted-foreground">
                        alex.chen@email.com • github.com/alexchen • leetcode.com/alexchen
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-bold text-primary text-[11px] uppercase tracking-wider">
                        Technical Experience
                      </p>
                      <p className="font-semibold text-foreground">
                        Software Engineer Intern • Cloud Infrastructure
                      </p>
                      <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                        <li>
                          Architected high-throughput microservices using Go and Redis, reducing latency by 38%.
                        </li>
                        <li>
                          Implemented distributed caching layer handling 50,000+ QPS with 99.99% uptime.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Score Gauge */}
                  <div className="md:col-span-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3 text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 font-mono font-bold text-lg">
                      98
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">ATS Compliance Score</p>
                      <p className="text-[11px] text-muted-foreground">
                        Matches 98% of Tier-1 SDE job criteria
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center pt-1">
                      {["Distributed Systems", "Go", "Redis", "Microservices", "REST API"].map((kw) => (
                        <span
                          key={kw}
                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-semibold"
                        >
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CS FUNDAMENTALS & SYSTEM DESIGN NOTES */}
            {activeTab === "cs" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Core CS Fundamentals & High-Frequency Interview Notes
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Fast-track revision summaries for Operating Systems, DBMS, Networks, and System Design
                    </p>
                  </div>
                  <Link
                    href="/cs-fundamentals"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0"
                  >
                    <span>Browse All Notes</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      subject: "Operating Systems",
                      icon: Cpu,
                      topics: ["Process vs Threads", "Virtual Memory & Paging", "Deadlocks & Semaphores", "CPU Scheduling"],
                      badge: "PYQs Included",
                    },
                    {
                      subject: "DBMS & SQL",
                      icon: Database,
                      topics: ["ACID Properties", "B+ Tree Indexing", "Transactions & Isolation", "Indexing Optimization"],
                      badge: "PYQs Included",
                    },
                    {
                      subject: "Computer Networks",
                      icon: Network,
                      topics: ["TCP 3-Way Handshake", "DNS Resolution Flow", "HTTP/2 vs HTTP/3", "WebSockets & TLS"],
                      badge: "PYQs Included",
                    },
                    {
                      subject: "System Design",
                      icon: Server,
                      topics: ["Consistent Hashing", "Redis Distributed Cache", "Rate Limiting Algorithms", "CAP Theorem"],
                      badge: "PYQs Included",
                    },
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border/80 bg-background/60 space-y-2.5 hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-muted-foreground">
                            {card.badge}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-foreground">{card.subject}</p>
                        <ul className="space-y-1 text-[11px] text-muted-foreground">
                          {card.topics.map((t) => (
                            <li key={t} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-blue-500" />
                              <span className="truncate">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
