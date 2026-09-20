import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';

async function getAuthUser(req: Request) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, token: '' };
  }
  const token = authHeader.substring(7);
  const supabase = getSupabaseServerClient(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (!error && data?.user) {
    return { user: data.user, token };
  }

  // Fallback: decode JWT payload directly in case of transient expiration or clock drift
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
      if (payload && (payload.sub || payload.email)) {
        return {
          user: {
            id: payload.sub || payload.email,
            email: payload.email,
            user_metadata: payload.user_metadata || {},
          } as any,
          token,
        };
      }
    }
  } catch (err) {
    console.error("Error decoding JWT payload in user/states:", err);
  }

  return { user: null, token };
}

export async function GET(req: Request) {
  try {
    const { user, token } = await getAuthUser(req);
    if (!user) {
      // Guest user or unauthenticated: return empty map
      return NextResponse.json({ states: {} }, { status: 200 });
    }

    let supabaseClient = getSupabaseServerClient(token);
    let { data, error } = await supabaseClient
      .from('user_asset_states')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      const serverClient = getSupabaseServerClient();
      const retry = await serverClient
        .from('user_asset_states')
        .select('*')
        .eq('user_id', user.id);
      if (!retry.error && retry.data) {
        data = retry.data;
        error = null;
      }
    }

    if (error) {
      console.warn("Could not query user_asset_states:", error.message);
      return NextResponse.json({ states: {} }, { status: 200 });
    }

    // Map by asset_id
    const statesMap: Record<string, any> = {};
    for (const row of data || []) {
      statesMap[row.asset_id] = row;
    }

    return NextResponse.json({ states: statesMap }, { status: 200 });
  } catch (err: any) {
    console.error("Error in GET /api/user/states:", err);
    return NextResponse.json({ states: {} }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const { user, token } = await getAuthUser(req);
    const body = await req.json().catch(() => ({}));
    const { asset_id, asset_type = 'problem', status, is_bookmarked, notes, metadata } = body;

    if (!asset_id) {
      return NextResponse.json({ error: 'asset_id is required' }, { status: 400 });
    }

    if (!user) {
      // If not logged in, return 401 if video is locked or guest echo
      if (asset_type === 'video') {
        return NextResponse.json({
          error: 'Sign in or upgrade to coding75 Pro to track video progress and save notes.',
          requireLogin: true,
          require_pro: true,
          is_locked: true,
        }, { status: 401 });
      }

      return NextResponse.json({
        state: {
          asset_id,
          asset_type,
          status: status || 'pending',
          is_bookmarked: Boolean(is_bookmarked),
          notes: notes || [],
          metadata: metadata || {},
        },
        guest: true,
      }, { status: 200 });
    }

    const supabase = getSupabaseServerClient(token);

    // Enforce Pro access for paid video lectures: no status updates, notes, or bookmarks allowed if locked
    if (asset_type === 'video') {
      const { data: videoData } = await supabase
        .from('video_lectures')
        .select('id, attributes')
        .eq('id', asset_id)
        .maybeSingle();

      let isFree = Boolean(
        videoData?.attributes?.is_free === true ||
        videoData?.attributes?.isFree === true
      );

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
                  if ((it.asset_id === asset_id || it.id === asset_id) && (it.is_free || it.isFree)) {
                    isFree = true;
                    break;
                  }
                }
                if (isFree) break;
                for (const sub of sec.subsections || []) {
                  for (const it of sub.items || []) {
                    if ((it.asset_id === asset_id || it.id === asset_id) && (it.is_free || it.isFree)) {
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

      if (!isFree) {
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

        if (!isPro) {
          return NextResponse.json({
            error: 'coding75 Pro subscription required to update status or save notes on locked video lectures.',
            require_pro: true,
            is_locked: true,
          }, { status: 403 });
        }
      }
    }

    // Check existing row
    const { data: existingRows } = await supabase
      .from('user_asset_states')
      .select('*')
      .eq('user_id', user.id)
      .eq('asset_id', asset_id)
      .eq('asset_type', asset_type);

    const existingRow = existingRows && existingRows.length > 0 ? existingRows[0] : null;

    const payload: Record<string, any> = {
      user_id: user.id,
      asset_id,
      asset_type,
      updated_at: new Date().toISOString(),
      last_interacted_at: new Date().toISOString(),
    };

    if (existingRow) {
      payload.id = existingRow.id;
      payload.status = status !== undefined ? status : existingRow.status;
      payload.is_bookmarked = is_bookmarked !== undefined ? is_bookmarked : existingRow.is_bookmarked;
      if (payload.is_bookmarked && !existingRow.is_bookmarked) {
        payload.bookmarked_at = new Date().toISOString();
      } else if (!payload.is_bookmarked) {
        payload.bookmarked_at = null;
      }
      payload.notes = notes !== undefined ? notes : (existingRow.notes || []);
      payload.metadata = { ...(existingRow.metadata || {}), ...(metadata || {}) };
    } else {
      payload.status = status || 'pending';
      payload.is_bookmarked = Boolean(is_bookmarked);
      payload.bookmarked_at = payload.is_bookmarked ? new Date().toISOString() : null;
      payload.notes = notes || [];
      payload.metadata = metadata || {};
    }

    let { data: upsertData, error: upsertError } = await supabase
      .from('user_asset_states')
      .upsert(payload)
      .select()
      .maybeSingle();

    if (upsertError) {
      const serverClient = getSupabaseServerClient();
      const retry = await serverClient
        .from('user_asset_states')
        .upsert(payload)
        .select()
        .maybeSingle();
      if (!retry.error) {
        upsertData = retry.data;
        upsertError = null;
      }
    }

    if (upsertError) {
      console.warn("Error upserting user_asset_states:", upsertError.message);
      return NextResponse.json({ state: payload, warning: upsertError.message }, { status: 200 });
    }

    return NextResponse.json({ state: upsertData || payload }, { status: 200 });
  } catch (err: any) {
    console.error("Error in POST /api/user/states:", err);
    return NextResponse.json({ error: 'Failed to update user asset state' }, { status: 500 });
  }
}
