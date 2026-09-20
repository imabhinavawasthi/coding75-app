"use client";

import React from "react";
import {
  Video,
  Radio,
  HelpCircle,
  BookOpen,
  Trophy,
  Users,
  Sparkles,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Award,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProFeaturesBento() {
  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs font-bold uppercase tracking-wider px-3 py-1 border-primary/30 bg-primary/10 text-primary"
        >
          Everything in One Pass
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          What You Get as a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Pro Member
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          No fragmented courses. No hidden upsells. A comprehensive engineering roadmap designed to take you from foundational basics to top tech offers.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Pillar 1: Full DSA Course (Featured Large Card) */}
        <div className="lg:col-span-2 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-8 space-y-5 shadow-sm hover:border-blue-500/50 transition-all group">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-md shadow-blue-500/10">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300">
              Recorded by Abhinav Awasthi
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Complete DSA Course & Video Lectures
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              18+ structured modules containing 150+ in-depth video walkthroughs. Every pattern is dissected on the digital whiteboard with multiple approaches (Brute-force → Optimal) and code in C++, Python, Java & JS.
            </p>
          </div>

          {/* Module tags */}
          <div className="pt-2 flex flex-wrap gap-2">
            {[
              "Arrays & Two Pointers",
              "Binary Search",
              "Recursion & Backtracking",
              "Linked Lists",
              "Trees & BST",
              "Dynamic Programming",
              "Graphs & BFS/DFS",
              "Trie & Bit Manipulation",
              "Greedy & Heaps",
            ].map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-border/80 bg-muted/40 text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pillar 2: Weekly Live DSA Classes */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-card via-card to-emerald-500/5 p-6 sm:p-8 space-y-5 shadow-sm hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <Radio className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              Every Weekend
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              Weekly Live DSA Classes
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join live interactive coding sessions where we solve real interview questions live, dissect runtime edge cases, and simulate real interview pressure.
            </p>
          </div>

          <div className="pt-2 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Weekend batch schedules (8:00 PM IST)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Full HD session recordings & notes provided</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Weekly Live Doubt Sessions */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 sm:p-8 space-y-5 shadow-sm hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-md shadow-amber-500/10">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
              Dedicated Support
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              Live Doubt Clearing Sessions
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Never get stuck for hours on a tricky LeetCode logic or TLE. Speak directly to mentors, share your screen, and debug your thought process in real time.
            </p>
          </div>

          <div className="pt-2 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>1:1 question resolution with mentors</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Zero pending doubts guarantee</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: CS Fundamentals & System Design Notes */}
        <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-card via-card to-purple-500/5 p-6 sm:p-8 space-y-5 shadow-sm hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-md shadow-purple-500/10">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300">
              Instant Revision
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              CS Fundamentals & System Design Notes
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              High-yield, recruiter-aligned notes for Operating Systems, DBMS, Computer Networks, and Low/High-Level System Design (LLD & HLD) blueprints.
            </p>
          </div>

          <div className="pt-2 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>OS, DBMS & Networks revision sheets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Real-world System Architecture interview templates</span>
            </div>
          </div>
        </div>

        {/* Pillar 5: Free Access to all CP Content */}
        <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-card via-card to-rose-500/5 p-6 sm:p-8 space-y-5 shadow-sm hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-md shadow-rose-500/10">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300">
              Rating Growth
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              Free Access to All CP Content
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Unlock competitive programming tracks, contest problem ladders, and past contest upsolving guides across Codeforces and CodeChef.
            </p>
          </div>

          <div className="pt-2 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Curated Codeforces Div-2/3 & CodeChef ladders</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Contest upsolving strategies by ICPC regionalists</span>
            </div>
          </div>
        </div>

        {/* Pillar 6: Pro Community & Curated Job Opportunities (Large) */}
        <div className="lg:col-span-2 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-card via-card to-indigo-500/5 p-6 sm:p-8 space-y-5 shadow-sm hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/10">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
              Opportunity Network
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Pro Community & Curated Tech Opportunities
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join an active, private network of ambitious software engineers and mentors. Get daily curated off-campus job drops, active internship test links, and peer accountability circles.
            </p>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-1">
              <p className="font-bold text-foreground">Curated Tech Drops</p>
              <p className="text-[11px]">Daily verified off-campus opportunities & test links</p>
            </div>
            <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-1">
              <p className="font-bold text-foreground">Internship Alerts</p>
              <p className="text-[11px]">Early application links with zero dead redirects</p>
            </div>
            <div className="p-3 rounded-xl border border-border/80 bg-muted/30 space-y-1">
              <p className="font-bold text-foreground">Peer Accountability</p>
              <p className="text-[11px]">Daily problem discussions & interview prep circles</p>
            </div>
          </div>
        </div>

        {/* Pillar 7: Masterclasses */}
        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-card via-card to-cyan-500/5 p-6 sm:p-8 space-y-5 shadow-sm hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-md shadow-cyan-500/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
              Industry Deep-Dives
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              Masterclasses by Top Mentors
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Specialized masterclasses covering modern tech stacks, AI coding workflows, resume tailoring, and behavioral interview mastery.
            </p>
          </div>

          <div className="pt-2 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span>Full-stack & AI architecture sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span>HR & salary negotiation masterclasses</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
