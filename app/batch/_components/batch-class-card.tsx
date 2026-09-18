"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Video, Book, ExternalLink, Radio, CheckCircle, Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RateClassDialog } from "./rate-class-dialog";
import { toast } from "sonner";
import supabase from "@/supabase";
import { getValidAccessToken } from "@/lib/auth-client";

interface BatchClassCardProps {
    classItem: any;
    userEmail: string;
    onRefresh?: () => void;
}

export function BatchClassCard({ classItem, userEmail, onRefresh }: BatchClassCardProps) {
    const [nowEpoch, setNowEpoch] = useState(() => Math.floor(Date.now() / 1000));

    // Update time every 5 seconds to smoothly transition across the 15m and live thresholds
    useEffect(() => {
        const timer = setInterval(() => {
            setNowEpoch(Math.floor(Date.now() / 1000));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const classTimeEpoch = Number(classItem?.class_time_epoch || 0);
    const durationSeconds = (Number(classItem?.class_duration) || 60) * 60;
    const isLive = nowEpoch >= classTimeEpoch && nowEpoch <= (classTimeEpoch + durationSeconds);
    const isUpcoming = nowEpoch < classTimeEpoch;
    const isPast = nowEpoch > (classTimeEpoch + durationSeconds);

    const secondsUntilClass = classTimeEpoch - nowEpoch;
    // Join window opens 15 minutes before scheduled start time
    const isWithin15Mins = isUpcoming && secondsUntilClass <= 15 * 60 && secondsUntilClass >= 0;

    // Check attendance
    const studentsJoined: string[] = Array.isArray(classItem?.students_joined) ? classItem.students_joined : [];
    const attendanceList: any[] = Array.isArray(classItem?.attendance) ? classItem.attendance : [];
    const hasAttended = studentsJoined.some(e => e?.toLowerCase() === userEmail?.toLowerCase()) ||
        attendanceList.some(r => r?.user_email?.toLowerCase() === userEmail?.toLowerCase());

    // Check if user has already rated this class
    const userEmailLower = userEmail?.trim().toLowerCase();
    const ratingsObj = classItem?.ratings || {};
    const hasRated = Boolean(
        userEmailLower && (
            (Array.isArray(ratingsObj.overall) && ratingsObj.overall.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower)) ||
            (Array.isArray(ratingsObj.content) && ratingsObj.content.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower)) ||
            (Array.isArray(ratingsObj.doubts) && ratingsObj.doubts.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower)) ||
            (Array.isArray(ratingsObj.engagement) && ratingsObj.engagement.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmailLower))
        )
    );

    const avgRatings = classItem?.average_ratings || {};
    const overallRating = avgRatings?.overall || avgRatings?.content || 0;

    const formattedDate = classTimeEpoch ? new Date(classTimeEpoch * 1000).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
    }) : "Date TBA";

    const handleJoinClass = () => {
        const classLink = classItem?.class_link;
        if (!classLink) {
            toast.error("Meeting link is not available yet.");
            return;
        }

        // 1. INSTANT REDIRECT / OPEN WINDOW (synchronously in user click event context to avoid delay and popup blockers)
        window.open(classLink, "_blank", "noopener,noreferrer");

        // 2. ASYNC BACKGROUND ATTENDANCE LOGGING (does not block redirect)
        (async () => {
            try {
                const token = await getValidAccessToken();

                const identifier = classItem?.id || classItem?.class_url_slug;
                const res = await fetch(`/api/live-classes/${identifier}/join`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                });

                if (res.ok) {
                    toast.success("Attendance marked! Joining session 🚀");
                    if (onRefresh) onRefresh();
                }
            } catch (err) {
                console.error("Async attendance logging error:", err);
            }
        })();
    };

    return (
        <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md border ${
            isLive ? "border-red-400 bg-red-50/20" : "border-gray-200"
        }`}>
            <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Class details */}
                    <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            {isLive && (
                                <Badge variant="destructive" className="animate-pulse flex items-center gap-1.5 px-2.5 py-0.5 font-bold">
                                    <Radio className="w-3 h-3 animate-ping" /> LIVE NOW
                                </Badge>
                            )}
                            {isWithin15Mins && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center gap-1.5 px-2.5 py-0.5 font-bold animate-pulse">
                                    <Radio className="w-3 h-3 text-emerald-600 animate-ping" /> Joining Open ({Math.max(1, Math.ceil(secondsUntilClass / 60))}m left)
                                </Badge>
                            )}
                            {isUpcoming && !isWithin15Mins && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                                    Upcoming
                                </Badge>
                            )}
                            {isPast && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                                    Completed
                                </Badge>
                            )}
                            {hasAttended && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Attended
                                </Badge>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 leading-snug">
                            {classItem?.class_name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                {formattedDate}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                {classItem?.class_duration || 60} mins
                            </span>
                            {classItem?.instructor_name && (
                                <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                    {classItem.instructor_name}
                                </span>
                            )}
                        </div>

                        {/* Subtopics */}
                        {Array.isArray(classItem?.class_subtopics) && classItem.class_subtopics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {classItem.class_subtopics.map((tag: string, idx: number) => (
                                    <span key={idx} className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Rating summary */}
                        {overallRating > 0 && (
                            <div className="flex items-center gap-2 pt-1 text-xs text-gray-600">
                                <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    {overallRating.toFixed(1)} / 5
                                </span>
                                {avgRatings?.total_reviews > 0 && (
                                    <span className="text-gray-400">
                                        ({avgRatings.total_reviews} {avgRatings.total_reviews === 1 ? 'rating' : 'ratings'})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap md:flex-col items-stretch md:items-end gap-2 pt-2 md:pt-0">
                        {isLive && (
                            <Button
                                onClick={handleJoinClass}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 shadow-sm text-xs sm:text-sm"
                            >
                                <Radio className="w-4 h-4 animate-ping" />
                                Join Live Class
                            </Button>
                        )}

                        {isWithin15Mins && (
                            <Button
                                onClick={handleJoinClass}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-sm text-xs sm:text-sm animate-pulse"
                            >
                                <Radio className="w-3.5 h-3.5 animate-ping" />
                                Join Session ({Math.max(1, Math.ceil(secondsUntilClass / 60))}m left)
                            </Button>
                        )}

                        {isUpcoming && !isWithin15Mins && (
                            <div className="text-[11px] text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/60 flex items-center gap-1.5 self-start md:self-end">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span>Link unlocks 15m before class</span>
                            </div>
                        )}

                        {isPast && classItem?.class_recording && (
                            <a
                                href={classItem.class_recording}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs"
                                >
                                    <Video className="w-3.5 h-3.5" />
                                    Watch Recording
                                </Button>
                            </a>
                        )}

                        {classItem?.class_notes && (
                            <a
                                href={classItem.class_notes}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 text-xs"
                                >
                                    <Book className="w-3.5 h-3.5" />
                                    Class Notes
                                </Button>
                            </a>
                        )}

                        {/* Rating: Only allowed during or after the class */}
                        {!isUpcoming && (
                            hasRated ? (
                                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs py-1 px-2.5 flex items-center gap-1 h-8">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    Rated
                                </Badge>
                            ) : (
                                <RateClassDialog
                                    classItem={classItem}
                                    userEmail={userEmail}
                                    onRatingSubmitted={onRefresh}
                                />
                            )
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
