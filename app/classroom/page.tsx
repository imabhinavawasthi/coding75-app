"use client"

import { useRouter } from "next/navigation";
import { Logo } from "../(dashboard)/_components/components/logo";
import { useEffect } from "react";

const Classroom = () => {
    const router = useRouter()
    useEffect(()=>{
        router.replace("/classroom/dashboard")
    },[])
    return (
        <div className="min-h-screen animate-ping flex justify-center items-center "><Logo/></div>
    );
}

export default Classroom;