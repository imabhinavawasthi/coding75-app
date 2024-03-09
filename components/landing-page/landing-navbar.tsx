'use client';

import { Logo } from '@/app/(dashboard)/_components/components/logo';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookMarked, LogIn, LogOut, User } from 'lucide-react';
import supabase from '@/supabase';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

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

const LandingPageNavbar = () => {
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
            <div className="mt-2 relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="md:flex md:items-center md:gap-12">
                        <Logo />
                    </div>

                    <div className="hidden z-40 md:block">
                        <div className="lg:flex md:flex hidden justify-center items-center">
                            <NavigationMenu className='z-10 relative'>
                                <NavigationMenuList>
                                    <NavigationMenuItem >
                                        <NavigationMenuTrigger >Coding Resources</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                                <li className="row-span-3">
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                            href="/community"
                                                        >
                                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                                coding75 Pro Community 🚀
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
                                        <NavigationMenuTrigger>Interview Preparation</NavigationMenuTrigger>
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
                                        <NavigationMenuTrigger>DSA & CP</NavigationMenuTrigger>
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
                                        <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
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
        </div>
    );
}

export default LandingPageNavbar;

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