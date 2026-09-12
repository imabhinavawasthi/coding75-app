import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';
import { getAuthUser } from '../../../_lib/auth';

function calculateAverage(arr: any[]): number {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((acc, curr) => acc + (Number(curr?.rating) || 0), 0);
    return Math.round((sum / arr.length) * 10) / 10;
}

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

        const body = await req.json();
        const { content, doubts, engagement, overall, comment, student_email, bulk_ratings } = body;

        const isBulk = Array.isArray(bulk_ratings) && bulk_ratings.length > 0;

        // Validation
        if (!isBulk && content === undefined && doubts === undefined && engagement === undefined && overall === undefined) {
            return NextResponse.json({ error: 'At least one rating parameter or bulk_ratings is required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();

        // Fetch current class ratings
        let query = supabase.from('live-classes').select('id, class_url_slug, ratings, average_ratings');
        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            query = query.eq('id', classId);
        } else {
            query = query.eq('class_url_slug', classId);
        }

        const { data: liveClass, error: fetchError } = await query.maybeSingle();

        if (fetchError || !liveClass) {
            return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
        }

        const currentRatings = liveClass.ratings || {
            content: [],
            doubts: [],
            engagement: [],
            overall: []
        };

        // If non-admin user has already rated this class, reject duplicate submission
        if (!user.isAdmin) {
            const userEmailLower = user.email.trim().toLowerCase();
            const alreadyRated =
                (Array.isArray(currentRatings.overall) && currentRatings.overall.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower)) ||
                (Array.isArray(currentRatings.content) && currentRatings.content.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower)) ||
                (Array.isArray(currentRatings.doubts) && currentRatings.doubts.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower)) ||
                (Array.isArray(currentRatings.engagement) && currentRatings.engagement.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower));

            if (alreadyRated) {
                return NextResponse.json({ error: 'You have already submitted a rating for this class.' }, { status: 400 });
            }
        }

        const timestamp = new Date().toISOString();

        let updatedContent = Array.isArray(currentRatings.content) ? [...currentRatings.content] : [];
        let updatedDoubts = Array.isArray(currentRatings.doubts) ? [...currentRatings.doubts] : [];
        let updatedEngagement = Array.isArray(currentRatings.engagement) ? [...currentRatings.engagement] : [];
        let updatedOverall = Array.isArray(currentRatings.overall) ? [...currentRatings.overall] : [];

        const applyRatingToArrays = (targetEmail: string, cVal?: number, dVal?: number, eVal?: number, oVal?: number, comm?: string) => {
            const emailLower = targetEmail.trim().toLowerCase();
            const overallScore = oVal ?? cVal ?? 5;

            const upsertIntoParam = (list: any[], val: number | undefined) => {
                if (val === undefined || isNaN(Number(val))) return;
                const idx = list.findIndex((r: any) => r.user_email?.toLowerCase() === emailLower);
                const ratingObj = {
                    user_email: targetEmail.trim(),
                    rating: Math.min(5, Math.max(1, Number(val))),
                    comment: comm || '',
                    created_at: timestamp
                };
                if (idx >= 0) {
                    list[idx] = ratingObj;
                } else {
                    list.push(ratingObj);
                }
            };

            upsertIntoParam(updatedContent, cVal);
            upsertIntoParam(updatedDoubts, dVal);
            upsertIntoParam(updatedEngagement, eVal);
            upsertIntoParam(updatedOverall, overallScore);
        };

        if (isBulk && user.isAdmin) {
            for (const item of bulk_ratings) {
                if (item?.student_email) {
                    applyRatingToArrays(
                        item.student_email,
                        item.content,
                        item.doubts,
                        item.engagement,
                        item.overall,
                        item.comment
                    );
                }
            }
        } else {
            const targetEmail = (user.isAdmin && student_email) ? student_email.trim() : user.email;
            applyRatingToArrays(targetEmail, content, doubts, engagement, overall, comment);
        }

        const updatedRatings = {
            content: updatedContent,
            doubts: updatedDoubts,
            engagement: updatedEngagement,
            overall: updatedOverall,
        };

        const updatedAverages = {
            content: calculateAverage(updatedRatings.content),
            doubts: calculateAverage(updatedRatings.doubts),
            engagement: calculateAverage(updatedRatings.engagement),
            overall: calculateAverage(updatedRatings.overall),
            total_reviews: updatedRatings.overall.length
        };

        // Update database
        let updateQuery = supabase
            .from('live-classes')
            .update({
                ratings: updatedRatings,
                average_ratings: updatedAverages
            });

        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            updateQuery = updateQuery.eq('id', classId);
        } else {
            updateQuery = updateQuery.eq('class_url_slug', classId);
        }

        const { error: updateError } = await updateQuery;

        if (updateError) {
            console.error('Error saving rating:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Rating submitted successfully',
            ratings: updatedRatings,
            average_ratings: updatedAverages
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in POST /api/live-classes/[classId]/rate:', err);
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

        const { searchParams } = new URL(req.url);
        const emailToDelete = searchParams.get('email');

        if (!emailToDelete) {
            return NextResponse.json({ error: 'email query param is required' }, { status: 400 });
        }

        const supabase = getSupabaseServerClient();

        let query = supabase.from('live-classes').select('id, class_url_slug, ratings, average_ratings');
        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            query = query.eq('id', classId);
        } else {
            query = query.eq('class_url_slug', classId);
        }

        const { data: liveClass, error: fetchError } = await query.maybeSingle();

        if (fetchError || !liveClass) {
            return NextResponse.json({ error: 'Live class not found' }, { status: 404 });
        }

        const filterOutEmail = (arr: any[]) =>
            Array.isArray(arr) ? arr.filter((r: any) => r?.user_email?.toLowerCase() !== emailToDelete.toLowerCase()) : [];

        const updatedRatings = {
            content: filterOutEmail(liveClass.ratings?.content),
            doubts: filterOutEmail(liveClass.ratings?.doubts),
            engagement: filterOutEmail(liveClass.ratings?.engagement),
            overall: filterOutEmail(liveClass.ratings?.overall)
        };

        const updatedAverages = {
            content: calculateAverage(updatedRatings.content),
            doubts: calculateAverage(updatedRatings.doubts),
            engagement: calculateAverage(updatedRatings.engagement),
            overall: calculateAverage(updatedRatings.overall),
            total_reviews: updatedRatings.overall.length
        };

        let updateQuery = supabase
            .from('live-classes')
            .update({
                ratings: updatedRatings,
                average_ratings: updatedAverages
            });

        if (/^[0-9a-fA-F-]{36}$/.test(classId) || /^\d+$/.test(classId)) {
            updateQuery = updateQuery.eq('id', classId);
        } else {
            updateQuery = updateQuery.eq('class_url_slug', classId);
        }

        const { error: updateError } = await updateQuery;

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Rating removed successfully',
            ratings: updatedRatings,
            average_ratings: updatedAverages
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in DELETE /api/live-classes/[classId]/rate:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
