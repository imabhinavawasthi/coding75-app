import { NextResponse } from 'next/server';
import { getContestProblemsFromDb } from '@/app/api/_lib/contests-db';
import { ContestPlatform } from '@/types/contest';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = (searchParams.get('platform') || 'all') as ContestPlatform | 'all';
    const contestSlug = searchParams.get('contestSlug') || undefined;
    const search = searchParams.get('search')?.toLowerCase().trim() || undefined;

    const problems = await getContestProblemsFromDb({
      platform,
      contestSlug,
      search,
    });

    return NextResponse.json({ problems }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/contests/problems error:', err);
    return NextResponse.json(
      { error: 'Internal server error', problems: [] },
      { status: 500 }
    );
  }
}
