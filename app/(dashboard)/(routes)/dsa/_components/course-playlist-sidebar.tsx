"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  Code2,
  FileText,
  ChevronDown,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Search,
  RotateCcw,
  Bookmark,
  ChevronRight,
  BookOpen,
  CircleDot,
  Check,
  Layers,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CourseSection, CourseSectionItem, CourseSubsection } from "@/types/course";
import { UserAssetState } from "@/lib/user-states";

interface CoursePlaylistSidebarProps {
  sections: CourseSection[];
  activeItemId: string;
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
  className?: string;
}

export const CoursePlaylistSidebar: React.FC<CoursePlaylistSidebarProps> = ({
  sections,
  activeItemId,
  userStates,
  onUpdateStatus,
  onToggleBookmark,
  topicSlug = "",
  className = "",
}) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Helper to get state for any item
  const getItemState = (item: CourseSectionItem): UserAssetState | undefined => {
    return (item.asset_id && userStates[item.asset_id]) || userStates[item.id];
  };

  // Auto-expand the section & subsection containing the active item
  useEffect(() => {
    if (!sections || sections.length === 0) return;

    sections.forEach((sec) => {
      const hasActiveDirect = sec.items?.some(
        (it) => it.id === activeItemId || it.asset_id === activeItemId || it.slug === activeItemId
      );

      let hasActiveSub = false;
      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          if (
            sub.items?.some(
              (it) => it.id === activeItemId || it.asset_id === activeItemId || it.slug === activeItemId
            )
          ) {
            hasActiveSub = true;
            setExpandedSubsections((prev) => ({ ...prev, [sub.id]: true }));
          }
        });
      }

      if (hasActiveDirect || hasActiveSub) {
        setExpandedSections((prev) => ({ ...prev, [sec.id]: true }));
      }
    });
  }, [sections, activeItemId]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleSubsection = (subId: string) => {
    setExpandedSubsections((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  // Flatten items for total & completed count calculations
  const allFlattenedItems = useMemo(() => {
    const list: CourseSectionItem[] = [];
    sections.forEach((sec) => {
      if (sec.items) list.push(...sec.items);
      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          if (sub.items) list.push(...sub.items);
        });
      }
    });
    return list;
  }, [sections]);

  const totalItemsCount = allFlattenedItems.length;
  const completedCount = allFlattenedItems.filter((item) => {
    const state = getItemState(item);
    return state?.status === "done";
  }).length;
  const progressPercent = totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0;

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase().trim();

    return sections
      .map((sec) => {
        const secMatch = sec.title.toLowerCase().includes(query);
        const filteredItems = (sec.items || []).filter((it) => it.title.toLowerCase().includes(query));

        const filteredSubs = (sec.subsections || [])
          .map((sub) => {
            const subMatch = sub.title.toLowerCase().includes(query);
            const subItems = (sub.items || []).filter((it) => it.title.toLowerCase().includes(query));
            if (subMatch || subItems.length > 0) {
              return {
                ...sub,
                items: subMatch && subItems.length === 0 ? sub.items : subItems,
              };
            }
            return null;
          })
          .filter(Boolean) as CourseSubsection[];

        if (secMatch || filteredItems.length > 0 || filteredSubs.length > 0) {
          return {
            ...sec,
            items: secMatch && filteredItems.length === 0 && filteredSubs.length === 0 ? sec.items : filteredItems,
            subsections: filteredSubs,
          };
        }
        return null;
      })
      .filter(Boolean) as CourseSection[];
  }, [sections, searchQuery]);

  const handleNavigateToItem = (item: CourseSectionItem) => {
    const targetId = item.asset_id || item.id;
    const q = topicSlug ? `?topic=${topicSlug}` : "";
    if (item.type === "video") {
      router.push(`/video/${encodeURIComponent(targetId)}${q}`);
    } else if (item.type === "problem") {
      router.push(`/problem/${encodeURIComponent(targetId)}${q}`);
    } else if (item.problem_url || item.solution_url) {
      window.open(item.problem_url || item.solution_url, "_blank");
    }
  };

  // SVG Progress Ring metrics
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className={`flex flex-col h-full rounded-2xl border bg-card shadow-xs overflow-hidden ${className}`}>
      {/* 1. Header Progress visualizer matching CrackDSA */}
      <div className="p-4 border-b bg-muted/20 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3.2"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r={radius}
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: hasMounted ? strokeDashoffset : circumference }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <span className="absolute text-[8px] font-black text-foreground">
                {progressPercent}%
              </span>
            </div>

            <div>
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider">
                Course Playlist
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
                {completedCount}/{totalItemsCount} completed
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-[10px] font-mono">
            {sections.length} Sections
          </Badge>
        </div>

        {/* Search in Playlist Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search playlist items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-background border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* 2. Scrollable Sections Accordion */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 max-h-[70vh]">
        {filteredSections.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            <p>No lessons found</p>
          </div>
        ) : (
          filteredSections.map((sec, secIdx) => {
            const isExpanded = Boolean(expandedSections[sec.id]);

            const secItems = [
              ...(sec.items || []),
              ...(sec.subsections || []).flatMap((sub) => sub.items || []),
            ];

            const secCompleted = secItems.filter((i) => {
              const state = getItemState(i);
              return state?.status === "done";
            }).length;

            return (
              <div
                key={sec.id}
                className="rounded-xl border border-border/80 overflow-hidden bg-card/60 transition-colors"
              >
                {/* Section Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className="space-y-0.5 pr-2 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {secIdx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {sec.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {secCompleted}/{secItems.length}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-muted-foreground transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Section Items Body */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden border-t border-border/40"
                    >
                      {/* Direct Section Items */}
                      {sec.items && sec.items.length > 0 && (
                        <div className="divide-y divide-border/30">
                          {sec.items.map((item, idx) => renderPlaylistRow(item, idx))}
                        </div>
                      )}

                      {/* Nested Subsections */}
                      {sec.subsections && sec.subsections.length > 0 && (
                        <div className="p-1.5 space-y-1.5 bg-muted/15">
                          {sec.subsections.map((sub) => {
                            const isSubExpanded = Boolean(expandedSubsections[sub.id]);
                            const subCompleted = (sub.items || []).filter((i) => {
                              const state = getItemState(i);
                              return state?.status === "done";
                            }).length;

                            return (
                              <div
                                key={sub.id}
                                className="rounded-lg border border-border/60 bg-background/80 overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleSubsection(sub.id)}
                                  className="w-full flex items-center justify-between p-2 hover:bg-muted/30 text-left text-xs"
                                >
                                  <span className="text-[11px] font-bold text-foreground truncate">
                                    {sub.title}
                                  </span>
                                  <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
                                    <span>
                                      {subCompleted}/{(sub.items || []).length}
                                    </span>
                                    <ChevronDown
                                      size={12}
                                      className={`transition-transform duration-200 ${
                                        isSubExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </div>
                                </button>

                                {isSubExpanded && (
                                  <div className="divide-y divide-border/30 border-t border-border/40">
                                    {sub.items.map((item, idx) => renderPlaylistRow(item, idx))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  function renderPlaylistRow(item: CourseSectionItem, index: number) {
    const isActive =
      item.id === activeItemId ||
      item.asset_id === activeItemId ||
      item.slug === activeItemId;

    const state = getItemState(item);
    const currentStatus: "pending" | "done" | "revision" = state?.status || "pending";
    const isCompleted = currentStatus === "done";
    const isRevision = currentStatus === "revision";
    const isBookmarked = Boolean(state?.is_bookmarked);

    const isVideo = item.type === "video";
    const isProblem = item.type === "problem";
    const targetAssetId = item.asset_id || item.id;

    return (
      <div
        key={item.id}
        onClick={() => handleNavigateToItem(item)}
        className={`group flex items-start gap-2.5 p-2.5 cursor-pointer transition-all ${
          isActive
            ? "bg-primary/10 border-l-3 border-primary pl-2 shadow-xs"
            : isCompleted
            ? "hover:bg-muted/40 opacity-80"
            : "hover:bg-muted/40"
        }`}
      >
        {/* Status Dropdown Trigger Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className={`shrink-0 mt-0.5 p-0.5 rounded transition-transform hover:scale-110 ${
                isCompleted
                  ? "text-emerald-500"
                  : isRevision
                  ? "text-amber-500"
                  : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
              title={`Status: ${currentStatus}`}
            >
              {isCompleted ? (
                <CheckCircle2 size={15} className="fill-emerald-500/20 stroke-[2.5]" />
              ) : isRevision ? (
                <RotateCcw size={15} className="stroke-[2.5]" />
              ) : (
                <Circle size={15} />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-32 z-50">
            <DropdownMenuItem
              onClick={() => onUpdateStatus(targetAssetId, item.type, "pending")}
              className="gap-2 text-[11px] cursor-pointer"
            >
              <CircleDot size={13} className="text-muted-foreground" />
              <span>Pending</span>
              {currentStatus === "pending" && <Check size={13} className="ml-auto text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateStatus(targetAssetId, item.type, "revision")}
              className="gap-2 text-[11px] cursor-pointer text-amber-600 dark:text-amber-400"
            >
              <RotateCcw size={13} className="text-amber-500" />
              <span>Revise</span>
              {currentStatus === "revision" && <Check size={13} className="ml-auto text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onUpdateStatus(targetAssetId, item.type, "done")}
              className="gap-2 text-[11px] cursor-pointer text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>Done</span>
              {currentStatus === "done" && <Check size={13} className="ml-auto text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Item Content: Title, Meta badges */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <span
            className={`text-xs block line-clamp-2 leading-snug transition-colors ${
              isActive
                ? "text-primary font-bold"
                : isCompleted
                ? "text-muted-foreground line-through"
                : "text-foreground font-medium group-hover:text-primary"
            }`}
          >
            {item.title}
          </span>

          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            {isVideo && <PlayCircle size={11} className="text-blue-500 shrink-0" />}
            {isProblem && <Code2 size={11} className="text-emerald-500 shrink-0" />}
            <span className="uppercase font-mono text-[9px] font-bold">{item.type}</span>
            {item.duration_label && (
              <>
                <span>•</span>
                <span className="font-mono text-[9px]">{item.duration_label}</span>
              </>
            )}
            {isBookmarked && (
              <>
                <span>•</span>
                <Bookmark size={9} className="fill-amber-500 text-amber-500 shrink-0" />
              </>
            )}
          </div>
        </div>

        {/* Bookmark Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(targetAssetId, item.type);
          }}
          className={`shrink-0 mt-0.5 p-1 rounded hover:bg-muted/60 transition-colors ${
            isBookmarked ? "text-amber-500" : "text-muted-foreground/30 hover:text-muted-foreground"
          }`}
          title={isBookmarked ? "Bookmarked" : "Bookmark"}
        >
          <Bookmark size={12} className={isBookmarked ? "fill-amber-500 text-amber-500" : ""} />
        </button>
      </div>
    );
  }
};
