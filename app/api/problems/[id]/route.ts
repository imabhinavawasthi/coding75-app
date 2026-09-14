import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Problem ID is required' }, { status: 400 });
        }

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

        return NextResponse.json({ problem: data }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/problems/[id]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
