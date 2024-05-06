import { toast } from "sonner";

export async function fetchSubscriptionDetails() {
    const url = process?.env?.NEXT_PUBLIC_REGISTRATION_SHEET;

    try{
        const res = await fetch(url||"")
        const data = await res.json()
        return data["content"]
    }
    catch{
        toast.error("Error occurred while fetching subscription details")
        return null
    }
}