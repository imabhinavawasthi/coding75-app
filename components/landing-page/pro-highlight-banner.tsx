"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  Video,
  Radio,
  HelpCircle,
  BookOpen,
  Briefcase,
  Zap,
  CheckCircle2,
} from "lucide-react";
import abhinavPic from "@/public/pictures/abhinav.jpeg";

export function ProHighlightBanner() {
  const proPerks = [
    {
      icon: Video,
      title: "150+ In-Depth DSA Videos",
      desc: "Recorded by Abhinav Awasthi covering intuition, math proofs & space compression.",
    },
    {
      icon: Radio,
      title: "Live Interactive Weekend Classes",
      desc: "Every weekend live problem breakdowns on hard Dynamic Programming and Graphs.",
    },
    {
      icon: HelpCircle,
      title: "Live 1:1 Doubt Solving",
      desc: "Live mentor support so you never spend days stuck on one tricky bug.",
    },
    {
      icon: BookOpen,
      title: "CS & System Design Notes",
      desc: "Ready-to-revise notes on OS, DBMS, Networks, OOPs, LLD and HLD architectures.",
    },
    {
      icon: Briefcase,
      title: "Curated Tech Job Drops",
      desc: "Direct hiring alerts and internship openings from high-growth tech startups.",
    },
    {
      icon: Zap,
      title: "All CP Content 100% Free",
      desc: "Unrestricted access to every Codeforces and CodeChef masterclass.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-amber-500/40 via-orange-500/30 to-blue-500/40 shadow-2xl overflow-hidden">
        <div className="rounded-[22px] bg-card p-6 sm:p-10 lg:p-12 space-y-10 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Top Badge & Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
                Supercharge Your Prep with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                  coding75 Pro
                </span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Everything you need to break into Tier-1 tech: structured video lectures, weekly live classes, instant doubt resolution, and CS fundamental notes.
              </p>
            </div>

            {/* Lead Mentor Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/80 bg-background/60 backdrop-blur-xs shrink-0">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-amber-500/40 shrink-0">
                <Image src={abhinavPic} alt="Abhinav Awasthi" fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Lead Instructor
                </p>
                <p className="text-sm font-extrabold text-foreground">Abhinav Awasthi</p>
                <p className="text-[11px] text-muted-foreground">Cracked Amazon, Linkedin, Zeta</p>
              </div>
            </div>
          </div>

          {/* 6 Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {proPerks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-border/70 bg-background/50 space-y-2.5 hover:border-amber-500/40 hover:bg-muted/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{perk.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Strip */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Available in 1-Month, 1-Year & Lifetime Access passes</span>
            </div>

            <Link
              href="/pro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>Explore Pro Membership Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
