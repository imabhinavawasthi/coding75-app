'use client';

import { Logo } from '@/app/(dashboard)/_components/logo';
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
import { Briefcase, Code2, Computer, LogIn, Rocket, UserCheck, Users } from 'lucide-react';

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

    const NavMenuCSS = 'hover:text-white focus:bg-transparent focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white data-[state=open]:bg-transparent text-white bg-transparent hover:bg-transparent'

    return (
        <div>
            <section className="bg-gray-900 min-h-screen    bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div className="mt-2 z-20 relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="md:flex md:items-center md:gap-12">
                            <Logo white={true} />
                        </div>

                        <div className="hidden z-50 md:block">
                            <NavigationMenu className='z-10 relative'>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className={NavMenuCSS}>Getting started</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                                <li className="row-span-3">
                                                    <NavigationMenuLink asChild>
                                                        <a
                                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                            href="/"
                                                        >
                                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                                shadcn/ui
                                                            </div>
                                                            <p className="text-sm leading-tight text-muted-foreground">
                                                                Beautifully designed components built with Radix UI and
                                                                Tailwind CSS.
                                                            </p>
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                                <ListItem href="/docs" title="Introduction">
                                                    Re-usable components built using Radix UI and Tailwind CSS.
                                                </ListItem>
                                                <ListItem href="/docs/installation" title="Installation">
                                                    How to install dependencies and structure your app.
                                                </ListItem>
                                                <ListItem href="/docs/primitives/typography" title="Typography">
                                                    Styles for headings, paragraphs, lists...etc
                                                </ListItem>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className={NavMenuCSS}>Components</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {components.map((component) => (
                                                    <ListItem
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
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {components.map((component) => (
                                                    <ListItem
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
                                    className="flex justify-center items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow"
                                    href="/login"
                                >
                                    <LogIn className='h-4 w-4 mr-2'/> Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-8 px-8 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
                    <a href="#" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm rounded-full bg-blue-900 text-blue-300 hover:bg-blue-800">
                        <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">New</span> <span className="text-sm font-medium">Jumbotron component was launched! See what&apos;s new</span>
                        <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                    </a>
                    <h1 className="mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl text-white">Your College Coding Journey Just Got Easier</h1>
                    <p className="mb-10 text-lg font-normal lg:text-xl sm:px-16 lg:px-48 text-gray-200">Your gateway to coding mastery. We&apos;re here to empower students with all the essential resources they need to succeed in coding, from in-depth tutorials to real-world projects and more. 🚀</p>
                    <form className="w-full max-w-md mx-auto">
                        <label htmlFor="default-email" className="mb-2 text-sm font-medium sr-only text-white">Email sign-up</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 rtl:inset-x-0 start-0 flex items-center ps-3.5 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                                </svg>
                            </div>
                            <input type="email" id="default-email" className="block w-full p-4 ps-10 text-sm  border rounded-lg  bg-gray-800 border-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your email here..." required />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Sign up</button>
                        </div>
                    </form>
                    <div className='flex mt-10 justify-center items-center gap-x-20'>
                    <Link href="/dashboard" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-lg rounded-full bg-blue-900 text-blue-300 hover:bg-blue-800">
                        <span className="text-md bg-blue-600 rounded-full text-white px-4 py-1.5 me-3"><Rocket className='animate-bounce'/></span> <span className="text-lg text-white font-medium">Get Started</span>
                        <svg className="w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                    </Link>
                    </div>
                    <div className="mt-10 relative m-auto w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:content-['']">
                        <div className="animate-infinite-slider flex w-[calc(250px*20)]">
                            {LOGOS.map((logo, index) => (
                                <div
                                    className="slide mr-20 flex items-center justify-center"
                                    key={index}
                                >
                                    {logo}
                                </div>
                            ))}
                            {LOGOS.map((logo, index) => (
                                <div
                                    className="slide mr-20 flex items-center justify-center"
                                    key={index}
                                >
                                    {logo}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-b  to-transparent from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
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