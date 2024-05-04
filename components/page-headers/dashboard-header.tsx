import supabase from "@/supabase";
import { Briefcase, MessageCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { feedback_form } from "../social-links";

const DashboardHeader = ({ }) => {
    const [user, setUser] = useState<any>(null)
    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                if (data.user) {
                    setUser(data.user)
                }
                else {
                    setUser(null)
                }
            }
            else {
            }
        }
        catch {
        }
    }
    useEffect(() => {
        checkUser()
    }, [])
    return (
        <header className="">
            <div className="bg-blue-50 mx-auto max-w-screen-xl p-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {
                                user?.user_metadata?.full_name ?
                                    <>Welcome, {user?.user_metadata?.full_name}!</>
                                    : <>Welcome to coding75 Pro!</>
                            }
                        </h1>
                        <p className="mt-1.5 text-sm text-gray-500">Let&apos;s start today&apos;s learning, Happy Coding! 🚀</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                        <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                            <Link href="/classroom/live" className=" w-full bg-white inline-flex items-center justify-center px-4 py-2 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                Live Classes
                                <Rocket className="ml-2 -mr-1 w-5 h-5" />
                            </Link>
                        </div>
                        <a
                            href={feedback_form}
                            target="_blank"
                            className="text-center justify-center flex items-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring"
                        >
                            Feedback
                            <MessageCircle className="ml-2 -mr-1 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;