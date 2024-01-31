"use client"

import { Button } from "@/components/ui/button";
import supabase from "@/supabase";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'

const LogIn = () => {
    const router = useRouter()
    async function checkUser() {
        try {
            const {data,error} = await supabase.auth.getUser();
            if (data) {
                console.log(data.user);
                if(data.user)
                    router.push('/')
            }
            else{
                console.error(error);
            }
        }
        catch {

        }
    }
    useEffect(() => {
        checkUser()

    },[])

    async function handleLogIn(e: any) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                }
            }
            )
        }
        catch {

        }
    }
    return (
        <div>
            <Button onClick={handleLogIn}>
                Log In
            </Button>
        </div>
    );
}

export default LogIn;