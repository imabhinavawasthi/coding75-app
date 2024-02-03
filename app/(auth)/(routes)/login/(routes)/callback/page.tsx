"use client"

import { Loader2 } from "lucide-react";
import supabase from "@/supabase";
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

const CallBack = () => {
    const router = useRouter()
    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data.user) {
                console.log(data);
            }
            else {
                router.push("/login")
            }
        }
        catch {

        }
    }

    useEffect(() => {
        checkUser()
        const loggedin_route = localStorage.getItem('loggedin_route');
        if (loggedin_route && loggedin_route != "") {
            localStorage.setItem('loggedin_route', "")
            router.push(loggedin_route)
        }
        else{
            router.push("/")
        }
    }, [])
    return (
        <div>
            <div className="flex text-indigo-800 items-center text-center">
                <Loader2 className="h-10 w-10 animate-spin" />
                <div className="text-center ml-5 font-extrabold">Welcome to crackDSA Group</div>
            </div>
        </div>
    );
}

export default CallBack;