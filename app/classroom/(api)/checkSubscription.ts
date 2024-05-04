import { toast } from "sonner";

export async function checkSubscription(user_email) {
    const url = process?.env?.NEXT_PUBLIC_REGISTRATION_SHEET;

    try{
        const res = await fetch(url||"")
        const data = await res.json()
        for(let i=1;i<data?.["content"]?.length;i++){
            if(data?.["content"]?.[i]?.[2]==user_email){
                return data?.["content"]?.[i]
            }
        }
        return null
    }
    catch{
        toast.error("Error occurred while fetching subscription details")
        return null
    }
}