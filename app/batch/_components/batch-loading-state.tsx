"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface BatchLoadingStateProps {
    message?: string;
    variant?: "dashboard" | "list" | "cards" | "table";
}

export function BatchLoadingState({
    message = "Loading batch details...",
    variant = "dashboard"
}: BatchLoadingStateProps) {
    if (variant === "list") {
        return (
            <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in-50 duration-300">
                {/* Header */}
                <div className="text-center max-w-xl mx-auto space-y-3">
                    <Skeleton className="h-9 w-64 mx-auto rounded-xl" />
                    <Skeleton className="h-4 w-96 max-w-full mx-auto rounded-md" />
                </div>

                {/* Batch Cards Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden border border-border/80 bg-card/60 shadow-sm rounded-2xl">
                            <div className="h-1.5 bg-muted" />
                            <CardContent className="p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                                    <Skeleton className="h-3.5 w-full rounded-md" />
                                    <Skeleton className="h-3.5 w-2/3 rounded-md" />
                                </div>
                                <div className="space-y-2 pt-2 border-t border-border/60">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-28 rounded" />
                                        <Skeleton className="h-4 w-16 rounded" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-24 rounded" />
                                        <Skeleton className="h-4 w-20 rounded" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-full rounded-xl" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {message && (
                    <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                        <span>{message}</span>
                    </div>
                )}
            </div>
        );
    }

    // Default: "dashboard" layout
    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in-50 duration-300">
            {/* 1. Batch Header Skeleton */}
            <Card className="overflow-hidden border border-border/80 bg-card/60 shadow-lg rounded-3xl">
                <div className="h-2 bg-gradient-to-r from-primary/30 via-indigo-500/30 to-purple-500/30" />
                <CardContent className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-28 rounded-full" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-8 sm:h-9 w-72 sm:w-96 rounded-xl" />
                            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                            <Skeleton className="h-10 w-32 rounded-xl" />
                            <Skeleton className="h-10 w-36 rounded-xl" />
                        </div>
                    </div>

                    {/* Stats & Progress row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/60">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5">
                                <Skeleton className="h-3.5 w-16 rounded" />
                                <Skeleton className="h-6 w-20 rounded-md" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* 2. Next Class Live Countdown Skeleton */}
            <Card className="relative overflow-hidden border border-border/80 bg-card/60 shadow-md rounded-2xl">
                <div className="h-1 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-primary/30" />
                <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-3 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-32 rounded-full" />
                                <Skeleton className="h-5 w-24 rounded-md" />
                            </div>
                            <Skeleton className="h-7 w-64 sm:w-80 rounded-lg" />
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Skeleton className="h-4 w-36 rounded-md" />
                                <Skeleton className="h-4 w-20 rounded-md" />
                                <Skeleton className="h-4 w-28 rounded-md" />
                            </div>
                            <div className="flex gap-2 pt-1">
                                <Skeleton className="h-5 w-16 rounded-md" />
                                <Skeleton className="h-5 w-20 rounded-md" />
                                <Skeleton className="h-5 w-24 rounded-md" />
                            </div>
                        </div>

                        {/* 4 Countdown Digits + Action button */}
                        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4].map((box) => (
                                    <Skeleton key={box} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl" />
                                ))}
                            </div>
                            <Skeleton className="h-10 w-36 rounded-xl" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Filter Tabs Skeleton */}
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
            </div>

            {/* 4. Batch Class Cards Skeletons */}
            <div className="space-y-4">
                {[1, 2, 3].map((card) => (
                    <Card key={card} className="overflow-hidden border border-border/80 bg-card/60 shadow-sm rounded-2xl">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-2.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                    <Skeleton className="h-6 w-3/4 sm:w-1/2 rounded-lg" />
                                    <div className="flex flex-wrap items-center gap-4 pt-1">
                                        <Skeleton className="h-4 w-32 rounded-md" />
                                        <Skeleton className="h-4 w-20 rounded-md" />
                                        <Skeleton className="h-4 w-24 rounded-md" />
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <Skeleton className="h-4 w-16 rounded-md" />
                                        <Skeleton className="h-4 w-20 rounded-md" />
                                    </div>
                                </div>
                                <div className="flex flex-wrap md:flex-col items-stretch md:items-end gap-2 shrink-0">
                                    <Skeleton className="h-9 w-28 rounded-xl" />
                                    <Skeleton className="h-9 w-24 rounded-xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {message && (
                <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" />
                    <span>{message}</span>
                </div>
            )}
        </div>
    );
}


