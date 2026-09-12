"use client";

import { useState } from "react";
import { Calendar, Clock, Video, Book, ExternalLink, Radio, CheckCircle, Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RateClassDialog } from "./rate-class-dialog";
import { toast } from "sonner";
import supabase from "@/supabase";

interface BatchClassCardProps {
    classItem: any;
    userEmail: string;
    onRefresh?: () => void;
}

export function BatchClassCard({ classItem, userEmail, onRefresh }: BatchClassCardProps) {
    const [joining, setJoining] = useState(false);

    const nowEpoch = Math.floor(Date.now() / 1000);
    const classTimeEpoch = Number(classItem?.class_time_epoch || 0);
    const durationSeconds = (Number(classItem?.class_duration) || 60) * 60;
    const isLive = nowEpoch >= classTimeEpoch && nowEpoch <= (classTimeEpoch + durationSeconds);
    const isUpcoming = nowEpoch < classTimeEpoch;
    const isPast = nowEpoch > (classTimeEpoch + durationSeconds);

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

    const handleJoinClass = async () => {
        setJoining(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;

            const identifier = classItem?.id || classItem?.class_url_slug;
            const res = await fetch(`/api/live-classes/${identifier}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Attendance marked! Joining live session 🚀");
                if (onRefresh) onRefresh();
            }

            // Open link in new window
            if (classItem?.class_link) {
                window.open(classItem.class_link, "_blank");
            }
        } catch (err) {
            console.error("Error joining live class:", err);
            if (classItem?.class_link) {
                window.open(classItem.class_link, "_blank");
            }
        } finally {
            setJoining(false);
        }
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
                            {isUpcoming && (
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
                                disabled={joining}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2 shadow-sm"
                            >
                                <Radio className="w-4 h-4 animate-ping" />
                                {joining ? "Joining..." : "Join Live Class"}
                            </Button>
                        )}

                        {isUpcoming && (
                            <Button
                                onClick={handleJoinClass}
                                variant="outline"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50 font-medium flex items-center gap-1.5 text-xs"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Meeting Link
                            </Button>
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

                        {hasRated ? (
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
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
