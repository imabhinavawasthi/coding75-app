"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  PlayCircle,
  Code2,
  Bookmark,
  CheckCircle2,
  RotateCcw,
  CircleDot,
  Copy,
  Check,
  Sparkles,
  FileText,
  Tag,
  Building2,
  Share2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { ProtectedVideoPlayer } from "@/app/(dashboard)/(routes)/dsa/_components/protected-video-player";
import { ContestPlatform, ContestEditorial } from "@/types/contest";
import { PLATFORMS, getDifficultyBadge, parseTags } from "@/lib/contests";
import { fetchUserAssetStates, saveUserAssetState, UserAssetState } from "@/lib/user-states";

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

interface ContestProblemDetailClientProps {
  problem: ContestEditorial;
  contestProblems: ContestEditorial[];
  platform: ContestPlatform;
  contestSlug: string;
  contestName: string;
  customBreadcrumbs?: { label: string; href?: string }[];
  customSiblingRoute?: (slug: string) => string;
  backHref?: string;
  badgeLabel?: string;
}

export function ContestProblemDetailClient({
  problem,
  contestProblems,
  platform,
  contestSlug,
  contestName,
  customBreadcrumbs,
  customSiblingRoute,
  backHref,
  badgeLabel,
}: ContestProblemDetailClientProps) {
  const config = PLATFORMS[platform] || PLATFORMS.leetcode;
  const logo = PLATFORM_LOGOS[platform] || PLATFORM_LOGOS.leetcode;
  const diffBadge = getDifficultyBadge(problem.difficulty, platform);
  const topicTags = parseTags(problem.topic_tags);
  const companyTags = parseTags(problem.company_tags);

  const [activeSolutionTab, setActiveSolutionTab] = useState<"video" | "editorial" | "solution">(
    problem.video_editorial ? "video" : problem.solution_link ? "solution" : "editorial"
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [userStates, setUserStates] = useState<Record<string, UserAssetState>>({});
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  useEffect(() => {
    setIsLoadingStates(true);
    fetchUserAssetStates()
      .then((states) => setUserStates(states || {}))
      .catch(() => {})
      .finally(() => setIsLoadingStates(false));
  }, []);

  const currentStatus = userStates[problem.id]?.status || "pending";
  const isBookmarked = Boolean(userStates[problem.id]?.is_bookmarked);

  // Sibling problem navigation
  const currentIndex = contestProblems.findIndex(
    (p) => p.slug_url === problem.slug_url || p.id === problem.id
  );
  const prevProblem = currentIndex > 0 ? contestProblems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex !== -1 && currentIndex < contestProblems.length - 1
      ? contestProblems[currentIndex + 1]
      : null;

  const getSiblingHref = (p: ContestEditorial) =>
    customSiblingRoute ? customSiblingRoute(p.slug_url) : `/contests/${platform}/${contestSlug}/${p.slug_url}`;

  const handleUpdateStatus = (status: "pending" | "done" | "revision") => {
    setUserStates((prev) => ({
      ...prev,
      [problem.id]: {
        ...prev[problem.id],
        status,
        updated_at: new Date().toISOString(),
      },
    }));

    saveUserAssetState({
      asset_id: problem.id,
      asset_type: "problem",
      status,
    }).catch(console.error);
  };

  const handleToggleBookmark = () => {
    const nextBookmark = !isBookmarked;
    setUserStates((prev) => ({
      ...prev,
      [problem.id]: {
        ...prev[problem.id],
        is_bookmarked: nextBookmark,
        updated_at: new Date().toISOString(),
      },
    }));

    saveUserAssetState({
      asset_id: problem.id,
      asset_type: "problem",
      is_bookmarked: nextBookmark,
    }).catch(console.error);
  };

  const handleCopyCode = () => {
    if (problem.solution_link) {
      navigator.clipboard.writeText(problem.solution_link);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const hasSolutions = Boolean(
    problem.video_editorial || problem.editorial || problem.solution_link
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          {customBreadcrumbs ? (
            customBreadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors font-medium">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-semibold truncate max-w-[220px]">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))
          ) : (
            <>
              <Link href="/contests" className="hover:text-foreground transition-colors">
                Contests
              </Link>
              <span>/</span>
              <Link href={`/contests/${platform}`} className="hover:text-foreground transition-colors capitalize">
                {config.name}
              </Link>
              <span>/</span>
              <Link
                href={`/contests/${platform}/${contestSlug}`}
                className="hover:text-foreground transition-colors font-medium max-w-[200px] sm:max-w-xs truncate"
              >
                {contestName}
              </Link>
              <span>/</span>
              <span className="text-foreground font-semibold truncate max-w-[220px]">
                {problem.problem_name}
              </span>
            </>
          )}
        </div>

        {/* Prev / Next Shortcuts */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {prevProblem && (
            <Button asChild variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1">
              <Link href={getSiblingHref(prevProblem)}>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </Link>
            </Button>
          )}

          {nextProblem && (
            <Button asChild variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1">
              <Link href={getSiblingHref(nextProblem)}>
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Main Problem Header Card */}
      <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card/95 to-muted/20 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 gap-1.5 bg-background shadow-2xs">
                <Image src={logo} alt={config.name} width={13} height={13} className="object-contain" />
                <span>{config.name}</span>
              </Badge>

              <Badge variant="outline" className={`text-[10px] font-bold px-2.5 py-0.5 ${diffBadge.colorClass}`}>
                {diffBadge.label}
              </Badge>

              <Link
                href={`/contests/${platform}/${contestSlug}`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {contestName}
              </Link>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
              {problem.problem_name}
            </h1>

            {/* Tags */}
            {(topicTags.length > 0 || companyTags.length > 0) && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {topicTags.map((tag, idx) => (
                  <span
                    key={`topic-${idx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/60"
                  >
                    <Tag className="w-3 h-3 opacity-60" />
                    {tag}
                  </span>
                ))}
                {companyTags.map((tag, idx) => (
                  <span
                    key={`comp-${idx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    <Building2 className="w-3 h-3 opacity-70" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Status Dropdown */}
            {isLoadingStates ? (
              <div className="flex items-center gap-1.5 h-9 px-3 text-xs font-medium rounded-md bg-muted/40 text-muted-foreground border border-border/50 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 px-3 text-xs font-semibold gap-1.5 ${
                      currentStatus === "done"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : currentStatus === "revision"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {currentStatus === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {currentStatus === "revision" && <RotateCcw className="w-4 h-4 text-amber-500" />}
                    {currentStatus === "pending" && <CircleDot className="w-4 h-4 text-muted-foreground" />}
                    <span className="capitalize">{currentStatus === "done" ? "Solved" : currentStatus}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus("pending")}
                    className="text-xs font-medium gap-2 cursor-pointer"
                  >
                    <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />
                    Pending
                    {currentStatus === "pending" && <Check className="ml-auto w-3 h-3 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus("revision")}
                    className="text-xs font-medium gap-2 text-amber-600 dark:text-amber-400 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                    Needs Revision
                    {currentStatus === "revision" && <Check className="ml-auto w-3 h-3 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus("done")}
                    className="text-xs font-medium gap-2 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Mark Solved
                    {currentStatus === "done" && <Check className="ml-auto w-3 h-3 text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* View Solutions Slide Down Button */}
            {hasSolutions && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  document.getElementById("solutions-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-9 px-3 text-xs font-semibold gap-1.5 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Solutions</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            )}

            {/* Bookmark Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleBookmark}
              className={`h-9 px-3 text-xs font-semibold gap-1.5 ${
                isBookmarked
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500" : ""}`} />
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </Button>

            {/* Share Link */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-9 px-3 text-xs font-semibold gap-1.5 bg-background hover:bg-muted"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </Button>

            {/* Primary CTA: Solve Problem on Platform */}
            {problem.problem_link && (
              <Button asChild size="sm" className="h-9 px-4 text-xs font-bold gap-1.5 bg-primary text-primary-foreground">
                <a href={problem.problem_link} target="_blank" rel="noopener noreferrer">
                  <span>Solve on {config.name}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: PROBLEM STATEMENT */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Problem Statement
            </h2>
            <p className="text-xs text-muted-foreground">
              Official algorithmic problem description and constraints.
            </p>
          </div>

          {problem.problem_link && (
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold gap-1.5">
              <a href={problem.problem_link} target="_blank" rel="noopener noreferrer">
                Open on {config.name} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </div>

        {problem.problem_description && problem.problem_description.trim().length > 0 ? (
          <div
            className="contest-html-content prose dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed font-sans bg-card/60 p-5 rounded-xl border border-border/60 shadow-2xs"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(problem.problem_description) }}
          />
        ) : (
          <div className="p-10 text-center rounded-xl bg-muted/20 border border-border/60 text-xs text-muted-foreground space-y-2">
            <p>No formatted statement stored for this problem.</p>
            {problem.problem_link && (
              <a
                href={problem.problem_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                Read full statement on {config.name} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: SOLUTIONS & EDITORIALS (STACKED BELOW STATEMENT) */}
      <div id="solutions-section" className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Solutions &amp; Walkthrough
            </h2>
            <p className="text-xs text-muted-foreground">
              Detailed video explanations, mathematical intuition, and clean C++ implementation code.
            </p>
          </div>

          {/* Solution Tabs Selector */}
          {hasSolutions && (
            <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border/60 w-fit">
              {problem.video_editorial && (
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab("video")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeSolutionTab === "video"
                      ? "bg-background text-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                  Video Walkthrough
                </button>
              )}

              {problem.editorial && (
                <button
                  type="button"
                  onClick={() => setActiveSolutionTab("editorial")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
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
          )}
        </div>

        {hasSolutions ? (
          <div className="space-y-6">
            {/* Video Editorial */}
            {activeSolutionTab === "video" && problem.video_editorial && (
              <div className="space-y-3">
                <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl border border-border/60">
                  <ProtectedVideoPlayer
                    embedUrl={problem.video_editorial}
                    title={`${problem.problem_name} - Video Editorial`}
                    className="w-full aspect-video"
                  />
                </div>
              </div>
            )}

            {/* Written Approach */}
            {activeSolutionTab === "editorial" && problem.editorial && (
              <div className="space-y-4">
                {problem.editorial.trim().startsWith("http://") || problem.editorial.trim().startsWith("https://") ? (
                  <div className="p-6 rounded-xl bg-card/80 border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-base text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Full Official Editorial
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Step-by-step mathematical reasoning, edge cases, and algorithmic analysis.
                      </p>
                    </div>
                    <Button asChild size="sm" className="text-xs font-semibold gap-1.5 shrink-0">
                      <a href={problem.editorial.trim()} target="_blank" rel="noopener noreferrer">
                        Open Editorial <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  </div>
                ) : problem.editorial.includes("<") && problem.editorial.includes(">") ? (
                  <div
                    className="contest-html-content prose dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed font-sans bg-card/60 p-6 rounded-xl border border-border/60 shadow-2xs"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(problem.editorial) }}
                  />
                ) : (
                  <div className="prose dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans bg-card/60 p-6 rounded-xl border border-border/60 shadow-2xs">
                    {problem.editorial}
                  </div>
                )}
              </div>
            )}

            {/* Solution Link / Code */}
            {activeSolutionTab === "solution" && problem.solution_link && (
              <div className="space-y-4">
                {problem.solution_link.trim().startsWith("http://") || problem.solution_link.trim().startsWith("https://") ? (
                  <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20 shadow-2xs">
                          <Code2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-base font-bold text-foreground">
                            Verified Solution Submission
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Accepted implementation code available on official platform submission link.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCopyCode}
                          className="h-9 px-3 text-xs font-semibold gap-1.5"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? "Copied Link!" : "Copy Link"}</span>
                        </Button>

                        <Button
                          asChild
                          size="sm"
                          className="h-9 px-4 text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          <a href={problem.solution_link.trim()} target="_blank" rel="noopener noreferrer">
                            <span>Open Solution</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* URL preview pill */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs font-mono text-muted-foreground break-all flex items-center gap-2.5">
                      <ExternalLink className="w-4 h-4 shrink-0 opacity-60 text-emerald-500" />
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-emerald-500" />
                        C++ Solution Implementation
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyCode}
                        className="h-8 text-xs font-semibold gap-1.5"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCode ? "Copied!" : "Copy Code"}
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
                        className="max-h-[500px] overflow-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-border/60">
            Written editorial and solution code are being added for this contest problem. Check back shortly!
          </div>
        )}
      </div>

      {/* Bottom Footer Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/60">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Link href={`/contests/${platform}/${contestSlug}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to {contestName}
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {prevProblem && (
            <Button asChild variant="outline" size="sm" className="text-xs font-semibold gap-1">
              <Link href={`/contests/${platform}/${contestSlug}/${prevProblem.slug_url}`}>
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous Problem
              </Link>
            </Button>
          )}

          {nextProblem && (
            <Button asChild variant="default" size="sm" className="text-xs font-semibold gap-1">
              <Link href={`/contests/${platform}/${contestSlug}/${nextProblem.slug_url}`}>
                Next Problem
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
