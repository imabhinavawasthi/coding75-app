"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Flame,
  CheckCircle2,
  PlayCircle,
  Tag,
  ArrowRight,
  Sparkles,
  Trophy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { POTDProblemItem } from "@/app/(dashboard)/(routes)/dsa-cp/_components/leetcode-potd-table";
import { getDifficultyBadge, parseTags } from "@/lib/contests";
import LeetcodeLogo from "@/public/logos/leetcode.png";

interface DashboardPOTDWidgetProps {
  potd: POTDProblemItem | null;
  isLoading: boolean;
  isSolved?: boolean;
}

export function DashboardPOTDWidget({
  potd,
  isLoading,
  isSolved = false,
}: DashboardPOTDWidgetProps) {
  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </Card>
    );
  }

  if (!potd) {
    return (
      <Card className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs h-full flex flex-col justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Problem of the Day</span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            Explore LeetCode POTD Archive
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Solve curated daily contest problems with detailed video intuition and verified code.
          </p>
        </div>
        <div className="pt-4 flex justify-end">
          <Button asChild size="sm" className="rounded-xl font-bold text-xs h-9">
            <Link href="/contests/leetcode-potd">
              Browse POTD <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  const diffBadge = getDifficultyBadge(potd?.difficulty ?? 1, "leetcode");
  const tags = parseTags(potd?.topic_tags || []).slice(0, 3);
  const formattedDate = React.useMemo(() => {
    if (!potd?.date) return "Today";
    try {
      const d = typeof potd.date === "number"
        ? (potd.date < 10000000000 ? new Date(potd.date * 1000) : new Date(potd.date))
        : new Date(potd.date);
      if (isNaN(d.getTime())) return "Today";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Today";
    }
  }, [potd?.date]);

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 p-6 sm:p-7 shadow-xs h-full flex flex-col justify-between group hover:border-amber-500/40 transition-all duration-300">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-80" />

      <div className="space-y-4 relative z-10">
        {/* Top badge row */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Problem of the Day</span>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/60">
            {formattedDate}
          </span>
        </div>

        {/* Problem Title & Difficulty */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
              {potd.problem_name}
            </h3>
            {isSolved && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffBadge.colorClass}`}
            >
              {diffBadge.label}
            </span>
            {tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-3 flex items-center justify-between gap-2 border-t border-border/50">
        <Link
          href="/contests/leetcode-potd"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <span>All POTD Archive</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            asChild
            className="rounded-xl font-bold text-xs h-9 px-3.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm gap-1.5"
          >
            <a
              href={potd.problem_link || "https://leetcode.com/problemset/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Solve POTD</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
