import { NextResponse } from 'next/server';
import { getContestProblems } from '@/lib/contests-service';
import { generateVideoToken } from '@/lib/video-encryption';
import { ContestPlatform } from '@/types/contest';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ platform: string; contestSlug: string }> }
) {
  try {
    const { platform: rawPlatform, contestSlug } = await params;
    const platform = rawPlatform.toLowerCase() as ContestPlatform;

    if (!['leetcode', 'codeforces', 'codechef'].includes(platform)) {
      return NextResponse.json({ error: `Invalid platform '${rawPlatform}'` }, { status: 400 });
    }

    if (!contestSlug) {
      return NextResponse.json({ error: 'Contest slug is required' }, { status: 400 });
    }

    const matchedProblems = await getContestProblems({
      platform,
      contestSlug,
    });

    if (matchedProblems.length === 0) {
      return NextResponse.json({
        error: 'Contest not found',
        contest: null,
      }, { status: 404 });
    }

    const contestName = matchedProblems[0].contest || contestSlug;
    const createdAt = matchedProblems[0].created_at;

    // Secure each problem: obfuscate raw drive link and generate tokenized stream URL
    const sanitizedProblems = matchedProblems.map((p) => {
      let videoStreamUrl: string | null = null;
      if (p.video_editorial && p.video_editorial.trim().length > 0) {
        const token = generateVideoToken(p.id);
        videoStreamUrl = `/api/contests/video/${p.id}/player?token=${encodeURIComponent(token)}`;
      }

      return {
        ...p,
        // Shield the raw drive url from the client payload
        video_editorial: videoStreamUrl,
        video_stream_url: videoStreamUrl,
      };
    });

    return NextResponse.json({
      contest: {
        name: contestName,
        slug: contestSlug,
        platform,
        created_at: createdAt,
        problems: sanitizedProblems,
      },
    });
  } catch (err: any) {
    console.error('API /api/contests/[platform]/[contestSlug] exception:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
