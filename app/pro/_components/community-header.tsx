'use client';

import { Logo } from '@/app/(dashboard)/_components/components/logo';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookMarked, Flame, GraduationCap, Lightbulb, LogIn, LogOut, User } from 'lucide-react';
import supabase from '@/supabase';
import { toast } from 'sonner';
import { Skeleton } from '../../../components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import FancyTestimonialSliderPage from './testimonials-page';

export default function CommunityHeader() {
    const [user, setUser] = useState<any>(null)
    const [status, setStatus] = useState("loading")

    const NavMenuCSS = 'bg-transparent hover:bg-transparent'

    async function handleLogOut(e: any) {
        e.preventDefault()
        try {
            let { error } = await supabase.auth.signOut()
            if (error) {
                toast.error('Error! Something went wrong.')
            }
            else {
                checkUser()
                toast.error('You are Logged Out!')
            }
        }
        catch {
            toast.error('Error! Something went wrong.')
        }
    }

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
    }, [])

    return (
        <div>

            <section className="scroll-smooth dark:bg-gray-900">
                <div className="bg-gradient-to-b from-blue-100 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
                <div className="mt-2 relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/">
                            <div className="md:flex md:items-center md:gap-12">
                                <Logo />
                            </div>
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">

                                {
                                    status == "loading" ?
                                        <>
                                            <Skeleton className='h-12 w-12 rounded-full' />
                                        </>
                                        :
                                        <>
                                            {
                                                user == null ?
                                                    <>
                                                        <Link
                                                            className="flex justify-center items-center rounded-md bg-primary-700 hover:bg-primary-800 px-5 py-2.5 text-sm font-medium text-white shadow"
                                                            href="/login"
                                                        >
                                                            <LogIn className='h-4 w-4 mr-2' /> Login
                                                        </Link>
                                                    </>
                                                    :
                                                    <>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Avatar>
                                                                    <AvatarImage src={user?.["user_metadata"]["picture"]} />
                                                                    <AvatarFallback><User /></AvatarFallback>
                                                                </Avatar>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                            >
                                                                {/* <DropdownMenuLabel className="font-semibold"><Badge variant="basic" className="px-2 py-1">Hello, {user?.["user_metadata"]["full_name"]} 👋🏻</Badge></DropdownMenuLabel> */}
                                                                {/* <DropdownMenuSeparator /> */}
                                                                <Link href="/profile"><DropdownMenuItem className="cursor-pointer"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem></Link>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer text-red-600"><LogOut className="w-4 h-4 mr-2" /> Logout</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-16 relative px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
                    <div className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
                        <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">Recently Added</span> <span className="text-sm font-medium">1:1 Mock Interviews</span>
                        <Flame className='h-4 w-4 ml-3' />
                    </div>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        <strong><span className='text-transparent bg-clip-text hover:animate-background bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 transition hover:bg-[length:400%_400%] hover:[animation-duration:_4s] hover:cursor-pointer'>Coding75 Pro   </span>  🚀.</strong>
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Learn from the <strong>Experts</strong>, Engage with <strong>Peers</strong>, Be a <strong>Pro</strong>!</p>
                    <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <a href="#features" className="shadow-2xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            <Lightbulb className="mr-2 -ml-1 w-5 h-5" /> Why coding75?
                        </a>
                        <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                            <Link href="#pricing" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                <GraduationCap className="mr-2 -ml-1 w-5 h-5" />
                                Join Now
                            </Link>
                        </div>
                    </div>
                    <div className='lg:mb-20 md:mb-20 mb-5'>
                        <span className="font-semibold text-gray-400 uppercase mb-5">Words that matter</span>
                        <FancyTestimonialSliderPage />
                    </div>
                    <div>
                        <div className="lg:mt-0 mt-10 flex justify-center items-center lg:col-span-6">
                            <div className="w-[calc(90%)] aspect-video hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] z-40">
                                {/* <iframe
                                    className="w-full h-full rounded-xl p-1"
                                    src="https://www.youtube.com/embed/q9oxkhweXY4?si=zqQDV5F_tK2kCP-E"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen>
                                </iframe> */}
                            <img
                            className="cursor-pointer w-full h-full rounded-xl p-1"
                                src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/coding75-pro.png"
                                alt="coding75-pro" />
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}


