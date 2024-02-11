'use client';

import Typewriter from 'typewriter-effect';
import { Logo } from '@/app/(dashboard)/_components/logo';
import CountUp from 'react-countup';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Briefcase, Code2, Computer, GraduationCap, Layout, LayoutDashboard, LogIn, Rocket, UserCheck, Users } from 'lucide-react';
import { DashboardIcon } from '@radix-ui/react-icons';

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]


// https://codesandbox.io/p/sandbox/headless-ui-popover-with-hover-q558p?file=%2Fsrc%2FApp.js%3A42%2C26

const LOGOS = [
    <Link href="/projects" key="1">
        <Button className='bg-blue-900 flex text-lg'>
            <Code2 className='h-4 w-4 mr-2' /> Projects
        </Button>
    </Link>,
    <Link href="/opportunities" key="1">
        <Button className='bg-blue-900 flex text-lg'>
            <Briefcase className='h-4 w-4 mr-2' /> Opportunities
        </Button>
    </Link>,
    <Link href="/interview-preparation" key="1">
        <Button className='bg-blue-900 flex text-lg'>
            <UserCheck className='h-4 w-4 mr-2' /> Interview Preperation
        </Button>
    </Link>,
    <Link href="/cs-fundamentals" key="1">
        <Button className='bg-blue-900 flex text-lg'>
            <Computer className='h-4 w-4 mr-2' /> CS Fundamentals
        </Button>
    </Link>,
    <Link href="/community" key="1">
        <Button className='bg-blue-900 flex text-lg'>
            <Users className='h-4 w-4 mr-2' /> Community
        </Button>
    </Link>,
    <Link href="/dsa-cp" key="1">
        <Button className='bg-blue-900 flex text-lg'>
            <Rocket className='h-4 w-4 mr-2' /> Data Structures & Algorithms
        </Button>
    </Link>,
];


export default function HeaderSection() {

    const NavMenuCSS = 'disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-transparent'

    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="bg-gradient-to-b from-blue-100 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
                <div className="mt-2 relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="md:flex md:items-center md:gap-12">
                            <Logo />
                        </div>

                        <div className="hidden z-50 md:block">
                            <NavigationMenu className='z-10 relative'>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className={NavMenuCSS}>Components</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="ul-no-list-style grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {components.map((component) => (
                                                    <ListItem
                                                        className='ol-no-list-style'
                                                        key={component.title}
                                                        title={component.title}
                                                        href={component.href}
                                                    >
                                                        {component.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className={NavMenuCSS}>Components</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="ul-no-list-style grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {components.map((component) => (
                                                    <ListItem
                                                        className='ol-no-list-style'
                                                        key={component.title}
                                                        title={component.title}
                                                        href={component.href}
                                                    >
                                                        {component.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">
                                <Link
                                    className="flex justify-center items-center rounded-md bg-primary-700 hover:bg-primary-800 px-5 py-2.5 text-sm font-medium text-white shadow"
                                    href="/login"
                                >
                                    <LogIn className='h-4 w-4 mr-2' /> Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-8 relative px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
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
                                deleteSpeed:20
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
                        <Link href="/community" className="bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            <GraduationCap className="mr-2 -ml-1 w-5 h-5" />
                            Mentorship
                        </Link>
                        </div>
                        
                    </div>
                    <div className="mb-5">
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


const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"