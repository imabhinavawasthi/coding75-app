import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../../_lib/supabase-server';
import { verifyVideoToken } from '@/lib/video-encryption';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return new NextResponse('Video ID is required', { status: 400 });
        }

        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token') || '';

        // Verify cryptographic access token
        const isValid = verifyVideoToken(token, id);
        if (!isValid) {
            return new NextResponse(
                `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Playback Protected</title>
                    <style>
                        body { background: #0b0f17; color: #94a3b8; font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .card { text-align: center; padding: 2rem; border-radius: 1rem; border: 1px solid #1e293b; background: #0f172a; max-width: 400px; }
                        h2 { color: #f8fafc; font-size: 1.1rem; margin-bottom: 0.5rem; }
                        p { font-size: 0.85rem; line-height: 1.5; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>Playback Session Expired</h2>
                        <p>This video stream is protected. Please refresh the classroom page to generate a verified playback token.</p>
                    </div>
                </body>
                </html>`,
                {
                    status: 403,
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                }
            );
        }

        // Fetch video lecture record from database
        const supabase = getSupabaseServerClient();
        const { data: video, error } = await supabase
            .from('video_lectures')
            .select('id, title, video_url')
            .eq('id', id)
            .maybeSingle();

        if (error || !video || !video.video_url) {
            return new NextResponse('Video lecture not found', { status: 404 });
        }

        const rawUrl = video.video_url.trim();

        // Extract embed preview URL
        let previewEmbedUrl = '';
        const driveMatch = rawUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]+)/);
        
        if (driveMatch && driveMatch[1]) {
            previewEmbedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        } else if (rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')) {
            const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            if (ytMatch && ytMatch[1]) {
                previewEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
            }
        } else {
            previewEmbedUrl = rawUrl;
        }

        // Return protected HTML stream wrapper
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${video.title ? video.title.replace(/</g, '&lt;') : 'Lecture Player'}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
            user-select: none;
            -webkit-user-select: none;
        }
        #player-container {
            position: relative;
            width: 100%;
            height: 100%;
            background: #000;
        }
        iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
        /* Shield 1: Blocks Google Drive's top-right "Pop-out" / open in separate window button */
        #shield-popout {
            position: absolute;
            top: 0;
            right: 0;
            width: 90px;
            height: 58px;
            z-index: 99999;
            background: transparent;
            cursor: default;
            pointer-events: auto;
        }
        /* Shield 2: Blocks Google Drive's top title bar and file details */
        #shield-topbar {
            position: absolute;
            top: 0;
            left: 0;
            right: 90px;
            height: 52px;
            z-index: 99998;
            background: transparent;
            cursor: default;
            pointer-events: auto;
        }
    </style>
</head>
<body oncontextmenu="return false;">
    <div id="player-container">
        <iframe
            id="protected-frame"
            src="${previewEmbedUrl}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowfullscreen
            sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
        <!-- Physical Click Shields to prevent opening Google Drive externally -->
        <div id="shield-popout" title=""></div>
        <div id="shield-topbar" title=""></div>
    </div>
    <script>
        // Disable right click inside player
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // Block popups and window.open redirects
        window.open = function() {
            console.warn('External view popout blocked');
            return null;
        };

        // Intercept clicks on shield overlays
        var shield = document.getElementById('shield-popout');
        if (shield) {
            shield.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        }
        var topShield = document.getElementById('shield-topbar');
        if (topShield) {
            topShield.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        }

        // Prevent common keyboard dev shortcuts inside frame
        window.addEventListener('keydown', function(e) {
            if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
                e.preventDefault();
                return false;
            }
        });
    </script>
</body>
</html>`;

        return new NextResponse(html, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Frame-Options': 'SAMEORIGIN',
                'Content-Security-Policy': "frame-ancestors 'self' http://localhost:3000 https://crackdsa.com https://*.crackdsa.com;",
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            },
        });
    } catch (err: any) {
        console.error('Error in GET /api/videos/[id]/player:', err);
        return new NextResponse('Internal server error', { status: 500 });
    }
}
