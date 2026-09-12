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
            {/* Top Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                Batch Code: {batchId}
                            </Badge>
                            {attributes?.status && (
                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 capitalize">
                                    {attributes.status}
                                </Badge>
                            )}
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                Enrolled Student
                            </Badge>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                            {batchData?.batch_name}
                        </h1>

                        {batchData?.description && (
                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-2">
                                {batchData.description}
                            </p>
                        )}

                        {/* Batch quick links from attributes */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            {attributes?.discord_link && (
                                <a href={attributes.discord_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="bg-indigo-600/30 hover:bg-indigo-600/50 text-white border-indigo-400/40 text-xs flex items-center gap-1.5 h-8">
                                        <MessageSquare className="w-3.5 h-3.5 text-indigo-300" /> Discord Community
                                    </Button>
                                </a>
                            )}
                            {attributes?.whatsapp_link && (
                                <a href={attributes.whatsapp_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="bg-emerald-600/30 hover:bg-emerald-600/50 text-white border-emerald-400/40 text-xs flex items-center gap-1.5 h-8">
                                        <ExternalLink className="w-3.5 h-3.5 text-emerald-300" /> WhatsApp Group
                                    </Button>
                                </a>
                            )}
                            {attributes?.syllabus_url && (
                                <a href={attributes.syllabus_url} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs flex items-center gap-1.5 h-8">
                                        <BookOpen className="w-3.5 h-3.5" /> Syllabus Roadmap
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[260px]">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                            <span className="text-[11px] text-slate-300 font-medium block">Total Classes</span>
                            <span className="text-2xl font-black text-white">{classes.length}</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                            <span className="text-[11px] text-slate-300 font-medium block">Your Attendance</span>
                            <span className={`text-2xl font-black ${attendancePercentage >= 80 ? 'text-emerald-400' : attendancePercentage >= 60 ? 'text-amber-300' : 'text-rose-400'}`}>
                                {attendancePercentage}%
                            </span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                            <span className="text-[11px] text-slate-300 font-medium block">Attended</span>
                            <span className="text-2xl font-black text-white">{attendedClassesCount}</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                            <span className="text-[11px] text-slate-300 font-medium block">Upcoming</span>
                            <span className="text-2xl font-black text-amber-300">{upcomingClasses.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
