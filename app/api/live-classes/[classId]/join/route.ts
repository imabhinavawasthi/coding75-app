import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';
import { getAuthUser } from '../../../_lib/auth';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ classId: string }> }
) {
    try {
        const { classId } = await params;
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const supabase = getSupabaseServerClient();

        // Fetch current live class data
        let query = supabase.from('live-classes').select('*');
        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            query = query.eq('id', classId);
        } else {
            query = query.eq('class_url_slug', classId);
        }

        const { data: liveClass, error: fetchError } = await query.maybeSingle();

        if (fetchError || !liveClass) {
            return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
        }

        const currentStudentsJoined: string[] = Array.isArray(liveClass.students_joined) ? liveClass.students_joined : [];
        const currentAttendance: any[] = Array.isArray(liveClass.attendance) ? liveClass.attendance : [];

        // Add to students_joined if not already present
        const userEmailLower = user.email.trim().toLowerCase();
        let updatedStudentsJoined = [...currentStudentsJoined];
        if (!currentStudentsJoined.some(e => e.trim().toLowerCase() === userEmailLower)) {
            updatedStudentsJoined.push(user.email);
        }

        // Add to attendance list if not already present
        let updatedAttendance = [...currentAttendance];
        const existingAttendance = currentAttendance.find(
            (record: any) => typeof record === 'object' && record?.user_email?.toLowerCase() === userEmailLower
        );

        if (!existingAttendance) {
            updatedAttendance.push({
                user_email: user.email,
                user_id: user.id,
                joined_at: new Date().toISOString(),
            });
        }

        // Update database
        let updateQuery = supabase
            .from('live-classes')
            .update({
                students_joined: updatedStudentsJoined,
                attendance: updatedAttendance,
            });

        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            updateQuery = updateQuery.eq('id', classId);
        } else {
            updateQuery = updateQuery.eq('class_url_slug', classId);
        }

        const { error: updateError } = await updateQuery;

        if (updateError) {
            console.error('Error updating attendance for class:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Attendance logged successfully',
            class_link: liveClass.class_link,
            students_joined_count: updatedStudentsJoined.length,
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in POST /api/live-classes/[classId]/join:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
