"use client";

import {
    MessageSquare,
    ExternalLink,
    BookOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BatchHeaderProps {
    batchData: any;
    classes: any[];
    userEmail?: string;
    activeTab?: string;
}

export function BatchHeader({ batchData, classes = [], userEmail = "" }: BatchHeaderProps) {
    const batchId = batchData?.batch_id || "";
    const attributes = batchData?.attributes || {};

    const nowEpoch = Math.floor(Date.now() / 1000);
    const upcomingClasses = classes.filter(c => Number(c.class_time_epoch) > nowEpoch);
    const pastClasses = classes.filter(c => {
        const t = Number(c.class_time_epoch);
        const d = (Number(c.class_duration) || 60) * 60;
        return nowEpoch > (t + d);
    });
    const liveClasses = classes.filter(c => {
        const t = Number(c.class_time_epoch);
        const d = (Number(c.class_duration) || 60) * 60;
        return nowEpoch >= t && nowEpoch <= (t + d);
    });

    const attendedClassesCount = classes.filter(c => {
        const sj: string[] = Array.isArray(c.students_joined) ? c.students_joined : [];
        const att: any[] = Array.isArray(c.attendance) ? c.attendance : [];
        return sj.some(e => e?.toLowerCase() === userEmail.toLowerCase()) ||
            att.some(r => r?.user_email?.toLowerCase() === userEmail.toLowerCase());
    }).length;

    const totalPastCount = pastClasses.length + liveClasses.length;
    const attendancePercentage = totalPastCount > 0 ? Math.round((attendedClassesCount / totalPastCount) * 100) : 100;

    return (
        <div className="space-y-4">
            {/* Modern Classic Solid Batch Header */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-800 text-slate-200 border border-slate-700">
                                Batch Code: {batchId}
                            </span>
                            {attributes?.status && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 capitalize">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    {attributes.status}
                                </span>
                            )}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                Enrolled Student
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                            {batchData?.batch_name}
                        </h1>

                        {batchData?.description && (
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-2">
                                {batchData.description}
                            </p>
                        )}

                        {/* Batch quick links */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                            {attributes?.discord_link && (
                                <a href={attributes.discord_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 text-xs flex items-center gap-1.5 h-8 font-medium">
                                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Discord Community
                                    </Button>
                                </a>
                            )}
                            {attributes?.whatsapp_link && (
                                <a href={attributes.whatsapp_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 text-xs flex items-center gap-1.5 h-8 font-medium">
                                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Group
                                    </Button>
                                </a>
                            )}
                            {attributes?.syllabus_url && (
                                <a href={attributes.syllabus_url} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 text-xs flex items-center gap-1.5 h-8 font-medium">
                                        <BookOpen className="w-3.5 h-3.5 text-slate-300" /> Syllabus Roadmap
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Metric Cards - Modern Classic Solid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[280px]">
                        <div className="bg-slate-800/90 rounded-xl p-4 text-center border border-slate-700/80 shadow-sm">
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Total Classes</span>
                            <span className="text-2xl font-bold text-white tracking-tight">{classes.length}</span>
                        </div>
                        <div className="bg-slate-800/90 rounded-xl p-4 text-center border border-slate-700/80 shadow-sm">
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Your Attendance</span>
                            <span className={`text-2xl font-bold tracking-tight ${attendancePercentage >= 80 ? 'text-emerald-400' : attendancePercentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                {attendancePercentage}%
                            </span>
                        </div>
                        <div className="bg-slate-800/90 rounded-xl p-4 text-center border border-slate-700/80 shadow-sm">
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Attended</span>
                            <span className="text-2xl font-bold text-white tracking-tight">{attendedClassesCount}</span>
                        </div>
                        <div className="bg-slate-800/90 rounded-xl p-4 text-center border border-slate-700/80 shadow-sm">
                            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Upcoming</span>
                            <span className="text-2xl font-bold text-amber-400 tracking-tight">{upcomingClasses.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
