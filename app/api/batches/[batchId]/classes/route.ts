import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';
import { getAuthUser } from '../../../_lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        const { batchId } = await params;
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const { class_id, class_ids } = body;

        const incomingClassIds: string[] = [];
        if (class_id) incomingClassIds.push(class_id);
        if (Array.isArray(class_ids)) incomingClassIds.push(...class_ids);

        if (incomingClassIds.length === 0) {
            return NextResponse.json({ error: 'class_id or class_ids is required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();

        const { data: batch, error: fetchError } = await supabase
            .from('batches')
            .select('id, batch_id, class_ids')
            .eq('batch_id', batchId)
            .maybeSingle();

        if (fetchError || !batch) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }

        const currentClasses: string[] = Array.isArray(batch.class_ids) ? batch.class_ids : [];
        const merged = Array.from(new Set([...currentClasses, ...incomingClassIds]));

        const { data: updatedBatch, error: updateError } = await supabase
            .from('batches')
            .update({
                class_ids: merged,
                updated_at: new Date().toISOString()
            })
            .eq('batch_id', batchId)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Classes assigned to batch successfully',
            batch: updatedBatch
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in POST /api/batches/[batchId]/classes:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        const { batchId } = await params;
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const classId = searchParams.get('classId');

        if (!classId) {
            return NextResponse.json({ error: 'classId query param is required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();

        const { data: batch, error: fetchError } = await supabase
            .from('batches')
            .select('id, batch_id, class_ids')
            .eq('batch_id', batchId)
            .maybeSingle();

        if (fetchError || !batch) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }

        const currentClasses: string[] = Array.isArray(batch.class_ids) ? batch.class_ids : [];
        const filtered = currentClasses.filter(c => c !== classId);

        const { data: updatedBatch, error: updateError } = await supabase
            .from('batches')
            .update({
                class_ids: filtered,
                updated_at: new Date().toISOString()
            })
            .eq('batch_id', batchId)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Class removed from batch successfully',
            batch: updatedBatch
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in DELETE /api/batches/[batchId]/classes:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
