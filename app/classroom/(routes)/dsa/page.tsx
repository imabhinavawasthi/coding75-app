"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LegacyDSAPage = () => {
    const router = useRouter();
    useEffect(() => {
        router.replace("/dsa");
    }, [router]);

    return (
        <div className="p-8 text-center text-sm text-muted-foreground">
            Redirecting to the new One-Stop DSA Portal...
        </div>
    );
};

export default LegacyDSAPage;