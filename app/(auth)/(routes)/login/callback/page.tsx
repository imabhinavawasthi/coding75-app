"use client";

import { Loader2 } from "lucide-react";
import supabase from "@/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CallBack = () => {
    const router = useRouter();

    useEffect(() => {
        let hasHandled = false;

        async function processSession(session: any) {
            if (hasHandled) return;
            hasHandled = true;

            try {
                // Check if user has already completed onboarding
                const res = await fetch("/api/profile", {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    if (!data.isOnboarded) {
                        // Redirect new user to onboarding wizard
                        router.push("/onboarding");
                        return;
                    }
                }

                // Existing onboarded user -> route to stored destination or home
                const loggedin_route = localStorage.getItem("loggedin_route");
                if (loggedin_route && loggedin_route !== "") {
                    localStorage.setItem("loggedin_route", "");
                    router.push(loggedin_route);
                } else {
                    router.push("/");
                }
            } catch (err) {
                console.error("Auth callback error:", err);
                router.push("/");
            }
        }

        async function handleAuthCallback() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    processSession(session);
                    return;
                }

                const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                    if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
                        processSession(session);
                    }
                });

                const timeout = setTimeout(() => {
                    if (!hasHandled) {
                        router.push("/login");
                    }
                }, 4000);

                return () => {
                    clearTimeout(timeout);
                    authListener?.subscription?.unsubscribe();
                };
            } catch (err) {
                console.error("Auth callback error:", err);
                router.push("/login");
            }
        }

        handleAuthCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex items-center text-indigo-800 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <div className="font-bold text-gray-800 text-sm">Authenticating & Setting up your profile...</div>
            </div>
        </div>
    );
};

export default CallBack;