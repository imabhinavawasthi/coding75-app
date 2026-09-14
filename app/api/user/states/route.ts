import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../_lib/supabase-server';

async function getAuthUser(req: Request) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, token: '' };
  }
  const token = authHeader.substring(7);
  const supabase = getSupabaseServerClient(token);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { user: null, token };
  }
  return { user, token };
}

export async function GET(req: Request) {
  try {
    const { user, token } = await getAuthUser(req);
    if (!user) {
      // Guest user or unauthenticated: return empty map
      return NextResponse.json({ states: {} }, { status: 200 });
    }

    const supabase = getSupabaseServerClient(token);
    const { data, error } = await supabase
      .from('user_asset_states')
      .select('*')
      .eq('user_id', user.id);

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
      // If not logged in, return success echo so client falls back to localStorage
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

    const { data: upsertData, error: upsertError } = await supabase
      .from('user_asset_states')
      .upsert(payload)
      .select()
      .maybeSingle();

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
