"use client"

import { useRouter } from "next/navigation";
import { Logo } from "../(dashboard)/_components/components/logo";
import { useEffect } from "react";
const Community = () => {
    const router = useRouter()
    useEffect(()=>{
        router.replace("/pro")
    })
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="animate-ping">
                <Logo />
            </div>
        </div>
    );
}

export default Community;