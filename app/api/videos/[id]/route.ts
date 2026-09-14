import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';
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

        // Generate signed, tamper-proof video playback token
        const videoToken = generateVideoToken(data.id);
        const playerUrl = `/api/videos/${data.id}/player?token=${videoToken}`;

        // Sanitize: never expose raw Google Drive URL over the public API
        const sanitizedVideo = {
            ...data,
            video_url: playerUrl,
            embed_url: playerUrl,
            is_protected: true,
        };

        return NextResponse.json({ video: sanitizedVideo }, { status: 200 });
    } catch (err: any) {
        console.error('Error in GET /api/videos/[id]:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
