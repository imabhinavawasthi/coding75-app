"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import supabase from "@/supabase";

export default function CreateBatchPage() {
    const router = useRouter();

    const [batchId, setBatchId] = useState("");
    const [batchName, setBatchName] = useState("");
    const [description, setDescription] = useState("");
    const [rawStudentEmails, setRawStudentEmails] = useState("");

    // Classes selection
    const [availableClasses, setAvailableClasses] = useState<any[]>([]);
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(true);

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

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchClasses() {
            setLoadingClasses(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                const res = await fetch("/api/live-classes?limit=100", {
                    headers: {
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setAvailableClasses(data.classes || []);
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
            } finally {
                setLoadingClasses(false);
            }
        }
        fetchClasses();
    }, []);

    // Parse student emails
    const parsedEmails = Array.from(
        new Set(
            rawStudentEmails
                .split(/[\n,;\s]+/)
                .map(e => e.trim().toLowerCase())
                .filter(e => e.includes("@") && e.includes("."))
        )
    );

    const handleAutoSlug = (name: string) => {
        setBatchName(name);
        if (!batchId) {
            const slug = name
                .toLowerCase()
                .replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, "-")
                .replace(/^(-)+|(-)+$/g, "");
            setBatchId(slug);
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchId.trim() || !batchName.trim()) {
            toast.error("Batch ID and Batch Name are required");
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
                batch_id: batchId.trim(),
                batch_name: batchName.trim(),
                description: description.trim(),
                enrolled_students: parsedEmails,
                class_ids: selectedClassIds,
                attributes: attributesObj,
            };

            const res = await fetch("/api/batches", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to create batch");
            } else {
                toast.success("Batch created successfully! 🚀");
                router.push("/admin/batches");
            }
        } catch (err) {
            console.error("Error creating batch:", err);
            toast.error("Failed to create batch. Please check inputs.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/admin/batches">
                    <Button variant="outline" size="sm" className="gap-1 text-xs">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Batches
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Batch</h1>
                    <p className="text-xs text-gray-500">Configure batch identity, students list, and linked classes</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-bold">1. Batch Identity</CardTitle>
                        <CardDescription className="text-xs">Primary identification and routing information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="batchName">Batch Name *</Label>
                            <Input
                                id="batchName"
                                placeholder="e.g. DSA & Algorithms Masterclass - Batch 1"
                                value={batchName}
                                onChange={(e) => handleAutoSlug(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="batchId" className="flex items-center justify-between">
                                <span>Batch ID / URL Slug *</span>
                                <span className="text-xs text-gray-400 font-normal">Route: /batch/{batchId || "your-slug"}</span>
                            </Label>
                            <Input
                                id="batchId"
                                placeholder="e.g. dsa-batch-1"
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Write a brief overview of this batch, curriculum, or target audience..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Enrolled Students */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    2. Enrolled Students
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Paste email addresses of students allowed to enter this batch
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                {parsedEmails.length} valid students
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Textarea
                            placeholder={`Paste student emails separated by newlines, commas, or spaces:\nstudent1@gmail.com\nstudent2@gmail.com, student3@gmail.com`}
                            value={rawStudentEmails}
                            onChange={(e) => setRawStudentEmails(e.target.value)}
                            rows={5}
                            className="font-mono text-xs"
                        />
                        <p className="text-[11px] text-gray-400">
                            Duplicates and invalid formats are automatically cleaned.
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Linked Live Classes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Video className="w-4 h-4 text-purple-600" />
                                    3. Assign Live Classes
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Select classes from the live-classes table that belong to this batch
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                {selectedClassIds.length} classes selected
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {loadingClasses ? (
                            <div className="flex items-center gap-2 py-4 text-xs text-gray-500">
                                <RotateCw className="w-4 h-4 animate-spin" /> Loading available classes...
                            </div>
                        ) : availableClasses.length === 0 ? (
                            <div className="text-xs text-gray-500 py-3">
                                No live classes found. You can schedule live classes in{" "}
                                <Link href="/admin/live-class" className="text-blue-600 underline">Admin Live Classes</Link>.
                            </div>
                        ) : (
                            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
                                {availableClasses.map((c) => {
                                    const classIdentifier = c.id || c.class_url_slug;
                                    const isChecked = selectedClassIds.includes(classIdentifier);
                                    const epoch = Number(c.class_time_epoch || 0);
                                    const dateStr = epoch ? new Date(epoch * 1000).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    }) : "";

                                    return (
                                        <div
                                            key={classIdentifier}
                                            onClick={() => toggleClassSelection(classIdentifier)}
                                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-xs ${
                                                isChecked ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Checkbox checked={isChecked} onCheckedChange={() => toggleClassSelection(classIdentifier)} />
                                                <div>
                                                    <span className="font-semibold text-gray-900">{c.class_name}</span>
                                                    <div className="text-[11px] text-gray-500 flex items-center gap-2">
                                                        <span>{c.class_topic}</span>
                                                        {dateStr && <span>• {dateStr}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            {isChecked && <Check className="w-4 h-4 text-blue-600" />}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 4. Batch Attributes & Resources */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            4. Attributes & Community Links
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Additional metadata, community links, and schedule dates
                        </CardDescription>
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
                                    placeholder="https://..."
                                    value={syllabusUrl}
                                    onChange={(e) => setSyllabusUrl(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="discordLink">Discord Channel / Server Link</Label>
                                <Input
                                    id="discordLink"
                                    placeholder="https://discord.gg/..."
                                    value={discordLink}
                                    onChange={(e) => setDiscordLink(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="whatsappLink">WhatsApp Community Link</Label>
                                <Input
                                    id="whatsappLink"
                                    placeholder="https://chat.whatsapp.com/..."
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

                        {/* Dynamic Custom Attributes */}
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
                                        placeholder="Key (e.g. mentor_notes)"
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
                                        <Plus className="w-3.5 h-3.5" /> + "github link"
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addBatchNote("resources link", "")}
                                        className="text-xs h-7 gap-1 border-dashed text-gray-600 hover:text-blue-600 hover:border-blue-300"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> + "resources link"
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

                {/* Submit button */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Link href="/admin/batches">
                        <Button type="button" variant="outline" disabled={saving}>
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                    >
                        {saving ? (
                            <>
                                <RotateCw className="w-4 h-4 mr-2 animate-spin" /> Saving...
                            </>
                        ) : (
                            "Create Batch 🚀"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
