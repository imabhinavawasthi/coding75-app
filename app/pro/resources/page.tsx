"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Download,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Code2,
  Layers,
  Lock,
} from "lucide-react";
import { useProStatus } from "@/hooks/use-pro-status";
import { ProRequiredModal } from "@/components/pro/pro-required-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PRO_RESOURCES = [
  {
    title: "Complete DSA Cheatsheet (C++ & Java)",
    category: "Cheat Sheets",
    description: "Time & space complexity summary, STL & Collections reference, common edge case traps.",
    fileType: "PDF Guide",
    href: "/dsa",
  },
  {
    title: "FAANG 14 Coding Patterns Master Notes",
    category: "Interview Prep",
    description: "Sliding Window, Two Pointers, Fast & Slow, Monotonic Stack, Top-K, Subsets, Cyclic Sort.",
    fileType: "Curated Guide",
    href: "/dsa/sheets",
  },
  {
    title: "System Design Primer & High-Level Architecture",
    category: "System Design",
    description: "Caching, Load Balancing, Consistent Hashing, Sharding, Microservices architectures.",
    fileType: "Full Notes",
    href: "/system-design",
  },
  {
    title: "CS Fundamentals Fast-Track Revision",
    category: "Core Subjects",
    description: "Top 100 interview questions & answers across OS, DBMS, Networks, and Object-Oriented Design.",
    fileType: "Interview Notes",
    href: "/cs-fundamentals",
  },
  {
    title: "High-Score ATS LaTeX Resume Templates",
    category: "Career Kit",
    description: "Clean single-page templates approved by recruiters at Google, Microsoft, and Amazon.",
    fileType: "Templates",
    href: "/resume",
  },
  {
    title: "Real SDE Interview Experiences Archive",
    category: "Archives",
    description: "Detailed round-by-round interview debriefs with problem solutions and follow-ups.",
    fileType: "Debriefs",
    href: "/interview-experiences",
  },
];

export default function ProResourcesPage() {
  const { isPro, isLoading: loading } = useProStatus();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Loading Pro Resources...</p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md border border-amber-500/20">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl font-black text-foreground">Pro Resources Locked</h1>
          <p className="text-sm text-muted-foreground">
            These exclusive notes, cheat sheets, and templates are exclusively for coding75 Pro members.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/pro/checkout?plan=yearly"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-sm shadow-xl shadow-amber-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Unlock Pro Access</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProRequiredModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Pro Vault</span>
        </div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          Pro Learning Materials &amp; Notes
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          High-yield cheat sheets, pattern blueprints, and interview playbooks prepared by lead engineers to speed up your preparation.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRO_RESOURCES.map((item) => (
          <Link key={item.title} href={item.href} className="block h-full">
            <Card className="h-full border-border/80 hover:border-amber-500/40 hover:shadow-md transition-all group bg-card">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {item.fileType}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform pt-1">
                  <span>View Material</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
