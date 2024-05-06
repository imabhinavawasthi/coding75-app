import { decrypt, encrypt } from "@/components/encrypt-decrypt";
import { toast } from "sonner";

export async function checkSubscription(user_email) {
    const url = process?.env?.NEXT_PUBLIC_REGISTRATION_SHEET;
    let token = (new Date().toISOString().slice(0, 10)) + user_email
    try {
        if (decrypt(localStorage?.getItem("pro-token")) == token) {
            console.log("done");
            return true
        }
        const res = await fetch(url || "")
        const data = await res.json()
        for (let i = 1; i < data?.["content"]?.length; i++) {
            if (data?.["content"]?.[i]?.[2] == user_email) {
                localStorage.setItem("pro-token", encrypt(token))
                return true
            }
        }
        return null
    }
    catch {
        toast.error("Error occurred while fetching subscription details")
        return null
    }
}