import React from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContestProblems } from "@/lib/contests-service";
import { generateVideoToken } from "@/lib/video-encryption";
import { ContestPlatform, ContestDetail, ContestEditorial } from "@/types/contest";
import { PLATFORMS } from "@/lib/contests";
import { ContestDetailClient } from "./_components/contest-detail-client";

interface PageProps {
  params: Promise<{ platform: string; contestSlug: string }>;
  searchParams: Promise<{ problem?: string }>;
}

export default async function ContestDetailPage({ params, searchParams }: PageProps) {
  const { platform: rawPlatform, contestSlug } = await params;
  const { problem: initialProblemSlug } = await searchParams;

  const platform = (rawPlatform || "leetcode").toLowerCase() as ContestPlatform;
  const config = PLATFORMS[platform] || PLATFORMS.leetcode;

  // Query problems directly on the server from public.contest_editorials
  const matchedProblems = await getContestProblems({
    platform,
    contestSlug,
  });

  if (!matchedProblems || matchedProblems.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Contest Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            No contest editorial records found matching &ldquo;{contestSlug}&rdquo; on {config.name}.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/contests/${platform}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to {config.name} Contests
          </Link>
        </Button>
      </div>
    );
  }

  const contestName = matchedProblems[0].contest || contestSlug;
  const createdAt = matchedProblems[0].created_at;

  // Protect video stream tokens on the server
  const sanitizedProblems: ContestEditorial[] = matchedProblems.map((p) => {
    let videoStreamUrl: string | null = null;
    if (p.video_editorial && p.video_editorial.trim().length > 0) {
      const token = generateVideoToken(p.id);
      videoStreamUrl = `/api/contests/video/${p.id}/player?token=${encodeURIComponent(token)}`;
    }

    return {
      ...p,
      video_editorial: videoStreamUrl,
      video_stream_url: videoStreamUrl,
    };
  });

  const contest: ContestDetail = {
    name: contestName,
    slug: contestSlug,
    platform,
    created_at: createdAt,
    problems: sanitizedProblems,
  };

  return <ContestDetailClient contest={contest} initialProblemSlug={initialProblemSlug} />;
}
