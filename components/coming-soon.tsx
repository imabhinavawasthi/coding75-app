"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Home,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ComingSoonFeature {
  title: string;
  description: string;
  icon?: any;
}

export interface ComingSoonProps {
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: any;
  iconColor?: string;
  iconBg?: string;
  eta?: string;
  features?: ComingSoonFeature[];
  backHref?: string;
  backLabel?: string;
  communityLink?: string;
  communityLabel?: string;
}

export default function ComingSoon({
  badge = "In Active Development",
  badgeColor = "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  title,
  subtitle,
  description,
  icon: Icon = Sparkles,
  iconColor = "text-amber-600 dark:text-amber-400",
  iconBg = "bg-amber-500/15 border-amber-500/25",
  eta = "Coming Soon",
  features = [],
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  communityLink = "https://telegram.me/cpabhinav",
  communityLabel = "Join Telegram for Early Access",
}: ComingSoonProps) {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in-50 duration-300">
      {/* Top back navigation */}
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>{backLabel}</span>
        </Link>
      </div>

      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 shadow-sm">
        {/* Top ambient color bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
        
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-5 max-w-3xl mx-auto">
          {/* Top Feature Icon Container */}
          <div className="relative">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border shadow-md transition-transform hover:scale-105 duration-200 ${iconBg}`}>
              <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${iconColor}`} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
            </span>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className={badgeColor}>{badge}</span>
            {eta && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {eta}
                </span>
              </>
            )}
          </div>

          {/* Heading and Subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base font-semibold text-primary">
                {subtitle}
              </p>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto pt-1">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              className="rounded-xl font-bold text-xs sm:text-sm h-10 px-5 shadow-xs"
            >
              <Link href={backHref}>
                <Home className="w-4 h-4 mr-2" />
                {backLabel}
              </Link>
            </Button>

            {communityLink && (
              <Button
                variant="outline"
                asChild
                className="rounded-xl border-border/80 hover:bg-muted font-bold text-xs sm:text-sm h-10 px-5"
              >
                <a href={communityLink} target="_blank" rel="noopener noreferrer">
                  <Send className="w-4 h-4 mr-2 text-sky-500" />
                  {communityLabel}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      {features && features.length > 0 && (
        <div className="space-y-4">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              What We're Building
            </h2>
            <p className="text-xs text-muted-foreground">
              Here's a preview of the modules and experience coming in this release.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, idx) => {
              const FeatIcon = feat.icon || CheckCircle2;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/70 bg-card p-5 space-y-3 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                      <FeatIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                    <Sparkles className="w-3 h-3" />
                    <span>In progress</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Community Contribution & Feedback Footer Card */}
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-primary" />
            Have suggestions or want to contribute?
          </h3>
          <p className="text-xs text-muted-foreground">
            We are actively collaborating with top engineers and mentors to build this content.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="mailto:info@coding75.com"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-background border border-border hover:bg-muted transition-colors text-foreground"
          >
            info@coding75.com
          </a>
          <a
            href="https://wa.me/message/TPN76XLWVOWDB1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
