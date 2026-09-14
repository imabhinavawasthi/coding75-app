"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  Trophy,
  Layers,
  ChevronLeft,
  X,
  ExternalLink
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContestPlatform, ContestSummary, PlatformConfig } from "@/types/contest";
import { getDifficultyBadge } from "@/lib/contests";

type SortField = "date" | "name" | "problems";
type SortDirection = "asc" | "desc";

interface PlatformContestTableProps {
  platform: ContestPlatform;
  config: PlatformConfig;
  logo: StaticImageData;
  initialContests: ContestSummary[];
}

export function PlatformContestTable({
  platform,
  config,
  logo,
  initialContests,
}: PlatformContestTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // Default to desc for date and problems, asc for name
      setSortDirection(field === "name" ? "asc" : "desc");
    }
    setCurrentPage(1);
  };

  // Filter and sort contests
  const filteredAndSortedContests = useMemo(() => {
    let result = [...initialContests];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        comparison = timeA - timeB;
      } else if (sortField === "name") {
        comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
      } else if (sortField === "problems") {
        comparison = a.total_problems - b.total_problems;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [initialContests, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedContests.length / pageSize));
  const paginatedContests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedContests.slice(start, start + pageSize);
  }, [filteredAndSortedContests, currentPage, pageSize]);

  // Format difficulties breakdown for LeetCode
  const renderDifficulties = (difficulties: number[] | undefined) => {
    if (!difficulties || difficulties.length === 0) {
      return <span className="text-xs text-muted-foreground">—</span>;
    }

    if (platform === "leetcode") {
      let easy = 0, medium = 0, hard = 0, advanced = 0;
      for (const d of difficulties) {
        if (d === 0) easy++;
        else if (d === 1) medium++;
        else if (d === 2) hard++;
        else if (d >= 3) advanced++;
      }
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          {easy > 0 && (
            <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0.5 text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              {easy} Easy
            </Badge>
          )}
          {medium > 0 && (
            <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0.5 text-amber-400 bg-amber-500/10 border-amber-500/20">
              {medium} Med
            </Badge>
          )}
          {hard > 0 && (
            <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0.5 text-rose-400 bg-rose-500/10 border-rose-500/20">
              {hard} Hard
            </Badge>
          )}
          {advanced > 0 && (
            <Badge variant="outline" className="text-[10px] font-bold px-1.5 py-0.5 text-blue-400 bg-blue-500/10 border-blue-500/20">
              {advanced} Adv
            </Badge>
          )}
        </div>
      );
    }

    // Codeforces & CodeChef
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {difficulties.slice(0, 3).map((diff, idx) => {
          const badge = getDifficultyBadge(diff, platform);
          return (
            <Badge key={idx} variant="outline" className={`text-[10px] font-bold px-1.5 py-0.5 ${badge.colorClass}`}>
              {badge.label}
            </Badge>
          );
        })}
        {difficulties.length > 3 && (
          <span className="text-[10px] text-muted-foreground font-semibold">
            +{difficulties.length - 3}
          </span>
        )}
      </div>
    );
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 ml-1 inline" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary ml-1 inline" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Control Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-1">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${config.name} contests, e.g. 333...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-card border border-border text-xs focus:outline-hidden focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Total stats and Page Size */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground">
          <span className="font-medium">
            Showing <strong className="text-foreground">{filteredAndSortedContests.length}</strong> {config.name} Contests
          </span>

          {/* Quick Sort Dropdown for mobile */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
            <span className="text-[11px] font-semibold pl-1">Sort:</span>
            <button
              onClick={() => handleSort("date")}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                sortField === "date" ? "bg-background text-foreground shadow-2xs" : "hover:text-foreground"
              }`}
            >
              Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("name")}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                sortField === "name" ? "bg-background text-foreground shadow-2xs" : "hover:text-foreground"
              }`}
            >
              Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>
      </div>

      {/* Modern Contests Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-b border-border/80">
              <TableHead className="w-12 text-center text-xs font-bold text-muted-foreground">#</TableHead>
              <TableHead 
                onClick={() => handleSort("name")}
                className="text-xs font-bold text-foreground cursor-pointer select-none hover:text-primary transition-colors"
              >
                Contest Name {getSortIcon("name")}
              </TableHead>
              <TableHead 
                onClick={() => handleSort("date")}
                className="w-36 text-xs font-bold text-foreground cursor-pointer select-none hover:text-primary transition-colors"
              >
                Date {getSortIcon("date")}
              </TableHead>
              <TableHead 
                onClick={() => handleSort("problems")}
                className="w-28 text-center text-xs font-bold text-foreground cursor-pointer select-none hover:text-primary transition-colors"
              >
                Problems {getSortIcon("problems")}
              </TableHead>
              <TableHead className="hidden md:table-cell text-xs font-bold text-muted-foreground">
                Difficulty Breakdown
              </TableHead>
              <TableHead className="w-32 text-right text-xs font-bold text-muted-foreground pr-5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContests.length > 0 ? (
              paginatedContests.map((contest, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index + 1;
                const dateObj = new Date(contest.created_at);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <TableRow
                    key={contest.id}
                    className="border-b border-border/60 hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    {/* Index */}
                    <TableCell className="text-center font-mono text-xs text-muted-foreground font-semibold">
                      {globalIndex}
                    </TableCell>

                    {/* Contest Name */}
                    <TableCell>
                      <Link
                        href={`/contests/${platform}/${contest.slug}`}
                        className="flex items-center gap-2.5 font-bold text-sm text-foreground group-hover:text-primary transition-colors py-1"
                      >
                        <div className="w-7 h-7 rounded-lg bg-muted/60 p-1 shrink-0 flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
                          <Image
                            src={logo}
                            alt={config.name}
                            width={18}
                            height={18}
                            className="object-contain"
                          />
                        </div>
                        <span className="line-clamp-1">{contest.name}</span>
                      </Link>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 opacity-60 shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
                    </TableCell>

                    {/* Problems Count */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 bg-primary/5 border-primary/20 text-foreground">
                        {contest.total_problems} {contest.total_problems === 1 ? "Problem" : "Problems"}
                      </Badge>
                    </TableCell>

                    {/* Difficulty Breakdown */}
                    <TableCell className="hidden md:table-cell">
                      {renderDifficulties(contest.difficulties)}
                    </TableCell>

                    {/* Action Button */}
                    <TableCell className="text-right pr-4">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs font-bold gap-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                      >
                        <Link href={`/contests/${platform}/${contest.slug}`}>
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-44 text-center">
                  <div className="space-y-3 py-6">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-foreground">No Contests Found</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        {searchQuery
                          ? `No ${config.name} contests matched "${searchQuery}". Try a different search term.`
                          : `No ${config.name} contests currently available.`}
                      </p>
                    </div>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="text-xs"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground font-medium">
              Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 text-xs font-semibold gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const showEllipsis = prevP && p - prevP > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span className="px-1 text-xs text-muted-foreground">...</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            currentPage === p
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 text-xs font-semibold gap-1"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
