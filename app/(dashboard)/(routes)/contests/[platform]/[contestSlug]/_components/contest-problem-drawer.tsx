"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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
  Copy,
  Sparkles,
  Tag,
  Building2,
  Loader2,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { ProtectedVideoPlayer } from "@/app/(dashboard)/(routes)/dsa/_components/protected-video-player";
import { ContestPlatform, ContestEditorial } from "@/types/contest";
import { PLATFORMS, getDifficultyBadge, parseTags } from "@/lib/contests";
import { UserAssetState } from "@/lib/user-states";

import LeetcodeLogo from "@/public/logos/leetcode.png";
import CodeforcesLogo from "@/public/logos/codeforces.svg";
import CodechefLogo from "@/public/logos/codechef.png";

const PLATFORM_LOGOS = {
  leetcode: LeetcodeLogo,
  codeforces: CodeforcesLogo,
  codechef: CodechefLogo,
};

function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return "";
  if (typeof window !== "undefined") {
    try {
      const DOMPurify = require("dompurify");
      if (typeof DOMPurify?.sanitize === "function") {
        return DOMPurify.sanitize(rawHtml);
      }
    } catch {
      // Fallback
    }
  }
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
}

interface ContestProblemDrawerProps {
  problem: ContestEditorial | null;
  platform: ContestPlatform;
  contestSlug: string;
  contestName?: string;
  isOpen: boolean;
  onClose: () => void;
  userStates: Record<string, UserAssetState>;
  onUpdateStatus: (problemId: string, status: "pending" | "done" | "revision") => void;
  onToggleBookmark: (problemId: string) => void;
  initialTab?: "statement" | "video" | "editorial" | "solution";
  isLoadingStates?: boolean;
  fullPageRoute?: string;
}

export function ContestProblemDrawer({
  problem,
  platform,
  contestSlug,
  contestName,
  isOpen,
  onClose,
  userStates,
  onUpdateStatus,
  onToggleBookmark,
  initialTab = "statement",
  isLoadingStates = false,
  fullPageRoute: customFullPageRoute,
}: ContestProblemDrawerProps) {
  const [activeSolutionTab, setActiveSolutionTab] = useState<"video" | "editorial" | "solution">("video");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (problem) {
      if (initialTab === "solution") setActiveSolutionTab("solution");
      else if (initialTab === "editorial") setActiveSolutionTab("editorial");
      else if (problem.video_editorial) setActiveSolutionTab("video");
      else if (problem.solution_link) setActiveSolutionTab("solution");
      else setActiveSolutionTab("video");
    }
  }, [problem, initialTab]);

  if (!problem) return null;

  const config = PLATFORMS[platform] || PLATFORMS.leetcode;
  const logo = PLATFORM_LOGOS[platform] || PLATFORM_LOGOS.leetcode;
  const diffBadge = getDifficultyBadge(problem.difficulty, platform);
  const topicTags = parseTags(problem.topic_tags);
  const companyTags = parseTags(problem.company_tags);

  const currentStatus = userStates[problem.id]?.status || "pending";
  const isBookmarked = Boolean(userStates[problem.id]?.is_bookmarked);

  const fullPageRoute = customFullPageRoute || `/contests/${platform}/${contestSlug}/${problem.slug_url}`;

  const copyCode = () => {
    if (problem.solution_link) {
      navigator.clipboard.writeText(problem.solution_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasSolutions = Boolean(
    problem.video_editorial || problem.editorial || problem.solution_link
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 flex flex-col z-50 overflow-hidden bg-card border-l shadow-2xl"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{problem.problem_name}</SheetTitle>
          <SheetDescription>{problem.problem_name} statement and editorial</SheetDescription>
        </SheetHeader>

        {/* Sticky Header */}
        <div className="p-4 sm:p-5 border-b bg-muted/20 space-y-3 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 gap-1.5 bg-background shadow-2xs">
                <Image src={logo} alt={config.name} width={13} height={13} className="object-contain" />
                <span>{config.name}</span>
              </Badge>
              <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${diffBadge.colorClass}`}>
                {diffBadge.label}
              </Badge>
            </div>

            {/* Quick Actions: Status, Bookmark, Solutions, Open Full Page */}
            <div className="flex items-center gap-1.5">
              {/* Status Dropdown */}
              {isLoadingStates ? (
                <span className="flex items-center gap-1 h-7 px-2 rounded-md text-xs font-medium bg-muted/40 text-muted-foreground border border-border/50 animate-pulse">
                  <Loader2 size={11} className="animate-spin text-muted-foreground" />
                  <span>Loading...</span>
                </span>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                        currentStatus === "done"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : currentStatus === "revision"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-muted/60 text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {currentStatus === "done" && <CheckCircle2 size={13} className="text-emerald-500" />}
                      {currentStatus === "revision" && <RotateCcw size={13} className="text-amber-500" />}
                      {currentStatus === "pending" && <CircleDot size={13} className="text-muted-foreground" />}
                      <span className="capitalize">{currentStatus === "revision" ? "Revise" : currentStatus}</span>
                      <ChevronDown size={11} className="opacity-60 ml-0.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 z-50">
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(problem.id, "pending")}
                      className="gap-2 text-xs font-medium cursor-pointer"
                    >
                      <CircleDot size={13} className="text-muted-foreground" />
                      <span>Pending</span>
                      {currentStatus === "pending" && <Check size={13} className="ml-auto text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(problem.id, "revision")}
                      className="gap-2 text-xs font-medium cursor-pointer text-amber-600 dark:text-amber-400"
                    >
                      <RotateCcw size={13} className="text-amber-500" />
                      <span>Revise</span>
                      {currentStatus === "revision" && <Check size={13} className="ml-auto text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(problem.id, "done")}
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
                onClick={() => onToggleBookmark(problem.id)}
                title={isBookmarked ? "Remove Bookmark" : "Save for Revision"}
                className={`p-1.5 rounded-lg border transition-all ${
                  isBookmarked
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-muted/60 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                }`}
              >
                <Bookmark size={14} className={isBookmarked ? "fill-primary" : ""} />
              </button>

              {/* Jump to Solutions Button */}
              {hasSolutions && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    document.getElementById("drawer-solutions-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-7 px-2 text-xs font-semibold gap-1 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer"
                  title="Jump down to Solutions"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Solutions</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              )}

              {/* Open Full Page Button */}
              <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs font-semibold gap-1 bg-background hover:bg-muted">
                <Link href={fullPageRoute}>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Full Page</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              {problem.problem_name}
            </h3>
            {contestName && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span>{contestName}</span>
              </p>
            )}
          </div>

          {/* Tags */}
          {(topicTags.length > 0 || companyTags.length > 0) && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {topicTags.map((tag, idx) => (
                <span
                  key={`topic-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/60"
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  {tag}
                </span>
              ))}
              {companyTags.map((tag, idx) => (
                <span
                  key={`comp-${idx}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  <Building2 className="w-2.5 h-2.5 opacity-70" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* SECTION 1: Problem Statement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Problem Statement
              </h4>

              {problem.problem_link && (
                <Button asChild size="sm" variant="outline" className="h-7 text-xs font-semibold gap-1.5">
                  <a href={problem.problem_link} target="_blank" rel="noopener noreferrer">
                    Solve on {config.name} <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>

            {problem.problem_description && problem.problem_description.trim().length > 0 ? (
              <div
                className="contest-html-content prose dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans bg-card/60 p-4 sm:p-5 rounded-xl border border-border/60 shadow-2xs"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(problem.problem_description) }}
              />
            ) : (
              <div className="p-8 text-center rounded-xl bg-muted/20 border border-border/60 text-xs text-muted-foreground space-y-2">
                <p>No formatted statement stored for this problem.</p>
                {problem.problem_link && (
                  <a
                    href={problem.problem_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                  >
                    Read full statement on {config.name} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: Solutions & Editorials (Stacked Below Problem Statement) */}
          <div id="drawer-solutions-section" className="pt-4 border-t border-border/80 space-y-4 scroll-mt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Solutions &amp; Editorials
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Video explanations, written intuition, and full source code.
                </p>
              </div>

              <Button asChild size="sm" variant="ghost" className="h-7 text-xs font-semibold gap-1 text-primary hover:bg-primary/10">
                <Link href={fullPageRoute}>
                  Open Full Page <Maximize2 className="w-3 h-3" />
                </Link>
              </Button>
            </div>

            {hasSolutions ? (
              <div className="space-y-4">
                {/* Solution Tabs Filter */}
                <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-lg border border-border/60 w-fit">
                  {problem.video_editorial && (
                    <button
                      type="button"
                      onClick={() => setActiveSolutionTab("video")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        activeSolutionTab === "video"
                          ? "bg-background text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                      Video Editorial
                    </button>
                  )}

                  {problem.editorial && (
                    <button
                      type="button"
                      onClick={() => setActiveSolutionTab("editorial")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        activeSolutionTab === "editorial"
                          ? "bg-background text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      Written Approach
                    </button>
                  )}

                  {problem.solution_link && (
                    <button
                      type="button"
                      onClick={() => setActiveSolutionTab("solution")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                        activeSolutionTab === "solution"
                          ? "bg-background text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                      Solution Code
                    </button>
                  )}
                </div>

                {/* TAB CONTENT: Video Editorial */}
                {activeSolutionTab === "video" && problem.video_editorial && (
                  <div className="space-y-2">
                    <div className="rounded-xl overflow-hidden shadow-lg border border-border/60">
                      <ProtectedVideoPlayer
                        embedUrl={problem.video_editorial}
                        title={`${problem.problem_name} - Video Editorial`}
                        className="w-full aspect-video"
                      />
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Written Approach / Editorial */}
                {activeSolutionTab === "editorial" && problem.editorial && (
                  <div className="space-y-3">
                    {problem.editorial.trim().startsWith("http://") || problem.editorial.trim().startsWith("https://") ? (
                      <div className="p-5 rounded-xl bg-card/80 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h5 className="font-semibold text-sm text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Official Written Editorial
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Step-by-step mathematical proof, constraints, and algorithmic reasoning.
                          </p>
                        </div>
                        <Button asChild size="sm" className="text-xs font-semibold gap-1.5 shrink-0">
                          <a href={problem.editorial.trim()} target="_blank" rel="noopener noreferrer">
                            View Written Editorial <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                      </div>
                    ) : problem.editorial.includes("<") && problem.editorial.includes(">") ? (
                      <div
                        className="contest-html-content prose dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans bg-card/60 p-5 rounded-xl border border-border/60 shadow-2xs"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(problem.editorial) }}
                      />
                    ) : (
                      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans bg-card/60 p-5 rounded-xl border border-border/60 shadow-2xs">
                        {problem.editorial}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: Solution Link / Code */}
                {activeSolutionTab === "solution" && problem.solution_link && (
                  <div className="space-y-3">
                    {problem.solution_link.trim().startsWith("http://") || problem.solution_link.trim().startsWith("https://") ? (
                      <div className="p-5 rounded-xl bg-card border border-border/80 space-y-4 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                              <Code2 className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                              <h5 className="text-sm font-bold text-foreground">
                                Verified Code Submission
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                Accepted solution code available on official platform submission link.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={copyCode}
                              className="h-8 text-xs font-semibold gap-1.5"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copied ? "Copied Link!" : "Copy Link"}</span>
                            </Button>

                            <Button
                              asChild
                              size="sm"
                              className="h-8 text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                            >
                              <a href={problem.solution_link.trim()} target="_blank" rel="noopener noreferrer">
                                <span>Open Solution</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                          </div>
                        </div>

                        {/* URL preview pill */}
                        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 text-[11px] font-mono text-muted-foreground break-all flex items-center gap-2">
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60 text-emerald-500" />
                          <a
                            href={problem.solution_link.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-foreground truncate"
                          >
                            {problem.solution_link.trim()}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Code2 className="w-4 h-4 text-emerald-500" />
                            C++ Solution Implementation
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={copyCode}
                            className="h-7 text-xs font-semibold gap-1.5"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied!" : "Copy Code"}
                          </Button>
                        </div>

                        <div className="rounded-xl overflow-hidden border border-border/80 shadow-md font-mono text-xs">
                          <CodeMirror
                            value={problem.solution_link}
                            theme={vscodeDark}
                            extensions={[cpp()]}
                            editable={false}
                            basicSetup={{
                              lineNumbers: true,
                              foldGutter: true,
                              highlightActiveLine: false,
                            }}
                            className="max-h-[380px] overflow-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-border/60">
                Editorial and solution code are being added for this round.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 border-t bg-muted/20 flex items-center justify-between gap-3 shrink-0">
          {problem.problem_link ? (
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold gap-1.5">
              <a href={problem.problem_link} target="_blank" rel="noopener noreferrer">
                Solve on {config.name} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          ) : <div />}

          <Button asChild size="sm" className="text-xs font-semibold gap-1.5 bg-primary text-primary-foreground">
            <Link href={fullPageRoute}>
              Open Standalone Page <Maximize2 className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
