import { getSupabaseServerClient } from './supabase-server';
import { slugifyContest } from '@/lib/contests';
import { ContestPlatform, UnifiedProblemRecord } from '@/types/contest';

/**
 * Server-only database layer for contest editorials.
 * Interacts directly with Supabase via getSupabaseServerClient.
 */

export async function getContestProblemsFromDb(options: {
  platform?: ContestPlatform | 'all';
  contestSlug?: string;
  search?: string;
} = {}): Promise<UnifiedProblemRecord[]> {
  const supabase = getSupabaseServerClient();
  const { platform, contestSlug, search } = options;

  let query = supabase
    .from('contest_editorials')
    .select('*')
    .order('created_at', { ascending: false });

  if (platform && platform !== 'all') {
    query = query.eq('platform', platform);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error querying public.contest_editorials from DB:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  let rows: UnifiedProblemRecord[] = data.map((r: any) => ({
    ...r,
    platform: r.platform as ContestPlatform,
    difficulty: typeof r.difficulty === 'number' ? r.difficulty : 0,
  }));

  if (contestSlug) {
    const target = contestSlug.toLowerCase().trim();
    let decodedTarget = target;
    try {
      decodedTarget = decodeURIComponent(contestSlug).toLowerCase().trim();
    } catch {}

    rows = rows.filter((r) => {
      if (!r.contest) return false;
      const raw = r.contest.toLowerCase().trim();
      const s = slugifyContest(r.contest);
      return (
        s === target ||
        s === decodedTarget ||
        raw === target ||
        raw === decodedTarget ||
        raw.replace(/\s+/g, '-') === target ||
        raw.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') === target
      );
    });

    // When viewing a contest, order problems by created_at ASC (easy problems added first)
    rows.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.problem_name.toLowerCase().includes(q) ||
        (r.contest && r.contest.toLowerCase().includes(q)) ||
        r.platform.toLowerCase().includes(q)
    );
  }

  return rows;
}

/**
 * Server-only query to fetch problem video details by ID.
 * Checks contest_editorials first, falls back to leetcode-potd.
 */
export async function getProblemVideoFromDb(id: string): Promise<{ id: string; problem_name: string; video_editorial: string | null } | null> {
  const supabase = getSupabaseServerClient();

  const { data } = await supabase
    .from('contest_editorials')
    .select('id, problem_name, video_editorial')
    .eq('id', id)
    .maybeSingle();

  if (data) return data;

  const { data: potdData } = await supabase
    .from('leetcode-potd')
    .select('id, problem_name, video_editorial')
    .eq('id', id)
    .maybeSingle();

  return potdData || null;
}
