"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Trophy,
  Flame,
  Layers,
  FileText,
  BookOpen,
  Briefcase,
  Sparkles,
  Rocket,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronDown,
  MessageSquarePlusIcon,
  GitFork,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import { getValidSession, getValidUser } from "@/lib/auth-client";
import supabase from "@/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProStatus } from "@/hooks/use-pro-status";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { feedback_form } from "@/components/social-links";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("loading");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isPro } = useProStatus();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const validUser = await getValidUser();
        if (isMounted) {
          setUser(validUser || null);
          setStatus("done");
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setStatus("done");
        }
      }
    }
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (isMounted) {
        setUser(session?.user || null);
        setStatus("done");
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async (e?: any) => {
    if (e) e.preventDefault();
    toast.info("Logging you out...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out.");
      } else {
        setUser(null);
        toast.info("You are logged out!");
        location.reload();
      }
    } catch {
      toast.error("Error signing out.");
    }
  };

  async function handleLogIn(e: any) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("loggedin_route", pathname || "/dashboard");
    }
    try {
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
      console.error("Login error:", err);
      toast.error("Error logging in.");
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-all shadow-xs relative overflow-hidden">
      {/* Background Subtle Tech Grid */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f610_1px,transparent_1px),linear-gradient(to_bottom,#3b82f610_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" /> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo width={130} height={34} />
          </Link>

          {/* Desktop Navigation Mega Menus */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            {/* 1. Learn DSA Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none cursor-pointer">
                <span>Learn DSA</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2 shadow-xl rounded-xl z-50">
                <div className="p-2 border-b border-border/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Data Structures & Algorithms
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Curated sheets, visual roadmaps & daily problems
                  </p>
                </div>
                <div className="py-1 space-y-0.5">
                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/dsa"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Code2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">DSA Curriculum</p>
                        <p className="text-[11px] text-muted-foreground">Complete topic breakdown from Arrays to DP</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/dsa/sheets"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Layers className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Curated Problem Sheets</p>
                        <p className="text-[11px] text-muted-foreground">SDE Sheet, Blind 75, Love Babbar 450</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/dsa/topic-tree"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <GitFork className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">DSA Topic Tree</p>
                        <p className="text-[11px] text-muted-foreground">Interactive skill graph & roadmap</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/contests/leetcode-potd"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Flame className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">LeetCode Daily POTD</p>
                        <p className="text-[11px] text-muted-foreground">Detailed editorials & test breakdowns</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/contests"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Trophy className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Contests Archive</p>
                        <p className="text-[11px] text-muted-foreground">LeetCode, Codeforces & CodeChef editorials</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. Interview Prep Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none cursor-pointer">
                <span>Interview Kit</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 p-2 shadow-xl rounded-xl z-50">
                <div className="p-2 border-b border-border/60">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Interview Preparation Kit
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fast-track notes, system design & ATS resume builder
                  </p>
                </div>
                <div className="py-1 space-y-0.5">
                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/cs-fundamentals"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">CS Fundamentals</p>
                        <p className="text-[11px] text-muted-foreground">OS, DBMS, Computer Networks & OOPs</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/resume"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <FileText className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-foreground">ATS Resume Builder</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            FREE
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">One-click LaTeX export & keyword scoring</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/interview-experiences"
                      className="flex items-start gap-3 p-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-foreground">Interview Experiences</p>
                        <p className="text-[11px] text-muted-foreground">Real rounds at Microsoft, Google, Amazon</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. Opportunities Direct Link */}
            <Link
              href="/opportunities"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Jobs & Internships</span>
            </Link>

            {/* 4. Masterclasses Link */}
            <Link
              href="/masterclasses"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <span>Masterclasses</span>
            </Link>
          </nav>
        </div>

        {/* Right: Start Learning for Free + coding75 Pro CTA + Auth Profile Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* Start Learning for Free Button */}
          <Link
            href="/dsa/sheets"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:text-primary hover:bg-muted/70 border border-border/80 transition-all hover:border-blue-500/30"
          >
            <span>Start Learning for Free</span>
          </Link>

          {/* coding75 Pro High-Conversion Pill / View Pro Pill */}
          <Link
            href={isPro ? "/pro/dashboard" : "/pro"}
            className="group relative inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            <Sparkles className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="tracking-tight font-black">{isPro ? "View Pro" : "coding75 Pro"}</span>
          </Link>

          {/* User Profile Avatar / Login Button */}
          {status === "loading" ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <button
                  className={cn(
                    "relative rounded-full transition-all focus:outline-none",
                    isPro
                      ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background hover:ring-amber-400"
                      : "ring-1 ring-border/80 hover:ring-2 hover:ring-primary/50"
                  )}
                  aria-label="User profile menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.user_metadata?.picture}
                      alt={user?.user_metadata?.full_name || "User"}
                    />
                    <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                      {user?.user_metadata?.full_name?.[0]?.toUpperCase() || (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {isPro && (
                    <span
                      className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-background shadow-xs tracking-wider uppercase leading-tight"
                      title="coding75 Pro Active"
                    >
                      PRO
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl rounded-xl z-50">
                <div className="px-2.5 py-2 border-b border-border/60">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {user?.user_metadata?.full_name || "User"}
                    </p>
                    {isPro && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0 uppercase tracking-wider">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                </div>
                <div className="pt-1 space-y-0.5">
                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Rocket className="w-3.5 h-3.5 text-primary" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <Link
                      href={isPro ? "/pro/dashboard" : "/pro"}
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isPro ? "View Pro Dashboard" : "coding75 Pro Pass"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-0 rounded-lg">
                    <a
                      href={feedback_form}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                    >
                      <MessageSquarePlusIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Submit Feedback</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 rounded-xl text-xs font-medium gap-1.5 hover:bg-muted cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-2xl p-6">
                  <DialogHeader className="items-center text-center">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        <Logo width={140} height={36} />
                      </div>
                      <DialogTitle className="text-xl font-bold text-foreground">
                        Welcome to coding75 🚀
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                        Sign in to access your curated DSA sheets, contest editorials, and career tools.
                      </DialogDescription>
                      <div className="w-full mt-6">
                        <button
                          onClick={handleLogIn}
                          type="button"
                          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold shadow-xs transition-all active:scale-[0.99] cursor-pointer"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 488 512">
                            <path
                              fill="currentColor"
                              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            />
                          </svg>
                          <span>Continue with Google</span>
                        </button>
                      </div>
                      <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
                        By continuing, you agree to our{" "}
                        <a
                          href="https://crackdsa.com/terms/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-foreground underline hover:text-primary"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="https://crackdsa.com/privacy/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-foreground underline hover:text-primary"
                        >
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <span>Dashboard</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-muted-foreground">
            <Link
              href="/dsa"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <Code2 className="w-4 h-4 text-blue-500" />
              <span>Learn DSA Curriculum</span>
            </Link>
            <Link
              href="/dsa/sheets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Curated Problem Sheets</span>
            </Link>
            <Link
              href="/dsa/topic-tree"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <GitFork className="w-4 h-4 text-violet-500" />
              <span>DSA Topic Tree Roadmap</span>
            </Link>
            <Link
              href="/contests/leetcode-potd"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>LeetCode POTD</span>
            </Link>
            <Link
              href="/contests"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <Trophy className="w-4 h-4 text-primary" />
              <span>Contests Archive</span>
            </Link>
            <Link
              href="/cs-fundamentals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>CS Fundamentals</span>
            </Link>
            <Link
              href="/resume"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>ATS Resume Builder</span>
            </Link>
            <Link
              href="/opportunities"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground"
            >
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <span>Jobs & Internships</span>
            </Link>
            <Link
              href={isPro ? "/pro/dashboard" : "/pro"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isPro ? "View Pro Dashboard" : "coding75 Pro Pass"}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}