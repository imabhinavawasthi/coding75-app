import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';
import { getAuthUser } from '../../_lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        const { batchId } = await params;
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
        }

        const supabase = getSupabaseServerClient();

        // Fetch batch details
        const { data: batch, error: batchError } = await supabase
            .from('batches')
            .select('*')
            .eq('batch_id', batchId)
            .maybeSingle();

        if (batchError) {
            console.error('Error fetching batch:', batchError);
            return NextResponse.json({ error: batchError.message }, { status: 500 });
        }

        if (!batch) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }

        // Authorization check: Is user enrolled or admin?
        const enrolledStudents: string[] = Array.isArray(batch.enrolled_students) ? batch.enrolled_students : [];
        const isEnrolled = enrolledStudents.some(
            (email: string) => email.trim().toLowerCase() === user.email.trim().toLowerCase()
        );

        if (!isEnrolled && !user.isAdmin) {
            return NextResponse.json(
                {
                    error: 'Forbidden: You are not enrolled in this batch.',
                    batch_id: batch.batch_id,
                    batch_name: batch.batch_name,
                    isEnrolled: false
                },
                { status: 403 }
            );
        }

        // Fetch linked classes
        const classIds: string[] = Array.isArray(batch.class_ids) ? batch.class_ids : [];
        let classes: any[] = [];

        if (classIds.length > 0) {
            // Check if classIds are numeric/string IDs or slugs
            const { data: fetchedClasses, error: classesError } = await supabase
                .from('live-classes')
                .select('*')
                .in('id', classIds);

            if (!classesError && fetchedClasses && fetchedClasses.length > 0) {
                classes = fetchedClasses;
            } else {
                // Fallback attempt to query by class_url_slug if id query returned empty
                const { data: slugClasses } = await supabase
                    .from('live-classes')
                    .select('*')
                    .in('class_url_slug', classIds);
                if (slugClasses) {
                    classes = slugClasses;
                }
            }

            // Sort classes chronologically by class_time_epoch
            classes.sort((a, b) => Number(a.class_time_epoch) - Number(b.class_time_epoch));
        }

        // Sanitize feedback details for students:
        // Do NOT return individual peer feedback, category arrays, or peer comments to students.
        // Only return overall average rating and whether the current student has rated or not.
        const userEmailLower = user.email.trim().toLowerCase();
        const sanitizedClasses = classes.map(c => {
            const rawRatings = c.ratings || {};
            let hasUserRated = false;
            let userRating: any = null;

            const checkArray = (arr: any[]) => {
                if (!Array.isArray(arr)) return;
                const found = arr.find((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower);
                if (found) {
                    hasUserRated = true;
                    userRating = {
                        rating: found.rating,
                        created_at: found.created_at
                    };
                }
            };

            checkArray(rawRatings.overall);
            if (!hasUserRated) checkArray(rawRatings.content);

            const overallAvg = Number(c.average_ratings?.overall || c.average_ratings?.content || 0);
            const totalReviews = Number(c.average_ratings?.total_reviews || 0);

            if (!user.isAdmin) {
                return {
                    ...c,
                    ratings: null, // Redact peer feedback & comments
                    average_ratings: {
                        overall: overallAvg,
                        total_reviews: totalReviews
                    },
                    has_user_rated: hasUserRated,
                    user_rating: userRating
                };
            }

            return {
                ...c,
                has_user_rated: hasUserRated,
                user_rating: userRating
            };
        });

        return NextResponse.json({
            batch,
            classes: sanitizedClasses,
            isEnrolled: true,
            user: { email: user.email, isAdmin: user.isAdmin }
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in GET /api/batches/[batchId]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
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
        const { batch_name, description, enrolled_students, class_ids, attributes, new_batch_id } = body;

        const supabase = getSupabaseServerClient();

        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (batch_name !== undefined) updateData.batch_name = batch_name;
        if (description !== undefined) updateData.description = description;
        if (enrolled_students !== undefined) updateData.enrolled_students = enrolled_students;
        if (class_ids !== undefined) updateData.class_ids = class_ids;
        if (attributes !== undefined) updateData.attributes = attributes;
        if (new_batch_id !== undefined && new_batch_id.trim() !== '') {
            updateData.batch_id = new_batch_id
                .trim()
                .toLowerCase()
                .replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-')
                .replace(/^(-)+|(-)+$/g, '');
        }

        const { data, error } = await supabase
            .from('batches')
            .update(updateData)
            .eq('batch_id', batchId)
            .select()
            .single();

        if (error) {
            console.error('Error updating batch:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ batch: data, message: 'Batch updated successfully' }, { status: 200 });
    } catch (err: any) {
        console.error('Error in PUT /api/batches/[batchId]:', err);
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

        const supabase = getSupabaseServerClient();
        const { error } = await supabase
            .from('batches')
            .delete()
            .eq('batch_id', batchId);

        if (error) {
            console.error('Error deleting batch:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Batch deleted successfully' }, { status: 200 });
    } catch (err: any) {
        console.error('Error in DELETE /api/batches/[batchId]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
