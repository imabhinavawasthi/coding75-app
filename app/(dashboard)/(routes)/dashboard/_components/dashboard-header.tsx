"use client"

import supabase from "@/supabase";
import { BookText, Briefcase, Rocket } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface accouncementType {
    text: any;
    link: any;
    linkText: any;
}

export default function DashboardHeader() {
    const [user, setUser] = useState<any>(null)
    const [loadingUser, setLoadingUser] = useState(true)
    const [announcement, setAnnouncement] = useState<accouncementType>({
        text: "We would greatly appreciate it if you could take a moment to visit our site and share your valuable feedback with us here.",
        link: "https://forms.gle/S5KKUyrUqi1WzZCJ6",
        linkText: "Click Here"
    })
    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data && data.user) {
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setLoadingUser(false)
        }
    }
    async function getAnnouncement() {
        try {
            let { data, error } = await supabase
                .from('constants')
                .select('id,announcement,announcement_link,announcement_link_text')

            if (error) {
                console.error('Error fetching data:', error);
            }
            else {
                setAnnouncement({
                    text: data?.[0]?.announcement,
                    link: data?.[0]?.announcement_link,
                    linkText: data?.[0]?.announcement_link_text
                })
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
    useEffect(() => {
        checkUser()
        // getAnnouncement()
    }, [])
    return (
        <header className="mb-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xs">
                {/* Subtle top accent gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500" />
                
                <div className="space-y-5">
                    {/* Header Title & Subtitle */}
                    <div className="space-y-2 max-w-3xl">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground min-h-[36px] flex items-center">
                            {loadingUser ? (
                                <span className="inline-flex items-center gap-2">
                                    <span>Welcome back,</span>
                                    <Skeleton className="h-7 w-36 sm:w-44 rounded-lg inline-block align-middle" />
                                </span>
                            ) : user?.user_metadata?.full_name ? (
                                <>
                                    Welcome back,{" "}
                                    <span className="text-blue-600 dark:text-blue-400 font-extrabold ml-1.5">
                                        {user.user_metadata.full_name}
                                    </span>{" "}
                                    👋
                                </>
                            ) : (
                                <>
                                    Welcome to{" "}
                                    <span className="text-blue-600 dark:text-blue-400 font-extrabold ml-1.5">
                                        coding75
                                    </span>{" "}
                                    🚀
                                </>
                            )}
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Master Data Structures & Algorithms, solve contest problems with video editorials, build production-grade systems, and crack top-tier technical interviews.
                        </p>
                    </div>

                    {/* Premium Action Cards directly below title */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {/* 1. Explore DSA */}
                        <Link
                            href="/dsa"
                            className="group relative overflow-hidden flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/80 bg-background/80 hover:bg-muted/70 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-200 shadow-2xs hover:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <BookText className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        Explore DSA
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                        Roadmaps & Concepts
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2">
                                →
                            </span>
                        </Link>

                        {/* 2. Contest Discussions */}
                        <Link
                            href="/contests"
                            className="group relative overflow-hidden flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/80 bg-background/80 hover:bg-muted/70 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200 shadow-2xs hover:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <Rocket className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        Contest Discussions
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                        Editorials & Solutions
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2">
                                →
                            </span>
                        </Link>

                        {/* 3. Masterclasses */}
                        <Link
                            href="/masterclasses"
                            className="group relative overflow-hidden flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/80 bg-background/80 hover:bg-muted/70 hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-all duration-200 shadow-2xs hover:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        Masterclasses
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                        Industry Mentorship
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2">
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}