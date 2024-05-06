/* eslint-disable @next/next/no-img-element */
"use client";

import FeatureSection3 from "@/components/landing-page/feature-section-3";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import supabase from "@/supabase";
import { ArrowRightCircle, CheckCircle, LucideRocket, Rocket, RotateCw, ScrollText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ErrorBanner from "../../_components/banners/error-banner";
import { codeforces_problem } from "@/components/social-links";
import SubscriptionDetailsPage from "@/app/classroom/(routes)/subscription/page";

interface statusType {
    getUser: "loading" | "done" | "error",
    codeforces: "loading" | "done" | "error" | "pending" | "verification",
    checkVerification: "loading" | "pending" | "done"
}


const Profile = () => {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [status, setStatus] = useState<statusType>({
        getUser: "loading",
        codeforces: "pending",
        checkVerification: "pending"
    })
    const [codeforcesId, setCodeforcesId] = useState<any>(null)
    const [inputCodeforcesId, setInputCodeforcesId] = useState<any>(null)

    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                if (data.user) {
                    setUser(data?.user?.user_metadata)
                    if (data.user?.user_metadata?.full_name)
                        document.title = `${data.user?.user_metadata?.full_name} Profile - coding75`
                    await initialiseUser(data?.user?.user_metadata?.email)
                }
                else {
                    setUser(null)
                    initialiseUser(null)
                    router.push("/login")
                }
            }
            else {
                console.error(error);
                toast.error('Error! Something went wrong.')
                setStatus({
                    ...status,
                    getUser: "error"
                })
            }
        }
        catch {
            toast.error('Error! Something went wrong.')
            setStatus({
                ...status,
                getUser: "error"
            })
        }
        setStatus({
            ...status,
            getUser: "done"
        })
    }

    async function addCodeforcesHandle(e: any) {
        e.preventDefault()
        setStatus({
            ...status,
            codeforces: "verification"
        })
    }

    async function updateCodeforcesID(id) {
        const { data, error } = await supabase
            .from('users')
            .update({ codeforces_id: inputCodeforcesId })
            .eq('user_email', user?.email)
            .select()

        if (error) {
            toast.error("Failed to update codeforces id")
            console.log(error);
            return false
        }
        else {
            setCodeforcesId(id)
            return true
        }
    }

    async function verifyCodeforces(e: any) {
        e.preventDefault()
        setStatus({
            ...status,
            checkVerification: "loading"
        })
        try {
            const response = await fetch(`https://codeforces.com/api/user.status?handle=${inputCodeforcesId}&from=1&count=1`);
            if (!response.ok) {
                toast.error("Codeforces API is not responding")
                return;
            }
            const data = await response.json();
            console.log(data);
            let ok = false;
            if (data?.result) {
                for (let i = 0; i < data?.result?.length; i++) {
                    if (data?.result[i]?.problem?.contestId == 108 &&
                        data?.result[i]?.problem?.name == "Palindromic Times"
                        && data?.result[i]?.verdict == "COMPILATION_ERROR") {
                        ok = true
                        break;
                    }
                }
            }
            if (ok) {
                toast.success(`Codeforces Profile Connected - ${inputCodeforcesId}`)
                updateCodeforcesID(inputCodeforcesId)
                setTimeout(() => {
                    location.reload()
                }, 2000);
            }
            else {
                toast.error("Submission not found for given problem!")
                setStatus({
                    ...status,
                    checkVerification: "pending"
                })
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            toast.error("Codeforces API is not responding")
            setStatus({
                ...status,
                checkVerification: "pending"
            })
        }
    }

    async function initialiseUser(email) {
        let { data: users, error } = await supabase
            .from('users')
            .select('codeforces_id')
            .eq('user_email', email)

        if (error) {
            console.log(error);
        }
        else {
            if (users && users?.length == 0) {
                const { data, error } = await supabase
                    .from('users')
                    .insert([
                        { 'user_email': email },
                    ])
                    .select()
                if (error) {
                    console.log(error);
                }

            }
            else if (users && users?.length >= 0 && users[0]?.codeforces_id?.length > 0) {
                setCodeforcesId(users[0]?.codeforces_id)
            }
        }
    }

    useEffect(() => {
        checkUser()
    }, [])
    
    return (
        <div>
            {
                status.getUser == "error" &&
                <ErrorBanner />
            }
            {
                status.getUser == "loading" ?
                    <Loading title={"Loading Profile Data"} />
                    :
                    <div className="container min-h-screen w-full transform  duration-200 easy-in-out">
                        <div className="h-32 overflow-hidden" >
                            <img className="w-full" src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="bg-image" />
                        </div>
                        <div className="flex justify-center px-5  -mt-12">
                            <Dialog>
                                <DialogTrigger><img className="h-32 w-32 bg-white p-2 rounded-full" src={user?.avatar_url} alt="profile-pic" /></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{user?.full_name}&apos;s Profile Picture</DialogTitle>
                                        <DialogDescription>
                                            This picture is taken from your linked google account. For now, we are not providing any option to edit profile picture.
                                            <div className="flex w-full h-full items-center justify-center mt-2 ">
                                                <img className="w-48 h-48 bg-white p-2 rounded-lg" src={user?.avatar_url} alt="profile-pic" />
                                            </div>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="text-center">
                            <h2 className="text-gray-800 text-3xl font-bold">{user?.full_name}</h2>
                            <a className="text-gray-400 mt-2 hover:text-blue-500">{user?.email}</a>
                            <p className="mt-2 text-gray-500 text-sm">
                                Hey {user?.full_name}, Welcome to coding75. Explore amazing coding resources, opportunities, projects and more..
                            </p>
                        </div>
                        <div className="mt-5 mb-5 flex justify-center items-center">
                            <div className="md:flex w-full justify-center items-center md:space-x-10">
                                <img
                                    className="h-5"
                                    src="data:image/png;base64,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"
                                    alt="codeforces"
                                />
                                <div className="w-full items-center md:w-56 mt-3 md:mt-0">
                                    {
                                        status.codeforces == "loading" ?
                                            <div className="flex items-center space-x-2 text-sm"><RotateCw className="animate-spin h-3 w-3" /><p>Checking Codeforces Id</p></div>
                                            :
                                            <>
                                                {
                                                    codeforcesId == null ?
                                                        <div>
                                                            <form onSubmit={addCodeforcesHandle}>
                                                                <div>
                                                                    <Label>Link your Codeforces ID</Label>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Input
                                                                            required
                                                                            onChange={(e) => {
                                                                                setInputCodeforcesId(e.target.value)
                                                                            }}
                                                                            className="w-full "
                                                                            placeholder="Enter your Codeforces ID"
                                                                            name="codeforces"
                                                                            id="codeforces"
                                                                            type="text"
                                                                        />
                                                                        <button type="submit"><ArrowRightCircle className="h-5 w-5 text-blue-600" /></button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        :
                                                        <div>
                                                            <Label>Linked Codeforces ID</Label>
                                                            <div className="flex items-center space-x-2">
                                                                <p className="text-gray-700 tracking-tight font-semibold">{codeforcesId}</p>
                                                                <CheckCircle strokeWidth={3} className="h-3 w-3 text-green-600" />
                                                                <button onClick={(e) => {
                                                                    e.preventDefault()
                                                                    updateCodeforcesID(null)
                                                                    setCodeforcesId(null)
                                                                }} className="text-red-600 text-xs underline">unlink</button>
                                                            </div>
                                                        </div>
                                                }
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            status.checkVerification == "loading" &&
                            <div className="mt-3 flex justify-center items-center">
                                <RotateCw className="animate-spin h-4 w-4 mr-2" />
                                <p>Checking Status</p>
                            </div>
                        }
                        {
                            status.codeforces != "done" &&
                            <div className="mt-3 flex justify-center items-center">
                                <div className="max-w-screen-md">
                                    {
                                        status.codeforces == "verification" ?
                                            <Alert className="border border-primary-600 shadow-lg ">
                                                <LucideRocket className="h-4 w-4 text-primary-800" />
                                                <AlertTitle className="text-blue-800">Verify Your Codeforces Profile!</AlertTitle>
                                                <AlertDescription className="text-sm">
                                                    {
                                                        status.checkVerification == "done" ?
                                                            <div>
                                                                Codeforces Profile Verified and Linked with your coding75 account.
                                                            </div>
                                                            :
                                                            <div>
                                                                To verify that this <strong>({inputCodeforcesId})</strong> codeforces account is owned by you, please do a compilation error submission for the below given problem with your codeforces id.
                                                                <br />
                                                                → Blog Link: <a className="font-semibold underline tracking-tight" href={codeforces_problem} target="_blank">{codeforces_problem}</a>
                                                                <br />
                                                                → You can simply submit any invalid text, to make a compilation error submission 
                                                                <br />
                                                                Here is an example submission: <a className="font-semibold underline tracking-tight" href={"https://codeforces.com/contest/108/submission/254453403"} target="_blank">{"https://codeforces.com/contest/108/submission/254453403"}</a>
                                                                <div className="mt-5 border rounded-xl border-1 border-gray-400 p-2 tracking-tighter font-semibold">
                                                                    If submission is done,
                                                                    <button className="text-green-600 mx-1" onClick={verifyCodeforces}>click here</button>
                                                                    to check verification status.
                                                                </div>
                                                            </div>
                                                    }
                                                </AlertDescription>
                                            </Alert>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        }
                        <div className="flex mt-5 justify-center items-center">
                            <Link href="/resume">
                                <Button variant="outline" className="md:w-[400px] sm:w-full flex items-center"><ScrollText className="mr-2" /> Update Resume</Button></Link>
                        </div>
                        <Separator className="mt-10 mb-10" />
                        <SubscriptionDetailsPage/>
                        <div className="w-full">
                            <FeatureSection3 heading="" />
                        </div>
                    </div>
            }
        </div>
    );
}

export default Profile;