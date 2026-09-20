"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, CheckCircle2, PlayCircle, Code2, Bookmark, Loader2 } from "lucide-react";
import supabase from "@/supabase";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  featureName?: string;
  icon?: React.ReactNode;
}

export function AuthModal({
  isOpen,
  onClose,
  title = "Sign In to CrackDSA",
  description = "Access paid video lectures, verified problem editorials, timestamped notes, and your engineering roadmap.",
  featureName = "Premium Content",
  icon,
}: AuthModalProps) {
  const pathname = usePathname();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("loggedin_route", pathname || window.location.pathname);
      }
      const redirectUrl = typeof window !== "undefined"
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
      console.error("Auth modal Google login error:", err);
      setIsSigningIn(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 sm:p-7 rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <DialogHeader className="space-y-3 text-center sm:text-left relative z-10">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              {icon || <Lock className="w-6 h-6 text-white" />}
            </div>
            {featureName && (
              <Badge
                variant="outline"
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300"
              >
                {featureName}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Benefits Checklist */}
        <div className="space-y-2.5 py-2 my-1 bg-muted/40 rounded-2xl p-3.5 border border-border/60 text-xs">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Structured 18+ module roadmap with video intuitions</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Optimal solutions in C++, Python, Java & JavaScript</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Track solved problems, revision tags & personal notes</span>
          </div>
        </div>

        {/* Action Button: Continue with Google */}
        <div className="space-y-3 pt-2 relative z-10">
          <Button
            onClick={handleGoogleLogin}
            disabled={isSigningIn}
            className="w-full h-11 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md gap-2.5 transition-all"
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
              </>
            )}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground leading-tight">
            Free instant login. No password required.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
