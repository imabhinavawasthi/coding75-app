'use client';

import { Logo } from '@/app/(dashboard)/_components/components/logo';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BadgePercent, BookMarked, BookText, Flame, GraduationCap, Lightbulb, ListVideo, LogIn, LogOut, MessageCircle, Route, User, Users } from 'lucide-react';
import supabase from '@/supabase';
import { toast } from 'sonner';
import { Skeleton } from '../../../components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import FancyTestimonialSliderPage from './testimonials-page';
import coding75ProLiveImage from "../../../public/images/coding75-pro-live.png"
import Image from 'next/image';
import { pro_curriculum_pdf_link, pro_details_video, pro_discussion_group, pro_updates_group, whatsapp_link } from '@/components/social-links';
import { Badge } from '@/components/ui/badge';
import ProButtonCard from './button-card';

export default function CommunityHeader() {
    const [user, setUser] = useState<any>(null)
    const [status, setStatus] = useState("loading")
    const [launchDate, setLaunchDate] = useState<any>()
    const [surveyFilled, setSurveyFilled] = useState(false)
    const [courseInterest, setCourseInterest] = useState<any>({
        yes: 0,
        no: 0
    })
    const [DBID, setDBID] = useState<any>()
    async function getLaunchDate() {
        try {
            let { data, error } = await supabase
                .from('constants')
                .select('id,launch_date,course_interest,course_not_interested')

            if (error) {
                console.error('Error fetching data:', error);
            }
            else {
                setLaunchDate(data?.[0]?.launch_date)
                setDBID(data?.[0]?.id)
                setCourseInterest({
                    yes: data?.[0]?.course_interest,
                    no: data?.[0]?.course_not_interested,
                })
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

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
        getLaunchDate()
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
                        <a href={whatsapp_link} target='_blank'><span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">Have Queries?</span> <span className="text-sm font-medium">Contact WhatsApp Support </span></a>
                        <MessageCircle className='h-4 w-4 ml-3' />
                    </div>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        <strong><span className='text-transparent bg-clip-text hover:animate-background bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 transition hover:bg-[length:400%_400%] hover:[animation-duration:_4s] hover:cursor-pointer'>Coding75 Pro Bootcamp</span>  🚀.</strong>
                    </h1>
                    <p className="mb-4 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                        Complete Interview Preparation Bootcamp 🎯
                    </p>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Join for <strong>1:1 Mentorship</strong>, Live <strong>DSA & CP</strong>, Mock <strong>Interviews</strong>, Live <strong>Project Building</strong>, and CS <strong>Fundamentals</strong>!</p>
                    <div className="flex flex-col mb-4 lg:mb-8 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Link href="/classroom" className="shadow-2xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            <ListVideo className="mr-2 -ml-1 w-5 h-5" /> Visit Classroom
                        </Link>
                        <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                            <Link href="#pricing" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                <GraduationCap className="mr-2 -ml-1 w-5 h-5" />
                                Join Now @ ₹499 Only
                            </Link>
                        </div>
                    </div>
                    <div className='mb-2 mt-8'><Badge className='bg-amber-100 text-amber-700 rounded-sm text-center'>Get all the details about coding75 Pro here 👇🏻</Badge></div>
                    <div className="flex flex-col mb-4 lg:mb-8 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Link href={"/pro/details"} className="shadow-2xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            <BookText className="mr-2 -ml-1 w-5 h-5" />
                            Read Curriculum and Details of coding75 Pro Batch
                        </Link>
                        <Link href={"/pro/schedule"} className="shadow-2xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            <Route className="mr-2 -ml-1 w-5 h-5" />
                            Check Complete Weekly Schedule
                        </Link>
                    </div>
                    <p className='mt-4 mb-4 font-semibold tracking-tight'>
                        Beginner Friendly batches are running &nbsp;
                        <span className='text-blue-600 font-bold'>Live Class Recording and 1:1 Sessions Available </span> - &nbsp;
                        <span className='text-green-600 font-bold'>Join Now</span>
                        .
                    </p>
                    {/* {
                        launchDate &&
                        <p className='mt-4 mb-4 font-semibold tracking-tight'>
                            Next Batch Starting on &nbsp;
                            <span className='text-blue-600 font-bold'>{launchDate}</span> - &nbsp;
                            <span className='text-green-600 font-bold'>Beginner Friendly</span>
                            .
                        </p>
                    } */}
                    <div className='mt-3 grid md:grid-cols-4 grid-cols-2 gap-x-5 gap-y-2'>
                        <ProButtonCard text="✅ 1:1 Mentorship Sessions" />
                        <ProButtonCard text="✅ 1:1 Mock Interviews" />
                        <ProButtonCard text="✅ 1:1 Resume Review" />
                        <ProButtonCard text="✅ Live DSA Classes" />
                        <ProButtonCard text="✅ Live CP Contest Discussions" />
                        <ProButtonCard text="✅ Live Project Building Classes" />
                        <ProButtonCard text="✅ CS Fundamental Classes" />
                        <ProButtonCard text="✅ Class Recording Available" />
                        <ProButtonCard text="✅ Beginner Friendly" />
                        <ProButtonCard text="✅ Interview Preparation" />
                        <ProButtonCard text="✅ Doubt Support" />
                        <ProButtonCard text="✅ Pocket Friendly Only @ ₹499" />
                    </div>
                    <div className='mb-2 mt-8'><Badge className='bg-amber-100 text-amber-700 rounded-sm text-center'>Still have queires? Contact us 👇🏻</Badge></div>
                    <div className='flex items-center justify-center'>
                        <a className="md:mb-5 flex items-center" target="_blank" href={whatsapp_link}>
                            <span className="ml-2 hover:underline flex text-2xl items-center font-semibold">
                                Contact
                                <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
                                </svg>
                                Support
                            </span>
                        </a>
                    </div>
                    <div className='mb-8 mt-10 md:mt-0 md:flex items-center justify-center '>
                        <a className="flex justify-center items-center" target="_blank" href={pro_updates_group}>
                            <span className="ml-2 hover:underline flex items-center font-semibold">
                                Join coding75 Pro Updates
                                <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
                                </svg>
                                Group
                            </span>
                        </a>
                        <Users className='hidden md:block h-4 w-4 mx-3' />
                        <a className="md:mt-0 mt-3 flex justify-center items-center" target="_blank" href={pro_discussion_group}>
                            <span className="ml-2 hover:underline flex items-center font-semibold">
                                Join coding75 Pro Discussion
                                <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
                                </svg>
                                Group
                            </span>
                        </a>
                    </div>
                    <div className="lg:mt-0 mt-10 md:mb-10 mb-5 flex justify-center items-center lg:col-span-6">
                        <div className="w-[calc(90%)] aspect-video hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] z-40">
                            <iframe
                                className="w-full h-full rounded-xl p-1"
                                src={pro_details_video}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            >
                            </iframe>
                            {/* <Image
                                    className="cursor-pointer w-full h-full rounded-xl p-1"
                                    src={coding75ProLiveImage}
                                    alt="coding75-pro" /> */}
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-400 uppercase mb-5">Words that matter</span>
                        <FancyTestimonialSliderPage />
                    </div>
                </div>

            </section>
        </div>
    )
}


