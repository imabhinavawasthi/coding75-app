"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    User,
    Mail,
    GraduationCap,
    Building2,
    Calendar,
    GitBranch,
    Globe,
    ExternalLink,
    CheckCircle2,
    Lock,
    Save,
    RotateCw,
    Sparkles,
    Shield,
    Code2,
    Share2,
    Terminal,
    Search,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import ErrorBanner from "../../_components/banners/error-banner";
import supabase from "@/supabase";
import { toast } from "sonner";
import {
    POPULAR_COLLEGES,
    BRANCHES_LIST,
    getGraduationYears,
    cleanCodingHandle,
    getPlatformProfileUrl
} from "@/lib/profile-constants";

export default function ProfilePage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auth user info (read-only)
    const [authUser, setAuthUser] = useState<{
        email: string;
        name: string;
        avatar_url: string;
        isAdmin: boolean;
    } | null>(null);

    // Form states
    const [college, setCollege] = useState("");
    const [customCollege, setCustomCollege] = useState("");
    const [isCustomCollege, setIsCustomCollege] = useState(false);

    const [branch, setBranch] = useState("");
    const [customBranch, setCustomBranch] = useState("");
    const [isCustomBranch, setIsCustomBranch] = useState(false);

    const [graduationYear, setGraduationYear] = useState("");

    const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
        leetcode: "",
        codeforces: "",
        codechef: "",
        github: "",
        linkedin: "",
        twitter: "",
        portfolio: "",
        discord: ""
    });

    const graduationYears = useMemo(() => getGraduationYears(), []);

    // College search filter
    const [collegeSearch, setCollegeSearch] = useState("");

    const filteredColleges = useMemo(() => {
        if (!collegeSearch) return POPULAR_COLLEGES;
        return POPULAR_COLLEGES.filter(c =>
            c.toLowerCase().includes(collegeSearch.toLowerCase())
        );
    }, [collegeSearch]);

    // Fetch Profile via API wrapper
    async function fetchProfile() {
        setLoading(true);
        setError(null);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                localStorage.setItem("loggedin_route", "/profile");
                router.replace("/login");
                return;
            }

            const token = session.access_token;
            const res = await fetch("/api/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                router.replace("/login");
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to load profile");
                return;
            }

            setAuthUser(data.user);

            const prof = data.profile || {};

            // Initialize college
            if (prof.college) {
                if (POPULAR_COLLEGES.includes(prof.college)) {
                    setCollege(prof.college);
                    setIsCustomCollege(false);
                } else {
                    setCollege("Other");
                    setCustomCollege(prof.college);
                    setIsCustomCollege(true);
                }
            }

            // Initialize branch
            if (prof.branch) {
                if (BRANCHES_LIST.includes(prof.branch)) {
                    setBranch(prof.branch);
                    setIsCustomBranch(false);
                } else {
                    setBranch("Other");
                    setCustomBranch(prof.branch);
                    setIsCustomBranch(true);
                }
            }

            // Initialize graduation year
            if (prof.graduation_year) {
                setGraduationYear(prof.graduation_year);
            }

            // Initialize social links
            if (prof.social_links && typeof prof.social_links === "object") {
                setSocialLinks({
                    leetcode: prof.social_links.leetcode || "",
                    codeforces: prof.social_links.codeforces || "",
                    codechef: prof.social_links.codechef || "",
                    github: prof.social_links.github || "",
                    linkedin: prof.social_links.linkedin || "",
                    twitter: prof.social_links.twitter || prof.social_links.x || "",
                    portfolio: prof.social_links.portfolio || "",
                    discord: prof.social_links.discord || ""
                });
            }

        } catch (err: any) {
            console.error("Error fetching profile:", err);
            setError("Network error loading profile");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Immediate check & subscribe to auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" || !session) {
                localStorage.setItem("loggedin_route", "/profile");
                router.replace("/login");
            }
        });

        fetchProfile();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    // Handle Handle Clean-up on blur
    const handlePlatformBlur = (platform: string) => {
        const raw = socialLinks[platform] || "";
        const cleaned = cleanCodingHandle(platform, raw);
        if (cleaned !== raw) {
            setSocialLinks(prev => ({ ...prev, [platform]: cleaned }));
            if (raw.includes("http") || raw.includes("/")) {
                toast.info(`Extracted username "${cleaned}" from URL`);
            }
        }
    };

    // Save Profile via API wrapper
    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace("/login");
                return;
            }

            const finalCollege = isCustomCollege ? customCollege.trim() : college === "Other" ? customCollege.trim() : college;
            const finalBranch = isCustomBranch ? customBranch.trim() : branch === "Other" ? customBranch.trim() : branch;

            // Clean all social links before sending
            const cleanedLinks: Record<string, string> = {};
            for (const [key, val] of Object.entries(socialLinks)) {
                if (val && val.trim()) {
                    cleanedLinks[key] = cleanCodingHandle(key, val);
                }
            }

            const payload = {
                college: finalCollege || null,
                graduation_year: graduationYear || null,
                branch: finalBranch || null,
                social_links: cleanedLinks
            };

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to update profile");
            } else {
                toast.success("Profile details saved successfully! ✨");
                // Update state with cleaned links
                setSocialLinks(prev => ({
                    ...prev,
                    ...cleanedLinks
                }));
            }
        } catch (err) {
            console.error("Error saving profile:", err);
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    // Profile Completion Percentage
    const completionScore = useMemo(() => {
        let filled = 1; // email is always present
        const total = 7; // email, name, college, branch, grad_year, at least 1 coding handle, at least 1 social link
        if (authUser?.name) filled++;
        if (college || customCollege) filled++;
        if (branch || customBranch) filled++;
        if (graduationYear) filled++;
        if (socialLinks.leetcode || socialLinks.codeforces || socialLinks.codechef || socialLinks.github) filled++;
        if (socialLinks.linkedin || socialLinks.twitter || socialLinks.portfolio) filled++;
        return Math.round((filled / total) * 100);
    }, [authUser, college, customCollege, branch, customBranch, graduationYear, socialLinks]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="animate-ping">
                    <Logo />
                </div>
                <p className="text-sm font-medium text-gray-500">Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container max-w-3xl mx-auto px-4 py-16">
                <ErrorBanner />
                <p className="text-center text-sm text-red-500 mt-2">{error}</p>
                <div className="text-center mt-4">
                    <Button variant="outline" size="sm" onClick={fetchProfile}>
                        <RotateCw className="w-4 h-4 mr-2" /> Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 pb-20">
            {/* Top Accent Gradient Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white pt-10 pb-24 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Account & Profile Settings
                        </h1>
                        <p className="text-sm text-slate-300 mt-1 max-w-xl">
                            Manage your academic credentials, coding handles, and social links to personalize your learning experience.
                        </p>
                    </div>

                    {/* Profile Completion Meter */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4 min-w-[240px]">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-white/20"
                                    strokeWidth="3.5"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="text-emerald-400"
                                    strokeDasharray={`${completionScore}, 100`}
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <span className="absolute text-xs font-bold text-white">{completionScore}%</span>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-200 block">Profile Strength</span>
                            <span className="text-[11px] text-slate-300 font-normal">
                                {completionScore === 100 ? "Complete & Verified" : "Add details to reach 100%"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* SECTION 1: IDENTITY & ACCOUNT DETAILS */}
                    <Card className="shadow-lg border-slate-200/80 bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                Account Identity
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                                Identity metadata synced from your authentication provider
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                {/* Profile Picture Preview */}
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md border-2 border-white ring-2 ring-indigo-100">
                                        {authUser?.avatar_url ? (
                                            <img
                                                src={authUser.avatar_url}
                                                alt={authUser.name || "User Avatar"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold uppercase">
                                                {authUser?.name ? authUser.name[0] : (authUser?.email ? authUser.email[0] : "U")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                    </div>
                                </div>

                                {/* Identity Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold text-gray-700">Display Name</Label>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> Provider Managed
                                            </span>
                                        </div>
                                        <Input
                                            value={authUser?.name || "Member"}
                                            disabled
                                            className="bg-slate-50 font-medium text-gray-800 text-xs sm:text-sm cursor-not-allowed border-slate-200"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-semibold text-gray-700">Email Address</Label>
                                            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                                                <CheckCircle2 className="w-3 h-3" /> Verified
                                            </span>
                                        </div>
                                        <Input
                                            value={authUser?.email || ""}
                                            disabled
                                            className="bg-slate-50 font-medium text-gray-800 text-xs sm:text-sm cursor-not-allowed border-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: ACADEMIC & EDUCATION DETAILS */}
                    <Card className="shadow-md border-slate-200/80 bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                Academic Details
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                                Your college, degree branch, and graduation timeline
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* College Dropdown */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                        College / University
                                    </Label>
                                    <Select
                                        value={isCustomCollege ? "Other" : college}
                                        onValueChange={(val) => {
                                            if (val === "Other") {
                                                setIsCustomCollege(true);
                                                setCollege("Other");
                                            } else {
                                                setIsCustomCollege(false);
                                                setCollege(val);
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="text-xs sm:text-sm">
                                            <SelectValue placeholder="Select your College / University" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-72">
                                            <div className="p-2 border-b sticky top-0 bg-white z-10">
                                                <div className="relative">
                                                    <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <Input
                                                        placeholder="Search college..."
                                                        value={collegeSearch}
                                                        onChange={(e) => setCollegeSearch(e.target.value)}
                                                        className="h-8 text-xs pl-7"
                                                    />
                                                </div>
                                            </div>
                                            {filteredColleges.map((col) => (
                                                <SelectItem key={col} value={col} className="text-xs">
                                                    {col}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Custom College Write-in Input if Other */}
                                    {isCustomCollege && (
                                        <div className="pt-2">
                                            <Input
                                                placeholder="Enter full name of your College / University..."
                                                value={customCollege}
                                                onChange={(e) => setCustomCollege(e.target.value)}
                                                className="text-xs sm:text-sm border-blue-300 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Branch Dropdown */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <GitBranch className="w-3.5 h-3.5 text-purple-600" />
                                        Branch / Stream
                                    </Label>
                                    <Select
                                        value={isCustomBranch ? "Other" : branch}
                                        onValueChange={(val) => {
                                            if (val === "Other") {
                                                setIsCustomBranch(true);
                                                setBranch("Other");
                                            } else {
                                                setIsCustomBranch(false);
                                                setBranch(val);
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="text-xs sm:text-sm">
                                            <SelectValue placeholder="Select your Branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BRANCHES_LIST.map((br) => (
                                                <SelectItem key={br} value={br} className="text-xs">
                                                    {br}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Custom Branch Write-in Input if Other */}
                                    {isCustomBranch && (
                                        <div className="pt-2">
                                            <Input
                                                placeholder="Enter your specific branch / specialization..."
                                                value={customBranch}
                                                onChange={(e) => setCustomBranch(e.target.value)}
                                                className="text-xs sm:text-sm border-purple-300 focus:border-purple-500"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Graduation Year Dropdown */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                        Graduation Year
                                    </Label>
                                    <Select
                                        value={graduationYear}
                                        onValueChange={setGraduationYear}
                                    >
                                        <SelectTrigger className="text-xs sm:text-sm">
                                            <SelectValue placeholder="Select Year (e.g. 2026)" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {graduationYears.map((yr) => (
                                                <SelectItem key={yr} value={yr} className="text-xs">
                                                    {yr} {yr === "2026" ? "(Current Year)" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: CODING PLATFORMS & HANDLES */}
                    <Card className="shadow-md border-slate-200/80 bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-amber-600" />
                                Coding Handles & Profiles
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                                Enter your usernames. (If you paste a full profile link, we will automatically extract the clean username)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* LeetCode */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                                            LeetCode Username
                                        </Label>
                                        {socialLinks.leetcode && (
                                            <a
                                                href={getPlatformProfileUrl("leetcode", socialLinks.leetcode)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                                            >
                                                Test Link <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="e.g., john_doe"
                                        value={socialLinks.leetcode}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, leetcode: e.target.value }))}
                                        onBlur={() => handlePlatformBlur("leetcode")}
                                        className="text-xs sm:text-sm font-mono"
                                    />
                                </div>

                                {/* Codeforces */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                            Codeforces Handle
                                        </Label>
                                        {socialLinks.codeforces && (
                                            <a
                                                href={getPlatformProfileUrl("codeforces", socialLinks.codeforces)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                                            >
                                                Test Link <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="e.g., tourist"
                                        value={socialLinks.codeforces}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, codeforces: e.target.value }))}
                                        onBlur={() => handlePlatformBlur("codeforces")}
                                        className="text-xs sm:text-sm font-mono"
                                    />
                                </div>

                                {/* CodeChef */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-amber-700" />
                                            CodeChef Handle
                                        </Label>
                                        {socialLinks.codechef && (
                                            <a
                                                href={getPlatformProfileUrl("codechef", socialLinks.codechef)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                                            >
                                                Test Link <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="e.g., chef_john"
                                        value={socialLinks.codechef}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, codechef: e.target.value }))}
                                        onBlur={() => handlePlatformBlur("codechef")}
                                        className="text-xs sm:text-sm font-mono"
                                    />
                                </div>

                                {/* GitHub */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-slate-900" />
                                            GitHub Username
                                        </Label>
                                        {socialLinks.github && (
                                            <a
                                                href={getPlatformProfileUrl("github", socialLinks.github)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                                            >
                                                Test Link <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="e.g., torvalds"
                                        value={socialLinks.github}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                                        onBlur={() => handlePlatformBlur("github")}
                                        className="text-xs sm:text-sm font-mono"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION 4: SOCIAL & PORTFOLIO LINKS */}
                    <Card className="shadow-md border-slate-200/80 bg-white">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-purple-600" />
                                Social & Portfolio Links
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                                Showcase your LinkedIn, personal portfolio, or professional presence
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* LinkedIn */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                                        LinkedIn Profile URL / Handle
                                    </Label>
                                    <Input
                                        placeholder="https://linkedin.com/in/username"
                                        value={socialLinks.linkedin}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                                        className="text-xs sm:text-sm"
                                    />
                                </div>

                                {/* X / Twitter */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-slate-800" />
                                        X (Twitter) Username
                                    </Label>
                                    <Input
                                        placeholder="e.g., my_handle"
                                        value={socialLinks.twitter}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                                        onBlur={() => handlePlatformBlur("twitter")}
                                        className="text-xs sm:text-sm font-mono"
                                    />
                                </div>

                                {/* Portfolio Website */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                                        Personal Portfolio Website URL
                                    </Label>
                                    <Input
                                        placeholder="https://yourportfolio.dev"
                                        value={socialLinks.portfolio}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, portfolio: e.target.value }))}
                                        className="text-xs sm:text-sm"
                                    />
                                </div>

                                {/* Discord */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                                        Discord Username / Tag
                                    </Label>
                                    <Input
                                        placeholder="e.g., username#1234 or username"
                                        value={socialLinks.discord}
                                        onChange={(e) => setSocialLinks(prev => ({ ...prev, discord: e.target.value }))}
                                        className="text-xs sm:text-sm font-mono"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Floating/Sticky Save Action Bar */}
                    <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Changes are saved directly to your account.</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={fetchProfile}
                                disabled={saving}
                                className="text-xs"
                            >
                                Discard Changes
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={saving}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-5 flex items-center gap-1.5 shadow"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {saving ? "Saving Details..." : "Save Profile Details"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}