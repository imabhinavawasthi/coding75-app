"use client"

import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Contest = () => {
    const router = useRouter()
    useEffect(()=>{
        router.replace("/dsa-cp/codeforces")
    })
    return (
        <div>
            <Loading title={"Loading Codeforces Problem"}/>
        </div>
    );
}

export default Contest;