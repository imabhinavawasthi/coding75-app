"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Code2, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-violet-600/30 shadow-2xl overflow-hidden text-center">
        <div className="rounded-[22px] bg-card/95 border border-border/80 p-8 sm:p-12 lg:p-16 space-y-8 relative overflow-hidden backdrop-blur-xl">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-violet-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>START PREPARING TODAY</span>
          </div>

          {/* Heading */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Ready to Master DSA and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                Land Your Dream Offer?
              </span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Join 50,000+ ambitious developers. Solve curated problem sheets, build an ATS-compliant resume, and get guided by top software engineers.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden"
            >
              <Code2 className="w-4 h-4 text-blue-100" />
              <span>Launch Free Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/pro"
              className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden"
            >
              <Sparkles className="w-4 h-4 text-amber-100 group-hover:rotate-12 transition-transform" />
              <span>Unlock coding75 Pro</span>
            </Link>
          </div>

          {/* Guarantees / Trust Badges */}
          <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Free Access to CP Content</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>DSA Practice Sheets and Videos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>50,000+ Learners Prepping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
