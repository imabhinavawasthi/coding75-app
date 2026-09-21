import { ContestPlatform, ContestSummary, ContestDetail, UnifiedProblemRecord } from '@/types/contest';

export type { UnifiedProblemRecord } from '@/types/contest';

/**
 * Helper to determine base URL for fetching both in browser and during SSR.
 */
async function getBaseUrl(): Promise<string> {
  if (typeof window !== 'undefined') return '';
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  try {
    const { headers } = await import('next/headers');
    const h = await headers();
    const host = h.get('host');
    const proto = h.get('x-forwarded-proto') || 'http';
    if (host) {
      return `${proto}://${host}`;
    }
  } catch {}
  return `http://localhost:${process.env.PORT || 3000}`;
}

/**
 * Fetch contest problems by querying the backend API (/api/contests/problems).
 */
export async function getContestProblems(options: {
  platform?: ContestPlatform | 'all';
  contestSlug?: string;
  search?: string;
} = {}): Promise<UnifiedProblemRecord[]> {
  try {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams();
    if (options.platform) params.set('platform', options.platform);
    if (options.contestSlug) params.set('contestSlug', options.contestSlug);
    if (options.search) params.set('search', options.search);

    const queryString = params.toString();
    const url = `${baseUrl}/api/contests/problems${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`Failed to fetch contest problems from API (${res.status})`);
      return [];
    }

    const data = await res.json();
    return data.problems || [];
  } catch (err) {
    console.error('Error in getContestProblems calling backend API:', err);
    return [];
  }
}

/**
 * Fetch problem video editorial details from backend API.
 */
export async function getProblemVideoById(
  id: string
): Promise<{ id: string; problem_name: string; video_editorial: string | null } | null> {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/contests/video/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.problem) return null;

    return {
      id: data.problem.id,
      problem_name: data.problem.problem_name,
      video_editorial: data.problem.video_stream_url || null,
    };
  } catch (err) {
    console.error('Error in getProblemVideoById calling backend API:', err);
    return null;
  }
}

/**
 * Fetch all contest summaries and platform statistics from backend API.
 */
export async function fetchContestsHub(options: {
  platform?: ContestPlatform | 'all';
  search?: string;
  limit?: number;
} = {}): Promise<{ contests: ContestSummary[]; stats: any }> {
  try {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams();
    if (options.platform) params.set('platform', options.platform);
    if (options.search) params.set('search', options.search);
    if (options.limit) params.set('limit', String(options.limit));

    const qs = params.toString();
    const res = await fetch(`${baseUrl}/api/contests${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
    });

    if (!res.ok) return { contests: [], stats: {} };
    return await res.json();
  } catch (err) {
    console.error('Error fetching contests hub from backend API:', err);
    return { contests: [], stats: {} };
  }
}

/**
 * Fetch platform-specific contests from backend API.
 */
export async function fetchPlatformContests(
  platform: ContestPlatform,
  options: { search?: string } = {}
): Promise<{ contests: ContestSummary[]; totalContests: number; totalProblems: number }> {
  try {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams();
    if (options.search) params.set('search', options.search);

    const qs = params.toString();
    const res = await fetch(`${baseUrl}/api/contests/${platform}${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
    });

    if (!res.ok) return { contests: [], totalContests: 0, totalProblems: 0 };
    return await res.json();
  } catch (err) {
    console.error(`Error fetching platform contests for ${platform} from backend API:`, err);
    return { contests: [], totalContests: 0, totalProblems: 0 };
  }
}

/**
 * Fetch detailed contest data including sanitized problems from backend API.
 */
export async function fetchContestDetail(
  platform: ContestPlatform,
  contestSlug: string
): Promise<{ contest: ContestDetail | null; error?: string }> {
  try {
    const baseUrl = await getBaseUrl();
    const res = await fetch(
      `${baseUrl}/api/contests/${platform}/${encodeURIComponent(contestSlug)}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { contest: null, error: data.error || 'Failed to fetch contest detail' };
    }

    const data = await res.json();
    return { contest: data.contest || null };
  } catch (err: any) {
    console.error(`Error fetching contest detail for ${platform}/${contestSlug} from backend API:`, err);
    return { contest: null, error: err.message };
  }
}
