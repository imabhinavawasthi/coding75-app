"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  Flame,
  Sparkles,
  BookOpen,
  FileText,
  GitFork,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Layers,
  Video,
} from "lucide-react";

export function FeaturesBento() {
  const bentoItems = [
    {
      id: "sheets",
      title: "Curated Problem Sheets",
      badge: "Flagship Practice",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      description:
        "Master the exact problems asked at FAANG & top tier-1 product companies. SDE Sheet 180, Blind 75, Love Babbar 450, and NeetCode 150 with company tagging and live progress tracking.",
      link: "/dsa/sheets",
      linkText: "Browse All Sheets",
      icon: Layers,
      colSpan: "lg:col-span-7",
      features: [
        "Pattern Mastery Sheet (Top 180 Questions)",
        "crackDSA Sprint 75 Sheet",
        "Company Filters: Google, Amazon, Microsoft",
        "Save & Track Progress In Real-Time",
      ],
    },
    {
      id: "potd",
      title: "Daily POTD & Contest Editorials",
      badge: "Updated Daily",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      description:
        "Never get stuck on a daily problem or weekend contest. Instant intuitive editorials with Python, C++, and Java solutions for LeetCode POTD, Codeforces, and CodeChef rounds.",
      link: "/contests",
      linkText: "Solve Today's POTD",
      icon: Flame,
      colSpan: "lg:col-span-5",
      features: [
        "Daily LeetCode Problem",
        "Weekly & Biweekly Contest Editorials",
        "Codeforces & CodeChef Editorials",
        "Detailed Editorials",
      ],
    },
    {
      id: "pro",
      title: "coding75 Pro",
      badge: "Less than ₹10/day | 2-Year Complete Prep | 4.9★ Rated",
      badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40",
      description:
        "Complete DSA course and 150+ video lectures, weekly live weekend masterclasses, 1:1 live doubt sessions, CS Fundamentals, and System Design Notes.",
      link: "/pro",
      linkText: "View Pro Details & Pricing",
      icon: Sparkles,
      colSpan: "lg:col-span-5",
      highlightCard: true,
      features: [
        "Complete DSA Course",
        "Live Weekend Classes & Doubt Solving",
        "CS & System Design Notes (OS, DBMS)",
        "All Competitive Programming Free",
      ],
    },
    {
      id: "cs-fundamentals",
      title: "CS Fundamentals & System Design",
      badge: "Interview Specific",
      badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      description:
        "Fast-track interview revision notes for Operating Systems, DBMS & SQL, Computer Networks, and Object-Oriented Design. Plus Low-Level (LLD) and High-Level Design (HLD) crash notes.",
      link: "/cs-fundamentals",
      linkText: "Study CS Notes",
      icon: BookOpen,
      colSpan: "lg:col-span-7",
      features: [
        "Operating Systems (Process, Threads, Memory)",
        "DBMS & High-Frequency SQL Queries",
        "Computer Networks (TCP/IP, HTTP/3, WebSockets)",
        "System Design (Caching, Sharding, Microservices)",
      ],
    },
    {
      id: "resume",
      title: "ATS-Optimized LaTeX Resume Builder",
      badge: "100% Free",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      description:
        "Craft an ATS-compliant software engineering resume in minutes. Built-in recruiter keyword matching, verified bullet point templates, and clean one-click LaTeX code export.",
      link: "/resume",
      linkText: "Build ATS Resume",
      icon: FileText,
      colSpan: "lg:col-span-6",
      features: [
        "FAANG-Vetted Single-Page Layout",
        "Real-Time ATS Keyword Match Score",
        "One-Click Overleaf & PDF Export",
        "Action-Verb Bullet Generators",
      ],
    },
    {
      id: "topic-tree",
      title: "Interactive DSA Topic Tree",
      badge: "Visual Roadmap",
      badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
      description:
        "Ditch random problem solving. Navigate an interconnected skill graph that guides you step-by-step from fundamental Arrays to advanced Segment Trees, Tries, and DP.",
      link: "/dsa/topic-tree",
      linkText: "Explore Topic Graph",
      icon: GitFork,
      colSpan: "lg:col-span-6",
      features: [
        "Visual Prerequisite Dependencies",
        "Beginner to Advanced Path Progression",
        "Node Completion Checkpoints",
        "Company-Tagged Problem Roadmaps",
      ],
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Header with Blue Theme (TUF Benchmark) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          One Platform.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Learn. Practice. Get Placed.

          </span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          From daily guided problem sprints to live mentor masterclasses and FAANG-vetted ATS resumes — everything is engineered for high-yield placement results.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {bentoItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`${item.colSpan} rounded-3xl border ${
                item.highlightCard
                  ? "border-amber-500/30 bg-gradient-to-b from-card via-card to-amber-500/5 shadow-lg shadow-amber-500/5"
                  : "border-blue-500/20 bg-gradient-to-b from-card via-card to-blue-500/5"
              } p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      item.highlightCard
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/60">
                  {item.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-foreground/90">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          item.highlightCard
                            ? "text-amber-500"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={item.link}
                  className={`inline-flex items-center gap-1.5 text-xs font-extrabold ${
                    item.highlightCard
                      ? "text-amber-600 dark:text-amber-400 hover:text-amber-500"
                      : "text-blue-600 dark:text-blue-400 hover:text-blue-500"
                  } transition-colors group`}
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
