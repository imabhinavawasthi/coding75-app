"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  PlayCircle,
  Video,
  MessageSquare,
  GitFork,
  Layers,
  FileText,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  MessageCircle,
} from "lucide-react";
import { useProStatus } from "@/hooks/use-pro-status";
import { ProRequiredModal } from "@/components/pro/pro-required-modal";
import { whatsapp_link, telegram_link } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProDashboardPage() {
  const { isPro, isLoading: loading, subscription: proSubscription } = useProStatus();
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">
          Checking your coding75 Pro subscription...
        </p>
      </div>
    );
  }

  // Non-Pro Paywall View
  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md border border-amber-500/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            coding75 Pro Pass Required
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Pro Dashboard, DSA video masterclasses, and live mentor sessions are reserved for coding75 Pro members.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/pro/checkout?plan=yearly"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Unlock Pro at ₹8/day</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-2xl text-xs font-bold"
            onClick={() => setShowPaywallModal(true)}
          >
            View Plan Benefits
          </Button>
        </div>

        <ProRequiredModal
          isOpen={showPaywallModal}
          onClose={() => setShowPaywallModal(false)}
        />
      </div>
    );
  }

  const currentPlan = proSubscription?.current_plan || "2-Year Complete Pass";
  const activeTillEpoch = proSubscription?.subscription_active_till_epoch;
  const isLifetime = activeTillEpoch === -1;
  const expiryDate =
    isLifetime
      ? "Lifetime Access"
      : activeTillEpoch
      ? new Date(activeTillEpoch > 1e11 ? activeTillEpoch : activeTillEpoch * 1000).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Active";

  const proFeatures = [
    {
      title: "150+ DSA Masterclass Videos",
      description: "Complete topic-wise video lectures with code walkthroughs & intuition",
      href: "/dsa",
      badge: "Unlocked",
      icon: PlayCircle,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Live DSA Sessions",
      description: "Weekly interactive live classes with FAANG / Tier-1 lead engineers",
      href: "/batch/coding75-pro-dsa",
      badge: "Live Weekly",
      icon: Video,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Live Doubt Resolution",
      description: "Dedicated TA & mentor doubt clearing rooms for all assignments",
      href: "/batch/coding75-pro-doubt",
      badge: "1:1 Support",
      icon: MessageSquare,
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "DSA Topic Tree & Roadmap",
      description: "Visual prerequisite graph and curriculum progression tracker",
      href: "/dsa/topic-tree",
      badge: "Interactive",
      icon: GitFork,
      accent: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
    {
      title: "Curated Practice Sheets",
      description: "Blind 75, Striver 450, SDE Sheet with company tagging & notes",
      href: "/dsa/sheets",
      badge: "500+ Problems",
      icon: Layers,
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "VIP Discord & WhatsApp Community",
      description: "Network with high-growth peers, share referrals & discuss questions",
      href: whatsapp_link,
      isExternal: true,
      badge: "VIP Group",
      icon: Users,
      accent: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome Banner for Pro Members */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>coding75 Pro Active Pass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Welcome to Your Pro Learning Portal 🚀
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              You have full unlocked access to complete DSA masterclass lectures, live mentoring batches, doubt clearing sessions, and exclusive placement resources.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="rounded-2xl border border-amber-500/30 bg-card p-3.5 text-left shadow-2xs">
              <div className="text-[10.5px] font-black uppercase tracking-wider text-muted-foreground">
                Current Plan
              </div>
              <div className="text-sm font-black text-foreground flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="capitalize">{currentPlan}</span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                Valid: <span className="font-bold text-foreground">{expiryDate}</span>
              </div>
            </div>

            <Link
              href="/profile/subscription"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-colors shadow-2xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Manage Billing</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pro Quick Access Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Pro Member Hub</span>
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            All Features Unlocked ✨
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proFeatures.map((feat) => {
            const Icon = feat.icon;
            const cardContent = (
              <Card className="h-full border-border/80 hover:border-amber-500/40 hover:shadow-md transition-all duration-200 cursor-pointer group bg-card">
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-transform ${feat.accent}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase tracking-tight">
                        {feat.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <span>{feat.title}</span>
                        {feat.isExternal && <ExternalLink className="w-3 h-3 opacity-60" />}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform pt-1">
                    <span>Open Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </CardContent>
              </Card>
            );

            if (feat.isExternal) {
              return (
                <a
                  key={feat.title}
                  href={feat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={feat.title} href={feat.href} className="block h-full">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mentor Support Banner */}
      <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-foreground">
              Need personalized prep help or doubt guidance?
            </p>
            <p className="text-[11px] text-muted-foreground">
              Our mentors and community TAs are available 24/7 on WhatsApp & Telegram.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={whatsapp_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Mentors</span>
          </a>
          <a
            href={telegram_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Telegram Channel</span>
          </a>
        </div>
      </div>
    </div>
  );
}
