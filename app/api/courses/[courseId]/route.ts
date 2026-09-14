import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { courseId } = await params;
        if (!courseId) {
            return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
        }

        const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
        let token = '';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        const supabase = getSupabaseServerClient(token);
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);

        let query = supabase.from('courses').select('*');
        if (isUUID) {
            query = query.eq('id', courseId);
        } else {
            query = query.eq('slug', courseId);
        }

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
            if (error) {
                console.warn(`Supabase query for course '${courseId}' encountered error:`, error.message);
            }
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        // Hydrate instructors if instructor_ids are present
        let instructors: any[] = [];
        const instructorIds = Array.isArray(data.instructor_ids) ? data.instructor_ids : [];
        if (instructorIds.length > 0) {
            const { data: instData } = await supabase
                .from('instructors')
                .select('*')
                .in('id', instructorIds);
            if (instData && instData.length > 0) {
                instructors = instData.map((inst: any) => ({
                    id: inst.id,
                    name: inst.name,
                    role: inst.role,
                    company: inst.company || 'CrackDSA & Coding75',
                    color: inst.color || 'from-blue-600 to-indigo-600',
                    profile_image_url: inst.profile_image_url || '',
                    bio: inst.bio || '',
                }));
            }
        }

        const rawCurriculum = Array.isArray(data.curriculum) ? data.curriculum : [];

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

        for (const sec of rawCurriculum) {
            countItems(sec.items);
            for (const sub of sec.subsections || []) {
                countItems(sub.items);
            }
        }

        const course = {
            id: data.id,
            slug: data.slug || data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            instructor_ids: data.instructor_ids || [],
            instructors,
            tags: data.tags || [],
            is_pro: data.is_pro ?? true,
            is_popular: data.is_popular ?? false,
            status: data.status || 'active',
            price: data.price || 0,
            original_price: data.original_price || 0,
            total_problems: totalProblems || data.total_problems || 0,
            total_videos: totalVideos || data.total_videos || 0,
            total_articles: totalArticles || data.total_articles || 0,
            curriculum: rawCurriculum,
            sections: rawCurriculum,
            metadata: data.metadata || {},
            created_at: data.created_at,
            updated_at: data.updated_at,
        };

        return NextResponse.json({ course }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/courses/[courseId]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
