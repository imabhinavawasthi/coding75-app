"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Code2,
  ComputerIcon,
  FileText,
  Flame,
  GitFork,
  GraduationCap,
  Layers,
  MessageSquare,
  Network,
  PlayCircle,
  Sparkles,
  Terminal,
  Trophy,
} from "lucide-react";
import DashboardHeader from "./_components/dashboard-header";
import { DashboardNextClass } from "./_components/dashboard-next-class";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const dsaCards = [
  {
    title: "Learn DSA",
    badge: "18+ Modules",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    description: "Structured visual roadmap from Arrays and Two Pointers to DP, Graphs, and Advanced Trees with step-by-step videos.",
    tags: ["Arrays", "Trees", "Graphs", "DP"],
    href: "/dsa",
    icon: GraduationCap,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25",
    hoverBorder: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    linkText: "Explore DSA",
  },
  {
    title: "Contest Problem Archive",
    badge: "500+ Solutions",
    badgeColor: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
    description: "Full post-contest video editorials, written intuition, and verified multi-language submissions for LeetCode, Codeforces, and CodeChef.",
    tags: ["LeetCode", "Codeforces", "CodeChef"],
    href: "/contests",
    icon: Trophy,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25",
    hoverBorder: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    linkText: "Explore Contests",
  },
  {
    title: "Curated Practice Sheets",
    badge: "Blind 75 & SDE",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    description: "Industry-standard problem lists including Blind 75, Newbie to Expert Sheet, coding75 Sheet with tracked completions.",
    tags: ["Blind 75", "Newbie to Expert Sheet", "Abhinav's DSA Sheet"],
    href: "/dsa/sheets",
    icon: Layers,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    linkText: "Solve Sheets",
  },
  {
    title: "DSA Masterclasses",
    badge: "Live Industry Mentorship",
    badgeColor: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
    description: "Deep algorithmic masterclasses covering Tree Rerooting, Digit DP, Segment Trees, and Maximum Network Flow.",
    tags: ["Range Queries", "Tree DP", "Flows"],
    href: "/masterclasses",
    icon: Sparkles,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25",
    hoverBorder: "hover:border-purple-500/50 hover:shadow-purple-500/10",
    linkText: "View Masterclasses",
  },
];

const interviewCards = [
  {
    title: "CS Fundamentals",
    badge: "Core Engineering",
    badgeColor: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
    description: "High-yield interview cheatsheets covering Operating Systems, DBMS, Computer Networks, and Object-Oriented Programming.",
    tags: ["OS", "DBMS", "Networks", "OOPs"],
    href: "/cs-fundamentals",
    icon: ComputerIcon,
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25",
    hoverBorder: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    linkText: "Study CS Core",
  },
  {
    title: "Production Projects",
    badge: "Full-Stack & Systems",
    badgeColor: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    description: "Architectural guides and source code for real-time distributed backends, modern web applications, and portfolio showpieces.",
    tags: ["Next.js", "Distributed Systems", "Docker"],
    href: "/projects",
    icon: Terminal,
    iconColor: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25",
    hoverBorder: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    linkText: "Build Projects",
  },
  {
    title: "System Design (HLD & LLD)",
    badge: "Scalability",
    badgeColor: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    description: "Distributed caching, rate limiters, message queues, microservices, database sharding, and clean low-level design patterns.",
    tags: ["Distributed Systems", "Caching", "LLD"],
    href: "/system-design",
    icon: GitFork,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    linkText: "Master System Design",
  },
  {
    title: "Interview Experiences",
    badge: "Real Debriefs",
    badgeColor: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    description: "Firsthand interview rounds, compensation insights, and question walkthroughs from Google, Amazon, Microsoft, and top startups.",
    tags: ["Google", "Amazon", "Microsoft"],
    href: "/interview-experiences",
    icon: MessageSquare,
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/25",
    hoverBorder: "hover:border-orange-500/50 hover:shadow-orange-500/10",
    linkText: "Read Experiences",
  },
];

const careerCards = [
  {
    title: "ATS Resume Builder",
    badge: "LaTeX Grade & ATS-Ready",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    description: "Create an ATS-optimized, clean tech resume proven to pass automated recruiter screening filters with high scoring rates.",
    tags: ["LaTeX Quality", "ATS Tested", "Instant PDF"],
    href: "/resume",
    icon: FileText,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    linkText: "Build Your Resume",
  },
  {
    title: "Jobs & Internships Portal",
    badge: "Verified Openings",
    badgeColor: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    description: "Curated active openings for software engineers, frontend, backend, full-stack interns, and remote tech roles.",
    tags: ["SDE Roles", "Internships", "Direct Apply"],
    href: "/opportunities",
    icon: Briefcase,
    iconColor: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25",
    hoverBorder: "hover:border-sky-500/50 hover:shadow-sky-500/10",
    linkText: "Explore Opportunities",
  },
];

function PremiumFeatureCard({ card }: { card: typeof dsaCards[0] }) {
  const Icon = card.icon;
  return (
    <Link href={card.href} className="group block h-full">
      <Card
        className={cn(
          "h-full relative overflow-hidden bg-card border border-border/80 rounded-2xl shadow-xs transition-all duration-200 flex flex-col justify-between hover:shadow-md",
          card.hoverBorder
        )}
      >
        <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
          <div className="space-y-3">
            {/* Top row: Icon container + Badge */}
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs",
                  card.iconBg
                )}
              >
                <Icon className={cn("w-5 h-5", card.iconColor)} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase",
                  card.badgeColor
                )}
              >
                {card.badge}
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Tags row */}
            {Array.isArray(card.tags) && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {card.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/70 text-muted-foreground border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Link Action */}
          <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
            <span>{card.linkText}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TopicTreePromoCard() {
  return (
    <Link href="/dsa/topic-tree" className="block group">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 sm:p-8 shadow-xl shadow-fuchsia-500/20 border border-white/20 hover:scale-[1.01] transition-transform duration-300">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-black opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
               <Network className="w-7 h-7 text-white drop-shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-sm">DSA Topic Tree Roadmap</h3>
                <span className="px-2 py-0.5 rounded-md bg-white text-violet-700 text-[10px] font-black uppercase tracking-widest shadow-sm animate-pulse">New</span>
              </div>
              <p className="text-white/90 text-xs sm:text-sm font-medium max-w-xl leading-relaxed">
                Explore our brand new interactive visual roadmap. Master Data Structures and Algorithms with a structured, top-to-bottom curriculum tree.
              </p>
            </div>
          </div>
          
          <div className="shrink-0">
             <Button variant="secondary" className="bg-white text-violet-700 hover:bg-white/90 font-bold shadow-md rounded-xl gap-2">
                Explore Curriculum <ArrowRight className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* 1. Hero Header */}
      <DashboardHeader />

      {/* Next Upcoming Live Session Countdown (for enrolled batch students) */}
      <DashboardNextClass />

      {/* 2. Topic Tree Promo Banner */}
      <TopicTreePromoCard />

      {/* 3. Spotlight Banner: Post-Contest Editorials & Solutions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/25 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  Weekly Contest Arena
                </span>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <PlayCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Video Solutions
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Post-Contest Problem Editorials & Video Solutions
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Step-by-step algorithmic intuition, mathematical complexity proofs, and verified C++ / Java / Python solutions for LeetCode Weekly/Biweekly, Codeforces, and CodeChef rounds.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/contests"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm hover:bg-primary/90 transition-all"
            >
              <Trophy className="w-4 h-4 mr-1.5" />
              Browse Contest Archive
            </Link>
            <Link
              href="/contests/leetcode-potd"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-border/80 bg-background hover:bg-muted text-foreground font-semibold text-xs sm:text-sm shadow-2xs transition-all"
            >
              <Flame className="w-4 h-4 mr-1.5 text-amber-500" />
              Daily POTD
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Section 1: Data Structures & Algorithms */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400">
              <Code2 className="w-4 h-4" />
              Algorithms & Problem Solving
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-0.5">
              Data Structures & Algorithms
            </h2>
          </div>
          <Link
            href="/dsa"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Explore All DSA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {dsaCards.map((card) => (
            <PremiumFeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      {/* 4. Section 2: Core Engineering & Interview Preparation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400">
              <Layers className="w-4 h-4" />
              Engineering & Systems
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-0.5">
              Interview Preparation & Systems
            </h2>
          </div>
          <Link
            href="/cs-fundamentals"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Explore Interview Prep</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {interviewCards.map((card) => (
            <PremiumFeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      {/* 5. Section 3: Career Tools & Resume Maker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-4 h-4" />
              Career Acceleration
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-0.5">
              Career & Resume Tools
            </h2>
          </div>
          <Link
            href="/resume"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Open Resume Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {careerCards.map((card) => (
            <PremiumFeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
