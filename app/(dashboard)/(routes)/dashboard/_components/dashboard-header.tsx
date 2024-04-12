"use client"

import supabase from "@/supabase";
import { BookText, Briefcase, Rocket } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface accouncementType {
    text: any;
    link: any;
    linkText: any;
}

export default function DashboardHeader() {
    const [user, setUser] = useState<any>(null)
    const [announcement, setAnnouncement] = useState<accouncementType>({
        text: "We would greatly appreciate it if you could take a moment to visit our site and share your valuable feedback with us here.",
        link: "https://forms.gle/S5KKUyrUqi1WzZCJ6",
        linkText: "Click Here"
    })
    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                if (data.user) {
                    setUser(data.user)
                    console.log(data.user);

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
    async function getAnnouncement() {
        try {
            let { data, error } = await supabase
                .from('constants')
                .select('id,announcement,announcement_link,announcement_link_text')

            if (error) {
                console.error('Error fetching data:', error);
            }
            else {
                setAnnouncement({
                    text: data?.[0]?.announcement,
                    link: data?.[0]?.announcement_link,
                    linkText: data?.[0]?.announcement_link_text
                })
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }
    useEffect(() => {
        checkUser()
        getAnnouncement()
    }, [])
    return (
        <header className="">
            {
                announcement.text &&
                <div id="sticky-banner" className="mb-5 flex justify-between w-full p-4 border border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <p className="flex items-center mx-auto text-sm font-normal text-gray-500 dark:text-gray-400">
                        <span className="inline-flex p-1 me-3 bg-gray-200 rounded-full dark:bg-gray-600 w-6 h-6 items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                                <path d="M15 1.943v12.114a1 1 0 0 1-1.581.814L8 11V5l5.419-3.871A1 1 0 0 1 15 1.943ZM7 4H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4ZM4 17v-5h1v5H4ZM16 5.183v5.634a2.984 2.984 0 0 0 0-5.634Z" />
                            </svg>
                            <span className="sr-only">Light bulb</span>
                        </span>
                        <span>{announcement.text} <a target="_blank" className="text-blue-600 underline" href={announcement.link}>{announcement.linkText}</a></span>
                    </p>
                </div>
            }
            <div className="bg-blue-50 mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {
                                user?.user_metadata?.full_name ?
                                    <>Welcome, {user?.user_metadata?.full_name}!</>
                                    : <>Welcome to coding75!</>
                            }
                        </h1>

                        <p className="mt-1.5 text-sm text-gray-500">Let&apos;s start today&apos;s learning, Happy Coding! 🚀</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                        <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                            <Link href="/pro" className=" w-full bg-white inline-flex items-center justify-center px-4 py-2 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                Coding75 Pro
                                <Rocket className="ml-2 -mr-1 w-5 h-5" />
                            </Link>
                        </div>

                        <Link
                            href="/opportunities"
                            className="text-center justify-center flex items-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring"
                        >
                            Find Internships
                            <Briefcase className="ml-2 -mr-1 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}