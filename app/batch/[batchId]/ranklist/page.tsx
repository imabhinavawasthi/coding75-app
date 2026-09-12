"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
    Trophy,
    Medal,
    Search,
    ArrowLeft,
    ExternalLink,
    Code2,
    Flame,
    TrendingUp,
    ShieldAlert,
    Sparkles,
    User,
    GraduationCap,
    SlidersHorizontal,
    Crown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BatchLoadingState } from "../../_components/batch-loading-state";
import { BatchUnauthorizedCard } from "../../_components/batch-unauthorized-card";
import { useBatchData } from "../../_components/use-batch-data";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import supabase from "@/supabase";
import { getPlatformProfileUrl } from "@/lib/profile-constants";

interface StudentRankItem {
    id?: string;
    studentId?: string;
    rank: number;
    email: string;
    name: string;
    avatarUrl?: string;
    college?: string | null;
    hasAllHandles: boolean;
    handles: {
        leetcode: string;
        codeforces: string;
        codechef: string;
    };
    stats: {
        leetcode: { handle: string; rating: number; solved: number };
        codeforces: { handle: string; rating: number; maxRating: number; rank: string; solved: number };
        codechef: { handle: string; rating: number; stars: string; solved: number };
    };
    mainRating: number;
    averageRating: number;
    totalSolved: number;
    weeklyProblemsDelta?: number;
    weeklyRatingDelta?: number;
}

export default function BatchRanklistPage() {
    const { batchId, batchData, status: batchStatus, errorMessage: batchError } = useBatchData();

    const [students, setStudents] = useState<StudentRankItem[]>([]);
    const [loadingRanklist, setLoadingRanklist] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"mainRating" | "totalSolved" | "weeklyGrowth" | "weeklyRatingGrowth" | "leetcodeRating" | "codeforcesRating" | "codechefRating">("mainRating");

    const fetchRanklist = useCallback(async () => {
        if (!batchId) return;
        try {
            setLoadingRanklist(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch(`/api/batches/${batchId}/ranklist`, {
                headers: {
                    "Authorization": `Bearer ${session.access_token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setStudents(data.ranklist || []);
            }
        } catch (err) {
            console.error("Error loading ranklist:", err);
        } finally {
            setLoadingRanklist(false);
        }
    }, [batchId]);

    useEffect(() => {
        fetchRanklist();
    }, [fetchRanklist]);

    // Filter and Sort students
    const filteredAndSortedStudents = useMemo(() => {
        let result = [...students];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                (s.college && s.college.toLowerCase().includes(q)) ||
                s.handles.leetcode.toLowerCase().includes(q) ||
                s.handles.codeforces.toLowerCase().includes(q) ||
                s.handles.codechef.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            if (sortBy === "mainRating") {
                if (b.mainRating !== a.mainRating) return b.mainRating - a.mainRating;
                return b.totalSolved - a.totalSolved;
            }
            if (sortBy === "totalSolved") {
                if (b.totalSolved !== a.totalSolved) return b.totalSolved - a.totalSolved;
                return b.mainRating - a.mainRating;
            }
            if (sortBy === "weeklyGrowth") {
                return (b.weeklyProblemsDelta || 0) - (a.weeklyProblemsDelta || 0);
            }
            if (sortBy === "weeklyRatingGrowth") {
                return (b.weeklyRatingDelta || 0) - (a.weeklyRatingDelta || 0);
            }
            if (sortBy === "leetcodeRating") {
                return (b.stats.leetcode?.rating || 0) - (a.stats.leetcode?.rating || 0);
            }
            if (sortBy === "codeforcesRating") {
                return (b.stats.codeforces?.rating || 0) - (a.stats.codeforces?.rating || 0);
            }
            if (sortBy === "codechefRating") {
                return (b.stats.codechef?.rating || 0) - (a.stats.codechef?.rating || 0);
            }
            return 0;
        });

        return result;
    }, [students, searchQuery, sortBy]);

    if (batchStatus === "loading" || loadingRanklist) {
        return <BatchLoadingState message="Loading Batch Ranklist..." />;
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

    if (batchType !== "dsa") {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-12">
                <Card className="border-slate-200 text-center p-8 space-y-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Ranklist Not Available</h2>
                        <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
                            The competitive coding ranklist is exclusively available for <strong>DSA & CP</strong> batches.
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

    // Top 3 Podium
    const topThree = students.slice(0, 3);
    const goldStudent = topThree[0];
    const silverStudent = topThree[1];
    const bronzeStudent = topThree[2];

    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={`/batch/${batchId}`} className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
                            <ArrowLeft className="w-3.5 h-3.5" /> Batch Dashboard
                        </Link>
                        <span className="text-gray-300">/</span>
                        <Link href={`/batch/${batchId}/progress`} className="text-xs text-gray-500 hover:text-gray-900">
                            My Progress
                        </Link>
                        <span className="text-gray-300">/</span>
                        <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                            Leaderboard
                        </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2.5">
                        <Trophy className="w-7 h-7 text-amber-500" />
                        Batch Ranklist
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Live competitive ranking of students based on contest ratings across LeetCode, Codeforces, and CodeChef
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={`/batch/${batchId}/progress`}>
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs h-9">
                            <User className="w-3.5 h-3.5" />
                            My Personal Progress
                        </Button>
                    </Link>
                </div>
            </div>

            {/* TOP 3 PODIUM SECTION (if at least 1 student has ratings) */}
            {students.length > 0 && goldStudent && goldStudent.mainRating > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-4 pb-2">
                    {/* Rank 2 (Silver) */}
                    {silverStudent ? (
                        <Card className="border-slate-200 bg-gradient-to-t from-slate-50 to-white shadow-sm order-2 md:order-1">
                            <CardContent className="p-5 text-center space-y-3">
                                <Link
                                    href={`/batch/${batchId}/student/${silverStudent.id || encodeURIComponent(silverStudent.email)}/progress`}
                                    className="group inline-block"
                                >
                                    <div className="relative inline-block">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center mx-auto text-xl font-bold text-slate-700 overflow-hidden group-hover:border-slate-400 group-hover:scale-105 transition">
                                            {silverStudent.avatarUrl ? (
                                                <img src={silverStudent.avatarUrl} alt={silverStudent.name} className="w-full h-full object-cover" />
                                            ) : (
                                                silverStudent.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center text-xs font-bold shadow-sm">
                                            2
                                        </span>
                                    </div>

                                    <div className="mt-2">
                                        <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-emerald-700 group-hover:underline transition">
                                            {silverStudent.name}
                                        </h4>
                                        <p className="text-[11px] text-gray-500 truncate">{silverStudent.college || silverStudent.email}</p>
                                    </div>
                                </Link>

                                <div className="bg-slate-100/70 p-2.5 rounded-lg border border-slate-200">
                                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Main Rating</span>
                                    <p className="text-xl font-extrabold text-slate-800">{silverStudent.mainRating}</p>
                                    <span className="text-[10px] text-gray-500">{silverStudent.totalSolved} problems solved</span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : <div className="hidden md:block order-1" />}

                    {/* Rank 1 (Gold - Elevated) */}
                    <Card className="border-amber-300 bg-gradient-to-t from-amber-50/50 to-white shadow-md order-1 md:order-2 md:-translate-y-2">
                        <CardHeader className="p-3 pb-0 text-center">
                            <Crown className="w-6 h-6 text-amber-500 mx-auto" />
                        </CardHeader>
                        <CardContent className="p-5 pt-2 text-center space-y-3">
                            <Link
                                href={`/batch/${batchId}/student/${goldStudent.id || encodeURIComponent(goldStudent.email)}/progress`}
                                className="group inline-block"
                            >
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center mx-auto text-2xl font-bold text-amber-800 overflow-hidden shadow group-hover:border-amber-500 group-hover:scale-105 transition">
                                        {goldStudent.avatarUrl ? (
                                            <img src={goldStudent.avatarUrl} alt={goldStudent.name} className="w-full h-full object-cover" />
                                        ) : (
                                            goldStudent.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 border border-amber-500 flex items-center justify-center text-xs font-black shadow">
                                        1
                                    </span>
                                </div>

                                <div className="mt-2">
                                    <Badge className="bg-amber-500 text-white text-[10px] mb-1">Batch Leader</Badge>
                                    <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-emerald-700 group-hover:underline transition">
                                        {goldStudent.name}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 truncate">{goldStudent.college || goldStudent.email}</p>
                                </div>
                            </Link>

                            <div className="bg-amber-100/60 p-3 rounded-xl border border-amber-200">
                                <span className="text-[10px] text-amber-900 uppercase font-semibold">Main Rating</span>
                                <p className="text-2xl font-black text-amber-900">{goldStudent.mainRating}</p>
                                <span className="text-[11px] text-amber-800 font-medium">{goldStudent.totalSolved} total solved</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rank 3 (Bronze) */}
                    {bronzeStudent ? (
                        <Card className="border-amber-200/60 bg-gradient-to-t from-orange-50/30 to-white shadow-sm order-3">
                            <CardContent className="p-5 text-center space-y-3">
                                <Link
                                    href={`/batch/${batchId}/student/${bronzeStudent.id || encodeURIComponent(bronzeStudent.email)}/progress`}
                                    className="group inline-block"
                                >
                                    <div className="relative inline-block">
                                        <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-amber-600/30 flex items-center justify-center mx-auto text-xl font-bold text-amber-900 overflow-hidden group-hover:border-amber-600 group-hover:scale-105 transition">
                                            {bronzeStudent.avatarUrl ? (
                                                <img src={bronzeStudent.avatarUrl} alt={bronzeStudent.name} className="w-full h-full object-cover" />
                                            ) : (
                                                bronzeStudent.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white border border-amber-800 flex items-center justify-center text-xs font-bold shadow-sm">
                                            3
                                        </span>
                                    </div>

                                    <div className="mt-2">
                                        <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-emerald-700 group-hover:underline transition">
                                            {bronzeStudent.name}
                                        </h4>
                                        <p className="text-[11px] text-gray-500 truncate">{bronzeStudent.college || bronzeStudent.email}</p>
                                    </div>
                                </Link>

                                <div className="bg-orange-50/80 p-2.5 rounded-lg border border-orange-200/60">
                                    <span className="text-[10px] text-amber-900 uppercase font-semibold">Main Rating</span>
                                    <p className="text-xl font-extrabold text-amber-900">{bronzeStudent.mainRating}</p>
                                    <span className="text-[10px] text-gray-500">{bronzeStudent.totalSolved} problems solved</span>
                                </div>
                            </CardContent>
                        </Card>
                    ) : <div className="hidden md:block order-3" />}
                </div>
            )}

            {/* FULL LEADERBOARD TABLE SECTION */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 border-b bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <Medal className="w-4 h-4 text-emerald-600" />
                                Overall Standings ({filteredAndSortedStudents.length} Students)
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Students ordered primarily by combined contest rating across LeetCode, Codeforces, and CodeChef
                            </CardDescription>
                        </div>

                        {/* Search and Sort */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="relative w-full sm:w-56">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Search student or handle..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 h-8 text-xs"
                                />
                            </div>

                            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                                <SelectTrigger className="h-8 text-xs w-full sm:w-44">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mainRating">Sort by: Main Rating</SelectItem>
                                    <SelectItem value="weeklyGrowth">Sort by: Weekly Growth (+Solved)</SelectItem>
                                    <SelectItem value="weeklyRatingGrowth">Sort by: Rating Surge (+Rating)</SelectItem>
                                    <SelectItem value="totalSolved">Sort by: Total Solved</SelectItem>
                                    <SelectItem value="leetcodeRating">Sort by: LeetCode Rating</SelectItem>
                                    <SelectItem value="codeforcesRating">Sort by: Codeforces Rating</SelectItem>
                                    <SelectItem value="codechefRating">Sort by: CodeChef Rating</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {filteredAndSortedStudents.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-xs">
                            No students match the search criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="border-b bg-slate-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="py-3 px-4 w-16 text-center">Rank</th>
                                        <th className="py-3 px-4">Student</th>
                                        <th className="py-3 px-4 text-center">Main Rating</th>
                                        <th className="py-3 px-4 text-center">Total Solved</th>
                                        <th className="py-3 px-4">LeetCode</th>
                                        <th className="py-3 px-4">Codeforces</th>
                                        <th className="py-3 px-4">CodeChef</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredAndSortedStudents.map((st, idx) => {
                                        const isTop1 = idx === 0 && st.mainRating > 0;
                                        const isTop2 = idx === 1 && st.mainRating > 0;
                                        const isTop3 = idx === 2 && st.mainRating > 0;

                                        return (
                                            <tr
                                                key={st.email}
                                                className={`hover:bg-slate-50/80 transition ${isTop1 ? "bg-amber-50/20" : ""}`}
                                            >
                                                {/* Rank */}
                                                <td className="py-3.5 px-4 text-center">
                                                    {isTop1 ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-sm">
                                                            1
                                                        </span>
                                                    ) : isTop2 ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs shadow-sm">
                                                            2
                                                        </span>
                                                    ) : isTop3 ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs shadow-sm">
                                                            3
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 font-semibold font-mono">
                                                            #{idx + 1}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Student Identity */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <Link
                                                            href={`/batch/${batchId}/student/${st.id || encodeURIComponent(st.email)}/progress`}
                                                            className="shrink-0 group"
                                                            title={`View ${st.name}'s Progress`}
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center text-xs font-bold text-slate-700 overflow-hidden group-hover:ring-2 group-hover:ring-emerald-500 group-hover:scale-105 transition">
                                                                {st.avatarUrl ? (
                                                                    <img src={st.avatarUrl} alt={st.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    st.name.charAt(0).toUpperCase()
                                                                )}
                                                            </div>
                                                        </Link>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                                                                <Link
                                                                    href={`/batch/${batchId}/student/${st.id || encodeURIComponent(st.email)}/progress`}
                                                                    className="hover:text-emerald-700 hover:underline transition font-semibold text-gray-900 truncate"
                                                                    title={`View ${st.name}'s Progress`}
                                                                >
                                                                    {st.name}
                                                                </Link>
                                                                {!st.hasAllHandles && (
                                                                    <Badge variant="outline" className="text-[9px] py-0 px-1 text-amber-600 bg-amber-50 border-amber-200">
                                                                        Pending
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-gray-400 truncate">
                                                                {st.college || st.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Main Rating */}
                                                <td className="py-3.5 px-4 text-center">
                                                    <div className="inline-block">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span className="text-sm font-extrabold text-emerald-700 block">
                                                                {st.mainRating}
                                                            </span>
                                                            {Boolean(st.weeklyRatingDelta && st.weeklyRatingDelta > 0) && (
                                                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                                                    +{st.weeklyRatingDelta}
                                                                </span>
                                                            )}
                                                            {Boolean(st.weeklyRatingDelta && st.weeklyRatingDelta < 0) && (
                                                                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                                                                    {st.weeklyRatingDelta}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 font-normal">
                                                            avg: {st.averageRating}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Total Solved */}
                                                <td className="py-3.5 px-4 text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <Badge variant="secondary" className="font-mono text-xs font-bold bg-slate-100">
                                                            {st.totalSolved}
                                                        </Badge>
                                                        {Boolean(st.weeklyProblemsDelta && st.weeklyProblemsDelta > 0) && (
                                                            <span className="text-[9px] font-bold text-emerald-600 mt-0.5">
                                                                +{st.weeklyProblemsDelta} this wk
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* LeetCode */}
                                                <td className="py-3.5 px-4">
                                                    {st.handles.leetcode ? (
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-bold text-gray-900">
                                                                    {st.stats.leetcode.rating ? st.stats.leetcode.rating : "Unrated"}
                                                                </span>
                                                                <span className="text-[11px] text-gray-400">
                                                                    ({st.stats.leetcode.solved} solved)
                                                                </span>
                                                            </div>
                                                            <a
                                                                href={getPlatformProfileUrl("leetcode", st.handles.leetcode)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[11px] text-amber-700 hover:underline flex items-center gap-0.5"
                                                            >
                                                                @{st.handles.leetcode} <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>

                                                {/* Codeforces */}
                                                <td className="py-3.5 px-4">
                                                    {st.handles.codeforces ? (
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-bold text-gray-900">
                                                                    {st.stats.codeforces.rating ? st.stats.codeforces.rating : "Unrated"}
                                                                </span>
                                                                <span className="text-[11px] text-gray-400">
                                                                    ({st.stats.codeforces.solved} solved)
                                                                </span>
                                                            </div>
                                                            <a
                                                                href={getPlatformProfileUrl("codeforces", st.handles.codeforces)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[11px] text-blue-700 hover:underline flex items-center gap-0.5"
                                                            >
                                                                @{st.handles.codeforces} <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>

                                                {/* CodeChef */}
                                                <td className="py-3.5 px-4">
                                                    {st.handles.codechef ? (
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-bold text-gray-900">
                                                                    {st.stats.codechef.rating ? st.stats.codechef.rating : "Unrated"}
                                                                </span>
                                                                <span className="text-[11px] text-gray-400">
                                                                    ({st.stats.codechef.solved} solved)
                                                                </span>
                                                            </div>
                                                            <a
                                                                href={getPlatformProfileUrl("codechef", st.handles.codechef)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[11px] text-yellow-800 hover:underline flex items-center gap-0.5"
                                                            >
                                                                @{st.handles.codechef} <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
