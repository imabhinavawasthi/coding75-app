"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Trophy,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  PlayCircle,
  Code2,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Layers,
  ArrowRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchLeetcodePOTDProblems } from "@/app/(dashboard)/(routes)/dsa-cp/(api)/leetcode/fetchLeetcodePOTDProblems";
import LeetcodePOTDProblemTable, {
  POTDProblemItem,
  formatPOTDDate,
} from "@/app/(dashboard)/(routes)/dsa-cp/_components/leetcode-potd-table";
import { getDifficultyBadge, parseTags } from "@/lib/contests";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState } from "@/lib/user-states";
import LeetcodeLogo from "@/public/logos/leetcode.png";

export default function LeetcodePOTDPage() {
  const [problemList, setProblemList] = useState<POTDProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  // Fetch POTD problems and User Asset States
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { dsaproblems } = await fetchLeetcodePOTDProblems();
        if (isMounted && dsaproblems) {
          setProblemList(dsaproblems as POTDProblemItem[]);
        }
      } catch (error) {
        console.error("Error fetching LeetCode POTD problems:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    // Fetch user progress states
    setIsLoadingStates(true);
    fetchUserAssetStates()
      .then((states) => {
        if (isMounted) setUserStates(states || {});
      })
      .catch((err) => console.error("Error fetching user asset states:", err))
      .finally(() => {
        if (isMounted) setIsLoadingStates(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = (problemId: string, status: "pending" | "done" | "revision") => {
    setUserStates((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        status,
        updated_at: new Date().toISOString(),
      },
    }));

    saveUserAssetState({
      asset_id: problemId,
      asset_type: "problem",
      status,
    }).catch(console.error);
  };

  const handleToggleBookmark = (problemId: string) => {
    const current = userStates[problemId]?.is_bookmarked;
    const nextVal = !current;

    setUserStates((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        is_bookmarked: nextVal,
        updated_at: new Date().toISOString(),
      },
    }));

    saveUserAssetState({
      asset_id: problemId,
      asset_type: "problem",
      is_bookmarked: nextVal,
    }).catch(console.error);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = problemList.length;
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let solved = 0;
    let revision = 0;

    problemList.forEach((p) => {
      const diff = Number(p.difficulty);
      if (diff === 0) easy++;
      else if (diff === 1) medium++;
      else if (diff === 2) hard++;

      const st = userStates[p.id]?.status;
      if (st === "done") solved++;
      else if (st === "revision") revision++;
    });

    const completionRate = total > 0 ? Math.round((solved / total) * 100) : 0;

    return { total, easy, medium, hard, solved, revision, completionRate };
  }, [problemList, userStates]);

  // Latest / Today's Featured Problem
  const todaysProblem = problemList[0] || null;
  const todaysDiff = todaysProblem ? getDifficultyBadge(todaysProblem.difficulty, "leetcode") : null;
  const todaysTags = todaysProblem ? parseTags(todaysProblem.topic_tags) : [];

  return (
    <div className="w-full min-h-screen pb-16 space-y-8">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumbs & Navigation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/contests" className="text-muted-foreground hover:text-foreground">
                    Contests & Archive
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="font-semibold text-foreground">LeetCode POTD</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-xl gap-1.5 border-border/80">
                <Link href="/contests">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  Contest Archive
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-xl gap-1.5 border-border/80">
                <Link href="/dsa">
                  <Layers className="w-3.5 h-3.5 text-emerald-500" />
                  DSA Sheets
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Header Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="px-3 py-1 rounded-full text-xs font-bold gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                >
                  <Image src={LeetcodeLogo} alt="LeetCode" width={14} height={14} className="object-contain" />
                  <span>LeetCode Daily Archive</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold gap-1 bg-background/80 text-muted-foreground border-border/60"
                >
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span>Daily Streak Tracker</span>
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                LeetCode Problem of the Day
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                Master core algorithmic patterns with official daily challenges. Stream in-depth video explanations,
                review complexity tradeoffs, and keep your practice streak alive.
              </p>

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 shadow-2xs">
                  <div className="text-[11px] font-medium text-muted-foreground">Total Archived</div>
                  <div className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
                    {loading ? "..." : stats.total}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-card/80 border border-emerald-500/20 shadow-2xs">
                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {isLoadingStates ? "..." : stats.solved}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-card/80 border border-amber-500/20 shadow-2xs">
                  <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> To Revise
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                    {isLoadingStates ? "..." : stats.revision}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-card/80 border border-border/70 shadow-2xs">
                  <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary" /> Completion
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
                    {loading || isLoadingStates ? "..." : `${stats.completionRate}%`}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Today's Problem Card */}
            <div className="lg:col-span-5">
              {todaysProblem && !loading ? (
                <div className="relative p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-card/90 shadow-md backdrop-blur-xs space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Latest Daily Challenge
                      </span>
                    </div>
                    {todaysDiff && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${todaysDiff.colorClass}`}>
                        {todaysDiff.label}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg text-foreground hover:text-primary transition-colors">
                      <Link href={`/contests/leetcode-potd/${todaysProblem.slug_url}`}>
                        {todaysProblem.problem_name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatPOTDDate(todaysProblem.date || todaysProblem.created_at)}</span>
                    </div>
                  </div>

                  {todaysTags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {todaysTags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0 h-4 bg-muted/80 text-muted-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 h-9 rounded-xl font-semibold text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                    >
                      <Link href={`/contests/leetcode-potd/${todaysProblem.slug_url}`}>
                        <span>View Editorial</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    {todaysProblem.problem_link && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 rounded-xl text-xs font-semibold gap-1.5"
                      >
                        <a href={todaysProblem.problem_link} target="_blank" rel="noopener noreferrer">
                          <span>LeetCode</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-56 rounded-2xl bg-card/50 border border-border/50 animate-pulse flex items-center justify-center">
                  <div className="text-center space-y-2 text-muted-foreground">
                    <Flame className="w-6 h-6 mx-auto opacity-30 animate-bounce" />
                    <p className="text-xs">Loading today&apos;s daily challenge...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE SECTION */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>All POTD Editorials</span>
              {!loading && (
                <span className="text-xs font-normal text-muted-foreground">
                  ({problemList.length} problems)
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filter by difficulty, completion status, or topic tag. Click on any problem to view the step-by-step editorial.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-9 w-64 bg-muted/60 rounded-xl animate-pulse" />
              <div className="h-9 w-32 bg-muted/60 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-3 pt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-muted/40 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <LeetcodePOTDProblemTable
            data={problemList}
            userStates={userStates}
            isLoadingStates={isLoadingStates}
            onUpdateStatus={handleUpdateStatus}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </div>
    </div>
  );
}
