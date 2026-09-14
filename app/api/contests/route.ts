import { NextResponse } from 'next/server';
import { getContestProblems } from '@/lib/contests-service';
import { slugifyContest } from '@/lib/contests';
import { ContestPlatform, ContestSummary } from '@/types/contest';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform') as ContestPlatform | 'all' | null;
    const search = searchParams.get('search')?.toLowerCase().trim();
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const rows = await getContestProblems({
      platform: platform || 'all',
      search,
    });

    // Group problems by contest
    const contestMap = new Map<string, {
      name: string;
      platform: ContestPlatform;
      problemsCount: number;
      difficulties: number[];
      latestCreatedAt: string;
    }>();

    const byPlatformCount: Record<string, number> = {
      leetcode: 0,
      codeforces: 0,
      codechef: 0,
    };

    for (const row of rows) {
      if (row.platform) {
        byPlatformCount[row.platform] = (byPlatformCount[row.platform] || 0) + 1;
      }

      const contestName = row.contest || `${row.platform.toUpperCase()} Contest`;
      const groupKey = `${row.platform}:${contestName}`;

      const existing = contestMap.get(groupKey);
      if (existing) {
        existing.problemsCount += 1;
        if (row.difficulty) existing.difficulties.push(row.difficulty);
        if (new Date(row.created_at) > new Date(existing.latestCreatedAt)) {
          existing.latestCreatedAt = row.created_at;
        }
      } else {
        contestMap.set(groupKey, {
          name: contestName,
          platform: row.platform,
          problemsCount: 1,
          difficulties: row.difficulty ? [row.difficulty] : [],
          latestCreatedAt: row.created_at,
        });
      }
    }

    let summaries: ContestSummary[] = Array.from(contestMap.entries()).map(([key, info]) => ({
      id: key,
      name: info.name,
      slug: slugifyContest(info.name),
      platform: info.platform,
      total_problems: info.problemsCount,
      created_at: info.latestCreatedAt,
      difficulties: info.difficulties,
    }));

    // Sort by latest created_at descending
    summaries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (limit > 0) {
      summaries = summaries.slice(0, limit);
    }

    return NextResponse.json({
      contests: summaries,
      stats: {
        totalContests: contestMap.size,
        totalProblems: rows.length,
        byPlatform: byPlatformCount,
      },
    });
  } catch (err: any) {
    console.error('API /api/contests exception:', err);
    return NextResponse.json({ error: 'Internal server error', contests: [] }, { status: 500 });
  }
}
