"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ChevronRight,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Bookmark,
  BookOpen,
  Sparkles,
  Layers,
  Code2,
  PlayCircle,
  FileText,
} from "lucide-react";
import { dsaModules, getTopicGradientStyle, DSATopicModule, TOPIC_KEYWORDS } from "@/config/dsa-catalog";
import { fetchCourseCurriculum, TARGET_DSA_COURSE_ID } from "@/lib/courses";
import { CourseSection, CourseSectionItem } from "@/types/course";
import { deriveSectionStats } from "@/lib/courseCatalogSync";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState } from "@/lib/user-states";
import { CurriculumAccordion } from "../_components/curriculum-accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DSATopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Find local module by slug or ID (with fallback matching for variations like 'programming-foundations' or 'foundations')
  const localModule = useMemo(() => {
    const cleanSlug = (slug || "").toLowerCase().replace(/-/g, " ").trim();

    // 1. Direct ID or slug match
    const direct = dsaModules.find(
      (m) =>
        m.id.toLowerCase() === slug.toLowerCase() ||
        (m.slug && m.slug.toLowerCase() === slug.toLowerCase())
    );
    if (direct) return direct;

    // 2. Title match or keyword match fallback
    return (
      dsaModules.find((m) => {
        const cleanTitle = m.title.toLowerCase().replace(/-/g, " ").trim();
        return cleanTitle === cleanSlug || cleanTitle.includes(cleanSlug) || cleanSlug.includes(cleanTitle);
      }) ||
      dsaModules.find((m) => {
        const kws = TOPIC_KEYWORDS[m.id] || [];
        return kws.some((kw) => kw.length >= 3 && cleanSlug.includes(kw.toLowerCase()));
      }) ||
      null
    );
  }, [slug]);

  // Current track modules and index for Next/Previous topic flow
  const currentTrack = localModule?.category || "foundations";
  const trackModules = useMemo(() => {
    return dsaModules.filter((m) => m.category === currentTrack);
  }, [currentTrack]);

  const currentTopicIndex = trackModules.findIndex((m) => m.id === localModule?.id);
  const prevTopic = currentTopicIndex > 0 ? trackModules[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex !== -1 && currentTopicIndex < trackModules.length - 1 ? trackModules[currentTopicIndex + 1] : null;

  // Load curriculum & user asset states strictly from database
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [sections, states] = await Promise.all([
          fetchCourseCurriculum(TARGET_DSA_COURSE_ID),
          fetchUserAssetStates(),
        ]);
        if (isMounted) {
          setCurriculum(sections);
          setUserStates(states);
        }
      } catch (err) {
        console.warn("Unable to fetch course curriculum or user states:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Match topic section from course curriculum by ID/title, including subsections
  const matchedSection = useMemo(() => {
    if (!curriculum || curriculum.length === 0 || !localModule) return null;

    const normalizeKey = (str: string) =>
      (str || "").replace(/-/g, " ").replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase().trim();

    const targetIdKey = normalizeKey(localModule.id);
    const targetTitleKey = normalizeKey(localModule.title);
    const keywords = (TOPIC_KEYWORDS[localModule.id] || []).map((k) => normalizeKey(k));

    // 1. Try direct matching on top-level sections
    const topMatch = curriculum.find((sec) => {
      const secIdKey = normalizeKey(sec.id || "");
      const secTitleKey = normalizeKey(sec.title || "");

      return (
        secIdKey === targetIdKey ||
        secTitleKey === targetIdKey ||
        secTitleKey === targetTitleKey ||
        secTitleKey.includes(targetIdKey) ||
        targetIdKey.includes(secTitleKey) ||
        (secTitleKey.length > 3 && targetTitleKey.includes(secTitleKey)) ||
        (targetTitleKey.length > 3 && secTitleKey.includes(targetTitleKey))
      );
    });

    if (topMatch) return topMatch;

    // 2. Try direct matching on subsections
    for (const sec of curriculum) {
      for (const sub of sec.subsections || []) {
        const subIdKey = normalizeKey(sub.id || "");
        const subTitleKey = normalizeKey(sub.title || "");

        if (
          subIdKey === targetIdKey ||
          subTitleKey === targetIdKey ||
          subTitleKey === targetTitleKey ||
          subTitleKey.includes(targetIdKey) ||
          targetIdKey.includes(subTitleKey) ||
          (subTitleKey.length > 3 && targetTitleKey.includes(subTitleKey)) ||
          (targetTitleKey.length > 3 && subTitleKey.includes(targetTitleKey))
        ) {
          return {
            id: sub.id || `${sec.id}-${sub.title}`,
            title: sub.title,
            description: sub.description || `${sub.title} curriculum and exercises from ${sec.title}.`,
            items: sub.items || [],
            subsections: [],
          };
        }
      }
    }

    // 3. Keyword matching fallback (ensures prog-foundations and other topics match identically to course cards)
    if (keywords.length > 0) {
      // 3a. Top-level section keyword match
      const keywordTopMatch = curriculum.find((sec) => {
        const secIdKey = normalizeKey(sec.id || "");
        const secTitleKey = normalizeKey(sec.title || "");
        return keywords.some((kw) => kw.length >= 3 && (secTitleKey.includes(kw) || secIdKey.includes(kw)));
      });

      if (keywordTopMatch) return keywordTopMatch;

      // 3b. Subsection keyword match
      for (const sec of curriculum) {
        for (const sub of sec.subsections || []) {
          const subIdKey = normalizeKey(sub.id || "");
          const subTitleKey = normalizeKey(sub.title || "");
          if (keywords.some((kw) => kw.length >= 3 && (subTitleKey.includes(kw) || subIdKey.includes(kw)))) {
            return {
              id: sub.id || `${sec.id}-${sub.title}`,
              title: sub.title,
              description: sub.description || `${sub.title} curriculum and exercises from ${sec.title}.`,
              items: sub.items || [],
              subsections: [],
            };
          }
        }
      }
    }

    return null;
  }, [curriculum, localModule]);

  // Extract all items in this topic section
  const topicItems: CourseSectionItem[] = useMemo(() => {
    if (!matchedSection) return [];
    return [
      ...(matchedSection.items || []),
      ...(matchedSection.subsections || []).flatMap((sub) => sub.items || []),
    ];
  }, [matchedSection]);

  // Calculate stats from userStates
  const stats = useMemo(() => {
    let done = 0;
    let revise = 0;
    let bookmarked = 0;

    for (const item of topicItems) {
      const state = (item.asset_id && userStates[item.asset_id]) || userStates[item.id];
      if (state?.status === "done") done++;
      if (state?.status === "revision") revise++;
      if (state?.is_bookmarked) bookmarked++;
    }

    const total = topicItems.length;
    const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    return { done, revise, bookmarked, total, progressPercent };
  }, [topicItems, userStates]);

  // Update item status: 'pending' | 'done' | 'revision'
  const handleUpdateStatus = async (
    itemId: string,
    assetType: "video" | "problem" | "article",
    newStatus: "pending" | "done" | "revision"
  ) => {
    // Optimistic local update
    setUserStates((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { asset_id: itemId, asset_type: assetType, notes: [] }),
        status: newStatus,
        last_interacted_at: new Date().toISOString(),
      },
    }));

    // Persist to Supabase user_asset_states
    await saveUserAssetState({
      asset_id: itemId,
      asset_type: assetType,
      status: newStatus,
      metadata: {
        topic: localModule?.id,
        course_id: TARGET_DSA_COURSE_ID,
      },
    });
  };

  // Toggle item bookmark
  const handleToggleBookmark = async (
    itemId: string,
    assetType: "video" | "problem" | "article"
  ) => {
    const currentState = userStates[itemId];
    const newBookmarked = !Boolean(currentState?.is_bookmarked);

    // Optimistic local update
    setUserStates((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || { asset_id: itemId, asset_type: assetType, status: "pending", notes: [] }),
        is_bookmarked: newBookmarked,
        bookmarked_at: newBookmarked ? new Date().toISOString() : null,
      },
    }));

    // Persist to Supabase user_asset_states
    await saveUserAssetState({
      asset_id: itemId,
      asset_type: assetType,
      is_bookmarked: newBookmarked,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] space-y-3">
        <Loader2 className="animate-spin text-primary" size={42} />
        <p className="text-xs font-bold text-muted-foreground font-mono">
          Loading topic curriculum & lectures...
        </p>
      </div>
    );
  }

  if (!localModule) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-foreground">Topic Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested DSA topic &quot;{slug}&quot; could not be located in our catalog.
        </p>
        <Link
          href="/dsa"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft size={14} /> Back to DSA Catalog
        </Link>
      </div>
    );
  }

  const sectionStats = matchedSection ? deriveSectionStats(matchedSection) : null;
  const isUpcoming = !matchedSection || (sectionStats && sectionStats.itemsCount === 0);
  const gradientStyle = getTopicGradientStyle(localModule);
  const TopicIcon = localModule.icon;

  const topicSections: CourseSection[] = matchedSection ? [matchedSection] : [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-24 pt-4 space-y-8">
      {/* Top Breadcrumbs & Track Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
        <nav className="flex items-center gap-1.5 font-medium flex-wrap">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={13} className="text-muted-foreground/60" />
          <Link href="/dsa" className="hover:text-foreground transition-colors">
            DSA Catalog
          </Link>
          <ChevronRight size={13} className="text-muted-foreground/60" />
          <span className="text-foreground font-semibold">{localModule.title}</span>
        </nav>

        {/* Previous & Next Quick Arrows */}
        <div className="flex items-center gap-2">
          {prevTopic && (
            <Link
              href={`/dsa/${prevTopic.id}`}
              className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors px-2.5 py-1 rounded-lg border bg-card hover:bg-muted"
            >
              <ArrowLeft size={12} /> {prevTopic.title}
            </Link>
          )}
          {nextTopic && (
            <Link
              href={`/dsa/${nextTopic.id}`}
              className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors px-2.5 py-1 rounded-lg border bg-card hover:bg-muted"
            >
              {nextTopic.title} <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Hero Header Banner */}
      <div
        style={{ background: gradientStyle }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md">
                {localModule.difficulty}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/20 backdrop-blur-md">
                {localModule.category === "foundations"
                  ? "Foundation Track"
                  : localModule.category === "ds"
                  ? "Data Structures"
                  : "Algorithms"}
              </span>
              {isUpcoming && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-400/30 text-amber-200 border border-amber-400/40">
                  Coming Soon
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-xs">
              {localModule.title}
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal drop-shadow-xs">
              {localModule.description}
            </p>

            {/* Quick Metrics & User Progress Status Badges */}
            <div className="flex items-center gap-3 pt-1 text-xs font-semibold text-white/90 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                <PlayCircle size={14} />
                <span>{sectionStats ? `${sectionStats.videosCount} Lectures` : "0 Lectures"}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                <Code2 size={14} />
                <span>{sectionStats ? `${sectionStats.problemsCount} Problems` : "0 Problems"}</span>
              </div>
              {stats.revise > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-500/25 border border-amber-300/30 px-2.5 py-1 rounded-lg text-amber-200 font-bold">
                  <RotateCcw size={13} />
                  <span>{stats.revise} to Revise</span>
                </div>
              )}
              {stats.bookmarked > 0 && (
                <div className="flex items-center gap-1.5 bg-yellow-500/25 border border-yellow-300/30 px-2.5 py-1 rounded-lg text-yellow-200 font-bold">
                  <Bookmark size={13} className="fill-current" />
                  <span>{stats.bookmarked} Saved</span>
                </div>
              )}
            </div>
          </div>

          {/* Icon Badge & Progress Meter */}
          <div className="flex flex-row md:flex-col items-center gap-4 self-end md:self-auto shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <TopicIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow" />
            </div>

            {!isUpcoming && stats.total > 0 && (
              <div className="text-center bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 min-w-[120px]">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span className="text-xs font-bold text-white">Loading...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-black text-white">{stats.progressPercent}%</span>
                    <p className="text-[10px] text-white/80 font-medium">{stats.done} of {stats.total} Solved</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Decorative background blur ring */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* Track Roadmap Visualizer */}
      <div className="p-4 rounded-2xl border bg-card shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              {localModule.category === "foundations"
                ? "Foundations Track Roadmap"
                : localModule.category === "ds"
                ? "Data Structures Track Roadmap"
                : "Advanced Algorithms Track Roadmap"}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {currentTopicIndex + 1} of {trackModules.length} Topics
          </span>
        </div>

        {/* Roadmap horizontal scroll track */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {trackModules.map((tm, idx) => {
            const isCurrent = tm.id === localModule.id;
            return (
              <Link
                key={tm.id}
                href={`/dsa/${tm.id}`}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary shadow-xs scale-105"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {idx + 1}
                </span>
                <span>{tm.title}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Section: Curriculum Accordion with Row Status & Bookmark */}
      {isUpcoming ? (
        <div className="text-center py-16 px-4 rounded-2xl border bg-card/60 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <Sparkles size={28} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-foreground">
              Curriculum in Production
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Video lectures and verified code challenges for &quot;{localModule.title}&quot; are currently being added to this live course.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dsa">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs font-bold">
                <ArrowLeft size={13} /> Explore Other DSA Topics
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-black tracking-tight text-foreground">
                Lectures & Practice Problems
              </h2>
              <p className="text-xs text-muted-foreground">
                Update status (Pending, Revise, Done) or bookmark items. Click to open lecture or solver.
              </p>
            </div>
            <Link
              href="/dsa"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={13} /> Back to Catalog
            </Link>
          </div>

          <CurriculumAccordion
            sections={topicSections}
            userStates={userStates}
            onUpdateStatus={handleUpdateStatus}
            onToggleBookmark={handleToggleBookmark}
            topicSlug={localModule.id}
            enableDirectNavigation={true}
            isLoadingStates={isLoading}
          />

          {/* Bottom Topic Navigation Flow */}
          <div className="flex items-center justify-between pt-8 border-t">
            {prevTopic ? (
              <Link href={`/dsa/${prevTopic.id}`}>
                <Button variant="outline" size="sm" className="gap-2 text-xs font-bold">
                  <ArrowLeft size={14} /> Previous Topic: {prevTopic.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextTopic ? (
              <Link href={`/dsa/${nextTopic.id}`}>
                <Button size="sm" className="gap-2 text-xs font-bold">
                  Next Topic: {nextTopic.title} <ArrowRight size={14} />
                </Button>
              </Link>
            ) : (
              <Link href="/dsa">
                <Button size="sm" variant="outline" className="gap-2 text-xs font-bold">
                  Explore Next Track <ArrowRight size={14} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
