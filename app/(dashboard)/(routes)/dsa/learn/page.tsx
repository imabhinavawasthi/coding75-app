"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  Filter,
  GraduationCap,
  Layers,
  Play,
  PlayCircle,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Video,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { CourseSection, CourseSectionItem } from "@/types/course";
import { fetchCourseCurriculum, TARGET_DSA_COURSE_ID } from "@/lib/courses";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState } from "@/lib/user-states";
import { getValidSession } from "@/lib/auth-client";
import supabase from "@/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChapterAccordionCard,
  ChapterData,
  RoadmapItemRow,
} from "../_components/dsa-topic-roadmap-timeline";
import { ItemSlideDrawer } from "../_components/item-slide-drawer";

const phaseGradients = [
  "from-blue-600 to-indigo-600 text-white shadow-blue-500/25 ring-blue-500/20",
  "from-emerald-600 to-teal-600 text-white shadow-emerald-500/25 ring-emerald-500/20",
  "from-purple-600 to-violet-600 text-white shadow-purple-500/25 ring-purple-500/20",
  "from-amber-600 to-orange-600 text-white shadow-amber-500/25 ring-amber-500/20",
  "from-rose-600 to-pink-600 text-white shadow-rose-500/25 ring-rose-500/20",
  "from-cyan-600 to-blue-600 text-white shadow-cyan-500/25 ring-cyan-500/20",
];

const phaseProgressBars = [
  "bg-gradient-to-r from-blue-600 to-indigo-500",
  "bg-gradient-to-r from-emerald-600 to-teal-500",
  "bg-gradient-to-r from-purple-600 to-violet-500",
  "bg-gradient-to-r from-amber-600 to-orange-500",
  "bg-gradient-to-r from-rose-600 to-pink-500",
  "bg-gradient-to-r from-cyan-600 to-blue-500",
];

export default function DSALearnRoadmapPage() {
  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "video" | "problem">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "done" | "revision" | "bookmarked">("all");

  // Slide-over drawer state
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<CourseSectionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch full curriculum strictly from backend API & user states
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const session = await getValidSession();
        if (isMounted) setIsLoggedIn(!!session);

        const [sections, states] = await Promise.all([
          fetchCourseCurriculum(TARGET_DSA_COURSE_ID),
          fetchUserAssetStates(),
        ]);
        if (isMounted) {
          setCurriculum(sections);
          setUserStates(states);
        }
      } catch (err) {
        console.warn("Error loading DSA course curriculum:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadData();
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Status & Bookmark mutation handlers
  const handleUpdateStatus = async (
    itemId: string,
    assetType: "video" | "problem" | "article",
    newStatus: "pending" | "done" | "revision"
  ) => {
    setUserStates((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { asset_id: itemId, asset_type: assetType, notes: [] }),
        status: newStatus,
        last_interacted_at: new Date().toISOString(),
      },
    }));

    await saveUserAssetState({
      asset_id: itemId,
      asset_type: assetType,
      status: newStatus,
      metadata: {
        course_id: TARGET_DSA_COURSE_ID,
      },
    });
  };

  const handleToggleBookmark = async (
    itemId: string,
    assetType: "video" | "problem" | "article"
  ) => {
    const currentState = userStates[itemId];
    const newBookmarked = !Boolean(currentState?.is_bookmarked);

    setUserStates((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { asset_id: itemId, asset_type: assetType, notes: [] }),
        is_bookmarked: newBookmarked,
        last_interacted_at: new Date().toISOString(),
      },
    }));

    await saveUserAssetState({
      asset_id: itemId,
      asset_type: assetType,
      is_bookmarked: newBookmarked,
      metadata: {
        course_id: TARGET_DSA_COURSE_ID,
      },
    });
  };

  const handleOpenDrawer = (item: CourseSectionItem) => {
    setSelectedDrawerItem(item);
    setIsDrawerOpen(true);
  };

  // Flatten all items across all sections to compute global stats & find active item
  const allCourseItems = useMemo(() => {
    const items: CourseSectionItem[] = [];
    for (const sec of curriculum) {
      if (Array.isArray(sec.items)) items.push(...sec.items);
      if (Array.isArray(sec.subsections)) {
        for (const sub of sec.subsections) {
          if (Array.isArray(sub.items)) items.push(...sub.items);
        }
      }
    }
    return items;
  }, [curriculum]);

  const globalStats = useMemo(() => {
    let completed = 0;
    let revise = 0;
    let bookmarked = 0;
    let totalVideos = 0;
    let totalProblems = 0;

    for (const item of allCourseItems) {
      if (item.type === "video") totalVideos++;
      if (item.type === "problem") totalProblems++;

      const key = item.asset_id || item.id;
      const state = userStates[key];
      if (state?.status === "done") completed++;
      if (state?.status === "revision") revise++;
      if (state?.is_bookmarked) bookmarked++;
    }

    const total = allCourseItems.length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      revise,
      bookmarked,
      totalVideos,
      totalProblems,
      progressPercent,
    };
  }, [allCourseItems, userStates]);

  // Active item ("Continue where you left off")
  const activeLearningItem = useMemo(() => {
    return (
      allCourseItems.find((i) => {
        const key = i.asset_id || i.id;
        return userStates[key]?.status !== "done";
      }) || allCourseItems[0]
    );
  }, [allCourseItems, userStates]);

  // Find parent section name of active learning item
  const activeSectionTitle = useMemo(() => {
    if (!activeLearningItem) return "";
    for (const sec of curriculum) {
      if (sec.items?.some((i) => (i.asset_id || i.id) === (activeLearningItem.asset_id || activeLearningItem.id))) {
        return sec.title;
      }
      for (const sub of sec.subsections || []) {
        if (sub.items?.some((i) => (i.asset_id || i.id) === (activeLearningItem.asset_id || activeLearningItem.id))) {
          return `${sec.title} • ${sub.title}`;
        }
      }
    }
    return "";
  }, [curriculum, activeLearningItem]);

  // Filter sections and their chapters based on user search & type/status filters
  const filteredPhases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return curriculum
      .map((sec, secIdx) => {
        // Collect chapters for this section strictly using backend structure
        const chapters: ChapterData[] = [];

        // 1. Direct root items (if any)
        if (sec.items && sec.items.length > 0) {
          chapters.push({
            id: `sec-${sec.id || secIdx}-root`,
            title: sec.title,
            description: sec.description || undefined,
            items: sec.items,
          });
        }

        // 2. Subsections from backend
        if (sec.subsections && sec.subsections.length > 0) {
          for (let sIdx = 0; sIdx < sec.subsections.length; sIdx++) {
            const sub = sec.subsections[sIdx];
            chapters.push({
              id: sub.id || `sec-${secIdx}-sub-${sIdx}`,
              title: sub.title,
              description: sub.description || undefined,
              items: sub.items || [],
            });
          }
        }

        // Filter items within each chapter based on filters
        const filteredChapters = chapters
          .map((ch) => {
            const matchingItems = ch.items.filter((item) => {
              // Type filter
              if (selectedType !== "all" && item.type !== selectedType) return false;

              // Status filter
              const key = item.asset_id || item.id;
              const state = userStates[key];
              const status = state?.status || "pending";
              const isBookmarked = Boolean(state?.is_bookmarked);

              if (selectedStatus === "done" && status !== "done") return false;
              if (selectedStatus === "pending" && status !== "pending") return false;
              if (selectedStatus === "revision" && status !== "revision") return false;
              if (selectedStatus === "bookmarked" && !isBookmarked) return false;

              // Query search
              if (query) {
                const matchesItem =
                  item.title.toLowerCase().includes(query) ||
                  (item.difficulty && item.difficulty.toLowerCase().includes(query));
                const matchesChapter = ch.title.toLowerCase().includes(query);
                const matchesSection = sec.title.toLowerCase().includes(query);
                return matchesItem || matchesChapter || matchesSection;
              }

              return true;
            });

            return {
              ...ch,
              items: matchingItems,
            };
          })
          .filter((ch) => ch.items.length > 0);

        // Compute phase totals from unfiltered section items
        const rawItemsCount =
          (sec.items?.length || 0) +
          (sec.subsections?.reduce((acc, sub) => acc + (sub.items?.length || 0), 0) || 0);

        let phaseDoneCount = 0;
        const allSecItems = [
          ...(sec.items || []),
          ...(sec.subsections?.flatMap((s) => s.items || []) || []),
        ];
        for (const itm of allSecItems) {
          const key = itm.asset_id || itm.id;
          if (userStates[key]?.status === "done") phaseDoneCount++;
        }

        return {
          section: sec,
          phaseIndex: secIdx,
          chapters: filteredChapters,
          totalItems: rawItemsCount,
          doneItems: phaseDoneCount,
          percent: rawItemsCount > 0 ? Math.round((phaseDoneCount / rawItemsCount) * 100) : 0,
        };
      })
      .filter((p) => p.chapters.length > 0 || (searchQuery === "" && selectedType === "all" && selectedStatus === "all"));
  }, [curriculum, searchQuery, selectedType, selectedStatus, userStates]);

  const scrollToPhase = (e: React.MouseEvent, phaseId: string) => {
    e.preventDefault();
    const el = document.getElementById(phaseId);
    if (el) {
      const navOffset = 90;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* ─── Ambient Atmosphere Glow Layers ─── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* ─── Top Breadcrumb Navigation ─── */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={13} className="opacity-50" />
          <Link href="/dsa" className="hover:text-foreground transition-colors">
            DSA Catalog
          </Link>
          <ChevronRight size={13} className="opacity-50" />
          <span className="text-foreground font-bold">Complete Course Roadmap</span>
        </nav>

        {/* ─── Hero Header with Stats ─── */}
        <div className="relative rounded-3xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 p-6 sm:p-8 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
                Data Structures &amp; Algorithms{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                  Course Roadmap
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Follow the master step-by-step curriculum directly from the database. Master foundational syntax, data structures, algorithm design patterns, and interview problem ladders.
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="shrink-0 p-5 rounded-2xl bg-card border border-border/80 shadow-md flex items-center gap-5 min-w-[260px]">
              {isLoading ? (
                <>
                  <div className="relative w-16 h-16 shrink-0 rounded-full bg-muted/60 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-28 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-36 bg-muted/70 animate-pulse rounded" />
                    <div className="h-2.5 w-24 bg-muted/50 animate-pulse rounded" />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600 dark:text-blue-500 transition-all duration-700 ease-out"
                        strokeDasharray={`${globalStats.progressPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-black text-xs font-mono text-foreground">
                      {globalStats.progressPercent}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Overall Completion</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {globalStats.completed}
                      </span>{" "}
                      / {globalStats.total} items done
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {curriculum.length} Total Course Phases
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
              <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Layers size={13} className="text-blue-500" />
                <span>Phases / Modules</span>
              </p>
              {isLoading ? (
                <div className="h-6 w-12 bg-muted/80 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-lg font-black text-foreground mt-0.5 font-mono">
                  {curriculum.length}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
              <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <PlayCircle size={13} className="text-red-500" />
                <span>Video Lectures</span>
              </p>
              {isLoading ? (
                <div className="h-6 w-14 bg-muted/80 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-lg font-black text-foreground mt-0.5 font-mono">
                  {globalStats.totalVideos}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
              <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <Code2 size={13} className="text-emerald-500" />
                <span>Practice Problems</span>
              </p>
              {isLoading ? (
                <div className="h-6 w-14 bg-muted/80 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-lg font-black text-foreground mt-0.5 font-mono">
                  {globalStats.totalProblems}
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
              <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                <RotateCcw size={13} className="text-amber-500" />
                <span>To Revise</span>
              </p>
              {isLoading ? (
                <div className="h-6 w-10 bg-muted/80 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-lg font-black text-foreground mt-0.5 font-mono">
                  {globalStats.revise}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ─── Continue Where You Left Off Card ─── */}
        {isLoading ? (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 w-11 h-11 bg-muted rounded-xl" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="h-4 w-52 bg-muted rounded" />
                <div className="h-3 w-40 bg-muted/60 rounded" />
              </div>
            </div>
            <div className="h-9 w-28 bg-muted rounded-xl shrink-0" />
          </div>
        ) : activeLearningItem ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 via-card to-indigo-500/10 p-4 sm:p-5 shadow-md shadow-blue-500/5 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="shrink-0 w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 text-white">
                  {activeLearningItem.type === "video" ? (
                    <Play size={20} className="fill-white translate-x-0.5" />
                  ) : (
                    <Code2 size={20} />
                  )}
                </div>

                <div>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">
                    Continue where you left off
                  </p>
                  <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                    {activeLearningItem.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <span className="font-semibold text-foreground/80">{activeSectionTitle}</span>
                    <span>•</span>
                    <span className="capitalize">{activeLearningItem.type}</span>
                    {activeLearningItem.difficulty && (
                      <>
                        <span>•</span>
                        <span>{activeLearningItem.difficulty}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleOpenDrawer(activeLearningItem)}
                className="shrink-0 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          </motion.div>
        ) : null}

        {/* ─── Quick Phase Jump Bar & Search / Filter Controls ─── */}
        <div className="space-y-4">
          {/* Quick jump pills */}
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-3 w-28 bg-muted/80 animate-pulse rounded" />
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-28 bg-muted/60 animate-pulse rounded-xl shrink-0" />
                ))}
              </div>
            </div>
          ) : curriculum.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Jump to Phase:
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {curriculum.map((sec, idx) => (
                  <a
                    key={sec.id || idx}
                    href={`#phase-${idx + 1}`}
                    onClick={(e) => scrollToPhase(e, `phase-${idx + 1}`)}
                    className="shrink-0 px-3 py-1.5 rounded-xl border border-border/70 bg-card hover:border-blue-500/40 hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs"
                  >
                    <span className="text-primary font-bold mr-1.5">#{idx + 1}</span>
                    <span>{sec.title}</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {/* Search and Filters Bar */}
          <div className="p-3 sm:p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xs flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search lectures, topics, problems across full course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs rounded-xl bg-background border-border/80"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 text-xs w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedType === "all"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Types
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("video")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedType === "video"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Videos
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("problem")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedType === "problem"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Problems
              </button>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 text-xs w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setSelectedStatus("all")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                  selectedStatus === "all"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("pending")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                  selectedStatus === "pending"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("done")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                  selectedStatus === "done"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus("revision")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                  selectedStatus === "revision"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Revision
              </button>
            </div>
          </div>
        </div>

        {/* ─── Master Course Roadmap Timeline ─── */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 size={32} className="text-primary animate-spin" />
            <p className="text-sm font-semibold text-muted-foreground">
              Loading complete DSA course roadmap...
            </p>
          </div>
        ) : filteredPhases.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-2xl border border-dashed border-border p-8">
            <p className="text-sm font-bold text-foreground">No matching items found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search query or reset the type and status filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setSelectedStatus("all");
              }}
              className="mt-2 rounded-xl text-xs font-bold"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredPhases.map((phaseData, pIndex) => {
              const { section, phaseIndex, chapters, totalItems, doneItems, percent } = phaseData;
              const gradient = phaseGradients[phaseIndex % phaseGradients.length];
              const progressBar = phaseProgressBars[phaseIndex % phaseProgressBars.length];
              const isPhaseCompleted = totalItems > 0 && doneItems === totalItems;
              const hasNextPhase = pIndex < filteredPhases.length - 1;

              return (
                <div
                  key={section.id || phaseIndex}
                  id={`phase-${phaseIndex + 1}`}
                  className="relative scroll-mt-24"
                >
                  {/* Phase Timeline Connector Vertical Line (Matching crackdsa) */}
                  {hasNextPhase && (
                    <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-blue-500/35 via-indigo-500/20 to-border/40 hidden lg:block" />
                  )}

                  {/* Phase Header Node */}
                  <div className="flex items-center gap-3.5 sm:gap-4 mb-6">
                    {/* Phase Number Badge */}
                    <div
                      className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-gradient-to-br shadow-lg ring-4 ${gradient}`}
                    >
                      {isPhaseCompleted ? <CheckCircle2 size={22} /> : phaseIndex + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-base sm:text-xl font-black text-foreground">
                          {section.title}
                        </h2>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {doneItems}/{totalItems} items
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          {isPhaseCompleted ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      {section.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {section.description}
                        </p>
                      )}
                    </div>

                    {/* Phase Progress Bar */}
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <div className="w-28 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${progressBar}`}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-foreground w-9 text-right">
                        {percent}%
                      </span>
                    </div>
                  </div>

                  {/* Subsections & Chapters Cards Grid */}
                  <div className="space-y-3.5 lg:ml-14">
                    {chapters.map((chapter, chapterIdx) => (
                      <ChapterAccordionCard
                        key={chapter.id || chapterIdx}
                        chapter={chapter}
                        chapterIndex={chapterIdx}
                        firstActiveItemId={activeLearningItem?.id}
                        userStates={userStates}
                        onUpdateStatus={handleUpdateStatus}
                        onToggleBookmark={handleToggleBookmark}
                        onOpenDrawer={handleOpenDrawer}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Integrated Slide Drawer for Solving Problems & Watching Videos ─── */}
      <ItemSlideDrawer
        item={selectedDrawerItem}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDrawerItem(null);
        }}
        userStates={userStates}
        onUpdateStatus={handleUpdateStatus}
        onToggleBookmark={handleToggleBookmark}
        topicSlug="learn"
      />
    </div>
  );
}
