"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Lock,
  MessageCircle,
  Clock,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PRO_PRICING_PLANS, PricingPlan } from "../_config/pro-config";
import { whatsapp_link, telegram_link } from "@/components/social-links";
import { useProStatus } from "@/hooks/use-pro-status";

export function ProPricingCards() {
  const { isPro } = useProStatus();
  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Section Header with Blue Theme (matching Top Engineers) */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent & Pocket-Friendly</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Choose Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
            Pro Plan
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Unlock the complete DSA course, live weekly classes, doubt resolution, and curated tech opportunities at less than ₹10/day.
        </p>
      </div>

      {/* Pricing Cards 3-Column Grid with Strict Alignment & Blue Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {PRO_PRICING_PLANS.map((plan: PricingPlan) => {
          const isAnnual = plan.id === "yearly";
          const isLifetime = plan.id === "lifetime";
          const isMonthly = plan.id === "monthly";

          // Dedicated styling per tier to avoid dullness and elevate visual hierarchy
          const cardBorderAndBg = isAnnual
            ? "border-2 border-blue-500 bg-gradient-to-b from-blue-500/12 via-card to-card shadow-2xl shadow-blue-500/20 z-10 md:-translate-y-2 ring-1 ring-blue-500/30"
            : isLifetime
            ? "border-2 border-amber-500/35 bg-gradient-to-b from-amber-500/[0.06] via-card to-card hover:border-amber-500/60 shadow-xl hover:shadow-2xl hover:shadow-amber-500/15"
            : "border-2 border-sky-500/35 bg-gradient-to-b from-sky-500/[0.06] via-card to-card hover:border-sky-500/60 shadow-lg hover:shadow-xl hover:shadow-sky-500/15";

          const badgeStyles = isAnnual
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/40"
            : isLifetime
            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-amber-400/30"
            : "bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 text-white shadow-md shadow-sky-500/30 ring-1 ring-sky-400/30";

          const ctaButtonStyles = isAnnual
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/45 ring-2 ring-blue-400/30"
            : isLifetime
            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/45 ring-2 ring-amber-400/30"
            : "bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-400 hover:via-blue-500 hover:to-cyan-400 text-white shadow-xl shadow-sky-500/30 hover:shadow-2xl hover:shadow-sky-500/45 ring-2 ring-sky-400/30";

          const pillStyles = isAnnual
            ? "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300"
            : isLifetime
            ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300"
            : "bg-sky-500/10 border-sky-500/20 text-sky-700 dark:text-sky-300";

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 h-full ${cardBorderAndBg}`}
            >
              {/* Badge for highlighted plans */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                  <span
                    className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap ${badgeStyles}`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Main Card Content Container (flex-1 to push footer down evenly) */}
              <div className="flex flex-col flex-1">
                {/* 1. Uniform Header Block */}
                <div className="min-h-[80px] flex flex-col justify-start">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">
                    {plan.tagline}
                  </p>
                </div>

                {/* 2. Uniform Price Block */}
                <div className="min-h-[135px] pb-5 pt-3 border-y border-border/60 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-4xl font-black text-foreground font-mono tracking-tight">
                        ₹{plan.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-base text-muted-foreground line-through font-mono">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <span className="text-muted-foreground font-semibold">
                        {plan.billingPeriod}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {plan.discountPercent}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Daily Cost Equivalent Hook */}
                  <div className="pt-2">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${pillStyles}`}>
                      <Clock className="w-3.5 h-3.5 shrink-0 opacity-80" />
                      {plan?.dailyCostEquivalent === "0" ? (
                        <span>Lifetime Access</span>
                      ) : (
                        <span>Equivalent to {plan.dailyCostEquivalent}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Features Checklist Area (flex-1 so lists occupy same vertical space) */}
                <div className="flex-1 py-5 space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2.5 text-xs">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground leading-snug">{feat.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. Action / CTA Footer Block (Horizontally pinned across all 3 cards) */}
              <div className="pt-5 border-t border-border/60 space-y-3">
                {/* Active Checkout Button / View Pro Dashboard */}
                <div className="relative group">
                  <Link
                    href={isPro ? "/pro/dashboard" : `/pro/checkout?plan=${plan.id}`}
                    className={`w-full h-12 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${ctaButtonStyles}`}
                  >
                    {isPro ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>View Pro Dashboard</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Link>
                </div>

                {/* Secondary WhatsApp Contact link for inquiries */}
                <a
                  href={whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline py-1"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>Ask Mentors on WhatsApp</span>
                </a>

                {/* Savings Note Subtext */}
                <p className="text-[11px] text-center text-muted-foreground font-medium pt-0.5">
                  {plan.savingsNote}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Support & Inquiry Banner */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-card via-card to-blue-500/5 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-bold text-foreground">
            Have questions about upcoming batches, curriculum, or payment schedules?
          </p>
          <p className="text-xs text-muted-foreground">
            Our mentors are available directly on WhatsApp to guide you through your preparation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={whatsapp_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href={telegram_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-extrabold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>Join Telegram</span>
          </a>
        </div>
      </div>
    </section>
  );
}
