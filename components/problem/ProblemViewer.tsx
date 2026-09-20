"use client";

import React, { useState } from "react";
import { HelpCircle, Code2, Video, FileText, ChevronDown, Check, Bookmark, RotateCcw, CheckCircle2, CircleDot, Lock } from "lucide-react";
import ProblemStatement, { ProblemStatementData } from "./ProblemStatement";
import ProblemSolutions, { ProblemSolutionsData } from "./ProblemSolutions";
import ProblemEditorial from "./ProblemEditorial";
import ProblemNotes from "./ProblemNotes";
import { UserNote } from "@/lib/user-states";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";

type TabId = "statement" | "solutions" | "editorial" | "notes";

const TABS: { id: TabId; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: "statement",  label: "Problem",   shortLabel: "Problem",  icon: <HelpCircle size={14} /> },
  { id: "solutions",  label: "Solution",  shortLabel: "Solution", icon: <Code2 size={14} /> },
  { id: "editorial",  label: "Editorial", shortLabel: "Editorial",icon: <Video size={14} /> },
  { id: "notes",      label: "Notes",     shortLabel: "Notes",    icon: <FileText size={14} /> },
];

interface ProblemViewerProps {
  slug: string;
  problemData: any;
  currentStatus: "pending" | "done" | "revision";
  isBookmarked: boolean;
  notes: UserNote[];
  isLoggedIn: boolean;
  onUpdateStatus: (status: "pending" | "done" | "revision") => Promise<void>;
  onToggleBookmark: () => Promise<void>;
  onSaveNotes: (notes: UserNote[]) => Promise<void>;
  playlistTrigger?: React.ReactNode;
  sheetTitle?: string;
  topicTitle?: string;
}

export const ProblemViewer: React.FC<ProblemViewerProps> = ({
  slug,
  problemData,
  currentStatus,
  isBookmarked,
  notes,
  isLoggedIn,
  onUpdateStatus,
  onToggleBookmark,
  onSaveNotes,
  playlistTrigger,
  sheetTitle,
  topicTitle,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("statement");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    title?: string;
    description?: string;
    featureName?: string;
  }>({
    title: "Sign In to CrackDSA",
    description: "Access verified solutions, time complexity analysis, and track your progress.",
    featureName: "Editorial & Solutions",
  });

  const openLoginFor = (feature: string, desc: string) => {
    setAuthModalConfig({
      title: `Sign In to Unlock ${feature}`,
      description: desc,
      featureName: feature,
    });
    setShowAuthModal(true);
  };

  // Format problem details
  const problem: ProblemStatementData = {
    title: problemData.title || "Untitled Problem",
    difficulty: problemData.difficulty || "Medium",
    platform: problemData.platform || "LeetCode",
    problemUrl: problemData.problem_url || problemData.problemUrl || "",
    description: problemData.description || "",
    companyTags: problemData.attributes?.company_tags || problemData.attributes?.companyTags || [],
    topicTags: problemData.attributes?.tags || problemData.attributes?.topicTags || [],
    hints: problemData.attributes?.hints || [],
    sheetTitle,
    topicTitle,
  };

  // Format solutions
  const solutions: ProblemSolutionsData = {
    cpp: {
      code: problemData.solutions?.cpp?.code || (typeof problemData.solutions?.cpp === "string" ? problemData.solutions.cpp : "") || "// C++ Solution is not provided",
      timeComplexity: problemData.solutions?.cpp?.time_complexity || problemData.solutions?.cpp?.timeComplexity || "",
      spaceComplexity: problemData.solutions?.cpp?.space_complexity || problemData.solutions?.cpp?.spaceComplexity || "",
      explanation: problemData.solutions?.cpp?.explanation || "",
    },
    python: {
      code: problemData.solutions?.python?.code || (typeof problemData.solutions?.python === "string" ? problemData.solutions.python : "") || "# Python Solution is not provided",
      timeComplexity: problemData.solutions?.python?.time_complexity || problemData.solutions?.python?.timeComplexity || "",
      spaceComplexity: problemData.solutions?.python?.space_complexity || problemData.solutions?.python?.spaceComplexity || "",
      explanation: problemData.solutions?.python?.explanation || "",
    },
    java: {
      code: problemData.solutions?.java?.code || (typeof problemData.solutions?.java === "string" ? problemData.solutions.java : "") || "// Java Solution is not provided",
      timeComplexity: problemData.solutions?.java?.time_complexity || problemData.solutions?.java?.timeComplexity || "",
      spaceComplexity: problemData.solutions?.java?.space_complexity || problemData.solutions?.java?.spaceComplexity || "",
      explanation: problemData.solutions?.java?.explanation || "",
    },
    javascript: {
      code: problemData.solutions?.javascript?.code || (typeof problemData.solutions?.javascript === "string" ? problemData.solutions.javascript : "") || "// JavaScript Solution is not provided",
      timeComplexity: problemData.solutions?.javascript?.time_complexity || problemData.solutions?.javascript?.timeComplexity || "",
      spaceComplexity: problemData.solutions?.javascript?.space_complexity || problemData.solutions?.javascript?.spaceComplexity || "",
      explanation: problemData.solutions?.javascript?.explanation || "",
    },
  };

  return (
    <div className="w-full flex flex-col select-none">
      {/* ── Sticky Tab Bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 md:px-8 pt-4 pb-3">
        {/* Tabs + Actions row */}
        <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          {/* Tab triggers */}
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isLockedTab = !isLoggedIn && tab.id !== "statement";
              return (
                <button
                  key={tab.id}
                  id={`problem-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold
                    rounded-xl border transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${isActive
                      ? "border-primary-500/40 text-primary-600 dark:text-primary-400 bg-primary-50/80 dark:bg-primary-500/10 shadow-xs"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                    }
                  `}
                >
                  <span className={isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  {isLockedTab && (
                    <Lock size={11} className="text-amber-500/80 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress Controls + Playlist Trigger */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {playlistTrigger}

            {/* Status Dropdown */}
            {!isLoggedIn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openLoginFor(
                    "Progress Tracking",
                    "Sign in with Google to mark problems as Solved, track revision backlog, and sync your DSA streak."
                  )
                }
                title="Log in to track progress"
                className="gap-1.5 text-xs font-bold rounded-xl h-9 text-muted-foreground hover:text-foreground"
              >
                <CircleDot size={13} />
                <span>Pending</span>
                <Lock size={11} className="text-amber-500/80 ml-0.5" />
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    title="Update status"
                    className={`gap-1.5 text-xs font-bold rounded-xl h-9 ${
                      currentStatus === "done"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                        : currentStatus === "revision"
                        ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {currentStatus === "done" && <CheckCircle2 size={13} />}
                    {currentStatus === "revision" && <RotateCcw size={13} />}
                    {currentStatus === "pending" && <CircleDot size={13} />}
                    <span>{currentStatus === "done" ? "Solved" : currentStatus === "revision" ? "Revise" : "Pending"}</span>
                    <ChevronDown size={12} className="opacity-70 ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem onClick={() => onUpdateStatus("pending")} className="gap-2 text-xs font-medium cursor-pointer">
                    <CircleDot size={14} className="text-muted-foreground" />
                    <span>Pending</span>
                    {currentStatus === "pending" && <Check size={14} className="ml-auto text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus("revision")} className="gap-2 text-xs font-medium cursor-pointer text-amber-600 dark:text-amber-400">
                    <RotateCcw size={14} className="text-amber-500" />
                    <span>Revise</span>
                    {currentStatus === "revision" && <Check size={14} className="ml-auto text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdateStatus("done")} className="gap-2 text-xs font-medium cursor-pointer text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>Solved</span>
                    {currentStatus === "done" && <Check size={14} className="ml-auto text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Bookmark Button */}
            <Button
              variant={isBookmarked ? "secondary" : "outline"}
              size="sm"
              onClick={
                !isLoggedIn
                  ? () =>
                      openLoginFor(
                        "Bookmarks",
                        "Sign in with Google to bookmark challenging problems and access them instantly from your dashboard."
                      )
                  : onToggleBookmark
              }
              title={!isLoggedIn ? "Log in to bookmark" : isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
              className={`rounded-xl h-9 w-9 p-0 flex items-center justify-center ${
                isBookmarked ? "text-amber-500 border-amber-500/40 bg-amber-500/10" : ""
              }`}
            >
              <Bookmark size={14} className={isBookmarked ? "fill-amber-500 text-amber-500" : ""} />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        {activeTab === "statement" && (
          <ProblemStatement problem={problem} slug={slug} />
        )}
        {activeTab === "solutions" && (
          !isLoggedIn || problemData?.is_locked ? (
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-card to-card p-6 sm:p-10 text-center space-y-5 max-w-xl mx-auto my-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-md shadow-amber-500/10">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Verified Solutions are Locked</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Sign in with Google to unlock official multi-language implementations (C++, Java, Python, JavaScript) with asymptotic time & space complexity analysis.
                </p>
              </div>
              <Button
                onClick={() =>
                  openLoginFor(
                    "Verified Solutions",
                    "Access verified editorial code in C++, Python, Java & JS, plus complexity breakdowns."
                  )
                }
                className="rounded-xl font-bold text-xs sm:text-sm h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In to Unlock Solutions</span>
              </Button>
            </div>
          ) : (
            <ProblemSolutions solutions={solutions} />
          )
        )}
        {activeTab === "editorial" && (
          !isLoggedIn ? (
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-500/10 via-card to-card p-6 sm:p-10 text-center space-y-5 max-w-xl mx-auto my-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-md shadow-blue-500/10">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Video Editorial & Walkthrough Locked</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Video masterclasses and detailed whiteboard walkthroughs are part of CrackDSA premium content. Sign in to watch step-by-step problem intuitions.
                </p>
              </div>
              <Button
                onClick={() =>
                  openLoginFor(
                    "Video Editorials",
                    "Watch comprehensive video explanations and whiteboard breakdowns."
                  )
                }
                className="rounded-xl font-bold text-xs sm:text-sm h-10 px-6 bg-blue-600 text-white hover:bg-blue-700 shadow-md gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Sign In to Watch Editorial</span>
              </Button>
            </div>
          ) : (
            <ProblemEditorial
              videoIds={problemData?.resources?.video_lectures}
              articles={problemData?.resources?.related_articles}
            />
          )
        )}
        {activeTab === "notes" && (
          <ProblemNotes
            itemId={problemData.id}
            notes={notes}
            isLoggedIn={isLoggedIn}
            onSaveNotes={onSaveNotes}
          />
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authModalConfig.title}
        description={authModalConfig.description}
        featureName={authModalConfig.featureName}
      />
    </div>
  );
};

export default ProblemViewer;
