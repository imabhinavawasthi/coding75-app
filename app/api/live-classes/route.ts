import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../_lib/supabase-server';
import { getAuthUser } from '../_lib/auth';

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getSupabaseServerClient();
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '200');
        const topic = searchParams.get('topic');
        const search = searchParams.get('search');

        let query = supabase
            .from('live-classes')
            .select('*')
            .order('class_time_epoch', { ascending: false })
            .limit(limit);

        if (topic && topic !== 'all') {
            query = query.eq('class_topic', topic);
        }

        if (search) {
            query = query.ilike('class_name', `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching live classes:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ classes: data || [] }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/live-classes:', err);
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
        const {
            class_name,
            class_link,
            instructor_name,
            class_topic,
            class_subtopics,
            class_time_epoch,
            class_duration,
            class_url_slug,
            class_recording,
            class_notes,
            batch_id,
            batch_ids,
            attendance,
            students_joined,
            ratings,
            average_ratings,
        } = body;

        if (!class_name || !class_time_epoch) {
            return NextResponse.json({ error: 'class_name and class_time_epoch are required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();

        const slug = class_url_slug || `${class_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

        const initialStudentsJoined = Array.isArray(students_joined) ? students_joined : [];
        const initialAttendance = Array.isArray(attendance) ? attendance : (
            initialStudentsJoined.map(email => ({
                user_email: email,
                joined_at: new Date(Number(class_time_epoch) * 1000).toISOString(),
                manually_added: true
            }))
        );

        const newClass = {
            class_name,
            class_link: class_link || '',
            instructor_name: instructor_name || '',
            class_topic: class_topic || 'dsa',
            class_subtopics: Array.isArray(class_subtopics) ? class_subtopics : (typeof class_subtopics === 'string' ? class_subtopics.split(',').map(s => s.trim()).filter(Boolean) : []),
            class_time_epoch: Number(class_time_epoch),
            class_duration: Number(class_duration) || 60,
            class_url_slug: slug,
            class_recording: class_recording || '',
            class_notes: class_notes || '',
            students_joined: initialStudentsJoined,
            attendance: initialAttendance,
            ratings: ratings || { content: [], doubts: [], engagement: [], overall: [] },
            average_ratings: average_ratings || { content: 0, doubts: 0, engagement: 0, overall: 0, total_reviews: 0 }
        };

        const { data: createdClass, error } = await supabase
            .from('live-classes')
            .insert([newClass])
            .select()
            .single();

        if (error) {
            console.error('Error creating live class:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Handle batch assignment if requested
        const targetBatchIds: string[] = [];
        if (batch_id) targetBatchIds.push(batch_id);
        if (Array.isArray(batch_ids)) targetBatchIds.push(...batch_ids);

        const uniqueBatchIds = Array.from(new Set(targetBatchIds.filter(Boolean)));
        const classIdentifier = createdClass?.id || slug;

        if (uniqueBatchIds.length > 0) {
            for (const bId of uniqueBatchIds) {
                const { data: batchData } = await supabase
                    .from('batches')
                    .select('id, batch_id, class_ids')
                    .eq('batch_id', bId)
                    .maybeSingle();

                if (batchData) {
                    const currentClassIds: string[] = Array.isArray(batchData.class_ids) ? batchData.class_ids : [];
                    if (!currentClassIds.includes(classIdentifier) && !currentClassIds.includes(slug)) {
                        await supabase
                            .from('batches')
                            .update({
                                class_ids: [...currentClassIds, classIdentifier],
                                updated_at: new Date().toISOString()
                            })
                            .eq('batch_id', bId);
                    }
                }
            }
        }

        return NextResponse.json({
            class: createdClass,
            assigned_batches: uniqueBatchIds,
            message: 'Live class created successfully'
        }, { status: 201 });
    } catch (err: any) {
        console.error('Error in POST /api/live-classes:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
