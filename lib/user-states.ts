import supabase from "@/supabase";
import { getValidAccessToken } from "@/lib/auth-client";

export type { UserNote, UserAssetState } from "@/types/user-state";
import type { UserNote, UserAssetState } from "@/types/user-state";

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
 */
export async function fetchUserAssetStates(): Promise<Record<string, UserAssetState>> {
  try {
    const headers = await getAuthHeader();
    const res = await fetch("/api/user/states", {
      cache: "no-store",
      headers,
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.states || {};
  } catch (err) {
    console.warn("Unable to fetch user asset states from remote:", err);
    return {};
  }
}

/**
 * Save / toggle state for a specific learning asset (problem, video, or article).
 * Posts to Supabase backend API directly.
 */
export async function saveUserAssetState(payload: {
  asset_id: string;
  asset_type: "video" | "problem" | "article";
  status?: "pending" | "done" | "revision";
  is_bookmarked?: boolean;
  notes?: UserNote[];
  metadata?: Record<string, any>;
}): Promise<UserAssetState> {
  const fallback: UserAssetState = {
    asset_id: payload.asset_id,
    asset_type: payload.asset_type,
    status: payload.status || "pending",
    is_bookmarked: Boolean(payload.is_bookmarked),
    notes: payload.notes || [],
    metadata: payload.metadata || {},
    last_interacted_at: new Date().toISOString(),
  };

  try {
    const headers = await getAuthHeader();
    const res = await fetch("/api/user/states", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.state) {
        return data.state;
      }
    }
  } catch (err) {
    console.warn("Error saving user asset state:", err);
  }

  return fallback;
}
