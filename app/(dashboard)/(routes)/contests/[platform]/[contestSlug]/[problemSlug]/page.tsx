import React from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContestProblems } from "@/lib/contests-service";
import { generateVideoToken } from "@/lib/video-encryption";
import { ContestPlatform, ContestEditorial } from "@/types/contest";
import { PLATFORMS } from "@/lib/contests";
import { ContestProblemDetailClient } from "./_components/contest-problem-detail-client";

interface PageProps {
  params: Promise<{
    platform: string;
    contestSlug: string;
    problemSlug: string;
  }>;
}

export default async function ContestProblemDetailPage({ params }: PageProps) {
  const { platform: rawPlatform, contestSlug, problemSlug } = await params;

  const platform = (rawPlatform || "leetcode").toLowerCase() as ContestPlatform;
  const config = PLATFORMS[platform] || PLATFORMS.leetcode;

  // Query problems directly from public.contest_editorials on the server
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

  // Find the target problem
  const targetProblem = matchedProblems.find(
    (p) => p.slug_url === problemSlug || p.id === problemSlug
  );

  if (!targetProblem) {
    const contestName = matchedProblems[0].contest || contestSlug;
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Problem Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            Problem &ldquo;{problemSlug}&rdquo; was not found in {contestName}.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/contests/${platform}/${contestSlug}`}>
            <ArrowLeft className="w-4 h-4" />
            Back to {contestName}
          </Link>
        </Button>
      </div>
    );
  }

  const contestName = targetProblem.contest || matchedProblems[0].contest || contestSlug;

  // Protect video stream tokens on the server for all contest problems
  const sanitizedProblems: ContestEditorial[] = matchedProblems.map((p) => {
    let videoStreamUrl: string | null = null;
    if (p.video_editorial && p.video_editorial.trim().length > 0) {
      const token = generateVideoToken(p.id);
      videoStreamUrl = `/api/contests/video/${p.id}/player?token=${encodeURIComponent(token)}`;
    }
    return {
      id: p.id,
      platform: p.platform,
      created_at: p.created_at,
      contest: p.contest,
      problem_name: p.problem_name,
      problem_description: p.problem_description,
      problem_link: p.problem_link,
      video_editorial: videoStreamUrl,
      editorial: p.editorial,
      difficulty: p.difficulty,
      company_tags: p.company_tags,
      topic_tags: p.topic_tags,
      slug_url: p.slug_url,
      solution_link: p.solution_link,
    };
  });

  const sanitizedTargetProblem = sanitizedProblems.find(
    (p) => p.slug_url === targetProblem.slug_url || p.id === targetProblem.id
  ) || sanitizedProblems[0];

  return (
    <ContestProblemDetailClient
      problem={sanitizedTargetProblem}
      contestProblems={sanitizedProblems}
      platform={platform}
      contestSlug={contestSlug}
      contestName={contestName}
    />
  );
}
