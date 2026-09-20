"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Trophy,
  Network,
  Layers,
  ArrowRight,
  Sparkles,
  GraduationCap
} from "lucide-react";
import supabase from "@/supabase";
import { getValidUser } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useProStatus } from "@/hooks/use-pro-status";
import { cn } from "@/lib/utils";

export default function DashboardHeader() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const { isPro } = useProStatus();

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const validUser = await getValidUser();
        if (isMounted) setUser(validUser);
      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    }
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user || null);
        setAvatarLoadError(false);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";
  const showAvatar = Boolean(user && avatarUrl && !avatarLoadError);

  return (
    <header className="mb-8">
      <div className="relative overflow-hidden bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top greeting row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* User Avatar with subtle gradient ring - shown only when logged in and image available */}
              {showAvatar && (
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "w-13 h-13 sm:w-15 sm:h-15 rounded-2xl p-0.5 shadow-md transition-all",
                      isPro
                        ? "bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 ring-2 ring-amber-400/50 shadow-amber-500/20"
                        : "bg-gradient-to-tr from-blue-600 to-violet-500"
                    )}
                  >
                    <div className="w-full h-full rounded-[14px] bg-card overflow-hidden flex items-center justify-center">
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarLoadError(true)}
                      />
                    </div>
                  </div>
                  {isPro && (
                    <span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs ring-2 ring-card"
                      title="coding75 Pro Member"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-100" />
                    </span>
                  )}
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center flex-wrap gap-2">
                  {loadingUser ? (
                    <span className="inline-flex items-center gap-2">
                      <span>{greeting},</span>
                      <Skeleton className="h-8 w-36 sm:w-48 rounded-lg inline-block align-middle" />
                    </span>
                  ) : fullName ? (
                    <>
                      <span>{greeting},</span>
                      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                        {fullName}
                      </span>
                      {isPro && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-sm shadow-amber-500/30">
                          <Sparkles className="w-3 h-3 text-amber-100" />
                          <span>PRO</span>
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl">👋</span>
                    </>
                  ) : (
                    <>
                      <span>Welcome to</span>
                      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                        CrackDSA
                      </span>
                      {isPro && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-sm shadow-amber-500/30">
                          <Sparkles className="w-3 h-3 text-amber-100" />
                          <span>PRO</span>
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl">🚀</span>
                    </>
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Welcome to your personalized dashboard! Here you can track your DSA progress, access curated problem sheets, and explore live classes to supercharge your coding journey.
                </p>
              </div>
            </div>

            {/* Top Right Quick Pro CTA Badge */}
            <div className="shrink-0 self-start sm:self-center">
              {isPro ? (
                <Link
                  href="/pro/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-2xs group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                  <span>View Pro Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/pro"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 transition-all shadow-md shadow-amber-500/25 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform" />
                  <span>Get coding75 Pro</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
            {/* 1. Explore DSA */}
            <Link
              href="/dsa"
              className="group relative overflow-hidden flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-muted/30 hover:bg-muted/70 hover:border-amber-500/40 transition-all duration-200 shadow-2xs hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-amber-500/25">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  DSA Roadmap
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  18+ Core Modules
                </div>
              </div>
            </Link>

            {/* 2. Topic Tree Roadmap */}
            <Link
              href="/dsa/topic-tree"
              className="group relative overflow-hidden flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-muted/30 hover:bg-muted/70 hover:border-violet-500/40 transition-all duration-200 shadow-2xs hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-violet-500/25">
                <Network className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                    Topic Tree
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30">
                    New
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  Interactive Graph
                </div>
              </div>
            </Link>

            {/* 3. Practice Sheets */}
            <Link
              href="/dsa/sheets"
              className="group relative overflow-hidden flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-muted/30 hover:bg-muted/70 hover:border-emerald-500/40 transition-all duration-200 shadow-2xs hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-emerald-500/25">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  Practice Sheets
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  Blind 75 & Pattern Mastery
                </div>
              </div>
            </Link>

            {/* 4. Contest Archive */}
            <Link
              href="/contests"
              className="group relative overflow-hidden flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-muted/30 hover:bg-muted/70 hover:border-blue-500/40 transition-all duration-200 shadow-2xs hover:shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-blue-500/25">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  Contest Arena
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  500+ Video Solutions
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}