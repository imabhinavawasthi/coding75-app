import supabase from "@/supabase";
import { Session, User } from "@supabase/supabase-js";

/**
 * Retrieves a guaranteed valid Supabase session.
 * Proactively refreshes the access token if it is expired or expiring within 60 seconds.
 */
export async function getValidSession(): Promise<Session | null> {
  if (typeof window === "undefined") return null;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    const now = Math.floor(Date.now() / 1000);

    if (error || !session) {
      // Fallback: If session is null/expired, check localStorage for a valid refresh token and exchange it
      try {
        const storageKeys = Object.keys(localStorage);
        const authKey = storageKeys.find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
        if (authKey) {
          const raw = localStorage.getItem(authKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            const refreshToken = parsed?.refresh_token;
            if (refreshToken) {
              const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({
                refresh_token: refreshToken,
              });
              if (!refreshError && refreshed?.session) {
                return refreshed.session;
              }
            }
          }
        }
      } catch (e) {
        console.warn("Stored refresh_token recovery error:", e);
      }
      return null;
    }

    const expiresAt = session.expires_at || 0;

    // If token is expired or within 60 seconds of expiration, proactively refresh it
    if (expiresAt - now < 60) {
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshError && refreshed?.session) {
        return refreshed.session;
      }
      // If refresh fails due to momentary network failure but session hasn't strictly expired yet, return it
      if (expiresAt > now) {
        return session;
      }
      return null;
    }

    return session;
  } catch (err) {
    console.warn("Error getting or refreshing Supabase session:", err);
    return null;
  }
}

/**
 * Returns a guaranteed valid access token string for API Authorization headers.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const session = await getValidSession();
  return session?.access_token || null;
}

/**
 * Returns the currently authenticated user from a valid session.
 */
export async function getValidUser(): Promise<User | null> {
  const session = await getValidSession();
  return session?.user || null;
}
