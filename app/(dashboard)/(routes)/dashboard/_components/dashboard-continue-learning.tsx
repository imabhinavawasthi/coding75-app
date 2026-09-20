"use client";

import React from "react";
import Link from "next/link";
import {
  PlayCircle,
  Code2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  GraduationCap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ActiveTopicProgress } from "../_hooks/use-dashboard-data";
import { cn } from "@/lib/utils";

interface DashboardContinueLearningProps {
  progressData: ActiveTopicProgress;
  isLoading: boolean;
}

export function DashboardContinueLearning({
  progressData,
  isLoading,
}: DashboardContinueLearningProps) {
  if (isLoading || !progressData || !progressData.module) {
    return (
      <Card className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </Card>
    );
  }

  const { module, completedItems = 0, totalItems = 1, progressPercent = 0, nextItem = null, isCompleted = false } = progressData;
  const ModuleIcon = module?.icon || GraduationCap;
  const targetHref = `/dsa/${module?.slug || module?.id || "complexity-foundations"}`;

  const targetAssetId = nextItem?.asset_id || nextItem?.id || "";
  const topicParam = module?.slug || module?.id ? `?topic=${encodeURIComponent(module.slug || module.id)}` : "";
  const nextItemHref = nextItem
    ? nextItem.type === "video"
      ? `/video/${encodeURIComponent(targetAssetId)}${topicParam}`
      : nextItem.type === "problem"
      ? `/dsa/problem/${encodeURIComponent(targetAssetId)}${topicParam}`
      : (nextItem.problem_url || nextItem.solution_url || targetHref)
    : targetHref;

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-7 shadow-xs h-full flex flex-col justify-between group hover:border-primary/40 transition-all duration-300">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-80" />

      <div className="space-y-5 relative z-10">
        {/* Header pill row */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Continue Learning</span>
          </div>
          <Badge
            variant="outline"
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          >
            {module.categoryLabel || "Core Roadmap"}
          </Badge>
        </div>

        {/* Module Title & Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <ModuleIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
              {module.title}
            </h2>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {module.description}
            </p>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="space-y-2 pt-1 bg-muted/30 p-3.5 rounded-2xl border border-border/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span>Progress</span>
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <span className="text-muted-foreground font-normal">
                  ({completedItems}/{totalItems} items completed)
                </span>
              )}
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {progressPercent}%
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>
        </div>

        {/* Next recommended problem/lesson - interactive link */}
        {nextItem && !isCompleted && (
          <Link
            href={nextItemHref}
            className="group/next flex items-center justify-between gap-3 text-xs bg-muted/40 hover:bg-muted/70 border border-border/70 hover:border-amber-500/50 rounded-2xl p-3 shadow-2xs transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover/next:scale-105 transition-transform">
                {nextItem.type === "video" ? (
                  <PlayCircle className="w-4 h-4" />
                ) : (
                  <Code2 className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                  <span>Next Up</span>
                </div>
                <div className="font-bold text-foreground truncate max-w-[220px] sm:max-w-xs group-hover/next:text-amber-600 dark:group-hover/next:text-amber-400 transition-colors">
                  {nextItem.title}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs group-hover/next:bg-amber-600 transition-colors">
                <span>Resume</span>
                <ArrowRight className="w-3 h-3 group-hover/next:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-5 mt-2 flex items-center justify-between border-t border-border/50 gap-2">
        <Link
          href={targetHref}
          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <span>Explore Syllabus</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Button
          asChild
          className="rounded-xl font-bold text-xs h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm gap-2"
        >
          <Link href={nextItem && !isCompleted ? nextItemHref : targetHref}>
            <span>{isCompleted ? "Review Topic" : "Resume Learning"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
