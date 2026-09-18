import supabase from "@/supabase";
import { getValidAccessToken } from "@/lib/auth-client";

export interface UserNote {
  id: string;
  text: string;
  created_at: string;
}

export interface UserAssetState {
  id?: string;
  user_id?: string;
  asset_id: string;
  asset_type: "video" | "problem" | "article";
  status: "pending" | "done" | "revision";
  is_bookmarked?: boolean;
  bookmarked_at?: string | null;
  notes?: UserNote[];
  metadata?: Record<string, any>;
  last_interacted_at?: string;
}

const LOCAL_STORAGE_KEY = "coding75_user_asset_states";

function getLocalStates(): Record<string, UserAssetState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalStates(states: Record<string, UserAssetState>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(states));
  } catch {}
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};
  try {
    const token = await getValidAccessToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {}
  return {};
}

/**
 * Fetch all user asset states for the active user.
 * Merges Supabase remote rows with local cache.
 */
export async function fetchUserAssetStates(): Promise<Record<string, UserAssetState>> {
  const local = getLocalStates();
  try {
    const headers = await getAuthHeader();
    const res = await fetch("/api/user/states", {
      cache: "no-store",
      headers,
    });
    if (!res.ok) return local;
    const data = await res.json();
    const remote = data.states || {};
    const merged = { ...local, ...remote };
    setLocalStates(merged);
    return merged;
  } catch (err) {
    console.warn("Unable to fetch user asset states from remote:", err);
    return local;
  }
}

/**
 * Save / toggle state for a specific learning asset (problem, video, or article).
 * Optimistically updates local cache and posts to Supabase.
 */
export async function saveUserAssetState(payload: {
  asset_id: string;
  asset_type: "video" | "problem" | "article";
  status?: "pending" | "done" | "revision";
  is_bookmarked?: boolean;
  notes?: UserNote[];
  metadata?: Record<string, any>;
}): Promise<UserAssetState> {
  const local = getLocalStates();
  const existing = local[payload.asset_id] || {
    asset_id: payload.asset_id,
    asset_type: payload.asset_type,
    status: "pending",
    is_bookmarked: false,
    notes: [],
    metadata: {},
  };

  const updated: UserAssetState = {
    ...existing,
    ...payload,
    last_interacted_at: new Date().toISOString(),
  };

  local[payload.asset_id] = updated;
  setLocalStates(local);

  // Background sync to server & Supabase
  try {
    const headers = await getAuthHeader();
    fetch("/api/user/states", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(payload),
    }).catch((err) => console.warn("Background state sync error:", err));
  } catch {}

  return updated;
}
