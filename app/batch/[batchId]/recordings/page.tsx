"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Video,
    Search,
    Calendar,
    Clock,
    User,
    Play,
    BookOpen,
    Star,
    ExternalLink,
    CheckCircle,
    XCircle,
    ArrowRight,
    Sparkles,
    RotateCcw,
    Layers,
    ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function BatchRecordingsPage() {
    const router = useRouter();
    const { batchId, batchData, classes, user, status, errorMessage } = useBatchData();

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating" | "duration">("newest");
    const [filterStatus, setFilterStatus] = useState<"all" | "attended" | "missed">("all");

    if (status === "loading") {
        return <BatchLoadingState message="Loading class recordings..." />;
    }

    if (status === "unauthorized") {
        return <BatchUnauthorizedCard batchName={batchData?.batch_name} batchId={batchId} />;
    }

    if (status === "error") {
        return (
            <div className="container max-w-6xl mx-auto px-4 py-16">
                <ErrorBanner />
                <p className="text-center text-sm text-red-500 mt-2">{errorMessage}</p>
            </div>
        );
    }

    const nowEpoch = Math.floor(Date.now() / 1000);
    const userEmail = (user?.email || "").trim().toLowerCase();

    // All past or currently started lectures
    const pastClasses = classes.filter(c => {
        const t = Number(c.class_time_epoch);
        return nowEpoch >= t; // past or started
    });

    // Total counts
    const recordedTotalCount = pastClasses.filter(c => !!c.class_recording).length;

    // Filter and Sort recordings
    const filteredRecordings = pastClasses.filter(c => {
        // Multi-token search across class name, instructor, and subtopics
        const tokens = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
        const subtopicsStr = Array.isArray(c.class_subtopics)
            ? c.class_subtopics.join(" ")
            : (typeof c.class_subtopics === "string" ? c.class_subtopics : "");
        const searchableText = `${c.class_name || ""} ${c.instructor_name || ""} ${subtopicsStr}`.toLowerCase();
        const matchesSearch = tokens.length === 0 || tokens.every(t => searchableText.includes(t));

        // Attendance check
        const studentsJoined: string[] = Array.isArray(c.students_joined) ? c.students_joined : [];
        const attendanceList: any[] = Array.isArray(c.attendance) ? c.attendance : [];
        const hasAttended = studentsJoined.some(e => e?.toLowerCase() === userEmail) ||
            attendanceList.some(r => r?.user_email?.toLowerCase() === userEmail);

        // Quick status pills filter (all, attended, missed)
        if (filterStatus === "attended" && !hasAttended) return false;
        if (filterStatus === "missed" && hasAttended) return false;

        return matchesSearch;
    }).sort((a, b) => {
        if (sortBy === "newest") {
            return Number(b.class_time_epoch || 0) - Number(a.class_time_epoch || 0);
        }
        if (sortBy === "oldest") {
            return Number(a.class_time_epoch || 0) - Number(b.class_time_epoch || 0);
        }
        if (sortBy === "rating") {
            const rA = Number(a.average_ratings?.overall || a.average_ratings?.content || 0);
            const rB = Number(b.average_ratings?.overall || b.average_ratings?.content || 0);
            return rB - rA;
        }
        if (sortBy === "duration") {
            return Number(b.class_duration || 60) - Number(a.class_duration || 60);
        }
        return 0;
    });

    const isFiltersActive = searchQuery.trim() !== "" || sortBy !== "newest" || filterStatus !== "all";

    const resetFilters = () => {
        setSearchQuery("");
        setSortBy("newest");
        setFilterStatus("all");
    };

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            {/* Clean Page Header (No huge banner) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
                        <Link href={`/batch/${batchId}`} className="text-blue-600 hover:underline font-medium">
                            {batchData?.batch_name || "Batch"}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-700 font-semibold">Recordings</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
                        <Video className="w-7 h-7 text-purple-600" />
                        Class Recordings
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                        Watch previous lecture recordings, download study notes, and review concepts for {batchData?.batch_name}.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs py-1 px-3 bg-purple-50 text-purple-700 border-purple-200 font-semibold">
                        {recordedTotalCount} Videos Available
                    </Badge>
                    <Badge variant="outline" className="text-xs py-1 px-3 bg-slate-50 text-slate-700 border-slate-200">
                        {pastClasses.length} Past Lectures
                    </Badge>
                </div>
            </div>

            {/* Advanced Search & Filtering Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search lectures by title, concepts, or instructor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 text-xs sm:text-sm h-10 bg-slate-50/50 border-gray-200 focus:bg-white transition"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Sort By Filter */}
                    <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                        <SelectTrigger className="w-full md:w-[180px] h-10 text-xs sm:text-sm">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="rating">Highest Rated ⭐</SelectItem>
                            <SelectItem value="duration">Longest Duration</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Reset Button */}
                    {isFiltersActive && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="text-xs text-gray-600 hover:text-red-600 h-10 px-3 flex items-center gap-1.5"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* Quick Status Pill Filters (Only All, Attended, Missed) */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 text-xs">
                    <span className="text-gray-400 font-medium text-[11px] mr-1">Filter:</span>
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            filterStatus === "all"
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                        }`}
                    >
                        All ({pastClasses.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("attended")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            filterStatus === "attended"
                                ? "bg-emerald-700 text-white shadow-sm"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                    >
                        Attended
                    </button>
                    <button
                        onClick={() => setFilterStatus("missed")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            filterStatus === "missed"
                                ? "bg-rose-700 text-white shadow-sm"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        }`}
                    >
                        Missed
                    </button>
                </div>
            </div>

            {/* Results Count Banner */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>
                    Showing <strong className="text-gray-900">{filteredRecordings.length}</strong> of {pastClasses.length} lectures
                </span>
                {isFiltersActive && (
                    <span className="text-purple-600 font-medium">Active filters applied</span>
                )}
            </div>

            {/* Recordings Cards Grid */}
            {filteredRecordings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300 p-8 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                        <Video className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">No matching lectures found</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                        {pastClasses.length === 0
                            ? "No lectures have concluded in this batch yet. Once a session ends, its video recording and notes will appear here."
                            : "Try adjusting your search keywords or reset the filters to see all available class recordings."}
                    </p>
                    {isFiltersActive && (
                        <div className="pt-2">
                            <Button size="sm" variant="outline" onClick={resetFilters} className="text-xs">
                                Reset All Filters
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecordings.map((c, idx) => {
                        const classIdentifier = c.id || c.class_url_slug || `class-${idx}`;
                        const lectureUrl = `/batch/${batchId}/recordings/${classIdentifier}`;

                        // Check attendance
                        const studentsJoined: string[] = Array.isArray(c.students_joined) ? c.students_joined : [];
                        const attendanceList: any[] = Array.isArray(c.attendance) ? c.attendance : [];
                        const hasAttended = studentsJoined.some(e => e?.toLowerCase() === userEmail) ||
                            attendanceList.some(r => r?.user_email?.toLowerCase() === userEmail);

                        // Rating info
                        const avgRating = Number(c.average_ratings?.overall || c.average_ratings?.content || 0);
                        const totalReviews = Number(c.average_ratings?.total_reviews || 0);

                        // User rating check
                        const ratingsObj = c.ratings || {};
                        const hasUserRated = Boolean(
                            c.has_user_rated ||
                            (userEmail && (
                                (Array.isArray(ratingsObj.overall) && ratingsObj.overall.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail)) ||
                                (Array.isArray(ratingsObj.content) && ratingsObj.content.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail)) ||
                                (Array.isArray(ratingsObj.doubts) && ratingsObj.doubts.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail)) ||
                                (Array.isArray(ratingsObj.engagement) && ratingsObj.engagement.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail))
                            ))
                        );

                        const subtopicsDisplay = Array.isArray(c.class_subtopics)
                            ? c.class_subtopics.join(", ")
                            : (typeof c.class_subtopics === "string" ? c.class_subtopics : "");

                        return (
                            <div
                                key={classIdentifier}
                                onClick={() => router.push(lectureUrl)}
                                className="group cursor-pointer rounded-2xl bg-white border border-gray-200/90 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1"
                            >
                                {/* Card Media Header */}
                                <div className="relative h-44 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center overflow-hidden">
                                    {/* Ambient Grid Pattern */}
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />

                                    {/* Play Button Overlay */}
                                    <div className="relative z-10 w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300 shadow-lg">
                                        <Play className="w-6 h-6 fill-white ml-0.5" />
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-gray-300" />
                                        {c.class_duration || 60} mins
                                    </div>

                                    {/* Top Left Status Badges */}
                                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                                        {c.class_recording ? (
                                            <Badge className="bg-emerald-500/90 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm">
                                                RECORDED 🎥
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5">
                                                PROCESSING
                                            </Badge>
                                        )}

                                        {hasAttended && (
                                            <Badge className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 shadow-sm flex items-center gap-0.5">
                                                <CheckCircle className="w-2.5 h-2.5" /> ATTENDED
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        {/* Scheduled Date */}
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{formatISTTime(Number(c.class_time_epoch))}</span>
                                        </div>

                                        {/* Lecture Title */}
                                        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
                                            {c.class_name}
                                        </h3>

                                        {/* Subtopics / Concepts Covered */}
                                        {subtopicsDisplay && (
                                            <p className="text-xs text-gray-500 line-clamp-1">
                                                <strong className="text-gray-700">Concepts:</strong> {subtopicsDisplay}
                                            </p>
                                        )}
                                    </div>

                                    {/* Instructor & Rating Row */}
                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                                                {c.instructor_name ? c.instructor_name[0].toUpperCase() : "M"}
                                            </div>
                                            <span className="font-medium text-gray-700 truncate max-w-[110px]">
                                                {c.instructor_name || "Course Mentor"}
                                            </span>
                                        </div>

                                        {/* Ratings */}
                                        {avgRating > 0 ? (
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-800 font-bold text-[11px]">
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                <span>{avgRating.toFixed(1)}</span>
                                                <span className="text-gray-400 font-normal">({totalReviews})</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-[11px]">No ratings yet</span>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="pt-1 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1">
                                            {c.class_notes && (
                                                <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                                                    <BookOpen className="w-3 h-3" /> Notes
                                                </span>
                                            )}
                                            {hasUserRated && (
                                                <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                                                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Rated
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-xs font-semibold text-purple-600 group-hover:text-purple-700 flex items-center gap-1 ml-auto">
                                            Open Lecture <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
