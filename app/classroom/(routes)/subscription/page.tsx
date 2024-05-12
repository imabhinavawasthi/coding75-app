"use client"

import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { useEffect, useState } from "react";
import { fetchSubscriptionDetails } from "../../(api)/fetchSubscriptionDetails";
import supabase from "@/supabase";
import TextBox from "../../(components)/text-box";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { GraduationCap, Rocket, RotateCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pro_feedback_form } from "@/components/social-links";

const SubscriptionDetailsPage = () => {

    const [subscription, setSubscription] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [status, setStatus] = useState("loading")
    const [launchDate, setLaunchDate] = useState<any>()
    const [subscriptionType, setSubscriptionType] = useState("Monthly")

    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                if (data.user) {
                    setUser(data.user)
                    fetchSubscription(data?.user?.email)
                }
                else {
                    setStatus("error")
                    setUser(null)
                }
            }
            else {
                setStatus("error")
            }
        }
        catch {
        }
    }

    async function fetchSubscription(user_email) {
        try {
            const data = await fetchSubscriptionDetails()
            for (let i = 1; i < data?.length; i++) {
                if (data?.[i]?.[2] == user_email) {
                    setSubscription(data[i])
                    if (data?.[i]?.[1] <= 1000) {
                        setSubscriptionType("Monthly (1 Month Access)")
                    }
                    else if (data?.[i]?.[1] <= 2400) {
                        setSubscriptionType("Quaterly (3 Months Access)")
                    }
                    else if (data?.[i]?.[1] <= 3500) {
                        setSubscriptionType("Semi Annually (6 Months Access)")
                    }
                    else {
                        setSubscriptionType("Yearly (1 Year Access)")
                    }
                    break;
                }
            }
            setStatus("done")
        }
        catch {
            setStatus("error")
        }
    }

    async function getLaunchDate() {
        try {
            let { data, error } = await supabase
                .from('constants')
                .select('launch_date')

            if (error) {
                console.error('Error fetching data:', error);
            }
            else {
                setLaunchDate(data?.[0]?.launch_date)
            }

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    useEffect(() => {
        checkUser()
        getLaunchDate()
    }, [])

    return (
        <div className="md:container px-3">
            <Card className="w-full overflow-y-scroll">
                <CardHeader>
                    <CardTitle>coding75 Pro Subscription Details</CardTitle>
                    <CardDescription>Track details and status of your coding75 Pro Subscription.</CardDescription>
                </CardHeader>
                <Separator className="mb-5" />
                <CardContent>
                    {
                        status == "done" &&
                        <>
                            <TextBox keytext={"Email"} value={user?.email} />
                            {
                                subscription ?
                                    <>
                                        <Alert className="mt-5">
                                            <GraduationCap className="h-4 w-4" />
                                            <AlertTitle>Great, You are subscribed to coding75 Pro!</AlertTitle>
                                            <AlertDescription>
                                                Access all the live classes and premium features on our classroom 🚀
                                                <Link className="ml-2 text-blue-600" href="/classroom">
                                                    Visit Classroom!
                                                </Link>
                                            </AlertDescription>
                                        </Alert>
                                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                            <TextBox keytext={"Name"} value={subscription?.[0]} />
                                            <TextBox keytext={"Contact No."} value={subscription?.[3]} />
                                            <TextBox keytext={"Date of Purchase"} value={subscription?.[5]?.slice(0, 10)} />
                                            <TextBox keytext={"Plan Details"} value={
                                                subscriptionType
                                            } />
                                        </div>
                                        <div className="mt-5">
                                            <a href={pro_feedback_form} target="_blank">
                                                <Button variant={"outline"}>
                                                    Fill feedback form
                                                </Button>
                                            </a>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Alert className="mt-5">
                                            <GraduationCap className="h-4 w-4" />
                                            <AlertTitle>You are not subscribed to coding75 Pro!</AlertTitle>
                                            <AlertDescription>
                                                Subscribe to coding75 Pro to access all live classes and premium features 🚀
                                                <Link className="ml-2 text-blue-600" href="/pro#pricing">
                                                    Subscribe Now!
                                                </Link>
                                            </AlertDescription>
                                        </Alert>
                                        <div className="md:flex mt-5 justify-center items-center">
                                            <div>
                                                <div className='mt-5 md:w-[400px] sm:w-full justify-center items-center hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                                    <Link href="/pro#pricing" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                                        <Rocket className="mr-2 -ml-1 w-5 h-5" />
                                                        Subscribe to coding75 Pro
                                                    </Link>
                                                </div>
                                                {
                                                    // launchDate &&
                                                    <p className='text-center mt-4 font-semibold tracking-tight'>
                                                        All the classes are Beginner Friendly&nbsp;
                                                        {/* <span className='text-blue-600 font-bold'>{launchDate}</span> - */}
                                                        <span className='text-green-600 font-bold'>&nbsp;Join Now!</span>
                                                        .
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    </>
                            }
                        </>
                    }
                    {
                        status == "error" &&
                        <ErrorBanner />
                    }
                    {
                        status == "loading" &&
                        <div className="flex justify-center items-center mt-10">
                            <RotateCw className="animate-spin h-4 w-4 mr-2" /> Loading Subscription Details
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default SubscriptionDetailsPage;