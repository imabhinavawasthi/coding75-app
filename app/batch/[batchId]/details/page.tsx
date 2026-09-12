"use client";

import Link from "next/link";
import {
    GraduationCap,
    Calendar,
    Users,
    MessageSquare,
    ExternalLink,
    BookOpen,
    Clock,
    Tag,
    Info,
    CheckCircle,
    Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BatchLoadingState } from "../../_components/batch-loading-state";
import { BatchUnauthorizedCard } from "../../_components/batch-unauthorized-card";
import { useBatchData } from "../../_components/use-batch-data";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";

export default function BatchDetailsPage() {
    const { batchId, batchData, classes, user, status, errorMessage } = useBatchData();

    if (status === "loading") {
        return <BatchLoadingState message="Loading batch details & metadata..." />;
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

    const attributes = batchData?.attributes || {};
    const enrolledStudents: string[] = Array.isArray(batchData?.enrolled_students) ? batchData.enrolled_students : [];

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
                        <span className="text-xs text-gray-500">Details</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                        Batch Details & Information
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Overview of batch metadata, syllabus schedule, mentor contacts, and community links.
                    </p>
                </div>
            </div>

            {/* Batch Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Metadata */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            Batch Identification & Overview
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Core identification parameters and enrollment configuration
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                        <div className="p-3.5 rounded-lg bg-gray-50 border space-y-1">
                            <span className="font-semibold text-gray-500 uppercase text-[10px]">Batch Name</span>
                            <p className="text-sm font-bold text-gray-900">{batchData?.batch_name}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-gray-50 border space-y-1">
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Batch ID / Slug</span>
                                <p className="font-mono font-bold text-gray-900 text-xs">{batchData?.batch_id}</p>
                            </div>

                            <div className="p-3 rounded-lg bg-gray-50 border space-y-1">
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Current Status</span>
                                <div>
                                    <Badge className="bg-emerald-500/15 text-emerald-800 border-emerald-300 capitalize text-[10px]">
                                        {attributes?.status || "Active Batch"}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {batchData?.description && (
                            <div className="p-3 rounded-lg bg-gray-50 border space-y-1">
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Batch Description</span>
                                <p className="text-gray-700 leading-relaxed">{batchData.description}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {attributes?.start_date && (
                                <div className="p-3 rounded-lg bg-gray-50 border space-y-1">
                                    <span className="font-semibold text-gray-500 uppercase text-[10px]">Start Date</span>
                                    <p className="font-medium text-gray-900">{attributes.start_date}</p>
                                </div>
                            )}
                            {attributes?.end_date && (
                                <div className="p-3 rounded-lg bg-gray-50 border space-y-1">
                                    <span className="font-semibold text-gray-500 uppercase text-[10px]">End Date</span>
                                    <p className="font-medium text-gray-900">{attributes.end_date}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Community & Syllabus Resources */}
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Official Channels & Curriculum
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Direct access to mentors, discussion groups, and syllabi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {attributes?.discord_link ? (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/60 border border-indigo-100">
                                <div className="flex items-center gap-2.5">
                                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                                    <div>
                                        <div className="font-bold text-xs text-gray-900">Discord Community</div>
                                        <div className="text-[11px] text-gray-500">24/7 doubt discussions & peer networking</div>
                                    </div>
                                </div>
                                <a href={attributes.discord_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7">
                                        Join Channel <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                </a>
                            </div>
                        ) : null}

                        {attributes?.whatsapp_link ? (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                                <div className="flex items-center gap-2.5">
                                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                                    <div>
                                        <div className="font-bold text-xs text-gray-900">WhatsApp Broadcast Group</div>
                                        <div className="text-[11px] text-gray-500">Class timing reminders & urgent alerts</div>
                                    </div>
                                </div>
                                <a href={attributes.whatsapp_link} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7">
                                        Join Group <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                </a>
                            </div>
                        ) : null}

                        {attributes?.syllabus_url ? (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                                <div className="flex items-center gap-2.5">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <div className="font-bold text-xs text-gray-900">Complete Syllabus & Roadmap</div>
                                        <div className="text-[11px] text-gray-500">Curriculum milestones & schedule</div>
                                    </div>
                                </div>
                                <a href={attributes.syllabus_url} target="_blank" rel="noopener noreferrer">
                                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs h-7">
                                        View Roadmap <ExternalLink className="w-3 h-3 ml-1" />
                                    </Button>
                                </a>
                            </div>
                        ) : null}

                        <div className="p-3 rounded-lg bg-slate-50 border space-y-1">
                            <span className="font-semibold text-gray-500 uppercase text-[10px]">Your Enrolled Email</span>
                            <p className="font-semibold text-gray-800 text-xs">{user?.email}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Custom Attributes Table (if additional keys exist) */}
            {Object.keys(attributes).length > 0 && (
                <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-purple-600" />
                            Batch Configuration & Custom Attributes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="divide-y divide-gray-100">
                            {Object.entries(attributes).map(([key, val]) => {
                                if (['assignments', 'resources', 'notes'].includes(key)) return null;
                                const isUrl = typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'));
                                return (
                                    <div key={key} className="flex items-center justify-between py-2.5 text-xs">
                                        <span className="font-medium text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                                        {isUrl ? (
                                            <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-semibold">
                                                Open Link <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-gray-900 font-semibold">{String(val)}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
