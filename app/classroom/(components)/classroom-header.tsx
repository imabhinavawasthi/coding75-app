import { pro_feedback_form } from "@/components/social-links";
import supabase from "@/supabase";
import { MessageCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ClassroomHeader = () => {
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
        <div>
            <div className="shadow-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-blue-400 mb-2">
                    <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                        <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                    </svg>
                    Live Classes
                </span>
                <h1 className="text-gray-900 dark:text-white text-2xl font-extrabold mb-2">
                    {
                        user?.user_metadata?.full_name ?
                            <>Welcome to coding75 Pro 🚀, {user?.user_metadata?.full_name}!</>
                            : <>Welcome to coding75 Pro!</>
                    }
                </h1>
                <p className="md:text-lg text-md font-normal text-gray-500 dark:text-gray-400 mb-6">Attend live classes, Book 1:1 Mentorship and more with Pro!</p>
                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                        <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                            <Link href="/classroom/live" className=" w-full bg-white inline-flex items-center justify-center px-4 py-2 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                Live Classes
                                <Rocket className="ml-2 -mr-1 w-5 h-5" />
                            </Link>
                        </div>
                        <a
                            href={pro_feedback_form}
                            target="_blank"
                            className="text-center justify-center flex items-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring"
                        >
                            Feedback
                            <MessageCircle className="ml-2 -mr-1 w-5 h-5" />
                        </a>
                    </div>
            </div>
        </div>
    );
}

export default ClassroomHeader;