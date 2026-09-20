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
  CheckCircle2,
  BookOpen,
  ChevronRight
} from "lucide-react";
import DashboardHeader from "./_components/dashboard-header";
import { DashboardNextClass } from "./_components/dashboard-next-class";
import { DashboardContinueLearning } from "./_components/dashboard-continue-learning";
import { DashboardPOTDWidget } from "./_components/dashboard-potd-widget";
import { useDashboardData } from "./_hooks/use-dashboard-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const dsaCards = [
  {
    title: "Learn DSA Curriculum",
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
    badge: "Blind 75 & Pattern Mastery",
    badgeColor: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    description: "Industry-standard problem lists including Blind 75, Newbie to Expert Sheet, coding75 Sheet with tracked completions.",
    tags: ["Blind 75", "Newbie to Expert", "Abhinav's SDE"],
    href: "/dsa/sheets",
    icon: Layers,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    linkText: "Solve Sheets",
  },
  {
    title: "DSA Masterclasses",
    badge: "Live Mentorship",
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
          "h-full relative overflow-hidden bg-card border border-border/80 rounded-2xl shadow-xs transition-all duration-300 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5",
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
    <Link href="/dsa/topic-tree" className="block group h-full focus:outline-none">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 sm:p-7 shadow-xl shadow-violet-500/15 border border-white/25 hover:shadow-2xl hover:shadow-violet-500/30 group-hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
        {/* Animated ambient background glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-950/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-300 via-pink-300 to-indigo-200 opacity-80" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30 shadow-inner group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-sm border border-white/30 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Interactive Graph</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>DSA Topic Tree Roadmap</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </h3>
            <p className="text-violet-100 text-xs sm:text-sm font-medium leading-relaxed">
              Explore our structured visual hierarchy mapping out 18+ foundational concepts, data structures, and algorithms in a top-to-bottom branching graph.
            </p>
          </div>

          {/* Mini roadmap nodes preview visualization with animated flow */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold border border-white/30 shadow-xs group-hover:bg-white/25 transition-colors">
              1. Fundamentals
            </div>
            <span className="text-white font-black text-xs animate-pulse">→</span>
            <div className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold border border-white/30 shadow-xs group-hover:bg-white/25 transition-colors">
              2. Data Structures
            </div>
            <span className="text-white font-black text-xs animate-pulse">→</span>
            <div className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold border border-white/30 shadow-xs group-hover:bg-white/25 transition-colors">
              3. Algorithms
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="relative z-10 pt-5 mt-4 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs font-bold text-white/95">
            Open Interactive Roadmap
          </span>
          <div className="rounded-xl bg-white text-violet-950 hover:bg-violet-50 font-black text-xs h-8 px-3.5 shadow-md flex items-center gap-1.5 group-hover:gap-2 transition-all">
            <span>Explore Tree</span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-950 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CuratedSheetsShowcaseCard() {
  const topSheets = [
    { name: "crackDSA Sprint 75", count: "75 Problems", tag: "Most Popular", href: "/dsa/sheets/crackdsa-revision-sprint" },
    { name: "Newbie to Expert Sheet", count: "800-1800 Rating", tag: "Structured CP", href: "/dsa/sheets/expert-sheet" },
    { name: "Abhinav's Pattern Mastery Sheet", count: "Top Interview Set", tag: "Handpicked", href: "/dsa/sheets/pattern-mastery" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full group hover:border-emerald-500/40 transition-all duration-300">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Curated Practice Sheets</span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-bold px-2 py-0.5 rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          >
            Tracked Progress
          </Badge>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Targeted SDE Problem Sets
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            Battle-tested problem lists designed to give maximum return on interview preparation time.
          </p>
        </div>

        {/* Mini Sheet List */}
        <div className="space-y-2 pt-1">
          {topSheets.map((sheet, idx) => (
            <Link
              key={idx}
              href={sheet.href}
              className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/70 hover:border-emerald-500/30 transition-all duration-200 group/item"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">
                  {sheet.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {sheet.count} • {sheet.tag}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/item:text-foreground group-hover/item:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Track problem status & bookmarks
        </span>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="rounded-xl font-bold text-xs h-8 px-3 border-border/80 hover:bg-muted gap-1.5"
        >
          <Link href="/dsa/sheets">
            <span>Browse All Sheets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { potd, loadingPotd, userStates, activeTopicProgress, loadingLearning } = useDashboardData();
  const isPOTDSolved = Boolean(potd?.id && userStates?.[potd.id]?.status === "done");

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-9">
      {/* 1. Command Center Header */}
      <DashboardHeader />

      {/* 2. Upcoming Live Session Countdown (for enrolled batch students) */}
      <DashboardNextClass />

      {/* 3. Bento Row 1: Action Center (Continue Learning Spotlight + Today's POTD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <DashboardContinueLearning
            progressData={activeTopicProgress}
            isLoading={loadingLearning}
          />
        </div>
        <div className="lg:col-span-5">
          <DashboardPOTDWidget
            potd={potd}
            isLoading={loadingPotd}
            isSolved={isPOTDSolved}
          />
        </div>
      </div>

      {/* 4. Bento Row 2: Flagship Visual Experiences (Topic Tree Roadmap + Curated Sheets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TopicTreePromoCard />
        <CuratedSheetsShowcaseCard />
      </div>

      {/* 5. Spotlight Banner: Post-Contest Problem Editorials & Video Solutions */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/25 p-6 sm:p-7 shadow-xs">
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

      {/* 6. Section 1: Data Structures & Algorithms */}
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

      {/* 7. Section 2: Core Engineering & Interview Preparation */}
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

      {/* 8. Section 3: Career Tools & Resume Maker */}
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
