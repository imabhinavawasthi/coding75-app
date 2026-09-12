"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BarChart2,
    Code2,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    RefreshCw,
    Flame,
    Trophy,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    ArrowLeft,
    Check,
    Calendar,
    Clock,
    History,
    User,
    ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import supabase from "@/supabase";
import { cleanCodingHandle, getPlatformProfileUrl } from "@/lib/profile-constants";
import { BatchLoadingState } from "./batch-loading-state";
import { BatchUnauthorizedCard } from "./batch-unauthorized-card";
import { useBatchData } from "./use-batch-data";
import { CodingProgressChart } from "./coding-progress-chart";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";

interface CodingSnapshot {
    synced_at: string;
    main_rating: number;
    total_solved: number;
    leetcode: {
        handle: string;
        rating: number;
        solved: number;
        easySolved?: number;
        mediumSolved?: number;
        hardSolved?: number;
        ranking?: number | null;
        badge?: string | null;
    };
    codeforces: {
        handle: string;
        rating: number;
        maxRating?: number;
        rank?: string;
        solved: number;
    };
    codechef: {
        handle: string;
        rating: number;
        stars?: string;
        solved: number;
    };
}

interface StudentInfo {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    college?: string | null;
    isCurrentUser: boolean;
}

interface SyncResponse {
    student?: StudentInfo;
    hasAllHandles: boolean;
    latest: CodingSnapshot | null;
    history: CodingSnapshot[];
    deltas: {
        weeklyProblemsDelta: number;
        weeklyRatingDelta: number;
        monthlyProblemsDelta: number;
        monthlyRatingDelta: number;
        leetcodeRatingDelta?: number;
        codeforcesRatingDelta?: number;
        codechefRatingDelta?: number;
    };
    lastManualSync?: string | null;
    canManualSync?: boolean;
    nextSyncAllowedAt?: string | null;
}

interface StudentProgressViewProps {
    batchId: string;
    studentId?: string; // If provided, loads for this student; otherwise loads current user
}

export function StudentProgressView({ batchId, studentId }: StudentProgressViewProps) {
    const router = useRouter();
    const { batchData, status: batchStatus, errorMessage: batchError } = useBatchData();

    // Data state
    const [loadingStats, setLoadingStats] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncData, setSyncData] = useState<SyncResponse | null>(null);
    const [showHistoryTable, setShowHistoryTable] = useState(false);

    // Current user onboarding edit state (only used if isCurrentUser)
    const [existingSocialLinks, setExistingSocialLinks] = useState<Record<string, string>>({});
    const [editLc, setEditLc] = useState("");
    const [editCf, setEditCf] = useState("");
    const [editCc, setEditCc] = useState("");
    const [isSavingHandles, setIsSavingHandles] = useState(false);

    // Load stats from API
    const loadSyncData = useCallback(async () => {
        try {
            setLoadingStats(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            let url = `/api/coding-profiles/sync?batchId=${encodeURIComponent(batchId)}`;
            if (studentId) {
                url += `&studentId=${encodeURIComponent(studentId)}`;
            }

            const res = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                setSyncData(data);
            } else {
                toast.error(data.error || "Failed to load coding stats");
            }
        } catch (err) {
            console.error("Error loading coding stats:", err);
            toast.error("Network error loading platform stats");
        } finally {
            setLoadingStats(false);
        }
    }, [batchId, studentId]);

    // If current user, fetch profile to prefill edit form
    const fetchCurrentUserProfile = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch("/api/profile", {
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            if (!res.ok) return;

            const data = await res.json();
            const links = data.profile?.social_links || {};
            setExistingSocialLinks(links);

            const lc = links.leetcode ? cleanCodingHandle("leetcode", links.leetcode) : "";
            const cf = links.codeforces ? cleanCodingHandle("codeforces", links.codeforces) : "";
            const cc = links.codechef ? cleanCodingHandle("codechef", links.codechef) : "";

            setEditLc(lc);
            setEditCf(cf);
            setEditCc(cc);
        } catch (err) {
            console.error("Error fetching current user profile:", err);
        }
    }, []);

    useEffect(() => {
        loadSyncData();
    }, [loadSyncData]);

    useEffect(() => {
        if (!studentId || syncData?.student?.isCurrentUser) {
            fetchCurrentUserProfile();
        }
    }, [studentId, syncData?.student?.isCurrentUser, fetchCurrentUserProfile]);

    const handleManualSync = async () => {
        try {
            setIsSyncing(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch("/api/coding-profiles/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    force: true,
                    batchId,
                    studentId: studentId || undefined
                })
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to sync stats");
            } else {
                toast.success("Live coding stats updated! 🚀");
                setSyncData(data);
            }
        } catch (err) {
            console.error("Error syncing stats:", err);
            toast.error("Failed to sync coding stats");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSaveProfiles = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const cleanLc = cleanCodingHandle("leetcode", editLc);
        const cleanCf = cleanCodingHandle("codeforces", editCf);
        const cleanCc = cleanCodingHandle("codechef", editCc);

        if (!cleanLc || !cleanCf || !cleanCc) {
            toast.error("All three handles (LeetCode, Codeforces, and CodeChef) are mandatory to proceed!");
            return;
        }

        setIsSavingHandles(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("Session expired. Please log in again.");
                return;
            }

            const updatedLinks = {
                ...existingSocialLinks,
                leetcode: cleanLc,
                codeforces: cleanCf,
                codechef: cleanCc,
            };

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    social_links: updatedLinks
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                toast.error(errData.error || "Failed to update profiles");
                return;
            }

            toast.success("Coding handles connected successfully! 🎉");
            setExistingSocialLinks(updatedLinks);
            loadSyncData();
        } catch (err) {
            console.error("Error updating coding handles:", err);
            toast.error("Failed to save coding handles");
        } finally {
            setIsSavingHandles(false);
        }
    };

    if (batchStatus === "loading" || loadingStats) {
        return <BatchLoadingState message="Loading DSA Progress..." />;
    }

    if (batchStatus === "unauthorized") {
        return <BatchUnauthorizedCard batchName={batchData?.batch_name || batchId} batchId={batchId} />;
    }

    if (batchStatus === "error") {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-12">
                <ErrorBanner message="Failed to load batch" description={batchError} />
            </div>
        );
    }

    const batchType = batchData?.attributes?.batch_type || "general";

    // Non-DSA batch guard
    if (batchType !== "dsa") {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-12">
                <Card className="border-slate-200 text-center p-8 space-y-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Progress Tracking Not Enabled</h2>
                        <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                            DSA progress tracking across LeetCode, Codeforces, and CodeChef is only available for batches configured as <strong>DSA & CP</strong>.
                        </p>
                    </div>
                    <Link href={`/batch/${batchId}`}>
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Batch Dashboard
                        </Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const student = syncData?.student;
    const isCurrentUser = student?.isCurrentUser ?? (!studentId);
    const hasAllThreeHandles = syncData?.hasAllHandles ?? false;
    const latest = syncData?.latest;
    const history = syncData?.history || [];
    const deltas = syncData?.deltas || { weeklyProblemsDelta: 0, weeklyRatingDelta: 0, monthlyProblemsDelta: 0, monthlyRatingDelta: 0 };
    const canManualSync = syncData?.canManualSync ?? true;

    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Header with Navigation & Identity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap text-xs text-gray-500">
                        <Link href={`/batch/${batchId}`} className="hover:text-gray-900 flex items-center gap-1">
                            <ArrowLeft className="w-3.5 h-3.5" /> Batch Dashboard
                        </Link>
                        <span className="text-gray-300">/</span>
                        <Link href={`/batch/${batchId}/ranklist`} className="hover:text-gray-900 flex items-center gap-1 text-emerald-700 font-medium">
                            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Batch Ranklist
                        </Link>
                        {student && !isCurrentUser && (
                            <>
                                <span className="text-gray-300">/</span>
                                <span className="text-gray-900 font-medium truncate max-w-[180px]">
                                    {student.name}
                                </span>
                            </>
                        )}
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 ml-1">
                            DSA & CP
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                        {student?.avatarUrl ? (
                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm shrink-0">
                                <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                            </div>
                        ) : student ? (
                            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base border border-emerald-300 shrink-0">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                                {isCurrentUser ? "DSA & CP Progress Tracking" : `${student?.name || "Student"}'s Progress`}
                                {isCurrentUser && (
                                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 font-normal">
                                        You
                                    </Badge>
                                )}
                            </h1>
                        </div>
                    </div>
                </div>

                {hasAllThreeHandles && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Manual Sync Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleManualSync}
                            disabled={isSyncing || loadingStats || !canManualSync}
                            className="gap-1.5 text-xs h-9"
                            title={!canManualSync ? "Manual sync is permitted once every 24 hours" : "Fetch latest contest ratings & problems"}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                            {isSyncing ? "Syncing..." : canManualSync ? "Sync Stats Now" : "Synced Today"}
                        </Button>

                        {/* Ranklist Link */}
                        <Link href={`/batch/${batchId}/ranklist`}>
                            <Button
                                variant="default"
                                size="sm"
                                className="gap-1.5 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            >
                                <Trophy className="w-4 h-4" />
                                View Batch Ranklist
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* CASE 1: PROFILES NOT CONNECTED */}
            {!hasAllThreeHandles ? (
                isCurrentUser ? (
                    /* If current user, show onboarding form to connect handles */
                    <div className="max-w-2xl mx-auto">
                        <Card className="border-2 border-emerald-200 shadow-md bg-gradient-to-b from-white to-emerald-50/20">
                            <CardHeader className="text-center pb-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900">
                                    Connect All 3 Coding Handles
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                                    To unlock DSA progress tracking in this batch, please enter your active handles for <strong>LeetCode</strong>, <strong>Codeforces</strong>, and <strong>CodeChef</strong>. All three profiles are required.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSaveProfiles} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="lcInput" className="text-xs font-semibold flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                                LeetCode Username or Profile Link *
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-normal">e.g. tourist or leetcode.com/u/tourist</span>
                                        </Label>
                                        <Input
                                            id="lcInput"
                                            placeholder="LeetCode username (e.g. john_doe)"
                                            value={editLc}
                                            onChange={(e) => setEditLc(e.target.value)}
                                            required
                                            className="text-xs h-10"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="cfInput" className="text-xs font-semibold flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                                Codeforces Handle or Profile Link *
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-normal">e.g. tourist or codeforces.com/profile/tourist</span>
                                        </Label>
                                        <Input
                                            id="cfInput"
                                            placeholder="Codeforces handle (e.g. tourist)"
                                            value={editCf}
                                            onChange={(e) => setEditCf(e.target.value)}
                                            required
                                            className="text-xs h-10"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="ccInput" className="text-xs font-semibold flex items-center justify-between">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-yellow-600" />
                                                CodeChef Handle or Profile Link *
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-normal">e.g. gennady or codechef.com/users/gennady</span>
                                        </Label>
                                        <Input
                                            id="ccInput"
                                            placeholder="CodeChef handle (e.g. gennady)"
                                            value={editCc}
                                            onChange={(e) => setEditCc(e.target.value)}
                                            required
                                            className="text-xs h-10"
                                        />
                                    </div>

                                    <div className="pt-3">
                                        <Button
                                            type="submit"
                                            disabled={isSavingHandles}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 gap-2 shadow-sm"
                                        >
                                            {isSavingHandles ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving Profiles...
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="w-4 h-4" /> Save Profiles & View Progress
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    /* If viewing another student whose handles are not connected */
                    <div className="max-w-2xl mx-auto">
                        <Card className="border-slate-200 text-center p-8 space-y-4 bg-white shadow-sm">
                            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                                <AlertCircle className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Profiles Incomplete</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-md mx-auto">
                                    <strong>{student?.name || "This student"}</strong> has not yet connected all three competitive coding profiles (LeetCode, Codeforces, CodeChef). Progress tracking will become available once all handles are linked.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link href={`/batch/${batchId}/ranklist`}>
                                    <Button variant="outline" className="gap-2 text-xs">
                                        <ArrowLeft className="w-4 h-4" /> Back to Batch Ranklist
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )
            ) : (
                /* CASE 2: ALL 3 HANDLES CONNECTED -> DISPLAY STATS, AREA CHART, BREAKDOWNS & HISTORY */
                <div className="space-y-8">
                    {/* Top 4 Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1: Total Problems Solved */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/60 to-white">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-emerald-800">Total Solved</span>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                            {loadingStats ? "..." : (latest?.total_solved || 0)}
                                        </div>
                                        <Badge className={`text-[10px] font-bold px-1.5 py-0.5 ${deltas.weeklyProblemsDelta > 0 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                            {deltas.weeklyProblemsDelta > 0 ? `+${deltas.weeklyProblemsDelta}` : "+0"} this week
                                        </Badge>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Aggregated across all 3 platforms
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 2: LeetCode Rating Increase */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-amber-50/60 to-white">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-amber-800">LeetCode Rating</span>
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                                        LC
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                            {loadingStats ? "..." : (latest?.leetcode?.rating ? latest.leetcode.rating : "Unrated")}
                                        </div>
                                        <Badge className={`text-[10px] font-bold px-1.5 py-0.5 ${(deltas.leetcodeRatingDelta || 0) > 0 ? "bg-emerald-600 text-white" : (deltas.leetcodeRatingDelta || 0) < 0 ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                            {(deltas.leetcodeRatingDelta || 0) > 0 ? `+${deltas.leetcodeRatingDelta}` : (deltas.leetcodeRatingDelta || 0) < 0 ? deltas.leetcodeRatingDelta : "+0"} this week
                                        </Badge>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Contest Rating • {latest?.leetcode?.solved || 0} solved
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3: Codeforces Rating Increase */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50/60 to-white">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-blue-800">Codeforces Rating</span>
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                        CF
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                            {loadingStats ? "..." : (latest?.codeforces?.rating ? latest.codeforces.rating : "Unrated")}
                                        </div>
                                        <Badge className={`text-[10px] font-bold px-1.5 py-0.5 ${(deltas.codeforcesRatingDelta || 0) > 0 ? "bg-emerald-600 text-white" : (deltas.codeforcesRatingDelta || 0) < 0 ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                            {(deltas.codeforcesRatingDelta || 0) > 0 ? `+${deltas.codeforcesRatingDelta}` : (deltas.codeforcesRatingDelta || 0) < 0 ? deltas.codeforcesRatingDelta : "+0"} this week
                                        </Badge>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Current Rating • Max: {latest?.codeforces?.maxRating || "—"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 4: CodeChef Rating Increase */}
                        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-yellow-50/60 to-white">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-yellow-800">CodeChef Rating</span>
                                    <div className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs">
                                        CC
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-baseline gap-2">
                                        <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                                            {loadingStats ? "..." : (latest?.codechef?.rating ? latest.codechef.rating : "Unrated")}
                                        </div>
                                        <Badge className={`text-[10px] font-bold px-1.5 py-0.5 ${(deltas.codechefRatingDelta || 0) > 0 ? "bg-emerald-600 text-white" : (deltas.codechefRatingDelta || 0) < 0 ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                                            {(deltas.codechefRatingDelta || 0) > 0 ? `+${deltas.codechefRatingDelta}` : (deltas.codechefRatingDelta || 0) < 0 ? deltas.codechefRatingDelta : "+0"} this week
                                        </Badge>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Current Rating • {latest?.codechef?.stars || "1★"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* INTERACTIVE AREA PROGRESS CHART */}
                    <CodingProgressChart latest={latest || null} history={history} />

                    {/* PROGRESS TRACKER: WEEKLY & MONTHLY IMPROVEMENT */}
                    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-white shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        Progress Tracker & Performance Growth
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Comparing {isCurrentUser ? "your" : `${student?.name || "student"}'s`} live performance against previous weekly checkpoints
                                    </CardDescription>
                                </div>
                                {latest?.synced_at && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Last synced: {new Date(latest.synced_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 space-y-6">
                            {/* Growth Highlight Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl border border-emerald-100 bg-white shadow-xs">
                                    <span className="text-[11px] text-gray-500 uppercase font-semibold block">Problems Solved (7 Days)</span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className={`text-2xl font-black ${deltas.weeklyProblemsDelta > 0 ? "text-emerald-600" : "text-gray-700"}`}>
                                            {deltas.weeklyProblemsDelta > 0 ? `+${deltas.weeklyProblemsDelta}` : "0"}
                                        </span>
                                        <span className="text-xs text-gray-500">problems</span>
                                    </div>
                                    <p className="text-[11px] text-emerald-700 mt-1">
                                        {deltas.weeklyProblemsDelta > 0 ? "Great weekly problem-solving growth!" : "Weekly checkpoint delta"}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-blue-100 bg-white shadow-xs">
                                    <span className="text-[11px] text-gray-500 uppercase font-semibold block">Main Rating Change (7 Days)</span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className={`text-2xl font-black ${deltas.weeklyRatingDelta > 0 ? "text-emerald-600" : deltas.weeklyRatingDelta < 0 ? "text-rose-600" : "text-gray-700"}`}>
                                            {deltas.weeklyRatingDelta > 0 ? `+${deltas.weeklyRatingDelta}` : deltas.weeklyRatingDelta}
                                        </span>
                                        <span className="text-xs text-gray-500">rating pts</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Combined contest rating delta
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-amber-100 bg-white shadow-xs">
                                    <span className="text-[11px] text-gray-500 uppercase font-semibold block">30-Day Monthly Solved</span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-2xl font-black text-amber-800">
                                            +{deltas.monthlyProblemsDelta}
                                        </span>
                                        <span className="text-xs text-gray-500">solved this month</span>
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Total month-over-month growth
                                    </p>
                                </div>
                            </div>

                            {/* 1-Year Historical Checkpoints Accordion */}
                            {history.length > 0 && (
                                <div className="pt-2 border-t border-emerald-100/60">
                                    <button
                                        type="button"
                                        onClick={() => setShowHistoryTable(prev => !prev)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/50 border border-slate-200 transition text-left group cursor-pointer bg-white"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <History className="w-4 h-4 text-emerald-600 shrink-0" />
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition">
                                                    1-Year Checkpoint History ({history.length} weekly records retained)
                                                </h4>
                                                <p className="text-[11px] text-gray-500">
                                                    {showHistoryTable ? "Click to collapse weekly snapshot records" : "Click to view and inspect past weekly rating checkpoints"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Badge variant="outline" className="text-[10px] text-gray-600 bg-slate-50">
                                                {showHistoryTable ? "Hide Records" : "View Records"}
                                            </Badge>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showHistoryTable ? "rotate-180 text-emerald-600" : ""}`} />
                                        </div>
                                    </button>

                                    {showHistoryTable && (
                                        <div className="mt-3 border rounded-xl overflow-hidden overflow-x-auto bg-white shadow-xs">
                                            <table className="w-full text-xs text-left">
                                                <thead>
                                                    <tr className="bg-slate-50 text-[11px] text-gray-500 uppercase font-semibold border-b">
                                                        <th className="py-2.5 px-3">Date</th>
                                                        <th className="py-2.5 px-3">Main Rating</th>
                                                        <th className="py-2.5 px-3">Total Solved</th>
                                                        <th className="py-2.5 px-3">LeetCode</th>
                                                        <th className="py-2.5 px-3">Codeforces</th>
                                                        <th className="py-2.5 px-3">CodeChef</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {history.map((h, i) => (
                                                        <tr key={i} className="hover:bg-slate-50/60">
                                                            <td className="py-2.5 px-3 text-gray-600 font-medium">
                                                                {new Date(h.synced_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                                            </td>
                                                            <td className="py-2.5 px-3 font-bold text-emerald-700">
                                                                {h.main_rating}
                                                            </td>
                                                            <td className="py-2.5 px-3 font-semibold text-gray-900">
                                                                {h.total_solved}
                                                            </td>
                                                            <td className="py-2.5 px-3 text-gray-600">
                                                                {h.leetcode?.rating || 0} pts ({h.leetcode?.solved || 0} solved)
                                                            </td>
                                                            <td className="py-2.5 px-3 text-gray-600">
                                                                {h.codeforces?.rating || 0} pts ({h.codeforces?.solved || 0} solved)
                                                            </td>
                                                            <td className="py-2.5 px-3 text-gray-600">
                                                                {h.codechef?.rating || 0} pts ({h.codechef?.solved || 0} solved)
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* PLATFORM BREAKDOWN CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* LEETCODE CARD */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                            <CardHeader className="bg-amber-50/40 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                                            LC
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-bold text-gray-900">LeetCode</CardTitle>
                                            <CardDescription className="text-xs">
                                                @{latest?.leetcode?.handle || editLc}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <a
                                        href={getPlatformProfileUrl("leetcode", latest?.leetcode?.handle || editLc)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-amber-600 transition p-1"
                                        title="View LeetCode profile"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4 flex-1">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <span className="text-xs text-gray-500">Contest Rating</span>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-amber-700">
                                            {latest?.leetcode?.rating ? latest.leetcode.rating : "Unrated"}
                                        </span>
                                        {latest?.leetcode?.badge && (
                                            <Badge variant="outline" className="ml-2 text-[10px] bg-amber-50 text-amber-800 border-amber-300">
                                                {latest.leetcode.badge}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Problems Solved</span>
                                        <span className="font-bold text-gray-900">{latest?.leetcode?.solved || 0}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                        <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
                                            <span className="text-[10px] text-emerald-700 font-semibold block">Easy</span>
                                            <span className="text-xs font-bold text-emerald-900">{latest?.leetcode?.easySolved ?? "—"}</span>
                                        </div>
                                        <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                                            <span className="text-[10px] text-amber-700 font-semibold block">Medium</span>
                                            <span className="text-xs font-bold text-amber-900">{latest?.leetcode?.mediumSolved ?? "—"}</span>
                                        </div>
                                        <div className="bg-rose-50 rounded-lg p-2 border border-rose-100">
                                            <span className="text-[10px] text-rose-700 font-semibold block">Hard</span>
                                            <span className="text-xs font-bold text-rose-900">{latest?.leetcode?.hardSolved ?? "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CODEFORCES CARD */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                            <CardHeader className="bg-blue-50/40 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                                            CF
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-bold text-gray-900">Codeforces</CardTitle>
                                            <CardDescription className="text-xs">
                                                @{latest?.codeforces?.handle || editCf}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <a
                                        href={getPlatformProfileUrl("codeforces", latest?.codeforces?.handle || editCf)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-blue-600 transition p-1"
                                        title="View Codeforces profile"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4 flex-1">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <span className="text-xs text-gray-500">Current Rating</span>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-blue-700">
                                            {latest?.codeforces?.rating ? latest.codeforces.rating : "Unrated"}
                                        </span>
                                        {latest?.codeforces?.rank && latest.codeforces.rank !== "unrated" && (
                                            <Badge variant="outline" className="ml-2 text-[10px] bg-blue-50 text-blue-800 border-blue-200 capitalize">
                                                {latest.codeforces.rank}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Max Rating</span>
                                        <span className="font-semibold text-gray-700">{latest?.codeforces?.maxRating || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-2 border-t">
                                        <span className="text-gray-500">Problems Solved</span>
                                        <span className="font-bold text-gray-900">{latest?.codeforces?.solved || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CODECHEF CARD */}
                        <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                            <CardHeader className="bg-yellow-50/40 border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-yellow-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                                            CC
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-bold text-gray-900">CodeChef</CardTitle>
                                            <CardDescription className="text-xs">
                                                @{latest?.codechef?.handle || editCc}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <a
                                        href={getPlatformProfileUrl("codechef", latest?.codechef?.handle || editCc)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-yellow-600 transition p-1"
                                        title="View CodeChef profile"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4 flex-1">
                                <div className="flex items-center justify-between py-2 border-b">
                                    <span className="text-xs text-gray-500">Current Rating</span>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-yellow-800">
                                            {latest?.codechef?.rating ? latest.codechef.rating : "Unrated"}
                                        </span>
                                        {latest?.codechef?.stars && (
                                            <Badge variant="outline" className="ml-2 text-[10px] bg-yellow-100 text-yellow-900 border-yellow-300">
                                                {latest.codechef.stars}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-500">Stars Level</span>
                                        <span className="font-semibold text-yellow-700">{latest?.codechef?.stars || "1★"}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-2 border-t">
                                        <span className="text-gray-500">Problems Solved</span>
                                        <span className="font-bold text-gray-900">{latest?.codechef?.solved || 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
