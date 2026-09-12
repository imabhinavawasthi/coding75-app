import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';
import { getAuthUser } from '../../_lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ classId: string }> }
) {
    try {
        const { classId } = await params;
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = getSupabaseServerClient();

        // Try querying by ID first, then by class_url_slug
        let query = supabase.from('live-classes').select('*');
        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            query = query.eq('id', classId);
        } else {
            query = query.eq('class_url_slug', classId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
            console.error('Error fetching live class:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
        }

        const userEmailLower = user.email.trim().toLowerCase();
        const rawRatings = data.ratings || {};
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

        const overallAvg = Number(data.average_ratings?.overall || data.average_ratings?.content || 0);
        const totalReviews = Number(data.average_ratings?.total_reviews || 0);

        let sanitizedClass = data;
        if (!user.isAdmin) {
            sanitizedClass = {
                ...data,
                ratings: null, // Redact comments and peer feedback
                average_ratings: {
                    overall: overallAvg,
                    total_reviews: totalReviews
                },
                has_user_rated: hasUserRated,
                user_rating: userRating
            };
        } else {
            sanitizedClass = {
                ...data,
                has_user_rated: hasUserRated,
                user_rating: userRating
            };
        }

        return NextResponse.json({ class: sanitizedClass }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/live-classes/[classId]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ classId: string }> }
) {
    try {
        const { classId } = await params;
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const body = await req.json();
        const supabase = getSupabaseServerClient();

        let query = supabase.from('live-classes').update(body);
        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            query = query.eq('id', classId);
        } else {
            query = query.eq('class_url_slug', classId);
        }

        const { data, error } = await query.select().single();

        if (error) {
            console.error('Error updating live class:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ class: data, message: 'Class updated successfully' }, { status: 200 });
    } catch (err: any) {
        console.error('Error in PUT /api/live-classes/[classId]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ classId: string }> }
) {
    try {
        const { classId } = await params;
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!user.isAdmin) {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const supabase = getSupabaseServerClient();
        let query = supabase.from('live-classes').delete();
        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            query = query.eq('id', classId);
        } else {
            query = query.eq('class_url_slug', classId);
        }

        const { error } = await query;

        if (error) {
            console.error('Error deleting live class:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Class deleted successfully' }, { status: 200 });
    } catch (err: any) {
        console.error('Error in DELETE /api/live-classes/[classId]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
