"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    GraduationCap,
    Building2,
    Calendar,
    GitBranch,
    Code2,
    Check,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Search,
    ShieldCheck,
    ExternalLink,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import supabase from "@/supabase";
import { toast } from "sonner";
import {
    POPULAR_COLLEGES,
    BRANCHES_LIST,
    getGraduationYears,
    cleanCodingHandle
} from "@/lib/profile-constants";

export default function OnboardingPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    // Auth user info
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userAvatar, setUserAvatar] = useState("");

    // Step 1: Academic details
    const [college, setCollege] = useState("");
    const [customCollege, setCustomCollege] = useState("");
    const [isCustomCollege, setIsCustomCollege] = useState(false);
    const [collegeSearch, setCollegeSearch] = useState("");

    const [branch, setBranch] = useState("");
    const [customBranch, setCustomBranch] = useState("");
    const [isCustomBranch, setIsCustomBranch] = useState(false);

    const [graduationYear, setGraduationYear] = useState("");

    // Step 2: Coding profiles
    const [leetcode, setLeetcode] = useState("");
    const [codeforces, setCodeforces] = useState("");
    const [codechef, setCodechef] = useState("");
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");

    const graduationYears = useMemo(() => getGraduationYears(), []);

    const filteredColleges = useMemo(() => {
        if (!collegeSearch) return POPULAR_COLLEGES;
        return POPULAR_COLLEGES.filter((c) =>
            c.toLowerCase().includes(collegeSearch.toLowerCase())
        );
    }, [collegeSearch]);

    // Initial check: is user authenticated and what is their onboarding state?
    useEffect(() => {
        async function checkAuthAndProfile() {
            try {
                setLoading(true);
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    router.replace("/login");
                    return;
                }

                setUserEmail(session.user.email || "");
                setUserName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || "");
                setUserAvatar(session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "");

                const res = await fetch("/api/profile", {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    // If user is already onboarded, redirect to destination or home
                    if (data.isOnboarded) {
                        const destination = localStorage.getItem("loggedin_route");
                        if (destination) {
                            localStorage.removeItem("loggedin_route");
                            router.replace(destination);
                        } else {
                            router.replace("/");
                        }
                        return;
                    }

                    // If profile has partial details, pre-populate
                    if (data.profile?.college) {
                        if (POPULAR_COLLEGES.includes(data.profile.college)) {
                            setCollege(data.profile.college);
                        } else {
                            setCollege("Other");
                            setCustomCollege(data.profile.college);
                            setIsCustomCollege(true);
                        }
                    }
                    if (data.profile?.branch) {
                        if (BRANCHES_LIST.includes(data.profile.branch)) {
                            setBranch(data.profile.branch);
                        } else {
                            setBranch("Other");
                            setCustomBranch(data.profile.branch);
                            setIsCustomBranch(true);
                        }
                    }
                    if (data.profile?.graduation_year) {
                        setGraduationYear(data.profile.graduation_year);
                    }
                    if (data.profile?.social_links) {
                        setLeetcode(data.profile.social_links.leetcode || "");
                        setCodeforces(data.profile.social_links.codeforces || "");
                        setCodechef(data.profile.social_links.codechef || "");
                        setGithub(data.profile.social_links.github || "");
                        setLinkedin(data.profile.social_links.linkedin || "");
                    }
                }
            } catch (err) {
                console.error("Error during onboarding profile check:", err);
            } finally {
                setLoading(false);
            }
        }

        checkAuthAndProfile();
    }, [router]);

    // Validate and move to Step 2
    const handleProceedToStep2 = (e: React.FormEvent) => {
        e.preventDefault();

        const resolvedCollege = isCustomCollege ? customCollege.trim() : college;
        const resolvedBranch = isCustomBranch ? customBranch.trim() : branch;

        if (!resolvedCollege) {
            toast.error("Please select or enter your college / university.");
            return;
        }

        if (!resolvedBranch) {
            toast.error("Please select or enter your branch / stream.");
            return;
        }

        if (!graduationYear) {
            toast.error("Please select your graduation year.");
            return;
        }

        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Complete Onboarding: Save All Details
    const handleCompleteOnboarding = async (e: React.FormEvent) => {
        e.preventDefault();

        const resolvedCollege = isCustomCollege ? customCollege.trim() : college;
        const resolvedBranch = isCustomBranch ? customBranch.trim() : branch;

        const cleanLc = cleanCodingHandle("leetcode", leetcode);
        const cleanCf = cleanCodingHandle("codeforces", codeforces);
        const cleanCc = cleanCodingHandle("codechef", codechef);

        setSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("Session expired. Please log in again.");
                router.replace("/login");
                return;
            }

            const payload = {
                college: resolvedCollege,
                branch: resolvedBranch,
                graduation_year: graduationYear,
                social_links: {
                    leetcode: cleanLc,
                    codeforces: cleanCf,
                    codechef: cleanCc,
                    github: github.trim(),
                    linkedin: linkedin.trim()
                },
                onboarded: true
            };

            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                toast.error(errData.error || "Failed to save profile");
                return;
            }

            // If coding handles provided, trigger initial sync in background
            if (cleanLc && cleanCf && cleanCc) {
                fetch("/api/coding-profiles/sync", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({ force: true })
                }).catch(() => {});
            }

            toast.success("Welcome aboard! Your profile is all set 🚀");

            const destination = localStorage.getItem("loggedin_route");
            if (destination && destination !== "/onboarding") {
                localStorage.removeItem("loggedin_route");
                router.replace(destination);
            } else {
                router.replace("/");
            }
        } catch (err) {
            console.error("Error completing onboarding:", err);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-3" />
                <p className="text-sm font-medium text-gray-600">Setting up your experience...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="inline-block">
                        <Logo width={160} height={40} />
                    </div>
                    <div className="pt-2">
                        <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-0.5">
                            <Sparkles className="w-3.5 h-3.5" /> Welcome Onboarding
                        </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        {userName ? `Welcome, ${userName}! 👋` : "Welcome to coding75! 👋"}
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                        Let&apos;s set up your profile in 2 quick steps to personalize your batches, ranking, and progress tracking.
                    </p>
                </div>

                {/* Stepper Indicator */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Step 1 Pill */}
                    <div
                        onClick={() => setCurrentStep(1)}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                            currentStep === 1
                                ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300"
                                : "bg-white border-slate-200 opacity-80"
                        }`}
                    >
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                currentStep === 2
                                    ? "bg-emerald-600 text-white"
                                    : currentStep === 1
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-200 text-slate-600"
                            }`}
                        >
                            {currentStep === 2 ? <Check className="w-4 h-4" /> : "1"}
                        </div>
                        <div className="min-w-0 text-left">
                            <span className="text-[10px] text-gray-500 font-semibold uppercase block">Step 1</span>
                            <span className="text-xs font-bold text-gray-900 truncate block">Academic Details</span>
                        </div>
                    </div>

                    {/* Step 2 Pill */}
                    <div
                        className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                            currentStep === 2
                                ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300"
                                : "bg-white border-slate-200 opacity-60"
                        }`}
                    >
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                currentStep === 2 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                            }`}
                        >
                            2
                        </div>
                        <div className="min-w-0 text-left">
                            <span className="text-[10px] text-gray-500 font-semibold uppercase block">Step 2</span>
                            <span className="text-xs font-bold text-gray-900 truncate block">Coding Profiles</span>
                        </div>
                    </div>
                </div>

                {/* STEP 1: ACADEMIC DETAILS */}
                {currentStep === 1 && (
                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="pb-4 border-b bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-emerald-600" />
                                Step 1: Academic & Education Details
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                                This helps place you accurately in your college batch leaderboards and peer groups.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleProceedToStep2} className="space-y-5">
                                {/* College Dropdown */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                        College / University *
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
                                        <SelectTrigger className="text-xs sm:text-sm h-10">
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

                                    {/* Custom College Write-in Input */}
                                    {isCustomCollege && (
                                        <div className="pt-2">
                                            <Input
                                                placeholder="Type your full College / University name..."
                                                value={customCollege}
                                                onChange={(e) => setCustomCollege(e.target.value)}
                                                className="text-xs sm:text-sm h-10 border-blue-300 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Branch Dropdown */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <GitBranch className="w-3.5 h-3.5 text-purple-600" />
                                        Branch / Stream *
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
                                        <SelectTrigger className="text-xs sm:text-sm h-10">
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

                                    {/* Custom Branch Write-in Input */}
                                    {isCustomBranch && (
                                        <div className="pt-2">
                                            <Input
                                                placeholder="Type your branch / stream name..."
                                                value={customBranch}
                                                onChange={(e) => setCustomBranch(e.target.value)}
                                                className="text-xs sm:text-sm h-10 border-purple-300 focus:border-purple-500"
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Graduation Year Dropdown */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                        Graduation Year *
                                    </Label>
                                    <Select value={graduationYear} onValueChange={(val) => setGraduationYear(val)}>
                                        <SelectTrigger className="text-xs sm:text-sm h-10">
                                            <SelectValue placeholder="Select Year of Passing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {graduationYears.map((yr) => (
                                                <SelectItem key={yr} value={yr} className="text-xs">
                                                    Class of {yr}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 border-t">
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm h-11 gap-2 shadow-sm"
                                    >
                                        Continue to Coding Profiles
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* STEP 2: CODING PROFILES */}
                {currentStep === 2 && (
                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="pb-4 border-b bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-emerald-600" />
                                Step 2: Competitive Coding Profiles
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                                Connect your profiles to unlock live stats, progress charts, and batch ranklist positions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleCompleteOnboarding} className="space-y-5">
                                {/* LeetCode */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="lcInput" className="text-xs font-semibold flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                                            LeetCode Username or Profile Link
                                        </span>
                                        <span className="text-[11px] text-gray-400 font-normal">e.g. tourist or leetcode.com/u/tourist</span>
                                    </Label>
                                    <Input
                                        id="lcInput"
                                        placeholder="LeetCode username (e.g. john_doe)"
                                        value={leetcode}
                                        onChange={(e) => setLeetcode(e.target.value)}
                                        className="text-xs h-10"
                                    />
                                </div>

                                {/* Codeforces */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="cfInput" className="text-xs font-semibold flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                                            Codeforces Handle or Profile Link
                                        </span>
                                        <span className="text-[11px] text-gray-400 font-normal">e.g. tourist or codeforces.com/profile/tourist</span>
                                    </Label>
                                    <Input
                                        id="cfInput"
                                        placeholder="Codeforces handle (e.g. tourist)"
                                        value={codeforces}
                                        onChange={(e) => setCodeforces(e.target.value)}
                                        className="text-xs h-10"
                                    />
                                </div>

                                {/* CodeChef */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="ccInput" className="text-xs font-semibold flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-yellow-600" />
                                            CodeChef Handle or Profile Link
                                        </span>
                                        <span className="text-[11px] text-gray-400 font-normal">e.g. gennady or codechef.com/users/gennady</span>
                                    </Label>
                                    <Input
                                        id="ccInput"
                                        placeholder="CodeChef handle (e.g. gennady)"
                                        value={codechef}
                                        onChange={(e) => setCodechef(e.target.value)}
                                        className="text-xs h-10"
                                    />
                                </div>

                                {/* Optional Social Links */}
                                <div className="pt-2 border-t space-y-4">
                                    <span className="text-[11px] font-semibold uppercase text-gray-400 block tracking-wider">
                                        Additional Profiles (Optional)
                                    </span>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="ghInput" className="text-xs text-gray-600">
                                                GitHub Username
                                            </Label>
                                            <Input
                                                id="ghInput"
                                                placeholder="e.g. octocat"
                                                value={github}
                                                onChange={(e) => setGithub(e.target.value)}
                                                className="text-xs h-9"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="liInput" className="text-xs text-gray-600">
                                                LinkedIn Profile Link
                                            </Label>
                                            <Input
                                                id="liInput"
                                                placeholder="https://linkedin.com/in/..."
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                                className="text-xs h-9"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 border-t flex items-center justify-between gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCurrentStep(1)}
                                        className="text-xs h-11 gap-1.5"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Back to Step 1
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm h-11 px-6 gap-2 shadow-sm"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Completing Onboarding...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4" /> Complete & Get Started
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
