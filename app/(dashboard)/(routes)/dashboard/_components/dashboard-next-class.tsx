"use client";

import { useEffect, useState, useMemo } from "react";
import supabase from "@/supabase";
import { getValidSession } from "@/lib/auth-client";
import Link from "next/link";
import {
    Calendar,
    Clock,
    Video,
    Radio,
    User,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DashboardNextClass() {
    const [classes, setClasses] = useState<any[]>([]);
    const [batchName, setBatchName] = useState<string>("");
    const [batchId, setBatchId] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [nowEpoch, setNowEpoch] = useState(() => Math.floor(Date.now() / 1000));

    // Update time ticker every 10 seconds for snappy UI
    useEffect(() => {
        const timer = setInterval(() => {
            setNowEpoch(Math.floor(Date.now() / 1000));
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    const fetchUpcomingBatchClass = async () => {
        try {
            const session = await getValidSession();
            if (!session) {
                setLoading(false);
                return;
            }

            setUserEmail(session.user.email || "");
            const token = session.access_token;

            const res = await fetch("/api/batches?all=false", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) {
                setLoading(false);
                return;
            }

            const data = await res.json();
            const batches = Array.isArray(data.batches) ? data.batches : [];
            const emailLower = (session.user.email || "").trim().toLowerCase();

            // Strictly filter to batches where user is enrolled
            const enrolledBatches = batches.filter((b: any) => {
                const students: string[] = Array.isArray(b.enrolled_students) ? b.enrolled_students : [];
                return students.some((e: string) => e?.trim().toLowerCase() === emailLower);
            });

            if (enrolledBatches.length === 0) {
                setLoading(false);
                return;
            }

            // Fetch details of the first enrolled batch
            const primaryBatch = enrolledBatches[0];
            const batchRes = await fetch(`/api/batches/${primaryBatch.batch_id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (batchRes.ok) {
                const batchData = await batchRes.json();
                setBatchName(batchData.batch?.batch_name || primaryBatch.batch_name);
                setBatchId(primaryBatch.batch_id);
                setClasses(batchData.classes || []);
            }
        } catch (err) {
            console.error("Error fetching next batch class for dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpcomingBatchClass();
    }, []);

    // Find live or next upcoming class
    const nextClass = useMemo(() => {
        if (!classes.length) return null;

        // 1. Is any class currently live?
        const live = classes.find(c => {
            const start = Number(c.class_time_epoch || 0);
            const duration = (Number(c.class_duration) || 60) * 60;
            return nowEpoch >= start && nowEpoch <= (start + duration);
        });
        if (live) return { ...live, _status: "live" as const };

        // 2. Next upcoming class in the future
        const upcoming = classes
            .filter(c => Number(c.class_time_epoch || 0) > nowEpoch)
            .sort((a, b) => Number(a.class_time_epoch || 0) - Number(b.class_time_epoch || 0));

        if (upcoming.length > 0) {
            return { ...upcoming[0], _status: "upcoming" as const };
        }

        return null;
    }, [classes, nowEpoch]);

    if (loading || !nextClass) {
        return null;
    }

    const startEpoch = Number(nextClass.class_time_epoch || 0);
    const durationMins = Number(nextClass.class_duration) || 60;
    const isLive = nextClass._status === "live";
    const secondsUntilClass = startEpoch - nowEpoch;
    const isWithin15Mins = !isLive && secondsUntilClass <= 15 * 60 && secondsUntilClass > 0;
    const canJoin = isLive || isWithin15Mins;

    // Format IST Date & Time
    const formattedDateTime = startEpoch
        ? new Date(startEpoch * 1000).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }) + " IST"
        : "TBA";

    // Format relative time text
    const relativeTime = () => {
        if (isLive) return "Live Now";
        if (isWithin15Mins) return "Starts in < 15 mins";
        const diff = secondsUntilClass;
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        if (days > 0) return `Starts in ${days}d ${hours}h`;
        if (hours > 0) return `Starts in ${hours}h ${mins}m`;
        return `Starts in ${mins}m`;
    };

    const handleJoinClass = () => {
        if (!nextClass?.class_link) {
            toast.error("Meeting link is not available yet.");
            return;
        }

        // 1. Instant synchronous redirect
        window.open(nextClass.class_link, "_blank", "noopener,noreferrer");

        // 2. Async attendance logging in background
        (async () => {
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                const token = sessionData?.session?.access_token;
                const identifier = nextClass.id || nextClass.class_url_slug;

                const res = await fetch(`/api/live-classes/${identifier}/join`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                });

                if (res.ok) {
                    toast.success("Attendance marked! Joining live session 🚀");
                    fetchUpcomingBatchClass();
                }
            } catch (err) {
                console.error("Async attendance logging error:", err);
            }
        })();
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 p-4 sm:p-5 shadow-xs">
            {/* Top ambient highlight line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${
                isLive
                    ? "bg-rose-500 animate-pulse"
                    : isWithin15Mins
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            }`} />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left side: Class metadata */}
                <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Status badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                        {isLive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                LIVE NOW
                            </span>
                        ) : isWithin15Mins ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                JOIN OPEN
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                                <Radio className="w-3 h-3 animate-pulse" />
                                {relativeTime()}
                            </span>
                        )}

                        {batchName && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60 truncate max-w-[220px]">
                                {batchName}
                            </span>
                        )}
                    </div>

                    {/* Class Title */}
                    <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                        {nextClass.class_title || nextClass.title || "Upcoming Live Lecture"}
                    </h3>

                    {/* Details row: Date, Duration, Instructor */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span className="font-medium text-foreground">{formattedDateTime}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{durationMins} mins</span>
                        </div>

                        {nextClass.instructor && (
                            <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-muted-foreground" />
                                <span>{nextClass.instructor}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                    {/* View Details / View More */}
                    {batchId && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="rounded-xl border-border/80 hover:bg-muted font-semibold text-xs h-9"
                        >
                            <Link href={`/batch/${batchId}`}>
                                View More
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Link>
                        </Button>
                    )}

                    {/* Join Button (Active when Live or within 15 mins) */}
                    {canJoin ? (
                        <Button
                            onClick={handleJoinClass}
                            size="sm"
                            className={`rounded-xl font-bold text-xs h-9 shadow-sm ${
                                isLive
                                    ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                        >
                            <Video className="w-4 h-4 mr-1.5" />
                            Join Session Now
                        </Button>
                    ) : (
                        <div className="text-[11px] text-muted-foreground italic px-2.5 py-1 bg-muted/50 rounded-lg border border-border/40">
                            Join activates 15m before class
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
