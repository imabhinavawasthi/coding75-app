import { NextResponse } from 'next/server';
import { getProblemVideoFromDb } from '@/app/api/_lib/contests-db';
import { verifyVideoToken } from '@/lib/video-encryption';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('Problem ID is required', { status: 400 });
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
            <p>This contest editorial stream is protected. Please refresh the page to generate a verified playback token.</p>
          </div>
        </body>
        </html>`,
        {
          status: 403,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      );
    }

    // Fetch problem record across contest_editorials and legacy tables
    const problem = await getProblemVideoFromDb(id);

    if (!problem || !problem.video_editorial) {
      return new NextResponse('Editorial video not found', { status: 404 });
    }

    const rawUrl = problem.video_editorial.trim();

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

    const isGoogleDrive = Boolean(driveMatch && driveMatch[1]);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${problem.problem_name ? problem.problem_name.replace(/</g, '&lt;') : 'Contest Video Editorial'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    #player-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
    }
    iframe {
      position: absolute;
      left: 0;
      width: 100%;
      border: 0;
      ${isGoogleDrive ? `
      top: -56px;
      height: calc(100% + 56px);
      ` : `
      top: 0;
      height: 100%;
      `}
    }
    ${isGoogleDrive ? `
    /* On mobile, Google Drive header is 48px-50px */
    @media (max-width: 640px) {
      iframe {
        top: -50px;
        height: calc(100% + 50px);
      }
    }
    /* Top guard strip to prevent any pixel bleed */
    #top-edge-guard {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #000;
      z-index: 10;
      pointer-events: none;
    }
    /* When in fullscreen, reset to full display */
    iframe:fullscreen,
    iframe:-webkit-full-screen {
      top: 0 !important;
      height: 100% !important;
    }
    ` : ''}
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
    ${isGoogleDrive ? `<div id="top-edge-guard"></div>` : ''}
  </div>
  <script>
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });

    window.open = function() {
      console.warn('External view popout blocked');
      return null;
    };

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
    console.error('Error in GET /api/contests/video/[id]/player:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
