"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Radio,
    Calendar,
    Clock,
    User,
    Video,
    Search,
    Filter,
    ArrowUpDown,
    CheckCircle,
    Star,
    ExternalLink,
    GraduationCap,
    BookOpen,
    ArrowRight,
    Sparkles,
    ChevronRight,
    Layers,
    X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { BatchLoadingState } from "../_components/batch-loading-state";
import supabase from "@/supabase";
import { getValidSession, getValidAccessToken } from "@/lib/auth-client";
import { toast } from "sonner";

interface EnrichedClass {
    id?: string;
    class_url_slug?: string;
    class_name: string;
    class_time?: string;
    class_time_epoch?: number | string;
    class_duration?: number | string;
    class_link?: string;
    class_recording?: string;
    class_notes?: string;
    instructor_name?: string;
    class_subtopics?: string[];
    students_joined?: string[];
    attendance?: any[];
    ratings?: any;
    average_ratings?: any;
    batch_id: string;
    batch_name: string;
}

export default function EnrolledLiveClassesPage() {
    const router = useRouter();
    const [classes, setClasses] = useState<EnrichedClass[]>([]);
    const [batches, setBatches] = useState<{ batch_id: string; batch_name: string }[]>([]);
    const [userEmail, setUserEmail] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // Filter & Search states
    const [statusFilter, setStatusFilter] = useState<"all" | "live" | "upcoming" | "completed" | "attended">("all");
    const [selectedBatch, setSelectedBatch] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"upcoming" | "newest" | "oldest" | "rating">("upcoming");
    const [searchQuery, setSearchQuery] = useState("");

    // Live clock ticker
    const [nowEpoch, setNowEpoch] = useState(() => Math.floor(Date.now() / 1000));
    useEffect(() => {
        const timer = setInterval(() => {
            setNowEpoch(Math.floor(Date.now() / 1000));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const loadAllEnrolledClasses = async () => {
        try {
            const session = await getValidSession();
            if (!session) {
                router.replace("/login");
                return;
            }

            let token = session.access_token;
            const email = (session.user.email || "").trim().toLowerCase();
            setUserEmail(email);

            // Fetch user's enrolled batches
            let res = await fetch("/api/batches?all=false", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                const refreshed = await supabase.auth.refreshSession();
                if (refreshed.data.session?.access_token) {
                    token = refreshed.data.session.access_token;
                    res = await fetch("/api/batches?all=false", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                } else {
                    router.replace("/login");
                    return;
                }
            }

            if (!res.ok) {
                setLoading(false);
                return;
            }

            const data = await res.json();
            const rawBatches = Array.isArray(data.batches) ? data.batches : [];

            // Filter to batches where user is enrolled
            const userBatches = rawBatches.filter((b: any) => {
                const students: string[] = Array.isArray(b.enrolled_students) ? b.enrolled_students : [];
                return students.some((e: string) => e?.trim().toLowerCase() === email);
            });

            setBatches(userBatches.map((b: any) => ({ batch_id: b.batch_id, batch_name: b.batch_name })));

            if (userBatches.length === 0) {
                setClasses([]);
                setLoading(false);
                return;
            }

            // Fetch class details for each batch in parallel
            const batchResults = await Promise.all(
                userBatches.map(async (b: any) => {
                    try {
                        const bRes = await fetch(`/api/batches/${b.batch_id}`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (bRes.ok) {
                            const bData = await bRes.json();
                            const batchClasses: any[] = Array.isArray(bData.classes) ? bData.classes : [];
                            return batchClasses.map((c) => ({
                                ...c,
                                batch_id: b.batch_id,
                                batch_name: bData.batch?.batch_name || b.batch_name
                            }));
                        }
                    } catch (e) {
                        console.error(`Error loading classes for batch ${b.batch_id}:`, e);
                    }
                    return [];
                })
            );

            const flattened = batchResults.flat();

            // Deduplicate by id or slug if same class is linked to multiple batches
            const seen = new Set<string>();
            const uniqueClasses: EnrichedClass[] = [];
            for (const item of flattened) {
                const key = item.id || item.class_url_slug;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueClasses.push(item);
                }
            }

            setClasses(uniqueClasses);
        } catch (err) {
            console.error("Error loading live classes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllEnrolledClasses();
    }, []);

    // Instant join handler with async attendance logging
    const handleJoinClass = (e: React.MouseEvent, classItem: EnrichedClass) => {
        e.stopPropagation(); // Do not trigger card click navigation
        const classLink = classItem?.class_link;
        if (!classLink) {
            toast.error("Meeting link is not available yet.");
            return;
        }

        // 1. Synchronous Instant Redirect
        window.open(classLink, "_blank", "noopener,noreferrer");

        // 2. Async attendance recording
        (async () => {
            try {
                const token = await getValidAccessToken();
                const identifier = classItem.id || classItem.class_url_slug;

                const res = await fetch(`/api/live-classes/${identifier}/join`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                });

                if (res.ok) {
                    toast.success("Attendance marked! Joining session 🚀");
                    loadAllEnrolledClasses();
                }
            } catch (err) {
                console.error("Async attendance error:", err);
            }
        })();
    };

    // Calculate class states & filtered/sorted list
    const filteredAndSortedClasses = useMemo(() => {
        return classes
            .map((c) => {
                const startEpoch = Number(c.class_time_epoch || 0);
                const durationMinutes = Number(c.class_duration) || 60;
                const durationSeconds = durationMinutes * 60;
                const endEpoch = startEpoch + durationSeconds;

                const isLive = nowEpoch >= startEpoch && nowEpoch <= endEpoch;
                const isUpcoming = nowEpoch < startEpoch;
                const isPast = nowEpoch > endEpoch;

                const secondsUntil = startEpoch - nowEpoch;
                const isWithin15Mins = isUpcoming && secondsUntil <= 15 * 60 && secondsUntil >= 0;

                const studentsJoined: string[] = Array.isArray(c.students_joined) ? c.students_joined : [];
                const attendanceList: any[] = Array.isArray(c.attendance) ? c.attendance : [];
                const hasAttended =
                    studentsJoined.some((e) => e?.toLowerCase() === userEmail) ||
                    attendanceList.some((r) => r?.user_email?.toLowerCase() === userEmail);

                const avgRating = c.average_ratings?.overall || c.average_ratings?.content || 0;

                return {
                    ...c,
                    startEpoch,
                    durationMinutes,
                    durationSeconds,
                    endEpoch,
                    isLive,
                    isUpcoming,
                    isPast,
                    secondsUntil,
                    isWithin15Mins,
                    hasAttended,
                    avgRating
                };
            })
            .filter((c) => {
                // Batch filter
                if (selectedBatch !== "all" && c.batch_id !== selectedBatch) {
                    return false;
                }

                // Status filter
                if (statusFilter === "live" && !c.isLive) return false;
                if (statusFilter === "upcoming" && !c.isUpcoming) return false;
                if (statusFilter === "completed" && !c.isPast) return false;
                if (statusFilter === "attended" && !c.hasAttended) return false;

                // Search query filter
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase().trim();
                    const nameMatch = c.class_name?.toLowerCase().includes(q);
                    const instructorMatch = c.instructor_name?.toLowerCase().includes(q);
                    const batchMatch = c.batch_name?.toLowerCase().includes(q);
                    const topicMatch = Array.isArray(c.class_subtopics) && c.class_subtopics.some(t => t?.toLowerCase().includes(q));
                    if (!nameMatch && !instructorMatch && !batchMatch && !topicMatch) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "upcoming") {
                    // 1. Live sessions first
                    if (a.isLive && !b.isLive) return -1;
                    if (!a.isLive && b.isLive) return 1;

                    // 2. Upcoming sessions soonest first
                    if (a.isUpcoming && b.isUpcoming) {
                        return a.startEpoch - b.startEpoch;
                    }
                    if (a.isUpcoming && !b.isUpcoming) return -1;
                    if (!a.isUpcoming && b.isUpcoming) return 1;

                    // 3. Past sessions newest first
                    return b.startEpoch - a.startEpoch;
                }

                if (sortBy === "newest") {
                    return b.startEpoch - a.startEpoch;
                }

                if (sortBy === "oldest") {
                    return a.startEpoch - b.startEpoch;
                }

                if (sortBy === "rating") {
                    return b.avgRating - a.avgRating;
                }

                return 0;
            });
    }, [classes, nowEpoch, userEmail, selectedBatch, statusFilter, searchQuery, sortBy]);

    // Summary counts
    const counts = useMemo(() => {
        let live = 0;
        let upcoming = 0;
        let completed = 0;
        let attended = 0;

        for (const c of classes) {
            const start = Number(c.class_time_epoch || 0);
            const duration = (Number(c.class_duration) || 60) * 60;
            const end = start + duration;

            if (nowEpoch >= start && nowEpoch <= end) live++;
            else if (nowEpoch < start) upcoming++;
            else completed++;

            const sj: string[] = Array.isArray(c.students_joined) ? c.students_joined : [];
            const att: any[] = Array.isArray(c.attendance) ? c.attendance : [];
            if (
                sj.some(e => e?.toLowerCase() === userEmail) ||
                att.some(r => r?.user_email?.toLowerCase() === userEmail)
            ) {
                attended++;
            }
        }

        return { total: classes.length, live, upcoming, completed, attended };
    }, [classes, nowEpoch, userEmail]);

    if (loading) {
        return <BatchLoadingState message="Loading your enrolled live classes..." variant="dashboard" />;
    }

    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in-50 duration-300">
            {/* 1. Header Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                <Video className="w-5 h-5" />
                            </span>
                            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 font-bold text-xs">
                                Live Cohort Schedule
                            </Badge>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                            Enrolled Live Classes
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            All scheduled, live, and recorded sessions across your enrolled batches. Click any class to jump straight into its classroom.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Link href="/batch">
                            <Button variant="outline" className="border-border/80 text-foreground text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                                <GraduationCap className="w-4 h-4 text-blue-600" />
                                <span>My Batches ({batches.length})</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick stats counter tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground">Total Sessions</div>
                        <div className="text-xl sm:text-2xl font-black text-foreground">{counts.total}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                        <div className="text-xs font-semibold text-red-600 flex items-center gap-1">
                            {counts.live > 0 && <Radio className="w-3 h-3 animate-ping" />} Live Now
                        </div>
                        <div className={`text-xl sm:text-2xl font-black ${counts.live > 0 ? "text-red-600 animate-pulse" : "text-foreground"}`}>
                            {counts.live}
                        </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                        <div className="text-xs font-semibold text-amber-600">Upcoming</div>
                        <div className="text-xl sm:text-2xl font-black text-foreground">{counts.upcoming}</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                        <div className="text-xs font-semibold text-emerald-600">Attended</div>
                        <div className="text-xl sm:text-2xl font-black text-emerald-600">{counts.attended}</div>
                    </div>
                </div>
            </div>

            {/* 2. Controls Toolbar: Status Tabs, Search, Batch Filter, Sorting */}
            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Status filter pills */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/60 rounded-2xl border border-border/60">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === "all"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            All ({counts.total})
                        </button>
                        <button
                            onClick={() => setStatusFilter("live")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                statusFilter === "live"
                                    ? "bg-red-600 text-white shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            {counts.live > 0 && <Radio className="w-3 h-3 animate-ping" />}
                            Live ({counts.live})
                        </button>
                        <button
                            onClick={() => setStatusFilter("upcoming")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === "upcoming"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Upcoming ({counts.upcoming})
                        </button>
                        <button
                            onClick={() => setStatusFilter("completed")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === "completed"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Completed ({counts.completed})
                        </button>
                        <button
                            onClick={() => setStatusFilter("attended")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === "attended"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Attended ({counts.attended})
                        </button>
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search topic or instructor..."
                                className="pl-9 pr-8 h-9 text-xs rounded-xl bg-card"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Batch Filter Dropdown (if multiple batches) */}
                        {batches.length > 1 && (
                            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                                <SelectTrigger className="h-9 w-40 text-xs rounded-xl bg-card">
                                    <SelectValue placeholder="All Batches" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Batches</SelectItem>
                                    {batches.map((b) => (
                                        <SelectItem key={b.batch_id} value={b.batch_id}>
                                            {b.batch_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* Sort Dropdown */}
                        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                            <SelectTrigger className="h-9 w-44 text-xs rounded-xl bg-card">
                                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                                <SelectValue placeholder="Sort order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upcoming">Upcoming & Live First</SelectItem>
                                <SelectItem value="newest">Newest Date First</SelectItem>
                                <SelectItem value="oldest">Oldest Date First</SelectItem>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 3. Classes List */}
            {filteredAndSortedClasses.length === 0 ? (
                <Card className="rounded-3xl border border-dashed border-border/80 p-12 text-center bg-card/40">
                    <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                            <Video className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-foreground">No Live Classes Found</h3>
                        <p className="text-xs text-muted-foreground">
                            {searchQuery || statusFilter !== "all" || selectedBatch !== "all"
                                ? "No classes match your current search or filter criteria. Try resetting your filters."
                                : "You do not have any classes scheduled in your enrolled batches yet."}
                        </p>
                        {(searchQuery || statusFilter !== "all" || selectedBatch !== "all") && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery("");
                                    setStatusFilter("all");
                                    setSelectedBatch("all");
                                }}
                                className="text-xs rounded-xl"
                            >
                                Reset All Filters
                            </Button>
                        )}
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredAndSortedClasses.map((item) => {
                        const formattedDate = item.startEpoch
                            ? new Date(item.startEpoch * 1000).toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true
                              })
                            : "Date TBA";

                        return (
                            <Card
                                key={`${item.batch_id}-${item.id || item.class_url_slug}`}
                                onClick={() => router.push(`/batch/${item.batch_id}`)}
                                className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer border rounded-2xl ${
                                    item.isLive
                                        ? "border-red-400/80 bg-red-50/15 dark:bg-red-950/10 hover:border-red-500"
                                        : item.isWithin15Mins
                                        ? "border-emerald-400/80 bg-emerald-50/15 dark:bg-emerald-950/10 hover:border-emerald-500"
                                        : "border-border/80 bg-card hover:border-primary/40"
                                }`}
                            >
                                <CardContent className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Left info */}
                                        <div className="space-y-2.5 flex-1 min-w-0">
                                            {/* Status & Batch pills */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                {item.isLive && (
                                                    <Badge variant="destructive" className="animate-pulse font-bold text-xs flex items-center gap-1.5 px-2.5 py-0.5 shadow-sm">
                                                        <Radio className="w-3 h-3 animate-ping" /> LIVE NOW
                                                    </Badge>
                                                )}
                                                {item.isWithin15Mins && (
                                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                                        <Radio className="w-3 h-3 text-emerald-600 animate-ping" /> Joining Open ({Math.max(1, Math.ceil(item.secondsUntil / 60))}m left)
                                                    </Badge>
                                                )}
                                                {item.isUpcoming && !item.isWithin15Mins && (
                                                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-xs">
                                                        Upcoming
                                                    </Badge>
                                                )}
                                                {item.isPast && (
                                                    <Badge variant="outline" className="bg-muted/70 text-muted-foreground text-xs">
                                                        Completed
                                                    </Badge>
                                                )}
                                                {item.hasAttended && (
                                                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3 text-emerald-600" /> Attended
                                                    </Badge>
                                                )}

                                                {/* Batch Name Pill */}
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 flex items-center gap-1">
                                                    <GraduationCap className="w-3.5 h-3.5" />
                                                    {item.batch_name}
                                                </span>
                                            </div>

                                            {/* Class Title */}
                                            <h3 className="text-base sm:text-lg font-bold text-foreground hover:text-primary transition-colors">
                                                {item.class_name}
                                            </h3>

                                            {/* Metadata chips */}
                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                                    {formattedDate} (IST)
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                                    {item.durationMinutes} mins
                                                </span>
                                                {item.instructor_name && (
                                                    <span className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 text-primary" />
                                                        {item.instructor_name}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Subtopic tags */}
                                            {Array.isArray(item.class_subtopics) && item.class_subtopics.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                    {item.class_subtopics.map((t, idx) => (
                                                        <span key={idx} className="text-[11px] bg-muted/80 text-foreground/80 px-2 py-0.5 rounded-md border border-border/60">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Ratings summary */}
                                            {item.avgRating > 0 && (
                                                <div className="flex items-center gap-2 text-xs pt-0.5">
                                                    <span className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                        {item.avgRating.toFixed(1)} / 5
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Action buttons */}
                                        <div className="flex flex-wrap md:flex-col items-stretch md:items-end gap-2 shrink-0 pt-2 md:pt-0">
                                            {item.isLive && (
                                                <Button
                                                    onClick={(e) => handleJoinClass(e, item)}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-red-500/25 flex items-center gap-2"
                                                >
                                                    <Radio className="w-3.5 h-3.5 animate-ping" />
                                                    Join Live Lecture
                                                </Button>
                                            )}

                                            {item.isWithin15Mins && (
                                                <Button
                                                    onClick={(e) => handleJoinClass(e, item)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-emerald-500/25 flex items-center gap-2 animate-pulse"
                                                >
                                                    <Radio className="w-3.5 h-3.5 animate-ping" />
                                                    Join Session Now
                                                </Button>
                                            )}

                                            {item.isUpcoming && !item.isWithin15Mins && (
                                                <div className="text-[11px] text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/60 flex items-center gap-1.5 self-start md:self-end">
                                                    <Clock className="w-3 h-3 text-muted-foreground" />
                                                    <span>Link unlocks 15m before class</span>
                                                </div>
                                            )}

                                            {item.isPast && item.class_recording && (
                                                <a
                                                    href={item.class_recording}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs rounded-xl"
                                                    >
                                                        <Video className="w-3.5 h-3.5" />
                                                        Watch Recording
                                                    </Button>
                                                </a>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 self-start md:self-end"
                                            >
                                                <span>Go to Batch</span>
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
