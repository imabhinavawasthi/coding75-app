"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    GraduationCap,
    Users,
    Video,
    Plus,
    Trash2,
    Check,
    RotateCw,
    Sparkles,
    Calendar,
    Star,
    ExternalLink,
    Search,
    UserMinus,
    BarChart3,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import supabase from "@/supabase";

export default function EditBatchPage() {
    const routeParams = useParams();
    const batchId = Array.isArray(routeParams?.batchId) ? routeParams.batchId[0] : (routeParams?.batchId as string) || "";

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form fields
    const [batchName, setBatchName] = useState("");
    const [newBatchId, setNewBatchId] = useState("");
    const [description, setDescription] = useState("");

    // Students
    const [enrolledStudents, setEnrolledStudents] = useState<string[]>([]);
    const [bulkEmailsToAdd, setBulkEmailsToAdd] = useState("");
    const [studentSearch, setStudentSearch] = useState("");

    // Classes
    const [linkedClasses, setLinkedClasses] = useState<any[]>([]);
    const [availableClasses, setAvailableClasses] = useState<any[]>([]);
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

    // Attributes
    const [discordLink, setDiscordLink] = useState("");
    const [whatsappLink, setWhatsappLink] = useState("");
    const [syllabusUrl, setSyllabusUrl] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("active");
    const [batchType, setBatchType] = useState("general");
    const [batchNotes, setBatchNotes] = useState<{ title: string; link: string }[]>([]);
    const [customAttrs, setCustomAttrs] = useState<{ key: string; value: string }[]>([]);

    async function loadBatchAndClasses() {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // Fetch batch details
            const batchRes = await fetch(`/api/batches/${batchId}`, {
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });

            const batchData = await batchRes.json();
            if (!batchRes.ok) {
                toast.error(batchData.error || "Failed to load batch");
                setLoading(false);
                return;
            }

            const b = batchData.batch;
            setBatchName(b.batch_name || "");
            setNewBatchId(b.batch_id || "");
            setDescription(b.description || "");
            setEnrolledStudents(Array.isArray(b.enrolled_students) ? b.enrolled_students : []);
            setSelectedClassIds(Array.isArray(b.class_ids) ? b.class_ids : []);
            setLinkedClasses(batchData.classes || []);

            const attrs = b.attributes || {};
            setDiscordLink(attrs.discord_link || "");
            setWhatsappLink(attrs.whatsapp_link || "");
            setSyllabusUrl(attrs.syllabus_url || "");
            setStartDate(attrs.start_date || "");
            setEndDate(attrs.end_date || "");
            setStatus(attrs.status || "active");
            setBatchType(attrs.batch_type || "general");

            // Load batch notes
            const notesObj = attrs.notes || {};
            if (notesObj && typeof notesObj === "object" && !Array.isArray(notesObj)) {
                const loadedNotes = Object.entries(notesObj).map(([k, v]) => ({
                    title: k,
                    link: typeof v === "string" ? v : JSON.stringify(v)
                }));
                setBatchNotes(loadedNotes);
            } else {
                setBatchNotes([]);
            }

            const customList: { key: string; value: string }[] = [];
            Object.entries(attrs).forEach(([k, v]) => {
                if (!['discord_link', 'whatsapp_link', 'syllabus_url', 'start_date', 'end_date', 'status', 'notes', 'batch_type'].includes(k)) {
                    customList.push({ key: k, value: String(v) });
                }
            });
            setCustomAttrs(customList);

            // Fetch all live classes for assignment picker
            const classesRes = await fetch("/api/live-classes?limit=100", {
                headers: {
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                }
            });
            const classesData = await classesRes.json();
            if (classesRes.ok) {
                setAvailableClasses(classesData.classes || []);
            }

        } catch (err) {
            console.error("Error loading batch details:", err);
            toast.error("Failed to load batch details");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBatchAndClasses();
    }, [batchId]);

    const handleRemoveStudent = (emailToRemove: string) => {
        setEnrolledStudents(prev => prev.filter(e => e.toLowerCase() !== emailToRemove.toLowerCase()));
        toast.info(`Removed ${emailToRemove}`);
    };

    const handleAddBulkStudents = () => {
        const newEmails = Array.from(
            new Set(
                bulkEmailsToAdd
                    .split(/[\n,;\s]+/)
                    .map(e => e.trim().toLowerCase())
                    .filter(e => e.includes("@") && e.includes("."))
            )
        );

        if (newEmails.length === 0) {
            toast.error("No valid emails found");
            return;
        }

        setEnrolledStudents(prev => Array.from(new Set([...prev, ...newEmails])));
        setBulkEmailsToAdd("");
        toast.success(`Added ${newEmails.length} students!`);
    };

    const toggleClassSelection = (id: string) => {
        setSelectedClassIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const addCustomAttr = () => {
        setCustomAttrs(prev => [...prev, { key: "", value: "" }]);
    };

    const updateCustomAttr = (index: number, field: "key" | "value", val: string) => {
        setCustomAttrs(prev => {
            const updated = [...prev];
            updated[index][field] = val;
            return updated;
        });
    };

    const removeCustomAttr = (index: number) => {
        setCustomAttrs(prev => prev.filter((_, i) => i !== index));
    };

    const addBatchNote = (title = "", link = "") => {
        setBatchNotes(prev => [...prev, { title, link }]);
    };

    const updateBatchNote = (index: number, field: "title" | "link", val: string) => {
        setBatchNotes(prev => {
            const updated = [...prev];
            updated[index][field] = val;
            return updated;
        });
    };

    const removeBatchNote = (index: number) => {
        setBatchNotes(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveBatch = async () => {
        if (!batchName.trim()) {
            toast.error("Batch name is required");
            return;
        }

        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const notesObj: Record<string, string> = {};
            batchNotes.forEach(({ title, link }) => {
                if (title.trim()) {
                    notesObj[title.trim()] = link.trim();
                }
            });

            const attributesObj: Record<string, any> = {
                status,
                batch_type: batchType,
                ...(discordLink.trim() ? { discord_link: discordLink.trim() } : {}),
                ...(whatsappLink.trim() ? { whatsapp_link: whatsappLink.trim() } : {}),
                ...(syllabusUrl.trim() ? { syllabus_url: syllabusUrl.trim() } : {}),
                ...(startDate ? { start_date: startDate } : {}),
                ...(endDate ? { end_date: endDate } : {}),
                notes: notesObj,
            };

            customAttrs.forEach(({ key, value }) => {
                if (key.trim() && key.trim() !== "notes" && key.trim() !== "batch_type") {
                    attributesObj[key.trim()] = value.trim();
                }
            });

            const payload = {
                batch_name: batchName.trim(),
                new_batch_id: newBatchId.trim(),
                description: description.trim(),
                enrolled_students: enrolledStudents,
                class_ids: selectedClassIds,
                attributes: attributesObj,
            };

            const res = await fetch(`/api/batches/${batchId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to update batch");
            } else {
                toast.success("Batch updated successfully! ⭐");
                if (newBatchId.trim() && newBatchId.trim() !== batchId) {
                    router.replace(`/admin/batches/${newBatchId.trim()}`);
                } else {
                    loadBatchAndClasses();
                }
            }
        } catch (err) {
            console.error("Error saving batch:", err);
            toast.error("Failed to update batch");
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = enrolledStudents.filter(e =>
        e.toLowerCase().includes(studentSearch.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-500">
                <RotateCw className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm">Loading batch settings...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                <div className="flex items-center gap-3">
                    <Link href="/admin/batches">
                        <Button variant="outline" size="sm" className="gap-1 text-xs">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            Edit Batch: {batchName}
                        </h1>
                        <p className="text-xs text-gray-500">Manage enrolled students, link classes, and view analytics</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href={`/batch/${batchId}`} target="_blank">
                        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                            <ExternalLink className="w-3.5 h-3.5" /> Student Portal
                        </Button>
                    </Link>
                    <Button
                        onClick={handleSaveBatch}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                        {saving ? <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Tabbed Management Sections */}
            <Tabs defaultValue="overview" className="w-full space-y-6">
                <TabsList className="bg-gray-100 p-1">
                    <TabsTrigger value="overview">Batch Settings</TabsTrigger>
                    <TabsTrigger value="students">
                        Enrolled Students ({enrolledStudents.length})
                    </TabsTrigger>
                    <TabsTrigger value="classes">
                        Assigned Classes ({selectedClassIds.length})
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                        Class Analytics & Feedback
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: Overview & Attributes */}
                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-bold">General Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="batchName">Batch Name</Label>
                                <Input
                                    id="batchName"
                                    value={batchName}
                                    onChange={(e) => setBatchName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="batchSlug">Batch Slug / URL Identifier</Label>
                                <Input
                                    id="batchSlug"
                                    value={newBatchId}
                                    onChange={(e) => setNewBatchId(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-bold">Attributes & Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Batch Status</Label>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upcoming">Upcoming</SelectItem>
                                            <SelectItem value="active">Active / In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="batchType">Batch Type / Curriculum</Label>
                                    <Select value={batchType} onValueChange={setBatchType}>
                                        <SelectTrigger id="batchType">
                                            <SelectValue placeholder="Select batch type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dsa">DSA & CP (Enables Progress Tracking)</SelectItem>
                                            <SelectItem value="dev">Web Development & Fullstack</SelectItem>
                                            <SelectItem value="general">Core CS & General</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="syllabusUrl">Syllabus URL</Label>
                                    <Input
                                        id="syllabusUrl"
                                        value={syllabusUrl}
                                        onChange={(e) => setSyllabusUrl(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="discordLink">Discord Channel Link</Label>
                                    <Input
                                        id="discordLink"
                                        value={discordLink}
                                        onChange={(e) => setDiscordLink(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="whatsappLink">WhatsApp Group Link</Label>
                                    <Input
                                        id="whatsappLink"
                                        value={whatsappLink}
                                        onChange={(e) => setWhatsappLink(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Custom Key-Values */}
                            <div className="pt-3 border-t space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-gray-700">Custom Attributes</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addCustomAttr} className="text-xs h-7 gap-1">
                                        <Plus className="w-3 h-3" /> Add Key-Value
                                    </Button>
                                </div>

                                {customAttrs.map((attr, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Input
                                            placeholder="Key"
                                            value={attr.key}
                                            onChange={(e) => updateCustomAttr(idx, "key", e.target.value)}
                                            className="text-xs flex-1"
                                        />
                                        <Input
                                            placeholder="Value"
                                            value={attr.value}
                                            onChange={(e) => updateCustomAttr(idx, "value", e.target.value)}
                                            className="text-xs flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeCustomAttr(idx)}
                                            className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Overall Batch Notes & Links Section (Stored in attributes.notes) */}
                    <Card className="border-blue-200/80 shadow-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-50/60 to-indigo-50/40 pb-3 border-b border-blue-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                        Batch Notes & Resources (Overall Batch)
                                    </CardTitle>
                                    <CardDescription className="text-xs text-gray-500 mt-0.5">
                                        Store batch-level notes, links, and study materials (e.g. &ldquo;github link&rdquo;, &ldquo;resources link&rdquo;). Stored in <code className="text-blue-700 bg-blue-100/60 px-1 py-0.5 rounded font-mono text-[11px]">attributes.notes</code>.
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addBatchNote("", "")}
                                    className="text-xs h-8 gap-1 border-blue-300 text-blue-700 hover:bg-blue-50 shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Note / Link
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {batchNotes.length === 0 ? (
                                <div className="text-center py-8 text-xs text-gray-500 border border-dashed border-gray-200 rounded-xl bg-slate-50/50 space-y-3 p-4">
                                    <p>No overall batch notes added yet.</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addBatchNote("github link", "")}
                                            className="text-xs h-7 gap-1 border-dashed text-gray-600 hover:text-blue-600 hover:border-blue-300"
                                        >
                                            <Plus className="w-3 h-3" /> + "github link"
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addBatchNote("resources link", "")}
                                            className="text-xs h-7 gap-1 border-dashed text-gray-600 hover:text-blue-600 hover:border-blue-300"
                                        >
                                            <Plus className="w-3 h-3" /> + "resources link"
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                                        <span>{batchNotes.length} notes / links configured</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => addBatchNote("github link", "")}
                                                className="text-blue-600 hover:underline text-[11px]"
                                            >
                                                + github link
                                            </button>
                                            <span>•</span>
                                            <button
                                                type="button"
                                                onClick={() => addBatchNote("resources link", "")}
                                                className="text-blue-600 hover:underline text-[11px]"
                                            >
                                                + resources link
                                            </button>
                                        </div>
                                    </div>

                                    {batchNotes.map((note, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl border bg-slate-50/70 border-slate-200">
                                            <div className="w-full sm:w-1/3">
                                                <Label className="text-[10px] text-gray-500 font-medium mb-1 block">Key / Note Title</Label>
                                                <Input
                                                    placeholder="e.g. github link, resources link"
                                                    value={note.title}
                                                    onChange={(e) => updateBatchNote(idx, "title", e.target.value)}
                                                    className="text-xs h-8 bg-white"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label className="text-[10px] text-gray-500 font-medium mb-1 block">URL or Content</Label>
                                                <Input
                                                    placeholder="https://github.com/... or resource URL"
                                                    value={note.link}
                                                    onChange={(e) => updateBatchNote(idx, "link", e.target.value)}
                                                    className="text-xs h-8 bg-white"
                                                />
                                            </div>
                                            <div className="sm:self-end pt-1 sm:pt-0">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeBatchNote(idx)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                                    title="Remove note"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: Enrolled Students */}
                <TabsContent value="students" className="space-y-6">
                    {/* Add More Students Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                Bulk Add Students
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Paste emails (newline or comma separated) to add them to this batch
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                placeholder="newstudent1@gmail.com, newstudent2@gmail.com"
                                value={bulkEmailsToAdd}
                                onChange={(e) => setBulkEmailsToAdd(e.target.value)}
                                rows={3}
                                className="font-mono text-xs"
                            />
                            <Button
                                onClick={handleAddBulkStudents}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add to Enrolled List
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Enrolled Students List */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base font-bold">
                                        Enrolled Students List ({enrolledStudents.length})
                                    </CardTitle>
                                    <CardDescription className="text-xs">Students with authenticated access to this batch</CardDescription>
                                </div>
                                <div className="relative max-w-xs w-full">
                                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search student email..."
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="pl-8 text-xs h-8"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredStudents.length === 0 ? (
                                <div className="text-center py-8 text-xs text-gray-400">
                                    No students found.
                                </div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto divide-y border rounded-lg">
                                    {filteredStudents.map((email, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2.5 text-xs hover:bg-gray-50">
                                            <span className="font-mono text-gray-800">{email}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveStudent(email)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 text-xs flex items-center gap-1"
                                            >
                                                <UserMinus className="w-3.5 h-3.5" /> Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: Assign Classes */}
                <TabsContent value="classes" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Video className="w-4 h-4 text-purple-600" />
                                        Assign Classes to this Batch
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Select live classes from the schedule that belong to this batch
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {selectedClassIds.length} classes selected
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-3">
                                {availableClasses.map((c) => {
                                    const classIdentifier = c.id || c.class_url_slug;
                                    const isChecked = selectedClassIds.includes(classIdentifier);
                                    const epoch = Number(c.class_time_epoch || 0);
                                    const dateStr = epoch ? new Date(epoch * 1000).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "numeric"
                                    }) : "";

                                    return (
                                        <div
                                            key={classIdentifier}
                                            onClick={() => toggleClassSelection(classIdentifier)}
                                            className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors text-xs ${
                                                isChecked ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox checked={isChecked} onCheckedChange={() => toggleClassSelection(classIdentifier)} />
                                                <div>
                                                    <span className="font-semibold text-gray-900">{c.class_name}</span>
                                                    <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                                                        <span className="capitalize">{c.class_topic}</span>
                                                        {dateStr && <span>• {dateStr}</span>}
                                                        {c.instructor_name && <span>• {c.instructor_name}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            {isChecked && <Check className="w-4 h-4 text-blue-600" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 4: Analytics & Feedback */}
                <TabsContent value="analytics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-emerald-600" />
                                Class Attendance & Student Ratings
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Attendance records and feedback breakdown for classes in this batch
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {linkedClasses.length === 0 ? (
                                <div className="text-center py-12 text-xs text-gray-400">
                                    No classes assigned to this batch yet.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {linkedClasses.map((c) => {
                                        const studentsJoined = Array.isArray(c.students_joined) ? c.students_joined.length : 0;
                                        const attendanceRecords = Array.isArray(c.attendance) ? c.attendance.length : 0;
                                        const avg = c.average_ratings || {};

                                        return (
                                            <div key={c.id || c.class_url_slug} className="p-4 border rounded-xl bg-gray-50/50 space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-gray-900">{c.class_name}</h4>
                                                        <span className="text-xs text-gray-500 uppercase">{c.class_topic}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                                            {studentsJoined} Joined Live
                                                        </Badge>
                                                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                            {attendanceRecords} Attendance Logged
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Rating breakdown */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t text-xs">
                                                    <div className="bg-white p-2 rounded border">
                                                        <span className="text-gray-400 block text-[10px]">Content</span>
                                                        <div className="font-bold text-gray-800 flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            {avg.content || 0} / 5
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-2 rounded border">
                                                        <span className="text-gray-400 block text-[10px]">Doubts</span>
                                                        <div className="font-bold text-gray-800 flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            {avg.doubts || 0} / 5
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-2 rounded border">
                                                        <span className="text-gray-400 block text-[10px]">Engagement</span>
                                                        <div className="font-bold text-gray-800 flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            {avg.engagement || 0} / 5
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-2 rounded border">
                                                        <span className="text-gray-400 block text-[10px]">Overall</span>
                                                        <div className="font-bold text-amber-600 flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                            {avg.overall || 0} / 5
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
