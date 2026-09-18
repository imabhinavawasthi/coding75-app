"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlayCircle,
  Code2,
  FileText,
  CheckCircle2,
  RotateCcw,
  CircleDot,
  Bookmark,
  ChevronDown,
  Check,
  ExternalLink,
  Maximize2,
  Clock,
  Lightbulb,
  Building2,
  Tag,
  Sparkles,
  FileCode2,
  Copy,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { CourseSectionItem, VideoLecture, PracticeProblem } from "@/types/course";
import { UserAssetState, UserNote, saveUserAssetState } from "@/lib/user-states";
import { fetchVideoDetail, fetchProblemDetail } from "@/lib/courses";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { ProtectedVideoPlayer } from "./protected-video-player";

interface ItemSlideDrawerProps {
  item: CourseSectionItem | null;
  isOpen: boolean;
  onClose: () => void;
  userStates: Record<string, UserAssetState>;
  onUpdateStatus: (
    itemId: string,
    assetType: "video" | "problem" | "article",
    status: "pending" | "done" | "revision"
  ) => void;
  onToggleBookmark: (
    itemId: string,
    assetType: "video" | "problem" | "article"
  ) => void;
  topicSlug?: string;
}

function getEmbedUrl(url?: string, assetId?: string): string | null {
  if (!url && !assetId) return null;
  if (url && url.startsWith("/api/videos/")) return url;
  if (assetId) return `/api/videos/${assetId}/player`;

  const driveMatch = url?.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  if (url?.includes("youtube.com/embed/")) return url;
  const ytMatch = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }
  return null;
}

export const ItemSlideDrawer: React.FC<ItemSlideDrawerProps> = ({
  item,
  isOpen,
  onClose,
  userStates,
  onUpdateStatus,
  onToggleBookmark,
  topicSlug = "",
}) => {
  const router = useRouter();

  const [videoData, setVideoData] = useState<VideoLecture | null>(null);
  const [problemData, setProblemData] = useState<PracticeProblem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"cpp" | "java" | "python" | "javascript">("cpp");

  // Notes state inside drawer
  const [newNoteText, setNewNoteText] = useState("");
  const [notes, setNotes] = useState<UserNote[]>([]);

  const targetAssetId = item?.asset_id || item?.id || "";
  const itemState = item ? (item.asset_id && userStates[item.asset_id]) || userStates[item.id] : undefined;
  const currentStatus = itemState?.status || "pending";
  const isBookmarked = Boolean(itemState?.is_bookmarked);

  useEffect(() => {
    if (!item || !isOpen) return;

    let isMounted = true;
    const loadDetails = async () => {
      setIsLoading(true);
      setVideoData(null);
      setProblemData(null);

      // Load existing notes
      if (itemState?.notes) {
        setNotes(itemState.notes);
      } else {
        setNotes([]);
      }

      try {
        if (item.type === "video") {
          const res = await fetchVideoDetail(targetAssetId);
          if (isMounted && res.video) setVideoData(res.video);
        } else if (item.type === "problem") {
          const res = await fetchProblemDetail(targetAssetId);
          if (isMounted && res.problem) setProblemData(res.problem);
        }
      } catch (err) {
        console.error("Error loading item details in slide drawer:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [item, isOpen, targetAssetId]);

  if (!item) return null;

  const isVideo = item.type === "video";
  const isProblem = item.type === "problem";

  const fullPageUrl = isVideo
    ? `/video/${encodeURIComponent(targetAssetId)}${topicSlug ? `?topic=${topicSlug}` : ""}`
    : `/dsa/problem/${encodeURIComponent(targetAssetId)}${topicSlug ? `?topic=${topicSlug}` : ""}`;

  const handleOpenFullPage = () => {
    onClose();
    router.push(fullPageUrl);
  };

  const handleCopy = (text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !item) return;

    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      created_at: new Date().toISOString(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setNewNoteText("");

    await saveUserAssetState({
      asset_id: targetAssetId,
      asset_type: item.type,
      notes: updatedNotes,
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!item) return;
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);

    await saveUserAssetState({
      asset_id: targetAssetId,
      asset_type: item.type,
      notes: updatedNotes,
    });
  };

  const rawVideoUrl = videoData?.embed_url || videoData?.video_url || item.video_url;
  const embedUrl = getEmbedUrl(rawVideoUrl, targetAssetId);

  const problemUrl = problemData?.problem_url || item.problem_url;
  const platform = problemData?.platform || "LeetCode";
  const difficulty = problemData?.difficulty || item.duration_label || "Medium";
  const solutionCode = problemData?.solutions?.[selectedLang]?.code;
  const currentSolution = problemData?.solutions?.[selectedLang];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col z-50 overflow-hidden bg-card border-l shadow-2xl"
      >
        {/* Sticky Header */}
        <div className="p-4 sm:p-5 border-b bg-muted/20 space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={`text-[10px] uppercase font-bold ${
                  isVideo
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {isVideo ? "Video Lecture" : "Practice Problem"}
              </Badge>

              {item.duration_label && (
                <Badge variant="outline" className="text-[10px] font-mono">
                  {item.duration_label}
                </Badge>
              )}
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-1.5">
              {/* Status Dropdown */}
              {isLoading ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border animate-pulse">
                  <Loader2 size={12} className="animate-spin text-muted-foreground" />
                  <span>Loading...</span>
                </span>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition-all ${
                        currentStatus === "done"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : currentStatus === "revision"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {currentStatus === "done" && <CheckCircle2 size={13} className="text-emerald-500" />}
                      {currentStatus === "revision" && <RotateCcw size={13} className="text-amber-500" />}
                      {currentStatus === "pending" && <CircleDot size={13} className="text-muted-foreground" />}
                      <span className="capitalize">{currentStatus === "revision" ? "Revise" : currentStatus}</span>
                      <ChevronDown size={12} className="opacity-60 ml-0.5" />
                    </button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 z-50">
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(targetAssetId, item.type, "pending")}
                    className="gap-2 text-xs font-medium cursor-pointer"
                  >
                    <CircleDot size={13} className="text-muted-foreground" />
                    <span>Pending</span>
                    {currentStatus === "pending" && <Check size={13} className="ml-auto text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(targetAssetId, item.type, "revision")}
                    className="gap-2 text-xs font-medium cursor-pointer text-amber-600 dark:text-amber-400"
                  >
                    <RotateCcw size={13} className="text-amber-500" />
                    <span>Revise</span>
                    {currentStatus === "revision" && <Check size={13} className="ml-auto text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateStatus(targetAssetId, item.type, "done")}
                    className="gap-2 text-xs font-medium cursor-pointer text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Done</span>
                    {currentStatus === "done" && <Check size={13} className="ml-auto text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

              {/* Bookmark Toggle */}
              <button
                type="button"
                onClick={() => onToggleBookmark(targetAssetId, item.type)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isBookmarked
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-500"
                    : "border-border hover:bg-muted text-muted-foreground"
                }`}
                title={isBookmarked ? "Saved" : "Save"}
              >
                <Bookmark size={14} className={isBookmarked ? "fill-amber-500 text-amber-500" : ""} />
              </button>

              {/* Open Full Page Button */}
              <Button
                size="sm"
                onClick={handleOpenFullPage}
                className="gap-1.5 text-xs font-bold h-8 ml-1"
              >
                <span>Full Page</span>
                <Maximize2 size={13} />
              </Button>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight line-clamp-2">
            {videoData?.title || problemData?.title || item.title}
          </h2>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-muted-foreground font-mono">Loading from course database...</p>
            </div>
          ) : isVideo ? (
            /* Video Lecture Drawer Content */
            <div className="space-y-6">
              {/* Protected Video Player */}
              <ProtectedVideoPlayer embedUrl={embedUrl} title={item.title} />

              {/* Lecture Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Lecture Description
                </h4>
                {videoData?.description ? (
                  <div
                    className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: videoData.description }}
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description || "Detailed conceptual breakdown and walkthrough."}
                  </p>
                )}
              </div>

              {/* Topics / Learning Outcomes */}
              {videoData?.attributes?.learning_outcomes && videoData.attributes.learning_outcomes.length > 0 && (
                <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Key Learning Outcomes</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {videoData.attributes.learning_outcomes.map((lo: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        <span>{lo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Practice Problem Drawer Content */
            <div className="space-y-6">
              {/* Problem Meta & External Platform Action */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/20">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Official Platform
                  </span>
                  <p className="text-sm font-bold text-foreground">{platform}</p>
                </div>

                {problemUrl && (
                  <a href={problemUrl} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gap-1.5 text-xs font-bold shadow-xs">
                      <span>Solve on {platform}</span>
                      <ExternalLink size={13} />
                    </Button>
                  </a>
                )}
              </div>

              {/* Problem Statement */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Problem Description
                </h4>
                {problemData?.description ? (
                  <div
                    className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: problemData.description }}
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description || "Solve this algorithmic challenge with optimal time and space complexity."}
                  </p>
                )}
              </div>

              {/* Hints */}
              {problemData?.attributes?.hints && problemData.attributes.hints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-amber-500" />
                    <span>Hints & Approaches</span>
                  </h4>
                  <div className="space-y-2">
                    {problemData.attributes.hints.map((hint: string, i: number) => (
                      <div key={i} className="p-3 rounded-xl border bg-muted/25 text-xs text-muted-foreground">
                        <span className="font-bold text-foreground block mb-0.5">Hint {i + 1}:</span>
                        <p>{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Solution Code Preview */}
              {problemData?.solutions && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileCode2 size={14} className="text-primary" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Official Editorial Code
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {(["cpp", "java", "python", "javascript"] as const).map((lang) => {
                        const hasSol = Boolean(problemData.solutions?.[lang]);
                        return (
                          <Button
                            key={lang}
                            variant={selectedLang === lang ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedLang(lang)}
                            className={`h-6 text-[10px] font-bold uppercase px-2 rounded-md ${
                              !hasSol ? "opacity-50" : ""
                            }`}
                          >
                            {lang === "cpp" ? "C++" : lang === "javascript" ? "JS" : lang}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {solutionCode ? (
                    <div className="rounded-xl border overflow-hidden shadow-xs bg-[#1e1e1e]">
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-muted/20 text-xs">
                        <div className="flex items-center gap-2">
                          {currentSolution?.time_complexity && (
                            <span className="text-[10px] text-primary font-mono font-bold">
                              Time: {currentSolution.time_complexity}
                            </span>
                          )}
                          {currentSolution?.space_complexity && (
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Space: {currentSolution.space_complexity}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(solutionCode)}
                          className="h-6 px-2 text-[10px] gap-1"
                        >
                          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </Button>
                      </div>
                      <CodeMirror
                        value={solutionCode}
                        height="260px"
                        theme={vscodeDark}
                        extensions={[cpp()]}
                        editable={false}
                        className="text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Solution code available on full page.</p>
                  )}
                </div>
              )}

              {/* Company Tags */}
              {problemData?.attributes?.company_tags && problemData.attributes.company_tags.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                    <Building2 size={13} /> Asked in Companies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {problemData.attributes.company_tags.map((comp: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px] capitalize">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Notes Section */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Your Personal Notes ({notes.length})
            </h4>

            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add quick notes or interview tips..."
                className="w-full min-h-[75px] rounded-xl border border-border bg-background p-2.5 text-xs focus:outline-none focus:border-primary placeholder:text-muted-foreground"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" className="gap-1 text-xs font-bold h-7">
                  <Plus size={12} /> Add Note
                </Button>
              </div>
            </form>

            {notes.length > 0 && (
              <div className="space-y-2 pt-1">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start justify-between gap-2 p-2.5 rounded-lg border bg-muted/20 text-xs"
                  >
                    <p className="text-foreground whitespace-pre-wrap flex-1 leading-relaxed">{n.text}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-muted-foreground hover:text-red-500 p-0.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Drawer Footer */}
        <div className="p-4 border-t bg-muted/15 flex items-center justify-between gap-3 shrink-0">
          <SheetClose asChild>
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              Close
            </Button>
          </SheetClose>

          <Button
            size="sm"
            onClick={handleOpenFullPage}
            className="gap-1.5 text-xs font-bold"
          >
            <span>Open Dedicated {isVideo ? "Video Lecture" : "Problem Solver"}</span>
            <Maximize2 size={13} />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
