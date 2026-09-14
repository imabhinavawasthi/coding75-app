import React from 'react';
import { getContestProblems } from '@/lib/contests-service';
import { generateVideoToken } from '@/lib/video-encryption';
import { ContestPlatform, ContestEditorial } from '@/types/contest';
import { ContestsHubClient } from './_components/contests-hub-client';

export const dynamic = 'force-dynamic';

export default async function ContestsHubPage() {
  const allRows = await getContestProblems({ platform: 'all' });

  // Calculate platform stats & contest counts
  const contestSet = new Set<string>();
  const byPlatform: Record<string, number> = {
    leetcode: 0,
    codeforces: 0,
    codechef: 0,
  };

  const sanitizedProblems: ContestEditorial[] = allRows.map((p) => {
    if (p.platform) {
      byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1;
    }
    if (p.contest) {
      contestSet.add(`${p.platform}:${p.contest}`);
    }

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

  const stats = {
    totalContests: contestSet.size,
    totalProblems: sanitizedProblems.length,
    byPlatform,
  };

  return <ContestsHubClient initialProblems={sanitizedProblems} stats={stats} />;
}
