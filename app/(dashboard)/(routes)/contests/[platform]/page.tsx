import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PremiumPageHeader from "@/components/page-headers/premium-page-header";
import { ContestPlatform, ContestSummary } from "@/types/contest";
import { PLATFORMS, slugifyContest } from "@/lib/contests";
import { getContestProblems } from "@/lib/contests-service";
import { PlatformContestTable } from "./_components/platform-contest-table";

import LeetcodeLogo from "@/public/logos/leetcode.png";
import CodeforcesLogo from "@/public/logos/codeforces.svg";
import CodechefLogo from "@/public/logos/codechef.png";

const PLATFORM_LOGOS = {
  leetcode: LeetcodeLogo,
  codeforces: CodeforcesLogo,
  codechef: CodechefLogo,
};

interface PlatformPageProps {
  params: Promise<{ platform: string }>;
}

export default async function PlatformContestsPage({ params }: PlatformPageProps) {
  const { platform: rawPlatform } = await params;
  const platform = (rawPlatform || "leetcode").toLowerCase() as ContestPlatform;

  if (!["leetcode", "codeforces", "codechef"].includes(platform)) {
    notFound();
  }

  const config = PLATFORMS[platform] || PLATFORMS.leetcode;
  const logo = PLATFORM_LOGOS[platform] || PLATFORM_LOGOS.leetcode;

  // Query problems strictly from public.contest_editorials on the server
  const rows = await getContestProblems({ platform });

  // Group by contest
  const contestMap = new Map<string, {
    name: string;
    problemsCount: number;
    difficulties: number[];
    latestCreatedAt: string;
  }>();

  for (const row of rows) {
    const contestName = row.contest || `${platform.toUpperCase()} Contest`;
    const existing = contestMap.get(contestName);

    if (existing) {
      existing.problemsCount += 1;
      if (row.difficulty) existing.difficulties.push(row.difficulty);
      if (new Date(row.created_at) > new Date(existing.latestCreatedAt)) {
        existing.latestCreatedAt = row.created_at;
      }
    } else {
      contestMap.set(contestName, {
        name: contestName,
        problemsCount: 1,
        difficulties: row.difficulty ? [row.difficulty] : [],
        latestCreatedAt: row.created_at,
      });
    }
  }

  const summaries: ContestSummary[] = Array.from(contestMap.entries()).map(([name, info]) => ({
    id: `${platform}:${name}`,
    name: info.name,
    slug: slugifyContest(info.name),
    platform,
    total_problems: info.problemsCount,
    created_at: info.latestCreatedAt,
    difficulties: info.difficulties,
  }));

  // Default sort: newest date descending
  summaries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Link href="/contests" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Contests Hub
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground capitalize">{config.name}</span>
      </div>

      {/* Platform Hero Banner - Premium */}
      <PremiumPageHeader
        badge={
          <Badge variant="outline" className={`text-xs font-bold px-3 py-1 ${config.badgeColor}`}>
            {config.name} Contests
          </Badge>
        }
        title={
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-background/80 p-2.5 shadow-sm border border-border flex items-center justify-center shrink-0">
              <Image
                src={logo}
                alt={config.name}
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span>
              {config.name} <span className="text-primary">Contest Archive</span>
            </span>
          </div>
        }
        subtitle={config.description}
      >
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 border border-border shadow-xs text-xs font-medium">
            <BookOpen className={`w-4 h-4 ${config.accentText}`} />
            <span>
              <strong className="text-foreground">{summaries.length}</strong> Contests
            </span>
            <span className="text-muted-foreground">·</span>
            <span>
              <strong className="text-foreground">{rows.length}</strong> Editorials
            </span>
          </div>
          <Button asChild variant="outline" size="sm" className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 bg-background/80 hover:bg-muted border-border">
            <Link href="/contests">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Contests</span>
            </Link>
          </Button>
        </div>
      </PremiumPageHeader>

      {/* Modern Contest Table with Sorting and Search (No other platform tabs) */}
      <PlatformContestTable
        platform={platform}
        config={config}
        logo={logo}
        initialContests={summaries}
      />
    </div>
  );
}
