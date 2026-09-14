import React from "react";
import Link from "next/link";
import { ArrowLeft, Info, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/app/api/_lib/supabase-server";
import { generateVideoToken } from "@/lib/video-encryption";
import { ContestEditorial } from "@/types/contest";
import { ContestProblemDetailClient } from "../../[platform]/[contestSlug]/[problemSlug]/_components/contest-problem-detail-client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    problemSlug: string;
  }>;
}

export default async function LeetcodePOTDDetailPage({ params }: PageProps) {
  const { problemSlug } = await params;
  const supabase = getSupabaseServerClient();

  // Fetch the target problem from leetcode-potd table
  const { data: targetProblem, error } = await supabase
    .from("leetcode-potd")
    .select("*")
    .or(`slug_url.eq.${problemSlug},id.eq.${problemSlug}`)
    .maybeSingle();

  if (error || !targetProblem) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Flame className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Problem Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            No LeetCode POTD editorial found matching &ldquo;{problemSlug}&rdquo;.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/contests/leetcode-potd">
            <ArrowLeft className="w-4 h-4" />
            Back to LeetCode POTD Archive
          </Link>
        </Button>
      </div>
    );
  }

  // Fetch sibling POTD problems around the target problem for next/prev navigation
  const { data: siblingRows } = await supabase
    .from("leetcode-potd")
    .select("id, problem_name, slug_url, difficulty, date, created_at")
    .order("date", { ascending: false })
    .limit(100);

  const siblingList = siblingRows || [targetProblem];

  // Map to ContestEditorial format
  const sanitizedProblems: ContestEditorial[] = siblingList.map((p: any) => {
    return {
      id: p.id,
      platform: "leetcode",
      created_at:
        typeof p.date === "number"
          ? new Date(p.date * 1000).toISOString()
          : p.created_at || new Date().toISOString(),
      contest: "LeetCode Daily POTD",
      problem_name: p.problem_name,
      problem_description: p.problem_description || null,
      problem_link: p.problem_link || null,
      video_editorial: p.video_editorial || null,
      editorial: p.editorial || null,
      difficulty: p.difficulty,
      company_tags: p.company_tags,
      topic_tags: p.topic_tags,
      slug_url: p.slug_url,
      solution_link: p.video_editorial || p.editorial || null,
    };
  });

  // Prepare sanitized target problem with video token
  let videoStreamUrl: string | null = null;
  if (targetProblem.video_editorial && targetProblem.video_editorial.trim().length > 0) {
    const token = generateVideoToken(targetProblem.id);
    videoStreamUrl = `/api/contests/video/${targetProblem.id}/player?token=${encodeURIComponent(token)}`;
  }

  const sanitizedTargetProblem: ContestEditorial = {
    id: targetProblem.id,
    platform: "leetcode",
    created_at:
      typeof targetProblem.date === "number"
        ? new Date(targetProblem.date * 1000).toISOString()
        : targetProblem.created_at || new Date().toISOString(),
    contest: "LeetCode Daily POTD",
    problem_name: targetProblem.problem_name,
    problem_description: targetProblem.problem_description || null,
    problem_link: targetProblem.problem_link || null,
    video_editorial: videoStreamUrl || targetProblem.video_editorial,
    editorial: targetProblem.editorial || null,
    difficulty: targetProblem.difficulty,
    company_tags: targetProblem.company_tags,
    topic_tags: targetProblem.topic_tags,
    slug_url: targetProblem.slug_url,
    solution_link: targetProblem.video_editorial || targetProblem.editorial || null,
  };

  return (
    <ContestProblemDetailClient
      problem={sanitizedTargetProblem}
      contestProblems={sanitizedProblems}
      platform="leetcode"
      contestSlug="leetcode-potd"
      contestName="LeetCode Daily POTD"
      customBreadcrumbs={[
        { label: "Contests & POTD", href: "/contests" },
        { label: "LeetCode POTD", href: "/contests/leetcode-potd" },
        { label: targetProblem.problem_name },
      ]}
      customSiblingRoute={(slug) => `/contests/leetcode-potd/${slug}`}
      backHref="/contests/leetcode-potd"
    />
  );
}
