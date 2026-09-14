import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';

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

        let query = supabase.from('courses').select('curriculum');
        if (isUUID) {
            query = query.eq('id', courseId);
        } else {
            query = query.eq('slug', courseId);
        }

        const { data, error } = await query.maybeSingle();

        if (error || !data || !Array.isArray(data.curriculum)) {
            return NextResponse.json([], { status: 200 });
        }

        // Sanitize curriculum items: strip raw Google Drive URLs to prevent external opening or scraping
        const sanitizeItem = (item: any) => {
            if (!item) return item;
            const hasDrive = typeof item.video_url === 'string' && (item.video_url.includes('drive.google.com') || item.video_url.includes('docs.google.com'));
            if (hasDrive || item.type === 'video') {
                const targetId = item.asset_id || item.id;
                return {
                    ...item,
                    video_url: targetId ? `/api/videos/${targetId}/player` : null,
                    is_protected: true,
                };
            }
            return item;
        };

        const sanitizedCurriculum = data.curriculum.map((section: any) => ({
            ...section,
            items: Array.isArray(section.items) ? section.items.map(sanitizeItem) : [],
            subsections: Array.isArray(section.subsections)
                ? section.subsections.map((sub: any) => ({
                      ...sub,
                      items: Array.isArray(sub.items) ? sub.items.map(sanitizeItem) : [],
                  }))
                : [],
        }));

        return NextResponse.json(sanitizedCurriculum, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/courses/[courseId]/curriculum:', err);
        return NextResponse.json([], { status: 200 });
    }
}
