"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hammer,
  Home,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OpportunitiesPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Top back navigation */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Maintenance & Enhancement Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 sm:p-10 shadow-sm">
        {/* Top ambient color highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-5 max-w-3xl mx-auto">
          {/* Top Maintenance Icon */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border border-amber-500/30 bg-amber-500/15 shadow-md shadow-amber-500/10 transition-transform hover:scale-105 duration-200">
              <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
            </span>
          </div>

          {/* Maintenance Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Under Scheduled Maintenance</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="font-medium flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Upgrading Experience
            </span>
          </div>

          {/* Headline & Description */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              We're Enhancing Your Job Experience
            </h1>
            <p className="text-sm sm:text-base font-semibold text-amber-600 dark:text-amber-400">
              A smarter, curated, and referral-backed tech opportunities portal is on the way.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto pt-1">
              The current jobs portal is temporarily paused while we overhaul the database with verified employer listings, active batch filters (2025, 2026, 2027), direct application links, and an internal referral network.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              className="rounded-xl font-bold text-xs sm:text-sm h-10 px-5 shadow-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              <a
                href="https://telegram.me/cpabhinav"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="w-4 h-4 mr-2" />
                Get Daily Job Drops on Telegram
              </a>
            </Button>

            <Button
              variant="outline"
              asChild
              className="rounded-xl border-border/80 hover:bg-muted font-bold text-xs sm:text-sm h-10 px-5"
            >
              <Link href="/dashboard">
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Upgrades in Progress Grid */}
      <div className="space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            What's Coming in the New Jobs Portal
          </h2>
          <p className="text-xs text-muted-foreground">
            Upgraded features designed to fast-track your applications and interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-3 hover:border-amber-500/40 hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground">
                Verified Tech Openings Only
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct apply links for SDE-1, Software Engineer Intern, Frontend, Backend, and AI/ML roles with zero dead links or spam postings.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3 h-3" />
              <span>In active development</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-3 hover:border-blue-500/40 hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground">
                Direct Referral Matcher
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Request internal referrals from coding75 alumni and mentors currently working across Google, Amazon, Microsoft, and top startups.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3 h-3" />
              <span>In active development</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-3 hover:border-emerald-500/40 hover:shadow-xs transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground">
                1-Click ATS Resume Fit
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Check your resume's keyword match and ATS score directly against the job description using our built-in resume builder.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span>In active development</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Alert & Channel Card */}
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Send className="w-4 h-4 text-sky-500" />
            Never miss an off-campus hiring drive
          </h3>
          <p className="text-xs text-muted-foreground">
            While maintenance is underway, all active hiring announcements and test links are shared in real-time on Telegram.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://telegram.me/cpabhinav"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Join Telegram
          </a>
          <a
            href="https://wa.me/message/TPN76XLWVOWDB1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
