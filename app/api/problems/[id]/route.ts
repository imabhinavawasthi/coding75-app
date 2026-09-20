import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';
import { getAuthUser } from '../../_lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Problem ID is required' }, { status: 400 });
        }

        const user = await getAuthUser(req);
        const isLoggedIn = Boolean(user);

        const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
        let token = '';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        const supabase = getSupabaseServerClient(token);
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let query = supabase.from('practice_problems').select('*');
        if (isUUID) {
            query = query.eq('id', id);
        } else {
            query = query.eq('slug', id);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
            console.error(`Error fetching problem ${id}:`, error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Practice problem not found' }, { status: 404 });
        }

        // If user is not authenticated, redact paid editorial and solution content
        if (!isLoggedIn) {
            const hasEditorial = Boolean(
                data.editorial ||
                data.video_editorial ||
                (data.resources?.video_lectures && data.resources.video_lectures.length > 0)
            );

            const redactedProblem = {
                ...data,
                solutions: null,
                editorial: null,
                video_editorial: null,
                editorial_code: null,
                resources: {
                    ...(data.resources || {}),
                    video_lectures: [],
                },
                is_locked: true,
                has_editorial: hasEditorial,
            };

            return NextResponse.json({ problem: redactedProblem, is_locked: true }, { status: 200 });
        }

        return NextResponse.json({ problem: data, is_locked: false }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/problems/[id]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
