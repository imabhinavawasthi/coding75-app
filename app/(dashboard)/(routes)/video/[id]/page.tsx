"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Clock,
  Code2,
  FileText,
  Share2,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  CircleDot,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchCourseCurriculum, fetchVideoDetail, TARGET_DSA_COURSE_ID } from "@/lib/courses";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState, UserNote } from "@/lib/user-states";
import { CourseSection, CourseSectionItem, VideoLecture } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CoursePlaylistSidebar } from "../../dsa/_components/course-playlist-sidebar";
import { ProtectedVideoPlayer } from "../../dsa/_components/protected-video-player";

interface EmbedInfo {
  embedUrl: string | null;
  isIframeCompatible: boolean;
  originalUrl: string;
}

function getEmbedInfo(url?: string, videoId?: string): EmbedInfo {
  if (!url) return { embedUrl: null, isIframeCompatible: false, originalUrl: "" };

  // Internal protected player stream endpoint
  if (url.startsWith("/api/videos/")) {
    return {
      embedUrl: url,
      isIframeCompatible: true,
      originalUrl: "",
    };
  }

  // Google Drive video -> Route through protected player
  const driveMatch = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return {
      embedUrl: videoId ? `/api/videos/${videoId}/player` : `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      isIframeCompatible: true,
      originalUrl: "",
    };
  }

  // YouTube
  if (url.includes("youtube.com/embed/")) {
    return { embedUrl: url, isIframeCompatible: true, originalUrl: url };
  }
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      isIframeCompatible: true,
      originalUrl: url,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isIframeCompatible: true,
      originalUrl: url,
    };
  }

  return { embedUrl: url, isIframeCompatible: false, originalUrl: url };
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m`;
  }
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export default function VideoLecturePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = (params?.id as string) || "";
  const topicParam = searchParams.get("topic") || "";

  const [curriculum, setCurriculum] = useState<CourseSection[]>([]);
  const [videoDetail, setVideoDetail] = useState<VideoLecture | null>(null);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoading, setIsLoading] = useState(true);
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

  // Locate current item & current index in curriculum
  const currentIndex = allItems.findIndex(
    (e) => e.item.id === videoId || e.item.asset_id === videoId || e.item.slug === videoId
  );
  const currentEntry = currentIndex !== -1 ? allItems[currentIndex] : null;
  const currentItem = currentEntry?.item;

  // Resolved database asset ID (either direct UUID or through curriculum item.asset_id)
  const resolvedAssetId = currentItem?.asset_id || videoId;

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [curriculumData, statesData, videoRes] = await Promise.all([
          fetchCourseCurriculum(TARGET_DSA_COURSE_ID),
          fetchUserAssetStates(),
          fetchVideoDetail(resolvedAssetId),
        ]);

        if (isMounted) {
          setCurriculum(curriculumData);
          setUserStates(statesData);
          if (videoRes.video) {
            setVideoDetail(videoRes.video);
          }

          const activeId = resolvedAssetId;
          const currentItemState = statesData[activeId] || statesData[videoId];
          if (currentItemState?.notes) {
            setNotes(currentItemState.notes);
          }
        }
      } catch (err) {
        console.error("Error loading video lecture data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [videoId, resolvedAssetId]);

  const prevEntry = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextEntry = currentIndex !== -1 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const activeId = resolvedAssetId;
  const currentStatus: "pending" | "done" | "revision" =
    userStates[activeId]?.status || userStates[videoId]?.status || "pending";
  const isCompleted = currentStatus === "done";
  const isBookmarked = Boolean(userStates[activeId]?.is_bookmarked || userStates[videoId]?.is_bookmarked);

  const title = videoDetail?.title || currentItem?.title || "Video Lecture";
  const durationLabel = formatDuration(videoDetail?.duration_seconds) || currentItem?.duration_label || "";
  const rawVideoUrl = videoDetail?.embed_url || videoDetail?.video_url || currentItem?.video_url || "";
  const embedInfo = getEmbedInfo(rawVideoUrl, activeId);

  const handleUpdateStatus = async (newStatus: "pending" | "done" | "revision") => {
    const updated = await saveUserAssetState({
      asset_id: activeId,
      asset_type: "video",
      status: newStatus,
      metadata: {
        title,
        duration: durationLabel,
        topic: topicParam,
      },
    });
    setUserStates((prev) => ({ ...prev, [activeId]: updated, [videoId]: updated }));
  };

  const handleToggleBookmark = async () => {
    const updated = await saveUserAssetState({
      asset_id: activeId,
      asset_type: "video",
      is_bookmarked: !isBookmarked,
    });
    setUserStates((prev) => ({ ...prev, [activeId]: updated, [videoId]: updated }));
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
      asset_type: "video",
      notes: updatedNotes,
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    await saveUserAssetState({
      asset_id: activeId,
      asset_type: "video",
      notes: updatedNotes,
    });
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
        <p className="text-xs font-bold text-muted-foreground font-mono">Loading lecture stream & notes...</p>
      </div>
    );
  }

  if (!videoDetail && !currentItem) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-foreground">Lecture Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested video lecture could not be loaded from the course database.
        </p>
        <Link href="/dsa">
          <Button size="sm" className="gap-1.5 text-xs font-bold">
            <ArrowLeft size={14} /> Back to DSA Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-4 space-y-6">
      {/* Top Breadcrumb Navigation & Mobile Playlist Trigger */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
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

        {/* Mobile Course Playlist Drawer Trigger */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold shadow-xs">
                <BookOpen size={14} className="text-primary" />
                <span>Course Playlist</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
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
        </div>
      </div>

      {/* Main Grid: Video Player + Playlist Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Player & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Protected Video Player */}
          <ProtectedVideoPlayer embedUrl={embedInfo.embedUrl} title={title} />

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border bg-card shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Video Lecture
                </Badge>
                {durationLabel && (
                  <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                    <Clock size={12} /> {durationLabel}
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {title}
              </h1>
            </div>

            {/* Actions: Status Dropdown, Bookmark, Share */}
            <div className="flex items-center gap-2">
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
                    <span>{currentStatus === "done" ? "Done" : currentStatus === "revision" ? "Revise" : "Pending"}</span>
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
                    <span>Done</span>
                    {currentStatus === "done" && <Check size={14} className="ml-auto text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant={isBookmarked ? "secondary" : "outline"}
                size="sm"
                onClick={handleToggleBookmark}
                className={`gap-1.5 text-xs font-bold ${isBookmarked ? "text-amber-500 border-amber-500/40 bg-amber-500/10" : ""}`}
              >
                <Bookmark size={15} className={isBookmarked ? "fill-amber-500 text-amber-500" : ""} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleCopyLink} className="gap-1 text-xs">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                <span>{copied ? "Copied" : "Share"}</span>
              </Button>
            </div>
          </div>

          {/* Tabbed Content: Overview & Description, Learning Outcomes, Notes */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview & Syllabus</TabsTrigger>
              <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
              <TabsTrigger value="notes">Personal Notes ({notes.length})</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <span>Lecture Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {videoDetail?.description ? (
                    <div
                      className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: videoDetail.description }}
                    />
                  ) : currentItem?.description ? (
                    <p>{currentItem.description}</p>
                  ) : (
                    <p>In-depth video walkthrough of core concepts and problem patterns from the course curriculum.</p>
                  )}

                  {videoDetail?.attributes?.topics && videoDetail.attributes.topics.length > 0 && (
                    <div className="pt-3 border-t">
                      <h4 className="text-xs font-bold text-foreground mb-2">Key Topics Covered</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {videoDetail.attributes.topics.map((top: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[11px] font-normal">
                            {top}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {videoDetail?.attributes?.tags && videoDetail.attributes.tags.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-bold text-foreground mb-2">Concept Tags</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {videoDetail.attributes.tags.map((tag: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Learning Outcomes Tab */}
            <TabsContent value="outcomes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>What You Will Master</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videoDetail?.attributes?.learning_outcomes && videoDetail.attributes.learning_outcomes.length > 0 ? (
                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      {videoDetail.attributes.learning_outcomes.map((outcome: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Master the fundamental algorithmic principles and intuitive patterns introduced in this lecture.
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
                    <span>Your Timestamped Notes</span>
                    <span className="text-xs font-normal text-muted-foreground">Saved to your account</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Note Input */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write your personal takeaways, pseudo-code, or bookmarks..."
                      className="w-full min-h-[90px] rounded-xl border border-border bg-background p-3 text-xs sm:text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground"
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" className="gap-1.5 text-xs font-bold">
                        <Plus size={14} /> Add Note
                      </Button>
                    </div>
                  </form>

                  {/* Notes List */}
                  {notes.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No notes yet. Capture key insights as you study this lecture.
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

          {/* Navigation Controls: Previous / Next Lecture */}
          <div className="flex items-center justify-between pt-4 border-t">
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

        {/* Right 1 Col: Course Curriculum Playlist Sidebar */}
        <div className="hidden lg:block space-y-4 sticky top-6">
          <CoursePlaylistSidebar
            sections={curriculum}
            activeItemId={activeId}
            userStates={userStates}
            onUpdateStatus={handlePlaylistUpdateStatus}
            onToggleBookmark={handlePlaylistToggleBookmark}
            topicSlug={topicParam}
            className="h-[calc(100vh-6rem)]"
          />
        </div>
      </div>
    </div>
  );
}
