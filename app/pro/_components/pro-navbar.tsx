"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Rocket,
  MessageSquarePlusIcon,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import { getValidSession, getValidUser } from "@/lib/auth-client";
import supabase from "@/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useProStatus } from "@/hooks/use-pro-status";
import { cn } from "@/lib/utils";

export function ProNavbar() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("loading");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isPro } = useProStatus();
  const pathname = usePathname();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      if (typeof window !== "undefined" && window.history) {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

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
      localStorage.setItem("loggedin_route", pathname || "/pro");
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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Nav Links */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo width={130} height={34} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted-foreground">
            <a
              href="#reviews"
              onClick={(e) => scrollToSection(e, "reviews")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Student Reviews
            </a>
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              What You Get
            </a>
            <a
              href="#mentors"
              onClick={(e) => scrollToSection(e, "mentors")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Mentors
            </a>
            <a
              href="#comparison"
              onClick={(e) => scrollToSection(e, "comparison")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Compare
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Pricing Plans
            </a>
            <a
              href="#faqs"
              onClick={(e) => scrollToSection(e, "faqs")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              FAQs
            </a>
          </nav>
        </div>

        {/* Right: Auth Profile + Ultra-Premium Pro Button */}
        <div className="flex items-center gap-3">
          {/* User Profile Avatar / Login CTA (matching normal navbar) */}
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
                      href="/profile/subscription"
                      className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted text-blue-600 dark:text-blue-400"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Subscription &amp; Billing</span>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 rounded-xl text-xs font-medium gap-1.5 hover:bg-muted"
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
                      Sign in to access your coding75 Pro learning portal, live classes, doubt support, and curated opportunities.
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
          )}

          {/* Ultra-Premium Pro Button: View Pro if Pro, Get Pro Access if not */}
          {isPro ? (
            <Link
              href="/pro/dashboard"
              className="group relative inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              <Sparkles className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="hidden sm:inline tracking-tight">View Pro</span>
              <span className="sm:hidden font-black">Pro</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="group relative inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all overflow-hidden cursor-pointer"
            >
              {/* Shimmer sweep animation */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
              <Sparkles className="w-3.5 h-3.5 text-amber-100 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="hidden sm:inline tracking-tight">Get Pro Access</span>
              <span className="sm:hidden font-black">Pro</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-muted-foreground">
            <a
              href="#reviews"
              onClick={(e) => scrollToSection(e, "reviews")}
              className="px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Student Reviews
            </a>
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground cursor-pointer"
            >
              What You Get
            </a>
            <a
              href="#mentors"
              onClick={(e) => scrollToSection(e, "mentors")}
              className="px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Mentors
            </a>
            <a
              href="#comparison"
              onClick={(e) => scrollToSection(e, "comparison")}
              className="px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Comparison Matrix
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "pricing")}
              className="px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground cursor-pointer"
            >
              Pricing & Plans
            </a>
            <a
              href="#faqs"
              onClick={(e) => scrollToSection(e, "faqs")}
              className="px-3 py-2 rounded-lg hover:bg-muted hover:text-foreground cursor-pointer"
            >
              FAQs
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
