import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../_lib/supabase-server';
import { getAuthUser } from '../_lib/auth';

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const supabase = getSupabaseServerClient();
        const { searchParams } = new URL(req.url);
        const all = searchParams.get('all');

        let query = supabase.from('batches').select('*').order('created_at', { ascending: false });

        // If not admin and not explicitly requesting all, filter to enrolled batches
        if (!user.isAdmin) {
            query = query.contains('enrolled_students', JSON.stringify([user.email]));
        } else if (all === 'false') {
            query = query.contains('enrolled_students', JSON.stringify([user.email]));
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching batches:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ batches: data || [] }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/batches:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const { batch_id, batch_name, description, enrolled_students, class_ids, attributes } = body;

        if (!batch_id || !batch_name) {
            return NextResponse.json({ error: 'batch_id and batch_name are required' }, { status: 400 });
        }

        // Clean slug
        const cleanBatchId = String(batch_id)
            .trim()
            .toLowerCase()
            .replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-')
            .replace(/^(-)+|(-)+$/g, '');

        const supabase = getSupabaseServerClient();

        // Check if batch_id already exists
        const { data: existing } = await supabase
            .from('batches')
            .select('id')
            .eq('batch_id', cleanBatchId)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: `Batch with ID '${cleanBatchId}' already exists.` }, { status: 409 });
        }

        const newBatch = {
            batch_id: cleanBatchId,
            batch_name: batch_name.trim(),
            description: description || '',
            enrolled_students: Array.isArray(enrolled_students) ? enrolled_students : [],
            class_ids: Array.isArray(class_ids) ? class_ids : [],
            attributes: typeof attributes === 'object' && attributes !== null ? attributes : {},
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('batches')
            .insert([newBatch])
            .select()
            .single();

        if (error) {
            console.error('Error inserting batch:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ batch: data, message: 'Batch created successfully' }, { status: 201 });
    } catch (err: any) {
        console.error('Error in POST /api/batches:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
