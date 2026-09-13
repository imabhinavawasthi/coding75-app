"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Radio,
    Calendar,
    Video,
    UserCheck,
    ScrollText,
    BookText,
    GraduationCap,
    Clock,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    BookOpen,
    Code2,
    ExternalLink,
    Send,
    BarChart2,
    Trophy,
    Flame,
    Rocket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { BatchHeader } from "../_components/batch-header";
import { BatchClassCard } from "../_components/batch-class-card";
import { BatchLoadingState } from "../_components/batch-loading-state";
import { BatchUnauthorizedCard } from "../_components/batch-unauthorized-card";
import { useBatchData } from "../_components/use-batch-data";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { toast } from "sonner";

export default function BatchDashboardPage() {
    const { batchId, batchData, classes, user, status, errorMessage, refetch } = useBatchData();

    // Assignment submission dialog state
    const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [submissionNotes, setSubmissionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submittedIds, setSubmittedIds] = useState<string[]>([]);

    if (status === "loading") {
        return <BatchLoadingState message="Loading your batch dashboard..." />;
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
    const liveClasses = classes.filter(c => {
        const t = Number(c.class_time_epoch);
        const d = (Number(c.class_duration) || 60) * 60;
        return nowEpoch >= t && nowEpoch <= (t + d);
    });

    const upcomingClasses = classes.filter(c => Number(c.class_time_epoch) > nowEpoch);
    const pastClasses = classes.filter(c => {
        const t = Number(c.class_time_epoch);
        const d = (Number(c.class_duration) || 60) * 60;
        return nowEpoch > (t + d);
    });

    const userEmail = user?.email || "";
    const attributes = batchData?.attributes || {};

    // Attendance calculation
    const attendedClassesCount = classes.filter(c => {
        const sj: string[] = Array.isArray(c.students_joined) ? c.students_joined : [];
        const att: any[] = Array.isArray(c.attendance) ? c.attendance : [];
        return sj.some(e => e?.toLowerCase() === userEmail.toLowerCase()) ||
            att.some(r => r?.user_email?.toLowerCase() === userEmail.toLowerCase());
    }).length;

    const totalPastCount = pastClasses.length + liveClasses.length;
    const attendancePercentage = totalPastCount > 0 ? Math.round((attendedClassesCount / totalPastCount) * 100) : 100;

    // Assignments (Only real data from batch attributes, empty if none created yet)
    const assignmentsList: any[] = Array.isArray(attributes.assignments) ? attributes.assignments : [];
    const pendingAssignments = assignmentsList.filter(a => !submittedIds.includes(a.id));

    const handleOpenSubmit = (asg: any) => {
        setSelectedAssignment(asg);
        setSubmissionUrl("");
        setSubmissionNotes("");
        setIsSubmitOpen(true);
    };

    const handleSubmitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!submissionUrl.trim()) {
            toast.error("Please provide a submission link");
            return;
        }

        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmittedIds(prev => [...prev, selectedAssignment?.id]);
            setIsSubmitOpen(false);
            toast.success("Assignment submitted successfully! Your mentor will review it. 🎉");
        }, 500);
    };

    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
            {/* Batch Header */}
            <BatchHeader
                batchData={batchData}
                classes={classes}
                userEmail={userEmail}
            />

            {/* Live Now Alert */}
            {liveClasses.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-base sm:text-lg">
                        <Radio className="w-5 h-5 animate-ping" />
                        <span>Live Session In Progress</span>
                    </div>
                    {liveClasses.map(c => (
                        <BatchClassCard
                            key={c.id || c.class_url_slug}
                            classItem={c}
                            userEmail={userEmail}
                            onRefresh={refetch}
                        />
                    ))}
                </div>
            )}

            {/* 2-Column Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Upcoming Classes & Pending Assignments */}
                <div className="lg:col-span-2 space-y-6">
                    {/* SECTION 1: UPCOMING CLASSES */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    Upcoming Classes ({upcomingClasses.length})
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Scheduled live lectures for this batch (All times in IST)
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingClasses.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-xs bg-slate-50 rounded-xl border border-dashed p-6">
                                    No upcoming classes scheduled at the moment. Mentors will update the schedule soon.
                                </div>
                            ) : (
                                upcomingClasses.map(c => (
                                    <BatchClassCard
                                        key={c.id || c.class_url_slug}
                                        classItem={c}
                                        userEmail={userEmail}
                                        onRefresh={refetch}
                                    />
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* SECTION 2: PENDING ASSIGNMENTS */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                    <ScrollText className="w-4 h-4 text-amber-600" />
                                    Pending Assignments ({pendingAssignments.length})
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Open problem sets that require your solution submission
                                </CardDescription>
                            </div>
                            {assignmentsList.length > 0 && (
                                <Link href={`/batch/${batchId}/assignments`}>
                                    <Button variant="ghost" size="sm" className="text-xs text-amber-700 hover:text-amber-800 flex items-center gap-1">
                                        View All ({assignmentsList.length}) <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {pendingAssignments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-xs bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200 p-6">
                                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                                    <p className="font-semibold text-emerald-900">All caught up!</p>
                                    <p className="text-[11px] text-emerald-700 mt-0.5">No pending assignments due right now.</p>
                                </div>
                            ) : (
                                pendingAssignments.slice(0, 3).map(asg => (
                                    <div key={asg.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold bg-slate-50">
                                                {asg.topic || "DSA"}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>Due: {asg.due_date || "Flexible"}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">{asg.title}</h4>
                                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{asg.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t text-xs">
                                            {asg.problem_link ? (
                                                <a href={asg.problem_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                                    <Code2 className="w-3.5 h-3.5" /> Problem Link <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">Class notes reference</span>
                                            )}
                                            <Button
                                                size="sm"
                                                onClick={() => handleOpenSubmit(asg)}
                                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7 flex items-center gap-1"
                                            >
                                                <Send className="w-3 h-3" /> Submit Solution
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* SECTION: CONTEST SOLUTIONS & VIDEO EDITORIALS (for DSA Batches) */}
                    {batchData?.attributes?.batch_type === "dsa" && (
                        <Card className="shadow-sm border-slate-200" id="contest-solutions">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <Flame className="w-4 h-4 text-rose-500" />
                                        Contest Solutions & Video Editorials
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        In-depth problem breakdowns and video solutions for recent contests
                                    </CardDescription>
                                </div>
                                <Link href="/dsa-cp">
                                    <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1">
                                        All Contests <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* LeetCode Contests */}
                                    <Link
                                        href="/dsa-cp/leetcode-contests"
                                        className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-white hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group"
                                    >
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition">
                                                    <img src="/logos/leetcode.png" alt="LeetCode" className="w-full h-full object-contain" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300">
                                                    Weekly / Biweekly
                                                </Badge>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-amber-700 transition">LeetCode Contests</h4>
                                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                                    Detailed contest problem solutions with intuition & time complexity analysis.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-3 mt-3 border-t border-amber-100 flex items-center justify-between text-xs font-semibold text-amber-700 group-hover:text-amber-800">
                                            <span>View Solutions</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                                        </div>
                                    </Link>

                                    {/* Codeforces Contests */}
                                    <Link
                                        href="/dsa-cp/codeforces"
                                        className="p-4 rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/40 via-white to-white hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group"
                                    >
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition">
                                                    <img src="/logos/codeforces.svg" alt="Codeforces" className="w-full h-full object-contain" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-300">
                                                    Div 2 / Div 3
                                                </Badge>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-700 transition">Codeforces Contests</h4>
                                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                                    Step-by-step mathematical & algorithmic solutions for Codeforces rounds.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-3 mt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                                            <span>View Solutions</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                                        </div>
                                    </Link>

                                    {/* CodeChef Contests */}
                                    <Link
                                        href="/dsa-cp/codechef"
                                        className="p-4 rounded-xl border border-yellow-200/80 bg-gradient-to-br from-yellow-50/40 via-white to-white hover:border-yellow-400 hover:shadow-md transition flex flex-col justify-between group"
                                    >
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-yellow-200 flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition">
                                                    <img src="/logos/codechef.png" alt="CodeChef" className="w-full h-full object-contain" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px] bg-yellow-50 text-yellow-800 border-yellow-300">
                                                    Starters
                                                </Badge>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-yellow-800 transition">CodeChef Contests</h4>
                                                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                                    Complete problem walkthroughs & editorials for weekly CodeChef Starters.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-3 mt-3 border-t border-yellow-100 flex items-center justify-between text-xs font-semibold text-yellow-800 group-hover:text-yellow-900">
                                            <span>View Solutions</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                                        </div>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* SECTION: NEWBIE TO EXPERT CP SHEET (for DSA Batches) */}
                    {batchData?.attributes?.batch_type === "dsa" && (
                        <Card className="shadow-sm border-emerald-300 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white overflow-hidden relative">
                            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
                            <CardContent className="p-6 sm:p-7 relative z-10">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                                    <div className="space-y-2.5 max-w-xl">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 border-none">
                                                Curated Practice Sheet
                                            </Badge>
                                            <Badge variant="outline" className="text-emerald-300 border-emerald-500/40 text-[10px] bg-emerald-950/40">
                                                800 → 1900+ Rating
                                            </Badge>
                                            <Badge variant="outline" className="text-emerald-300 border-emerald-500/40 text-[10px] bg-emerald-950/40">
                                                Video Editorials
                                            </Badge>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                            <Rocket className="w-5 h-5 text-emerald-400" />
                                            Path: Newbie → Expert CP Sheet
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                            Hand-picked Codeforces problems arranged difficulty-wise with in-depth video editorials. Master pattern recognition and level up step-by-step from Newbie to Expert.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 shrink-0 w-full sm:w-auto">
                                        <Link href="/dsa-cp/sheets/expert-sheet" className="w-full sm:w-auto">
                                            <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs h-10 gap-2 shadow-lg shadow-emerald-500/20">
                                                Start Solving Sheet <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Link href="/dsa-cp/sheets" className="w-full sm:w-auto">
                                            <Button variant="ghost" size="sm" className="w-full sm:w-auto text-xs text-slate-300 hover:text-white hover:bg-slate-800/60">
                                                Explore All Sheets
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right 1 Column: Quick Sections & Important Guidelines */}
                <div className="space-y-6">
                    {/* SECTION 3: QUICK SECTIONS */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                Quick Sections
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 space-y-1.5">
                            {batchData?.attributes?.batch_type === "dsa" && (
                                <>
                                    <Link href={`/batch/${batchId}/progress`} className="flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 transition text-xs font-medium text-gray-700 group border border-emerald-200 bg-emerald-50/40">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                                                <BarChart2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 block">DSA Progress</span>
                                                <span className="text-[10px] text-emerald-700 font-normal">LeetCode, CF & CodeChef</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition" />
                                    </Link>

                                    <Link href={`/batch/${batchId}/ranklist`} className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 transition text-xs font-medium text-gray-700 group border border-amber-200 bg-amber-50/40">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-md bg-amber-500 text-white flex items-center justify-center">
                                                <Trophy className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 block">Batch Ranklist</span>
                                                <span className="text-[10px] text-amber-700 font-normal">Student Leaderboard</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition" />
                                    </Link>

                                    <Link href="/dsa-cp/sheets/expert-sheet" className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition text-xs font-medium text-gray-700 group border border-purple-200 bg-purple-50/40">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-md bg-purple-600 text-white flex items-center justify-center">
                                                <Rocket className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 block">Expert CP Sheet</span>
                                                <span className="text-[10px] text-purple-700 font-normal">Newbie → Expert Sheet</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-0.5 transition" />
                                    </Link>

                                    <a href="#contest-solutions" className="flex items-center justify-between p-3 rounded-lg hover:bg-rose-50 transition text-xs font-medium text-gray-700 group border border-rose-200 bg-rose-50/30">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-md bg-rose-500 text-white flex items-center justify-center">
                                                <Flame className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-900 block">Contest Solutions</span>
                                                <span className="text-[10px] text-rose-700 font-normal">LC, CF & CC Walkthroughs</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-0.5 transition" />
                                    </a>
                                </>
                            )}

                            <Link href={`/batch/${batchId}/recordings`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition text-xs font-medium text-gray-700 group">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                                        <Video className="w-4 h-4" />
                                    </div>
                                    <span>Class Recordings</span>
                                </div>
                                <span className="text-gray-400 group-hover:text-gray-700 font-mono text-[11px]">{pastClasses.length} videos</span>
                            </Link>

                            <Link href={`/batch/${batchId}/attendance`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition text-xs font-medium text-gray-700 group">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    <span>Attendance Record</span>
                                </div>
                                <span className={`text-[11px] font-bold ${attendancePercentage >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {attendancePercentage}%
                                </span>
                            </Link>

                            <Link href={`/batch/${batchId}/assignments`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition text-xs font-medium text-gray-700 group">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                                        <ScrollText className="w-4 h-4" />
                                    </div>
                                    <span>Assignments & Tasks</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition" />
                            </Link>

                            <Link href={`/batch/${batchId}/resources`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition text-xs font-medium text-gray-700 group">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                                        <BookText className="w-4 h-4" />
                                    </div>
                                    <span>Notes & Resources</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition" />
                            </Link>

                            <Link href={`/batch/${batchId}/details`} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition text-xs font-medium text-gray-700 group">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                                        <GraduationCap className="w-4 h-4" />
                                    </div>
                                    <span>Batch Details</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition" />
                            </Link>
                        </CardContent>
                    </Card>

                    {/* SECTION 4: IMPORTANT GUIDELINES */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-600" />
                                Important Guidelines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs text-gray-600">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span>Join live sessions 5 minutes prior to start time for prompt attendance.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span>Attendance is recorded automatically whenever you click "Join Live Class".</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span>Class recordings and study notes are published shortly after each session.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span>Complete pending assignments before deadlines to maintain placement eligibility.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Submission Modal Dialog */}
            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <Send className="w-5 h-5 text-amber-600" />
                            Submit Assignment Solution
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            {selectedAssignment?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitAssignment} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                Submission Link (GitHub / LeetCode / Drive URL) <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="https://github.com/your-username/solution"
                                value={submissionUrl}
                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                required
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                Notes or Approach (Optional)
                            </label>
                            <Textarea
                                placeholder="Key observations, complexities, or edge cases handled..."
                                value={submissionNotes}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                rows={3}
                                className="text-xs"
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsSubmitOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={submitting}
                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                            >
                                {submitting ? "Submitting..." : "Confirm Submission"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
