import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../_lib/supabase-server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const supabase = getSupabaseServerClient();

        let query = supabase
            .from('courses')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            return NextResponse.json({ courses: [] }, { status: 200 });
        }

        // Hydrate dynamic counts for each course
        const courses = data.map((c: any) => {
            const curriculum = Array.isArray(c.curriculum) ? c.curriculum : [];
            let totalProblems = 0;
            let totalVideos = 0;
            let totalArticles = 0;

            const countItems = (items: any[]) => {
                for (const item of items || []) {
                    if (item.type === 'problem') totalProblems++;
                    else if (item.type === 'video') totalVideos++;
                    else if (item.type === 'article') totalArticles++;
                }
            };

            for (const sec of curriculum) {
                countItems(sec.items);
                for (const sub of sec.subsections || []) {
                    countItems(sub.items);
                }
            }

            return {
                id: c.id,
                slug: c.slug || c.id,
                title: c.title,
                description: c.description,
                category: c.category,
                tags: c.tags || [],
                is_pro: c.is_pro ?? true,
                is_popular: c.is_popular ?? false,
                status: c.status || 'active',
                price: c.price || 0,
                original_price: c.original_price || 0,
                total_problems: totalProblems || c.total_problems || 0,
                total_videos: totalVideos || c.total_videos || 0,
                total_articles: totalArticles || c.total_articles || 0,
                metadata: c.metadata || {},
                created_at: c.created_at,
                updated_at: c.updated_at,
            };
        });

        return NextResponse.json({ courses }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/courses:', err);
        return NextResponse.json({ courses: [] }, { status: 200 });
    }
}
