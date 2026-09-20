"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, BookOpen } from "lucide-react";
import { fetchCourseCurriculum, fetchProblemDetail, TARGET_DSA_COURSE_ID } from "@/lib/courses";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState, UserNote } from "@/lib/user-states";
import { CourseSection, CourseSectionItem, PracticeProblem } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CoursePlaylistSidebar } from "../../_components/course-playlist-sidebar";
import ProblemViewer from "@/components/problem/ProblemViewer";
import supabase from "@/supabase";

function ProblemDetailSkeleton() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-pulse">
      <div className="flex items-start justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-muted rounded-full" />
            <div className="h-6 w-20 bg-muted rounded-full" />
          </div>
          <div className="h-7 w-2/3 bg-muted rounded-lg" />
          <div className="h-10 w-full bg-muted rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded-md" />
        <div className="h-4 w-5/6 bg-muted rounded-md" />
        <div className="h-4 w-4/5 bg-muted rounded-md" />
        <div className="h-4 w-2/3 bg-muted rounded-md" />
      </div>
    </div>
  );
}

function ProblemDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = (params?.id as string) || "";
  const topicParam = searchParams.get("topic") || "";
  const sheetParam = searchParams.get("sheet") || "";

  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [problemDetail, setProblemDetail] = useState<PracticeProblem | null>(null);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sheet-mode: list of problems from the sheet for the sidebar
  const [sheetProblems, setSheetProblems] = useState<any[]>([]);
  const [sheetTitle, setSheetTitle] = useState<string>("");

  // Flatten all items across sections from course DB
  const allItems = useMemo(() => {
    const list: { item: CourseSectionItem; sectionTitle: string; sectionId: string }[] = [];
    for (const sec of curriculum) {
      for (const item of sec.items || []) {
        list.push({ item, sectionTitle: sec.title, sectionId: sec.id });
      }
      for (const sub of sec.subsections || []) {
        for (const item of sub.items || []) {
          list.push({ item, sectionTitle: sub.title || sec.title, sectionId: sub.id || sec.id });
        }
      }
    }
    return list;
  }, [curriculum]);

  const currentIndex = allItems.findIndex(
    (e) => e.item.id === problemId || e.item.asset_id === problemId || e.item.slug === problemId
  );
  const currentItem = currentIndex !== -1 ? allItems[currentIndex]?.item : null;

  // Resolved database asset ID (either direct UUID or through curriculum item.asset_id)
  const resolvedAssetId = currentItem?.asset_id || problemDetail?.id || problemId;

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (isMounted) setIsLoggedIn(!!user);
    }
    checkAuth();

    async function loadData() {
      setIsLoading(true);
      try {
        const fetchPromises: Promise<any>[] = [
          fetchCourseCurriculum(TARGET_DSA_COURSE_ID),
          fetchUserAssetStates(),
          fetchProblemDetail(problemId),
        ];

        if (sheetParam) {
          fetchPromises.push(
            fetch(`/api/sheets/${encodeURIComponent(sheetParam)}/problems`)
              .then((r) => r.json())
              .catch(() => ({ problems: [], sheetTitle: "" }))
          );
        }

        const [curriculumData, statesData, probRes, sheetRes] = await Promise.all(fetchPromises);

        if (isMounted) {
          setCurriculum(curriculumData || []);
          setUserStates(statesData || {});
          if (probRes?.problem) {
            setProblemDetail(probRes.problem);
          }
          if (sheetRes?.problems) {
            setSheetProblems(sheetRes.problems);
            if (sheetRes.sheetTitle) setSheetTitle(sheetRes.sheetTitle);
          }
        }
      } catch (err) {
        console.error("Error loading problem detail:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [problemId, sheetParam]);

  const activeId = resolvedAssetId;
  const currentStatus: "pending" | "done" | "revision" =
    userStates[activeId]?.status || userStates[problemId]?.status || "pending";
  const isBookmarked = Boolean(userStates[activeId]?.is_bookmarked || userStates[problemId]?.is_bookmarked);
  const notes = userStates[activeId]?.notes || userStates[problemId]?.notes || [];

  const title = problemDetail?.title || currentItem?.title || problemId.replace(/[-_]/g, " ");

  const handleUpdateStatus = async (newStatus: "pending" | "done" | "revision") => {
    if (!isLoggedIn) return;
    const updated = await saveUserAssetState({
      asset_id: activeId,
      asset_type: "problem",
      status: newStatus,
    });
    setUserStates((prev) => ({ ...prev, [activeId]: updated, [problemId]: updated }));
  };

  const handleToggleBookmark = async () => {
    if (!isLoggedIn) return;
    const nextVal = !isBookmarked;
    const updated = await saveUserAssetState({
      asset_id: activeId,
      asset_type: "problem",
      is_bookmarked: nextVal,
    });
    setUserStates((prev) => ({ ...prev, [activeId]: updated, [problemId]: updated }));
  };

  const handleSaveNotes = async (newNotes: UserNote[]) => {
    if (!isLoggedIn) return;
    const updated = await saveUserAssetState({
      asset_id: activeId,
      asset_type: "problem",
      notes: newNotes,
    });
    setUserStates((prev) => ({ ...prev, [activeId]: updated, [problemId]: updated }));
  };

  const handlePlaylistUpdateStatus = async (
    itemId: string,
    assetType: "video" | "problem" | "article",
    newStatus: "pending" | "done" | "revision"
  ) => {
    const updated = await saveUserAssetState({
      asset_id: itemId,
      asset_type: assetType,
      status: newStatus,
    });
    setUserStates((prev) => ({ ...prev, [itemId]: updated }));
  };

  const handlePlaylistToggleBookmark = async (
    itemId: string,
    assetType: "video" | "problem" | "article"
  ) => {
    const currentState = userStates[itemId];
    const isSaved = currentState?.is_bookmarked ?? false;
    const updated = await saveUserAssetState({
      asset_id: itemId,
      asset_type: assetType,
      is_bookmarked: !isSaved,
    });
    setUserStates((prev) => ({ ...prev, [itemId]: updated }));
  };

  // Playlist drawer trigger
  const hasPlaylist = (sheetParam && sheetProblems.length > 0) || allItems.length > 0;
  const playlistTrigger = hasPlaylist ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs font-bold rounded-xl h-9 border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary"
        >
          <BookOpen size={14} />
          <span className="hidden sm:inline">{sheetParam ? "Sheet Problems" : "Course Playlist"}</span>
          <span className="sm:hidden">Playlist</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/15 text-primary font-mono ml-0.5">
            {sheetParam ? sheetProblems.length : allItems.length}
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-0 sm:max-w-md w-full border-l">
        {sheetParam ? (
          <div className="flex flex-col h-full">
            <SheetHeader className="px-5 py-4 border-b">
              <SheetTitle className="text-sm font-bold">{sheetTitle || "Sheet Problems"}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {sheetProblems.map((p: any, i: number) => {
                const isCurrent = p.slug === problemId || p.id === problemId;
                const state = userStates[p.id];
                return (
                  <a
                    key={p.id || i}
                    href={(() => {
                      const qp = new URLSearchParams();
                      qp.set("sheet", sheetParam);
                      if (topicParam) qp.set("topic", topicParam);
                      return `/dsa/problem/${p.slug}?${qp.toString()}`;
                    })()}
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors ${
                      isCurrent ? "bg-primary/5 border-l-2 border-primary" : ""
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        state?.status === "done"
                          ? "bg-emerald-500/15 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {state?.status === "done" ? "✓" : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isCurrent ? "text-primary" : "text-foreground"}`}>
                        {p.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.difficulty} · {p.platform || "LeetCode"}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ) : (
          <CoursePlaylistSidebar
            sections={curriculum}
            activeItemId={activeId}
            userStates={userStates}
            onUpdateStatus={handlePlaylistUpdateStatus}
            onToggleBookmark={handlePlaylistToggleBookmark}
            topicSlug={topicParam}
            className="h-full border-0 rounded-none shadow-none"
          />
        )}
      </SheetContent>
    </Sheet>
  ) : null;

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 select-none">
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <ProblemDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!problemDetail && !currentItem) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-foreground">Practice Problem Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The specifications for this problem could not be loaded from the database.
        </p>
        <Link href="/dsa">
          <Button size="sm" className="gap-1.5 text-xs font-bold rounded-xl">
            <ArrowLeft size={14} /> Back to DSA Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 select-none">
      {/* Top Breadcrumbs matching CrackDSA Frontend */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium flex-wrap">
        <Link href="/dsa" className="hover:text-foreground transition-colors">
          DSA
        </Link>
        {sheetParam && (
          <>
            <ChevronRight size={13} className="text-muted-foreground/60" />
            <Link href={`/dsa/sheets/${sheetParam}`} className="hover:text-foreground transition-colors capitalize">
              {sheetTitle || "Sheet"}
            </Link>
          </>
        )}
        {topicParam && (
          <>
            <ChevronRight size={13} className="text-muted-foreground/60" />
            <Link
              href={sheetParam ? `/dsa/sheets/${sheetParam}` : `/dsa/${topicParam}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {topicParam.replace(/[-_]/g, " ")}
            </Link>
          </>
        )}
        {!sheetParam && !topicParam && (
          <>
            <ChevronRight size={13} className="text-muted-foreground/60" />
            <Link href="/dsa" className="hover:text-foreground transition-colors">
              Problems
            </Link>
          </>
        )}
        <ChevronRight size={13} className="text-muted-foreground/60" />
        <span className="text-foreground font-semibold truncate max-w-[280px]">
          {title}
        </span>
      </nav>

      {/* Card shell wraps everything (identical to legacy crackdsa frontend) */}
      <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <ProblemViewer
          slug={problemId}
          problemData={problemDetail || currentItem}
          currentStatus={currentStatus}
          isBookmarked={isBookmarked}
          notes={notes}
          isLoggedIn={isLoggedIn}
          onUpdateStatus={handleUpdateStatus}
          onToggleBookmark={handleToggleBookmark}
          onSaveNotes={handleSaveNotes}
          playlistTrigger={playlistTrigger}
          sheetTitle={sheetTitle}
          topicTitle={topicParam ? topicParam.replace(/[-_]/g, " ") : undefined}
        />
      </div>
    </div>
  );
}

export default function ProblemDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 select-none">
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <ProblemDetailSkeleton />
          </div>
        </div>
      }
    >
      <ProblemDetailContent />
    </Suspense>
  );
}
