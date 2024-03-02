"use client"

import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Contest = () => {
    const router = useRouter()
    useEffect(()=>{
        router.replace("/dsa-cp/codechef")
    })
    return (
        <div>
            <Loading title={"Loading CodeChef Problem"}/>
        </div>
    );
}

export default Contest;