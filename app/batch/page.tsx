"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    GraduationCap,
    ArrowRight,
    Lock,
    Users,
    Calendar,
    Sparkles,
    BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import supabase from "@/supabase";

export default function BatchesIndexPage() {
    const router = useRouter();
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEnrolledBatches() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.replace("/login");
                    return;
                }

                const res = await fetch("/api/batches", {
                    headers: {
                        "Authorization": `Bearer ${session.access_token}`
                    }
                });

                const data = await res.json();
                if (res.ok && data.batches) {
                    const userBatches = data.batches;
                    setBatches(userBatches);
                    if (userBatches.length === 1) {
                        router.replace(`/batch/${userBatches[0].batch_id}`);
                        return;
                    }
                }
            } catch (err) {
                console.error("Error loading batches:", err);
            } finally {
                setLoading(false);
            }
        }

        loadEnrolledBatches();
    }, [router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="animate-ping">
                    <Logo />
                </div>
                <p className="text-sm font-medium text-gray-500">Loading your batches...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                    Your Enrolled Batches
                </h1>
                <p className="text-sm text-gray-500">
                    Select a batch to enter your dedicated classroom, view recordings, track attendance, and submit assignments.
                </p>
            </div>

            {batches.length === 0 ? (
                <div className="max-w-md mx-auto text-center py-12 px-6 bg-white rounded-2xl border border-dashed shadow-sm space-y-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-gray-900">No Enrolled Batches Found</h3>
                        <p className="text-xs text-gray-500">
                            You are not currently enrolled in any active batch. Explore our upcoming live batches or contact support.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Link href="/pro">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">
                                Explore Live Batches & Pro <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {batches.map(batch => (
                        <Card key={batch.batch_id} className="hover:shadow-lg transition border-slate-200 flex flex-col justify-between">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between gap-2">
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                        Batch: {batch.batch_id}
                                    </Badge>
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                                        Enrolled
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900 mt-2">
                                    {batch.batch_name}
                                </CardTitle>
                                {batch.description && (
                                    <CardDescription className="text-xs text-gray-600 line-clamp-2">
                                        {batch.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="pt-0 space-y-4">
                                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                                    <span>{Array.isArray(batch.class_ids) ? batch.class_ids.length : 0} Lectures Scheduled</span>
                                    <Link href={`/batch/${batch.batch_id}`}>
                                        <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs flex items-center gap-1">
                                            Enter Classroom <ArrowRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
