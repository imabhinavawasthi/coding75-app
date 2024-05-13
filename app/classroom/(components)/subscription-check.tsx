"use client"

import { useEffect, useState } from "react";
import LiveBlurPage from "./live-blur-page";
import supabase from "@/supabase";
import { toast } from "sonner";
import { checkSubscription } from "../(api)/checkSubscription";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import BookBlurMeeting from "./book-meeting-blur";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GraduationCap, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Banner from "./banner";

const SubscriptionCheck = ({
    children, type
}: {
    children: React.ReactNode;
    type: any;
}) => {

    const [subscription, setSubscription] = useState<any>(null)
    const [status, setStatus] = useState("loading")

    async function getSubsDetails() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                setStatus("error")
                toast.error("Some error occured")
            }
            else {
                const res = await checkSubscription(data?.user?.email)
                setSubscription(res)
                setStatus("done")
            }
        }
        catch {
            setStatus("error")
            toast.error("Some error occured")
        }
    }

    useEffect(() => {
        getSubsDetails()
    }, [])
    return (
        <div>
            {
                status == "done" &&
                <>
                    {
                        subscription ?
                            <>
                                {children}
                            </>
                            :
                            <>
                                <div className="md:container px-3 mt-5 mb-5">
                                    <Banner/>
                                    <Alert>
                                        <GraduationCap className="h-4 w-4" />
                                        <AlertTitle>You are not subscribed to coding75 Pro!</AlertTitle>
                                        <AlertDescription>
                                            Subscribe to coding75 Pro to access all live classes and premium features 🚀
                                            <Link className="ml-2 text-blue-600" href="/pro#pricing">
                                                Subscribe Now!
                                            </Link>
                                        </AlertDescription>
                                    </Alert>
                                    <Link className="flex justify-center items-center w-full mt-3" href={"/pro"}>
                                        <Button className="w-full flex items-center border border-amber-700 bg-amber-200 hover:bg-amber-300 text-amber-700 font-bold" variant="destructive">
                                            <Lock className="h-4 w-4 mr-2" />
                                            {
                                                type == "meeting" ?
                                                    "Subscribe to coding75 Pro to book 1:1 sessions"
                                                    :
                                                    "Subscribe to coding75 Pro to Join Live Class"
                                            }
                                        </Button>
                                    </Link>
                                </div>
                                <Dialog defaultOpen>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Subscribe to coding75 Pro!</DialogTitle>
                                            <DialogDescription className="space-y-5">
                                                <p className="mb-5">
                                                    This page is only accessible to Pro users, join coding75 pro to access all the premium features 🚀
                                                </p>
                                                <Link className="w-full mt-5" href="/pro">
                                                    <Button className="w-full" variant={"outline"}>
                                                        Explore coding75 Pro 🚀
                                                    </Button>
                                                </Link>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                {
                                    type == "live" ?
                                        <LiveBlurPage />
                                        :
                                        <>
                                            {
                                                type == "meeting" &&
                                                <BookBlurMeeting />
                                            }
                                        </>
                                }
                            </>
                    }
                </>
            }
            {
                status == "error" &&
                <div className="mt-20">
                    <ErrorBanner />
                </div>
            }
            {
                status == "loading" &&
                <div className="mt-20 animate-ping flex items-center justify-center">
                    <Logo />
                </div>
            }
        </div>
    );
}

export default SubscriptionCheck;