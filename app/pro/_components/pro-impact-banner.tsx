"use client";

import React from "react";
import { Coffee, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProImpactBanner() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-10 shadow-xl">
        {/* Top Ambient Glow Gradient Bar (Blue Theme) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left 7 cols: Math & Perspective */}
          <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
            <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              Everything at less than{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 underline decoration-blue-500/50 decoration-wavy">
                ₹10 / day
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Think about it: A single cup of coffee or snack costs ₹80 to ₹150. With coding75 Pro, you get direct weekly mentorship from senior Tier-1 engineers for just{" "}
              <strong className="text-foreground font-bold">₹8/day</strong> on our 2-Year Pro Pass.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl border border-border/80 bg-background/90 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Monthly Pass
                </span>
                <p className="text-lg sm:text-xl font-black text-foreground font-mono">
                  ₹26 <span className="text-xs font-normal text-muted-foreground">/ day (₹799/mo)</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Zero long-term lock-in. Cancel anytime.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-blue-500/40 bg-blue-500/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    2-Year Pro Pass
                  </span>
                  <span className="text-[10px] font-black bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                    Best Value
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-black text-blue-700 dark:text-blue-300 font-mono">
                  ₹8 <span className="text-xs font-normal opacity-75">/ day (₹5,999 for 2 Years)</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Full 2 years (730 days) of live classes & opportunity drops.
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 cols: Comparison Snapshot */}
          <div className="lg:col-span-5 bg-card/90 backdrop-blur-md rounded-2xl border border-blue-500/20 p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Placement Investment Comparison</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start justify-between pb-2.5 border-b border-border/60">
                <div className="space-y-0.5">
                  <p className="font-semibold text-muted-foreground">Daily Coffee / Snacks</p>
                  <p className="text-[11px] text-muted-foreground/80">₹100 – ₹150 / day</p>
                </div>
                <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  Temporary Expense
                </span>
              </div>

              <div className="flex items-start justify-between pb-2.5 border-b border-border/60">
                <div className="space-y-0.5">
                  <p className="font-semibold text-muted-foreground">Legacy Bootcamps</p>
                  <p className="text-[11px] text-muted-foreground/80">₹50,000 – ₹1,50,000</p>
                </div>
                <span className="text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md">
                  Exorbitant Cost
                </span>
              </div>

              <div className="flex items-start justify-between p-3 rounded-xl bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-violet-600/15 border border-blue-500/30">
                <div className="space-y-0.5">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>coding75 Pro 2-Year Pass</span>
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 font-mono font-bold">
                    ₹8 / day (₹5,999 for 2 Years)
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md">
                  Infinite Career ROI
                </span>
              </div>
            </div>

            <Link
              href="#pricing"
              className="w-full h-10 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Explore Pro Plans Below</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
