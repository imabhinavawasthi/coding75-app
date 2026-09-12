"use client";

import Link from "next/link";
import {
    UserCheck,
    CheckCircle2,
    XCircle,
    Calendar,
    Clock,
    TrendingUp,
    AlertCircle,
    ExternalLink,
    Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BatchLoadingState } from "../../_components/batch-loading-state";
import { BatchUnauthorizedCard } from "../../_components/batch-unauthorized-card";
import { useBatchData } from "../../_components/use-batch-data";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";

function formatISTTime(epochSeconds: number) {
    if (!epochSeconds) return "TBD";
    const d = new Date(epochSeconds * 1000);
    return d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

export default function BatchAttendancePage() {
    const { batchId, batchData, classes, user, status, errorMessage } = useBatchData();

    if (status === "loading") {
        return <BatchLoadingState message="Loading your attendance record..." />;
    }

    if (status === "unauthorized") {
        return <BatchUnauthorizedCard batchName={batchData?.batch_name} batchId={batchId} />;
    }

    if (status === "error") {
        return (
            <div className="container max-w-3xl mx-auto px-4 py-16">
                <ErrorBanner />
                <p className="text-center text-sm text-red-500 mt-2">{errorMessage}</p>
            </div>
        );
    }

    const userEmail = (user?.email || "").trim().toLowerCase();
    const nowEpoch = Math.floor(Date.now() / 1000);

    const pastAndLiveClasses = classes.filter(c => {
        const t = Number(c.class_time_epoch);
        const d = (Number(c.class_duration) || 60) * 60;
        return nowEpoch >= t; // started or completed
    }).reverse(); // Most recent first

    const attendedRecords = pastAndLiveClasses.map(c => {
        const sj: string[] = Array.isArray(c.students_joined) ? c.students_joined : [];
        const att: any[] = Array.isArray(c.attendance) ? c.attendance : [];

        const isPresent =
            sj.some(e => e?.toLowerCase() === userEmail) ||
            att.some(r => r?.user_email?.toLowerCase() === userEmail);

        const attendanceEntry = att.find(r => r?.user_email?.toLowerCase() === userEmail);
        const joinTimestamp = attendanceEntry?.joined_at || attendanceEntry?.timestamp || null;

        return {
            classItem: c,
            isPresent,
            joinTimestamp
        };
    });

    const attendedCount = attendedRecords.filter(r => r.isPresent).length;
    const totalCount = pastAndLiveClasses.length;
    const attendancePercentage = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 100;

    let performanceLabel = "Excellent";
    let performanceColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
    let performanceDesc = "Outstanding consistency! Keep attending all live sessions to get the most out of your batch.";

    if (totalCount > 0 && attendancePercentage < 60) {
        performanceLabel = "Needs Immediate Attention";
        performanceColor = "text-rose-600 bg-rose-50 border-rose-200";
        performanceDesc = "Your attendance has fallen below 60%. Please watch the recordings and attend upcoming live lectures.";
    } else if (totalCount > 0 && attendancePercentage < 80) {
        performanceLabel = "Good (Room for Improvement)";
        performanceColor = "text-amber-600 bg-amber-50 border-amber-200";
        performanceDesc = "Try to attend upcoming sessions live for real-time doubt resolution and peer learning.";
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={`/batch/${batchId}`} className="text-xs text-blue-600 hover:underline">
                            {batchData?.batch_name || "Batch"}
                        </Link>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-xs text-gray-500">Attendance</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <UserCheck className="w-6 h-6 text-emerald-600" />
                        Attendance Details
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Track your live session attendance percentage and lecture participation history.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-3 py-1 font-semibold">
                        {attendancePercentage}% Overall Attendance
                    </Badge>
                </div>
            </div>

            {/* Attendance Analytics & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric Meter Card */}
                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 md:col-span-1 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                            <span>Overall Attendance</span>
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900">{attendancePercentage}%</span>
                            <span className="text-xs text-gray-500">of total lectures</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${
                                    attendancePercentage >= 80 ? "bg-emerald-500" : attendancePercentage >= 60 ? "bg-amber-500" : "bg-rose-500"
                                }`}
                                style={{ width: `${attendancePercentage}%` }}
                            />
                        </div>

                        <div className={`p-2.5 rounded-lg border text-xs font-medium ${performanceColor}`}>
                            <div className="font-bold flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5" /> {performanceLabel}
                            </div>
                            <p className="text-[11px] mt-1 font-normal opacity-90">{performanceDesc}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Breakdown Stats */}
                <Card className="md:col-span-2 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-gray-900">
                            Attendance Breakdown
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Detailed log of live sessions attended vs missed for your student profile ({userEmail})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 border text-center">
                                <span className="text-xs text-gray-500 block font-medium">Completed Classes</span>
                                <span className="text-2xl font-black text-slate-800 mt-1 block">{totalCount}</span>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                                <span className="text-xs text-emerald-700 block font-medium">Attended Live</span>
                                <span className="text-2xl font-black text-emerald-600 mt-1 block">{attendedCount}</span>
                            </div>
                            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                                <span className="text-xs text-rose-700 block font-medium">Missed Sessions</span>
                                <span className="text-2xl font-black text-rose-600 mt-1 block">{totalCount - attendedCount}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lecture by Lecture Attendance Table */}
            <Card className="shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        Lecture-by-Lecture Attendance Log
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Review attendance verification and catch up on missed sessions with recordings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {attendedRecords.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-xs">
                            No past or live lectures conducted in this batch yet. Attendance will be tracked automatically as soon as classes commence.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                                    <tr>
                                        <th className="py-3 px-4">Lecture Title</th>
                                        <th className="py-3 px-4">Scheduled Time (IST)</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {attendedRecords.map(({ classItem, isPresent, joinTimestamp }) => (
                                        <tr key={classItem.id || classItem.class_url_slug} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3.5 px-4 font-semibold text-gray-900">
                                                <div>{classItem.class_name}</div>
                                                {classItem.instructor_name && (
                                                    <div className="text-[11px] text-gray-500 font-normal">Instructor: {classItem.instructor_name}</div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600 font-medium">
                                                {formatISTTime(Number(classItem.class_time_epoch))}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {isPresent ? (
                                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-medium text-[11px] flex items-center gap-1 w-fit">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Present
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-medium text-[11px] flex items-center gap-1 w-fit">
                                                        <XCircle className="w-3 h-3 text-rose-600" /> Absent
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Link href={`/batch/${batchId}/recordings/${classItem.id || classItem.class_url_slug}`}>
                                                    <Button size="sm" variant="outline" className="h-7 text-xs flex items-center gap-1.5 ml-auto text-purple-700 border-purple-200 hover:bg-purple-50 hover:border-purple-300 font-medium">
                                                        <Play className="w-3 h-3 text-purple-600 fill-purple-600" /> Open Lecture
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
