import { NextResponse } from 'next/server';
import { getProblemVideoFromDb } from '@/app/api/_lib/contests-db';
import { generateVideoToken } from '@/lib/video-encryption';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Problem ID is required' }, { status: 400 });
    }

    const problem = await getProblemVideoFromDb(id);
    if (!problem) {
      return NextResponse.json({ error: 'Problem video not found' }, { status: 404 });
    }

    let videoStreamUrl: string | null = null;
    if (problem.video_editorial && problem.video_editorial.trim().length > 0) {
      const token = generateVideoToken(problem.id);
      videoStreamUrl = `/api/contests/video/${problem.id}/player?token=${encodeURIComponent(token)}`;
    }

    return NextResponse.json({
      problem: {
        id: problem.id,
        problem_name: problem.problem_name,
        video_stream_url: videoStreamUrl,
        has_video: Boolean(videoStreamUrl),
      },
    });
  } catch (err: any) {
    console.error('API /api/contests/video/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
