"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Search,
  Sparkles,
  ArrowRight,
  Calendar,
  Code2,
  PlayCircle,
  Bookmark,
  CheckCircle2,
  RotateCcw,
  CircleDot,
  Check,
  ExternalLink,
  Maximize2,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Tag,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Flame,
  Layers,
} from "lucide-react";
import PremiumPageHeader from "@/components/page-headers/premium-page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContestPlatform, ContestEditorial } from "@/types/contest";
import { PLATFORMS, getDifficultyBadge, parseTags, slugifyContest } from "@/lib/contests";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState } from "@/lib/user-states";
import { ContestProblemDrawer } from "../[platform]/[contestSlug]/_components/contest-problem-drawer";

import LeetcodeLogo from "@/public/logos/leetcode.png";
import CodeforcesLogo from "@/public/logos/codeforces.svg";
import CodechefLogo from "@/public/logos/codechef.png";

const PLATFORM_LOGOS = {
  leetcode: LeetcodeLogo,
  codeforces: CodeforcesLogo,
  codechef: CodechefLogo,
};

type SortField = "date" | "name" | "difficulty" | "contest";
type SortDirection = "asc" | "desc";

interface ContestsHubClientProps {
  initialProblems: ContestEditorial[];
  stats: {
    totalContests: number;
    totalProblems: number;
    byPlatform: Record<string, number>;
  };
}

export function ContestsHubClient({ initialProblems, stats }: ContestsHubClientProps) {
  // Filter states
  const [activePlatform, setActivePlatform] = useState<ContestPlatform | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "revision" | "done">("all");
  const [selectedBookmark, setSelectedBookmark] = useState<"all" | "bookmarked">("all");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // User asset states
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  // Slide drawer state
  const [selectedProblem, setSelectedProblem] = useState<ContestEditorial | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"statement" | "video" | "editorial" | "solution">("statement");

  useEffect(() => {
    setIsLoadingStates(true);
    fetchUserAssetStates()
      .then((s) => setUserStates(s || {}))
      .catch(() => {})
      .finally(() => setIsLoadingStates(false));
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

  const openDrawer = (
    problem: ContestEditorial,
    tab: "statement" | "video" | "editorial" | "solution" = "statement"
  ) => {
    setSelectedProblem(problem);
    setDrawerTab(tab);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Extract all unique topic tags sorted by frequency
  const availableTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    for (const p of initialProblems) {
      if (activePlatform !== "all" && p.platform !== activePlatform) continue;
      const tags = parseTags(p.topic_tags);
      for (const t of tags) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [initialProblems, activePlatform]);

  // Platform Cards data
  const platformCards = [
    {
      id: "leetcode" as ContestPlatform,
      name: "LeetCode",
      logo: LeetcodeLogo,
      description: "Weekly & Biweekly contest problem video solutions and approach guides.",
      accent: "text-amber-500",
      color: "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40",
      href: "/contests/leetcode",
      problemCount: stats.byPlatform?.leetcode || 0,
    },
    {
      id: "codeforces" as ContestPlatform,
      name: "Codeforces",
      logo: CodeforcesLogo,
      description: "Div. 2, Div. 3 and Div. 4 rounds competitive programming walkthroughs.",
      accent: "text-blue-500",
      color: "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40",
      href: "/contests/codeforces",
      problemCount: stats.byPlatform?.codeforces || 0,
    },
    {
      id: "codechef" as ContestPlatform,
      name: "CodeChef",
      logo: CodechefLogo,
      description: "Starters rounds and rated contest problem breakdowns with proofs.",
      accent: "text-amber-600",
      color: "border-amber-600/20 bg-amber-600/5 hover:border-amber-600/40",
      href: "/contests/codechef",
      problemCount: stats.byPlatform?.codechef || 0,
    },
  ];

  // Filter & Sort problems
  const filteredAndSortedProblems = useMemo(() => {
    let result = [...initialProblems];

    // 1. Platform filter
    if (activePlatform !== "all") {
      result = result.filter((p) => p.platform === activePlatform);
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.problem_name.toLowerCase().includes(q);
        const contestMatch = p.contest ? p.contest.toLowerCase().includes(q) : false;
        const tagsMatch =
          parseTags(p.topic_tags).some((t) => t.toLowerCase().includes(q)) ||
          parseTags(p.company_tags).some((t) => t.toLowerCase().includes(q));
        return nameMatch || contestMatch || tagsMatch;
      });
    }

    // 3. Difficulty filter
    if (selectedDifficulty !== "all") {
      const targetDiff = parseInt(selectedDifficulty, 10);
      if (!isNaN(targetDiff)) {
        result = result.filter((p) => p.difficulty === targetDiff);
      }
    }

    // 4. Topic tag filter
    if (selectedTag !== "all") {
      const qTag = selectedTag.toLowerCase();
      result = result.filter((p) =>
        parseTags(p.topic_tags).some((t) => t.toLowerCase() === qTag)
      );
    }

    // 4b. Status filter
    if (selectedStatus !== "all") {
      result = result.filter((p) => {
        const status = userStates[p.id]?.status || "pending";
        return status === selectedStatus;
      });
    }

    // 4c. Bookmark filter
    if (selectedBookmark === "bookmarked") {
      result = result.filter((p) => Boolean(userStates[p.id]?.is_bookmarked));
    }

    // 5. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        comparison = timeA - timeB;
      } else if (sortField === "difficulty") {
        comparison = (a.difficulty || 0) - (b.difficulty || 0);
      } else if (sortField === "name") {
        comparison = a.problem_name.localeCompare(b.problem_name);
      } else if (sortField === "contest") {
        comparison = (a.contest || "").localeCompare(b.contest || "");
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    initialProblems,
    activePlatform,
    searchQuery,
    selectedDifficulty,
    selectedTag,
    selectedStatus,
    selectedBookmark,
    userStates,
    sortField,
    sortDirection,
  ]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activePlatform, searchQuery, selectedDifficulty, selectedTag, selectedStatus, selectedBookmark, pageSize]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProblems.length / pageSize));
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedProblems.slice(start, start + pageSize);
  }, [filteredAndSortedProblems, currentPage, pageSize]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 ml-1 inline" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary ml-1 inline" />
    );
  };

  // Filter counts for live badges and pills
  const filterCounts = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let solved = 0;
    let revision = 0;
    let pending = 0;
    let bookmarked = 0;

    const baseList = initialProblems.filter((p) =>
      activePlatform === "all" ? true : p.platform === activePlatform
    );

    baseList.forEach((p) => {
      const d = Number(p.difficulty);
      if (d === 0) easy++;
      else if (d === 1) medium++;
      else if (d === 2) hard++;

      const st = userStates[p.id]?.status || "pending";
      if (st === "done") solved++;
      else if (st === "revision") revision++;
      else pending++;

      if (userStates[p.id]?.is_bookmarked) bookmarked++;
    });

    return { total: baseList.length, easy, medium, hard, solved, revision, pending, bookmarked };
  }, [initialProblems, activePlatform, userStates]);

  // Clear all filters
  const hasActiveFilters =
    activePlatform !== "all" ||
    searchQuery.trim() !== "" ||
    selectedDifficulty !== "all" ||
    selectedTag !== "all" ||
    selectedStatus !== "all" ||
    selectedBookmark !== "all";

  const clearFilters = () => {
    setActivePlatform("all");
    setSearchQuery("");
    setSelectedDifficulty("all");
    setSelectedTag("all");
    setSelectedStatus("all");
    setSelectedBookmark("all");
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header - Premium */}
      <PremiumPageHeader
        title={
          <span>
            Contest <span className="text-primary">Problem Archive</span>
          </span>
        }
        subtitle="Editorials, video walkthroughs, and official C++ solutions across LeetCode, Codeforces, and CodeChef rounds."
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center justify-center gap-3 pt-1 flex-wrap w-full">
            <Button asChild size="default" className="font-bold gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xs rounded-xl">
              <Link href="/contests/leetcode-potd">
                <Flame className="w-4 h-4 fill-white" />
                <span>LeetCode Daily POTD</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="font-semibold gap-1.5 bg-background/80 hover:bg-muted border-border rounded-xl">
              <Link href="/dsa">
                <Code2 className="w-4 h-4 text-primary" />
                <span>DSA Course Catalog</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="default" className="font-semibold gap-1.5 bg-background/80 hover:bg-muted border-border rounded-xl">
              <Link href="/dsa/sheets">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span>Practice Sheets</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 border border-border/80 text-xs font-semibold shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span className="text-foreground">{stats.totalContests}</span>
              <span className="text-muted-foreground">Contests</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/80 border border-border/80 text-xs font-semibold shadow-2xs">
              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-foreground">{stats.totalProblems}</span>
              <span className="text-muted-foreground">Problems</span>
            </div>
          </div>
        </div>
      </PremiumPageHeader>

      {/* Featured Platform Cards */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Featured Platforms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platformCards.map((platform) => (
            <Link key={platform.id} href={platform.href} className="group block">
              <Card className={`h-full border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between ${platform.color}`}>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <div className="w-11 h-11 rounded-xl bg-background/80 p-2 shrink-0 flex items-center justify-center border border-border/60 group-hover:scale-105 transition-transform shadow-2xs">
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className={`text-base font-bold transition-colors group-hover:${platform.accent}`}>
                        {platform.name}
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] font-mono">
                        {platform.problemCount}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                      {platform.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold pt-3 border-t border-border/60 text-muted-foreground group-hover:text-foreground">
                    <span>View {platform.name} Contests</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* ALL PROBLEMS TABLE SECTION */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs space-y-0">
        {/* Table Header & Controls */}
        <div className="p-4 sm:p-6 border-b border-border/60 bg-muted/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-foreground">
                All Contest Problems
              </h2>
              <Badge variant="secondary" className="text-xs font-mono">
                {filteredAndSortedProblems.length}
              </Badge>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5" />
                Clear all filters
              </Button>
            )}
          </div>

          {/* Modern 2-Row Filter Toolbar */}
          <div className="space-y-4">
            {/* Row 1: Platform Tabs, Search, Topic Tag, Bookmarked Only, Page Size, Reset */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Platform Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-background/80 rounded-xl border border-border/80 overflow-x-auto shrink-0 shadow-2xs">
                {[
                  { id: "all", label: "All Platforms" },
                  { id: "leetcode", label: "LeetCode", logo: LeetcodeLogo },
                  { id: "codeforces", label: "Codeforces", logo: CodeforcesLogo },
                  { id: "codechef", label: "CodeChef", logo: CodechefLogo },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlatform(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activePlatform === tab.id
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.logo && (
                      <Image src={tab.logo} alt={tab.label} width={13} height={13} className="object-contain" />
                    )}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Right Controls: Search, Topic Tag, Bookmarked Only, Page Size */}
              <div className="flex items-center gap-2 flex-wrap flex-1 lg:justify-end">
                {/* Search Bar with clear button */}
                <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problems, contests, tags..."
                    className="h-10 pl-9 pr-9 text-xs rounded-xl bg-background"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Topic Tag Filter */}
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="h-10 w-[160px] text-xs rounded-xl bg-background font-medium">
                    <Tag className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="all">All Tags ({availableTags.length})</SelectItem>
                    {availableTags.slice(0, 40).map(({ name, count }) => (
                      <SelectItem key={name} value={name}>
                        {name} ({count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Bookmarked Only Toggle */}
                <Button
                  variant={selectedBookmark === "bookmarked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBookmark(selectedBookmark === "bookmarked" ? "all" : "bookmarked")}
                  className={`h-10 px-3.5 rounded-xl text-xs font-semibold gap-1.5 transition-all ${
                    selectedBookmark === "bookmarked"
                      ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-amber-500"
                      : "hover:bg-muted"
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${selectedBookmark === "bookmarked" ? "fill-white text-white" : "text-amber-500"}`} />
                  <span>Bookmarked</span>
                  {filterCounts.bookmarked > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        selectedBookmark === "bookmarked" ? "bg-white/25 text-white" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {filterCounts.bookmarked}
                    </span>
                  )}
                </Button>

                {/* Page Size Selector */}
                <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
                  <SelectTrigger className="h-10 w-[88px] text-xs rounded-xl bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="25">25 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                    <SelectItem value="100">100 / page</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Row 2: Difficulty & Status Quick Pills */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
              {/* Difficulty Filter Quick Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Difficulty:
                </span>
                {[
                  { id: "all", label: "All", count: filterCounts.total },
                  { id: "0", label: activePlatform === "codeforces" ? "Newbie" : activePlatform === "codechef" ? "1★" : "Easy", count: filterCounts.easy, color: "text-emerald-600 dark:text-emerald-400" },
                  { id: "1", label: activePlatform === "codeforces" ? "Pupil" : activePlatform === "codechef" ? "2★" : "Medium", count: filterCounts.medium, color: "text-amber-600 dark:text-amber-400" },
                  { id: "2", label: activePlatform === "codeforces" ? "Specialist" : activePlatform === "codechef" ? "3★" : "Hard", count: filterCounts.hard, color: "text-rose-600 dark:text-rose-400" },
                ].map((tab) => {
                  const active = selectedDifficulty === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedDifficulty(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        active
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className={active ? "" : tab.color}>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1 rounded-full ${
                          active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background/80 text-muted-foreground"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}

                {/* Extra Dropdown for platforms with more division levels */}
                {(activePlatform === "codeforces" || activePlatform === "codechef" || activePlatform === "all") && (
                  <Select
                    value={["all", "0", "1", "2"].includes(selectedDifficulty) ? "" : selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger className="h-7 w-[95px] text-[11px] rounded-lg bg-muted/60 border-none font-medium">
                      <SelectValue placeholder="More..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activePlatform === "codeforces" ? (
                        <>
                          <SelectItem value="3">Expert (3)</SelectItem>
                          <SelectItem value="4">Candidate Master (4)</SelectItem>
                          <SelectItem value="5">Master (5)</SelectItem>
                          <SelectItem value="6">Grandmaster (6)</SelectItem>
                        </>
                      ) : activePlatform === "codechef" ? (
                        <>
                          <SelectItem value="3">4 Star (3)</SelectItem>
                          <SelectItem value="4">5 Star (4)</SelectItem>
                          <SelectItem value="5">6 Star (5)</SelectItem>
                          <SelectItem value="6">7 Star (6)</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="3">Advanced / Expert (3)</SelectItem>
                          <SelectItem value="4">Level 4 / CM / 5★ (4)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Status Filter Quick Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-muted-foreground mr-1">Status:</span>
                {[
                  { id: "all", label: "All" },
                  { id: "done", label: "Solved", count: filterCounts.solved, icon: CheckCircle2, color: "text-emerald-500" },
                  { id: "revision", label: "Revise", count: filterCounts.revision, icon: RotateCcw, color: "text-amber-500" },
                  { id: "pending", label: "Pending", count: filterCounts.pending, icon: CircleDot, color: "text-zinc-400" },
                ].map((tab) => {
                  const active = selectedStatus === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedStatus(tab.id as any)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        active
                          ? "bg-foreground text-background shadow-xs font-bold"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {Icon && <Icon className={`h-3 w-3 ${active ? "text-background" : tab.color}`} />}
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Problems Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th
                  onClick={() => toggleSort("name")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  Problem Name {getSortIcon("name")}
                </th>
                <th className="py-3 px-4 w-28">Platform</th>
                <th
                  onClick={() => toggleSort("contest")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  Contest {getSortIcon("contest")}
                </th>
                <th
                  onClick={() => toggleSort("difficulty")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors w-36"
                >
                  Difficulty {getSortIcon("difficulty")}
                </th>
                <th className="py-3 px-4 w-24 text-center">Solutions</th>
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedProblems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground text-xs space-y-2">
                    <p>No contest problems matched your filter criteria.</p>
                    {hasActiveFilters && (
                      <Button size="sm" variant="outline" onClick={clearFilters} className="text-xs">
                        Clear all filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedProblems.map((problem, idx) => {
                  const sequentialIndex = (currentPage - 1) * pageSize + idx + 1;
                  const platformConfig = PLATFORMS[problem.platform] || PLATFORMS.leetcode;
                  const platformLogo = PLATFORM_LOGOS[problem.platform] || PLATFORM_LOGOS.leetcode;
                  const diffBadge = getDifficultyBadge(problem.difficulty, problem.platform);
                  const contestSlug = slugifyContest(problem.contest || "");
                  const fullPageRoute = `/contests/${problem.platform}/${contestSlug}/${problem.slug_url}`;
                  const currentStatus = userStates[problem.id]?.status || "pending";
                  const isBookmarked = Boolean(userStates[problem.id]?.is_bookmarked);
                  const topicTags = parseTags(problem.topic_tags);

                  return (
                    <tr
                      key={problem.id}
                      onClick={() => openDrawer(problem, "statement")}
                      className="group transition-colors hover:bg-muted/40 cursor-pointer"
                    >
                      {/* # Index */}
                      <td className="py-3.5 px-4 text-xs font-mono text-muted-foreground text-center">
                        {sequentialIndex}
                      </td>

                      {/* Problem Name & Tags */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {problem.problem_name}
                          </span>

                          {topicTags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {topicTags.slice(0, 2).map((t, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded border border-border/40"
                                >
                                  #{t}
                                </span>
                              ))}
                              {topicTags.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{topicTags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <Link href={`/contests/${problem.platform}`}>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold px-2 py-0.5 gap-1.5 bg-background shadow-2xs hover:border-primary/50 transition-colors"
                          >
                            <Image
                              src={platformLogo}
                              alt={platformConfig.name}
                              width={12}
                              height={12}
                              className="object-contain"
                            />
                            <span>{platformConfig.name}</span>
                          </Badge>
                        </Link>
                      </td>

                      {/* Contest Link */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/contests/${problem.platform}/${contestSlug}`}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline line-clamp-1"
                        >
                          {problem.contest || "Contest"}
                        </Link>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${diffBadge.colorClass}`}>
                          {diffBadge.label}
                        </Badge>
                      </td>

                      {/* Solutions Indicators */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {problem.video_editorial && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDrawer(problem, "video");
                              }}
                              title="Watch Video Editorial"
                              className="p-1 rounded text-rose-500 hover:bg-rose-500/10 transition-colors"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}

                          {problem.solution_link && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDrawer(problem, "solution");
                              }}
                              title="View Code Solution"
                              className="p-1 rounded text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            >
                              <Code2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status & Bookmark */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          {isLoadingStates ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/50 animate-pulse">
                              <Loader2 size={11} className="animate-spin text-muted-foreground" />
                              <span>Loading...</span>
                            </span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
                                    currentStatus === "done"
                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                      : currentStatus === "revision"
                                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                                  }`}
                                >
                                  {currentStatus === "done" && <CheckCircle2 size={11} className="text-emerald-500" />}
                                  {currentStatus === "revision" && <RotateCcw size={11} className="text-amber-500" />}
                                  {currentStatus === "pending" && <CircleDot size={11} className="text-muted-foreground" />}
                                  <span className="capitalize">{currentStatus === "done" ? "Solved" : currentStatus}</span>
                                </button>
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

                          <button
                            type="button"
                            onClick={() => handleToggleBookmark(problem.id)}
                            title={isBookmarked ? "Remove Bookmark" : "Bookmark for Revision"}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDrawer(problem, "statement")}
                            className="h-7 px-2 text-xs font-semibold gap-1 bg-background hover:bg-muted"
                            title="Open Problem Quick Drawer"
                          >
                            <SlidersHorizontal className="w-3 h-3 text-primary" />
                            <span>View</span>
                          </Button>

                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Open Dedicated Full Page"
                          >
                            <Link href={fullPageRoute} target="_blank">
                              <Maximize2 className="w-3 h-3" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 sm:p-5 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">
              {filteredAndSortedProblems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-foreground">
              {Math.min(currentPage * pageSize, filteredAndSortedProblems.length)}
            </span>{" "}
            of <span className="font-bold text-foreground">{filteredAndSortedProblems.length}</span> problems
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </Button>

            <span className="text-xs font-medium px-3 text-muted-foreground">
              Page <strong className="text-foreground">{currentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Slide Drawer */}
      <ContestProblemDrawer
        problem={selectedProblem}
        platform={selectedProblem?.platform || "leetcode"}
        contestSlug={selectedProblem?.contest ? slugifyContest(selectedProblem.contest) : ""}
        contestName={selectedProblem?.contest || ""}
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
