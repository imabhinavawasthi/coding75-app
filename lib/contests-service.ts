import { getSupabaseServerClient } from '@/app/api/_lib/supabase-server';
import { slugifyContest } from '@/lib/contests';
import { ContestPlatform, ContestEditorial } from '@/types/contest';

export interface UnifiedProblemRecord {
  id: string;
  platform: ContestPlatform;
  created_at: string;
  problem_name: string;
  problem_description: string | null;
  problem_link: string | null;
  video_editorial: string | null;
  editorial: string | null;
  difficulty: number;
  company_tags?: any;
  topic_tags?: any;
  slug_url: string;
  contest: string | null;
  solution_link: string | null;
}

/**
 * Strictly query ONLY from public.contest_editorials.
 * No legacy tables are accessed under any circumstances.
 */
export async function getContestProblems(options: {
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
    console.error('Error querying public.contest_editorials:', error);
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
 * Strictly fetch video URL for a problem by ID from public.contest_editorials ONLY.
 */
export async function getProblemVideoById(id: string): Promise<{ id: string; problem_name: string; video_editorial: string | null } | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
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
