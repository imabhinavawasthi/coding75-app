"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Users,
    Video,
    ExternalLink,
    Edit3,
    Trash2,
    Calendar,
    Search,
    RotateCw,
    GraduationCap,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import supabase from "@/supabase";

export default function AdminBatchesPage() {
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function loadBatches() {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch("/api/batches?all=true", {
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            const data = await res.json();
            if (res.ok) {
                setBatches(data.batches || []);
            } else {
                toast.error(data.error || "Failed to load batches");
            }
        } catch (err) {
            console.error("Error loading batches:", err);
            toast.error("Failed to load batches");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBatches();
    }, []);

    async function handleDeleteBatch(batchId: string, batchName: string) {
        if (!confirm(`Are you sure you want to delete batch "${batchName}" (${batchId})?`)) {
            return;
        }

        setDeletingId(batchId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`/api/batches/${batchId}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Batch deleted successfully");
                setBatches(prev => prev.filter(b => b.batch_id !== batchId));
            } else {
                toast.error(data.error || "Failed to delete batch");
            }
        } catch (err) {
            console.error("Error deleting batch:", err);
            toast.error("Failed to delete batch");
        } finally {
            setDeletingId(null);
        }
    }

    const filteredBatches = batches.filter(b => {
        const query = searchQuery.toLowerCase();
        return (
            b.batch_name?.toLowerCase().includes(query) ||
            b.batch_id?.toLowerCase().includes(query) ||
            b.description?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
                        <GraduationCap className="w-8 h-8 text-blue-600" />
                        Batch Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create, manage student enrollments, and link live classes to course batches
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={loadBatches} disabled={loading}>
                        <RotateCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Link href="/admin/batches/create">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
                            <Plus className="w-4 h-4" />
                            Create New Batch
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filter Search */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search batches by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 text-sm"
                    />
                </div>
                <span className="text-xs text-gray-500">
                    Showing {filteredBatches.length} of {batches.length} batches
                </span>
            </div>

            {/* Batches Table / Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <RotateCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    <p className="text-sm">Loading batches...</p>
                </div>
            ) : filteredBatches.length === 0 ? (
                <Card className="text-center py-16 border-dashed">
                    <CardContent className="space-y-3">
                        <GraduationCap className="w-12 h-12 mx-auto text-gray-300" />
                        <h3 className="text-lg font-bold text-gray-800">No Batches Found</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            {searchQuery ? "No batches matched your search query." : "You haven't created any batches yet. Get started by creating one!"}
                        </p>
                        {!searchQuery && (
                            <Link href="/admin/batches/create">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-2">
                                    <Plus className="w-4 h-4 mr-1.5" /> Create First Batch
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredBatches.map((batch) => {
                        const enrolledCount = Array.isArray(batch.enrolled_students) ? batch.enrolled_students.length : 0;
                        const classCount = Array.isArray(batch.class_ids) ? batch.class_ids.length : 0;
                        const createdDate = batch.created_at ? new Date(batch.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }) : "";

                        return (
                            <Card key={batch.id || batch.batch_id} className="flex flex-col justify-between hover:shadow-lg transition-all duration-200 border-gray-200">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <Badge variant="outline" className="font-mono text-xs text-blue-700 bg-blue-50 border-blue-200">
                                            {batch.batch_id}
                                        </Badge>
                                        {batch.attributes?.status && (
                                            <Badge className="text-[11px] capitalize bg-emerald-100 text-emerald-800 border-emerald-200">
                                                {batch.attributes.status}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-lg font-bold text-gray-900 mt-2 line-clamp-1">
                                        {batch.batch_name}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-gray-500 line-clamp-2 mt-1">
                                        {batch.description || "No description provided."}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4 pt-0">
                                    <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-gray-50 rounded-lg text-xs">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">Students</span>
                                                <span className="font-bold text-gray-800">{enrolledCount} enrolled</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Video className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">Classes</span>
                                                <span className="font-bold text-gray-800">{classCount} scheduled</span>
                                            </div>
                                        </div>
                                    </div>

                                    {createdDate && (
                                        <div className="text-[11px] text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Created on {createdDate}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-2 pt-2 border-t">
                                        <Link href={`/batch/${batch.batch_id}`} target="_blank" className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full text-xs flex items-center justify-center gap-1 text-gray-700">
                                                <ExternalLink className="w-3 h-3" /> View Portal
                                            </Button>
                                        </Link>

                                        <Link href={`/admin/batches/${batch.batch_id}`}>
                                            <Button variant="outline" size="sm" className="text-xs text-blue-600 hover:bg-blue-50 border-blue-200">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteBatch(batch.batch_id, batch.batch_name)}
                                            disabled={deletingId === batch.batch_id}
                                            className="text-xs text-red-600 hover:bg-red-50 border-red-200"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
