"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/supabase";

export function useBatchData() {
    const routeParams = useParams();
    const batchId = Array.isArray(routeParams?.batchId) ? routeParams.batchId[0] : (routeParams?.batchId as string) || "";

    const router = useRouter();
    const [batchData, setBatchData] = useState<any>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null);
    const [status, setStatus] = useState<"loading" | "done" | "unauthorized" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchBatchDetails = useCallback(async () => {
        if (!batchId) return;
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                localStorage.setItem("loggedin_route", `/batch/${batchId}`);
                router.replace("/login");
                return;
            }

            const token = session.access_token;
            const res = await fetch(`/api/batches/${batchId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.status === 401) {
                router.replace("/login");
                return;
            }

            if (res.status === 403) {
                setStatus("unauthorized");
                setBatchData({ batch_name: data.batch_name || batchId, batch_id: batchId });
                return;
            }

            if (!res.ok) {
                setStatus("error");
                setErrorMessage(data.error || "Failed to load batch");
                return;
            }

            setBatchData(data.batch);
            if (typeof window !== "undefined" && data.batch) {
                const bType = data.batch.attributes?.batch_type || "general";
                sessionStorage.setItem(`batch_type_${batchId}`, bType);
                window.dispatchEvent(new Event("batch_type_updated"));
            }
            setClasses(data.classes || []);
            setUser(data.user);
            setStatus("done");
        } catch (err: any) {
            console.error("Error fetching batch:", err);
            setStatus("error");
            setErrorMessage("Network error loading batch details");
        }
    }, [batchId, router]);

    useEffect(() => {
        fetchBatchDetails();
    }, [fetchBatchDetails]);

    return {
        batchId,
        batchData,
        classes,
        user,
        status,
        errorMessage,
        refetch: fetchBatchDetails
    };
}
