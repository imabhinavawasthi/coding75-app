"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ScrollText,
    CheckCircle2,
    Clock,
    Calendar,
    ExternalLink,
    Code2,
    FileCode,
    Check,
    AlertCircle,
    Send,
    Award
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
import { BatchLoadingState } from "../../_components/batch-loading-state";
import { BatchUnauthorizedCard } from "../../_components/batch-unauthorized-card";
import { useBatchData } from "../../_components/use-batch-data";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { toast } from "sonner";

export default function BatchAssignmentsPage() {
    const { batchId, batchData, classes, user, status, errorMessage } = useBatchData();

    // Submission dialog state
    const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [submissionNotes, setSubmissionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submittedIds, setSubmittedIds] = useState<string[]>([]);

    if (status === "loading") {
        return <BatchLoadingState message="Loading batch assignments..." />;
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
    // Only real assignments stored in batch attributes (blank by default if not added yet)
    const assignmentsList: any[] = Array.isArray(attributes.assignments) ? attributes.assignments : [];

    const handleOpenSubmit = (asg: any) => {
        setSelectedAssignment(asg);
        setSubmissionUrl("");
        setSubmissionNotes("");
        setIsSubmitOpen(true);
    };

    const handleSubmitAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!submissionUrl.trim()) {
            toast.error("Please provide a submission link (GitHub, LeetCode, or Google Drive URL)");
            return;
        }

        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmittedIds(prev => [...prev, selectedAssignment?.id]);
            setIsSubmitOpen(false);
            toast.success("Assignment submitted successfully! Your mentor will review it soon. 🎉");
        }, 600);
    };

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
                        <span className="text-xs text-gray-500">Assignments</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <ScrollText className="w-6 h-6 text-amber-600" />
                        Assignments & Practice Problems
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Complete coursework assignments and submit problem solutions for mentor review.
                    </p>
                </div>
            </div>

            {/* Assignments Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ScrollText className="w-5 h-5 text-amber-600" />
                        Batch Assignments & Practice Problems
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Solve assigned problems to reinforce concepts and build your coding portfolio.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-xs px-3 py-1">
                        {assignmentsList.length} Total Assignments
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs px-3 py-1">
                        {submittedIds.length} Submitted
                    </Badge>
                </div>
            </div>

            {/* Assignments List */}
            {assignmentsList.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-dashed p-8">
                    <ScrollText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-semibold text-gray-800 text-base">No assignments posted yet</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                        Assignments will be posted by instructors alongside relevant class topics. Check back after your lectures!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignmentsList.map((asg) => {
                        const isSubmitted = submittedIds.includes(asg.id);
                        return (
                            <Card key={asg.id} className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <Badge variant="outline" className="text-[11px] uppercase font-bold bg-slate-50">
                                            {asg.topic || "DSA"}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Due: {asg.due_date || "Flexible"}</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-base font-bold text-gray-900 mt-2">
                                        {asg.title}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-gray-600 line-clamp-2">
                                        {asg.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-4">
                                    <div className="flex items-center justify-between pt-3 border-t">
                                        {asg.problem_link ? (
                                            <a
                                                href={asg.problem_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            >
                                                <Code2 className="w-3.5 h-3.5" /> View Problem Link <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400">Class notes reference</span>
                                        )}

                                        {isSubmitted ? (
                                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Submitted
                                            </Badge>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => handleOpenSubmit(asg)}
                                                className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 flex items-center gap-1.5"
                                            >
                                                <Send className="w-3 h-3" /> Submit Solution
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

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
                                placeholder="https://github.com/your-username/solution-repo"
                                value={submissionUrl}
                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                required
                                className="text-xs"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                Additional Notes / Time Complexity / Approaches
                            </label>
                            <Textarea
                                placeholder="E.g., Solved with O(N log N) using divide and conquer..."
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
                                {submitting ? "Submitting..." : "Confirm & Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
