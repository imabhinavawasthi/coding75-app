"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Trophy, Code2, Flame, Layers, ArrowRight, Sparkles, GraduationCap, Calendar, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { dsaModules, DSATopicModule } from "@/config/dsa-catalog";
import { hydrateModulesWithBatchResponse, BatchTopicResponse } from "@/lib/courseCatalogSync";
import { fetchBatchTopicDetails, TARGET_DSA_COURSE_ID } from "@/lib/courses";
import { DSACarouselSection } from "./_components/dsa-carousel-section";
import { DSATopicCard } from "./_components/dsa-topic-card";

import LeetcodeLogo from "@/public/logos/leetcode.png";
import CodeforcesLogo from "@/public/logos/codeforces.svg";
import CodechefLogo from "@/public/logos/codechef.png";
import CrackDsaLogo from "@/public/logos/crackdsa.png";
import PremiumPageHeader from "@/components/page-headers/premium-page-header";
import supabase from "@/supabase";


function DsaCatalogContent() {
  const [batchData, setBatchData] = useState<BatchTopicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "foundations" | "ds" | "algo">("all");
  const [activeDifficulty, setActiveDifficulty] = useState<"all" | "Beginner" | "Medium" | "Advanced">("all");
  const [activeStatus, setActiveStatus] = useState<"all" | "available" | "upcoming">("all");

  useEffect(() => {
    let isMounted = true;
    async function loadBatchDetails() {
      setIsLoading(true);
      try {
        const topicIds = dsaModules.map((m) => m.id);
        const data = await fetchBatchTopicDetails(TARGET_DSA_COURSE_ID, topicIds);
        if (isMounted && data) {
          setBatchData(data);
        }
      } catch (err) {
        console.warn("Batch topic details endpoint unavailable:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadBatchDetails();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadBatchDetails();
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Hydrate catalog modules using exact trimmed & case-insensitive title match from backend batch response
  const hydratedModules = useMemo(
    () => hydrateModulesWithBatchResponse(dsaModules, batchData),
    [batchData]
  );

  const foundationsModules = useMemo(
    () => hydratedModules.filter((m) => m.category === "foundations"),
    [hydratedModules]
  );

  const dsModules = useMemo(
    () => hydratedModules.filter((m) => m.category === "ds"),
    [hydratedModules]
  );

  const algoModules = useMemo(
    () => hydratedModules.filter((m) => m.category === "algo"),
    [hydratedModules]
  );

  // Check if any filter or search query is active
  const isFilteringOrSearching = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      activeCategory !== "all" ||
      activeDifficulty !== "all" ||
      activeStatus !== "all"
    );
  }, [searchQuery, activeCategory, activeDifficulty, activeStatus]);

  // Dynamic search and multi-criteria filtering
  const filteredResults = useMemo(() => {
    return hydratedModules.filter((m) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        (m.subtitle && m.subtitle.toLowerCase().includes(query)) ||
        m.topics.some((t) => t.toLowerCase().includes(query));

      const matchesCategory = activeCategory === "all" || m.category === activeCategory;
      const matchesDifficulty = activeDifficulty === "all" || m.difficulty === activeDifficulty;
      const matchesStatus =
        activeStatus === "all" ||
        (activeStatus === "upcoming" ? m.isUpcoming : !m.isUpcoming);

      return matchesQuery && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [hydratedModules, searchQuery, activeCategory, activeDifficulty, activeStatus]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveDifficulty("all");
    setActiveStatus("all");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 pt-4 space-y-6">
      {/* Top Banner Header - Premium */}
      <PremiumPageHeader 
        title="Data Structures & Algorithms" 
        subtitle="Structured video lessons, foundational concepts, curated problem sheets, and contest solutions."
      >
        <div className="flex items-center justify-center gap-3 pt-1 flex-wrap w-full">
          <Button asChild size="default" className="font-bold gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 rounded-xl">
            <Link href="/dsa/learn">
              <GraduationCap className="w-4 h-4" />
              <span>Course Roadmap</span>
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-[10px] font-black bg-white/20 text-white border-none shadow-sm uppercase tracking-wider">Flow</Badge>
            </Link>
          </Button>
          <Button asChild size="default" className="font-black gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/20 transition-all hover:scale-105 rounded-xl">
            <Link href="/dsa/topic-tree">
              <Network className="w-4 h-4 fill-white" />
              <span>Topic Tree Roadmap</span>
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-[10px] font-black bg-white/20 text-white border-none shadow-sm uppercase tracking-wider">New</Badge>
            </Link>
          </Button>
          <Button asChild size="default" className="font-bold gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xs rounded-xl">
            <Link href="/contests">
              <Trophy className="w-4 h-4 fill-white" />
              <span>Contest Solutions</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="default" className="font-semibold gap-1.5 bg-background/80 hover:bg-muted border-border rounded-xl">
            <Link href="/dsa/sheets">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span>Practice Sheets</span>
            </Link>
          </Button>
        </div>
      </PremiumPageHeader>

      {/* Enhanced Search & Filter Options Bar */}
      <div className="space-y-4">
        {/* Top Search Input Row */}
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search Data Structures, Algorithms, or topics (e.g., Binary Trees, DP, Arrays)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card backdrop-blur-sm pl-11 pr-10 py-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {[
              { id: "all", label: "All Topics" },
              { id: "foundations", label: "Fundamentals" },
              { id: "ds", label: "Data Structures" },
              { id: "algo", label: "Algorithms" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === tab.id
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/80 text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Difficulty & Status Filter Controls */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
            {/* Difficulty Dropdown / Pills */}
            <div className="flex items-center gap-1">
              {[
                { id: "all", label: "All Difficulties" },
                { id: "Beginner", label: "Beginner" },
                { id: "Medium", label: "Medium" },
                { id: "Advanced", label: "Advanced" },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setActiveDifficulty(diff.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap border ${
                    activeDifficulty === diff.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>

            {/* Status Filter: All / Available / Upcoming */}
            <div className="flex items-center gap-1 border-l pl-2 ml-1">
              {[
                { id: "all", label: "All Status" },
                { id: "available", label: "Available" },
                { id: "upcoming", label: "Upcoming" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStatus(st.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap border ${
                    activeStatus === st.id
                      ? "bg-foreground text-background border-foreground shadow-2xs"
                      : "bg-card text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Clear All Filters Button */}
            {isFilteringOrSearching && (
              <button
                onClick={clearAllFilters}
                className="ml-2 text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Display */}
      {isFilteringOrSearching ? (
        /* Filtered Grid View */
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Matching Topics ({isLoading ? "..." : filteredResults.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((idx) => (
                <DSATopicCard key={idx} module={dsaModules[0]} isLoading layout="grid" />
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {filteredResults.map((module) => (
                <DSATopicCard key={module.id} module={module} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-2xl border border-dashed bg-card/50">
              <p className="text-sm font-bold text-muted-foreground">
                No topics match your selected search/filter criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-3 text-xs font-bold text-primary hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Horizontal Carousels View */
        <div className="space-y-10 pt-2">
          {/* Section 1: Fundamentals */}
          <DSACarouselSection
            title="Fundamentals"
            description="Core foundations, Big-O complexity analysis, and programming basics"
            modules={foundationsModules}
            isLoading={isLoading}
          />

          {/* Section 2: Data Structures */}
          <DSACarouselSection
            title="Data Structures"
            description="Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Heaps, and Graphs"
            modules={dsModules}
            isLoading={isLoading}
          />

          {/* Section 3: Algorithms */}
          <DSACarouselSection
            title="Algorithms"
            description="Two Pointers, Binary Search, Sorting, Backtracking, Dynamic Programming & Greedy"
            modules={algoModules}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Explore More: Contest Solutions & Curated Practice Sheets */}
      <div className="pt-8 border-t space-y-6">
        <div>
          <h2 className="text-xl font-black text-foreground">Explore More Resources</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Level up with contest editorials and hand-picked problem sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Codeforces */}
          <Link href="/contests/codeforces" className="block group">
            <Card className="h-full border bg-card hover:border-blue-500/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 p-2 shrink-0 flex items-center justify-center">
                  <Image src={CodeforcesLogo} alt="Codeforces" width={32} height={32} className="object-contain" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold group-hover:text-blue-500 transition-colors">
                    Codeforces
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                    Div. 2, Div. 3 & Div. 4 round solutions, competitive math, and constructive tricks.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 pt-3 border-t">
                  <span>Explore Codeforces</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: CodeChef */}
          <Link href="/contests/codechef" className="block group">
            <Card className="h-full border bg-card hover:border-amber-600/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="w-12 h-12 rounded-xl bg-amber-600/10 p-2 shrink-0 flex items-center justify-center">
                  <Image src={CodechefLogo} alt="CodeChef" width={32} height={32} className="object-contain" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold group-hover:text-amber-600 transition-colors">
                    CodeChef
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                    Starters, Cook-Off, and Lunchtime contest problem walkthroughs and editorial code.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-500 pt-3 border-t">
                  <span>Explore CodeChef</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 3: LeetCode Contest */}
          <Link href="/contests/leetcode" className="block group">
            <Card className="h-full border bg-card hover:border-amber-500/50 hover:shadow-lg transition-all flex flex-col justify-between">
              <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 p-2 shrink-0 flex items-center justify-center">
                  <Image src={LeetcodeLogo} alt="LeetCode" width={32} height={32} className="object-contain" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold group-hover:text-amber-500 transition-colors">
                    LeetCode Contests
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                    Weekly & Biweekly contest problem breakdown, optimal editorial solutions, and analysis.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 pt-3 border-t">
                  <span>Explore LeetCode Contests</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DSAPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      }
    >
      <DsaCatalogContent />
    </Suspense>
  );
}
