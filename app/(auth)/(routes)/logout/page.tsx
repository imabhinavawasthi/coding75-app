"use client"

import { Button } from "@/components/ui/button";
import supabase from "@/supabase";
import { useRouter } from "next/navigation";

const LogOut = () => {
    const router = useRouter()
    async function checkUser() {
        try {
            const {data,error} = await supabase.auth.getUser();
            if (data.user) {
                let { error } = await supabase.auth.signOut()
                console.log(data.user);
                router.push('/')
            }
            else{
                console.log(data.user);
                router.push('/login')
            }
        }
        catch {

        }
    }
    async function handleLogOut() {
        checkUser()
    }
    return (
        <div>
            <Button onClick={handleLogOut}>
                Log In
            </Button>
        </div>
    );
}

export default LogOut;