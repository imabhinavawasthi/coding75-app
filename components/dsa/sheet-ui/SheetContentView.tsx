"use client";

import React, { useMemo, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { DSASheet, Problem, Topic, DetailedProblem } from "@/types/dsa-sheet";
import { TopicSection } from "./TopicSection";
import { SheetHeaderCard } from "./SheetHeaderCard";
import { SheetProgressSection } from "./SheetProgressSection";
import { SheetToolbar } from "./SheetToolbar";
import { motion } from "framer-motion";
import { generateSheetPDF } from "@/lib/pdfGenerator";
import { saveUserAssetState } from "@/lib/user-states";

interface SheetContentViewProps {
  sheet: DSASheet;
  sheetProblems?: DetailedProblem[];
  userProblemStates?: Record<string, string>;   // keyed by UUID
  bookmarkedProblemIds?: string[];               // array of UUIDs
  isLoggedIn?: boolean;
}

export const SheetContentView: React.FC<SheetContentViewProps> = ({
  sheet,
  sheetProblems = [],
  userProblemStates: initialProblemStates = {},
  bookmarkedProblemIds: initialBookmarks = [],
  isLoggedIn = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandAll, setExpandAll] = useState(false);
  const [expandToggleKey, setExpandToggleKey] = useState(0);

  // Local optimistic state — keyed by UUID
  const [localProblemStates, setLocalProblemStates] = useState(initialProblemStates);
  const [localBookmarks, setLocalBookmarks] = useState(initialBookmarks);

  // Sync when parent data arrives (after network fetch)
  React.useEffect(() => {
    setLocalProblemStates(initialProblemStates);
  }, [initialProblemStates]);

  React.useEffect(() => {
    setLocalBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  // Build slug → UUID map from sheetProblems for progress calculation
  const slugToId = useMemo(() => {
    const map: Record<string, string> = {};
    sheetProblems.forEach(p => { if (p.slug && p.id) map[p.slug] = p.id; });
    return map;
  }, [sheetProblems]);

  const onToggleSolved = useCallback(async (id: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const currentStatus = localProblemStates[id];
    const newStatus = currentStatus === "done" ? "pending" : "done";

    // Optimistic UI update
    setLocalProblemStates(prev => ({ ...prev, [id]: newStatus }));

    // Persist via /api/user/states (proper API route)
    try {
      await saveUserAssetState({
        asset_id: id,
        asset_type: "problem",
        status: newStatus as "pending" | "done" | "revision",
      });
    } catch (err) {
      console.error("Failed to save status:", err);
      // Revert on error
      setLocalProblemStates(prev => ({ ...prev, [id]: currentStatus }));
    }
  }, [isLoggedIn, localProblemStates]);

  const onToggleBookmark = useCallback(async (id: string, slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return;

    const isBookmarked = localBookmarks.includes(id);
    const newBookmarks = isBookmarked
      ? localBookmarks.filter(b => b !== id)
      : [...localBookmarks, id];

    // Optimistic UI update
    setLocalBookmarks(newBookmarks);

    // Persist via /api/user/states
    try {
      await saveUserAssetState({
        asset_id: id,
        asset_type: "problem",
        is_bookmarked: !isBookmarked,
      });
    } catch (err) {
      console.error("Failed to save bookmark:", err);
      // Revert on error
      setLocalBookmarks(localBookmarks);
    }
  }, [isLoggedIn, localBookmarks]);

  const topics = useMemo(() => sheet.sheet_json?.topics || [], [sheet.sheet_json]);

  // Calculate Progress and Next Problem using UUID-keyed states
  const progressStats = useMemo(() => {
    let totalProblems = 0;
    let solvedCount = 0;
    let firstPendingProblem: any = null;
    let firstPendingTopicIndex = 0;
    let foundPending = false;

    topics.forEach((topic, tIndex) => {
      topic.steps.forEach((step) => {
        step.problems.forEach((problem) => {
          totalProblems++;
          // Look up status by UUID (via slug→UUID map)
          const uuid = slugToId[problem.problem_id];
          const status = uuid ? localProblemStates[uuid] : undefined;
          if (status === "done") {
            solvedCount++;
          } else if (!foundPending) {
            firstPendingProblem = problem;
            firstPendingTopicIndex = tIndex;
            foundPending = true;
          }
        });
      });
    });

    return { totalProblems, solvedCount, firstPendingProblem, firstPendingTopicIndex };
  }, [topics, localProblemStates, slugToId]);

  const { totalProblems, solvedCount, firstPendingProblem, firstPendingTopicIndex } = progressStats;
  const progressPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Next problem detailed info
  const nextProblemDetailed = useMemo(() => {
    if (!firstPendingProblem) return null;
    return sheetProblems.find(p => p.slug === firstPendingProblem.problem_id) || null;
  }, [firstPendingProblem, sheetProblems]);

  // Filter topics by search
  const filteredTopics: Topic[] = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics
      .map((topic) => {
        const matchedSteps = topic.steps
          .map((step) => {
            const matchedProblems = step.problems.filter((p) => {
              const title =
                p.title ||
                p.problem_id
                  .split(/[-_]/)
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
              return (
                title.toLowerCase().includes(q) ||
                p.problem_id.toLowerCase().includes(q)
              );
            });
            if (
              step.title.toLowerCase().includes(q) ||
              step.pattern_id.toLowerCase().includes(q)
            ) {
              return step;
            }
            if (matchedProblems.length > 0) {
              return { ...step, problems: matchedProblems };
            }
            return null;
          })
          .filter(Boolean) as typeof topic.steps;

        if (topic.title.toLowerCase().includes(q)) return topic;
        if (matchedSteps.length > 0) return { ...topic, steps: matchedSteps };
        return null;
      })
      .filter(Boolean) as Topic[];
  }, [topics, searchQuery]);

  const handleExpandAll = useCallback(() => {
    setExpandAll((prev) => !prev);
    setExpandToggleKey((prev) => prev + 1);
  }, []);

  const handleDownloadPDF = useCallback(() => {
    generateSheetPDF(sheet, sheetProblems);
  }, [sheet, sheetProblems]);

  return (
    <div className="w-full pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <SheetHeaderCard
          sheet={sheet}
          totalProblems={totalProblems}
          totalTopics={topics.length}
        >
          <SheetProgressSection
            totalProblems={totalProblems}
            solvedCount={solvedCount}
            progressPercentage={progressPercentage}
            firstPendingProblem={firstPendingProblem}
            nextProblemDetailed={nextProblemDetailed}
            sheetId={sheet.id}
            topicTitle={topics[firstPendingTopicIndex]?.title}
          />
        </SheetHeaderCard>
      </motion.div>

      <SheetToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandAll={expandAll}
        handleExpandAll={handleExpandAll}
        filteredTopicsLength={(filteredTopics || []).length}
        onDownloadPDF={handleDownloadPDF}
      />

      <div className="flex flex-col gap-3">
        {(filteredTopics || []).map((topic, index) => (
          <TopicSection
            key={topic.id}
            topic={topic}
            index={index}
            forceExpand={expandAll}
            defaultExpanded={index === firstPendingTopicIndex}
            expandToggleKey={expandToggleKey}
            isSearching={!!searchQuery}
            userProblemStates={localProblemStates}
            slugToId={slugToId}
            sheetProblems={sheetProblems}
            bookmarkedProblemIds={localBookmarks}
            isLoggedIn={isLoggedIn}
            onToggleSolved={onToggleSolved}
            onToggleBookmark={onToggleBookmark}
            sheetId={sheet.id}
          />
        ))}
      </div>

      {filteredTopics.length === 0 && !searchQuery && (
        <div className="text-center py-16">
          <BookOpen
            size={48}
            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No topics available
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This sheet doesn&apos;t have any topics yet.
          </p>
        </div>
      )}
    </div>
  );
};
