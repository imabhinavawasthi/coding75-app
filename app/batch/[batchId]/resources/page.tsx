"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BookText,
    Search,
    FileText,
    ExternalLink,
    Download,
    BookOpen,
    Code,
    Layers,
    Sparkles,
    FolderGit2,
    Bookmark
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BatchLoadingState } from "../../_components/batch-loading-state";
import { BatchUnauthorizedCard } from "../../_components/batch-unauthorized-card";
import { useBatchData } from "../../_components/use-batch-data";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";

export default function BatchResourcesPage() {
    const { batchId, batchData, classes, user, status, errorMessage } = useBatchData();
    const [searchQuery, setSearchQuery] = useState("");

    if (status === "loading") {
        return <BatchLoadingState message="Loading notes & resources..." />;
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
    const notesData = attributes.notes || {};

    // Transform batch-level notes from attributes.notes into list
    const batchNotesList: { id: string; title: string; url: string | null; content: string | null; isUrl: boolean }[] = [];

    if (notesData && typeof notesData === "object" && !Array.isArray(notesData)) {
        Object.entries(notesData).forEach(([title, val], idx) => {
            const strVal = typeof val === "string" ? val.trim() : JSON.stringify(val);
            const isUrl = /^https?:\/\//i.test(strVal);
            batchNotesList.push({
                id: `note-${idx}`,
                title,
                url: isUrl ? strVal : null,
                content: !isUrl ? strVal : null,
                isUrl
            });
        });
    }

    // Include syllabus roadmap if present and not already in notes
    if (attributes?.syllabus_url && !notesData["syllabus"] && !notesData["roadmap"]) {
        batchNotesList.unshift({
            id: "note-syllabus",
            title: "Master Syllabus & Roadmap",
            url: attributes.syllabus_url,
            content: null,
            isUrl: true
        });
    }

    const filteredResources = batchNotesList.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.url && note.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
                        <span className="text-xs text-gray-500">Resources</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <BookText className="w-6 h-6 text-blue-600" />
                        Notes & Study Resources
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Access official batch study materials, GitHub repositories, and curated learning links for {batchData?.batch_name}.
                    </p>
                </div>
            </div>

            {/* Search & Filter Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search batch notes, repositories, and learning resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 text-xs sm:text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs py-1.5 px-3 bg-blue-50 text-blue-700 border-blue-200">
                        {filteredResources.length} Resources Available
                    </Badge>
                </div>
            </div>

            {/* Resource Cards Grid */}
            {filteredResources.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-dashed p-8 space-y-2">
                    <BookText className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="font-semibold text-gray-800 text-base">No batch notes or resources found</p>
                    <p className="text-xs text-gray-400 max-w-md mx-auto">
                        {batchNotesList.length === 0
                            ? "Your mentors have not published overall batch notes yet. They will appear here once added."
                            : "No resources match your search criteria."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((res) => (
                        <Card key={res.id} className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between gap-2">
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold bg-slate-50 text-slate-700">
                                        Batch Resource
                                    </Badge>
                                </div>
                                <CardTitle className="text-sm font-bold text-gray-900 mt-2 line-clamp-2 capitalize">
                                    {res.title}
                                </CardTitle>
                                {res.content && (
                                    <CardDescription className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                                        {res.content}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="pt-0 border-t mt-2">
                                <div className="pt-3">
                                    {res.url ? (
                                        <a href={res.url} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button size="sm" variant="outline" className="w-full text-xs flex items-center justify-center gap-1.5 h-8 text-blue-600 border-blue-200 hover:bg-blue-50 font-medium">
                                                <ExternalLink className="w-3.5 h-3.5" /> Open Resource
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button size="sm" variant="outline" disabled className="w-full text-xs h-8 opacity-60">
                                            Note Content
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
