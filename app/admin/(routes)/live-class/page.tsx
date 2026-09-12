"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Video,
    Calendar,
    Clock,
    User,
    Radio,
    Star,
    ExternalLink,
    Edit3,
    Trash2,
    RotateCw,
    Search,
    Users,
    MessageSquare,
    BookOpen,
    CheckCircle,
    UserPlus,
    Check,
    Layers,
    History,
    PlaySquare,
    UserMinus,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { class_topics } from "@/components/constants";
import supabase from "@/supabase";
import { toast } from "sonner";

function istToEpochSeconds(timeStr: string) {
    const dateObj = new Date(timeStr);
    return Math.floor(dateObj.getTime() / 1000);
}

function epochToDatetimeLocal(epochSeconds: number) {
    if (!epochSeconds) return "";
    const d = new Date(epochSeconds * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminLiveClassesPage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("all");

    // Add Class Modal State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addMode, setAddMode] = useState<"upcoming" | "past">("upcoming");
    const [creating, setCreating] = useState(false);
    const [newClass, setNewClass] = useState({
        class_name: "",
        class_link: "",
        instructor_name: "",
        class_topic: "dsa",
        class_subtopics: "",
        class_time: "",
        class_duration: 60,
        class_recording: "",
        class_notes: "",
        batch_id: "none",
        attended_students_raw: ""
    });

    // Edit Class Modal State
    const [editingClass, setEditingClass] = useState<any | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    // View Details / Attendance / Ratings Modal State
    const [viewingClass, setViewingClass] = useState<any | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [manualEmail, setManualEmail] = useState("");
    const [bulkAttendanceText, setBulkAttendanceText] = useState("");
    const [showBulkAttendance, setShowBulkAttendance] = useState(false);

    // Rating Form State inside Details Modal
    const [showAddRatingForm, setShowAddRatingForm] = useState(false);
    const [ratingStudentEmail, setRatingStudentEmail] = useState("");
    const [ratingScores, setRatingScores] = useState({ content: 5, doubts: 5, engagement: 5, overall: 5 });
    const [ratingComment, setRatingComment] = useState("");
    const [submittingRating, setSubmittingRating] = useState(false);

    // Delete State
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function getAuthToken() {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || "";
    }

    async function loadData() {
        setLoading(true);
        try {
            const token = await getAuthToken();
            const headers = { ...(token ? { "Authorization": `Bearer ${token}` } : {}) };

            // Fetch live classes
            const resClasses = await fetch("/api/live-classes?limit=300", { headers });
            const dataClasses = await resClasses.json();
            if (resClasses.ok) {
                setClasses(dataClasses.classes || []);
            } else {
                toast.error(dataClasses.error || "Failed to load live classes");
            }

            // Fetch batches for assignment dropdown
            const resBatches = await fetch("/api/batches?all=true", { headers });
            const dataBatches = await resBatches.json();
            if (resBatches.ok) {
                setBatches(dataBatches.batches || []);
            }
        } catch (err) {
            console.error("Error loading data:", err);
            toast.error("Failed to load live classes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // Auto-refresh for active class monitor
    useEffect(() => {
        let interval: any = null;
        if (autoRefresh && isViewOpen && viewingClass) {
            interval = setInterval(async () => {
                const token = await getAuthToken();
                const identifier = viewingClass.id || viewingClass.class_url_slug;
                const res = await fetch(`/api/live-classes/${identifier}`, {
                    headers: { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
                });
                const data = await res.json();
                if (res.ok && data.class) {
                    setViewingClass(data.class);
                }
            }, 10000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, isViewOpen, viewingClass]);

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClass.class_name || !newClass.class_time) {
            toast.error("Class Name and Date/Time are required");
            return;
        }

        if (addMode === "upcoming" && !newClass.class_link) {
            toast.error("Meeting link is required for upcoming live classes");
            return;
        }

        setCreating(true);
        try {
            const token = await getAuthToken();
            const epoch = istToEpochSeconds(newClass.class_time);

            // Parse attended students for past classes
            const parsedAttended = Array.from(
                new Set(
                    newClass.attended_students_raw
                        .split(/[\n,;\s]+/)
                        .map(e => e.trim().toLowerCase())
                        .filter(e => e.includes("@") && e.includes("."))
                )
            );

            const payload = {
                class_name: newClass.class_name.trim(),
                class_link: newClass.class_link.trim() || "",
                instructor_name: newClass.instructor_name.trim(),
                class_topic: newClass.class_topic,
                class_subtopics: newClass.class_subtopics ? newClass.class_subtopics.split(",").map(s => s.trim()).filter(Boolean) : [],
                class_time_epoch: epoch,
                class_duration: Number(newClass.class_duration) || 60,
                class_recording: newClass.class_recording.trim(),
                class_notes: newClass.class_notes.trim(),
                batch_id: newClass.batch_id !== "none" ? newClass.batch_id : undefined,
                students_joined: parsedAttended,
                attendance: parsedAttended.map(email => ({
                    user_email: email,
                    joined_at: new Date(epoch * 1000).toISOString(),
                    manually_added: true
                }))
            };

            const res = await fetch("/api/live-classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to create class");
            } else {
                toast.success(
                    data.assigned_batches?.length
                        ? `Class created & assigned to batch! 🚀`
                        : (addMode === "past" ? "Past class added successfully! 📼" : "Class scheduled successfully! 🚀")
                );
                setIsAddOpen(false);
                setNewClass({
                    class_name: "",
                    class_link: "",
                    instructor_name: "",
                    class_topic: "dsa",
                    class_subtopics: "",
                    class_time: "",
                    class_duration: 60,
                    class_recording: "",
                    class_notes: "",
                    batch_id: "none",
                    attended_students_raw: ""
                });
                loadData();
            }
        } catch (err) {
            console.error("Error creating class:", err);
            toast.error("Failed to create class");
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClass) return;

        setUpdating(true);
        try {
            const token = await getAuthToken();
            const identifier = editingClass.id || editingClass.class_url_slug;

            const payload = {
                class_name: editingClass.class_name,
                class_link: editingClass.class_link || "",
                instructor_name: editingClass.instructor_name,
                class_topic: editingClass.class_topic,
                class_subtopics: Array.isArray(editingClass.class_subtopics) ? editingClass.class_subtopics : String(editingClass.class_subtopics || "").split(",").map(s => s.trim()).filter(Boolean),
                class_time_epoch: editingClass.class_time_epoch,
                class_duration: Number(editingClass.class_duration) || 60,
                class_recording: editingClass.class_recording || "",
                class_notes: editingClass.class_notes || ""
            };

            const res = await fetch(`/api/live-classes/${identifier}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to update class");
            } else {
                toast.success("Class updated successfully!");
                setIsEditOpen(false);
                setEditingClass(null);
                loadData();
            }
        } catch (err) {
            console.error("Error updating class:", err);
            toast.error("Failed to update class");
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteClass = async (classItem: any) => {
        if (!confirm(`Are you sure you want to delete class "${classItem.class_name}"?`)) {
            return;
        }

        const identifier = classItem.id || classItem.class_url_slug;
        setDeletingId(identifier);

        try {
            const token = await getAuthToken();
            const res = await fetch(`/api/live-classes/${identifier}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Class deleted successfully");
                setClasses(prev => prev.filter(c => (c.id || c.class_url_slug) !== identifier));
            } else {
                toast.error(data.error || "Failed to delete class");
            }
        } catch (err) {
            console.error("Error deleting class:", err);
            toast.error("Failed to delete class");
        } finally {
            setDeletingId(null);
        }
    };

    // Single Manual Attendance Add
    const handleAddManualAttendance = async () => {
        if (!manualEmail || !manualEmail.includes("@") || !viewingClass) {
            toast.error("Please enter a valid student email");
            return;
        }

        const email = manualEmail.trim().toLowerCase();
        const identifier = viewingClass.id || viewingClass.class_url_slug;

        try {
            const token = await getAuthToken();
            const currentAttendance = Array.isArray(viewingClass.attendance) ? [...viewingClass.attendance] : [];
            const currentJoined = Array.isArray(viewingClass.students_joined) ? [...viewingClass.students_joined] : [];

            if (!currentJoined.includes(email)) currentJoined.push(email);
            if (!currentAttendance.some((r: any) => (typeof r === "string" ? r : r?.user_email)?.toLowerCase() === email)) {
                currentAttendance.push({
                    user_email: email,
                    joined_at: new Date().toISOString(),
                    manually_added: true
                });
            }

            const res = await fetch(`/api/live-classes/${identifier}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    attendance: currentAttendance,
                    students_joined: currentJoined
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(`Attendance added for ${email}`);
                setViewingClass(data.class);
                setManualEmail("");
                loadData();
            } else {
                toast.error(data.error || "Failed to add attendance");
            }
        } catch (err) {
            console.error("Error adding manual attendance:", err);
            toast.error("Failed to add attendance");
        }
    };

    // Bulk Attendance Add
    const handleAddBulkAttendance = async () => {
        if (!bulkAttendanceText.trim() || !viewingClass) {
            toast.error("Please enter student emails");
            return;
        }

        const emails = Array.from(
            new Set(
                bulkAttendanceText
                    .split(/[\n,;\s]+/)
                    .map(e => e.trim().toLowerCase())
                    .filter(e => e.includes("@") && e.includes("."))
            )
        );

        if (emails.length === 0) {
            toast.error("No valid emails found");
            return;
        }

        const identifier = viewingClass.id || viewingClass.class_url_slug;

        try {
            const token = await getAuthToken();
            const currentAttendance = Array.isArray(viewingClass.attendance) ? [...viewingClass.attendance] : [];
            const currentJoined = Array.isArray(viewingClass.students_joined) ? [...viewingClass.students_joined] : [];

            emails.forEach(email => {
                if (!currentJoined.includes(email)) currentJoined.push(email);
                if (!currentAttendance.some((r: any) => (typeof r === "string" ? r : r?.user_email)?.toLowerCase() === email)) {
                    currentAttendance.push({
                        user_email: email,
                        joined_at: new Date().toISOString(),
                        manually_added: true
                    });
                }
            });

            const res = await fetch(`/api/live-classes/${identifier}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    attendance: currentAttendance,
                    students_joined: currentJoined
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(`Added ${emails.length} students to attendance!`);
                setViewingClass(data.class);
                setBulkAttendanceText("");
                setShowBulkAttendance(false);
                loadData();
            } else {
                toast.error(data.error || "Failed to add attendance");
            }
        } catch (err) {
            console.error("Error adding bulk attendance:", err);
            toast.error("Failed to add attendance");
        }
    };

    // Remove Student Attendance
    const handleRemoveAttendance = async (emailToRemove: string) => {
        if (!confirm(`Remove attendance for ${emailToRemove}?`) || !viewingClass) return;

        const identifier = viewingClass.id || viewingClass.class_url_slug;
        const emailLower = emailToRemove.toLowerCase();

        try {
            const token = await getAuthToken();
            const currentAttendance = (Array.isArray(viewingClass.attendance) ? viewingClass.attendance : []).filter(
                (r: any) => (typeof r === "string" ? r : r?.user_email)?.toLowerCase() !== emailLower
            );
            const currentJoined = (Array.isArray(viewingClass.students_joined) ? viewingClass.students_joined : []).filter(
                (e: string) => e.toLowerCase() !== emailLower
            );

            const res = await fetch(`/api/live-classes/${identifier}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    attendance: currentAttendance,
                    students_joined: currentJoined
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.info(`Attendance removed for ${emailToRemove}`);
                setViewingClass(data.class);
                loadData();
            } else {
                toast.error(data.error || "Failed to remove attendance");
            }
        } catch (err) {
            console.error("Error removing attendance:", err);
            toast.error("Failed to remove attendance");
        }
    };

    // Admin Submit / Edit Student Rating
    const handleSaveStudentRating = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ratingStudentEmail || !ratingStudentEmail.includes("@") || !viewingClass) {
            toast.error("Please provide a valid student email");
            return;
        }

        setSubmittingRating(true);
        const identifier = viewingClass.id || viewingClass.class_url_slug;

        try {
            const token = await getAuthToken();
            const res = await fetch(`/api/live-classes/${identifier}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    student_email: ratingStudentEmail.trim().toLowerCase(),
                    content: ratingScores.content,
                    doubts: ratingScores.doubts,
                    engagement: ratingScores.engagement,
                    overall: ratingScores.overall,
                    comment: ratingComment.trim()
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(`Rating saved for ${ratingStudentEmail} ⭐`);
                setViewingClass({
                    ...viewingClass,
                    ratings: data.ratings,
                    average_ratings: data.average_ratings
                });
                setRatingStudentEmail("");
                setRatingComment("");
                setShowAddRatingForm(false);
                loadData();
            } else {
                toast.error(data.error || "Failed to save rating");
            }
        } catch (err) {
            console.error("Error saving student rating:", err);
            toast.error("Failed to save rating");
        } finally {
            setSubmittingRating(false);
        }
    };

    // Admin Delete Student Rating
    const handleDeleteRating = async (studentEmail: string) => {
        if (!confirm(`Delete rating submitted for ${studentEmail}?`) || !viewingClass) return;

        const identifier = viewingClass.id || viewingClass.class_url_slug;

        try {
            const token = await getAuthToken();
            const res = await fetch(`/api/live-classes/${identifier}/rate?email=${encodeURIComponent(studentEmail)}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            const data = await res.json();
            if (res.ok) {
                toast.info(`Rating deleted for ${studentEmail}`);
                setViewingClass({
                    ...viewingClass,
                    ratings: data.ratings,
                    average_ratings: data.average_ratings
                });
                loadData();
            } else {
                toast.error(data.error || "Failed to delete rating");
            }
        } catch (err) {
            console.error("Error deleting rating:", err);
            toast.error("Failed to delete rating");
        }
    };

    const nowEpoch = Math.floor(Date.now() / 1000);

    const filteredClasses = classes.filter(c => {
        const matchesQuery = searchQuery === "" ||
            c.class_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.instructor_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTopic = selectedTopic === "all" || c.class_topic === selectedTopic;
        return matchesQuery && matchesTopic;
    });

    return (
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
                        <Video className="w-8 h-8 text-blue-600" />
                        Live Classes Hub
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Schedule live sessions, upload recordings of past classes, and track attendance & ratings
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                        <RotateCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    
                    {/* Add Past / Recorded Class Button */}
                    <Button
                        onClick={() => {
                            setAddMode("past");
                            setIsAddOpen(true);
                        }}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-1.5 text-xs font-semibold"
                    >
                        <History className="w-4 h-4 text-purple-600" />
                        + Add Past / Recorded Class
                    </Button>

                    {/* Schedule Live Class Button */}
                    <Button
                        onClick={() => {
                            setAddMode("upcoming");
                            setIsAddOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        Schedule Live Class
                    </Button>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search class name or instructor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 text-xs sm:text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger className="w-48 text-xs">
                            <SelectValue placeholder="Filter Topic" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Topics</SelectItem>
                            {Object.entries(class_topics).map(([key, val]) => (
                                <SelectItem key={key} value={key}>{val as string}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Class Cards List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <RotateCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    <p className="text-sm">Loading live classes...</p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <Card className="text-center py-16 border-dashed">
                    <CardContent className="space-y-3">
                        <Video className="w-12 h-12 mx-auto text-gray-300" />
                        <h3 className="text-lg font-bold text-gray-800">No Live Classes Found</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            {searchQuery ? "No classes match your search query." : "No live classes scheduled yet. Create or add one to get started!"}
                        </p>
                        {!searchQuery && (
                            <div className="flex items-center justify-center gap-2 pt-2">
                                <Button onClick={() => { setAddMode("upcoming"); setIsAddOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Plus className="w-4 h-4 mr-1.5" /> Schedule Class
                                </Button>
                                <Button onClick={() => { setAddMode("past"); setIsAddOpen(true); }} variant="outline">
                                    <History className="w-4 h-4 mr-1.5" /> Add Past Class
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredClasses.map((c) => {
                        const identifier = c.id || c.class_url_slug;
                        const epoch = Number(c.class_time_epoch || 0);
                        const duration = (Number(c.class_duration) || 60) * 60;
                        const isLive = nowEpoch >= epoch && nowEpoch <= (epoch + duration);
                        const isUpcoming = nowEpoch < epoch;
                        const isPast = nowEpoch > (epoch + duration);

                        const dateStr = epoch ? new Date(epoch * 1000).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true
                        }) : "TBA";

                        const studentsJoinedCount = Array.isArray(c.students_joined) ? c.students_joined.length : 0;
                        const attendanceCount = Array.isArray(c.attendance) ? c.attendance.length : 0;
                        const avg = c.average_ratings || {};
                        const overallRating = avg.overall || avg.content || 0;

                        return (
                            <Card key={identifier} className={`hover:shadow-md transition-all border ${
                                isLive ? "border-red-400 bg-red-50/20" : "border-gray-200"
                            }`}>
                                <CardContent className="p-4 sm:p-5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {isLive && (
                                                    <Badge variant="destructive" className="animate-pulse flex items-center gap-1.5 px-2.5 py-0.5 font-bold">
                                                        <Radio className="w-3 h-3 animate-ping" /> LIVE NOW
                                                    </Badge>
                                                )}
                                                {isUpcoming && (
                                                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                                                        Upcoming
                                                    </Badge>
                                                )}
                                                {isPast && (
                                                    <Badge variant="outline" className="bg-gray-100 text-gray-700">
                                                        Completed
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 uppercase text-[10px]">
                                                    {c.class_topic || "DSA"}
                                                </Badge>
                                            </div>

                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                                                {c.class_name}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {dateStr}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    {c.class_duration || 60} mins
                                                </span>
                                                {c.instructor_name && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                                        {c.instructor_name}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Attendance & Rating Pill summary */}
                                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                                    <Users className="w-3 h-3 text-emerald-600" />
                                                    {studentsJoinedCount} Joined • {attendanceCount} Attended
                                                </span>

                                                {overallRating > 0 && (
                                                    <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                        {overallRating.toFixed(1)} / 5 ({avg.total_reviews || 0} reviews)
                                                    </span>
                                                )}

                                                {c.class_recording && (
                                                    <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                                        <PlaySquare className="w-3 h-3 text-purple-600" /> Recording Attached
                                                    </span>
                                                )}

                                                {c.class_notes && (
                                                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                                        <BookOpen className="w-3 h-3 text-blue-600" /> Notes Attached
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap md:flex-col items-stretch md:items-end gap-2 pt-2 md:pt-0">
                                            <Button
                                                onClick={() => {
                                                    setViewingClass(c);
                                                    setIsViewOpen(true);
                                                    setShowAddRatingForm(false);
                                                    setShowBulkAttendance(false);
                                                }}
                                                size="sm"
                                                className="bg-slate-900 hover:bg-slate-800 text-white text-xs flex items-center gap-1"
                                            >
                                                <Users className="w-3.5 h-3.5" /> Manage Attendance & Ratings
                                            </Button>

                                            <div className="flex items-center gap-1.5">
                                                {c.class_link && (
                                                    <a href={c.class_link} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="sm" className="text-xs text-blue-600 hover:bg-blue-50">
                                                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Meeting
                                                        </Button>
                                                    </a>
                                                )}

                                                {c.class_recording && (
                                                    <a href={c.class_recording} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="sm" className="text-xs text-purple-600 hover:bg-purple-50">
                                                            <PlaySquare className="w-3.5 h-3.5 mr-1" /> Recording
                                                        </Button>
                                                    </a>
                                                )}

                                                <Button
                                                    onClick={() => {
                                                        setEditingClass({
                                                            ...c,
                                                            class_time_formatted: epochToDatetimeLocal(c.class_time_epoch),
                                                            class_subtopics: Array.isArray(c.class_subtopics) ? c.class_subtopics.join(", ") : c.class_subtopics
                                                        });
                                                        setIsEditOpen(true);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </Button>

                                                <Button
                                                    onClick={() => handleDeleteClass(c)}
                                                    disabled={deletingId === identifier}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs text-red-600 hover:bg-red-50 border-red-200"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* MODAL 1: Schedule Live Class / Add Past Class */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {addMode === "past" ? (
                                <>
                                    <History className="w-5 h-5 text-purple-600" />
                                    Add Past / Recorded Class
                                </>
                            ) : (
                                <>
                                    <Video className="w-5 h-5 text-blue-600" />
                                    Schedule Upcoming Live Class
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            {addMode === "past"
                                ? "Register a class that already took place, attach recording links, and log initial student attendance"
                                : "Schedule a future live class with meeting link and optionally link it to a batch"}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Mode Switcher Tabs inside Dialog */}
                    <Tabs value={addMode} onValueChange={(v) => setAddMode(v as any)} className="w-full">
                        <TabsList className="grid grid-cols-2 bg-gray-100 p-1 mb-3">
                            <TabsTrigger value="upcoming" className="text-xs flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-blue-600" />
                                Upcoming Live Class
                            </TabsTrigger>
                            <TabsTrigger value="past" className="text-xs flex items-center gap-1.5">
                                <History className="w-3.5 h-3.5 text-purple-600" />
                                Past / Recorded Class
                            </TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleCreateClass} className="space-y-4 py-1">
                            <div className="space-y-1.5">
                                <Label htmlFor="className">Class Name *</Label>
                                <Input
                                    id="className"
                                    placeholder={addMode === "past" ? "e.g. Dynamic Programming: 0/1 Knapsack & Subset Sum" : "e.g. Graph Traversal: BFS & DFS Masterclass"}
                                    value={newClass.class_name}
                                    onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Meeting Link - Required for upcoming, optional for past */}
                            {addMode === "upcoming" ? (
                                <div className="space-y-1.5">
                                    <Label htmlFor="classLink">Meeting Link (Zoom / Google Meet) *</Label>
                                    <Input
                                        id="classLink"
                                        placeholder="https://meet.google.com/..."
                                        value={newClass.class_link}
                                        onChange={(e) => setNewClass({ ...newClass, class_link: e.target.value })}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="recording" className="font-semibold text-purple-700 flex items-center gap-1">
                                            <PlaySquare className="w-3.5 h-3.5" /> Class Recording URL
                                        </Label>
                                        <Input
                                            id="recording"
                                            placeholder="https://youtube.com/... or Google Drive"
                                            value={newClass.class_recording}
                                            onChange={(e) => setNewClass({ ...newClass, class_recording: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="notes" className="font-semibold text-blue-700 flex items-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" /> Class Notes URL
                                        </Label>
                                        <Input
                                            id="notes"
                                            placeholder="https://drive.google.com/... or PDF"
                                            value={newClass.class_notes}
                                            onChange={(e) => setNewClass({ ...newClass, class_notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="classTopic">Topic</Label>
                                    <Select
                                        value={newClass.class_topic}
                                        onValueChange={(val) => setNewClass({ ...newClass, class_topic: val })}
                                    >
                                        <SelectTrigger id="classTopic">
                                            <SelectValue placeholder="Select topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(class_topics).map(([k, v]) => (
                                                <SelectItem key={k} value={k}>{v as string}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="instructor">Instructor Name</Label>
                                    <Input
                                        id="instructor"
                                        placeholder="e.g. Abhinav Awasthi"
                                        value={newClass.instructor_name}
                                        onChange={(e) => setNewClass({ ...newClass, instructor_name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="classTime">
                                        {addMode === "past" ? "Date & Time Class Took Place (IST) *" : "Scheduled Date & Time (IST) *"}
                                    </Label>
                                    <Input
                                        id="classTime"
                                        type="datetime-local"
                                        value={newClass.class_time}
                                        onChange={(e) => setNewClass({ ...newClass, class_time: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="duration">Duration (Minutes)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={newClass.class_duration}
                                        onChange={(e) => setNewClass({ ...newClass, class_duration: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="subtopics">Subtopics (Comma separated)</Label>
                                <Input
                                    id="subtopics"
                                    placeholder="e.g. BFS, DFS, Queue, Cycle Detection"
                                    value={newClass.class_subtopics}
                                    onChange={(e) => setNewClass({ ...newClass, class_subtopics: e.target.value })}
                                />
                            </div>

                            {/* Assign to Batch Dropdown */}
                            <div className="space-y-1.5 pt-2 border-t">
                                <Label htmlFor="batchAssign" className="flex items-center gap-1.5 text-blue-700 font-semibold">
                                    <Layers className="w-4 h-4" />
                                    Assign to Batch (Optional)
                                </Label>
                                <Select
                                    value={newClass.batch_id}
                                    onValueChange={(val) => setNewClass({ ...newClass, batch_id: val })}
                                >
                                    <SelectTrigger id="batchAssign">
                                        <SelectValue placeholder="Select batch to assign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Do not assign to batch --</SelectItem>
                                        {batches.map((b) => (
                                            <SelectItem key={b.batch_id} value={b.batch_id}>
                                                {b.batch_name} ({b.batch_id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-gray-500">
                                    This class will immediately appear on the student portal for the selected batch.
                                </p>
                            </div>

                            {/* For Past Class: Attended Students textarea */}
                            {addMode === "past" ? (
                                <div className="space-y-1.5 pt-2 border-t">
                                    <Label htmlFor="attendedStudents" className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                                        <Users className="w-3.5 h-3.5" />
                                        Initial Attended Students (Optional)
                                    </Label>
                                    <Textarea
                                        id="attendedStudents"
                                        placeholder={`Paste emails of students who attended (newline or comma separated):\nstudent1@gmail.com\nstudent2@gmail.com`}
                                        value={newClass.attended_students_raw}
                                        onChange={(e) => setNewClass({ ...newClass, attended_students_raw: e.target.value })}
                                        rows={3}
                                        className="font-mono text-xs"
                                    />
                                    <p className="text-[10px] text-gray-400">
                                        These students will be logged as attended in the database.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="notes">Class Notes URL (Optional)</Label>
                                        <Input
                                            id="notes"
                                            placeholder="https://drive.google.com/..."
                                            value={newClass.class_notes}
                                            onChange={(e) => setNewClass({ ...newClass, class_notes: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="recording">Recording URL (Optional)</Label>
                                        <Input
                                            id="recording"
                                            placeholder="https://youtube.com/... or Drive"
                                            value={newClass.class_recording}
                                            onChange={(e) => setNewClass({ ...newClass, class_recording: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <DialogFooter className="pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={creating}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={creating}
                                    className={addMode === "past" ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
                                >
                                    {creating ? <RotateCw className="w-4 h-4 mr-1.5 animate-spin" /> : null}
                                    {addMode === "past" ? "Save Past Class 📼" : "Schedule Class 🚀"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* MODAL 2: Edit Live Class */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-blue-600" />
                            Edit Live Class
                        </DialogTitle>
                    </DialogHeader>

                    {editingClass && (
                        <form onSubmit={handleUpdateClass} className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="editClassName">Class Name</Label>
                                <Input
                                    id="editClassName"
                                    value={editingClass.class_name}
                                    onChange={(e) => setEditingClass({ ...editingClass, class_name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="editClassLink">Meeting Link (Optional for past classes)</Label>
                                <Input
                                    id="editClassLink"
                                    value={editingClass.class_link || ""}
                                    onChange={(e) => setEditingClass({ ...editingClass, class_link: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="editTopic">Topic</Label>
                                    <Select
                                        value={editingClass.class_topic}
                                        onValueChange={(val) => setEditingClass({ ...editingClass, class_topic: val })}
                                    >
                                        <SelectTrigger id="editTopic">
                                            <SelectValue placeholder="Select topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(class_topics).map(([k, v]) => (
                                                <SelectItem key={k} value={k}>{v as string}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="editInstructor">Instructor Name</Label>
                                    <Input
                                        id="editInstructor"
                                        value={editingClass.instructor_name || ""}
                                        onChange={(e) => setEditingClass({ ...editingClass, instructor_name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="editTime">Date & Time (IST)</Label>
                                    <Input
                                        id="editTime"
                                        type="datetime-local"
                                        value={editingClass.class_time_formatted || ""}
                                        onChange={(e) => {
                                            const epoch = istToEpochSeconds(e.target.value);
                                            setEditingClass({
                                                ...editingClass,
                                                class_time_formatted: e.target.value,
                                                class_time_epoch: epoch
                                            });
                                        }}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="editDuration">Duration (Minutes)</Label>
                                    <Input
                                        id="editDuration"
                                        type="number"
                                        value={editingClass.class_duration || 60}
                                        onChange={(e) => setEditingClass({ ...editingClass, class_duration: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="editSubtopics">Subtopics (Comma separated)</Label>
                                <Input
                                    id="editSubtopics"
                                    value={editingClass.class_subtopics || ""}
                                    onChange={(e) => setEditingClass({ ...editingClass, class_subtopics: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                                <div className="space-y-1.5">
                                    <Label htmlFor="editNotes">Class Notes URL</Label>
                                    <Input
                                        id="editNotes"
                                        value={editingClass.class_notes || ""}
                                        onChange={(e) => setEditingClass({ ...editingClass, class_notes: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="editRecording">Class Recording URL</Label>
                                    <Input
                                        id="editRecording"
                                        value={editingClass.class_recording || ""}
                                        onChange={(e) => setEditingClass({ ...editingClass, class_recording: e.target.value })}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={updating}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={updating} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {updating ? <RotateCw className="w-4 h-4 mr-1.5 animate-spin" /> : null}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL 3: Comprehensive Realtime Attendance & Rating Manager */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Class Attendance & Ratings Hub
                            </DialogTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`text-xs ${autoRefresh ? "bg-emerald-50 text-emerald-700 border-emerald-300" : ""}`}
                            >
                                <RotateCw className={`w-3.5 h-3.5 mr-1 ${autoRefresh ? "animate-spin text-emerald-600" : ""}`} />
                                {autoRefresh ? "Live Sync: ON" : "Live Sync: OFF"}
                            </Button>
                        </div>
                        <DialogDescription className="text-xs">
                            {viewingClass?.class_name}
                        </DialogDescription>
                    </DialogHeader>

                    {viewingClass && (
                        <div className="space-y-5 py-2">
                            {/* Stats Summary Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                    <span className="text-emerald-700 block text-[10px] font-semibold uppercase">Joined Live</span>
                                    <span className="text-xl font-black text-emerald-900">
                                        {Array.isArray(viewingClass.students_joined) ? viewingClass.students_joined.length : 0}
                                    </span>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <span className="text-blue-700 block text-[10px] font-semibold uppercase">Attendance Logged</span>
                                    <span className="text-xl font-black text-blue-900">
                                        {Array.isArray(viewingClass.attendance) ? viewingClass.attendance.length : 0}
                                    </span>
                                </div>
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <span className="text-amber-700 block text-[10px] font-semibold uppercase">Overall Rating</span>
                                    <span className="text-xl font-black text-amber-900 flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        {viewingClass.average_ratings?.overall || 0} / 5
                                    </span>
                                </div>
                                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                    <span className="text-purple-700 block text-[10px] font-semibold uppercase">Total Reviews</span>
                                    <span className="text-xl font-black text-purple-900">
                                        {viewingClass.average_ratings?.total_reviews || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Tabs for Attendance vs Ratings */}
                            <Tabs defaultValue="attendance" className="w-full">
                                <TabsList className="bg-gray-100 p-1">
                                    <TabsTrigger value="attendance" className="text-xs">
                                        Attendance Records ({Array.isArray(viewingClass.attendance) ? viewingClass.attendance.length : 0})
                                    </TabsTrigger>
                                    <TabsTrigger value="ratings" className="text-xs">
                                        Student Ratings & Feedback ({viewingClass.average_ratings?.total_reviews || 0})
                                    </TabsTrigger>
                                </TabsList>

                                {/* TAB A: Attendance Management */}
                                <TabsContent value="attendance" className="space-y-4 pt-3">
                                    {/* Action Bar: Single Add & Bulk Add Toggle */}
                                    <div className="space-y-3">
                                        <div className="flex flex-col sm:flex-row items-center gap-2">
                                            <div className="flex-1 w-full">
                                                <Input
                                                    placeholder="Enter student email to mark present..."
                                                    value={manualEmail}
                                                    onChange={(e) => setManualEmail(e.target.value)}
                                                    className="text-xs h-8"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <Button
                                                    size="sm"
                                                    onClick={handleAddManualAttendance}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 flex items-center gap-1 flex-1 sm:flex-initial"
                                                >
                                                    <UserPlus className="w-3.5 h-3.5" /> Mark Present
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setShowBulkAttendance(!showBulkAttendance)}
                                                    className="text-xs h-8 flex items-center gap-1 flex-1 sm:flex-initial"
                                                >
                                                    {showBulkAttendance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    Bulk Add
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Bulk Attendance Expandable Form */}
                                        {showBulkAttendance && (
                                            <div className="p-3 bg-gray-50 border rounded-lg space-y-2">
                                                <Label htmlFor="bulkAtt" className="text-xs font-semibold text-gray-700">
                                                    Paste Multiple Student Emails (Comma or newline separated)
                                                </Label>
                                                <Textarea
                                                    id="bulkAtt"
                                                    placeholder="student1@gmail.com, student2@gmail.com"
                                                    value={bulkAttendanceText}
                                                    onChange={(e) => setBulkAttendanceText(e.target.value)}
                                                    rows={3}
                                                    className="font-mono text-xs bg-white"
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={handleAddBulkAttendance}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7"
                                                >
                                                    Add All to Attendance
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Attendance Records List */}
                                    {(!Array.isArray(viewingClass.attendance) || viewingClass.attendance.length === 0) ? (
                                        <div className="text-center py-8 text-xs text-gray-400">
                                            No attendance logged yet.
                                        </div>
                                    ) : (
                                        <div className="max-h-64 overflow-y-auto divide-y border rounded-lg">
                                            {viewingClass.attendance.map((record: any, idx: number) => {
                                                const email = typeof record === "string" ? record : record?.user_email;
                                                const timeStr = record?.joined_at ? new Date(record.joined_at).toLocaleString("en-IN", {
                                                    timeZone: "Asia/Kolkata",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    day: "numeric",
                                                    month: "short"
                                                }) : "";

                                                return (
                                                    <div key={idx} className="flex items-center justify-between p-2.5 text-xs hover:bg-gray-50">
                                                        <span className="font-mono text-gray-800">{email}</span>
                                                        <div className="flex items-center gap-3">
                                                            {record?.manually_added && (
                                                                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                                                                    Manual
                                                                </Badge>
                                                            )}
                                                            {timeStr && <span className="text-gray-400 text-[11px]">{timeStr}</span>}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveAttendance(email)}
                                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                title="Remove attendance"
                                                            >
                                                                <UserMinus className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </TabsContent>

                                {/* TAB B: Ratings & Feedback Management */}
                                <TabsContent value="ratings" className="space-y-4 pt-3">
                                    {/* Parameter Rating Averages Overview */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        <div className="p-2.5 bg-gray-50 border rounded text-center">
                                            <span className="text-gray-400 block text-[10px]">Content Quality</span>
                                            <span className="font-bold text-gray-800 flex items-center justify-center gap-1 mt-0.5">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                {viewingClass.average_ratings?.content || 0} / 5
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-gray-50 border rounded text-center">
                                            <span className="text-gray-400 block text-[10px]">Doubt Resolution</span>
                                            <span className="font-bold text-gray-800 flex items-center justify-center gap-1 mt-0.5">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                {viewingClass.average_ratings?.doubts || 0} / 5
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-gray-50 border rounded text-center">
                                            <span className="text-gray-400 block text-[10px]">Engagement & Pace</span>
                                            <span className="font-bold text-gray-800 flex items-center justify-center gap-1 mt-0.5">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                {viewingClass.average_ratings?.engagement || 0} / 5
                                            </span>
                                        </div>
                                        <div className="p-2.5 bg-gray-50 border rounded text-center">
                                            <span className="text-gray-400 block text-[10px]">Overall Satisfaction</span>
                                            <span className="font-bold text-amber-700 flex items-center justify-center gap-1 mt-0.5">
                                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                {viewingClass.average_ratings?.overall || 0} / 5
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action to Toggle "Add / Edit Student Rating Form" */}
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h4 className="text-xs font-bold text-gray-800">Student Reviews & Ratings</h4>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setShowAddRatingForm(!showAddRatingForm);
                                                    setRatingStudentEmail("");
                                                    setBulkAttendanceText("");
                                                }}
                                                className="text-xs h-7 flex items-center gap-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                                            >
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                {showAddRatingForm ? "Close Form" : "+ Add / Bulk Add Ratings"}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Add / Bulk Add Rating Form */}
                                    {showAddRatingForm && (
                                        <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-xs font-bold text-gray-900">Add Student Ratings</h5>
                                                <div className="flex items-center bg-white border rounded-lg p-0.5 text-xs">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRatingStudentEmail("")}
                                                        className={`px-2.5 py-0.5 rounded font-medium ${
                                                            ratingStudentEmail !== "__BULK__"
                                                                ? "bg-amber-100 text-amber-900"
                                                                : "text-gray-500 hover:text-gray-800"
                                                        }`}
                                                    >
                                                        Single Student
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setRatingStudentEmail("__BULK__")}
                                                        className={`px-2.5 py-0.5 rounded font-medium ${
                                                            ratingStudentEmail === "__BULK__"
                                                                ? "bg-amber-100 text-amber-900"
                                                                : "text-gray-500 hover:text-gray-800"
                                                        }`}
                                                    >
                                                        Bulk Students
                                                    </button>
                                                </div>
                                            </div>

                                            {ratingStudentEmail === "__BULK__" ? (
                                                <div className="space-y-1">
                                                    <Label htmlFor="bulkRatingEmails" className="text-xs">
                                                        Paste Student Emails (Comma or newline separated) *
                                                    </Label>
                                                    <Textarea
                                                        id="bulkRatingEmails"
                                                        placeholder={`student1@gmail.com\nstudent2@gmail.com, student3@gmail.com`}
                                                        value={bulkAttendanceText}
                                                        onChange={(e) => setBulkAttendanceText(e.target.value)}
                                                        rows={3}
                                                        className="font-mono text-xs bg-white"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <Label htmlFor="ratingStudentEmail" className="text-xs">Student Email *</Label>
                                                    <Input
                                                        id="ratingStudentEmail"
                                                        placeholder="student@gmail.com"
                                                        value={ratingStudentEmail}
                                                        onChange={(e) => setRatingStudentEmail(e.target.value)}
                                                        className="text-xs h-8 bg-white"
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-gray-600 block">Content (1-5)</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={5}
                                                        value={ratingScores.content}
                                                        onChange={(e) => setRatingScores({ ...ratingScores, content: Number(e.target.value) })}
                                                        className="text-xs h-8 bg-white"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-gray-600 block">Doubts (1-5)</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={5}
                                                        value={ratingScores.doubts}
                                                        onChange={(e) => setRatingScores({ ...ratingScores, doubts: Number(e.target.value) })}
                                                        className="text-xs h-8 bg-white"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-gray-600 block">Engagement (1-5)</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={5}
                                                        value={ratingScores.engagement}
                                                        onChange={(e) => setRatingScores({ ...ratingScores, engagement: Number(e.target.value) })}
                                                        className="text-xs h-8 bg-white"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-gray-600 block font-bold text-amber-800">Overall (1-5)</Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={5}
                                                        value={ratingScores.overall}
                                                        onChange={(e) => setRatingScores({ ...ratingScores, overall: Number(e.target.value) })}
                                                        className="text-xs h-8 bg-white font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor="ratingComment" className="text-xs">Feedback Comment (Optional)</Label>
                                                <Input
                                                    id="ratingComment"
                                                    placeholder="e.g. Explained binary lifting and tree DP very clearly!"
                                                    value={ratingComment}
                                                    onChange={(e) => setRatingComment(e.target.value)}
                                                    className="text-xs h-8 bg-white"
                                                />
                                            </div>

                                            <div className="flex justify-end gap-2 pt-1">
                                                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddRatingForm(false)} className="text-xs h-7">
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={async (e) => {
                                                        if (ratingStudentEmail === "__BULK__") {
                                                            const emails = Array.from(
                                                                new Set(
                                                                    bulkAttendanceText
                                                                        .split(/[\n,;\s]+/)
                                                                        .map(em => em.trim().toLowerCase())
                                                                        .filter(em => em.includes("@") && em.includes("."))
                                                                )
                                                            );

                                                            if (emails.length === 0) {
                                                                toast.error("Please enter at least one valid student email");
                                                                return;
                                                            }

                                                            setSubmittingRating(true);
                                                            const identifier = viewingClass.id || viewingClass.class_url_slug;

                                                            try {
                                                                const token = await getAuthToken();
                                                                const bulkPayload = emails.map(email => ({
                                                                    student_email: email,
                                                                    content: ratingScores.content,
                                                                    doubts: ratingScores.doubts,
                                                                    engagement: ratingScores.engagement,
                                                                    overall: ratingScores.overall,
                                                                    comment: ratingComment.trim()
                                                                }));

                                                                const res = await fetch(`/api/live-classes/${identifier}/rate`, {
                                                                    method: "POST",
                                                                    headers: {
                                                                        "Content-Type": "application/json",
                                                                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                                                                    },
                                                                    body: JSON.stringify({ bulk_ratings: bulkPayload })
                                                                });

                                                                const data = await res.json();
                                                                if (res.ok) {
                                                                    toast.success(`Bulk ratings saved for ${emails.length} students! ⭐`);
                                                                    setViewingClass({
                                                                        ...viewingClass,
                                                                        ratings: data.ratings,
                                                                        average_ratings: data.average_ratings
                                                                    });
                                                                    setBulkAttendanceText("");
                                                                    setRatingComment("");
                                                                    setShowAddRatingForm(false);
                                                                    loadData();
                                                                } else {
                                                                    toast.error(data.error || "Failed to save bulk ratings");
                                                                }
                                                            } catch (err) {
                                                                console.error("Error saving bulk ratings:", err);
                                                                toast.error("Failed to save bulk ratings");
                                                            } finally {
                                                                setSubmittingRating(false);
                                                            }
                                                        } else {
                                                            handleSaveStudentRating(e);
                                                        }
                                                    }}
                                                    size="sm"
                                                    disabled={submittingRating}
                                                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7"
                                                >
                                                    {submittingRating ? "Saving..." : ratingStudentEmail === "__BULK__" ? "Save Bulk Ratings" : "Save Rating"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Ratings List */}
                                    {(!viewingClass.ratings?.overall || viewingClass.ratings.overall.length === 0) ? (
                                        <div className="text-center py-8 text-xs text-gray-400">
                                            No student feedback submitted yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-72 overflow-y-auto">
                                            {viewingClass.ratings.overall.map((r: any, idx: number) => {
                                                const contentRating = viewingClass.ratings?.content?.find((c: any) => c?.user_email === r.user_email)?.rating;
                                                const doubtsRating = viewingClass.ratings?.doubts?.find((c: any) => c?.user_email === r.user_email)?.rating;
                                                const engagementRating = viewingClass.ratings?.engagement?.find((c: any) => c?.user_email === r.user_email)?.rating;

                                                return (
                                                    <div key={idx} className="p-3 border rounded-lg bg-gray-50 text-xs space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-gray-800">{r.user_email}</span>
                                                            <div className="flex items-center gap-2">
                                                                <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                                    Overall: {r.rating} / 5
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteRating(r.user_email)}
                                                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    title="Delete rating"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* 3 Parameter Breakdown */}
                                                        <div className="flex flex-wrap gap-2 text-[11px] text-gray-500">
                                                            {contentRating !== undefined && <span>Content: <strong>{contentRating}/5</strong></span>}
                                                            {doubtsRating !== undefined && <span>• Doubts: <strong>{doubtsRating}/5</strong></span>}
                                                            {engagementRating !== undefined && <span>• Engagement: <strong>{engagementRating}/5</strong></span>}
                                                        </div>

                                                        {r.comment && (
                                                            <p className="text-gray-600 italic text-[11px] bg-white p-2 rounded border">
                                                                &ldquo;{r.comment}&rdquo;
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}