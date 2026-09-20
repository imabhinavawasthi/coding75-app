"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Video,
  Radio,
  HelpCircle,
  BookOpen,
  Trophy,
  Zap,
  Code2,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Maximize2,
  Settings,
  FileText,
  Clock,
  Layers,
} from "lucide-react";
import { HERO_SOCIAL_LOGOS } from "../_config/pro-logos";
import abhinavPic from "../../../public/pictures/abhinav.jpeg";

export function ProHero() {
  const [viewMode, setViewMode] = useState<"code" | "video">("code");
  const [codeLanguage, setCodeLanguage] = useState<"cpp" | "python" | "java">("python");
  const [playbackSpeed, setPlaybackSpeed] = useState<"1x" | "1.25x" | "1.5x">("1.5x");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      if (typeof window !== "undefined" && window.history) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  return (
    <section className="relative isolate pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* ── Background Grid & Aurora Horizon Atmosphere ────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      {/* Aurora Horizon Arc & Orbital Atmosphere (Premium Keynote Design) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* 1. Luminous Horizon Arc */}
        <div className="absolute -top-[280px] sm:-top-[360px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[450px] sm:h-[550px] rounded-[100%] border-t-2 border-blue-500/35 dark:border-blue-400/40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)]" />
        <div className="absolute -top-[278px] sm:-top-[358px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] h-[450px] sm:h-[550px] rounded-[100%] border-t border-indigo-400/30 dark:border-indigo-300/40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,white,transparent)] blur-[2px]" />

        {/* 2. Top Overhead Aurora Light Beam */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-b from-blue-500/25 via-indigo-600/15 to-transparent rounded-full blur-[90px] animate-pulse duration-[8000ms]" />

        {/* 3. Concentric Orbital Rings (Celestial Depth) */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-blue-500/10 dark:border-blue-400/15 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,white,transparent)]" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full border border-indigo-500/10 dark:border-indigo-400/10 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,white,transparent)]" />

        {/* 4. Atmospheric Side Bloom Orbs (Soft Cyan & Violet Flares) */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 -left-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[130px]" />
      </div>

      {/* 3. Floating Algorithmic Syntax Symbols in Background */}
      <div className="absolute top-20 left-10 text-xs font-mono font-bold text-blue-500/20 select-none pointer-events-none hidden lg:block animate-bounce duration-[6000ms]">
        O(N log N) • Binary Search
      </div>
      <div className="absolute top-44 right-12 text-xs font-mono font-bold text-indigo-500/20 select-none pointer-events-none hidden lg:block animate-bounce duration-[7000ms]">
        dp[i][j] • Memoization
      </div>
      <div className="absolute bottom-40 left-16 text-xs font-mono font-bold text-cyan-500/20 select-none pointer-events-none hidden lg:block">
        Graph BFS/DFS • Dijkstra
      </div>
      <div className="absolute bottom-56 right-20 text-xs font-mono font-bold text-purple-500/20 select-none pointer-events-none hidden lg:block">
        Sliding Window • Monotonic Stack
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-center">
        {/* ── Main Headline & Subtitle ────────────────────────────────────────── */}
        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.12]">
            Master DSA & Crack Dream Offers -{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              coding75 Pro
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            The definitive placement preparation curriculum. Master foundational to advanced DSA patterns, attend weekly interactive live problem-solving, get 1:1 live doubt resolution, and revise with CS Fundamentals & System Design blueprints.
          </p>

          {/* Action Buttons - Preserving exact user styling & choices */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            {/* Primary Glowing Amber Gradient Button */}
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              <Sparkles className="w-4 h-4 text-amber-100 group-hover:rotate-12 transition-transform" />
              <span>Choose Your Pro Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Secondary Glass Button - Preserving user's "Compare vs Others" text */}
            <a
              href="#comparison"
              onClick={(e) => scrollToSection(e, "comparison")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm sm:text-base text-foreground bg-card/80 hover:bg-muted border border-border/80 hover:border-blue-500/40 shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>Compare vs Others</span>
            </a>

            {/* Third Ghost Link */}
            <a
              href="#reviews"
              onClick={(e) => scrollToSection(e, "reviews")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <span>See Student Reviews</span>
            </a>
          </div>
        </div>

        {/* ── Interactive View Switcher (Problem IDE vs HD Video Lecture) ─────── */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2">
          <div className="inline-flex p-1.5 rounded-2xl bg-card/90 border border-blue-500/30 backdrop-blur-md shadow-xl gap-1.5 z-20">
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                viewMode === "code"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Interactive Problem IDE</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("video")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                viewMode === "video"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>HD Video Lecture Player</span>
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            {viewMode === "code"
              ? "⚡ Switch tabs above to preview the Live Video Lecture experience"
              : "💡 Switch tabs above to preview the Interactive Problem IDE experience"}
          </p>
        </div>

        {/* ── Visual Centrepiece Showcase Window ──────────────────────────────── */}
        <div className="relative max-w-4xl mx-auto">
          {/* Animated Glow Halo Behind Card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-violet-600/30 rounded-3xl blur-2xl opacity-75 -z-10" />

          {/* Floating Badges */}
          <div className="absolute -top-4 -left-3 sm:-left-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-card/90 backdrop-blur-md shadow-lg text-xs font-bold text-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Video className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {viewMode === "code" ? "150+ DSA Problems & Solutions" : "150+ In-Depth Whiteboard Videos"}
            </span>
          </div>

          <div className="absolute -bottom-4 -right-3 sm:-right-6 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-card/90 backdrop-blur-md shadow-lg text-xs font-bold text-foreground">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {viewMode === "code" ? "1:1 Live Doubt Solving" : "1080p HD with Speed Controls"}
            </span>
          </div>

          {/* ── MODE 1: Interactive Code / Problem IDE Showcase ──────────────── */}
          {viewMode === "code" && (
            <div className="rounded-3xl border border-blue-500/30 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
              {/* Window Titlebar */}
              <div className="px-4 py-3 bg-muted/40 border-b border-border/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-3 text-xs font-mono font-bold text-muted-foreground hidden sm:inline">
                    Dynamic Programming • Longest Common Subsequence
                  </span>
                </div>

                {/* Live Badge & Language Switcher */}
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    Live Classroom
                  </span>

                  <div className="flex items-center rounded-lg bg-background/80 p-0.5 border border-border/60 text-[11px] font-mono font-semibold">
                    <button
                      onClick={() => setCodeLanguage("python")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        codeLanguage === "python"
                          ? "bg-blue-600 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Python
                    </button>
                    <button
                      onClick={() => setCodeLanguage("cpp")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        codeLanguage === "cpp"
                          ? "bg-blue-600 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      C++
                    </button>
                    <button
                      onClick={() => setCodeLanguage("java")}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        codeLanguage === "java"
                          ? "bg-blue-600 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Java
                    </button>
                  </div>
                </div>
              </div>

              {/* Window Content: DSA Pattern & Code Breakdown */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left 5 cols: Intuition, Breakdown & Complexity */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Module 9: 2D Dynamic Programming</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-foreground">
                      Longest Common Subsequence
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Dissected from recursive tree intuition to space-optimized DP table. Mastered across strings, arrays, and subsequence patterns.
                    </p>
                  </div>

                  {/* Complexity Box */}
                  <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Time Complexity:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">O(M × N)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Space Complexity:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">O(N) [Optimized]</span>
                    </div>
                  </div>

                  {/* Mentor Live Note */}
                  <div className="p-2.5 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-foreground/90 leading-tight">
                      <strong className="text-blue-600 dark:text-blue-400">Live Mentor Tip:</strong> &ldquo;Notice how dp[i][j] only depends on the previous row. We can compress space from O(MN) to O(N)!&rdquo;
                    </p>
                  </div>
                </div>

                {/* Right 7 cols: Code Snippet */}
                <div className="lg:col-span-7 bg-background/90 rounded-2xl border border-border/80 p-4 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed shadow-inner">
                  {codeLanguage === "python" && (
                    <pre className="text-muted-foreground">
                      <span className="text-purple-400">def</span>{" "}
                      <span className="text-blue-400">longestCommonSubsequence</span>(text1:{" "}
                      <span className="text-yellow-400">str</span>, text2:{" "}
                      <span className="text-yellow-400">str</span>) -&gt;{" "}
                      <span className="text-yellow-400">int</span>:
                      {"\n"}    m, n = <span className="text-blue-400">len</span>(text1),{" "}
                      <span className="text-blue-400">len</span>(text2)
                      {"\n"}    dp = [<span className="text-orange-400">0</span>] * (n +{" "}
                      <span className="text-orange-400">1</span>)
                      {"\n"}
                      {"\n"}    <span className="text-purple-400">for</span> i{" "}
                      <span className="text-purple-400">in</span>{" "}
                      <span className="text-blue-400">range</span>(
                      <span className="text-orange-400">1</span>, m +{" "}
                      <span className="text-orange-400">1</span>):
                      {"\n"}        prev = <span className="text-orange-400">0</span>
                      {"\n"}        <span className="text-purple-400">for</span> j{" "}
                      <span className="text-purple-400">in</span>{" "}
                      <span className="text-blue-400">range</span>(
                      <span className="text-orange-400">1</span>, n +{" "}
                      <span className="text-orange-400">1</span>):
                      {"\n"}            temp = dp[j]
                      {"\n"}            <span className="text-purple-400">if</span> text1[i-
                      <span className="text-orange-400">1</span>] == text2[j-
                      <span className="text-orange-400">1</span>]:
                      {"\n"}                dp[j] = prev +{" "}
                      <span className="text-orange-400">1</span>
                      {"\n"}            <span className="text-purple-400">else</span>:
                      {"\n"}                dp[j] ={" "}
                      <span className="text-blue-400">max</span>(dp[j], dp[j-
                      <span className="text-orange-400">1</span>])
                      {"\n"}            prev = temp
                      {"\n"}    <span className="text-purple-400">return</span> dp[n]
                    </pre>
                  )}

                  {codeLanguage === "cpp" && (
                    <pre className="text-muted-foreground">
                      <span className="text-purple-400">int</span>{" "}
                      <span className="text-blue-400">longestCommonSubsequence</span>(string s1,
                      string s2) &#123;
                      {"\n"}    <span className="text-purple-400">int</span> m = s1.size(), n =
                      s2.size();
                      {"\n"}    vector&lt;<span className="text-purple-400">int</span>&gt; dp(n +{" "}
                      <span className="text-orange-400">1</span>,{" "}
                      <span className="text-orange-400">0</span>);
                      {"\n"}    <span className="text-purple-400">for</span> (
                      <span className="text-purple-400">int</span> i ={" "}
                      <span className="text-orange-400">1</span>; i &lt;= m; ++i) &#123;
                      {"\n"}        <span className="text-purple-400">int</span> prev ={" "}
                      <span className="text-orange-400">0</span>;
                      {"\n"}        <span className="text-purple-400">for</span> (
                      <span className="text-purple-400">int</span> j ={" "}
                      <span className="text-orange-400">1</span>; j &lt;= n; ++j) &#123;
                      {"\n"}            <span className="text-purple-400">int</span> temp = dp[j];
                      {"\n"}            <span className="text-purple-400">if</span> (s1[i -{" "}
                      <span className="text-orange-400">1</span>] == s2[j -{" "}
                      <span className="text-orange-400">1</span>])
                      {"\n"}                dp[j] = prev +{" "}
                      <span className="text-orange-400">1</span>;
                      {"\n"}            <span className="text-purple-400">else</span>
                      {"\n"}                dp[j] = max(dp[j], dp[j -{" "}
                      <span className="text-orange-400">1</span>]);
                      {"\n"}            prev = temp;
                      {"\n"}        &#125;
                      {"\n"}    &#125;
                      {"\n"}    <span className="text-purple-400">return</span> dp[n];
                      {"\n"}&#125;
                    </pre>
                  )}

                  {codeLanguage === "java" && (
                    <pre className="text-muted-foreground">
                      <span className="text-purple-400">public int</span>{" "}
                      <span className="text-blue-400">longestCommonSubsequence</span>(String s1,
                      String s2) &#123;
                      {"\n"}    <span className="text-purple-400">int</span> m = s1.length(), n =
                      s2.length();
                      {"\n"}    <span className="text-purple-400">int</span>[] dp ={" "}
                      <span className="text-purple-400">new int</span>[n +{" "}
                      <span className="text-orange-400">1</span>];
                      {"\n"}    <span className="text-purple-400">for</span> (
                      <span className="text-purple-400">int</span> i ={" "}
                      <span className="text-orange-400">1</span>; i &lt;= m; i++) &#123;
                      {"\n"}        <span className="text-purple-400">int</span> prev ={" "}
                      <span className="text-orange-400">0</span>;
                      {"\n"}        <span className="text-purple-400">for</span> (
                      <span className="text-purple-400">int</span> j ={" "}
                      <span className="text-orange-400">1</span>; j &lt;= n; j++) &#123;
                      {"\n"}            <span className="text-purple-400">int</span> temp = dp[j];
                      {"\n"}            <span className="text-purple-400">if</span> (s1.charAt(i -{" "}
                      <span className="text-orange-400">1</span>) == s2.charAt(j -{" "}
                      <span className="text-orange-400">1</span>)) &#123;
                      {"\n"}                dp[j] = prev +{" "}
                      <span className="text-orange-400">1</span>;
                      {"\n"}            &#125; <span className="text-purple-400">else</span> &#123;
                      {"\n"}                dp[j] = Math.max(dp[j], dp[j -{" "}
                      <span className="text-orange-400">1</span>]);
                      {"\n"}            &#125;
                      {"\n"}            prev = temp;
                      {"\n"}        &#125;
                      {"\n"}    &#125;
                      {"\n"}    <span className="text-purple-400">return</span> dp[n];
                      {"\n"}&#125;
                    </pre>
                  )}

                  {/* Status bar */}
                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> All 120 Test Cases Passed
                    </span>
                    <span>Beats 98.4% Runtime Solutions</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MODE 2: HD Video Lecture & Digital Whiteboard Showcase ───────── */}
          {viewMode === "video" && (
            <div className="rounded-3xl border border-blue-500/30 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
              {/* Window Titlebar */}
              <div className="px-4 py-3 bg-muted/40 border-b border-border/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-3 text-xs font-mono font-bold text-muted-foreground hidden sm:inline">
                    Module 12 • 0/1 Knapsack & Dynamic Programming • Masterclass
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider">
                    <Video className="w-3 h-3 text-blue-500" />
                    1080p Full HD
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                    <Clock className="w-3 h-3" /> 34m 10s
                  </span>
                </div>
              </div>

              {/* Video Player Canvas + Interactive Drawer */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left 8 cols: Digital Whiteboard Player Canvas */}
                <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-slate-950 border border-border/80 overflow-hidden relative shadow-inner">
                  {/* Subtle Whiteboard Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                  {/* Top Video Header Overlay */}
                  <div className="relative z-10 p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-red-600 font-black text-[10px] uppercase tracking-wider">
                        LIVE REPLAY
                      </span>
                      <span className="font-bold text-xs truncate max-w-[200px] sm:max-w-xs">
                        Recursion Tree to 1D Tabulation Breakdown
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-white/80">Ch. 3 / 5</span>
                  </div>

                  {/* Whiteboard Classroom Visual Diagram */}
                  <div className="relative z-10 p-4 sm:p-6 my-auto font-mono text-xs space-y-4 select-none">
                    {/* Problem Statement Note */}
                    <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-xs">
                      knapsack(W=7, items=[(1,1), (3,4), (4,5), (5,7)])
                    </div>

                    {/* Decision Tree Sketch */}
                    <div className="space-y-1 text-slate-300 text-[11px] sm:text-xs">
                      <p className="text-yellow-400 font-bold">
                        ✦ Decision Tree at index i = 3 (val=7, wt=5):
                      </p>
                      <div className="pl-3 border-l-2 border-blue-500/40 space-y-1 font-mono">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <span>├── Choice 1: TAKE</span>
                          <span className="text-slate-400">→ val=7 + solve(W=2, i=2)</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-400">
                          <span>└── Choice 2: SKIP</span>
                          <span className="text-slate-400">→ solve(W=7, i=2)</span>
                        </div>
                      </div>
                    </div>

                    {/* State transition formula doodle */}
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between">
                      <span>Optimal Transition: dp[w] = max(dp[w], val[i] + dp[w - wt[i]])</span>
                      <span className="text-[10px] text-emerald-400/80 font-semibold hidden sm:inline">
                        Space: O(W)
                      </span>
                    </div>
                  </div>

                  {/* Picture-in-Picture Mentor Camera Overlay */}
                  <div className="absolute bottom-16 right-3 sm:right-4 z-20 flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-black/85 border border-blue-500/40 backdrop-blur-md shadow-xl">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-blue-400 shrink-0">
                      <Image
                        src={abhinavPic}
                        alt="Abhinav Awasthi"
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left leading-tight">
                      <p className="text-[11px] font-bold text-white flex items-center gap-1">
                        <span>Abhinav Awasthi</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </p>
                      <p className="text-[9px] text-blue-300 font-mono">Lead Mentor (Speaking)</p>
                    </div>
                  </div>

                  {/* Video Scrubber & Playback Controls Bar */}
                  <div className="relative z-10 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent space-y-2 text-white">
                    {/* Progress Bar with Chapter Markers */}
                    <div className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-[42%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current" />
                          )}
                        </button>
                        <RotateCcw className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-pointer" />
                        <RotateCw className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-pointer" />
                        <span className="font-mono text-[11px] text-white/80">14:28 / 34:10</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px]">
                        {/* Speed selector */}
                        <div className="flex items-center rounded-lg bg-white/10 px-1.5 py-0.5 border border-white/20 gap-1 font-mono">
                          <button
                            onClick={() => setPlaybackSpeed("1x")}
                            className={`px-1 rounded ${
                              playbackSpeed === "1x" ? "text-blue-400 font-bold" : "text-white/70"
                            }`}
                          >
                            1x
                          </button>
                          <button
                            onClick={() => setPlaybackSpeed("1.25x")}
                            className={`px-1 rounded ${
                              playbackSpeed === "1.25x" ? "text-blue-400 font-bold" : "text-white/70"
                            }`}
                          >
                            1.25x
                          </button>
                          <button
                            onClick={() => setPlaybackSpeed("1.5x")}
                            className={`px-1 rounded ${
                              playbackSpeed === "1.5x" ? "text-blue-400 font-bold" : "text-white/70"
                            }`}
                          >
                            1.5x
                          </button>
                        </div>

                        <Volume2 className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-pointer" />
                        <Maximize2 className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 cols: Lecture Timeline & Interactive Notes */}
                <div className="lg:col-span-4 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-border/80">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>Lecture Timeline</span>
                      </span>
                      <span className="text-[10px] font-mono text-primary font-bold">5 Chapters</span>
                    </div>

                    {/* Chapter Timestamps */}
                    <div className="space-y-1.5 text-xs font-medium">
                      <div className="p-2 rounded-xl bg-muted/30 hover:bg-muted/60 text-muted-foreground flex items-center justify-between cursor-pointer transition-colors">
                        <span className="truncate">01. Problem Understanding</span>
                        <span className="font-mono text-[10px] opacity-75">00:00</span>
                      </div>
                      <div className="p-2 rounded-xl bg-muted/30 hover:bg-muted/60 text-muted-foreground flex items-center justify-between cursor-pointer transition-colors">
                        <span className="truncate">02. Why Greedy Fails</span>
                        <span className="font-mono text-[10px] opacity-75">05:12</span>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-between shadow-xs">
                        <span className="truncate">03. 2D DP Memoization</span>
                        <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">14:28 (Playing)</span>
                      </div>
                      <div className="p-2 rounded-xl bg-muted/30 hover:bg-muted/60 text-muted-foreground flex items-center justify-between cursor-pointer transition-colors">
                        <span className="truncate">04. Tabulation (Bottom-Up)</span>
                        <span className="font-mono text-[10px] opacity-75">21:05</span>
                      </div>
                      <div className="p-2 rounded-xl bg-muted/30 hover:bg-muted/60 text-muted-foreground flex items-center justify-between cursor-pointer transition-colors">
                        <span className="truncate">05. Space: O(NW) → O(W)</span>
                        <span className="font-mono text-[10px] opacity-75">28:40</span>
                      </div>
                    </div>
                  </div>

                  {/* Doubt Solving Banner */}
                  <div className="p-3 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 space-y-1">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Got Stuck on this Concept?</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Ask your doubt directly in our weekly interactive live doubt resolution classes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 6 Core Pillars Feature Grid (Focused on DSA & Main Features) ───── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 max-w-5xl mx-auto text-left">
          <div className="p-3 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 backdrop-blur-xs flex items-center gap-2.5 hover:border-blue-500/40 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">150+ DSA Videos</p>
              <p className="text-[10px] text-muted-foreground truncate">18+ Core Modules</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 backdrop-blur-xs flex items-center gap-2.5 hover:border-blue-500/40 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">Live Classes</p>
              <p className="text-[10px] text-muted-foreground truncate">Every Weekend</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 backdrop-blur-xs flex items-center gap-2.5 hover:border-blue-500/40 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">Live Doubts</p>
              <p className="text-[10px] text-muted-foreground truncate">1:1 Problem Help</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 backdrop-blur-xs flex items-center gap-2.5 hover:border-blue-500/40 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">CS & Design Notes</p>
              <p className="text-[10px] text-muted-foreground truncate">OS, DBMS, LLD/HLD</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 backdrop-blur-xs flex items-center gap-2.5 hover:border-blue-500/40 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">All CP Content</p>
              <p className="text-[10px] text-muted-foreground truncate">100% Free with Pro</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 backdrop-blur-xs flex items-center gap-2.5 hover:border-blue-500/40 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">Tech Job Drops</p>
              <p className="text-[10px] text-muted-foreground truncate">Verified Alerts</p>
            </div>
          </div>
        </div>

        {/* ── Social Proof Bar with Transparent Logos ────────────────────────── */}
        <div className="pt-8 border-t border-border/60">
          <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">
            coding75 Mentors & Placed Students work across top engineering companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {HERO_SOCIAL_LOGOS.map((logo) =>
              logo.logoDarkUrl ? (
                <React.Fragment key={logo.id}>
                  <img
                    src={logo.logoUrl}
                    alt={logo.alt}
                    className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                      logo.themeClass || ""
                    } object-contain dark:hidden`}
                  />
                  <img
                    src={logo.logoDarkUrl}
                    alt={logo.alt}
                    className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                      logo.themeClass || ""
                    } object-contain hidden dark:inline-block`}
                  />
                </React.Fragment>
              ) : (
                <img
                  key={logo.id}
                  src={logo.logoUrl}
                  alt={logo.alt}
                  className={`${logo.heightClass || "h-5 sm:h-6"} w-auto ${
                    logo.themeClass || ""
                  } object-contain`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
