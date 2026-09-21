import { NextResponse } from 'next/server';
import { getContestProblemsFromDb } from '@/app/api/_lib/contests-db';
import { slugifyContest } from '@/lib/contests';
import { ContestPlatform, ContestSummary } from '@/types/contest';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { platform: rawPlatform } = await params;
    const platform = rawPlatform.toLowerCase() as ContestPlatform;

    if (!['leetcode', 'codeforces', 'codechef'].includes(platform)) {
      return NextResponse.json({ error: `Invalid platform '${rawPlatform}'`, contests: [] }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim();

    const rows = await getContestProblemsFromDb({
      platform,
      search,
    });

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

    let summaries: ContestSummary[] = Array.from(contestMap.entries()).map(([name, info]) => ({
      id: `${platform}:${name}`,
      name: info.name,
      slug: slugifyContest(info.name),
      platform,
      total_problems: info.problemsCount,
      created_at: info.latestCreatedAt,
      difficulties: info.difficulties,
    }));

    summaries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      platform,
      contests: summaries,
      totalContests: summaries.length,
      totalProblems: rows.length,
    });
  } catch (err: any) {
    console.error('API /api/contests/[platform] exception:', err);
    return NextResponse.json({ error: 'Internal server error', contests: [] }, { status: 500 });
  }
}
