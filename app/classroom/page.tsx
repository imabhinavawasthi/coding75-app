"use client"

import { useRouter } from "next/navigation";
import { Logo } from "../(dashboard)/_components/components/logo";

const Classroom = () => {
    const router = useRouter()
    router.push("/classroom/dashboard")
    return (
        <div className="min-h-screen animate-ping flex justify-center items-center "><Logo/></div>
    );
}

export default Classroom;