"use client";

import { useEffect, useState, useMemo } from "react";
import {
    Clock,
    Calendar,
    Radio,
    User,
    ExternalLink,
    Sparkles,
    Video,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import supabase from "@/supabase";
import { getValidAccessToken } from "@/lib/auth-client";

interface NextClassCountdownProps {
    classes: any[];
    batchName?: string;
    batchId?: string;
    userEmail?: string;
    onRefresh?: () => void;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
    isLive: boolean;
}

export function NextClassCountdown({
    classes = [],
    batchName,
    batchId,
    userEmail = "",
    onRefresh
}: NextClassCountdownProps) {
    const [nowEpoch, setNowEpoch] = useState(() => Math.floor(Date.now() / 1000));

    // Keep clock in sync every second
    useEffect(() => {
        const timer = setInterval(() => {
            setNowEpoch(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Find currently live class if any
    const liveClass = useMemo(() => {
        return classes.find(c => {
            const start = Number(c.class_time_epoch || 0);
            const duration = (Number(c.class_duration) || 60) * 60;
            return nowEpoch >= start && nowEpoch <= (start + duration);
        });
    }, [classes, nowEpoch]);

    // Find the next upcoming class (soonest in the future)
    const nextClass = useMemo(() => {
        if (liveClass) return liveClass;
        const upcoming = classes
            .filter(c => Number(c.class_time_epoch || 0) > nowEpoch)
            .sort((a, b) => Number(a.class_time_epoch || 0) - Number(b.class_time_epoch || 0));
        return upcoming[0] || null;
    }, [classes, nowEpoch, liveClass]);

    // Calculate time remaining
    const timeLeft: TimeLeft = useMemo(() => {
        if (!nextClass) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isLive: false };
        }

        const classTimeEpoch = Number(nextClass.class_time_epoch || 0);
        const durationSeconds = (Number(nextClass.class_duration) || 60) * 60;
        const isCurrentlyLive = nowEpoch >= classTimeEpoch && nowEpoch <= (classTimeEpoch + durationSeconds);

        if (isCurrentlyLive) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, isLive: true };
        }

        const diffSeconds = classTimeEpoch - nowEpoch;
        if (diffSeconds <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isLive: false };
        }

        const days = Math.floor(diffSeconds / 86400);
        const hours = Math.floor((diffSeconds % 86400) / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;

        return { days, hours, minutes, seconds, isPast: false, isLive: false };
    }, [nextClass, nowEpoch]);

    // Attendance check
    const hasAttended = useMemo(() => {
        if (!nextClass || !userEmail) return false;
        const sj: string[] = Array.isArray(nextClass.students_joined) ? nextClass.students_joined : [];
        const att: any[] = Array.isArray(nextClass.attendance) ? nextClass.attendance : [];
        const emailLower = userEmail.toLowerCase().trim();
        return sj.some(e => e?.toLowerCase() === emailLower) ||
            att.some(r => r?.user_email?.toLowerCase() === emailLower);
    }, [nextClass, userEmail]);

    const formattedDate = useMemo(() => {
        if (!nextClass?.class_time_epoch) return "Date TBA";
        return new Date(Number(nextClass.class_time_epoch) * 1000).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
        });
    }, [nextClass]);

    const classTimeEpoch = Number(nextClass?.class_time_epoch || 0);
    const secondsUntilClass = classTimeEpoch - nowEpoch;
    const isWithin15Mins = !timeLeft.isLive && secondsUntilClass <= 15 * 60 && secondsUntilClass > 0;

    const handleJoinClass = () => {
        if (!nextClass?.class_link) {
            toast.error("Meeting link is not available yet.");
            return;
        }

        // 1. Redirect first! Instant synchronous window.open in user click context (zero delay & no popup blocking)
        window.open(nextClass.class_link, "_blank", "noopener,noreferrer");

        // 2. Asynchronously mark attendance in background without blocking redirect
        (async () => {
            try {
                const token = await getValidAccessToken();
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
                    if (onRefresh) onRefresh();
                }
            } catch (err) {
                console.error("Async attendance logging error:", err);
            }
        })();
    };

    if (!nextClass) {
        return null;
    }

    return (
        <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-primary/5 shadow-md rounded-2xl">
            {/* Top ambient highlight line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-primary" />

            <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Class Info */}
                    <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            {timeLeft.isLive ? (
                                <Badge variant="destructive" className="animate-pulse px-3 py-1 font-bold text-xs flex items-center gap-1.5 shadow-sm">
                                    <Radio className="w-3.5 h-3.5 animate-ping" />
                                    <span>LIVE NOW</span>
                                </Badge>
                            ) : isWithin15Mins ? (
                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 px-3 py-1 font-bold text-xs flex items-center gap-1.5 animate-pulse">
                                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-ping" />
                                    <span>JOINING OPEN ({Math.max(1, Math.ceil(secondsUntilClass / 60))}M TO START)</span>
                                </Badge>
                            ) : (
                                <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 px-3 py-1 font-bold text-xs flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span>NEXT CLASS IN</span>
                                </Badge>
                            )}

                            {batchName && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                                    {batchName}
                                </span>
                            )}

                            {hasAttended && (
                                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Attended
                                </Badge>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-1">
                                {nextClass.class_name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground mt-1.5">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                    <span>{formattedDate} (IST)</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                    <span>{nextClass.class_duration || 60} mins</span>
                                </span>
                                {nextClass.instructor_name && (
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-primary" />
                                        <span>{nextClass.instructor_name}</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Subtopic pills */}
                        {Array.isArray(nextClass.class_subtopics) && nextClass.class_subtopics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {nextClass.class_subtopics.slice(0, 4).map((topic: string, i: number) => (
                                    <span key={i} className="text-[11px] font-medium bg-muted/80 text-foreground/80 px-2 py-0.5 rounded-md border border-border/60">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Live Countdown Timer & Action CTA */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0">
                        {timeLeft.isLive ? (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                                <Radio className="w-5 h-5 text-red-600 animate-pulse" />
                                <div>
                                    <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Session Active</div>
                                    <div className="text-xs text-muted-foreground">Class is currently ongoing</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-2.5">
                                {/* Days Box */}
                                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted/70 border border-border/80 shadow-2xs">
                                    <span className="text-lg sm:text-xl font-black text-foreground tabular-nums">
                                        {String(timeLeft.days).padStart(2, "0")}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        Days
                                    </span>
                                </div>

                                <span className="text-base font-bold text-muted-foreground/60 pb-2">:</span>

                                {/* Hours Box */}
                                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted/70 border border-border/80 shadow-2xs">
                                    <span className="text-lg sm:text-xl font-black text-foreground tabular-nums">
                                        {String(timeLeft.hours).padStart(2, "0")}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        Hours
                                    </span>
                                </div>

                                <span className="text-base font-bold text-muted-foreground/60 pb-2">:</span>

                                {/* Mins Box */}
                                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted/70 border border-border/80 shadow-2xs">
                                    <span className="text-lg sm:text-xl font-black text-foreground tabular-nums">
                                        {String(timeLeft.minutes).padStart(2, "0")}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        Mins
                                    </span>
                                </div>

                                <span className="text-base font-bold text-muted-foreground/60 pb-2">:</span>

                                {/* Secs Box */}
                                <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted/70 border border-border/80 shadow-2xs">
                                    <span className="text-lg sm:text-xl font-black text-primary tabular-nums">
                                        {String(timeLeft.seconds).padStart(2, "0")}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        Secs
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Action CTA button */}
                        <div>
                            {timeLeft.isLive ? (
                                <Button
                                    onClick={handleJoinClass}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-red-500/25 flex items-center gap-2"
                                >
                                    <Radio className="w-4 h-4 animate-ping" />
                                    Join Live Lecture
                                </Button>
                            ) : isWithin15Mins ? (
                                <Button
                                    onClick={handleJoinClass}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md shadow-emerald-500/25 flex items-center gap-2 animate-pulse"
                                >
                                    <Radio className="w-4 h-4 animate-ping" />
                                    Join Session Now ({Math.max(1, Math.ceil(secondsUntilClass / 60))}m left)
                                </Button>
                            ) : (
                                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border/80 text-xs font-medium text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                    <span>Link unlocks 15m before class</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
