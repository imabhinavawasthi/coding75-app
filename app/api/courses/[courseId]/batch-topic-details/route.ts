import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';

function normalizeText(text: string): string {
  if (!text) return '';
  const textNoDash = text.replace(/-/g, ' ');
  return textNoDash.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "complexity-foundations": ["complexity", "big o", "analysis"],
  "prog-foundations": ["programming", "foundations", "basics", "syntax"],
  "math-dsa": ["math", "number theory", "prime", "sieve"],
  "problem-solving-mindset": ["problem solving", "mindset", "blueprint"],
  "arrays": ["array", "arrays", "vectors", "prefix sum"],
  "strings": ["string", "strings", "pattern"],
  "linked-list": ["linked", "list", "linkedlist", "node"],
  "stack-queue": ["stack", "queue", "monotonic"],
  "hashing-maps": ["hash", "hashmap", "hashing", "map"],
  "trees": ["tree", "trees", "bst", "binary tree"],
  "heaps": ["heap", "heaps", "priority queue"],
  "graphs": ["graph", "graphs", "bfs", "dfs", "dijkstra"],
  "two-pointers-window": ["two pointers", "pointer", "pointers", "sliding window", "window"],
  "binary-search": ["binary search", "search", "searching"],
  "sorting-comparators": ["sort", "sorting", "comparator"],
  "recursion-backtracking": ["recursion", "backtrack", "backtracking"],
  "dp": ["dynamic programming", "dp", "memoization", "tabulation"],
  "greedy": ["greedy", "intervals"],
  "bit-manipulation": ["bit", "bitwise", "bitmask"],
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const topics: string[] = Array.isArray(body?.topics) ? body.topics : [];

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    const supabase = getSupabaseServerClient(token);
    
    // Auth Check for User
    let userId: string | undefined = undefined;
    if (token) {
      try {
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id;
      } catch (e) {
        console.warn('Could not verify user token in batch-topic-details:', e);
      }
    }

    // Fetch user states if user exists (status in DB is 'done')
    const userStates: Record<string, boolean> = {};
    if (userId) {
      const { data: stateData } = await supabase
        .from('user_asset_states')
        .select('asset_id, status')
        .eq('user_id', userId)
        .eq('status', 'done');

      if (stateData) {
        for (const row of stateData) {
          userStates[row.asset_id] = true;
        }
      }
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);

    let query = supabase.from('courses').select('id, slug, curriculum');
    if (isUUID) {
      query = query.eq('id', courseId);
    } else {
      query = query.eq('slug', courseId);
    }

    let curriculum: any[] = [];
    let courseSlug = courseId;

    const { data: courseData, error: courseError } = await query.maybeSingle();

    if (!courseError && courseData && Array.isArray(courseData.curriculum)) {
      curriculum = courseData.curriculum;
      courseSlug = courseData.slug || courseId;
    }

    const matched_topics: Record<string, any> = {};

    for (const topic of topics) {
      const cleanTopic = normalizeText(topic);
      const keywords = TOPIC_KEYWORDS[topic] || [cleanTopic];
      let matchedSec: any = null;

      // Find matched section in course curriculum
      for (const sec of curriculum) {
        const cleanSecTitle = normalizeText(sec.title || '');
        const cleanSecId = normalizeText(sec.id || '');

        if (
          cleanTopic === cleanSecId ||
          cleanTopic === cleanSecTitle ||
          cleanTopic.includes(cleanSecTitle) ||
          cleanSecTitle.includes(cleanTopic) ||
          keywords.some((kw) => cleanSecTitle.includes(kw) || cleanSecId.includes(kw))
        ) {
          matchedSec = sec;
          break;
        }

        // Subsections match
        for (const sub of sec.subsections || []) {
          const cleanSubTitle = normalizeText(sub.title || '');
          const cleanSubId = normalizeText(sub.id || '');

          if (
            cleanTopic === cleanSubId ||
            cleanTopic === cleanSubTitle ||
            cleanTopic.includes(cleanSubTitle) ||
            cleanSubTitle.includes(cleanTopic) ||
            keywords.some((kw) => cleanSubTitle.includes(kw) || cleanSubId.includes(kw))
          ) {
            matchedSec = {
              id: sub.id || `${sec.id}-${sub.title}`,
              title: sub.title,
              items: sub.items || [],
              subsections: [],
            };
            break;
          }
        }
        if (matchedSec) break;
      }

      const subsections = matchedSec?.subsections || [];
      const totalCurriculumItems = (matchedSec?.items?.length || 0) + subsections.reduce((acc: number, sub: any) => acc + (sub.items?.length || 0), 0);

      // Only topics present in the course with items are available; all others are upcoming
      if (matchedSec && totalCurriculumItems > 0) {
        let videosCount = 0;
        let problemsCount = 0;
        let articlesCount = 0;
        let completedItems = 0;
        const chaptersCount = subsections.length > 0 ? subsections.length : 1;

        const countItems = (items: any[]) => {
          for (const item of items || []) {
            if (item.type === 'video') videosCount++;
            else if (item.type === 'problem') problemsCount++;
            else if (item.type === 'article') articlesCount++;
            
            const isDone = Boolean(
              (item.asset_id && userStates[item.asset_id]) ||
              (item.id && userStates[item.id]) ||
              (item.slug && userStates[item.slug])
            );
            if (isDone) {
              completedItems++;
            }
          }
        };

        countItems(matchedSec.items);
        for (const sub of subsections) {
          countItems(sub.items);
        }

        const itemsCount = videosCount + problemsCount + articlesCount;

        matched_topics[topic] = {
          title: topic,
          found: true,
          section_id: matchedSec.id,
          chapters_count: chaptersCount,
          items_count: itemsCount,
          videos_count: videosCount,
          problems_count: problemsCount,
          articles_count: articlesCount,
          completed_count: completedItems,
          completion_percentage: itemsCount > 0 ? Math.round((completedItems / itemsCount) * 100) : 0,
          is_upcoming: false,
        };
      } else {
        // Not present in course curriculum => Upcoming
        matched_topics[topic] = {
          title: topic,
          found: false,
          section_id: null,
          chapters_count: 0,
          items_count: 0,
          videos_count: 0,
          problems_count: 0,
          articles_count: 0,
          completed_count: 0,
          completion_percentage: 0,
          is_upcoming: true,
        };
      }
    }

    return NextResponse.json(
      {
        course_slug: courseSlug,
        matched_topics,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error in batch-topic-details:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
