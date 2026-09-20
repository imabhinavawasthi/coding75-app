"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Lock, Sparkles, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import supabase from "@/supabase";

interface LoginRequiredProps {
  title?: string;
  description?: string;
  featureName?: string;
}

export default function LoginRequiredPage({
  title = "Authentication Required",
  description = "Please sign in to access this feature, track your roadmap progress, and sync your personalized workspace.",
  featureName = "Exclusive Content",
}: LoginRequiredProps) {
  const pathname = usePathname();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("loggedin_route", pathname || window.location.pathname);
      }
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/login/callback`
          : undefined;

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
    } catch (err) {
      console.error("LoginRequiredPage Google OAuth error:", err);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="w-full py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="relative w-full max-w-lg rounded-3xl border border-primary/20 bg-card p-6 sm:p-10 text-center space-y-6 shadow-xl overflow-hidden">
        {/* Ambient background accents */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-center shadow-lg shadow-primary/10">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{featureName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>

        {/* Feature bullets */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-left text-xs">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Resume Builder with industry-tested ATS formats</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant export to PDF and multi-profile sync</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Synced across all your devices securely</span>
          </div>
        </div>

        {/* Continue with Google CTA */}
        <div className="pt-2 relative z-10 space-y-3">
          <Button
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            className="w-full h-11 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md gap-2.5 transition-all cursor-pointer"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </Button>
          <p className="text-[11px] text-muted-foreground">
            Sign in is free & instant. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}