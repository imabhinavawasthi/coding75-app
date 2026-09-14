"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  ExternalLink, 
  PlayCircle, 
  Code2, 
  Bookmark, 
  CheckCircle2, 
  RotateCcw, 
  CircleDot, 
  ChevronRight,
  Maximize2,
  SlidersHorizontal,
  Calendar,
  Sparkles,
  Tag,
  Search,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ContestPlatform, ContestEditorial, ContestDetail } from "@/types/contest";
import { PLATFORMS, getDifficultyBadge, parseTags } from "@/lib/contests";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState } from "@/lib/user-states";
import { ContestProblemDrawer } from "./contest-problem-drawer";

import LeetcodeLogo from "@/public/logos/leetcode.png";
import CodeforcesLogo from "@/public/logos/codeforces.svg";
import CodechefLogo from "@/public/logos/codechef.png";

const PLATFORM_LOGOS = {
  leetcode: LeetcodeLogo,
  codeforces: CodeforcesLogo,
  codechef: CodechefLogo,
};

interface ContestDetailClientProps {
  contest: ContestDetail;
  initialProblemSlug?: string;
}

export function ContestDetailClient({ contest, initialProblemSlug }: ContestDetailClientProps) {
  const platform = contest.platform;
  const config = PLATFORMS[platform] || PLATFORMS.leetcode;
  const logo = PLATFORM_LOGOS[platform] || PLATFORM_LOGOS.leetcode;

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer state
  const [selectedProblem, setSelectedProblem] = useState<ContestEditorial | null>(() => {
    if (!contest.problems || contest.problems.length === 0) return null;
    if (initialProblemSlug) {
      const found = contest.problems.find(
        (p) => p.slug_url === initialProblemSlug || p.id === initialProblemSlug
      );
      if (found) return found;
    }
    return null;
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => Boolean(initialProblemSlug));
  const [drawerTab, setDrawerTab] = useState<"statement" | "video" | "editorial" | "solution">("statement");

  // User asset states (completed, revision, bookmark)
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "revision" | "done">("all");
  const [selectedBookmark, setSelectedBookmark] = useState<"all" | "bookmarked">("all");

  useEffect(() => {
    setIsLoadingStates(true);
    fetchUserAssetStates()
      .then((states) => setUserStates(states || {}))
      .catch(() => {})
      .finally(() => setIsLoadingStates(false));
  }, []);

  const openDrawer = (
    problem: ContestEditorial,
    tab: "statement" | "video" | "editorial" | "solution" = "statement"
  ) => {
    setSelectedProblem(problem);
    setDrawerTab(tab);
    setIsDrawerOpen(true);

    if (typeof window !== "undefined" && problem.slug_url) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("problem", problem.slug_url);
      window.history.replaceState({}, "", currentUrl.toString());
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (typeof window !== "undefined") {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("problem");
      window.history.replaceState({}, "", currentUrl.toString());
    }
  };

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
    const currentState = userStates[problemId];
    const nextBookmark = !currentState?.is_bookmarked;

    setUserStates((prev) => ({
      ...prev,
      [problemId]: {
        ...prev[problemId],
        is_bookmarked: nextBookmark,
        updated_at: new Date().toISOString(),
      },
    }));

    saveUserAssetState({
      asset_id: problemId,
      asset_type: "problem",
      is_bookmarked: nextBookmark,
    }).catch(console.error);
  };

  // Sort problems in ascending order of created_at (easy problem added first)
  const sortedProblems = useMemo(() => {
    if (!contest.problems) return [];
    return [...contest.problems].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeA - timeB;
    });
  }, [contest.problems]);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    if (!sortedProblems) return [];
    let list = sortedProblems;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((p) => {
        const nameMatch = p.problem_name.toLowerCase().includes(query);
        const tagsMatch =
          parseTags(p.topic_tags).some((t) => t.toLowerCase().includes(query)) ||
          parseTags(p.company_tags).some((t) => t.toLowerCase().includes(query));
        return nameMatch || tagsMatch;
      });
    }

    if (selectedStatus !== "all") {
      list = list.filter((p) => {
        const status = userStates[p.id]?.status || "pending";
        return status === selectedStatus;
      });
    }

    if (selectedBookmark === "bookmarked") {
      list = list.filter((p) => Boolean(userStates[p.id]?.is_bookmarked));
    }

    return list;
  }, [sortedProblems, searchQuery, selectedStatus, selectedBookmark, userStates]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedStatus !== "all" || selectedBookmark !== "all"
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedBookmark("all");
  };

  // Overall Contest Completion Progress
  const totalProblems = contest.problems?.length || 0;
  const completedCount = useMemo(() => {
    if (!contest.problems) return 0;
    return contest.problems.filter((p) => userStates[p.id]?.status === "done").length;
  }, [contest.problems, userStates]);

  const progressPercent = totalProblems > 0 ? Math.round((completedCount / totalProblems) * 100) : 0;

  // Formatted date
  const formattedDate = useMemo(() => {
    if (!contest.created_at) return null;
    try {
      return new Date(contest.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [contest.created_at]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href={`/contests/${platform}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to {config.name} Contests
          </Link>
        </Button>

        <Badge variant="outline" className="text-xs font-semibold px-2.5 py-1 gap-1.5 bg-background shadow-2xs">
          <Image src={logo} alt={config.name} width={14} height={14} className="object-contain" />
          <span>{config.name} Editorial</span>
        </Badge>
      </div>

      {/* Contest Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-muted/30 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Contest Archive
              </span>
              {formattedDate && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  • <Calendar className="w-3.5 h-3.5" /> {formattedDate}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {contest.name}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Complete round solutions, problem statements, and video editorials. Click any problem to open the solution drawer or standalone page.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-background/80 backdrop-blur-xs border border-border/80 rounded-xl p-4 sm:p-5 min-w-[220px] shrink-0 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Contest Progress</span>
              {isLoadingStates ? (
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" /> Loading...
                </span>
              ) : (
                <span className="font-bold text-foreground">
                  {completedCount} / {totalProblems} ({progressPercent}%)
                </span>
              )}
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full bg-emerald-500 rounded-full transition-all duration-300 ${
                  isLoadingStates ? "animate-pulse" : ""
                }`}
                style={{ width: isLoadingStates ? "35%" : `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>{totalProblems} Problems</span>
              <span>
                {isLoadingStates
                  ? "Fetching status..."
                  : progressPercent === 100
                  ? "🎉 Completed!"
                  : `${totalProblems - completedCount} Left`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List Card */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-border/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-muted/20">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Round Problems
            </h2>
            <Badge variant="secondary" className="text-xs font-mono">
              {filteredProblems.length}
            </Badge>
          </div>

          {/* Filters and Search Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter problems or tags..."
                className="h-9 pl-9 text-xs bg-background"
              />
            </div>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={(val: any) => setSelectedStatus(val)}>
              <SelectTrigger className="h-9 w-[130px] text-xs bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="revision">Needs Revision</SelectItem>
                <SelectItem value="done">Solved</SelectItem>
              </SelectContent>
            </Select>

            {/* Bookmark Filter */}
            <Select value={selectedBookmark} onValueChange={(val: any) => setSelectedBookmark(val)}>
              <SelectTrigger className="h-9 w-[130px] text-xs bg-background">
                <SelectValue placeholder="Bookmark" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Problems</SelectItem>
                <SelectItem value="bookmarked">Bookmarked Only</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Problems Table */}
        <div className="divide-y divide-border/60">
          {filteredProblems.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
              <p>No problems matched your search query.</p>
              <Button size="sm" variant="outline" onClick={() => setSearchQuery("")} className="text-xs">
                Clear search
              </Button>
            </div>
          ) : (
            filteredProblems.map((problem, idx) => {
              const diffBadge = getDifficultyBadge(problem.difficulty, platform);
              const currentStatus = userStates[problem.id]?.status || "pending";
              const isBookmarked = Boolean(userStates[problem.id]?.is_bookmarked);
              const topicTags = parseTags(problem.topic_tags);
              const isSelected = selectedProblem?.id === problem.id && isDrawerOpen;
              const fullPageRoute = `/contests/${platform}/${contest.slug}/${problem.slug_url}`;

              // Letter indicator (A, B, C, D...) or number
              const letterIndex = String.fromCharCode(65 + (idx % 26));

              return (
                <div
                  key={problem.id}
                  onClick={() => openDrawer(problem, "statement")}
                  className={`group p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/40 ${
                    isSelected ? "bg-primary/5 border-l-4 border-l-primary" : ""
                  }`}
                >
                  {/* Left: Index, Title, Tags, Difficulty */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Problem Index Pill */}
                    <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-border/60 transition-colors">
                      {letterIndex}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                          {problem.problem_name}
                        </span>

                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${diffBadge.colorClass}`}>
                          {diffBadge.label}
                        </Badge>
                      </div>

                      {/* Tags & Solutions indicators */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {topicTags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border border-border/40"
                          >
                            #{tag}
                          </span>
                        ))}
                        {topicTags.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{topicTags.length - 3}
                          </span>
                        )}

                        {/* Video / Code Availability Badges */}
                        {problem.video_editorial && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                            <PlayCircle className="w-3 h-3" /> Video
                          </span>
                        )}
                        {problem.solution_link && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            <Code2 className="w-3 h-3" /> Code
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions, Status & Navigation */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 shrink-0 self-end sm:self-center"
                  >
                    {/* Status Dropdown */}
                    {isLoadingStates ? (
                      <div className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium bg-muted/40 text-muted-foreground border border-border/50 animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-8 px-2.5 text-xs font-semibold gap-1.5 ${
                              currentStatus === "done"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : currentStatus === "revision"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                : "bg-muted/40 text-muted-foreground border-border"
                            }`}
                          >
                            {currentStatus === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            {currentStatus === "revision" && <RotateCcw className="w-3.5 h-3.5 text-amber-500" />}
                            {currentStatus === "pending" && <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />}
                            <span className="capitalize">{currentStatus === "done" ? "Solved" : currentStatus}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(problem.id, "pending")}
                            className="text-xs font-medium gap-2 cursor-pointer"
                          >
                            <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />
                            Pending
                            {currentStatus === "pending" && <Check className="ml-auto w-3 h-3 text-primary" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(problem.id, "revision")}
                            className="text-xs font-medium gap-2 text-amber-600 dark:text-amber-400 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                            Needs Revision
                            {currentStatus === "revision" && <Check className="ml-auto w-3 h-3 text-primary" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(problem.id, "done")}
                            className="text-xs font-medium gap-2 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Mark Solved
                            {currentStatus === "done" && <Check className="ml-auto w-3 h-3 text-primary" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {/* Bookmark Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(problem.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isBookmarked
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-background text-muted-foreground border-border hover:text-foreground"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Save for Revision"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500" : ""}`} />
                    </button>

                    {/* Open Slider Drawer Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDrawer(problem, "statement")}
                      className="h-8 text-xs font-semibold gap-1 bg-background hover:bg-muted"
                      title="Open Quick Problem Slider"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                      <span>View</span>
                    </Button>

                    {/* Open Full Standalone Page */}
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                      title="Open Dedicated Full Page"
                    >
                      <Link href={fullPageRoute} target="_blank">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Slide Drawer */}
      <ContestProblemDrawer
        problem={selectedProblem}
        platform={platform}
        contestSlug={contest.slug}
        contestName={contest.name}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        userStates={userStates}
        onUpdateStatus={handleUpdateStatus}
        onToggleBookmark={handleToggleBookmark}
        initialTab={drawerTab}
        isLoadingStates={isLoadingStates}
      />
    </div>
  );
}
