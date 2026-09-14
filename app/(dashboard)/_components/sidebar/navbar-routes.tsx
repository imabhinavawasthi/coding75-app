"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import supabase from "@/supabase";
import { Bell, LogIn, LogOut, MessageSquarePlusIcon, Rocket, User } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { feedback_form } from "@/components/social-links";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "../components/logo";

export const NavbarRoutes = ({ isLogo = false }: any) => {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname(); 
  const [status, setStatus] = useState("loading")

  async function handleLogOut(e: any) {
    e.preventDefault()
    toast.info('Logging you out...')
    try {
      let { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Error! Something went wrong.')
      }
      else {
        checkUser()
        toast.info('You are Logged Out!')
        location.reload()
      }
    }
    catch {
      toast.error('Error! Something went wrong.')
    }
  }

  async function handleLogIn(e: any) {
    e.preventDefault();
    localStorage.setItem('loggedin_route', pathname)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      }
      )
      if (data) {
        checkUser()
        toast.success(`Welcome, ${data["user_metadata"]["full_name"]}`)
      }
      else {
        toast.error('Error! Something went wrong.')
      }
    }
    catch {

    }
  }


  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        if (data.user) {
          setUser(data.user)
        }
        else {
          setUser(null)
        }
      }
      else {
        console.error(error);
        toast.error('Error! Something went wrong.')
      }
    }
    catch {
      toast.error('Error! Something went wrong.')
    }
    setStatus("done")
  }
  useEffect(() => {
    checkUser()
  }, [])

  return (
    <div className="flex items-center gap-2 sm:gap-3 ml-auto">
      {/* Coding75 Pro CTA Badge */}
      <Link
        href="/pro"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-2xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Rocket className="w-3.5 h-3.5" />
        <span>coding75 Pro</span>
      </Link>

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={() => setNotificationOpen(true)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {!notificationOpen && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-card" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-xl rounded-xl z-50">
            <div className="px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Notifications
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-0 rounded-lg">
              <Link href="/classroom" className="flex flex-col gap-0.5 px-2.5 py-2 cursor-pointer rounded-lg hover:bg-muted">
                <span className="text-xs font-semibold text-foreground">Live Classes & 1:1 Mentorship</span>
                <span className="text-[11px] text-muted-foreground">Interactive cohort-based learning</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-0 rounded-lg">
              <Link href="/pro" className="flex flex-col gap-0.5 px-2.5 py-2 cursor-pointer rounded-lg hover:bg-muted">
                <span className="text-xs font-semibold text-primary">coding75 Pro is Live 🚀</span>
                <span className="text-[11px] text-muted-foreground">Accelerate your career preparation</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground text-center">
              Welcome to coding75!
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Avatar / Login CTA */}
        {status === "loading" ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <button className="rounded-full ring-1 ring-border/80 hover:ring-2 hover:ring-primary/40 transition-all focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.["user_metadata"]?.["picture"]} alt={user?.["user_metadata"]?.["full_name"] || "User"} />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {user?.["user_metadata"]?.["full_name"]?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl rounded-xl z-50">
              <div className="px-2.5 py-2 border-b border-border/60">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.["user_metadata"]?.["full_name"] || "User"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.["email"] || ""}
                </p>
              </div>
              <div className="pt-1 space-y-0.5">
                <DropdownMenuItem asChild className="p-0 rounded-lg">
                  <Link href="/profile" className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="p-0 rounded-lg">
                  <Link href="/classroom/subscription" className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted">
                    <Rocket className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pro Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="p-0 rounded-lg">
                  <a href={feedback_form} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted">
                    <MessageSquarePlusIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>Submit Feedback</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogOut}
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
                size="sm"
                className="h-8 px-3 rounded-lg text-xs font-medium gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl p-6">
              <DialogHeader className="items-center text-center">
                <DialogDescription asChild>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Logo width={140} height={36} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                      Welcome to coding75 🚀
                    </h2>
                    <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">
                      Login to track your DSA journey, practice contest problems, explore opportunities, and build ATS-ready resumes.
                    </p>
                    <div className="w-full mt-6">
                      <button
                        onClick={handleLogIn}
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold shadow-xs transition-all active:scale-[0.99]"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 488 512">
                          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                    </div>
                    <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
                      By continuing, you agree to our{" "}
                      <a href="https://crackdsa.com/terms/" target="_blank" rel="noreferrer" className="text-foreground underline hover:text-primary">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="https://crackdsa.com/privacy/" target="_blank" rel="noreferrer" className="text-foreground underline hover:text-primary">
                        Privacy Policy
                      </a>.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
};