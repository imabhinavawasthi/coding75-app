"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Play,
  Clock,
  BookOpen,
  Code2,
  PlayCircle,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  Bookmark,
  Maximize2,
  Sparkles,
  Layers,
  Lock,
} from "lucide-react";
import { CourseSubsection, CourseSectionItem } from "@/types/course";
import { UserAssetState } from "@/lib/user-states";
import { TopicIcon } from "@/components/common/TopicIcon";
import { ItemSlideDrawer } from "./item-slide-drawer";
import { useProStatus } from "@/hooks/use-pro-status";

export interface ChapterData {
  id: string;
  title: string;
  description?: string;
  items: CourseSectionItem[];
}

export interface TopicPhaseData {
  id: string;
  title: string;
  subtitle?: string;
  chapters: ChapterData[];
}

interface DSATopicRoadmapTimelineProps {
  topicTitle: string;
  topicSubtitle?: string;
  subsections: CourseSubsection[];
  rootItems?: CourseSectionItem[];
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

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
  Medium: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
  Hard: "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400",
};

const chapterColors = [
  {
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    ring: "ring-blue-500/20",
    progressBar: "bg-blue-600 dark:bg-blue-500",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  {
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    ring: "ring-emerald-500/20",
    progressBar: "bg-emerald-600 dark:bg-emerald-500",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  {
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    ring: "ring-purple-500/20",
    progressBar: "bg-purple-600 dark:bg-purple-500",
    iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  },
  {
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    ring: "ring-amber-500/20",
    progressBar: "bg-amber-600 dark:bg-amber-500",
    iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  {
    bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    ring: "ring-rose-500/20",
    progressBar: "bg-rose-600 dark:bg-rose-500",
    iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
  {
    bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    ring: "ring-cyan-500/20",
    progressBar: "bg-cyan-600 dark:bg-cyan-500",
    iconBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  },
];

const slideDown = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

/**
 * Single Item Row matching crackdsa UnifiedItemRow
 */
export function RoadmapItemRow({
  item,
  index,
  isCurrentActiveItem,
  itemState,
  onUpdateStatus,
  onToggleBookmark,
  onOpenDrawer,
}: {
  item: CourseSectionItem;
  index: number;
  isCurrentActiveItem: boolean;
  itemState?: UserAssetState;
  onUpdateStatus: (
    itemId: string,
    assetType: "video" | "problem" | "article",
    status: "pending" | "done" | "revision"
  ) => void;
  onToggleBookmark: (
    itemId: string,
    assetType: "video" | "problem" | "article"
  ) => void;
  onOpenDrawer: (item: CourseSectionItem) => void;
}) {
  const { isPro } = useProStatus();
  const currentStatus = itemState?.status || "pending";
  const isCompleted = currentStatus === "done";
  const isRevision = currentStatus === "revision";
  const isBookmarked = Boolean(itemState?.is_bookmarked);

  const isVideo = item.type === "video";
  const isFree = Boolean(item.is_free || (item as any).isFree);
  const isVideoLocked = isVideo && !isFree && !isPro;

  const assetId = item.asset_id || item.id;
  const assetType = (item.type === "video" || item.type === "article" ? item.type : "problem") as "video" | "problem" | "article";

  const renderTypeIcon = () => {
    switch (item.type) {
      case "video":
        return <PlayCircle size={15} className="text-red-500 shrink-0" />;
      case "article":
        return <BookOpen size={15} className="text-emerald-500 shrink-0" />;
      case "problem":
      default:
        return <Code2 size={15} className="text-blue-500 shrink-0" />;
    }
  };

  const getActionLabel = () => {
    switch (item.type) {
      case "video":
        return "Watch";
      case "article":
        return "Read";
      case "problem":
      default:
        return "Solve";
    }
  };

  const directHref =
    item.type === "problem"
      ? `/dsa/problem/${item.asset_id || item.id}`
      : item.type === "video"
      ? `/video/${item.asset_id || item.id}`
      : `/courses/dsa/learn?item=${item.id}`;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(assetId, assetType, isCompleted ? "pending" : "done");
  };

  const handleRevisionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStatus(assetId, assetType, isRevision ? "pending" : "revision");
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(assetId, assetType);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25, ease: "easeOut" }}
      className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 group border cursor-pointer ${
        isCompleted
          ? "bg-emerald-500/[0.04] border-emerald-500/20 dark:bg-emerald-500/[0.06]"
          : isRevision
          ? "bg-amber-500/[0.04] border-amber-500/25 dark:bg-amber-500/[0.06]"
          : isCurrentActiveItem
          ? "bg-blue-500/[0.04] border-blue-500/30 ring-1 ring-blue-500/20 dark:bg-blue-500/[0.08]"
          : "bg-card/70 hover:bg-card border-border/70 hover:border-blue-500/30"
      }`}
      onClick={() => onOpenDrawer(item)}
    >
      {/* Checkbox Status Indicator */}
      <button
        type="button"
        onClick={handleCheckboxClick}
        title={isCompleted ? "Mark as Pending" : "Mark as Done"}
        className="shrink-0 cursor-pointer focus:outline-none transition-transform hover:scale-110 p-0.5"
        aria-label={`Toggle completion for ${item.title}`}
      >
        {isCompleted ? (
          <CheckCircle2 size={19} className="text-emerald-500 fill-emerald-500/10" />
        ) : isRevision ? (
          <RotateCcw size={17} className="text-amber-500" />
        ) : isCurrentActiveItem ? (
          <div className="relative flex items-center justify-center">
            <Play size={16} className="text-blue-600 dark:text-blue-400 fill-blue-600/20" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </div>
        ) : (
          <div className="w-[18px] h-[18px] rounded-md border-2 border-muted-foreground/40 hover:border-emerald-500 transition-colors" />
        )}
      </button>

      {/* Type Identifier Icon */}
      <div className="shrink-0 select-none opacity-80 group-hover:opacity-100 transition-opacity">
        {renderTypeIcon()}
      </div>

      {/* Item Title */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs sm:text-sm font-medium truncate ${
            isCompleted
              ? "text-muted-foreground line-through decoration-emerald-500/50"
              : isRevision
              ? "text-amber-700 dark:text-amber-300 font-semibold"
              : isCurrentActiveItem
              ? "text-foreground font-bold"
              : "text-foreground/90 group-hover:text-foreground"
          }`}
        >
          {item.title}
        </p>
      </div>

      {/* Action Controls Group */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Revision Toggle Pill */}
        <button
          type="button"
          onClick={handleRevisionToggle}
          title={isRevision ? "Remove Revision Tag" : "Mark for Revision"}
          className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
            isRevision
              ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-2xs"
              : "bg-muted/70 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 border border-transparent"
          }`}
        >
          <RotateCcw size={10} />
          <span className="hidden xs:inline">{isRevision ? "Revision" : "Revise"}</span>
        </button>

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Problem"}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isBookmarked
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-muted-foreground/50 hover:text-foreground hover:bg-muted"
          }`}
        >
          <Bookmark size={13} className={isBookmarked ? "fill-current" : ""} />
        </button>

        {/* Free / Pro Badges */}
        {isVideo && isFree && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono tracking-wider">
            FREE
          </span>
        )}
        {isVideoLocked && (
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono tracking-wider hidden sm:inline-block">
            PRO
          </span>
        )}

        {/* Difficulty Badge */}
        {item.difficulty && difficultyColors[item.difficulty] && (
          <span
            className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block font-mono ${
              difficultyColors[item.difficulty]
            }`}
          >
            {item.difficulty}
          </span>
        )}

        {/* Duration / Time Estimate */}
        {item.duration_label &&
          item.duration_label !== "1:00:00" &&
          !item.duration_label.includes("1:00:00") && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono hidden md:flex">
              <Clock size={11} />
              {item.duration_label}
            </span>
          )}

        {/* Primary Action Button (Opens in Slide Drawer) */}
        {isVideoLocked ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDrawer(item);
            }}
            className="px-2.5 sm:px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-lg transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
            title="Locked - coding75 Pro Required"
          >
            <Lock size={12} className="text-amber-500" />
            <span>Locked</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDrawer(item);
            }}
            className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>{getActionLabel()}</span>
          </button>
        )}

        {/* Direct Link in New Tab / Dedicated Route */}
        {isVideoLocked ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDrawer(item);
            }}
            className="p-1 rounded-md text-amber-500/70 hover:text-amber-600 hover:bg-amber-500/10 transition-colors hidden sm:inline-flex cursor-pointer"
            title="Locked - coding75 Pro Required"
          >
            <Lock size={13} />
          </button>
        ) : (
          <Link
            href={directHref}
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors hidden sm:inline-flex"
            title="Open in full screen solver / player"
          >
            <ExternalLink size={13} />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Accordion Card for Chapter / Subsection
 */
export function ChapterAccordionCard({
  chapter,
  chapterIndex,
  firstActiveItemId,
  userStates,
  onUpdateStatus,
  onToggleBookmark,
  onOpenDrawer,
}: {
  chapter: ChapterData;
  chapterIndex: number;
  firstActiveItemId?: string;
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
  onOpenDrawer: (item: CourseSectionItem) => void;
}) {
  const color = chapterColors[chapterIndex % chapterColors.length];
  const items = chapter.items || [];

  const completedCount = items.filter((i) => {
    const key = i.asset_id || i.id;
    return userStates[key]?.status === "done";
  }).length;

  const isCompleted = items.length > 0 && completedCount === items.length;
  const [userToggled, setUserToggled] = useState(false);
  const [isOpen, setIsOpen] = useState(!isCompleted);

  // If a topic is completed, keep the accordion closed unless user explicitly toggled it open
  React.useEffect(() => {
    if (!userToggled) {
      setIsOpen(!isCompleted);
    }
  }, [isCompleted, userToggled]);

  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: chapterIndex * 0.06, duration: 0.35 }}
      className="rounded-2xl border border-border/80 bg-card/80 hover:border-blue-500/30 transition-all duration-300 overflow-hidden shadow-xs"
    >
      {/* Chapter Accordion Header */}
      <button
        type="button"
        onClick={() => {
          setUserToggled(true);
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 text-left cursor-pointer hover:bg-muted/40 transition-colors"
      >
        {/* Topic / Chapter Icon Box */}
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${color.bg}`}
        >
          <TopicIcon topicName={chapter.title} size={18} className="shrink-0" />
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              {chapter.title}
            </h3>
          </div>
          {chapter.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {chapter.description}
            </p>
          )}
        </div>

        {/* Count & Mini Progress Bar */}
        <div className="shrink-0 flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-muted-foreground hidden sm:block">
            {completedCount}/{items.length} items
          </span>

          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${color.progressBar}`}
            />
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 sm:px-4 sm:pb-4 space-y-1.5">
              <div className="border-t border-border/50 pt-2.5 space-y-1.5">
                {items.length > 0 ? (
                  items.map((item, itemIdx) => {
                    const key = item.asset_id || item.id;
                    const state = userStates[key];
                    return (
                      <RoadmapItemRow
                        key={item.id || itemIdx}
                        item={item}
                        index={itemIdx}
                        isCurrentActiveItem={item.id === firstActiveItemId}
                        itemState={state}
                        onUpdateStatus={onUpdateStatus}
                        onToggleBookmark={onToggleBookmark}
                        onOpenDrawer={onOpenDrawer}
                      />
                    );
                  })
                ) : (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    No items listed for this section yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Universal Unified Phase Roadmap Timeline Component for DSA Topics.
 * - Displays top "Continue where you left off" active learning card.
 * - Renders Phase 1 timeline node with vertical stem connector.
 * - Renders subsections as connected chapter cards along the timeline.
 * - Integrates ItemSlideDrawer for instant in-page problem solving & video playback.
 */
export function DSATopicRoadmapTimeline({
  topicTitle,
  topicSubtitle,
  subsections,
  rootItems,
  userStates,
  onUpdateStatus,
  onToggleBookmark,
  topicSlug = "",
}: DSATopicRoadmapTimelineProps) {
  // Slide-over drawer state
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<CourseSectionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Convert subsections into chapters strictly using backend data
  const chapters: ChapterData[] = subsections.map((sub, index) => ({
    id: sub.id || `chapter-${index + 1}`,
    title: sub.title,
    description: sub.description || undefined,
    items: sub.items || [],
  }));

  // Handle root items strictly without mock data
  if (rootItems && rootItems.length > 0) {
    chapters.unshift({
      id: "chapter-root-items",
      title: topicTitle,
      description: undefined,
      items: rootItems,
    });
  }

  // Flatten items to find active learning item & calculate dynamic counts
  const allItems: CourseSectionItem[] = chapters.flatMap((c) => c.items);
  const activeItem =
    allItems.find((i) => {
      const key = i.asset_id || i.id;
      return userStates[key]?.status !== "done";
    }) || allItems[0];

  const activeChapter = chapters.find((c) =>
    c.items.some((i) => i.id === activeItem?.id)
  );

  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => {
    const key = i.asset_id || i.id;
    return userStates[key]?.status === "done";
  }).length;
  const overallPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleOpenDrawer = (item: CourseSectionItem) => {
    setSelectedDrawerItem(item);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* ─── 1. Continue Where You Left Off Active Learning Banner ─── */}
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 via-card to-indigo-500/10 p-4 sm:p-6 shadow-md shadow-blue-500/5 relative overflow-hidden"
        >
          {/* Subtle backdrop ambient glow */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30 text-white"
              >
                {activeItem.type === "video" ? (
                  <Play size={20} className="fill-white translate-x-0.5" />
                ) : (
                  <BookOpen size={20} />
                )}
              </motion.div>

              <div>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">
                  Continue where you left off
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {activeItem.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-foreground/80">
                    {activeChapter?.title || topicTitle}
                  </span>
                  <span>•</span>
                  <span>
                    {activeItem.type === "problem"
                      ? `${activeItem.difficulty || "Medium"} Problem`
                      : activeItem.type === "video"
                      ? "Video Lecture"
                      : "Article"}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenDrawer(activeItem)}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ─── 2. Topic Rendered as Phase 1 Roadmap Timeline ─── */}
      <div className="relative">
        {/* Phase Timeline Connector Vertical Line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-blue-500/35 via-indigo-500/20 to-border/40 hidden lg:block"
        />

        {/* Phase 1 Header Node */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 18 }}
            className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20"
          >
            {completedItems > 0 && completedItems === totalItems ? (
              <CheckCircle2 size={22} className="text-white" />
            ) : (
              1
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-foreground">
                {topicTitle}
              </h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {completedItems}/{totalItems} items
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                {completedItems === totalItems ? "Completed" : "In Progress"}
              </span>
            </div>
            {topicSubtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {topicSubtitle}
              </p>
            )}
          </div>

          {/* Overall Phase Progress Bar */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <div className="w-28 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPercent}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
              />
            </div>
            <span className="text-xs font-mono font-bold text-foreground w-9 text-right">
              {overallPercent}%
            </span>
          </div>
        </div>

        {/* ─── 3. Subsections / Chapters as Connected Accordion Nodes ─── */}
        <div className="space-y-3.5 lg:ml-14">
          {chapters.map((chapter, index) => (
            <ChapterAccordionCard
              key={chapter.id || index}
              chapter={chapter}
              chapterIndex={index}
              firstActiveItemId={activeItem?.id}
              userStates={userStates}
              onUpdateStatus={onUpdateStatus}
              onToggleBookmark={onToggleBookmark}
              onOpenDrawer={handleOpenDrawer}
            />
          ))}
        </div>
      </div>

      {/* ─── 4. Interactive Slide Drawer for Problem & Video Solving ─── */}
      <ItemSlideDrawer
        item={selectedDrawerItem}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDrawerItem(null);
        }}
        userStates={userStates}
        onUpdateStatus={onUpdateStatus}
        onToggleBookmark={onToggleBookmark}
        topicSlug={topicSlug}
      />
    </div>
  );
}
