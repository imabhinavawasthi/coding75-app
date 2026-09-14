"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  CircleDot,
  Lightbulb,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Building2,
  Tag,
  PlayCircle,
  FileCode2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchCourseCurriculum, fetchProblemDetail, TARGET_DSA_COURSE_ID } from "@/lib/courses";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState, UserNote } from "@/lib/user-states";
import { CourseSection, CourseSectionItem, PracticeProblem } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CoursePlaylistSidebar } from "../../dsa/_components/course-playlist-sidebar";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemId = (params?.id as string) || "";
  const topicParam = searchParams.get("topic") || "";

  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [problemDetail, setProblemDetail] = useState<PracticeProblem | null>(null);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [language, setLanguage] = useState<"cpp" | "java" | "python" | "javascript">("cpp");
  const [copied, setCopied] = useState(false);

  // Notes state
  const [newNoteText, setNewNoteText] = useState("");
  const [notes, setNotes] = useState<UserNote[]>([]);

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

  // Locate current item & index in curriculum
  const currentIndex = allItems.findIndex(
    (e) => e.item.id === problemId || e.item.asset_id === problemId || e.item.slug === problemId
  );
  const currentEntry = currentIndex !== -1 ? allItems[currentIndex] : null;
  const currentItem = currentEntry?.item;

  // Resolved database asset ID (either direct UUID or through curriculum item.asset_id)
  const resolvedAssetId = currentItem?.asset_id || problemId;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [curriculumData, statesData, probRes] = await Promise.all([
          fetchCourseCurriculum(TARGET_DSA_COURSE_ID),
          fetchUserAssetStates(),
          fetchProblemDetail(resolvedAssetId),
        ]);

        if (isMounted) {
          setCurriculum(curriculumData);
          setUserStates(statesData);
          if (probRes.problem) {
            setProblemDetail(probRes.problem);
          }

          const activeId = resolvedAssetId;
          const currentItemState = statesData[activeId] || statesData[problemId];
          if (currentItemState?.notes) {
            setNotes(currentItemState.notes);
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
  }, [problemId, resolvedAssetId]);

  const prevEntry = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextEntry = currentIndex !== -1 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const activeId = resolvedAssetId;
  const currentStatus: "pending" | "done" | "revision" =
    userStates[activeId]?.status || userStates[problemId]?.status || "pending";
  const isCompleted = currentStatus === "done";
  const isBookmarked = Boolean(userStates[activeId]?.is_bookmarked || userStates[problemId]?.is_bookmarked);

  const title = problemDetail?.title || currentItem?.title || "Practice Problem";
  const difficulty = problemDetail?.difficulty || currentItem?.duration_label || "Medium";
  const problemUrl = problemDetail?.problem_url || currentItem?.problem_url || "";
  const platform = problemDetail?.platform || "LeetCode";

  const handleUpdateStatus = async (newStatus: "pending" | "done" | "revision") => {
    const updated = await saveUserAssetState({
      asset_id: activeId,
      asset_type: "problem",
      status: newStatus,
      metadata: {
        title,
        difficulty,
        topic: topicParam,
      },
    });
    setUserStates((prev) => ({ ...prev, [activeId]: updated, [problemId]: updated }));
  };

  const handleToggleBookmark = async () => {
    const updated = await saveUserAssetState({
      asset_id: activeId,
      asset_type: "problem",
      is_bookmarked: !isBookmarked,
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

  const handleCopyCode = (codeText: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      created_at: new Date().toISOString(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setNewNoteText("");

    await saveUserAssetState({
      asset_id: activeId,
      asset_type: "problem",
      notes: updatedNotes,
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    await saveUserAssetState({
      asset_id: activeId,
      asset_type: "problem",
      notes: updatedNotes,
    });
  };

  const getLanguageExtension = () => {
    if (language === "cpp" || language === "java") return [cpp()];
    return [javascript()];
  };

  const getItemUrl = (item: CourseSectionItem) => {
    const idToUse = item.asset_id || item.id;
    const q = topicParam ? `?topic=${topicParam}` : "";
    if (item.type === "video") return `/video/${idToUse}${q}`;
    return `/problem/${idToUse}${q}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-muted-foreground font-mono">Loading problem statement & solutions...</p>
      </div>
    );
  }

  if (!problemDetail && !currentItem) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-foreground">Problem Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested practice problem could not be loaded from the course database.
        </p>
        <Link href="/dsa">
          <Button size="sm" className="gap-1.5 text-xs font-bold">
            <ArrowLeft size={14} /> Back to DSA Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const currentSolution = problemDetail?.solutions?.[language];
  const solutionCode = currentSolution?.code || "// Solution code not available for this language.";
  const hints = problemDetail?.attributes?.hints || [];
  const companyTags = problemDetail?.attributes?.company_tags || [];
  const tags = problemDetail?.attributes?.tags || [];
  const relatedLectures = problemDetail?.resources?.video_lectures || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-4 space-y-5">
      {/* Top Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium flex-wrap">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight size={13} className="text-muted-foreground/60" />
        <Link href="/dsa" className="hover:text-foreground transition-colors">
          DSA
        </Link>
        {topicParam && (
          <>
            <ChevronRight size={13} className="text-muted-foreground/60" />
            <Link href={`/dsa/${topicParam}`} className="hover:text-foreground transition-colors capitalize">
              {topicParam.replace(/-/g, " ")}
            </Link>
          </>
        )}
        <ChevronRight size={13} className="text-muted-foreground/60" />
        <span className="text-foreground font-semibold truncate max-w-[280px]">
          {title}
        </span>
      </nav>

      {/* Problem Solver Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border bg-card shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Practice Problem
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] font-bold ${
                difficulty.toLowerCase() === "hard"
                  ? "border-red-500 text-red-500"
                  : difficulty.toLowerCase() === "medium"
                  ? "border-amber-500 text-amber-500"
                  : "border-emerald-500 text-emerald-500"
              }`}
            >
              {difficulty}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {title}
          </h1>
        </div>

        {/* Action Buttons: Status Dropdown, Bookmark, External Link */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 text-xs font-bold ${
                  currentStatus === "done"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                    : currentStatus === "revision"
                    ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                    : ""
                }`}
              >
                {currentStatus === "done" && <CheckCircle2 size={15} />}
                {currentStatus === "revision" && <RotateCcw size={15} />}
                {currentStatus === "pending" && <CircleDot size={15} />}
                <span>{currentStatus === "done" ? "Solved" : currentStatus === "revision" ? "Revise" : "Pending"}</span>
                <ChevronDown size={13} className="opacity-70 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => handleUpdateStatus("pending")} className="gap-2 text-xs font-medium cursor-pointer">
                <CircleDot size={14} className="text-muted-foreground" />
                <span>Pending</span>
                {currentStatus === "pending" && <Check size={14} className="ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus("revision")} className="gap-2 text-xs font-medium cursor-pointer text-amber-600 dark:text-amber-400">
                <RotateCcw size={14} className="text-amber-500" />
                <span>Revise</span>
                {currentStatus === "revision" && <Check size={14} className="ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateStatus("done")} className="gap-2 text-xs font-medium cursor-pointer text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Solved</span>
                {currentStatus === "done" && <Check size={14} className="ml-auto text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bookmark Button */}
          <Button
            variant={isBookmarked ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleBookmark}
            className={`gap-1.5 text-xs font-bold ${isBookmarked ? "text-amber-500 border-amber-500/40 bg-amber-500/10" : ""}`}
          >
            <Bookmark size={15} className={isBookmarked ? "fill-amber-500 text-amber-500" : ""} />
            {isBookmarked ? "Saved" : "Save"}
          </Button>

          {/* Course Playlist Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-bold border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary"
              >
                <BookOpen size={15} />
                <span className="hidden sm:inline">Course Playlist</span>
                <span className="sm:hidden">Playlist</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/15 text-primary font-mono ml-0.5">
                  {allItems.length}
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 sm:max-w-md w-full border-l">
              <CoursePlaylistSidebar
                sections={curriculum}
                activeItemId={activeId}
                userStates={userStates}
                onUpdateStatus={handlePlaylistUpdateStatus}
                onToggleBookmark={handlePlaylistToggleBookmark}
                topicSlug={topicParam}
                className="h-full border-0 rounded-none shadow-none"
              />
            </SheetContent>
          </Sheet>

          {/* Platform Link */}
          {problemUrl && (
            <a href={problemUrl} target="_blank" rel="noreferrer">
              <Button size="sm" className="gap-1.5 text-xs font-bold shadow-xs">
                <span>Solve on {platform}</span>
                <ExternalLink size={13} />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Main 2-Column Split: Problem Description vs Solutions & Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[68vh]">
        {/* Left Pane: Statement, Hints, Notes */}
        <div className="space-y-4">
          <Tabs defaultValue="statement" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="statement">Description</TabsTrigger>
              <TabsTrigger value="hints">Hints ({hints.length})</TabsTrigger>
              <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
            </TabsList>

            {/* Statement Tab */}
            <TabsContent value="statement" className="space-y-4 flex-1">
              <Card className="h-full">
                <CardContent className="p-5 space-y-4 text-xs sm:text-sm leading-relaxed text-foreground">
                  {problemDetail?.description ? (
                    <div
                      className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: problemDetail.description }}
                    />
                  ) : currentItem?.description ? (
                    <p>{currentItem.description}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      Implement an optimal time and space solution for this algorithmic problem.
                    </p>
                  )}

                  {/* Company Tags */}
                  {companyTags.length > 0 && (
                    <div className="pt-3 border-t space-y-1.5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Building2 size={13} /> Asked in Companies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {companyTags.map((comp: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] capitalize">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topic Tags */}
                  {tags.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <Tag size={13} /> Topics
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tg: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            #{tg}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Platform Link Card */}
                  {problemUrl && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                        <div className="space-y-0.5">
                          <p className="font-bold text-xs text-foreground">Submit on {platform}</p>
                          <p className="text-[11px] text-muted-foreground">Run online judge testcases on the official platform.</p>
                        </div>
                        <a href={problemUrl} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
                            <span>Open Link</span>
                            <ExternalLink size={12} />
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hints Tab */}
            <TabsContent value="hints" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Lightbulb size={18} className="text-amber-500" />
                    <span>Algorithmic Hints & Approaches</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {hints.length > 0 ? (
                    hints.map((hint: string, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                        <span className="font-bold text-foreground block">Hint {idx + 1}:</span>
                        <p>{hint}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Consider what data structures allow efficient lookups, updates, or ordering for this problem.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Problem Solving Notes</span>
                    <span className="text-xs font-normal text-muted-foreground">Saved to your account</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add key insights, edge cases, or complexity notes..."
                      className="w-full min-h-[90px] rounded-xl border border-border bg-background p-3 text-xs sm:text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" className="gap-1.5 text-xs font-bold">
                        <Plus size={14} /> Add Note
                      </Button>
                    </div>
                  </form>

                  {notes.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No personal notes yet for this problem.
                    </p>
                  ) : (
                    <div className="space-y-2.5 pt-2 border-t">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-start justify-between gap-3 p-3 rounded-xl border bg-muted/30 text-xs sm:text-sm"
                        >
                          <p className="text-foreground whitespace-pre-wrap leading-relaxed flex-1">
                            {note.text}
                          </p>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-muted-foreground hover:text-red-500 p-1 shrink-0"
                            title="Delete note"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Pane: Official Solution Code & Editorial from Backend */}
        <div className="space-y-4 flex flex-col">
          {/* Solution Header & Language Switcher */}
          <div className="flex items-center justify-between p-3 rounded-2xl border bg-card shadow-xs">
            <div className="flex items-center gap-2">
              <FileCode2 size={16} className="text-primary" />
              <span className="font-bold text-xs text-foreground">Official Editorial Code</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Selector */}
              <div className="flex items-center p-0.5 rounded-lg border bg-muted/30">
                {(["cpp", "java", "python", "javascript"] as const).map((lang) => {
                  const hasSolution = Boolean(problemDetail?.solutions?.[lang]);
                  return (
                    <Button
                      key={lang}
                      variant={language === lang ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setLanguage(lang)}
                      className={`h-6 text-[10px] font-bold uppercase px-2 rounded-md ${
                        !hasSolution ? "opacity-60" : ""
                      }`}
                    >
                      {lang === "cpp" ? "C++" : lang === "javascript" ? "JS" : lang}
                    </Button>
                  );
                })}
              </div>

              {/* Copy Code */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyCode(solutionCode)}
                className="h-7 px-2 text-xs gap-1"
                title="Copy Code"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span className="text-[10px] hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          {/* Syntax Highlighted Code Viewer */}
          <div className="rounded-2xl border overflow-hidden shadow-xs min-h-[320px] bg-[#1e1e1e]">
            <CodeMirror
              value={solutionCode}
              height="360px"
              theme={vscodeDark}
              extensions={getLanguageExtension()}
              editable={false}
              className="text-xs sm:text-sm font-mono"
            />
          </div>

          {/* Solution Complexity Badges & Explanation Card */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Algorithmic Approach & Complexity</span>
                {currentSolution && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    {currentSolution.time_complexity && (
                      <Badge variant="outline" className="font-bold text-primary border-primary/30 bg-primary/5">
                        Time: {currentSolution.time_complexity}
                      </Badge>
                    )}
                    {currentSolution.space_complexity && (
                      <Badge variant="outline" className="font-bold text-muted-foreground">
                        Space: {currentSolution.space_complexity}
                      </Badge>
                    )}
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground space-y-3">
              {currentSolution?.explanation ? (
                <div className="whitespace-pre-wrap leading-relaxed text-foreground/90 font-sans">
                  {currentSolution.explanation}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Review the implementation above to understand the key data structures and pointer movements.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Previous / Next Item Flow */}
      <div className="flex items-center justify-between pt-6 border-t">
        {prevEntry ? (
          <Link href={getItemUrl(prevEntry.item)}>
            <Button variant="outline" size="sm" className="gap-2 text-xs font-bold">
              <ArrowLeft size={14} /> Previous: {prevEntry.item.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextEntry && (
          <Link href={getItemUrl(nextEntry.item)}>
            <Button size="sm" className="gap-2 text-xs font-bold">
              Next: {nextEntry.item.title} <ArrowRight size={14} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
