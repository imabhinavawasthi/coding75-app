"use client";

import { useState, useEffect, useCallback } from "react";
import supabase from "@/supabase";
import { getValidAccessToken } from "@/lib/auth-client";

let cachedProStatus: {
  isPro: boolean;
  subscription: any;
  timestamp: number;
} | null = null;

const CACHE_TTL_MS = 60 * 1000; // 1 minute

export function useProStatus() {
  const [isPro, setIsPro] = useState<boolean>(() => cachedProStatus?.isPro || false);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cachedProStatus);
  const [subscription, setSubscription] = useState<any>(() => cachedProStatus?.subscription || null);

  const fetchProStatus = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && cachedProStatus && now - cachedProStatus.timestamp < CACHE_TTL_MS) {
      setIsPro(cachedProStatus.isPro);
      setSubscription(cachedProStatus.subscription);
      setIsLoading(false);
      return;
    }

    try {
      const token = await getValidAccessToken();
      if (!token) {
        cachedProStatus = { isPro: false, subscription: null, timestamp: now };
        setIsPro(false);
        setSubscription(null);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setIsPro(false);
        setSubscription(null);
        return;
      }

      const data = await res.json();
      const active = Boolean(data.is_pro || data.is_pro_active || data.user?.is_pro);
      const sub = data.pro_subscription || data.user?.pro_subscription || null;

      cachedProStatus = {
        isPro: active,
        subscription: sub,
        timestamp: now,
      };

      setIsPro(active);
      setSubscription(sub);
    } catch (err) {
      console.warn("Error checking pro status:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchProStatus(true);
    });

    const handleCustomUpdate = () => {
      fetchProStatus(true);
    };

    window.addEventListener("pro_status_updated", handleCustomUpdate);

    return () => {
      authListener?.subscription?.unsubscribe();
      window.removeEventListener("pro_status_updated", handleCustomUpdate);
    };
  }, [fetchProStatus]);

  const refreshProStatus = useCallback(async () => {
    setIsLoading(true);
    await fetchProStatus(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("pro_status_updated"));
    }
  }, [fetchProStatus]);

  return {
    isPro,
    isLoading,
    subscription,
    refreshProStatus,
  };
}
