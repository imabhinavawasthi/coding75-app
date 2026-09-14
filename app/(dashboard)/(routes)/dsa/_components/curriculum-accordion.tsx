"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  Layers,
  ChevronRight,
  ChevronDown,
  Check,
  ExternalLink,
  Maximize2,
  SidebarOpen,
  Loader2,
} from "lucide-react";
import { CourseSection, CourseSectionItem } from "@/types/course";
import { UserAssetState } from "@/lib/user-states";
import { ItemSlideDrawer } from "./item-slide-drawer";

interface CurriculumAccordionProps {
  sections: CourseSection[];
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
  enableDirectNavigation?: boolean;
  isLoadingStates?: boolean;
}

export const CurriculumAccordion: React.FC<CurriculumAccordionProps> = ({
  sections,
  userStates,
  onUpdateStatus,
  onToggleBookmark,
  topicSlug = "",
  isLoadingStates = false,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "video" | "problem">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "revision" | "done" | "bookmarked">("all");

  // Right slide-over drawer state
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<CourseSectionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getItemState = (item: CourseSectionItem): UserAssetState | undefined => {
    return (item.asset_id && userStates[item.asset_id]) || userStates[item.id];
  };

  // Flatten items for filtering
  const filteredSections = useMemo(() => {
    if (!sections || sections.length === 0) return [];
    const query = searchQuery.trim().toLowerCase();

    return sections
      .map((section) => {
        const filterItem = (item: CourseSectionItem) => {
          const matchesType = selectedType === "all" || item.type === selectedType;
          const matchesSearch =
            !query ||
            item.title.toLowerCase().includes(query) ||
            section.title.toLowerCase().includes(query) ||
            (item.duration_label && item.duration_label.toLowerCase().includes(query));

          const state = getItemState(item);
          const currentStatus = state?.status || "pending";
          const isBookmarked = Boolean(state?.is_bookmarked);

          let matchesStatus = true;
          if (statusFilter === "done") matchesStatus = currentStatus === "done";
          else if (statusFilter === "revision") matchesStatus = currentStatus === "revision";
          else if (statusFilter === "pending") matchesStatus = currentStatus === "pending";
          else if (statusFilter === "bookmarked") matchesStatus = isBookmarked;

          return matchesType && matchesSearch && matchesStatus;
        };

        const directItems = (section.items || []).filter(filterItem);

        const subsections = (section.subsections || [])
          .map((sub) => ({
            ...sub,
            items: (sub.items || []).filter(filterItem),
          }))
          .filter((sub) => sub.items.length > 0);

        const totalItemsCount =
          directItems.length + subsections.reduce((acc, sub) => acc + sub.items.length, 0);

        return {
          ...section,
          items: directItems,
          subsections,
          totalItemsCount,
        };
      })
      .filter((section) => section.totalItemsCount > 0);
  }, [sections, searchQuery, selectedType, statusFilter, userStates]);

  const handleRowClick = (item: CourseSectionItem) => {
    setSelectedDrawerItem(item);
    setIsDrawerOpen(true);
  };

  const handleDirectNavigate = (e: React.MouseEvent, item: CourseSectionItem) => {
    e.stopPropagation();
    const targetId = item.asset_id || item.id;
    const queryParam = topicSlug ? `?topic=${topicSlug}` : "";

    if (item.type === "video") {
      router.push(`/video/${encodeURIComponent(targetId)}${queryParam}`);
    } else if (item.type === "problem") {
      router.push(`/problem/${encodeURIComponent(targetId)}${queryParam}`);
    } else if (item.solution_url || item.problem_url) {
      window.open(item.solution_url || item.problem_url, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Multi-Criteria Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl border bg-card shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures & problems..."
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        {/* Filter Pills: Type & Status */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
          {/* Type filters */}
          <div className="flex items-center p-0.5 rounded-xl border bg-muted/30">
            {(["all", "video", "problem"] as const).map((t) => (
              <Button
                key={t}
                variant={selectedType === t ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType(t)}
                className="h-7 text-xs font-semibold px-2.5 rounded-lg capitalize"
              >
                {t === "all" ? "All" : t === "video" ? "Videos" : "Problems"}
              </Button>
            ))}
          </div>

          {/* Status filters */}
          <div className="flex items-center p-0.5 rounded-xl border bg-muted/30">
            {[
              { id: "all", label: "All Status" },
              { id: "pending", label: "Pending" },
              { id: "revision", label: "Revise" },
              { id: "done", label: "Done" },
              { id: "bookmarked", label: "★ Saved" },
            ].map((sf) => (
              <Button
                key={sf.id}
                variant={statusFilter === sf.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(sf.id as any)}
                className={`h-7 text-xs font-semibold px-2.5 rounded-lg ${
                  statusFilter === sf.id
                    ? sf.id === "done"
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : sf.id === "revision"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : sf.id === "bookmarked"
                      ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                      : "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sf.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion List */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-12 border rounded-2xl bg-card space-y-2">
          <Layers className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
          <p className="text-sm font-semibold text-foreground">No matching items found</p>
          <p className="text-xs text-muted-foreground">Try clearing your filters or search query.</p>
        </div>
      ) : (
        <Accordion
          type="multiple"
          defaultValue={filteredSections.map((s) => s.id)}
          className="space-y-3"
        >
          {filteredSections.map((section, secIdx) => {
            const allSecItems = [
              ...(section.items || []),
              ...(section.subsections || []).flatMap((sub) => sub.items || []),
            ];

            const secDone = allSecItems.filter((i) => {
              const state = getItemState(i);
              return state?.status === "done";
            }).length;

            const secRevise = allSecItems.filter((i) => {
              const state = getItemState(i);
              return state?.status === "revision";
            }).length;

            return (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border rounded-2xl px-4 bg-card shadow-xs hover:border-primary/40 transition-colors"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left pr-3 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-muted font-bold text-muted-foreground">
                          {secIdx + 1}
                        </span>
                        <h4 className="font-bold text-base text-foreground">{section.title}</h4>
                      </div>
                      {section.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{section.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {secDone}/{allSecItems.length} Done
                      </span>
                      {secRevise > 0 && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10">
                          {secRevise} Revise
                        </span>
                      )}
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {allSecItems.length} items
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pb-4 pt-1 space-y-3">
                  {/* Direct Items */}
                  {section.items && section.items.length > 0 && (
                    <div className="space-y-2">
                      {section.items.map((item) => renderItemRow(item))}
                    </div>
                  )}

                  {/* Nested Subsections */}
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-4 pt-2">
                      {section.subsections.map((sub) => (
                        <div key={sub.id} className="p-3.5 rounded-xl border bg-muted/25 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">
                              {sub.title}
                            </h5>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {sub.items.length} items
                            </span>
                          </div>
                          {sub.description && (
                            <p className="text-xs text-muted-foreground">{sub.description}</p>
                          )}
                          <div className="space-y-1.5 pt-1">
                            {sub.items.map((item) => renderItemRow(item))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Slide-over Drawer on the Right */}
      <ItemSlideDrawer
        item={selectedDrawerItem}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userStates={userStates}
        onUpdateStatus={onUpdateStatus}
        onToggleBookmark={onToggleBookmark}
        topicSlug={topicSlug}
      />
    </div>
  );

  function renderItemRow(item: CourseSectionItem) {
    const isVideo = item.type === "video";
    const isProblem = item.type === "problem";
    const isArticle = item.type === "article";

    const state = getItemState(item);
    const currentStatus: "pending" | "done" | "revision" = state?.status || "pending";
    const isBookmarked = Boolean(state?.is_bookmarked);
    const isDone = currentStatus === "done";
    const isRevise = currentStatus === "revision";

    const targetAssetId = item.asset_id || item.id;

    return (
      <div
        key={item.id}
        onClick={() => handleRowClick(item)}
        className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
          isDone
            ? "bg-emerald-500/[0.03] border-emerald-500/20 text-muted-foreground hover:bg-emerald-500/[0.06]"
            : isRevise
            ? "bg-amber-500/[0.03] border-amber-500/20 hover:bg-amber-500/[0.06]"
            : "bg-card hover:bg-muted/50 border-border hover:border-primary/40 hover:shadow-xs"
        }`}
      >
        {/* Left: Status Dropdown, Bookmark, Icon, Title */}
        <div className="flex items-center gap-2.5 min-w-0 pr-3">
          {/* Status Dropdown: Pending / Revise / Done */}
          {isLoadingStates ? (
            <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-muted/50 text-muted-foreground border border-border/40 animate-pulse shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground shrink-0" />
              <span>Loading...</span>
            </span>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-all shrink-0 ${
                    isDone
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                      : isRevise
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                  }`}
                  title="Change Status"
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  {isRevise && <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  {!isDone && !isRevise && <CircleDot className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                  <span className="capitalize">{currentStatus === "revision" ? "Revise" : currentStatus}</span>
                  <ChevronDown className="w-3 h-3 opacity-60 ml-0.5 shrink-0" />
                </button>
              </DropdownMenuTrigger>

            <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()} className="w-36 z-50">
              <DropdownMenuItem
                onClick={() => onUpdateStatus(targetAssetId, item.type, "pending")}
                className="flex items-center gap-2 text-xs cursor-pointer font-medium"
              >
                <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Pending</span>
                {currentStatus === "pending" && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(targetAssetId, item.type, "revision")}
                className="flex items-center gap-2 text-xs cursor-pointer font-medium text-amber-600 dark:text-amber-400"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                <span>Revise</span>
                {currentStatus === "revision" && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(targetAssetId, item.type, "done")}
                className="flex items-center gap-2 text-xs cursor-pointer font-medium text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Done</span>
                {currentStatus === "done" && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(targetAssetId, item.type);
            }}
            className={`p-1 rounded-md border transition-all shrink-0 ${
              isBookmarked
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                : "border-transparent hover:bg-muted text-muted-foreground/40 hover:text-muted-foreground"
            }`}
            title={isBookmarked ? "Saved in Bookmarks" : "Save / Bookmark"}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
          </button>

          {/* Type Icon */}
          <div className="shrink-0">
            {isVideo && <PlayCircle className="w-4 h-4 text-blue-500" />}
            {isProblem && <Code2 className="w-4 h-4 text-emerald-500" />}
            {isArticle && <FileText className="w-4 h-4 text-amber-500" />}
          </div>

          {/* Item Title */}
          <span
            className={`text-xs sm:text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors ${
              isDone ? "line-through opacity-75" : "text-foreground"
            }`}
          >
            {item.title}
          </span>
        </div>

        {/* Right Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          {item.is_free && (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] h-5 border-emerald-500/20">
              Free
            </Badge>
          )}

          {item.duration_label && (
            <span
              className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded border hidden sm:inline-block ${
                isProblem
                  ? item.duration_label.toLowerCase() === "hard"
                    ? "text-red-500 border-red-500/30 bg-red-500/5"
                    : item.duration_label.toLowerCase() === "medium"
                    ? "text-amber-500 border-amber-500/30 bg-amber-500/5"
                    : "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
                  : "text-muted-foreground border-border bg-muted/40"
              }`}
            >
              {item.duration_label}
            </span>
          )}

          {/* Slide Drawer Preview Indicator */}
          <span className="text-[11px] font-medium text-muted-foreground/60 group-hover:text-foreground hidden md:inline-flex items-center gap-1">
            <SidebarOpen size={12} />
            <span>Slide</span>
          </span>

          {/* Direct Full Page Jump Button */}
          <button
            type="button"
            onClick={(e) => handleDirectNavigate(e, item)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
            title={`Open dedicated ${isVideo ? "lecture" : "problem"} page`}
          >
            <span>{isVideo ? "Watch" : isProblem ? "Solve" : "Open"}</span>
            <Maximize2 size={11} />
          </button>
        </div>
      </div>
    );
  }
};
