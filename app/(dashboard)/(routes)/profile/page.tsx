/* eslint-disable @next/next/no-img-element */
"use client";

import FeatureSection3 from "@/components/landing-page/feature-section-3";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import supabase from "@/supabase";
import { Rocket, ScrollText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Profile = () => {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [status, setStatus] = useState("loading")
    const [launchDate, setLaunchDate] = useState<any>()
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
    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                if (data.user) {
                    setUser(data?.user?.user_metadata)
                    console.log(data.user?.user_metadata);
                }
                else {
                    setUser(null)
                    router.push("/login")
                }
            }
            else {
                console.error(error);
                toast.error('Error! Something went wrong.')
            }
        }
        catch {
            toast.error('Error! Something went wrong.')
        }
        setStatus("done")
    }
    useEffect(() => {
        checkUser()
        getLaunchDate()
    }, [])
    return (
        <div>
            {
                status == "loading" ?
                    <Loading title={"Loading Profile Data"} />
                    :
                    <div className="container min-h-screen w-full transform   duration-200 easy-in-out">
                        <div className=" h-32 overflow-hidden" >
                            <img className="w-full" src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="bg-image" />
                        </div>
                        <div className="flex justify-center px-5  -mt-12">
                            <img className="h-32 w-32 bg-white p-2 rounded-full" src={user?.avatar_url} alt="profile-pic" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-gray-800 text-3xl font-bold">{user?.full_name}</h2>
                            <a className="text-gray-400 mt-2 hover:text-blue-500">{user?.email}</a>
                            <p className="mt-2 text-gray-500 text-sm">
                                Hey {user?.full_name}, Welcome to coding75. Explore amazing coding resources, opportunities, projects and more..
                            </p>
                        </div>
                        <div className="flex mt-5 justify-center items-center">
                            <Link href="/resume">
                            <Button variant="outline" className="md:w-[400px] sm:w-full flex items-center"><ScrollText className="mr-2" /> Update Resume</Button></Link>
                        </div>
                        <Separator className="mt-10"/>
                        <div className="md:flex mt-5 justify-center items-center">
                            <div>
                                <div className='mt-5 md:w-[400px] sm:w-full justify-center items-center hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                    <Link href="/pro#pricing" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                        <Rocket className="mr-2 -ml-1 w-5 h-5" />
                                        Subscribe to coding75 Pro
                                    </Link>
                                </div>
                                {
                                    launchDate &&
                                    <p className='text-center mt-4 font-semibold tracking-tight'>
                                        Next Batch Starting on &nbsp;
                                        <span className='text-blue-600 font-bold'>{launchDate}</span> -
                                        <span className='text-green-600 font-bold'>&nbsp;Beginner Friendly</span>
                                        .
                                    </p>
                                }
                            </div>
                        </div>

                        <div className="w-full">
                            <FeatureSection3 heading="" />
                        </div>
                    </div>
            }
        </div>
    );
}

export default Profile;