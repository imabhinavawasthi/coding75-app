import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';
import { getAuthUser } from '../../_lib/auth';
import { generateVideoToken } from '@/lib/video-encryption';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
        }

        const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
        let token = '';
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }

        const supabase = getSupabaseServerClient(token);

        // 1. Fetch video lecture record from database
        const { data, error } = await supabase
            .from('video_lectures')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error(`Error fetching video ${id}:`, error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Video lecture not found' }, { status: 404 });
        }

        // 2. Check if video is marked as free preview
        let isFree = Boolean(
            data.is_free === true ||
            data.isFree === true ||
            data.attributes?.is_free === true ||
            data.attributes?.isFree === true
        );

        // If not explicitly marked on video_lectures, check course curriculum for free tag
        if (!isFree) {
            const { data: courseData } = await supabase
                .from('courses')
                .select('curriculum')
                .limit(5);

            if (courseData && Array.isArray(courseData)) {
                for (const c of courseData) {
                    if (Array.isArray(c.curriculum)) {
                        for (const sec of c.curriculum) {
                            for (const it of sec.items || []) {
                                if ((it.asset_id === data.id || it.id === data.id) && (it.is_free || it.isFree)) {
                                    isFree = true;
                                    break;
                                }
                            }
                            if (isFree) break;
                            for (const sub of sec.subsections || []) {
                                for (const it of sub.items || []) {
                                    if ((it.asset_id === data.id || it.id === data.id) && (it.is_free || it.isFree)) {
                                        isFree = true;
                                        break;
                                    }
                                }
                                if (isFree) break;
                            }
                            if (isFree) break;
                        }
                    }
                    if (isFree) break;
                }
            }
        }

        // 3. Check user authentication and Pro subscription status
        const user = await getAuthUser(req);
        let isPro = false;

        if (user && user.email) {
            const { data: userRow } = await supabase
                .from('users')
                .select('pro_subscription')
                .eq('user_email', user.email)
                .maybeSingle();

            const proSub = userRow?.pro_subscription || {};
            const activeTill = typeof proSub.subscription_active_till_epoch === 'number'
                ? proSub.subscription_active_till_epoch
                : 0;
            const nowEpoch = Math.floor(Date.now() / 1000);
            isPro = Boolean(
                proSub.is_pro || 
                activeTill === -1 || 
                activeTill > nowEpoch
            );
        }

        // 4. Access Evaluation: Free videos are open to all; paid videos require active Pro
        const canAccess = isFree || isPro;

        if (canAccess) {
            // Generate signed, tamper-proof playback token
            const videoToken = generateVideoToken(data.id);
            const playerUrl = `/api/videos/${data.id}/player?token=${videoToken}`;

            const sanitizedVideo = {
                ...data,
                is_free: isFree,
                is_locked: false,
                video_url: playerUrl,
                embed_url: playerUrl,
                is_protected: true,
            };

            return NextResponse.json({
                video: sanitizedVideo,
                is_locked: false,
                is_free: isFree,
                is_pro: isPro,
            }, { status: 200 });
        }

        // 5. Gated State: Return basic metadata but omit video stream links
        const basicVideo = {
            id: data.id,
            title: data.title,
            description: data.description,
            duration_seconds: data.duration_seconds,
            thumbnail_url: data.thumbnail_url,
            resources: data.resources,
            attributes: data.attributes,
            is_free: false,
            is_locked: true,
            require_pro: true,
            video_url: null,
            embed_url: null,
            is_protected: true,
        };

        return NextResponse.json({
            video: basicVideo,
            is_locked: true,
            require_pro: true,
            requireLogin: !user,
            is_free: false,
            is_pro: false,
            message: !user
                ? 'Sign in or upgrade to coding75 Pro to watch this video lecture.'
                : 'This video lecture is exclusively available to coding75 Pro members.',
        }, { status: 200 });

    } catch (err: any) {
        console.error('Error in GET /api/videos/[id]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
