"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Video,
    Calendar,
    Clock,
    User,
    Play,
    BookOpen,
    Star,
    ExternalLink,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Download,
    Share2,
    Shield,
    Sparkles,
    Radio,
    MessageSquare,
    Check,
    RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RateClassDialog } from "../../../_components/rate-class-dialog";
import { BatchLoadingState } from "../../../_components/batch-loading-state";
import { BatchUnauthorizedCard } from "../../../_components/batch-unauthorized-card";
import { useBatchData } from "../../../_components/use-batch-data";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import supabase from "@/supabase";
import { toast } from "sonner";

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

function getEmbeddableVideoUrl(url: string | null | undefined): { embedUrl: string | null; isEmbeddable: boolean; type: string } {
    if (!url) return { embedUrl: null, isEmbeddable: false, type: "none" };
    const cleanUrl = url.trim();

    // YouTube URLs
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
        return {
            embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
            isEmbeddable: true,
            type: "youtube"
        };
    }

    // Google Drive URLs
    const gDriveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (gDriveMatch && gDriveMatch[1]) {
        return {
            embedUrl: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`,
            isEmbeddable: true,
            type: "drive"
        };
    }

    // Loom URLs
    const loomMatch = cleanUrl.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/);
    if (loomMatch && loomMatch[1]) {
        return {
            embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
            isEmbeddable: true,
            type: "loom"
        };
    }

    // Vimeo URLs
    const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
        return {
            embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
            isEmbeddable: true,
            type: "vimeo"
        };
    }

    // Direct MP4 / WebM
    if (cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm")) {
        return {
            embedUrl: cleanUrl,
            isEmbeddable: true,
            type: "video"
        };
    }

    return {
        embedUrl: null,
        isEmbeddable: false,
        type: "external"
    };
}

export default function BatchLectureDetailPage() {
    const router = useRouter();
    const routeParams = useParams();
    const classIdParam = Array.isArray(routeParams?.classId) ? routeParams.classId[0] : (routeParams?.classId as string) || "";

    const { batchId, batchData, classes, user, status, errorMessage, refetch } = useBatchData();
    const [markingAttendance, setMarkingAttendance] = useState(false);

    if (status === "loading") {
        return <BatchLoadingState message="Loading lecture theater..." />;
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

    // Find current class in the batch's classes
    const currentClass = classes.find(c =>
        String(c.id) === String(classIdParam) ||
        String(c.class_url_slug) === String(classIdParam)
    ) || null;

    if (!currentClass) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <Video className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Lecture Not Found</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                    The requested class recording could not be found in this batch. It may have been relocated or updated by an administrator.
                </p>
                <div className="pt-2">
                    <Link href={`/batch/${batchId}/recordings`}>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white text-xs">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Recordings
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const userEmail = (user?.email || "").trim().toLowerCase();

    // Check attendance for current user
    const studentsJoined: string[] = Array.isArray(currentClass.students_joined) ? currentClass.students_joined : [];
    const attendanceList: any[] = Array.isArray(currentClass.attendance) ? currentClass.attendance : [];
    const hasAttended = studentsJoined.some(e => e?.toLowerCase() === userEmail) ||
        attendanceList.some(r => r?.user_email?.toLowerCase() === userEmail);

    // Ratings for current class
    const avgRatings = currentClass.average_ratings || {};
    const overallRating = Number(avgRatings.overall || avgRatings.content || 0);
    const totalReviews = Number(avgRatings.total_reviews || 0);

    const ratingsObj = currentClass.ratings || {};
    const hasUserRated = Boolean(
        currentClass.has_user_rated ||
        (userEmail && (
            (Array.isArray(ratingsObj.overall) && ratingsObj.overall.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail)) ||
            (Array.isArray(ratingsObj.content) && ratingsObj.content.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail)) ||
            (Array.isArray(ratingsObj.doubts) && ratingsObj.doubts.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail)) ||
            (Array.isArray(ratingsObj.engagement) && ratingsObj.engagement.some((r: any) => r?.user_email?.trim().toLowerCase() === userEmail))
        ))
    );

    // User's specific rating score if they rated
    const userRatingScore = currentClass.user_rating?.rating || (
        Array.isArray(ratingsObj.overall)
            ? ratingsObj.overall.find((r: any) => r?.user_email?.trim().toLowerCase() === userEmail)?.rating
            : null
    );

    // Ordered playlist of classes in this batch (chronological)
    const sortedClasses = [...classes].sort((a, b) => Number(a.class_time_epoch || 0) - Number(b.class_time_epoch || 0));
    const currentIndex = sortedClasses.findIndex(c =>
        String(c.id) === String(currentClass.id) ||
        String(c.class_url_slug) === String(currentClass.class_url_slug)
    );

    const prevClass = currentIndex > 0 ? sortedClasses[currentIndex - 1] : null;
    const nextClass = currentIndex < sortedClasses.length - 1 ? sortedClasses[currentIndex + 1] : null;

    const { embedUrl, isEmbeddable, type: videoType } = getEmbeddableVideoUrl(currentClass.class_recording);

    // Mark as watched / join log
    const handleLogAttendance = async () => {
        if (hasAttended) return;
        setMarkingAttendance(true);
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            const identifier = currentClass.id || currentClass.class_url_slug;

            const res = await fetch(`/api/live-classes/${identifier}/join`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            if (res.ok) {
                toast.success("Class participation recorded! 🎉");
                refetch();
            }
        } catch (err) {
            console.error("Error marking attendance:", err);
        } finally {
            setMarkingAttendance(false);
        }
    };

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Link
                        href={`/batch/${batchId}/recordings`}
                        className="flex items-center gap-1.5 text-purple-600 hover:text-purple-800 font-semibold transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Recordings
                    </Link>
                    <span>/</span>
                    <span className="text-gray-400 truncate max-w-[200px] sm:max-w-xs">{batchData?.batch_name}</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
                        {currentClass.class_name}
                    </span>
                </div>

                {/* Prev / Next Quick Nav */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {prevClass ? (
                        <Link href={`/batch/${batchId}/recordings/${prevClass.id || prevClass.class_url_slug}`}>
                            <Button variant="outline" size="sm" className="text-xs h-8 flex items-center gap-1">
                                <ChevronLeft className="w-3.5 h-3.5" /> Previous Lecture
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="sm" disabled className="text-xs h-8 opacity-40">
                            <ChevronLeft className="w-3.5 h-3.5" /> Previous Lecture
                        </Button>
                    )}

                    {nextClass ? (
                        <Link href={`/batch/${batchId}/recordings/${nextClass.id || nextClass.class_url_slug}`}>
                            <Button variant="outline" size="sm" className="text-xs h-8 flex items-center gap-1">
                                Next Lecture <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="outline" size="sm" disabled className="text-xs h-8 opacity-40">
                            Next Lecture <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Main 2-Column Theater Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Video Player & Lecture Hub */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Theater Video Player Section */}
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                        {isEmbeddable && embedUrl ? (
                            <div className="relative w-full aspect-video bg-black">
                                {videoType === "video" ? (
                                    <video
                                        src={embedUrl}
                                        controls
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <iframe
                                        src={embedUrl}
                                        title={currentClass.class_name}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full border-0"
                                    />
                                )}
                            </div>
                        ) : currentClass.class_recording ? (
                            /* Non-embeddable or external link backdrop */
                            <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                                <div className="w-16 h-16 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-white shadow-lg backdrop-blur-md">
                                    <Play className="w-8 h-8 fill-white ml-1" />
                                </div>
                                <div className="space-y-1 max-w-md">
                                    <h3 className="text-lg font-bold">Watch Lecture Recording</h3>
                                    <p className="text-xs text-slate-300">
                                        This recording is hosted on our secure classroom video portal. Click below to stream in high resolution.
                                    </p>
                                </div>
                                <a
                                    href={currentClass.class_recording}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-6 py-2 h-9 flex items-center gap-2 shadow-lg">
                                        <ExternalLink className="w-4 h-4" /> Open Full Video Player
                                    </Button>
                                </a>
                            </div>
                        ) : (
                            /* No recording available yet */
                            <div className="relative w-full aspect-video bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                                <Video className="w-12 h-12 text-slate-600" />
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-slate-200">Recording In Processing</h3>
                                    <p className="text-xs text-slate-400 max-w-sm">
                                        The video recording for this session is being encoded and will be published shortly by your mentors.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Player Bottom Control Bar */}
                        <div className="p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                {hasAttended ? (
                                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1 font-medium">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Attended Live
                                    </Badge>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleLogAttendance}
                                        disabled={markingAttendance}
                                        className="h-7 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5"
                                    >
                                        <Check className="w-3 h-3" />
                                        {markingAttendance ? "Recording..." : "Mark as Watched"}
                                    </Button>
                                )}

                                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    {currentClass.class_duration || 60} mins
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {currentClass.class_recording && (
                                    <a
                                        href={currentClass.class_recording}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-medium"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        Open in New Tab
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lecture Title & Quick Meta Section */}
                    <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-[11px] text-gray-600 font-medium">
                                Lecture #{currentIndex + 1} of {sortedClasses.length}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                {formatISTTime(Number(currentClass.class_time_epoch))}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                            {currentClass.class_name}
                        </h1>

                        {/* Instructor & Rating Highlights */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                                    {currentClass.instructor_name ? currentClass.instructor_name[0].toUpperCase() : "M"}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{currentClass.instructor_name || "Course Mentor"}</div>
                                    <div className="text-[11px] text-gray-500">Instructor & Problem Solver</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {overallRating > 0 ? (
                                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-800 font-bold">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="text-sm">{overallRating.toFixed(1)}</span>
                                        <span className="text-gray-400 font-normal text-xs">({totalReviews} {totalReviews === 1 ? "review" : "reviews"})</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs">No ratings yet</span>
                                )}

                                {hasUserRated ? (
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs py-1.5 px-3 flex items-center gap-1 font-medium">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        {userRatingScore ? `You Rated ${userRatingScore} ⭐` : "You Rated This Lecture"}
                                    </Badge>
                                ) : (
                                    <RateClassDialog
                                        classItem={currentClass}
                                        userEmail={userEmail}
                                        onRatingSubmitted={refetch}
                                        trigger={
                                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 flex items-center gap-1.5 shadow-sm">
                                                <Star className="w-3.5 h-3.5 fill-white" /> Rate Lecture
                                            </Button>
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Tabbed Hub: Concepts and Notes */}
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-gray-100 p-1 rounded-xl">
                            <TabsTrigger value="overview" className="text-xs sm:text-sm font-medium">
                                Lecture Overview
                            </TabsTrigger>
                            <TabsTrigger value="notes" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" />
                                Class Notes {currentClass.class_notes && "•"}
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="pt-4 space-y-4">
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-bold text-gray-900">
                                        Concepts Covered
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-xs sm:text-sm text-gray-600">
                                    {currentClass.class_subtopics ? (
                                        <div className="space-y-2">
                                            <p className="font-semibold text-gray-800">Key Algorithms and Concepts:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(Array.isArray(currentClass.class_subtopics)
                                                    ? currentClass.class_subtopics
                                                    : String(currentClass.class_subtopics).split(/[,;]+/)
                                                ).map((tag: any, i: number) => (
                                                    <Badge key={i} variant="secondary" className="text-xs bg-slate-100 text-slate-800 font-medium py-1 px-2.5">
                                                        {String(tag).trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">
                                            Live classroom discussion on algorithmic patterns and interview problem-solving.
                                        </p>
                                    )}

                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                                        <span className="font-bold text-gray-800 block">Class Notes & Slides</span>
                                        {currentClass.class_notes ? (
                                            <a
                                                href={currentClass.class_notes}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                Open Class Notes & Slides <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">Class notes will be uploaded shortly by the instructor.</span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Single Overall Rating Card */}
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            Lecture Rating
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Overall student rating for this session
                                        </CardDescription>
                                    </div>
                                    {!hasUserRated && (
                                        <RateClassDialog
                                            classItem={currentClass}
                                            userEmail={userEmail}
                                            onRatingSubmitted={refetch}
                                            trigger={
                                                <Button size="sm" variant="outline" className="text-xs h-8 text-amber-700 border-amber-300 hover:bg-amber-50">
                                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" /> Add Your Rating
                                                </Button>
                                            }
                                        />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/70">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black text-gray-900">
                                                    {overallRating > 0 ? `${overallRating.toFixed(1)} / 5` : "Not yet rated"}
                                                </span>
                                                {overallRating > 0 && (
                                                    <div className="flex items-center text-amber-500">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star
                                                                key={s}
                                                                className={`w-4 h-4 ${
                                                                    s <= Math.round(overallRating)
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Based on {totalReviews} {totalReviews === 1 ? "student rating" : "student ratings"}
                                            </p>
                                        </div>

                                        <div className="text-xs">
                                            {hasUserRated ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 py-1 px-3 text-xs font-semibold flex items-center gap-1.5">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                    {userRatingScore ? `Your Rating: ${userRatingScore} / 5 ⭐` : "You have rated this lecture"}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">
                                                    You haven't submitted a rating for this lecture yet.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Class Notes Tab */}
                        <TabsContent value="notes" className="pt-4">
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                        Lecture Study Material
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Handwritten notes, slide decks, and code references
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {currentClass.class_notes ? (
                                        <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            <div className="space-y-1 text-center sm:text-left">
                                                <h4 className="font-bold text-gray-900 text-sm">{currentClass.class_name} - Official Notes</h4>
                                                <p className="text-xs text-gray-500">
                                                    Download or review the full lecture PDF presentation and code snippets.
                                                </p>
                                            </div>
                                            <a
                                                href={currentClass.class_notes}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-4 flex items-center gap-1.5 shadow">
                                                    <Download className="w-4 h-4" /> Download / Open Notes
                                                </Button>
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 text-xs">
                                            No notes uploaded for this class yet.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right 1 Column: Batch Lectures Playlist Sidebar */}
                <div className="space-y-4">
                    <Card className="shadow-md border-gray-200 overflow-hidden sticky top-24">
                        <CardHeader className="bg-slate-900 text-white p-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                                    <Video className="w-4 h-4 text-purple-400" />
                                    Batch Playlist
                                </CardTitle>
                                <Badge className="bg-white/10 text-white border-white/20 text-[10px]">
                                    {currentIndex + 1} of {sortedClasses.length}
                                </Badge>
                            </div>
                            <CardDescription className="text-slate-400 text-[11px]">
                                {batchData?.batch_name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 max-h-[600px] overflow-y-auto space-y-1.5 no-scrollbar">
                            {sortedClasses.map((c, idx) => {
                                const isCurrent = String(c.id) === String(currentClass.id) || String(c.class_url_slug) === String(currentClass.class_url_slug);
                                const lectureIdentifier = c.id || c.class_url_slug;
                                const lectureUrl = `/batch/${batchId}/recordings/${lectureIdentifier}`;

                                return (
                                    <Link key={lectureIdentifier} href={lectureUrl}>
                                        <div
                                            className={`p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                                                isCurrent
                                                    ? "bg-purple-50/80 border-2 border-purple-500 shadow-sm"
                                                    : "hover:bg-slate-50 border border-transparent"
                                            }`}
                                        >
                                            <div
                                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                                                    isCurrent
                                                        ? "bg-purple-600 text-white shadow"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {String(idx + 1).padStart(2, "0")}
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                {isCurrent && (
                                                    <div className="flex items-center justify-end">
                                                        <span className="text-[10px] text-purple-700 font-bold animate-pulse">
                                                            Playing Now
                                                        </span>
                                                    </div>
                                                )}

                                                <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${isCurrent ? "text-purple-950 font-extrabold" : "text-gray-800"}`}>
                                                    {c.class_name}
                                                </h4>

                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 pt-0.5">
                                                    <span>{c.class_duration || 60} mins</span>
                                                    {c.class_recording && (
                                                        <span className="text-emerald-600 font-semibold">• 🎥 Video</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
