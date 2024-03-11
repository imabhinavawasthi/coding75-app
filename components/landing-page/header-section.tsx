'use client';

import Typewriter from 'typewriter-effect';
import { Logo } from '@/app/(dashboard)/_components/components/logo';
import CountUp from 'react-countup';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { BookMarked, GraduationCap, Layout, LogIn, LogOut, User } from 'lucide-react';
import supabase from '@/supabase';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const components: { title: string; href: string; description: string }[] = [
    {
      title: "CS Fundamentals",
      href: "/cs-fundamentals",
      description:
        "Operating Systems, Computer Networks, Database Management Systems, and Object-Oriented Programming Interview Specific Resources.",
    },
    {
      title: "Resume Builder",
      href: "/resume",
      description:
        "Create an ATS Friendly Latex Resume 🚀",
    },
    {
      title: "System Design",
      href: "/system-design",
      description:
        "Important System Design Topics for Interviews.",
    },
    {
      title: "Interview Preparation Guide",
      href: "/interview-preparation/guide",
      description: "Amazing Guide for Interview Preparation 🎯.",
    },
  ]
  
  const dsa: { title: string; href: string; description: string }[] = [
    {
      title: "Leetcode Daily Problem",
      href: "/dsa-cp/leetcode-potd",
      description:
        "In-depth LeetCode POTD editorials for efficient problem-solving.",
    },
    {
      title: "Codeforces Editorials",
      href: "/dsa-cp/codeforces",
      description:
        "In-depth Codeforces editorials for efficient problem-solving.",
    },
    {
      title: "CodeChef Editorials",
      href: "/dsa-cp/codechef",
      description:
        "In-depth Codechef editorials for efficient problem-solving.",
    },
    {
      title: "DSA Placement Sheet",
      href: "/dsa-cp/interview-sheet",
      description: "Amazing DSA Placement Sheet for Interview Preparation.",
    },
  ]
  
  const projects: { title: string; href: string; description: string }[] = [
    {
      title: "Basic Frontend Projects",
      href: "/projects/basicfrontend",
      description:
        "Frontend Projects for Beginners with HTML, CSS and Javascript.",
    },
    {
      title: "ReactJS Projects",
      href: "/projects/reactjs",
      description:
        "Build interactive and responsive user interfaces using the powerful React library.",
    },
    {
      title: "Next.js Projects",
      href: "/projects/nextjs",
      description:
        "Server-side rendering, code splitting, and simplified routing for efficient web applications.",
    },
    {
      title: "MERN Stack Projects",
      href: "/projects/mern",
      description: "Create dynamic full-stack web applications with MongoDB, Express, React, and Node.js.",
    },
    {
      title: "Flutter Projects",
      href: "/projects/flutter",
      description:
        "Craft beautiful and responsive cross-platform mobile applications with Flutter.",
    },
    {
      title: "Machine Learning Projects",
      href: "/projects/ml",
      description: "Explore real-world applications, diverse algorithms, and hands-on experiences to master the art of AI.",
    },
  ]


export default function HeaderSection() {
    const [user, setUser] = useState<any>(null)
    const [status, setStatus] = useState("loading")

    const NavMenuCSS = 'disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-transparent'

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
            <section className="bg-white dark:bg-gray-900">
                <div className="bg-gradient-to-b from-blue-100 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
                <div className="mt-2 relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="md:flex md:items-center md:gap-12">
                            <Logo />
                        </div>

                        <div className="hidden z-40 md:block">
                        <div className="lg:flex md:flex hidden justify-center items-center">
                            <NavigationMenu className='z-10 relative'>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className='bg-transparent'>Coding Resources</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                                <li className="row-span-3">
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                            href="/pro"
                                                        >
                                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                                coding75 Pro 🚀
                                                            </div>
                                                            <p className="text-sm leading-tight text-muted-foreground">
                                                                Learn from the Experts, Engage with Peers, Be a Pro! 🎯
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <ListItem description="Stay ahead in your coding career by exploring the vast array of opportunities." href="/opportunities" title="Internships 🎯" />
                                                <ListItem description="Explore a diverse range of projects that span various domains, including web development, mobile app creation, machine learning, and more." href="/projects" title="Projects 👨🏻‍💻" />
                                                <ListItem description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming resources, thoughtfully assembled to guide coding enthusiasts of varying skill levels through their learning journey." href="/dsa-cp" title="Data Structures & Algorithms 🚀" />
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className='bg-transparent'>Interview Preparation</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {components.map((component) => (
                                                    <ListItem
                                                        key={component.title}
                                                        title={component.title}
                                                        href={component.href}
                                                        description={component.description}
                                                    />
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem className="hidden lg:flex">
                                        <NavigationMenuTrigger className='bg-transparent'>DSA & CP</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {dsa.map((component) => (
                                                    <ListItem
                                                        key={component.title}
                                                        title={component.title}
                                                        href={component.href}
                                                        description={component.description}
                                                    />
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem className="hidden lg:flex">
                                        <NavigationMenuTrigger className='bg-transparent'>Projects</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {projects.map((component) => (
                                                    <ListItem
                                                        key={component.title}
                                                        title={component.title}
                                                        href={component.href}
                                                        description={component.description}
                                                    />
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        </div>

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
                                                                <Link href="/profile/certificates"><DropdownMenuItem className="cursor-pointer"><BookMarked className="w-4 h-4 mr-2" /> Certificates</DropdownMenuItem></Link>
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
                    <Link href="/community" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
                        <span className="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span> <span className="text-sm font-medium">1:1 Mentorship Community 🚀</span>
                        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                    </Link>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                        <Typewriter
                            options={{
                                strings: [
                                    '<strong>Amazing <span style="color: #27ae60;">Coding Resources</span>.</strong>',
                                    '<strong>Explore <span style="color: #27ae60;">Internships</span>.</strong>',
                                    '<strong>Practice <span style="color: #27ae60;">DSA and CP</span>.</strong>',
                                    '<strong>Learn <span style="color: #27ae60;">CS Fundamentals</span>.</strong>',
                                    '<strong>Get Prepared for <span style="color: #27ae60;">Interviews</span>.</strong>',
                                    '<strong>Explore & Develop <span style="color: #27ae60;">Projects</span>.</strong>',
                                    '<strong>Join <span style="color: #27ae60;">Exclusive Community</span>.</strong>'
                                ],
                                autoStart: true,
                                loop: true,
                                delay: 75,
                                deleteSpeed: 20
                            }}
                        />
                    </h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">We&apos;re here to empower students with all the essential resources they need to succeed in coding, from in-depth tutorials to real-world projects and more.</p>
                    <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Link href="/dashboard" className="shadow-2xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            <Layout className="mr-2 -ml-1 w-5 h-5" /> Dashboard
                            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                        </Link>
                        <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                            <Link href="/community" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                <GraduationCap className="mr-2 -ml-1 w-5 h-5" />
                                Mentorship
                            </Link>
                        </div>

                    </div>
                    <div>
                        <span className="font-semibold text-gray-400 uppercase mb-5">Stats that matter</span>
                        <dl className="mt-5 grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl md:text-4xl font-extrabold"><CountUp end={50000} />+</dt>
                                <dd className="font-light text-gray-500 dark:text-gray-400">Students</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl md:text-4xl font-extrabold"><CountUp end={100} />+</dt>
                                <dd className="font-light text-gray-500 dark:text-gray-400">Colleges</dd>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <dt className="mb-2 text-3xl md:text-4xl font-extrabold"><CountUp end={40000} />+</dt>
                                <dd className="font-light text-gray-500 dark:text-gray-400">Followers</dd>
                            </div>
                        </dl>
                    </div>
                </div>

            </section>
        </div>
    )
}


const ListItem = (({ title, href, description }) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {description}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  })