"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Calendar,
  Code2,
  PlayCircle,
  FileText,
  Bookmark,
  CheckCircle2,
  RotateCcw,
  CircleDot,
  Check,
  ExternalLink,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Copy,
  MoreVertical,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ContestEditorial } from "@/types/contest";
import { getDifficultyBadge, parseTags } from "@/lib/contests";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState } from "@/lib/user-states";
import { ContestProblemDrawer } from "@/app/(dashboard)/(routes)/contests/[platform]/[contestSlug]/_components/contest-problem-drawer";
import LeetcodeLogo from "@/public/logos/leetcode.png";

export interface POTDProblemItem {
  id: string;
  problem_name: string;
  date: any;
  problem_link: string;
  problem_description?: string | null;
  topic_tags: any;
  company_tags: any;
  difficulty: number;
  slug_url: string;
  editorial: string;
  video_editorial: string;
  created_at?: string;
}

interface LeetcodePOTDProblemTableProps {
  data: POTDProblemItem[];
  userStates?: Record<string, UserAssetState>;
  isLoadingStates?: boolean;
  onUpdateStatus?: (problemId: string, status: "pending" | "done" | "revision") => void;
  onToggleBookmark?: (problemId: string) => void;
}

export function formatPOTDDate(rawDate: any): string {
  if (!rawDate) return "";
  let d: Date;
  if (typeof rawDate === "number") {
    d = rawDate < 10000000000 ? new Date(rawDate * 1000) : new Date(rawDate);
  } else if (typeof rawDate === "string") {
    const num = Number(rawDate);
    if (!isNaN(num) && rawDate.length <= 11) {
      d = new Date(num * 1000);
    } else {
      d = new Date(rawDate);
    }
  } else if (rawDate instanceof Date) {
    d = rawDate;
  } else {
    return "";
  }

  if (isNaN(d.getTime())) return String(rawDate);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toYoutubeEmbed(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/embed/")) return trimmed;
  if (trimmed.includes("youtu.be/")) {
    const id = trimmed.split("youtu.be/")[1]?.split(/[?&]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (trimmed.includes("youtube.com/watch")) {
    const match = trimmed.match(/[?&]v=([^&]+)/);
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return trimmed;
}

type SortField = "date" | "name" | "difficulty";
type SortDirection = "asc" | "desc";

export default function LeetcodePOTDProblemTable({
  data = [],
  userStates: externalUserStates,
  isLoadingStates: externalIsLoadingStates,
  onUpdateStatus: externalOnUpdateStatus,
  onToggleBookmark: externalOnToggleBookmark,
}: LeetcodePOTDProblemTableProps) {
  // Internal user states if not provided by parent
  const [internalUserStates, setInternalUserStates] = useState<Record<string, UserAssetState>>({});
  const [internalLoadingStates, setInternalLoadingStates] = useState(true);

  const userStates = externalUserStates || internalUserStates;
  const isLoadingStates = externalIsLoadingStates !== undefined ? externalIsLoadingStates : internalLoadingStates;

  useEffect(() => {
    if (!externalUserStates) {
      setInternalLoadingStates(true);
      fetchUserAssetStates()
        .then((s) => setInternalUserStates(s || {}))
        .catch(() => {})
        .finally(() => setInternalLoadingStates(false));
    }
  }, [externalUserStates]);

  const handleUpdateStatus = (problemId: string, status: "pending" | "done" | "revision") => {
    if (externalOnUpdateStatus) {
      externalOnUpdateStatus(problemId, status);
      return;
    }
    setInternalUserStates((prev) => ({
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
    toast.success(`Status updated to ${status === "done" ? "Solved" : status === "revision" ? "Revision" : "Pending"}`);
  };

  const handleToggleBookmark = (problemId: string) => {
    if (externalOnToggleBookmark) {
      externalOnToggleBookmark(problemId);
      return;
    }
    const current = userStates[problemId]?.is_bookmarked;
    const nextVal = !current;
    setInternalUserStates((prev) => ({
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
    toast.info(nextVal ? "Bookmarked problem" : "Removed from bookmarks");
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookmarkOnly, setBookmarkOnly] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Sorting
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Slide drawer state
  const [selectedProblem, setSelectedProblem] = useState<POTDProblemItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"statement" | "video" | "editorial" | "solution">("statement");

  // Extract all unique topic tags
  const allTopicTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    data.forEach((p) => {
      const tags = parseTags(p.topic_tags);
      tags.forEach((t) => {
        tagCount[t] = (tagCount[t] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [data]);

  // Counts for filters
  const filterCounts = useMemo(() => {
    let easy = 0;
    let medium = 0;
    let hard = 0;
    let solved = 0;
    let revision = 0;
    let pending = 0;
    let bookmarked = 0;

    data.forEach((p) => {
      if (Number(p.difficulty) === 0) easy++;
      else if (Number(p.difficulty) === 1) medium++;
      else if (Number(p.difficulty) === 2) hard++;

      const st = userStates[p.id]?.status || "pending";
      if (st === "done") solved++;
      else if (st === "revision") revision++;
      else pending++;

      if (userStates[p.id]?.is_bookmarked) bookmarked++;
    });

    return { easy, medium, hard, solved, revision, pending, bookmarked };
  }, [data, userStates]);

  // Filtered and Sorted Data
  const filteredProblems = useMemo(() => {
    return data.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.problem_name.toLowerCase().includes(q);
        const topicTags = parseTags(item.topic_tags).map((t) => t.toLowerCase());
        const matchesTopic = topicTags.some((t) => t.includes(q));
        const companyTags = parseTags(item.company_tags).map((c) => c.toLowerCase());
        const matchesCompany = companyTags.some((c) => c.includes(q));

        if (!matchesName && !matchesTopic && !matchesCompany) return false;
      }

      // Difficulty
      if (difficultyFilter !== "all") {
        if (Number(item.difficulty) !== Number(difficultyFilter)) return false;
      }

      // Status
      if (statusFilter !== "all") {
        const itemStatus = userStates[item.id]?.status || "pending";
        if (itemStatus !== statusFilter) return false;
      }

      // Bookmark
      if (bookmarkOnly) {
        if (!userStates[item.id]?.is_bookmarked) return false;
      }

      // Tag Filter
      if (selectedTag !== "all") {
        const tags = parseTags(item.topic_tags);
        if (!tags.includes(selectedTag)) return false;
      }

      return true;
    });
  }, [data, searchQuery, difficultyFilter, statusFilter, bookmarkOnly, selectedTag, userStates]);

  const sortedProblems = useMemo(() => {
    return [...filteredProblems].sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        const dateA = typeof a.date === "number" ? a.date : new Date(a.date || a.created_at || 0).getTime();
        const dateB = typeof b.date === "number" ? b.date : new Date(b.date || b.created_at || 0).getTime();
        comparison = dateA - dateB;
      } else if (sortField === "name") {
        comparison = a.problem_name.localeCompare(b.problem_name);
      } else if (sortField === "difficulty") {
        comparison = Number(a.difficulty) - Number(b.difficulty);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredProblems, sortField, sortDirection]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, difficultyFilter, statusFilter, bookmarkOnly, selectedTag, pageSize]);

  // Pagination calculation
  const totalItems = sortedProblems.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProblems.slice(start, start + pageSize);
  }, [sortedProblems, currentPage, pageSize]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("all");
    setStatusFilter("all");
    setBookmarkOnly(false);
    setSelectedTag("all");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    difficultyFilter !== "all" ||
    statusFilter !== "all" ||
    bookmarkOnly ||
    selectedTag !== "all";

  // Convert selected POTD item to drawer ContestEditorial
  const drawerProblem: ContestEditorial | null = useMemo(() => {
    if (!selectedProblem) return null;
    return {
      id: selectedProblem.id,
      platform: "leetcode",
      created_at:
        typeof selectedProblem.date === "number"
          ? new Date(selectedProblem.date * 1000).toISOString()
          : selectedProblem.created_at || new Date().toISOString(),
      contest: "LeetCode Daily POTD",
      problem_name: selectedProblem.problem_name,
      problem_description: selectedProblem.problem_description || null,
      problem_link: selectedProblem.problem_link,
      video_editorial: toYoutubeEmbed(selectedProblem.video_editorial),
      editorial: selectedProblem.editorial || null,
      difficulty: selectedProblem.difficulty,
      company_tags: selectedProblem.company_tags,
      topic_tags: selectedProblem.topic_tags,
      slug_url: selectedProblem.slug_url,
      solution_link: selectedProblem.video_editorial || selectedProblem.editorial || null,
    };
  }, [selectedProblem]);

  const openDrawer = (
    problem: POTDProblemItem,
    tab: "statement" | "video" | "editorial" | "solution" = "statement"
  ) => {
    setSelectedProblem(problem);
    setDrawerTab(tab);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      {/* FILTER & SEARCH TOOLBAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
        {/* Row 1: Search, Topic Tags, Rows per page */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by problem name, topic, or company tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10 rounded-xl bg-background text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Topic Tag Filter */}
            {allTopicTags.length > 0 && (
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="h-10 w-[170px] rounded-xl text-xs font-medium bg-background">
                  <Tag className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Topics ({allTopicTags.length})</SelectItem>
                  {allTopicTags.slice(0, 40).map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Bookmark Only Toggle */}
            <Button
              variant={bookmarkOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setBookmarkOnly(!bookmarkOnly)}
              className={`h-10 px-3.5 rounded-xl text-xs font-semibold gap-1.5 transition-all ${
                bookmarkOnly
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-sm border-amber-500"
                  : "hover:bg-muted"
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarkOnly ? "fill-white text-white" : "text-amber-500"}`} />
              <span>Bookmarked</span>
              {filterCounts.bookmarked > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    bookmarkOnly ? "bg-white/25 text-white" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {filterCounts.bookmarked}
                </span>
              )}
            </Button>

            {/* Clear Filters button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Row 2: Difficulty and Status Quick Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-border/50">
          {/* Difficulty filter buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Difficulty:
            </span>
            {[
              { id: "all", label: "All", count: data.length },
              { id: "0", label: "Easy", count: filterCounts.easy, color: "text-emerald-600 dark:text-emerald-400" },
              { id: "1", label: "Medium", count: filterCounts.medium, color: "text-amber-600 dark:text-amber-400" },
              { id: "2", label: "Hard", count: filterCounts.hard, color: "text-rose-600 dark:text-rose-400" },
            ].map((tab) => {
              const active = difficultyFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDifficultyFilter(tab.id)}
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
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground mr-1">Status:</span>
            {[
              { id: "all", label: "All" },
              { id: "done", label: "Solved", count: filterCounts.solved, icon: CheckCircle2, color: "text-emerald-500" },
              { id: "revision", label: "Revise", count: filterCounts.revision, icon: RotateCcw, color: "text-amber-500" },
              { id: "pending", label: "Pending", count: filterCounts.pending, icon: CircleDot, color: "text-zinc-400" },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
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

      {/* TABLE DATA CONTAINER */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3.5 pl-4 pr-2 w-28">Status</th>
                <th className="py-3.5 px-3 w-36">
                  <button
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors group"
                  >
                    <span>Date</span>
                    {sortField === "date" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3 min-w-[280px]">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors group"
                  >
                    <span>Problem Name & Tags</span>
                    {sortField === "name" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3 w-28 text-center">
                  <button
                    onClick={() => toggleSort("difficulty")}
                    className="flex items-center justify-center gap-1 hover:text-foreground transition-colors group w-full"
                  >
                    <span>Difficulty</span>
                    {sortField === "difficulty" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3 w-36 text-center">Editorials</th>
                <th className="py-3.5 pr-4 pl-2 w-14 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedProblems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">No POTD problems matched your criteria</p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Try modifying your search term, difficulty filter, or resetting the active filters.
                      </p>
                      {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 text-xs">
                          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                          Reset All Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProblems.map((problem) => {
                  const state = userStates[problem.id];
                  const currentStatus = state?.status || "pending";
                  const isBookmarked = Boolean(state?.is_bookmarked);
                  const diffBadge = getDifficultyBadge(problem.difficulty, "leetcode");
                  const topicTags = parseTags(problem.topic_tags);
                  const formattedDate = formatPOTDDate(problem.date || problem.created_at);

                  return (
                    <tr
                      key={problem.id}
                      className="group hover:bg-muted/30 transition-colors duration-150"
                    >
                      {/* STATUS & BOOKMARK */}
                      <td className="py-3 pl-4 pr-2 align-middle">
                        <div className="flex items-center gap-1.5">
                          {/* Bookmark Star Button */}
                          <button
                            onClick={() => handleToggleBookmark(problem.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBookmarked
                                ? "text-amber-500 hover:text-amber-600 bg-amber-500/10"
                                : "text-muted-foreground/50 hover:text-amber-500 hover:bg-muted"
                            }`}
                            title={isBookmarked ? "Remove Bookmark" : "Bookmark problem"}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
                          </button>

                          {/* Status Dropdown */}
                          {isLoadingStates ? (
                            <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/40 animate-pulse">
                              <Loader2 size={10} className="animate-spin text-muted-foreground" />
                              <span className="hidden sm:inline">Loading</span>
                            </span>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all border ${
                                    currentStatus === "done"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                      : currentStatus === "revision"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                      : "bg-muted/60 text-muted-foreground border-transparent hover:bg-muted"
                                  }`}
                                >
                                  {currentStatus === "done" && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  {currentStatus === "revision" && <RotateCcw className="w-3.5 h-3.5" />}
                                  {currentStatus === "pending" && <CircleDot className="w-3.5 h-3.5" />}
                                  <span className="capitalize">
                                    {currentStatus === "done" ? "Solved" : currentStatus === "revision" ? "Revise" : "Todo"}
                                  </span>
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-36">
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(problem.id, "done")}
                                  className="text-xs flex items-center justify-between cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                                  </span>
                                  {currentStatus === "done" && <Check className="w-3 h-3 text-emerald-600" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(problem.id, "revision")}
                                  className="text-xs flex items-center justify-between cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                                    <RotateCcw className="w-3.5 h-3.5" /> Needs Revise
                                  </span>
                                  {currentStatus === "revision" && <Check className="w-3 h-3 text-amber-600" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(problem.id, "pending")}
                                  className="text-xs flex items-center justify-between cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                                    <CircleDot className="w-3.5 h-3.5" /> Pending
                                  </span>
                                  {currentStatus === "pending" && <Check className="w-3 h-3" />}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="py-3 px-3 align-middle text-xs font-mono text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* PROBLEM NAME & TAGS */}
                      <td className="py-3 px-3 align-middle">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => openDrawer(problem, "statement")}
                              className="font-semibold text-sm text-foreground hover:text-primary transition-colors text-left hover:underline"
                            >
                              {problem.problem_name}
                            </button>

                            {/* Direct External Link */}
                            {problem.problem_link && (
                              <a
                                href={problem.problem_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground/60 hover:text-amber-500 transition-colors"
                                title="Open on LeetCode"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          {/* Topic Tags */}
                          {topicTags.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {topicTags.slice(0, 3).map((tag, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-[10px] font-normal px-2 py-0 h-4 bg-muted/60 hover:bg-muted text-muted-foreground border-transparent cursor-pointer"
                                  onClick={() => setSelectedTag(tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {topicTags.length > 3 && (
                                <span className="text-[10px] text-muted-foreground/70">
                                  +{topicTags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* DIFFICULTY */}
                      <td className="py-3 px-3 align-middle text-center">
                        <span
                          className={`inline-flex items-center justify-center text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs whitespace-nowrap ${diffBadge.colorClass}`}
                        >
                          {diffBadge.label}
                        </span>
                      </td>

                      {/* EDITORIALS */}
                      <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {problem.video_editorial ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDrawer(problem, "video")}
                              className="h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10 shadow-2xs"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Video</span>
                            </Button>
                          ) : problem.editorial ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDrawer(problem, "editorial")}
                              className="h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-lg border-border hover:bg-muted"
                            >
                              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>Editorial</span>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground/60 italic">In progress</span>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS MENU */}
                      <td className="py-3 pr-4 pl-2 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => openDrawer(problem, "statement")}
                              className="text-xs cursor-pointer gap-2"
                            >
                              <Maximize2 className="w-3.5 h-3.5 text-primary" />
                              Quick Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="text-xs cursor-pointer gap-2">
                              <Link href={`/contests/leetcode-potd/${problem.slug_url}`}>
                                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                View Full Page
                              </Link>
                            </DropdownMenuItem>
                            {problem.problem_link && (
                              <DropdownMenuItem asChild className="text-xs cursor-pointer gap-2">
                                <a
                                  href={problem.problem_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                                  Solve on LeetCode
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                const url = `${window.location.origin}/contests/leetcode-potd/${problem.slug_url}`;
                                navigator.clipboard.writeText(url);
                                toast.success("Problem link copied to clipboard");
                              }}
                              className="text-xs cursor-pointer gap-2"
                            >
                              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              Copy Link
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
          {/* Item count & rows per page */}
          <div className="flex items-center gap-3">
            <span>
              Showing{" "}
              <strong className="text-foreground">
                {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-foreground">
                {Math.min(currentPage * pageSize, totalItems)}
              </strong>{" "}
              of <strong className="text-foreground">{totalItems}</strong> problems
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="hidden sm:inline text-[11px]">Rows:</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => setPageSize(Number(val))}
              >
                <SelectTrigger className="h-7 w-16 text-xs bg-background">
                  <SelectValue placeholder={String(pageSize)} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </Button>

            <span className="px-3 text-xs font-medium">
              Page <strong className="text-foreground">{currentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* SLIDE-OVER DRAWER */}
      {drawerProblem && (
        <ContestProblemDrawer
          problem={drawerProblem}
          platform="leetcode"
          contestSlug="leetcode-potd"
          contestName="LeetCode Daily Problem of the Day"
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          userStates={userStates}
          onUpdateStatus={handleUpdateStatus}
          onToggleBookmark={handleToggleBookmark}
          initialTab={drawerTab}
          isLoadingStates={isLoadingStates}
          fullPageRoute={selectedProblem ? `/contests/leetcode-potd/${selectedProblem.slug_url}` : undefined}
        />
      )}
    </div>
  );
}
